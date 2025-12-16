<script lang="ts">
  import AppMenu from './AppMenu.svelte';
  import MaskProperties from './MaskProperties.svelte';
  import AnimationControls from './AnimationControls.svelte';
  import MaskedImage from './MaskedImage.svelte';
  
  let maskedImage = $state<HTMLImageElement>();
</script>

<div class="flex flex-col h-screen">
  <AppMenu />
  
  <div class="flex flex-1 min-h-0">
    <div class="w-96 max-w-1/2 p-5 flex flex-col gap-4 overflow-y-auto bg-base-100 shrink-0">
      <MaskProperties bind:maskedImage />
    </div>
    
    <div class="flex-1 p-5 flex flex-col gap-4 bg-base-200 border-l border-base-300 min-w-0">
      <div>
        <MaskedImage bind:maskedImage />
      </div>
      {#if maskedImage}
        <div class="max-h-[50vh] shrink-0">
          <AnimationControls {maskedImage} />
        </div>
      {/if}
    </div>
  </div>
</div>
