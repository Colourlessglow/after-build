import dotenv from 'dotenv'
import path from 'path'
import { defu } from 'defu'

export const loadDotEnv = (mode: string) => {
  const basePath = path.resolve(process.cwd(), `.env${mode ? `.${mode}` : ``}`)
  const localPath = `${basePath}.local`
  const env = process.env
  const load = (path: string) => {
    const currentEnv = dotenv.config({ path })
    defu(env, currentEnv)
  }
  load(basePath)
  load(localPath)
  return env
}
