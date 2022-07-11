import fs from 'fs-extra'
import path from 'path'
import consola from 'consola'
import JSZip from 'jszip'
import { AfterBuildConfig } from './config'
import { DelayAsyncQueue } from '@vill-v/async'
import { publish } from './publish'

const findRollbackDirPath = (config: AfterBuildConfig) => {
  if (!config.enableBackup) {
    consola.error('请开启备份功能，以便通过您定义的名称查询历史版本')
    return Promise.reject()
  }
  const zipSaveDirectoryPath = path.join(process.cwd(), '/', 'build-backup')
  if (!fs.existsSync(zipSaveDirectoryPath)) {
    consola.error('请至少备份一次文件')
    return Promise.reject()
  }
  const zipSavePath = path.join(zipSaveDirectoryPath, '/', config.mode as string)
  if (!fs.statSync(zipSavePath)) {
    consola.error(`请至少备份一次${config.mode}环境的文件`)
    return Promise.reject()
  }
  return Promise.resolve(zipSavePath)
}

const findRollbackFilePath = (zipSavePath: string, version: string, config: AfterBuildConfig) => {
  const zipName = `${config.backupName}-${config.mode}-${version}`
  const zipSaveFilePath = path.join(zipSavePath, '/', `${zipName}.zip`)
  if (!fs.statSync(zipSaveFilePath)) {
    consola.warn(`未找到${zipName}.zip`)
    return Promise.reject()
  }
  return Promise.resolve({ zipSaveFilePath, zipName })
}

const genRollbackFile = async (
  rollBackDirPath: string,
  rollbackFilePath: string,
  rollbackFileName
) => {
  const rollbackTempDir = path.join(rollBackDirPath, '/', '.rollback')
  const rollbackTempDir$1 = path.join(rollbackTempDir, '/', rollbackFileName)
  if (fs.existsSync(rollbackTempDir$1)) {
    consola.log('命中缓存')
    return Promise.resolve(rollbackTempDir$1)
  }
  fs.mkdirsSync(rollbackTempDir)
  const jsZip = new JSZip()
  const content = await fs.readFile(rollbackFilePath)
  const zipData = await jsZip.loadAsync(content)

  const delayAsyncQueue = new DelayAsyncQueue()
  zipData.forEach((relativePath, file) => {
    const realPath = path.join(rollbackTempDir, relativePath)
    if (file.dir) {
      delayAsyncQueue.add(() => fs.mkdir(realPath))
      return
    }
    delayAsyncQueue.add(() =>
      file.async('nodebuffer').then((content) => fs.writeFile(realPath, content))
    )
  })

  await delayAsyncQueue.consume()
  return Promise.resolve(rollbackTempDir$1)
}

export const rollBack = async (mode, version) => {
  try {
    const pluginConfig = new AfterBuildConfig(undefined, mode)
    if (!pluginConfig.enablePublish) {
      consola.error('请开启推送功能，以便通过您定义的服务器信息回退对应版本')
      return Promise.reject()
    }

    const rollBackDirPath = await findRollbackDirPath(pluginConfig)
    const { zipSaveFilePath: rollbackFilePath, zipName: rollbackFileName } =
      await findRollbackFilePath(rollBackDirPath, version, pluginConfig)
    const rollbackTempDir = await genRollbackFile(
      rollBackDirPath,
      rollbackFilePath,
      rollbackFileName
    )
    consola.info(`回滚文件生成地址：${rollbackTempDir}`)
    await publish(rollbackTempDir, pluginConfig)
  } catch (e) {
    return Promise.reject(e)
  }
}
