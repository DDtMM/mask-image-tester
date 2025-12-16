<script lang="ts">
  import gsap from 'gsap';
  import { untrack } from 'svelte';
  import type { AnimationStep } from './examples';
  import { appStore } from './store.svelte';
  
  let { maskedImage }: { 
    maskedImage: HTMLImageElement; 
  } = $props();
  
  let steps = $state<AnimationStep[]>([
    { easing: 'power1.out', duration: 2, variables: [] }
  ]);

  let currentAnimation = $state<gsap.core.Tween | gsap.core.Timeline | undefined>(undefined);
  let isLooped = $state(false);
  let isYoyo = $state(false);

  
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

  // Restart animation when loop or yoyo changes
  $effect(() => {
    isLooped;
    isYoyo;
    untrack(() => {
     if (currentAnimation) {
        playAnimation(isLooped);
      }
    });
  });
  
  function addStep() {
    const lastStep = steps[steps.length - 1];
    steps = [...steps, { easing: lastStep.easing, duration: lastStep.duration, variables: [] }];
  }
  
  function removeStepAtIndex(index: number) {
    if (steps.length > 1) {
      steps = steps.filter((_, i) => i !== index);
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
      yoyo: loop && isYoyo,
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


<div class="flex flex-col min-h-0 h-full gap-3">
  <div class="flex flex-row flex-wrap">
    <h3 class="text-lg shrink-0">🎬 GSAP Animation</h3>
    <div class="ml-auto">
      <button onclick={addStep} class="btn btn-xs btn-ghost">+ Add Step</button>
    </div>
  </div>
  <div class="flex-1 overflow-y-auto border border-base-content/20 min-h-0 space-y-2">
    {#each steps as step, i}
      <div class="step-item m-2 p-2 bg-base-100 rounded-box">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-bold">Step {i + 1}</div>
          <button onclick={() => removeStepAtIndex(i)} title="Remove Step {i + 1}" class="btn btn-xs btn-ghost btn-square" disabled={steps.length === 1}>✕</button>
        </div>
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

  <div class="flex flex-row flex-wrap gap-2 shrink-0">
    <button onclick={() => playAnimation(isLooped)} class="btn btn-sm">▶️ Play</button>
    <button onclick={stopAnimation} class="btn btn-sm" disabled={!currentAnimation}>⏹️ Stop</button>
    <button onclick={resetToInitial} class="btn btn-sm">🔄 Reset</button>
  </div>

  <div class="flex flex-row flex-wrap gap-4 shrink-0 ml-1">
    <div class="form-control shrink-0">
      <label class="label cursor-pointer justify-start gap-2">
        <input type="checkbox" bind:checked={isLooped} class="checkbox checkbox-xs" />
        <span class="label-text text-xs">Loop</span>
      </label>
    </div>

    <div class="form-control shrink-0">
      <label class="label cursor-pointer justify-start gap-2">
        <input type="checkbox" bind:checked={isYoyo} disabled={!isLooped} class="checkbox checkbox-xs" />
        <span class="label-text text-xs">Yo-yo</span>
      </label>
    </div>
  </div>
</div>

