<script lang="ts">
  import type { MaskExample } from './examples';
  
  interface Props {
    maskImage: string;
    maskSize?: string;
    maskPosition?: string;
    maskRepeat?: string;
    maskMode?: string;
    variables: string[];
    animationSteps: Array<{ easing: string; duration: number; variables: string[] }>;
  }
  
  let { 
    maskImage, 
    maskSize, 
    maskPosition, 
    maskRepeat, 
    maskMode, 
    variables, 
    animationSteps 
  }: Props = $props();
  
  let modalOpen = $state(false);
  let copied = $state(false);
  
  function openModal() {
    modalOpen = true;
    copied = false;
  }
  
  function closeModal() {
    modalOpen = false;
  }
  
  function getExportJson(): string {
    const exportData: Partial<MaskExample> = {
      name: "Custom Example",
      maskImage,
      maskSize,
      maskPosition,
      maskRepeat,
      maskMode
    };
    
    if (variables && variables.length > 0) {
      exportData.variables = variables;
    }
    
    if (animationSteps && animationSteps.length > 0 && animationSteps.some(s => s.variables.length > 0)) {
      exportData.animationSteps = animationSteps;
    }
    
    return JSON.stringify(exportData, null, 2);
  }
  
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(getExportJson());
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
</script>

<button onclick={openModal} class="btn btn-outline btn-sm w-full">
  📤 Export Settings
</button>

{#if modalOpen}
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">Export Settings as JSON</h3>
      <p class="text-sm mb-3 text-base-content/70">
        Copy this JSON to add to examples.json or use in your own project:
      </p>
      
      <div class="mockup-code text-xs max-h-96 overflow-auto relative">
        <pre><code>{getExportJson()}</code></pre>
      </div>
      
      <div class="modal-action">
        <button onclick={copyToClipboard} class="btn btn-primary btn-sm">
          {#if copied}
            ✓ Copied!
          {:else}
            📋 Copy to Clipboard
          {/if}
        </button>
        <button onclick={closeModal} class="btn btn-sm">Close</button>
      </div>
    </div>
    <div class="modal-backdrop" onclick={closeModal}></div>
  </div>
{/if}
