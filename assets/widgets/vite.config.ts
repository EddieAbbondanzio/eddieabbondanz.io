import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'node:path'
import { readdirSync } from 'node:fs'

const elements = readdirSync(resolve(__dirname, "src/elements")).map(fileName => ({
  fileName,
  compiledFileName: fileName.split(".")[0]
}))
const rollupInputs: Record<string, string> = {}
elements.forEach(el => rollupInputs[el.compiledFileName] = el.fileName)

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
      input: rollupInputs,
      output: {
        entryFileNames(chunkInfo) {
          return `${chunkInfo.name}.js`
        }
      }
    }
  }
})
