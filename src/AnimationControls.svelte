<script lang="ts">
  import gsap from 'gsap';
  import type { AnimationStep } from './examples';
  import { appStore } from './store.svelte';
    import { untrack } from 'svelte';
  
  let { maskedImage }: { 
    maskedImage: HTMLImageElement; 
  } = $props();
  
  let steps = $state<AnimationStep[]>([
    { easing: 'power1.out', duration: 2, variables: [] }
  ]);
  let yoyo = $state(true);
  let currentAnimation = $state<gsap.core.Tween | gsap.core.Timeline | undefined>(undefined);
  
  const easingOptions = [
    'none', 'power1.in', 'power1.out', 'power1.inOut',
    'power2.in', 'power2.out', 'power2.inOut',
    'power3.in', 'power3.out', 'power3.inOut',
    'power4.in', 'power4.out', 'power4.inOut',
    'back.in', 'back.out', 'back.inOut',
    'elastic.in', 'elastic.out', 'elastic.inOut',
    'bounce.in', 'bounce.out', 'bounce.inOut',
    'circ.in', 'circ.out', 'circ.inOut',
    'expo.in', 'expo.out', 'expo.inOut',
    'sine.in', 'sine.out', 'sine.inOut'
  ];
  
  // Watch for example changes
  $effect(() => {
    const example = appStore.currentExample;
    
    if (example.animationSteps && example.animationSteps.length > 0) {
      // Use example's animation steps
      steps = example.animationSteps.map(step => ({ ...step }));
    } else {
      // Reset to empty step if no animation data
      steps = [{
        easing: 'power1.out',
        duration: 2,
        variables: []
      }];
    }
  });
  
  // Update store when steps change
  $effect(() => {
    untrack(() => appStore.setAnimationSteps(steps));
  });
  
  function addStep() {
    const lastStep = steps[steps.length - 1];
    steps = [...steps, { easing: lastStep.easing, duration: lastStep.duration, variables: [] }];
  }
  
  function removeStep() {
    if (steps.length > 1) {
      steps = steps.slice(0, -1);
    }
  }
  
  function addVariableToStep(stepIndex: number) {
    steps[stepIndex].variables = [...steps[stepIndex].variables, ''];
  }
  
  function removeVariableFromStep(stepIndex: number, varIndex: number) {
    steps[stepIndex].variables = steps[stepIndex].variables.filter((_, i) => i !== varIndex);
  }
  
  function playAnimation(loop: boolean) {
    stopAnimation();
    
    if (!appStore.maskSettings.variables || appStore.maskSettings.variables.length === 0) {
      alert('Please set CSS variables as starting values');
      return;
    }
    
    if (steps.length === 0) {
      alert('No animation steps defined');
      return;
    }
    
    // Parse start values
    const startVars: Record<string, string> = {};
    appStore.maskSettings.variables.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const match = trimmed.match(/^(--[\w-]+)\s*:\s*(.+?);?$/);
      if (match) {
        const [, varName, varValue] = match;
        startVars[varName] = varValue;
      }
    });
    
    // Set initial values immediately
    gsap.set(maskedImage, startVars);
    
    // Create timeline
    const timeline = gsap.timeline({
      repeat: loop ? -1 : 0,
      yoyo: loop && yoyo,
      onUpdate: () => {
        // Force re-render of mask with updated variables
        if (maskedImage) {
          const style = maskedImage.style;
          if (style.maskImage) {
            const temp = style.maskImage;
            style.maskImage = '';
            style.maskImage = temp;
          }
        }
      },
      onComplete: () => {
        if (!loop) {
          currentAnimation = undefined;
        }
      }
    });
    
    // Add each step to the timeline
    steps.forEach((step) => {
      if (!step.variables || step.variables.length === 0) {
        return;
      }
      
      // Parse end values for this step
      const endVars: Record<string, string> = {};
      step.variables.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const match = trimmed.match(/^(--[\w-]+)\s*:\s*(.+?);?$/);
        if (match) {
          const [, varName, varValue] = match;
          endVars[varName] = varValue;
        }
      });
      
      if (Object.keys(endVars).length === 0) {
        return;
      }
      
      // Add to timeline
      timeline.to(maskedImage, {
        duration: step.duration,
        ease: step.easing,
        ...endVars
      });
    });
    
    currentAnimation = timeline;
  }
  
  function stopAnimation() {
    if (currentAnimation) {
      currentAnimation.kill();
      currentAnimation = undefined;
    }
  }
  
  function resetToInitial() {
    stopAnimation();
    
    if (!appStore.maskSettings.variables || appStore.maskSettings.variables.length === 0) return;
    
    const startVars: Record<string, string> = {};
    appStore.maskSettings.variables.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const match = trimmed.match(/^(--[\w-]+)\s*:\s*(.+?);?$/);
      if (match) {
        const [, varName, varValue] = match;
        startVars[varName] = varValue;
      }
    });
    
    gsap.set(maskedImage, startVars);
    
    if (maskedImage) {
      const style = maskedImage.style;
      if (style.maskImage) {
        const temp = style.maskImage;
        style.maskImage = '';
        style.maskImage = temp;
      }
    }
  }
</script>

<div class="card bg-base-300 border border-base-content/10 h-full flex flex-col">
  <div class="card-body p-4 flex flex-col min-h-0">
    <h3 class="card-title text-lg shrink-0">🎬 GSAP Animation</h3>
    
    <div class="flex-1 overflow-y-auto mb-3 min-h-0">
      {#each steps as step, i}
        <div class="step-item mb-3 p-3 bg-base-100 rounded-box">
          <div class="text-xs font-bold mb-2">Step {i + 1}</div>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div class="form-control">
              <label class="label py-1" for="easing-{i}"><span class="label-text text-xs">Easing</span></label>
              <select id="easing-{i}" bind:value={step.easing} class="select select-bordered select-sm">
                {#each easingOptions as option}
                  <option value={option}>{option}</option>
                {/each}
              </select>
            </div>

            <div class="form-control">
              <label class="label py-1" for="duration-{i}"><span class="label-text text-xs">Duration (s)</span></label>
              <input id="duration-{i}" type="number" bind:value={step.duration} min="0.1" step="0.1" class="input input-bordered input-sm" />
            </div>
          </div>

          <div class="form-control">
            <div class="flex items-center justify-between mb-1">
              <span class="label-text text-xs">CSS Variables</span>
              <button onclick={() => addVariableToStep(i)} class="btn btn-xs btn-ghost">+ Add Variable</button>
            </div>
            {#each step.variables, varIndex}
              <div class="flex gap-2 mb-2">
                <input 
                  type="text" 
                  bind:value={step.variables[varIndex]} 
                  placeholder="--my-var: 100%;" 
                  class="input input-bordered input-sm flex-1 font-mono text-sm"
                />
                <button onclick={() => removeVariableFromStep(i, varIndex)} class="btn btn-sm btn-ghost btn-square">✕</button>
              </div>
            {/each}
            {#if step.variables.length === 0}
              <div class="text-xs text-base-content/50 italic">No variables defined</div>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <div class="form-control shrink-0">
      <label class="label cursor-pointer justify-start gap-2">
        <input type="checkbox" bind:checked={yoyo} class="checkbox checkbox-sm" />
        <span class="label-text">Yoyo (reverse on loop)</span>
      </label>
    </div>

    <div class="flex gap-2 shrink-0">
      <button onclick={() => playAnimation(false)} class="btn btn-primary btn-sm">▶️ Play</button>
      <button onclick={() => playAnimation(true)} class="btn btn-secondary btn-sm">🔁 Loop</button>
      <button onclick={stopAnimation} class="btn btn-error btn-sm">⏹️ Stop</button>
      <button onclick={resetToInitial} class="btn btn-outline btn-sm">🔄 Reset</button>
      <div class="flex-1"></div>
      <button onclick={addStep} class="btn btn-success btn-sm">➕</button>
      <button onclick={removeStep} class="btn btn-error btn-sm">➖</button>
    </div>
  </div>
</div>
