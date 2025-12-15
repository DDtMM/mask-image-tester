import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  base: '/mask-image-tester/',
  plugins: [
    svelte(),
    tailwindcss(),
  ],
})