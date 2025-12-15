import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/mask-image-tester/' : '/',
  plugins: [
    svelte(),
    tailwindcss(),
  ],
}))