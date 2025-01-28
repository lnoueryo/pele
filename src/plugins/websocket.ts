import { io } from 'socket.io-client'
export class WebsocketIO {
  private socket
  constructor(url: string) {
    this.socket = io(url)
  }
  on(trigger: string, callback: (data?: any) => void) {
    this.socket.on(trigger, (data) => {
      callback(data)
    })
  }
  emit(trigger: string, data?: any) {
    this.socket.emit(trigger, data)
  }
  timeout(time: number) {
    return this.socket.timeout(time)
  }
  async emitWithAck(trigger: string, data: any) {
    return await this.socket.emitWithAck(trigger, data)
  }
  connect() {
    this.socket.connect()
  }
  disconnect() {
    this.socket.disconnect()
  }
  get id() {
    return this.socket.id
  }
}
