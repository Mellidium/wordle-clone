import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // The site is served from https://mellidium.github.io/wordle-clone/, so assets
  // need that prefix rather than the domain root.
  base: '/wordle-clone/',
  plugins: [react()],
  build: {
    // The bundled ten-letter dictionary is ~350KB on its own (~124KB gzipped),
    // which trips the default 500KB warning on every build. That weight is a
    // deliberate trade for offline word validation, so raise the bar rather
    // than print a warning nobody is going to act on.
    chunkSizeWarningLimit: 700,
  },
})
