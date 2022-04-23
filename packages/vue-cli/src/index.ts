import { PluginAPI } from '@vue/cli-service'
import { afterBuildPlugin } from '@whitekite/unplugin-after-build/webpack'

module.exports = (api: PluginAPI) => {
  const mode = api.service.mode
  api.chainWebpack((webpackConfig) => {
    webpackConfig.plugin('after-build').use(afterBuildPlugin({ mode }))
  })
}
