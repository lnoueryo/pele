import { BaseCanvasManager } from './base_canvas_manager'
import { Box } from '../box'
import { Canvas } from '../canvas'
import { Maguma } from '../maguma'
import { IPlayer } from '../interfaces/player.interface'
const PLAYER_DELAY = 1

export class MultiPlayerCanvasManager<
  T extends IPlayer,
> extends BaseCanvasManager<T> {
  constructor(params: {
    canvas: Canvas
    players: T[]
    maguma: Maguma
    boxes?: Box[]
  }) {
    super(params)
  }

  public loop(timestamp: number): Box[] {
    const deltaTime = (timestamp - this.lastTimestamp) / 1000 // フレーム間の経過時間を秒単位で計算
    this.updateCurrentTime(timestamp) // ゲーム全体の時間を更新

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
}
