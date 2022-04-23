import path from 'path'
import { createUnplugin } from 'unplugin'
import { createAfterBuild, AfterBuildFullConfig, defineConfig } from '@whitekite/after-build'

const afterBuildPlugin = createUnplugin((objectConfig?: AfterBuildFullConfig) => {
  let outputPath: string | undefined
  let mode: string
  let env: Record<string, any>
  const createAfterBuildPlugin = () => {
    return createAfterBuild({ mode, outputPath, env, config: objectConfig })
  }
  return {
    name: 'after-build',
    enforce: 'post',
    vite: {
      apply: 'build',
      configResolved(config) {
        mode = config.mode
        outputPath = path.isAbsolute(config.build.outDir)
          ? config.build.outDir
          : path.join(config.root, config.build.outDir)
      },
      closeBundle: () => {
        return createAfterBuildPlugin()
      },
    },
    webpack: (compiler) => {
      env = process.env
      outputPath = compiler.options.output.path
      mode = compiler.options.mode as string
      if (env.NODE_ENV !== 'production') {
        return
      }
      compiler.hooks.afterEmit.tapPromise('after-build', async () => {
        await createAfterBuildPlugin()
      })
    },
  }
})

export { type AfterBuildFullConfig, defineConfig, afterBuildPlugin }
