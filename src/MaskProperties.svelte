<script lang="ts">
  import { appStore } from './store.svelte';
  
  let { maskedImage = $bindable(), onVariablesChange, onMaskPropertiesChange }: { 
    maskedImage: HTMLImageElement | undefined;
    onVariablesChange?: (e: CustomEvent<string[]>) => void;
    onMaskPropertiesChange?: (e: CustomEvent<any>) => void;
  } = $props();
  
  const DEFAULT_MASK_IMAGE = 'linear-gradient(to bottom, black, transparent)';

  let maskImage = $state(DEFAULT_MASK_IMAGE);
  let maskSize = $state<string | undefined>(undefined);
  let maskPosition = $state<string | undefined>(undefined);
  let maskRepeat = $state<string | undefined>(undefined);
  let maskMode = $state<string | undefined>(undefined);
  let variables = $state<string[]>([]);
  let errorMessage = $state('');
  let showError = $state(false);
  
  // Watch for example changes
  $effect(() => {
    const example = appStore.currentExample;
    if (example) {
      maskImage = example.maskImage;
      maskSize = example.maskSize;
      maskPosition = example.maskPosition;
      maskRepeat = example.maskRepeat;
      maskMode = example.maskMode;
      variables = example.variables ? [...example.variables] : [];
    }
  });
  
  // Apply mask when properties change
  $effect(() => {
    if (maskedImage) {
      applyMask();
      onVariablesChange?.(new CustomEvent('variableschange', { detail: variables }));
      onMaskPropertiesChange?.(new CustomEvent('maskpropertieschange', { 
        detail: { maskImage, maskSize, maskPosition, maskRepeat, maskMode } 
      }));
    }
  });
  
  function applyMask() {
    if (!maskedImage) return;
    
    // Apply CSS variables
    if (variables && variables.length > 0) {
      variables.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const match = trimmed.match(/^(--[\w-]+)\s*:\s*(.+?);?$/);
        if (match) {
          const [, varName, varValue] = match;
          maskedImage.style.setProperty(varName, varValue);
        }
      });
    }
    
    // Clear previous mask properties
    maskedImage.style.maskImage = '';
    maskedImage.style.maskSize = '';
    maskedImage.style.maskPosition = '';
    maskedImage.style.maskRepeat = '';
    maskedImage.style.maskMode = '';
    
    // Apply new mask properties
    if (maskImage) {
      maskedImage.style.maskImage = maskImage;
    }
    if (maskSize) {
      maskedImage.style.maskSize = maskSize;
    }
    if (maskPosition) {
      maskedImage.style.maskPosition = maskPosition;
    }
    if (maskRepeat) {
      maskedImage.style.maskRepeat = maskRepeat;
    }
    if (maskMode) {
      maskedImage.style.maskMode = maskMode;
    }
    
    validateMask();
  }
  
  function validateMask() {
    requestAnimationFrame(() => {
      if (!maskedImage) return;
      
      const computedStyle = window.getComputedStyle(maskedImage);
      const appliedMask = computedStyle.maskImage;
      const appliedSize = computedStyle.maskSize;
      const appliedPosition = computedStyle.maskPosition;

      const errors: string[] = [];

      if (appliedMask === 'none' || appliedMask === '') {
        errors.push('mask-image: ' + diagnoseMaskImageError());
      }

      if (maskSize && (appliedSize === '' || appliedSize === 'auto')) {
        errors.push('mask-size: Invalid value. Expected format: "100px 200px", "cover", "contain", or comma-separated values for multiple layers.');
      }

      if (maskPosition && appliedPosition === '') {
        errors.push('mask-position: Invalid value. Expected format: "center", "top left", "50% 50%", or comma-separated values for multiple layers.');
      }

      if (errors.length > 0) {
        errorMessage = errors.join('\n\n');
        showError = true;
      } else {
        showError = false;
      }
    });
  }
  
  function diagnoseMaskImageError(): string {
    const errors: string[] = [];
    
    if (maskImage.match(/\b(top|bottom|left|right|center)\b/)) {
      errors.push('Position values detected in mask-image. Move position values to mask-position property.');
    }
    
    if (maskImage.match(/\b(repeat|no-repeat|space|round)\b/)) {
      errors.push('Repeat values detected in mask-image. Move repeat values to mask-repeat property.');
    }
    
    const gradientCount = (maskImage.match(/gradient/g) || []).length;
    if (gradientCount > 1) {
      const sizeCount = maskSize ? (maskSize.split(',').length) : 1;
      const posCount = maskPosition ? (maskPosition.split(',').length) : 1;
      
      if (sizeCount !== gradientCount) {
        errors.push(`Multiple gradients (${gradientCount}) require matching mask-size values (found ${sizeCount}). Separate with commas.`);
      }
      if (posCount !== gradientCount) {
        errors.push(`Multiple gradients (${gradientCount}) require matching mask-position values (found ${posCount}). Separate with commas.`);
      }
    }
    
    if (errors.length === 0) {
      errors.push('Invalid mask-image value. Check syntax for url() or gradient functions.');
    }
    
    return errors.join(' ');
  }
  
  function addVariable() {
    variables = [...variables, ''];
  }
  
  function removeVariable(index: number) {
    variables = variables.filter((_, i) => i !== index);
  }
</script>

<div class="space-y-4">
  <div class="form-control w-full">
    <label class="label" for="maskImage">
      <span class="label-text font-semibold">mask-image</span>
    </label>
    <textarea id="maskImage" bind:value={maskImage} class="textarea textarea-bordered font-mono text-sm h-24 w-full" placeholder="linear-gradient(...)"></textarea>
  </div>

  <div class="form-control w-full">
    <label class="label" for="maskSize">
      <span class="label-text font-semibold">mask-size</span>
    </label>
    <input type="text" id="maskSize" bind:value={maskSize} class="input input-bordered font-mono text-sm w-full" placeholder="100% 100%" />
  </div>

  <div class="form-control w-full">
    <label class="label" for="maskPosition">
      <span class="label-text font-semibold">mask-position</span>
    </label>
    <input type="text" id="maskPosition" bind:value={maskPosition} class="input input-bordered font-mono text-sm w-full" placeholder="center" />
  </div>

  <div class="form-control w-full">
    <label class="label" for="maskRepeat">
      <span class="label-text font-semibold">mask-repeat</span>
    </label>
    <select id="maskRepeat" bind:value={maskRepeat} class="select select-bordered w-full">
      <option value="no-repeat">no-repeat</option>
      <option value="repeat">repeat</option>
      <option value="repeat-x">repeat-x</option>
      <option value="repeat-y">repeat-y</option>
      <option value="space">space</option>
      <option value="round">round</option>
    </select>
  </div>

  <div class="form-control w-full">
    <label class="label" for="maskMode">
      <span class="label-text font-semibold">mask-mode</span>
    </label>
    <select id="maskMode" bind:value={maskMode} class="select select-bordered w-full">
      <option value="alpha">alpha</option>
      <option value="luminance">luminance</option>
      <option value="match-source">match-source</option>
    </select>
  </div>

  <div class="form-control w-full">
    <div class="flex items-center justify-between mb-1">
      <span class="label-text font-semibold">CSS Variables</span>
      <button onclick={addVariable} class="btn btn-xs btn-ghost">+ Add Variable</button>
    </div>
    {#each variables, index}
      <div class="flex gap-2 mb-2">
        <input 
          type="text" 
          bind:value={variables[index]} 
          placeholder="--my-var: 100%;" 
          class="input input-bordered input-sm flex-1 font-mono text-sm"
        />
        <button onclick={() => removeVariable(index)} class="btn btn-sm btn-ghost btn-square">✕</button>
      </div>
    {/each}
    {#if variables.length === 0}
      <div class="text-sm text-base-content/50 italic p-2">No variables defined. Click "+ Add Variable" to add one.</div>
    {/if}
  </div>

  {#if showError}
    <div class="alert alert-error text-sm sticky bottom-0 z-50">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <pre class="whitespace-pre-wrap text-left text-xs">{errorMessage}</pre>
    </div>
  {/if}
</div>
