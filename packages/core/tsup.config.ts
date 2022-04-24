import { defineConfig } from 'tsup'
import pkg from './package.json'
export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: false,
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  define: {
    version: JSON.stringify(pkg.version),
  },
})
