import { BaseCanvasManager } from './base_canvas_manager'
import { Box } from '../box'
import { Maguma } from '../maguma'
import { Canvas } from '../canvas'
import { SoloPlayer } from '../player/solo-player'
const PLAYER_DELAY = 1

export class OnePlayerCanvasManager extends BaseCanvasManager<SoloPlayer> {
  constructor(params: {
    canvas: Canvas
    players: SoloPlayer[]
    maguma: Maguma
    boxes?: Box[]
  }) {
    super(params)
  }

  public loop(timestamp: number): Box[] {
    const deltaTime = (timestamp - this.lastTimestamp) / 1000
    this.updateCurrentTime(timestamp)

    this.resetCanvas()

    if (this.currentTime > PLAYER_DELAY) {
      for (const player of this.players) {
        player.moveOnIdle(deltaTime)
        player.isGameOver()
      }
    }

    for (const box of this.boxes) {
      box.moveOnIdle(deltaTime)
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
    return this.boxes
  }

  private createBox() {
    const box = Box.createBox()
    this.boxes.push(box)
    return box
  }

  private deleteBox(box: Box) {
    const index = this.boxes.indexOf(box)
    this.boxes.splice(index, 1)
  }
  updateBoxes(
    boxesJson: {
      x: number
      y: number
      width: number
      height: number
      speed: number
    }[],
  ) {
    console.log(boxesJson)
  }
}
