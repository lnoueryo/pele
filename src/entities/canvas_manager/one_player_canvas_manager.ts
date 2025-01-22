import { BaseCanvasManager } from './base_canvas_manager'
import { Box } from '../box'
import { Player } from '../player'
import { Maguma } from '../maguma'
import { Canvas } from '../canvas'
const PLAYER_DELAY = 1

export class OnePlayerCanvasManager extends BaseCanvasManager {
  constructor(params: {
    canvas: Canvas
    players: Player[]
    maguma: Maguma
    boxes?: Box[]
  }) {
    super(
      params,
    )
  }

  public loop = async(timestamp: number) => {
    this.updateCurrentTime(timestamp)
    this.resetCanvas()
    if (this.isGameOver(this.players)) return this.endGame()
    if (this.currentTime > PLAYER_DELAY) {
      for (const player of this.players) {
        player.moveOnIdle()
        player.isGameOver()
      }
    }

    for (const box of this.boxes) {
      box.moveOnIdle()
      if (box.isOutOfDisplay()) this.deleteBox(box)

      this.fillBox(box)
      this.players.forEach((player) => {
        if (player.isPlayerCollidingWithBox(box)) player.moveOnTopBox(box.y)
      })
    }

    if (this.shouldCreateBox()) {
      this.createBox()
    }

    this.players.forEach((player) => {
      this.fillPlayer(player)
    })

    this.fillMaguma()

    await new Promise<void>((resolve) =>
      requestAnimationFrame((nextTimestamp) => {
        this.loop(nextTimestamp).then(resolve)
      })
    )
  }

  private createBox() {
    const box = Box.createBox(this.canvas)
    this.boxes.push(box)
    return box
  }

  private deleteBox(box: Box) {
    const index = this.boxes.indexOf(box)
    this.boxes.splice(index, 1)
  }
}
