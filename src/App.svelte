<script lang="ts">
  import ExampleSelector from './ExampleSelector.svelte';
  import MaskProperties from './MaskProperties.svelte';
  import AnimationControls from './AnimationControls.svelte';
  import MaskedImage from './MaskedImage.svelte';
  import ExportSettings from './ExportSettings.svelte';
  import type { AnimationStep } from './examples';
  
  let maskedImage = $state<HTMLImageElement>();
  let variables = $state<string[]>([]);
  let maskImage = $state('');
  let maskSize = $state<string | undefined>(undefined);
  let maskPosition = $state<string | undefined>(undefined);
  let maskRepeat = $state<string | undefined>(undefined);
  let maskMode = $state<string | undefined>(undefined);
  let animationSteps = $state<AnimationStep[]>([]);
  
  function handleVariablesChange(event: CustomEvent<string[]>): void {
    variables = event.detail;
  }
  
  function handleMaskPropertiesChange(event: CustomEvent<any>): void {
    const props = event.detail;
    maskImage = props.maskImage;
    maskSize = props.maskSize;
    maskPosition = props.maskPosition;
    maskRepeat = props.maskRepeat;
    maskMode = props.maskMode;
  }
  
  function handleAnimationStepsChange(event: CustomEvent<AnimationStep[]>): void {
    animationSteps = event.detail;
  }

  function toggleCollapse(): void {
    const collapseElement = document.querySelector('.collapse');
    if (collapseElement) {
      collapseElement.classList.toggle('collapse-open');
    }
  }
</script>

<div class="flex h-screen ">
  <div class="w-96 max-w-96 p-5 flex flex-col gap-4 overflow-y-auto bg-base-100 shrink-0">
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl font-bold">
          <img src="/logo.webp" alt="Mask Tester Logo" class="inline-block w-8 h-8 mr-2 align-middle" />
          CSS Mask Tester
        </h1>
        <button class="btn btn-circle btn-ghost btn-xs" aria-label="Mask Image Info" onclick="{toggleCollapse}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </button>
      </div>
    </div>
    <div class="collapse bg-base-200 border-base-300 border shrink-0 -mx-3">
      <div class="collapse-content text-sm text-left">
        <p class="mb-2">
          The mask-image CSS property allows you to create complex visual effects by hiding portions of an element.
          Additional properties help control how the mask is applied:
        </p>
        <ul class="list-disc list-inside space-y-1">
          <li><code class="text-primary">mask-size</code> Controls the size of the mask layer</li>
          <li><code class="text-primary">mask-position</code> Positions the mask layer</li>
          <li><code class="text-primary">mask-repeat</code> Controls how the mask repeats</li>
          <li><code class="text-primary">mask-mode</code> Defines how the mask layer is interpreted</li>
        </ul>
      </div>
    </div>
    
    <ExampleSelector />
    
    <ExportSettings 
      {maskImage} 
      {maskSize} 
      {maskPosition} 
      {maskRepeat} 
      {maskMode} 
      {variables} 
      {animationSteps} 
    />
    
    <div class="divider my-2"></div>
    
    <MaskProperties bind:maskedImage onVariablesChange={handleVariablesChange} onMaskPropertiesChange={handleMaskPropertiesChange} />
  </div>
  
  <div class="flex-1 p-5 flex flex-col gap-4 bg-base-200 border-l border-base-300 h-screen min-w-0">
    <div>
      <MaskedImage bind:maskedImage />
    </div>
    {#if maskedImage}
      <div class="max-h-[50vh] shrink-0">
        <AnimationControls {maskedImage} {variables} onAnimationStepsChange={handleAnimationStepsChange} />
      </div>
    {/if}
  </div>
</div>
