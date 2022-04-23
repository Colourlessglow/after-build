import { defineConfig } from 'tsup'
import pkg from './package.json'
export default defineConfig({
  entry: ['src'],
  sourcemap: false,
  clean: true,
  dts: true,
  bundle: false,
  format: ['cjs', 'esm'],
  define: {
    version: JSON.stringify(pkg.version),
  },
})
