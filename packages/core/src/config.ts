import _jiti, { JITI } from 'jiti'
import fs from 'fs-extra'
import path from 'path'
import { defu } from 'defu'
import { AfterBuildCompressType, AfterBuildFullConfig, AfterBuildPublishType } from './interface'
import { loadDotEnv } from './dotenv'
import consola from 'consola'

const extname = ['js', 'mjs', 'ts', 'cjs']
const afterBuildFile = ['afterBuild.config']

const makeAfterBuildFile = (file: string[]) => {
  const realFile = [...afterBuildFile, ...file]
  const realFilepath: string[] = []
  realFile.forEach((item) => {
    extname.forEach((ext) => {
      realFilepath.push(`${item}.${ext}`)
    })
  })
  return realFilepath
}

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

function loadConfigs(env: Record<string, any>, mode: string) {
  const jiti = _jiti(undefined as any, { requireCache: false, cache: false, v8cache: false })
  let config: AfterBuildFullConfig = {}
  config.mode = mode
  makeAfterBuildFile([`afterBuild.${mode}`]).forEach((item) => {
    const configPath = path.resolve(process.cwd(), item)
    if (!fs.existsSync(configPath)) {
      consola.error(`配置文件加载失败：${configPath}不存在`)
      return
    }

    config = defu(config, getConfig(jiti, configPath, env))
  })
  return config
}

/**
 * AfterBuild设置
 */
export class AfterBuildConfig {
  config: AfterBuildFullConfig

  constructor(env, mode: string, config: AfterBuildFullConfig = {}) {
    const realEnv = env || loadDotEnv(mode)
    this.config = defu(loadConfigs(realEnv, mode), config)
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

  get enableExperimentZipUpload() {
    return !!this.config.publish?.zipUpload
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
