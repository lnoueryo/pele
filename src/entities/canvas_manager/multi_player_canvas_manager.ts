import { WebsocketIO } from '../../plugins/websocket'
import { BaseCanvasManager } from './base_canvas_manager'
import { Box } from '../box'
import { Player } from '../player'
const PLAYER_DELAY = 1

export class MultiPlayerCanvasManager extends BaseCanvasManager {
  private socket: WebsocketIO
  constructor(params: {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    boxes?: Box[]
    socket: WebsocketIO
  }) {
    super(
      params,
    )
    this.socket = params.socket
  }

  public loop(timestamp: number, players: Player[], userId: string) {
    this.updateCurrentTime(timestamp)
    this.resetCanvas()
    if (this.isGameOver(players)) return this.endGame()
    if (this.currentTime > PLAYER_DELAY) {
      for (const player of players) {
        player.moveOnIdle()
      }
    }
    for (const box of this.boxes) {
      this.fillBox(box)
      players.forEach((player) => {
        if (player.isPlayerCollidingWithBox(box)) player.moveOnTopBox(box.y)
      })
    }

    players.forEach((player) => {
      this.fillPlayer(player)
    })

    this.fillMaguma()

    requestAnimationFrame((timestamp) => {
      const user = players.find((player) => player.id === userId)!
      this.socket.emit('coordinate', {[userId]: user.convertToJson()})
      this.loop(timestamp, players, userId)
    })
  }

  public updateBoxes(boxesJson: {
    x: number
    y: number
    width: number
    height: number
    speed: number
  }[]) {
    this.boxes = boxesJson.map(box => new Box({
      x: this.canvas.width - this.canvas.width * box.x,
      y: this.canvas.height - this.canvas.height * box.y,
      width: (box.width * this.canvas.width) / 6,
      height: box.height * this.canvas.height,
      speed: box.speed,
    }))
  }
}
