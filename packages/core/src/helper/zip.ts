import JSZip from 'jszip'
import fs from 'fs-extra'
import path from 'path'

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

/**
 * 创建zip
 * @param folderName
 * @param outputPath
 */
export const createZip = (folderName: string, outputPath: string) => {
  const jsZip = new JSZip()
  const folder = jsZip.folder(folderName)
  readAllFile(folder as JSZip, outputPath)

  return jsZip.generateAsync({
    //设置压缩格式，开始打包
    type: 'nodebuffer', //nodejs用
    compression: 'DEFLATE', //压缩算法
    compressionOptions: {
      //压缩级别
      level: 9,
    },
  })
}
