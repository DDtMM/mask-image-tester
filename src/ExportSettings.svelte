<script lang="ts">
  import type { MaskSettings } from './examples';
  import { appStore } from './store.svelte';
  
  let copied = $state(false);
  let exportType = $state<'json' | 'css'>('json');
  let modalOpen = $state(false);

  // Reset copied state when export type changes
  $effect(() => {
    exportType;
    copied = false;
  });
  
  function openModal() {
    modalOpen = true;
    copied = false;
  }
  
  function closeModal() {
    modalOpen = false;
  }
  
  function getExportJson(): string {
    const exportData: Partial<MaskSettings> = {
      name: "Custom Example",
      maskImage: appStore.maskSettings.maskImage,
      maskSize: appStore.maskSettings.maskSize,
      maskPosition: appStore.maskSettings.maskPosition,
      maskRepeat: appStore.maskSettings.maskRepeat,
      maskMode: appStore.maskSettings.maskMode
    };
    
    if (appStore.maskSettings.variables && appStore.maskSettings.variables.length > 0) {
      exportData.variables = appStore.maskSettings.variables;
    }
    
    if (appStore.maskSettings.animationSteps && appStore.maskSettings.animationSteps.length > 0 && 
        appStore.maskSettings.animationSteps.some(s => s.variables.length > 0)) {
      exportData.animationSteps = appStore.maskSettings.animationSteps;
    }
    
    return JSON.stringify(exportData, undefined, 2);
  }
  
  function getExportCss(): string {
    let css = '';
    
    // Add CSS variables
    if (appStore.maskSettings.variables && appStore.maskSettings.variables.length > 0) {
      css += '.masked-element {\n';
      appStore.maskSettings.variables.forEach(variable => {
        css += `  ${variable}\n`;
      });
      css += '}\n\n';
    }
    
    // Add mask properties
    css += '.masked-element {\n';
    appendCssProperty('mask-image', appStore.maskSettings.maskImage);
    appendCssProperty('mask-size', appStore.maskSettings.maskSize);
    appendCssProperty('mask-position', appStore.maskSettings.maskPosition);
    appendCssProperty('mask-repeat', appStore.maskSettings.maskRepeat);
    appendCssProperty('mask-mode', appStore.maskSettings.maskMode);
    css += '}';
    
    return css;

    function appendCssProperty(property: string, value: string | undefined) {
      if (value && value.trim() !== '') {
        css += `  ${property}: ${value.trim()};\n`;
      }
    }
  }
  
  function getExportContent(): string {
    return exportType === 'json' ? getExportJson() : getExportCss();
  }
  
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(getExportContent());
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
</script>

<button onclick={openModal} class="btn btn-outline btn-sm" title="Export Settings">
  📤 <span class="hidden sm:inline">Export</span>
</button>

{#if modalOpen}
  <div class="modal modal-open">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">Export Settings</h3>
      
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text">Export Format</span>
          <div class="join">
            <input 
              type="radio" 
              name="exportType" 
              class="join-item btn btn-sm" 
              aria-label="JSON" 
              bind:group={exportType} 
              value="json" 
            />
            <input 
              type="radio" 
              name="exportType" 
              class="join-item btn btn-sm" 
              aria-label="CSS" 
              bind:group={exportType} 
              value="css" 
            />
          </div>
        </label>
        
      </div>
      
      <p class="text-sm mb-3 text-base-content/70">
        {#if exportType === 'json'}
          Copy this JSON to add to examples.json or use in your own project:
        {:else}
          Copy this CSS to use directly in your stylesheet:
        {/if}
      </p>
      
      <div class="code text-xs max-h-96 overflow-auto relative bg-base-300 p-4 rounded-box mb-4">
        <pre><code>{getExportContent()}</code></pre>
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
    <div class="modal-backdrop" onclick={closeModal} role="button" tabindex="0"></div>
  </div>
{/if}
