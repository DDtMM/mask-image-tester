<script lang="ts">
  let dialog = $state<HTMLDialogElement>();

  function openModal() {
    dialog?.showModal();
  }

  function closeModal() {
    dialog?.close();
  }
</script>

<button class="btn btn-ghost btn-sm btn-circle" aria-label="Info" onclick={openModal}>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-5 h-5 stroke-current">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
</button>

<dialog bind:this={dialog} class="modal">
  <div class="modal-box max-w-2xl">
    <h3 class="font-bold text-lg mb-4">CSS Mask Tester Guide</h3>
    
    <div class="space-y-4">
      <section>
        <h4 class="font-semibold text-base mb-2">About Mask Images</h4>
        <p class="text-sm mb-2">
          The <code class="text-primary">mask-image</code> CSS property allows you to create complex visual effects by hiding portions of an element.
          Additional properties help control how the mask is applied:
        </p>
        <ul class="list-disc list-inside space-y-1  text-sm pl-3">
          <li><code class="text-primary">mask-size</code> - Controls the size of the mask layer</li>
          <li><code class="text-primary">mask-position</code> - Positions the mask layer</li>
          <li><code class="text-primary">mask-repeat</code> - Controls how the mask repeats</li>
          <li><code class="text-primary">mask-mode</code> - Defines how the mask layer is interpreted</li>
        </ul>
      </section>

      <section>
        <h4 class="font-semibold text-base mb-2">Using CSS Variables</h4>
        <p class="text-sm mb-2">
          CSS variables let you create dynamic, animated masks. Define variables in the "CSS Variables" section using the format:
        </p>
        <code class="block bg-base-300 p-2 rounded text-xs mb-2">--my-variable: 50%;</code>
        <p class="text-sm">
          Then reference them in your mask properties using <code class="text-primary">var(--my-variable)</code>.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base mb-2">Animating Masks</h4>
        <p class="text-sm mb-2">
          The GSAP Animation panel lets you create smooth transitions between different mask states:
        </p>
        <ol class="list-decimal list-inside space-y-1 text-sm pl-3">
          <li>Define initial values for your CSS variables in the Mask Properties panel</li>
          <li>Add animation steps using the *Add Step* button</li>
          <li>For each step, set the easing function and duration</li>
          <li>Add CSS variables with their target values (e.g., <code class="text-primary">--my-var: 100%;</code>)</li>
          <li>Click Play to run the animation once, or enable Loop for continuous playback</li>
          <li>Enable Yoyo to make the animation reverse back to the start</li>
        </ol>
        <p class="text-sm mt-2">
          Each step animates from the previous state to the new values you define. The animation will smoothly interpolate between these values.
        </p>
      </section>
    </div>

    <div class="modal-action">
      <button class="btn btn-sm" onclick={closeModal}>Close</button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
