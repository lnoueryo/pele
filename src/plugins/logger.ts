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
    const stack = new Error().stack || ''
    const callerLine = stack.split('\n')[2] || '' // 呼び出し元のスタックを取得
    const fileInfo = callerLine.match(/\((.*):(\d+):(\d+)\)/) // ファイル名と行番号を取得
    const location = fileInfo
      ? `${fileInfo[1]}:${fileInfo[2]}:${fileInfo[3]}`
      : 'unknown location'
    return `[${timestamp}] [${location}]`
  }
}
