import { Box } from './box'
import { Maguma } from './maguma'
import { Player } from './player'
import socket from './plugins/websocket'
const CANVAS_WIDTH_PIXEL = 800
const CANVAS_HEIGHT_PIXEL = 800
const CANVAS_RATIO = CANVAS_WIDTH_PIXEL / CANVAS_HEIGHT_PIXEL
const PLAYER_DELAY = 1

type ICanvasManager = {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  maguma: Maguma
  boxes?: Box[]
}

export class CanvasManager {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private maguma: Maguma
  private boxes: Box[] = []
  private startTime = 0
  private currentTime = 0
  private lastTimestamp = 0
  private boxCreationProbability = 0.07
  constructor(params: ICanvasManager) {
    this.canvas = params.canvas
    this.ctx = params.ctx
    this.maguma = params.maguma
    this.boxes = params.boxes || []
    this.canvas.width = CANVAS_WIDTH_PIXEL
    this.canvas.height = CANVAS_HEIGHT_PIXEL
  }

  public loop = (timestamp: number, players: Player[]) => {
    this.updateCurrentTime(timestamp)
    this.resetCanvas()

    if (this.isGameOver(players)) return this.endGame(players)
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
      this.loop(timestamp, players)
    })
  }

  private updateCurrentTime(timestamp: number) {
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
    return players.find((player) => {
      return player.y + player.height > this.canvas.height
    })!
  }

  endGame(players: Player[]) {
    this.fillEndText(
      `${this.isGameOver(players).id === 1 ? '黒' : '白'}の勝ち。`,
      `頑張った時間: ${(this.currentTime - PLAYER_DELAY).toFixed(2)} 秒`,
    )
  }

  private fillBox(box: Box) {
    this.ctx.fillStyle = 'brown'
    this.ctx.fillRect(box.x, box.y, box.width, box.height)
  }

  private fillPlayer(player: Player) {
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

  private fillMaguma() {
    this.ctx.fillStyle = `rgb(${Math.random() * (255 - 200) + 200},30, 20)`
    this.ctx.fillRect(
      this.maguma.x,
      this.maguma.y,
      this.maguma.width,
      this.maguma.height,
    )
  }

  private createBox() {
    const width = (Math.random() * this.canvas.width) / 4.2
    const height = Math.random() * 50 + 20
    const x = this.canvas.width
    const y = this.canvas.height - 100 - Math.random() * 100
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

  deleteBox(box: Box) {
    const index = this.boxes.indexOf(box)
    this.boxes.splice(index, 1)
  }

  resetCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  fillEndText(firstText: string, secondText: string) {
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
