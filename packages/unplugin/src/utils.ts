import fs from 'fs'
import path from 'path'
export const isFunction = (arg: unknown): arg is (...args: any[]) => any =>
  typeof arg === 'function'

export function readAllFile(root: string, reg?: RegExp) {
  let resultArr: string[] = []
  try {
    if (fs.existsSync(root)) {
      const stat = fs.lstatSync(root)
      if (stat.isDirectory()) {
        // dir
        const files = fs.readdirSync(root)
        files.forEach(function (file) {
          const t = readAllFile(path.join(root, '/', file), reg)
          resultArr = resultArr.concat(t)
        })
      } else {
        if (reg !== undefined) {
          if (isFunction(reg.test) && reg.test(root)) {
            resultArr.push(root)
          }
        } else {
          resultArr.push(root)
        }
      }
    }
    // eslint-disable-next-line no-empty
  } catch (error) {}

  return resultArr
}
