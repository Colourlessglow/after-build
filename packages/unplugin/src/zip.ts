import path from 'path'
import fs from 'fs-extra'
import JSZip from 'jszip'
import dayJs from 'dayjs'
import { AfterBuildConfig } from './config'

export function readAllFile(jsZip: JSZip, root: string) {
  try {
    // dir
    const files = fs.readdirSync(root)
    files.forEach((file) => {
      const realpath = path.join(root, '/', file)
      const stat = fs.lstatSync(realpath)
      if (stat.isDirectory()) {
        const folder = jsZip.folder(file)
        readAllFile(folder as JSZip, realpath)
      } else {
        jsZip.file(file, fs.readFileSync(realpath))
      }
    })
  } catch (error) {
    console.log(error)
  }
}

const zip = (outputPath: string, mode: string, pluginConfig: AfterBuildConfig) => {
  if (!pluginConfig.enableBackup) {
    return Promise.resolve()
  }
  console.info('打包文件备份压缩开始')
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

  const jsZip = new JSZip()
  const folder = jsZip.folder(zipSaveName)
  readAllFile(folder as JSZip, outputPath)

  return jsZip
    .generateAsync({
      //设置压缩格式，开始打包
      type: 'nodebuffer', //nodejs用
      compression: 'DEFLATE', //压缩算法
      compressionOptions: {
        //压缩级别
        level: 9,
      },
    })
    .then((content) => fs.writeFile(`${zipSavePath}/${zipSaveName}.zip`, content, 'utf-8'))
    .then(() => {
      console.info('打包文件备份压缩成功')
    })
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      console.info('打包文件备份压缩结束')
    })
}
export default zip
