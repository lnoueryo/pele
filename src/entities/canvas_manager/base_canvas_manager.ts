import { Box } from '../box'
import { Canvas } from '../canvas'
import { Maguma } from '../maguma'
import { Player } from '../player'
const PLAYER_DELAY = 1

type ICanvasManager = {
  canvas: Canvas
  maguma: Maguma
  players?: Player[]
  boxes?: Box[]
}

export abstract class BaseCanvasManager {
  protected canvas: Canvas
  protected maguma: Maguma
  protected boxes: Box[] = []
  protected players: Player[] = []

  protected startTime = 0
  protected currentTime = 0
  protected lastTimestamp = 0
  protected boxCreationProbability = 0.07
  constructor(params: ICanvasManager) {
    this.canvas = params.canvas
    this.maguma = params.maguma
    this.players = params.players || []
    this.boxes = params.boxes || []
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

  protected isGameOver(players: Player[]) {
    return players.every((player) => {
      return player.isOver
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
    // 外枠
    this.ctx.strokeStyle = 'blue'
    this.ctx.strokeRect(player.x, player.y, player.width, player.height)
  
    // 背景
    this.ctx.fillStyle = player.color
    this.ctx.fillRect(player.x, player.y, player.width, player.height)
  
    // 赤いパーツ (目と口)
    this.ctx.fillStyle = 'red'
  
    // 左目
    const eyeWidth = player.width / 6 // 目の幅
    const eyeHeight = player.height / 6 // 目の高さ
    const eyeOffsetX = player.width / 5 // プレイヤーの左端から目までのオフセット
    const eyeOffsetY = player.height / 4 // プレイヤーの上端から目までのオフセット
  
    this.ctx.fillRect(
      player.x + eyeOffsetX,
      player.y + eyeOffsetY,
      eyeWidth,
      eyeHeight
    )
  
    // 右目
    this.ctx.fillRect(
      player.x + player.width - eyeOffsetX - eyeWidth,
      player.y + eyeOffsetY,
      eyeWidth,
      eyeHeight
    )
  
    // 口
    const mouthWidth = player.width / 2 // 口の幅
    const mouthHeight = player.height / 8 // 口の高さ
    const mouthOffsetX = player.width / 5 // プレイヤーの中央に口を配置するためのオフセット
    const mouthOffsetY = player.height / 1.5 // プレイヤーの上端から口までのオフセット
  
    this.ctx.fillRect(
      player.x + mouthOffsetX,
      player.y + mouthOffsetY,
      mouthWidth,
      mouthHeight
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
    const canvasWidth = this.canvas.width
    const canvasHeight = this.canvas.height
    const fontSize = Math.min(canvasWidth, canvasHeight) / 20
    const textX = canvasWidth / 2
    this.ctx.fillStyle = 'black'
    this.ctx.font = `${fontSize}px Arial`
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(firstText, textX, this.canvas.height / 4)
    this.ctx.fillText(secondText, textX, this.canvas.height / 3)
  }
  protected shouldCreateBox() {
    return Math.random() < this.boxCreationProbability
  }
  get ctx() {
    return this.canvas.ctx
  }
}
