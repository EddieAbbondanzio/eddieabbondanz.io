import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'
import { readdirSync } from 'node:fs'
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Webcomponents
const elementDirPath = path.resolve(__dirname, "src/elements")
const elements = readdirSync(elementDirPath).map(fileName => ({
  fileName,
  compiledFileName: fileName.split(".")[0]
}))
const rollupInputs: Record<string, string> = {}
elements.forEach(el => rollupInputs[el.compiledFileName] = path.join(elementDirPath, el.fileName))

// Shoelace - Ref: https://github.com/shoelace-style/shoelace/discussions/1240
const iconsPath = '../node_modules/@shoelace-style/shoelace/dist/assets/icons';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Enable export SFCs as custom elements
    vue({ features: { customElement: true }, template: {
      compilerOptions: {
        // Shoelace components
        isCustomElement: tag => tag.startsWith("sl-")
      }
    }}),
    vueJsx(),
    vueDevTools(),
    viteStaticCopy({
      targets: [
        {
          src: iconsPath,
          dest: '../../static/shoelace/assets',
        },
      ],
    }),
  ],
  resolve: {
    alias: [
      { 
        find: '@', 
        replacement: fileURLToPath(new URL('./src', import.meta.url)) 
      },
      // Shoelace icons
      {
        find: /\/assets\/icons\/(.+)/,
        replacement: `${iconsPath}/$1`,
      }
    ],
  },
  build: {
    // Required since output dir is outside of vue project.
    emptyOutDir: true, 
    rollupOptions: {
      input: rollupInputs,
      output: {
        assetFileNames: (asset) => {
          return '[name][extname]'
        },
        dir: "../static/widgets",
        entryFileNames(chunkInfo) {
          return `${chunkInfo.name}.js`
        }
      },
    },
  },

})
