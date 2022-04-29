import { Client, ConnectConfig, SFTPWrapper } from 'ssh2'
import { Stats } from 'ssh2-streams'
import { EventEmitter } from 'events'
import { createZip } from './zip'
import { join, parse } from 'path'
import consola from 'consola'

class SSHPromise {
  client: EventEmitter

  constructor(client: EventEmitter) {
    this.client = client
  }

  make<T = any>(ca: (resolve: (...args: any) => any, reject: (...args: any) => any) => any) {
    return new Promise<T>((resolve, reject) => {
      ca(resolve, reject)
      this.client.once('close', reject)
      this.client.once('error', reject)
      this.client.once('end', reject)
    })
  }
}

export class SftpNode {
  #sftp: SFTPWrapper
  #promise: SSHPromise

  constructor(sftp: SFTPWrapper) {
    this.#sftp = sftp
    this.#promise = new SSHPromise(sftp)
  }

  exists(path: string) {
    return this.#promise.make<boolean>((resolve) => {
      this.#sftp.exists(path, (err) => {
        resolve(err)
      })
    })
  }

  stat(path: string) {
    return this.#promise.make<Stats>((resolve, reject) => {
      this.#sftp.stat(path, (err, stats) => {
        if (err) {
          reject()
          return
        }
        resolve(stats)
      })
    })
  }

  async mkdir(path: string, recursive = false) {
    const _mkdir = (path: string) => {
      return this.#promise.make<void>((resolve, reject) => {
        this.#sftp.mkdir(path, (err) => {
          if (err) {
            reject(err)
          }
          resolve()
        })
      })
    }
    try {
      if (!recursive) {
        return await _mkdir(path)
      }
      const dir = parse(path).dir
      if (dir) {
        const exists = await this.exists(path)
        if (!exists) {
          await this.mkdir(dir, true)
        }
      }
      await _mkdir(path)
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  fastPut(localPath: string, remotePath: string) {
    return this.#promise.make<void>((resolve, reject) => {
      this.#sftp.fastPut(localPath, remotePath, (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }

  writeFile(data: Buffer, remotePath: string) {
    return this.#promise.make((resolve, reject) => {
      this.#sftp.writeFile(remotePath, data, (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }
}

export class SSHNode {
  #client: Client
  #sftp: SftpNode | undefined

  constructor() {
    this.#client = new Client()
  }

  connect(config: ConnectConfig) {
    let onReady: (...args: any[]) => any
    let onError: (...args: any[]) => any
    return new Promise((resolve, reject) => {
      this.#client.connect(config)
      onReady = () => {
        resolve(true)
      }
      onError = (err) => {
        reject(err)
      }
      this.#client.once('ready', onReady)
      this.#client.once('error', onError)
    })
  }

  private _makeSftp() {
    return new Promise<SftpNode>((resolve, reject) => {
      this.#client.sftp((err, sftp) => {
        if (err) {
          reject(err)
          return
        }
        this.#sftp = new SftpNode(sftp)
        resolve(this.#sftp)
      })
    })
  }

  sftp() {
    if (!this.#sftp) {
      return this._makeSftp()
    }
    return Promise.resolve(this.#sftp)
  }

  mkdir(path: string, recursive = false) {
    return this.sftp().then((sftp) => sftp.mkdir(path, recursive))
  }

  rmdir(path: string) {
    return this.exec(`rm -rf ${path}`)
  }

  exists(path: string) {
    return this.sftp().then((sftp) => sftp.exists(path))
  }

  stat(path: string) {
    return this.sftp().then((sftp) => sftp.stat(path))
  }

  fastPut(localPath: string, remotePath: string) {
    return this.sftp().then((sftp) => sftp.fastPut(localPath, remotePath))
  }

  writeFile(data: Buffer, remotePath: string) {
    return this.sftp().then((sftp) => sftp.writeFile(data, remotePath))
  }

  exec(command: string) {
    return new Promise((resolve, reject) => {
      this.#client.exec(command, (err, channel) => {
        if (err) {
          reject()
          return
        }
        channel.end(resolve)
        channel.once('error', reject)
        this.#client.once('error', reject)
        this.#client.once('end', reject)
        this.#client.once('close', reject)
      })
    })
  }

  uploadDir(localPath: string, remotePath: string) {
    consola.info('开始生成部署压缩包')
    const zipPath = join(remotePath, '/', 'distZip.zip')
    return createZip('dist', localPath)
      .then((content) => {
        consola.success('部署压缩包生成成功')
        consola.info('部署压缩包开始上传')
        return content
      })
      .then((content) => this.writeFile(content, zipPath))
      .then(() => {
        consola.success('部署压缩包上传成功')
        consola.info('部署压缩包开始解压')
      })
      .then(() => this.exec(`cd ${remotePath}`))
      .then(() => this.exec('unzip distZip.zip '))
      .then(() => {
        consola.success('部署压缩包解压成功')
        consola.info('正在清理部署目录')
      })
      .then(() => this.exec('cd dist'))
      .then(() => this.exec('mv -f * ../'))
      .then(() => this.exec('cd ../'))
      .then(() => this.exec('rm -rf distZip.zip  dist __MACOSX;'))
      .then(() => `${localPath} -> ${remotePath}`)
  }

  end() {
    return new Promise((resolve, reject) => {
      this.#client.end()
      this.#client.once('end', resolve)
      this.#client.once('error', reject)
    })
  }
}
