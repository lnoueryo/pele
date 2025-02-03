import { BaseCanvasManager } from './base_canvas_manager'
import { Box } from '../box'
import { Canvas } from '../canvas'
import { Maguma } from '../maguma'
import { OnlinePlayer } from '../player/online-player'
const PLAYER_DELAY = 1

export class OnlineCanvasManager extends BaseCanvasManager<OnlinePlayer> {
  public isGameOver = false
  constructor(params: {
    canvas: Canvas
    players: OnlinePlayer[]
    maguma: Maguma
    boxes?: Box[]
  }) {
    super(params)
  }

  public loop(timestamp: number, startTimestamp: number): Box[] {
    const deltaTime = (timestamp - this.lastTimestamp) / 1000 // フレーム間の経過時間を秒単位で計算
    this.updateCurrentTime(timestamp)
    this.resetCanvas()
    if (this.currentTime > PLAYER_DELAY) {
      for (const player of this.players) {
        player.moveOnIdle(deltaTime)
        player.isGameOver()
      }
    }
    for (const box of this.boxes) {
      this.fillBox(box)
      this.players.forEach((player) => {
        if (player.isPlayerCollidingWithBox(box)) player.moveOnTopBox(box.y)
      })
    }

    this.players.forEach((player) => {
      this.fillPlayer(player)
    })

    this.fillMaguma()
    this.fillTime(Date.now() - startTimestamp)
    return this.boxes
  }

  public updateBoxes(
    boxesJson: {
      x: number
      y: number
      width: number
      height: number
      speed: number
    }[],
  ) {
    this.boxes = boxesJson.map(
      (box) =>
        new Box({
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
          speed: box.speed,
        }),
    )
  }

  public fillPlayer(player: OnlinePlayer): void {
    super.fillPlayer(player)
    const { x, y, width, height } = player.getCanvasSize(this.canvas)
    this.ctx.fillStyle = 'black'
    const fontSize = Math.max(12, height / 8)
    this.ctx.font = `${fontSize}px Arial`
    this.ctx.textAlign = 'center'
    const textX = x + width / 2
    const textY = y - fontSize / 0.75
    const maxTextLength = 3
    const displayName =
      player.name.length > maxTextLength
        ? player.name.slice(0, maxTextLength)
        : player.name
    this.ctx.fillText(displayName, textX, textY, height * 0.8)
  }
}
