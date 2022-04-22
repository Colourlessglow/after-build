import _jiti, { JITI } from 'jiti'
import fs from 'fs-extra'
import path from 'path'
import { AfterBuildCompressType, AfterBuildFullConfig, AfterBuildPublishType } from './interface'

const afterBuildFile = ['afterBuild.config.ts', 'afterBuild.config.local.ts']

function getConfig(jiti: JITI, configPath: string, env: Record<string, any>) {
  const _config = jiti(configPath).default
  if (!_config) {
    return {}
  }
  if (typeof _config === 'function') {
    return _config(env)
  }
  return _config
}

function loadConfig(env: Record<string, any>) {
  const jiti = _jiti(undefined as any, { requireCache: false, cache: false, v8cache: false })
  let config: AfterBuildFullConfig = {}
  afterBuildFile.forEach((item) => {
    const configPath = path.resolve(process.cwd(), item)
    if (!fs.existsSync(configPath)) {
      return
    }

    config = {
      ...config,
      ...getConfig(jiti, configPath, env),
    }
  })
  return config
}

/**
 * AfterBuild设置
 */
export class AfterBuildConfig {
  config: AfterBuildFullConfig

  constructor(env, config?: AfterBuildFullConfig) {
    this.config = config || loadConfig(env)
  }

  get enableBackup() {
    return !!this.config.backup
  }

  get backupName() {
    if (!this.enableBackup) {
      return ''
    }
    return this.config.backup as string
  }

  get enableCompress() {
    return !!this.config.compress
  }

  get compressType() {
    const type = this.config.compress as AfterBuildCompressType
    if (typeof type === 'string') {
      return [type]
    }
    return type
  }

  get enableGzipCompress() {
    if (!this.enableCompress) {
      return false
    }
    const type = this.compressType
    return type.includes('gzip')
  }

  get enableBrotliCompress() {
    if (!this.enableCompress) {
      return false
    }
    const type = this.compressType
    return type.includes('brotli')
  }

  get enablePublish() {
    return !!this.config.publish?.enable
  }

  get publishType() {
    return this.config.publish as AfterBuildPublishType
  }

  get mode() {
    return this.config.mode
  }
}

export function defineConfig(
  config: AfterBuildFullConfig | ((env: Record<string, any>) => AfterBuildFullConfig)
) {
  return config
}
