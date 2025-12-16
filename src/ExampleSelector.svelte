<script lang="ts">
  import { onMount } from 'svelte';
  import type { MaskSettings } from './examples';
  import { loadExamples } from './examples';
  import { appStore } from './store.svelte';
  
  let examples = $state<MaskSettings[]>([]);
  let selectedExample = $state('');
  
  onMount(async () => {
    examples = (await loadExamples()).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  });
  
  function handleExampleChange() {
    const example = examples.find(e => e.name === selectedExample);
    if (example) {
      appStore.setExample(example);
    }
  }
</script>

<div class="form-control flex flex-row grow gap-2">
  <label class="label hidden sm:flex" for="selectedExample">
    <span class="label-text font-semibold">Example</span>
  </label>
  <select id="selectedExample" bind:value={selectedExample} onchange={handleExampleChange} class="select select-bordered w-full">
    <option value="">-- Choose an example --</option>
    {#each examples as example}
      <option value={example.name}>{example.name}</option>
    {/each}
  </select>
</div>
