import { Box } from '../box'
import { Maguma } from '../maguma'
import { Player } from '../player'
const CANVAS_WIDTH_PIXEL = 800
const CANVAS_HEIGHT_PIXEL = 800
const CANVAS_RATIO = CANVAS_WIDTH_PIXEL / CANVAS_HEIGHT_PIXEL
const PLAYER_DELAY = 1

type ICanvasManager = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  boxes?: Box[]
}

export abstract class BaseCanvasManager {
  protected canvas: HTMLCanvasElement
  protected ctx: CanvasRenderingContext2D
  protected maguma: Maguma
  protected boxes: Box[] = []
  protected startTime = 0
  protected currentTime = 0
  protected lastTimestamp = 0
  protected boxCreationProbability = 0.07
  constructor(params: ICanvasManager) {
    this.canvas = params.canvas
    this.ctx = params.ctx
    this.maguma = Maguma.createMaguma(this.canvas)
    this.boxes = params.boxes || []
    this.canvas.width = CANVAS_WIDTH_PIXEL
    this.canvas.height = CANVAS_HEIGHT_PIXEL
  }
  abstract loop(timestamp: number, players: Player[], userId: string): void

  protected updateCurrentTime(timestamp: number) {
    if (this.startTime === 0) {
      this.startTime = timestamp
      this.lastTimestamp = timestamp
    }
    const elapsedSinceLastFrame = timestamp - this.lastTimestamp
    if (elapsedSinceLastFrame < 100) {
      this.currentTime += elapsedSinceLastFrame / 1000
    }

    this.lastTimestamp = timestamp
  }

  isGameOver(players: Player[]) {
    return players.every((player) => {
      return (player.y + player.height) > this.canvas.height
    })!
  }

  protected endGame() {
    this.fillEndText(
      `ゲームオーバー`,
      `頑張った時間: ${(this.currentTime - PLAYER_DELAY).toFixed(2)} 秒`,
    )
  }

  protected fillBox(box: Box) {
    this.ctx.fillStyle = 'brown'
    this.ctx.fillRect(box.x, box.y, box.width, box.height)
  }

  protected fillPlayer(player: Player) {
    this.ctx.strokeStyle = 'blue'
    this.ctx.fillStyle = player.color
    this.ctx.fillRect(player.x, player.y, player.width, player.height)
    this.ctx.fillStyle = 'red'
    this.ctx.strokeRect(player.x, player.y, player.width, player.height)
    this.ctx.fillRect(
      player.x + 10,
      player.y + 5,
      player.width / 5,
      player.height / 5,
    )
    this.ctx.fillRect(
      player.x + player.width - 15,
      player.y + 5,
      player.width / 5,
      player.height / 5,
    )
    this.ctx.fillRect(
      player.x + 10,
      player.y + player.height - 15,
      player.width - 20,
      player.height / 5,
    )
  }

  protected fillMaguma() {
    this.ctx.fillStyle = `rgb(${Math.random() * (255 - 200) + 200},30, 20)`
    this.ctx.fillRect(
      this.maguma.x,
      this.maguma.y,
      this.maguma.width,
      this.maguma.height,
    )
  }

  protected resetCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  protected fillEndText(firstText: string, secondText: string) {
    this.ctx.fillStyle = 'black'
    this.ctx.font = '48px Arial'
    this.ctx.fillText(firstText, 180, this.canvas.height / 4)
    this.ctx.fillText(secondText, 180, this.canvas.height / 3)
  }

  adjustCanvasSize = () => {
    const height = window.innerHeight
    this.canvas.style.width = (height - 20) * CANVAS_RATIO + 'px'
    this.canvas.style.height = height - 20 + 'px'
  }

}
