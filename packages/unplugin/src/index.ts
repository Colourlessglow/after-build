import path from 'path'
import zip from './zip'
import { compress } from './compress'
import { publish } from './publish'
import { AfterBuildConfig } from './config'
import { AfterBuildFullConfig } from './interface'
import { createUnplugin } from 'unplugin'

const afterBuildPlugin = createUnplugin((objectConfig?: AfterBuildFullConfig) => {
  let outputPath: string | undefined
  let mode: string
  let env: Record<string, any>
  const createAfterBuildPlugin = () => {
    if (!outputPath) {
      console.error('outputPath is null')
      return Promise.resolve()
    }
    const pluginConfig = new AfterBuildConfig(env, mode, objectConfig)
    return compress(outputPath, pluginConfig)
      .then(() => publish(outputPath as string, pluginConfig))
      .then(() => zip(outputPath as string, pluginConfig.mode || mode, pluginConfig))
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

export { defineConfig } from './config'

export { type AfterBuildFullConfig }

export { afterBuildPlugin }
