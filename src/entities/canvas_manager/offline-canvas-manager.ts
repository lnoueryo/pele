import { BaseCanvasManager } from './base-canvas-manager'
import { Box } from '../box'
import { Maguma } from '../maguma'
import { Canvas } from '../canvas'
import { IPlayer } from '../interfaces/player.interface'
import { ComputerPlayer } from '../player/computer-player'
import { CanvasManager } from '../interfaces/canvas-manager.interface'
const PLAYER_DELAY = 1

export class OfflineCanvasManager
  extends BaseCanvasManager<IPlayer>
  implements CanvasManager
{
  constructor(params: {
    canvas: Canvas
    players: IPlayer[]
    maguma: Maguma
    boxes?: Box[]
  }) {
    super(params)
  }

  public loop(timestamp: number, startTimestamp: number): Box[] {
    const deltaTime = super.loopStart(timestamp, startTimestamp)
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
    }

    if (this.shouldCreateBox()) {
      this.createBox()
    }

    super.loopEnd()
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
