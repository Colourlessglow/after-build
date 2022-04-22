# @whitekite/unplugin-after-build

unplugin 赋能

同时兼容webpack与vite

运行于打包结束之后

提供自动部署，代码压缩，代码备份功能

### Example

```ts
// afterBuild.config.ts afterBuild.config.local.ts
import {defineConfig} from '@whitekite/vite-plugin-after-build'

or

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