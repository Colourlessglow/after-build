import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      input: 'src/',
      outDir: '.',
      format: 'esm',
      builder: 'mkdist',
    },
    {
      input: 'src/',
      outDir: '.',
      format: 'cjs',
      ext: 'js',
      builder: 'mkdist',
      declaration: false,
    },
  ],
  clean: false,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
