import { BaseCanvasManager } from './base_canvas_manager'
import { Box } from '../box'
import { Player } from '../player'
const PLAYER_DELAY = 1

export class OnePlayerCanvasManager extends BaseCanvasManager {
  constructor(params: {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    boxes?: Box[]
  }) {
    super(
      params,
    )
  }

  public loop = (timestamp: number, players: Player[], userId: string) => {
    this.updateCurrentTime(timestamp)
    this.resetCanvas()
    if (this.isGameOver(players)) return this.endGame()
    if (this.currentTime > PLAYER_DELAY) {
      for (const player of players) {
        player.moveOnIdle()
      }
    }

    for (const box of this.boxes) {
      box.moveOnIdle()
      if (box.isOutOfDisplay()) this.deleteBox(box)

      this.fillBox(box)
      players.forEach((player) => {
        if (player.isPlayerCollidingWithBox(box)) player.moveOnTopBox(box.y)
      })
    }

    if (Math.random() < this.boxCreationProbability) {
      this.createBox()
    }

    players.forEach((player) => {
      this.fillPlayer(player)
    })

    this.fillMaguma()

    requestAnimationFrame((timestamp) => {
      this.loop(timestamp, players, userId)
    })
  }

  private createBox() {
    const x = this.canvas.width
    const y = this.canvas.height - this.canvas.height * 0.12
    const width = (Math.random() * this.canvas.width) / 4.2
    const height = Math.random() * this.canvas.height * 0.1
    const speed = Math.random() * (15 - 3) + 3
    const box = new Box({
      width,
      height,
      x,
      y,
      speed,
    })
    this.boxes.push(box)
  }

  private deleteBox(box: Box) {
    const index = this.boxes.indexOf(box)
    this.boxes.splice(index, 1)
  }
}
