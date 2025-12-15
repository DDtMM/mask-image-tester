<script lang="ts">
  interface Props {
    maskedImage?: HTMLImageElement;
  }
  
  let { maskedImage = $bindable() }: Props = $props();
  
  let maskedImageUrl = $state('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&q=80');
  let showUnderlyingImage = $state(false);
  let underlyingImageUrl = $state('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80');
</script>

<div class="flex flex-col gap-4 h-full">
  <div class="form-control w-full">
    <label class="label py-1" for="maskedImageUrl">
      <span class="label-text text-sm">Masked image URL</span>
    </label>
    <input 
      id="maskedImageUrl"
      type="text" 
      placeholder="Enter image URL" 
      class="input input-bordered input-sm w-full"
      bind:value={maskedImageUrl}
    />
  </div>

  
  {#if showUnderlyingImage}
    <div class="form-control w-full">
      <label class="label py-1" for="underlyingImageUrl">
        <span class="label-text text-sm">Underlying image URL</span>
      </label>
      <input 
        id="underlyingImageUrl"
        type="text" 
        placeholder="Enter image URL" 
        class="input input-bordered input-sm w-full"
        bind:value={underlyingImageUrl}
      />
    </div>
  {/if}
    
  <div class="flex items-center gap-2">
    <label class="label cursor-pointer gap-2 py-1">
      <input 
        type="checkbox" 
        class="checkbox checkbox-primary" 
        bind:checked={showUnderlyingImage}
      />
      <span class="label-text text-sm">Show underlying image</span>
    </label>
  </div>

  <div class="flex-1 flex items-center justify-center min-h-400px overflow-hidden relative">
    {#if showUnderlyingImage}
      <img 
        src={underlyingImageUrl} 
        alt="This is revealed by the mask" 
        class="max-w-full max-h-500px w-auto h-auto absolute"
        style="z-index: 0;"
      />
    {/if}
    <img 
      bind:this={maskedImage} 
      src={maskedImageUrl} 
      alt="The target of masking" 
      class="max-w-full max-h-500px w-auto h-auto relative"
      style="z-index: 1;"
    />
  </div>
</div>
