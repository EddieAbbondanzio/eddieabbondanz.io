import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({ features: { customElement: true }}),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    outDir: "dist/elements",
    rollupOptions: {
      input: {
        // TODO: Make this automatic
        'b-series-gear-calculator': resolve(__dirname, "src/elements/b-series-gear-calculator.ts")
      },
      output: {
        entryFileNames(chunkInfo) {
          return `${chunkInfo.name}.js`
        }
      }
    }
  }
})
