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

### 设置

- 设置默认使用 afterBuild.config.[ext]
- 可根据 设置的不同mode使用 afterBuild.[mode].[ext]


### 设置示例

```ts
// afterBuild.config.ts afterBuild.config.local.ts
import {defineConfig} from '@whitekite/vite-plugin-after-build'

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
