import { BaseCanvasManager } from './base-canvas-manager'
import { Box } from '../box'
import { Maguma } from '../maguma'
import { Canvas } from '../canvas'
import { IPlayer } from '../interfaces/player.interface'
import { ComputerPlayer } from '../player/computer-player'
const PLAYER_DELAY = 1

export class OfflineCanvasManager extends BaseCanvasManager<IPlayer> {
  constructor(params: {
    canvas: Canvas
    players: IPlayer[]
    maguma: Maguma
    boxes?: Box[]
  }) {
    super(params)
  }

  public loop(timestamp: number, startTimestamp: number): Box[] {
    const deltaTime = (timestamp - this.lastTimestamp) / 1000
    this.updateCurrentTime(timestamp)
    this.resetCanvas()
    this.fillBackground()
    this.fillTime(Date.now() - startTimestamp)
    if (this.currentTime > PLAYER_DELAY) {
      for (const player of this.players) {
        if (player instanceof ComputerPlayer) {
          player.decideNextMove(this.boxes)
        }
        player.moveOnIdle(deltaTime)
        player.isGameOver()
      }
    }

    for (const box of this.boxes) {
      box.moveOnIdle(deltaTime)
      if (box.isOutOfDisplay()) this.deleteBox(box)

      this.fillBox(box)
      this.players.forEach((player) => {
        if (player.isPlayerCollidingWithBox(box)) {
          const { y } = box.convertToJson()
          player.moveOnTopBox(y)
        }
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

  public updateBoxes(
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

  private createBox() {
    const box = Box.createBox()
    this.boxes.push(box)
    return box
  }

  private deleteBox(box: Box) {
    const index = this.boxes.indexOf(box)
    this.boxes.splice(index, 1)
  }

  get isGameOver() {
    return this.players.every((player) => {
      return player.isOver
    })!
  }
}
