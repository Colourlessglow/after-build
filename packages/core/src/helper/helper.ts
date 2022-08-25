import path from 'path'
import fs from 'fs-extra'
import Mustache from 'mustache'
import dayJs from 'dayjs'
import { AfterBuildConfig } from '../config'

/**
 * 获取项目package.json 信息
 */
export const getProjectPackageMessage = () => {
  const url = path.resolve(process.cwd(), 'package.json')
  return fs.readJSONSync(url) || {}
}

/**
 * 创建备份模版名称解析
 */
export const genBackupTemplateName = (pluginConfig: AfterBuildConfig) => {
  const { backupName, mode } = pluginConfig
  const _backupName = backupName === true ? '{{name}}-{{mode}}-{{time}}' : backupName
  const time = dayJs(new Date()).format('YYYYMMDDHHmmss')
  const { name, version } = getProjectPackageMessage()
  return Mustache.render(_backupName, { time, mode, name, version })
}
