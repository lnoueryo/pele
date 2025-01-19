import { io } from "socket.io-client"

export class WebsocketIO {
  private socket
  constructor(url: string) {
    this.socket = io(url)
  }
  on(trigger: string, callback: (data: any) => void) {
    this.socket.on(trigger, (data) => {
      callback(data)
    })
  }
  emit(trigger: string, data: any) {
    this.socket.emit(trigger, data)
  }
  get id() {
    return this.socket.id
  }
}
