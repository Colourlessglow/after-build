type AsyncQueueSate = 'pending' | 'rejected' | 'fulfilled'

/**
 * 延迟执行的异步请求队列
 * 不保存状态，只是为了延迟执行请求队列
 * 参考自
 * [useAsyncQueue](https://github.com/vueuse/vueuse/blob/main/packages/core/useAsyncQueue/index.ts)
 */
export class DelayAsyncQueue {
  private queue: ((...args: any[]) => Promise<any>)[]

  private promiseState: Record<AsyncQueueSate, AsyncQueueSate> = {
    pending: 'pending',
    rejected: 'rejected',
    fulfilled: 'fulfilled',
  }

  private activeIndex: number
  private readonly result: { state?: AsyncQueueSate }[]

  constructor() {
    this.result = []
    this.activeIndex = -1
    this.queue = []
  }

  /**
   * 新增
   * @param asyncFn
   */
  public add(asyncFn: (...args: any[]) => Promise<any>) {
    this.queue.push(asyncFn)
  }

  /**
   * 设置队列
   * @param data
   */
  public setQueue(data: ((...args: any[]) => Promise<any>)[]) {
    this.queue = data
  }

  /**
   * 清除
   */
  public clear() {
    this.queue.length = 0
    this.result.length = 0
    this.activeIndex = -1
  }

  /**
   * 获取请求队列的长度
   */
  public get size() {
    return this.queue.length
  }

  /**
   * 是否不为空
   */
  public isNotEmpty() {
    return !!this.size
  }

  /**
   * 是否为空
   */
  public isEmpty() {
    return !this.isNotEmpty()
  }

  /**
   * 更新队列状态
   * @param state
   * @private
   */
  private updateResult(state: AsyncQueueSate) {
    this.activeIndex++
    this.result[this.activeIndex] ||= {}
    this.result[this.activeIndex].state = state
  }

  /**
   * 消费内部
   * @private
   */
  private _consume() {
    return new Promise<void>((resolve, reject) => {
      if (this.isEmpty()) {
        resolve()
        return
      }
      this.queue.reduce((prev, curr) => {
        return prev
          .then((prevRes) => {
            if (this.result[this.activeIndex]?.state === this.promiseState.rejected) {
              resolve()
              return
            }

            return curr(prevRes).then((currentRes: any) => {
              this.updateResult(this.promiseState.fulfilled)
              this.activeIndex === this.queue.length - 1 && resolve()
              return currentRes
            })
          })
          .catch((e) => {
            this.updateResult(this.promiseState.rejected)
            reject()
            return e
          })
      }, Promise.resolve())
    })
  }

  /**
   * 消费
   */
  public consume() {
    return this._consume()
  }
}
