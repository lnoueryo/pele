import { Box } from '../box'
import { Canvas } from '../canvas'
import { CanvasManager } from '../interfaces/canvas-manager.interface'
import { Maguma } from '../maguma'
import { IPlayer } from '../interfaces/player.interface'

type ICanvasManager<T extends IPlayer> = {
  canvas: Canvas
  maguma: Maguma
  players?: T[]
  boxes?: Box[]
}
export abstract class BaseCanvasManager<T extends IPlayer>
  implements CanvasManager
{
  abstract isGameOver: boolean
  protected canvas: Canvas
  protected maguma: Maguma
  protected boxes: Box[] = []
  protected _players: T[] = []
  protected startTime = 0
  protected currentTime = 0
  protected lastTimestamp = 0
  protected boxCreationProbability = 0.075
  constructor(params: ICanvasManager<T>) {
    this.canvas = params.canvas
    this.maguma = params.maguma
    this._players = params.players || []
    this.boxes = params.boxes || []
  }

  abstract loop(timestamp: number, startTimestamp: number): Box[]
  abstract updateBoxes(
    boxesJson: {
      x: number
      y: number
      width: number
      height: number
      speed: number
    }[],
  ): void

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

  protected fillBox(box: Box) {
    const { x, y, width, height } = box.getCanvasSize(this.canvas)
    this.ctx.fillStyle = 'brown'
    this.ctx.fillRect(x, y, width, height)
  }

  protected fillPlayer(player: IPlayer) {
    const { x, y, width, height } = player.getCanvasSize(this.canvas)
    // 外枠
    this.ctx.strokeStyle = 'blue'
    this.ctx.strokeRect(x, y, width, height)

    // 背景
    this.ctx.fillStyle = player.color
    this.ctx.fillRect(x, y, width, height)

    // 赤いパーツ (目と口)
    this.ctx.fillStyle = 'red'

    // 左目
    const eyeWidth = width / 6 // 目の幅
    const eyeHeight = height / 6 // 目の高さ
    const eyeOffsetX = width / 5 // プレイヤーの左端から目までのオフセット
    const eyeOffsetY = height / 4 // プレイヤーの上端から目までのオフセット

    this.ctx.fillRect(x + eyeOffsetX, y + eyeOffsetY, eyeWidth, eyeHeight)

    // 右目
    this.ctx.fillRect(
      x + width - eyeOffsetX - eyeWidth,
      y + eyeOffsetY,
      eyeWidth,
      eyeHeight,
    )

    // 口
    const MOUTH_OFFSET_RIGHT = 5 // プレイヤーが右に移動しているときのオフセット
    const MOUTH_OFFSET_LEFT = 3 // プレイヤーが左に移動しているときのオフセット
    const BASE_MOUTH_DIVISOR = 4 // 分母の基本値
    const mouthWidth = width / 2 // 口の幅
    const mouthHeight = height / 8 // 口の高さ
    const mouthOffsetX =
      width /
      (BASE_MOUTH_DIVISOR +
        (player.isMovingToRight()
          ? MOUTH_OFFSET_RIGHT - BASE_MOUTH_DIVISOR
          : MOUTH_OFFSET_LEFT - BASE_MOUTH_DIVISOR))
    const mouthOffsetY = height / 1.5 // プレイヤーの上端から口までのオフセット

    this.ctx.fillRect(
      x + mouthOffsetX,
      y + mouthOffsetY,
      mouthWidth,
      mouthHeight,
    )

    this.ctx.fillStyle = 'black'
    const fontSize = Math.max(12, height / 8)
    this.ctx.font = `${fontSize}px Arial`
    this.ctx.textAlign = 'center'
    const textX = x + width / 2
    const textY = y - fontSize / 0.75
    const maxTextLength = 3
    const displayName =
      player.name.length > maxTextLength
        ? player.name.slice(0, maxTextLength)
        : player.name
    this.ctx.fillText(displayName, textX, textY, height * 0.8)
  }

  protected fillMaguma() {
    const { x, y, width, height } = this.maguma.getCanvasSize(this.canvas)
    this.ctx.fillStyle = `rgb(${Math.random() * (255 - 200) + 200},30, 20)`
    this.ctx.fillRect(x, y, width, height)
  }

  protected resetCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  protected shouldCreateBox() {
    return Math.random() < this.boxCreationProbability
  }
  fillTime(elapsedTime: number) {
    const canvasWidth = this.canvas.width
    const canvasHeight = this.canvas.height
    const fontSize = Math.min(canvasWidth, canvasHeight) / 30
    const textX = canvasWidth / 5
    const textY = canvasHeight * 0.04
    this.ctx.clearRect(
      textX - canvasWidth / 4,
      textY - fontSize,
      canvasWidth / 2,
      fontSize * 1.5,
    )

    const min = Math.floor(elapsedTime / 60000)
    const sec = Math.floor((elapsedTime % 60000) / 1000)
    const ms = Math.floor(elapsedTime % 1000)

    this.ctx.fillStyle = 'black'
    this.ctx.font = `${fontSize}px Arial`
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'top'
    this.ctx.fillText(`経過時間: ${min}分${sec}秒${ms}ms`, textX, textY)
  }
  endGame(result: {
    ranking: { name: string; timestamp: number }[]
    startTimestamp: number
  }) {
    const canvasWidth = this.canvas.width
    const canvasHeight = this.canvas.height
    const fontSize = Math.min(canvasWidth, canvasHeight) / 20
    const textX = canvasWidth * 0.05
    let textY = canvasHeight / 6

    this.ctx.fillStyle = 'black'
    this.ctx.font = `${fontSize}px Arial`
    this.ctx.textAlign = 'left'
    this.ctx.textBaseline = 'top'

    this.ctx.textAlign = 'center'
    this.ctx.fillText('ゲームオーバー', canvasWidth / 2, canvasHeight / 10)
    this.ctx.textAlign = 'left'

    result.ranking.forEach((player, index) => {
      const elapsedTime = player.timestamp - result.startTimestamp
      const min = Math.floor(elapsedTime / 60000)
      const sec = Math.floor((elapsedTime % 60000) / 1000)
      const ms = Math.floor(elapsedTime % 1000)
      this.ctx.fillText(
        `${index + 1}位: ${player.name} ${min}分${sec + Math.floor(ms / 10) / 100}秒`,
        textX,
        textY,
      )
      textY += fontSize * 1.5
    })
  }
  get ctx() {
    return this.canvas.ctx
  }
  get players() {
    return this._players
  }
}
