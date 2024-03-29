/**
 * 代码压缩支持的类型
 */
export type AfterBuildCompressType = Array<'gzip' | 'brotli'> | 'gzip' | 'brotli'

/**
 * 打包文件推送配置
 */
export interface AfterBuildPublishType {
  /**
   * 是否开启
   */
  enable: boolean
  /**
   * 推送服务器ssh连接的host
   */
  host: string
  /**
   * 推送服务器ssh连接的port
   */
  port: number
  /**
   * 推送服务器登陆的用户名
   */
  user: string
  /**
   * 推送服务器登陆的密码
   */
  password: string
  /**
   * 推送服务器的位置
   */
  path: string

  /**
   * 代码压缩后上传至代码服务器
   * 用于应对大型项目文件数量多导致拖慢上传速度的问题
   * 该功能处于实验阶段，暂只支持linux服务器
   */
  zipUpload?: boolean
}

export interface AfterBuildFullConfig {
  /**
   * 代码压缩
   */
  compress?: AfterBuildCompressType
  /**
   * 打包文件推送
   */
  publish?: AfterBuildPublishType
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
  backup?: string | true
  /**
   * @internal
   */
  mode?: string
}
