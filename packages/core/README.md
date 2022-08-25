# @whitekite/after-build

提供自动部署，代码压缩，代码备份功能

### 使用

```ts
import { createAfterBuild } from '@whitekite/after-build'

createAfterBuild({
  // 可选，可用于配置不同环境的不同部署服务器,
  // 默认：production
  mode: 'build-test',
  // 可选，借助 dotenv为配置文件提供环境变量
  env: process.env,
  // 开启本工具任何功能时，该选项都为必填
  outputPath: '/User/outputPath',
  // 可选 ,详见 AfterBuildFullConfig
  // 在未使用配置文件的情况下，提供默认设置
  config: {},
})
```

### 配置文件

- 设置默认使用 afterBuild.config.[ext]
- 可根据 设置的不同 mode 使用 afterBuild.[mode].[ext]

### 配置文件示例

```ts
// afterBuild.config.ts afterBuild.config.local.ts
import { defineConfig } from '@whitekite/after-build'

export default defineConfig({
  compress: 'gzip',
  /**
   * 打包文件备份功能，传递任意字符串开启该功能
   * 传递的字符串作为备份文件的前缀
   * 支持 Mustache 风格的参数解析
   * 支持的参数 {{name}} package.json 的name
   * 支持的参数 {{version}} package.json 的version
   * 支持的参数 {{mode}} 打包的模式
   * 支持的参数 {{time}} 打包时的时间
   * 示例（这也是传递true时的默认值）：
   * {{name}}-{{mode}}-{{time}}
   */
  backup: 'folder-name-{{name}}-{{mode}}-{{time}}',
  publish: {
    enable: true,
    host: 'http://XXXX.XXXX.XXX',
    port: 30,
    user: 'root',
    password: 'pass',
    path: '/user/local/folder',
    /**
     * 代码压缩后上传至代码服务器
     * 用于应对大型项目文件数量多导致拖慢上传速度的问题
     * 该功能处于实验阶段，暂只支持linux服务器
     */
    zipUpload: true,
  },
})

export default defineConfig((env) => ({
  compress: 'gzip',
  /**
   * 打包文件备份功能，传递任意字符串开启该功能
   * 传递的字符串作为备份文件的前缀
   * 支持 Mustache 风格的参数解析
   * 支持的参数 {{name}} package.json 的name
   * 支持的参数 {{version}} package.json 的version
   * 支持的参数 {{mode}} 打包的模式
   * 支持的参数 {{time}} 打包时的时间
   * 示例（这也是传递true时的默认值）：
   * {{name}}-{{mode}}-{{time}}
   */
  backup: 'folder-name-{{name}}-{{mode}}-{{time}}',
  publish: {
    enable: env.VITE_AUTO_PUBLISH,
    host: 'http://XXXX.XXXX.XXX',
    port: 30,
    user: 'root',
    password: 'pass',
    path: '/user/local/folder',
    /**
     * 代码压缩后上传至代码服务器
     * 用于应对大型项目文件数量多导致拖慢上传速度的问题
     * 该功能处于实验阶段，暂只支持linux服务器
     */
    zipUpload: true,
  },
}))
```

### 推送回滚

package.json

示例备份文件名称 projectName-test-20228022.zip

```json
{
  "scripts": {
    "cli:rollback": "whitekite-after-build rollback --mode build-test --version projectName-test-20228022"
  }
}
```

### 命令行执行

package.json

```json
{
  "scripts": {
    "cli:afterBuild": "whitekite-after-build run --mode build-test --compress.gzip --compress.br --backup {{name}}@{{version}} --outputPath /file-path"
  }
}
```
