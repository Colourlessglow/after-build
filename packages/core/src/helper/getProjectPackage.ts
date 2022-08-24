import path from 'path'
import fs from 'fs-extra'

export const getProjectPackageMessage = () => {
  const url = path.resolve(process.cwd(), 'package.json')
  return fs.readJSONSync(url) || {}
}
