import { cac } from 'cac'
import prompts from 'prompts'
import { rollBack } from './rollback'
import consola from 'consola'
const cli = cac('whitekite-after-build')
declare const version: string
cli
  .command('rollback', '回滚部署至指定版本')
  .option('--mode <mode>', '指定回滚的环境')
  .option('--version <version>', '指定回滚的版本')
  .action(async (mode, version) => {
    const optionConfig = {
      mode: mode?.mode,
      version: version?.version,
    }
    if (!optionConfig.mode) {
      const modeRes = await prompts({
        type: 'text',
        name: 'mode',
        message: '回退的环境:',
        initial: 'production',
      })
      optionConfig.mode = modeRes.mode
    }
    if (!optionConfig.version) {
      const modeRes = await prompts({
        type: 'text',
        name: 'version',
        message: '回退的版本:',
      })
      optionConfig.version = modeRes.version
    }
    await rollBack(optionConfig.mode, optionConfig.version)
      .then(() => {
        consola.success('回滚成功')
      })
      .catch(() => {
        consola.error('回滚失败')
        process.exit(1)
      })
  })

cli.help()
cli.version(version)
cli.parse()
