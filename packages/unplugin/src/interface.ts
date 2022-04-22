export type AfterBuildCompressType = Array<'gzip' | 'brotli'> | 'gzip' | 'brotli'
export interface AfterBuildPublishType {
  enable: boolean
  host: string
  port: number
  user: string
  password: string
  path: string
}
export interface AfterBuildFullConfig {
  compress?: AfterBuildCompressType
  publish?: AfterBuildPublishType
  backup?: string
  mode?: string
}
