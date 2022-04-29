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
   */
  backup?: string
  /**
   * @internal
   */
  mode?: string
}
