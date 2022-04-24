import { CAC } from 'cac'
import prompts from 'prompts'
import { createAfterBuild } from '../api'
import consola from 'consola'

const filterCompress = (compress?: Record<string, boolean>) => {
  if (!compress) {
    return
  }
  return Object.keys(compress).filter((key) => compress[key])
}
export const afterBuildCli = (cli: CAC) => {
  cli
    .command('run', '运行')
    .option('--outputPath <outputPath>', '指定打包文件所在路径')
    .option('--mode <mode>', '指定环境')
    .option('--compress [compress]', '代码压缩')
    .option('--backup [backup]', '备份')
    .action(async (options) => {
      const optionConfig = {
        mode: options?.mode,
        outputPath: options?.outputPath,
        compress: filterCompress(options.compress),
        backup: options.backup,
      }
      if (!optionConfig.mode) {
        const modeRes = await prompts({
          type: 'text',
          name: 'mode',
          message: '运行的环境:',
          initial: 'production',
        })
        optionConfig.mode = modeRes.mode
      }
      if (!optionConfig.outputPath) {
        const modeRes = await prompts({
          type: 'text',
          name: 'outputPath',
          message: '打包文件所在路径:',
        })
        optionConfig.outputPath = modeRes.outputPath
      }
      return createAfterBuild(optionConfig).catch(() => {
        consola.error('运行失败')
        process.exit(1)
      })
    })
}
