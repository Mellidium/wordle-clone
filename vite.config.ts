import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // The site is served from https://mellidium.github.io/wordle-clone/, so assets
  // need that prefix rather than the domain root.
  base: '/wordle-clone/',
  plugins: [react()],
})
