import { AfterBuildConfig } from './config'
import consola from 'consola'
import { SSHNode } from './helper'
import Client from 'ssh2-sftp-client'
const checkEnv = (pluginConfig: AfterBuildConfig) => {
  const publishEnv = pluginConfig.publishType
  const publishNeedEnvList = ['user', 'port', 'password', 'host', 'path'] as const

  const hasEnvCount = (Object.keys(publishEnv) || []).filter((item) =>
    publishNeedEnvList.includes(item as any)
  ).length

  if (hasEnvCount !== publishNeedEnvList.length) {
    console.error(`代码自动部署缺少${publishNeedEnvList.join(',')}配置项`)
    return
  }
  const envMap = new Map<'user' | 'port' | 'password' | 'host' | 'path', any>()
  publishNeedEnvList.forEach((item) => {
    envMap.set(item, publishEnv[item])
  })

  return envMap
}

export const publish = (outputPath: string, pluginConfig: AfterBuildConfig) => {
  if (!pluginConfig.enablePublish) {
    return Promise.resolve()
  }
  consola.info('开始部署打包文件')
  const envMap = checkEnv(pluginConfig)
  if (!envMap?.size) {
    return Promise.reject()
  }
  let client: Client | SSHNode = new Client()
  if (pluginConfig.enableExperimentZipUpload) {
    client = new SSHNode()
  }
  const clientRootPath = envMap.get('path') as string
  return client
    .connect({
      host: envMap.get('host'),
      port: Number(envMap.get('port')),
      username: envMap.get('user'),
      password: envMap.get('password'),
    })
    .then(async () => {
      if (await client.exists(clientRootPath)) {
        await client.rmdir(clientRootPath, true)
      }
      await client.mkdir(clientRootPath, true)
    })
    .then(() => client.uploadDir(outputPath, clientRootPath))
    .then((msg) => {
      consola.info(msg)
      consola.success('部署打包文件成功')
    })
    .catch((err) => consola.error(err.message))
    .finally(() => {
      consola.info('部署服务结束')
      return client.end()
    })
}
