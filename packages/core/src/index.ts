import { AfterBuildConfig } from './config'
import { AfterBuildFullConfig } from './interface'
import { compress } from './compress'
import { publish } from './publish'
import zip from './zip'

export interface ICreateAfterBuild {
  mode?: string
  outputPath?: string
  config?: AfterBuildFullConfig
  env?: Record<string, any>
}

export { type AfterBuildFullConfig }

export { defineConfig } from './config'

export const createAfterBuild = ({
  mode = 'production',
  config,
  outputPath,
  env = process.env,
}: ICreateAfterBuild) => {
  if (!outputPath) {
    console.error('outputPath is null')
    return Promise.resolve()
  }
  const pluginConfig = new AfterBuildConfig(env, mode, config)
  return compress(outputPath, pluginConfig)
    .then(() => publish(outputPath as string, pluginConfig))
    .then(() => zip(outputPath as string, pluginConfig.mode || mode, pluginConfig))
}
