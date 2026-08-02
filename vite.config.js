import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'VisualControllerForLit',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'visual-controller-for-lit.esm.js'
          case 'cjs':
            return 'visual-controller-for-lit.cjs'
          case 'umd':
            return 'visual-controller-for-lit.umd.js'
          default:
            return 'visual-controller-for-lit.js'
        }
      }
    },
    rollupOptions: {
      external: ['lit', 'ask-for-promise'],
      output: {
        globals: {
          'lit': 'Lit',
          'ask-for-promise': 'askForPromise'
        },
        exports: 'named'
      }
    }
  }
})