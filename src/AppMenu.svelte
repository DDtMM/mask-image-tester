<script lang="ts">
  import ExampleSelector from './ExampleSelector.svelte';
  import ExportSettings from './ExportSettings.svelte';
  import InfoModal from './InfoModal.svelte';
</script>

<div class="navbar bg-base-100 border-b border-base-300 min-h-12 h-12 px-2 sm:px-4">
  <div class="flex-none">
    <div class="flex items-center gap-2">
      <img src="{import.meta.env.BASE_URL}logo.webp" alt="Mask Tester Logo" class="w-6 h-6 sm:w-8 sm:h-8" />
      <span class="text-sm sm:text-xl font-bold whitespace-nowrap">CSS Mask Tester</span>
    </div>
  </div>
  
  <div class="flex-1 flex justify-center px-2 sm:px-4">
    <div class="w-full max-w-xs sm:max-w-sm">
      <ExampleSelector /> 
    </div>
  </div>
  
  <div class="flex-none">
    <div class="flex items-center gap-1">
      <InfoModal />
      <ExportSettings />
    </div>
  </div>
</div>
