// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('@vue/cli-service')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { afterBuildPlugin } = require('@whitekite/unplugin-after-build')
module.exports = defineConfig({
  configureWebpack: {
    plugins: [afterBuildPlugin.webpack()],
  },
})
