import { BaseCanvasManager } from './base_canvas_manager'
import { Box } from '../box'
import { Player } from '../player/player'
import { Canvas } from '../canvas'
import { Maguma } from '../maguma'
const PLAYER_DELAY = 1

export class MultiPlayerCanvasManager extends BaseCanvasManager {
  constructor(params: {
    canvas: Canvas
    players: Player[]
    maguma: Maguma
    boxes?: Box[]
  }) {
    super(params)
  }

  public loop(timestamp: number): Box[] {
    this.updateCurrentTime(timestamp)
    this.resetCanvas()
    if (this.currentTime > PLAYER_DELAY) {
      for (const player of this.players) {
        player.moveOnIdle()
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
