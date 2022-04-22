import fs from 'fs-extra'
import zlib from 'zlib'
import { readAllFile } from './utils'
import { AfterBuildConfig } from './config'
import consola from 'consola'

const mtimeCache = new Map<string, number>()
const extRE = /\.(js|mjs|json|css|html)$/i

/**
 * Get the suffix
 * @param filepath
 */
function getGzipOutputFileName(filepath: string) {
  return `${filepath}.gz`
}

/**
 * Compression core method
 * @param content
 * @param filePath
 */
async function gzip(content: Buffer, filePath: string) {
  const gZipContent = zlib.gzipSync(content, {
    level: zlib.constants.Z_BEST_COMPRESSION,
  })

  const cname = getGzipOutputFileName(filePath)
  await fs.writeFile(cname, gZipContent)
}

/**
 * Get the suffix
 * @param filepath
 */
function getBrotliOutputFileName(filepath: string) {
  return `${filepath}.br`
}

async function brotli(content: Buffer, filePath: string) {
  const brotliContent = zlib.brotliCompressSync(content)

  const cname = getBrotliOutputFileName(filePath)
  await fs.writeFile(cname, brotliContent)
}

function filterFiles(files: string[], filter: RegExp) {
  files = files.filter((file) => (filter as RegExp).test(file))
  return files
}

export const compress = (outputPath: string, pluginConfig: AfterBuildConfig) => {
  if (!pluginConfig.enableCompress) {
    return Promise.resolve()
  }
  consola.info('代码压缩开始')
  let files = readAllFile(outputPath) || []

  if (!files.length) return Promise.reject()

  files = filterFiles(files, extRE)

  const handles = files.map(async (filePath: string) => {
    const { mtimeMs, size: oldSize } = await fs.stat(filePath)
    if (mtimeMs <= (mtimeCache.get(filePath) || 0) || oldSize < 1025) return

    const content = await fs.readFile(filePath)

    try {
      if (pluginConfig.enableGzipCompress) {
        await gzip(content, filePath)
      }
      if (pluginConfig.enableBrotliCompress) {
        await brotli(content, filePath)
      }
    } catch (error) {
      consola.error('compress error:' + filePath)
    }

    mtimeCache.set(filePath, Date.now())
  })

  return Promise.all(handles).finally(() => consola.success('代码压缩成功'))
}
