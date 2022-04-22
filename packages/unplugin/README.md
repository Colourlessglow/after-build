# @whitekite/unplugin-after-build

unplugin 赋能

同时兼容webpack与vite

运行于打包结束之后

提供自动部署，代码压缩，代码备份功能

### 插件安装

```ts
import {afterBuildPlugin} from '@whitekite/unplugin-after-build'

// vite
export default {
  plugins: [afterBuildPlugin.vite({mode: 'build-test'})]
}
// webpack 

module.exports = {
  plugins: [afterBuildPlugin.webpack({mode: 'build-test'})]
}
```
vue-cli 请使用 [@whitekite/vue-cli-plugin-after-build](https://www.npmjs.com/package/@whitekite/vue-cli-plugin-after-build)

### 设置

- 设置默认使用 afterBuild.config.[ext]
- 可根据 设置的不同mode使用 afterBuild.[mode].[ext]

### 设置示例

```ts
// afterBuild.config.ts afterBuild.config.local.ts
import {defineConfig} from '@whitekite/unplugin-after-build'

export default defineConfig({
  compress: 'gzip',
  backup: 'folder-name',
  publish: {
    enable: true,
    host: 'http://XXXX.XXXX.XXX',
    port: 30,
    user: 'root',
    password: 'pass',
    path: '/user/local/folder'
  }
})

export default defineConfig((env) => ({
  compress: 'gzip',
  backup: 'folder-name',
  publish: {
    enable: env.VITE_AUTO_PUBLISH,
    host: 'http://XXXX.XXXX.XXX',
    port: 30,
    user: 'root',
    password: 'pass',
    path: '/user/local/folder'
  }
}))
```
