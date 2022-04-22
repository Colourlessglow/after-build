import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: false,
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  target: 'es2015',
  platform: 'node',
})
