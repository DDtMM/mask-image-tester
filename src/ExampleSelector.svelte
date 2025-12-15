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

<div class="form-control w-full">
  <label class="label" for="selectedExample">
    <span class="label-text font-semibold">Select Example</span>
  </label>
  <select id="selectedExample" bind:value={selectedExample} onchange={handleExampleChange} class="select select-bordered w-full">
    <option value="">-- Choose an example --</option>
    {#each examples as example}
      <option value={example.name}>{example.name}</option>
    {/each}
  </select>
</div>
