# @whitekite/after-build

提供自动部署，代码压缩，代码备份功能

🇨🇳国内用户可访问[国内镜像](https://gitee.com/white-kite/after-build)
### 使用

```ts
import {createAfterBuild} from '@whitekite/after-build'

createAfterBuild({
  // 可选，可用于配置不同环境的不同部署服务器,
  // 默认：production
  mode: 'build-test',
  // 可选，借助 dotenv为配置文件提供环境变量
  env: process.env,
  // 开启本工具任何功能时，该选项都为必填
  outputPath: "/User/outputPath",
  // 可选 ,详见 AfterBuildFullConfig
  // 在未使用配置文件的情况下，提供默认设置
  config: {}
})
```

### 配置文件

- 设置默认使用 afterBuild.config.[ext]
- 可根据 设置的不同mode使用 afterBuild.[mode].[ext]

### 配置文件示例

```ts
// afterBuild.config.ts afterBuild.config.local.ts
import {defineConfig} from '@whitekite/after-build'

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

### 推送回滚
package.json
```json

{
  "scripts": {
    "cli:rollback": "whitekite-after-build rollback --mode build-test --version 2022042322285"
  }
}

```

### 命令行执行
package.json
```json
{
  "scripts": {
    "cli:afterBuild": "whitekite-after-build run --mode build-test --compress.gzip --compress.br --backup web --outputPath /file-path"
  }
}
```
