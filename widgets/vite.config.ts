import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import path from 'node:path';
import { readdirSync } from 'node:fs';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDevelopment = command === 'serve';

  // Shoelace - Ref: https://github.com/shoelace-style/shoelace/discussions/1240
  const iconsPath = '../node_modules/@shoelace-style/shoelace/dist/assets/icons';

  // Webcomponents
  const elementDirPath = path.resolve(__dirname, 'src/elements');
  const elements = readdirSync(elementDirPath).map((fileName) => ({
    fileName,
    compiledFileName: fileName.split('.')[0],
  }));
  const rollupInputs: Record<string, string> = {};
  elements.forEach(
    (el) => (rollupInputs[el.compiledFileName] = path.join(elementDirPath, el.fileName)),
  );

  /*
   * When `customElement: true` is set Vite will compile CSS directly into the
   * JS so we don't have to worry about importing CSS files when using the built
   * web components. However, this breaks CSS in dev so we only enable it when
   * building.
   */
  const customElement = !isDevelopment;

  return {
    plugins: [
      // Enable export SFCs as custom elements
      vue({
        features: { customElement },
        template: {
          compilerOptions: {
            delimiters: ['[[', ']]'],
            // Shoelace components
            isCustomElement: (tag) => tag.startsWith('sl-'),
          },
        },
      }),
      vueDevTools(),
      // Copy assets to Vue build dir for demo use (has to be under root dir of Vue)
      viteStaticCopy({
        targets: [
          {
            src: iconsPath,
            dest: 'assets',
          },
        ],
      }),
      // Copy assets to Hugo static directory for blog use
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
          replacement: fileURLToPath(new URL('./src', import.meta.url)),
        },
        // Shoelace icons
        {
          find: /\/assets\/icons\/(.+)/,
          replacement: `${iconsPath}/$1`,
        },
      ],
    },
    build: {
      // Required since output dir is outside of vue project.
      emptyOutDir: true,
      rollupOptions: {
        input: rollupInputs,
        output: {
          assetFileNames: (asset) => {
            return '[name][extname]';
          },
          dir: '../static/widgets',
          entryFileNames(chunkInfo) {
            return `${chunkInfo.name}.js`;
          },
        },
      },
    },
  };
});
