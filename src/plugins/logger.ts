export class Logger {
  static log(...args: any[]) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(Logger.outputContent(), ...args)
    }
  }
  static info(...args: any[]) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(Logger.outputContent(), ...args)
    }
  }

  static error(...args: any[]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(Logger.outputContent(), ...args)
    }
  }

  static warn(...args: any[]) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(Logger.outputContent(), ...args)
    }
  }

  static group() {
    if (process.env.NODE_ENV !== 'production') {
      console.group()
    }
  }

  static count() {
    if (process.env.NODE_ENV !== 'production') {
      console.count()
    }
  }

  static time(arg: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.time(`${Logger.outputContent()} ${arg}`)
    }
  }

  static timeLog(arg: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.timeLog(`${Logger.outputContent()} ${arg}`)
    }
  }

  static timeEnd(arg: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.timeEnd(`${Logger.outputContent()} ${arg}`)
    }
  }

  static groupEnd() {
    if (process.env.NODE_ENV !== 'production') {
      console.groupEnd()
    }
  }

  static clear() {
    if (process.env.NODE_ENV !== 'production') {
      console.clear()
    }
  }

  static outputContent() {
    const timestamp = new Date().toISOString()
    const error = new Error()
    const stack = error.stack || ''

    // スタック全体を分割して必要な情報を取得
    const stackLines = stack.split('\n')
    const callerLine = stackLines[3] || '' // 呼び出し元を調整（3は呼び出し元の深さ）

    const fileInfo = callerLine.match(/at\s+(.*?):(\d+):(\d+)/) // ファイル名と行番号を取得
    const location = fileInfo
      ? `${fileInfo[1]}:${fileInfo[2]}:${fileInfo[3]}`
      : 'unknown location'

    return `[${timestamp}] [${location}]`
  }
}
