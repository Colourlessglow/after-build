# @whitekite/vite-plugin-after-build

一个vite插件

运行于打包结束之后

提供自动部署，代码压缩，代码备份功能

### 插件安装

```ts
import plugin from '@whitekite/vite-plugin-after-build'

export default {
  plugins: [plugin({mode: 'build-test'})]
}
```

### 配置文件使用方法请参考

[@whitekite/after-build](https://www.npmjs.com/package/@whitekite/after-build)
