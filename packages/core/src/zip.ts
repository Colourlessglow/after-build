import path from 'path'
import fs from 'fs-extra'
import dayJs from 'dayjs'
import { AfterBuildConfig } from './config'
import consola from 'consola'
import { createZip } from './helper'

/**
 * 备份压缩
 * @param outputPath
 * @param mode
 * @param pluginConfig
 */
const zip = (outputPath: string, mode: string, pluginConfig: AfterBuildConfig) => {
  if (!pluginConfig.enableBackup) {
    return Promise.resolve()
  }
  consola.info('打包文件备份压缩开始')
  const zipSaveDirectoryPath = path.join(process.cwd(), '/', 'build-backup')
  if (!fs.existsSync(zipSaveDirectoryPath)) {
    fs.mkdirSync(zipSaveDirectoryPath)
  }
  const zipSavePath = path.join(zipSaveDirectoryPath, '/', mode)
  if (!fs.existsSync(zipSavePath)) {
    fs.mkdirSync(zipSavePath)
  }
  const time = dayJs(new Date()).format('YYYYMMDDHHmmss')

  const zipSaveName = `${pluginConfig.backupName}-${mode}-${time}`

  return createZip(zipSaveName, outputPath)
    .then((content) => fs.writeFile(`${zipSavePath}/${zipSaveName}.zip`, content, 'utf-8'))
    .then(() => {
      consola.success('打包文件备份压缩成功')
    })
    .catch((error) => {
      consola.error(error)
    })
    .finally(() => {
      consola.info('打包文件备份压缩结束')
    })
}
export default zip
