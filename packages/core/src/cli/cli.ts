import { cac } from 'cac'
import { rollbackCli } from './rollback'
import { afterBuildCli } from './after-build'

declare const version: string
export const createAfterBuildCli = () => {
  const cli = cac('whitekite-after-build')
  // 回滚-cli
  rollbackCli(cli)
  afterBuildCli(cli)

  cli.help()
  cli.version(version)
  cli.parse()
}
