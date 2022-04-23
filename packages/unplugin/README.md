# @whitekite/unplugin-after-build

unplugin 赋能

同时兼容webpack与vite

运行于打包结束之后

提供自动部署，代码压缩，代码备份功能

### 插件安装

```ts
import {afterBuildPlugin} from '@whitekite/unplugin-after-build'
// or 
import {afterBuildPlugin} from '@whitekite/unplugin-after-build/[framework]'

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

### 配置文件使用方法请参考

[@whitekite/after-build](https://www.npmjs.com/package/@whitekite/after-build)
