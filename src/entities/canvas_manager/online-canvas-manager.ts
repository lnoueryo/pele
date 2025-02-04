import { BaseCanvasManager } from './base-canvas-manager'
import { Box } from '../box'
import { Canvas } from '../canvas'
import { Maguma } from '../maguma'
import { IPlayer } from '../interfaces/player.interface'
import { MainPlayer } from '../player/main-player'
import { CanvasManager } from '../interfaces/canvas-manager.interface'
const PLAYER_DELAY = 1

export class OnlineCanvasManager
  extends BaseCanvasManager<IPlayer>
  implements CanvasManager
{
  public isGameOver = false
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
        if (player instanceof MainPlayer && !player.isOver) {
          player.moveOnIdle(deltaTime)
          player.isGameOver()
        }
      }
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
