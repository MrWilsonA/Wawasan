import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // import.meta.dirname (not __dirname) so the config stays ESM-native, and
    // path.resolve (not a URL) so non-ASCII directory names resolve correctly.
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        // Keep the framework in its own long-lived chunk; curriculum data is
        // already split per route by React.lazy.
        manualChunks(id: string) {
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
