import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  publicDir: false,
  plugins: [
    dts({ 
      entry: resolve(__dirname, 'src/main.js'), 
      cleanVueFileName: true, 
      outDir: 'dist' 
    })
  ],
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