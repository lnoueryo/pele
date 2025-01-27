import { CanvasManager } from './../../entities/interfaces/canvas-manager.interface';
import { Box } from "../../entities/box"
import { Canvas } from "../../entities/canvas"
import { Maguma } from "../../entities/maguma"
import { Player } from "../../entities/player"
import { createEvent } from "../../utils"
import BaseCanvasComponent from "../atoms/base-canvas.component"
import { BaseComponent } from "../common/base.component"
import { Logger } from '../../plugins/logger'

const sheet = new CSSStyleSheet()
sheet.replaceSync(`
#canvas-container {
  margin: 0;
  padding: 0;
}

#center-buttons {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.button {
  padding: 14px;
  margin: 0 7px;
}
`)

export default class GameCanvas extends BaseComponent {
  public canvasManager: CanvasManager | null = null
  private _baseCanvas: BaseCanvasComponent
  private players: Player[] = []
  private centerButtons: HTMLDivElement
  private start: HTMLButtonElement
  public isGameRunning: boolean = false
  private _canvasManagerClass: (new (config: { canvas: Canvas; players: Player[]; maguma: Maguma }) => CanvasManager) | null = null;

  // セッターを使って親からクラスを受け取る
  set canvasManagerClass(
    value: new (config: { canvas: Canvas; players: Player[]; maguma: Maguma }) => CanvasManager
  ) {
    this._canvasManagerClass = value
  }
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <div id="canvas-container">
        <div id="center-buttons">
          <button id="start" class="button">start</button>
          <button class="button" onclick="location.href = '/'">back</button>
        </div>
        <div id="canvas-frame">
          <base-canvas id="canvas"></base-canvas>
        </div>
      </div>
    `
    this._baseCanvas = this.shadow.getElementById('canvas') as BaseCanvasComponent
    this.centerButtons = this.shadow.getElementById('center-buttons') as HTMLDivElement
    this.start = this.shadow.getElementById('start') as HTMLButtonElement
    createEvent<Event>(this.start, 'click', () => {
      this.dispatchEvent(
        new CustomEvent<Player>('setController')
      )
    })
    createEvent<KeyboardEvent>(document, 'keyup', (e) => {
      if (e.key === 'Enter') {
        if (!this.isGameRunning) {
          this.dispatchEvent(
            new CustomEvent<Player>('setController')
          )
        }
        e.stopPropagation()
      }
    })
  }
  onClickStart = async() => {
    const centerButtons = this.centerButtons
    centerButtons.classList.add('hide')
    if (!this._canvasManagerClass) {
      throw new Error('fff')
    }
    this.canvasManager = new this._canvasManagerClass({
      canvas: this.canvas,
      players: this.players.map(player => {
        player.reset()
        return player
      }),
      maguma: Maguma.createMaguma(),
    })
    this.changeGameStatus(true)
    const canvasManager = this.canvasManager
    Logger.group()
    Logger.log('ゲーム開始')
    await this.gameLoop(canvasManager)
    Logger.log('ゲーム終了')
    Logger.groupEnd()
    this.changeGameStatus(false)
    centerButtons.classList.remove('hide')
  }
  changeGameStatus(status: boolean) {
    this.isGameRunning = status
    this.dispatchEvent(
      new CustomEvent<boolean>('changeGameStatus', { detail: status })
    )
  }
  setPlayers(players: Player[]) {
    this.players = players
    this.fillPlayers()
  }
  updatePlayers(coordinate: { id: string, x: number, y: number }) {
    for (const player of this.players) {
      if (player.id === coordinate.id) {
        player.updateFromJson(coordinate)
      }
    }
  }
  private async gameLoop(canvasManager: CanvasManager) {
    const requestAnimationFrameAsync = (): Promise<number> => {
      return new Promise((resolve) => requestAnimationFrame(resolve))
    }
    let lastTimestamp = 0
    while (true) {
      const timestamp = await requestAnimationFrameAsync()
      if (canvasManager.isGameOver(this.players)) {
        canvasManager.endGame()
        break
      }
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp
      }
      canvasManager.loop(timestamp)
      this.dispatchEvent(
        new CustomEvent<Box[]>('updateObject')
      )
    }
  }
  fillPlayers() {
    const canvas = this.baseCanvas.canvas
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height)
    const ctx = canvas.ctx
    const playerCount = this.players.length
    const playerSize = Math.min(canvas.width / (playerCount * 1.5), canvas.height / 4)
    const playerY = 20
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i]
      // 各プレイヤーの `x` 座標を計算
      const playerSpacing = (canvas.width - playerSize * playerCount) / (playerCount + 1)
      const playerX = i * (playerSize + playerSpacing) + playerSpacing
      // プレイヤーの描画
      ctx.fillStyle = player.color
      ctx.fillRect(playerX, playerY, playerSize, playerSize)
      ctx.strokeStyle = 'blue'
      ctx.strokeRect(playerX, playerY, playerSize, playerSize)
      // 目と口を描画
      const eyeWidth = playerSize / 6
      const eyeHeight = playerSize / 6
      const eyeOffsetX = playerSize / 5
      const eyeOffsetY = playerSize / 4
      // 左目
      ctx.fillStyle = 'red'
      ctx.fillRect(playerX + eyeOffsetX, playerY + eyeOffsetY, eyeWidth, eyeHeight)
      // 右目
      ctx.fillRect(
        playerX + playerSize - eyeOffsetX - eyeWidth,
        playerY + eyeOffsetY,
        eyeWidth,
        eyeHeight
      )
      const mouthWidth = playerSize / 2
      const mouthHeight = playerSize / 8
      const mouthOffsetX = (playerSize - mouthWidth) / 2.5
      const mouthOffsetY = playerSize / 1.5
      ctx.fillRect(
        playerX + mouthOffsetX,
        playerY + mouthOffsetY,
        mouthWidth,
        mouthHeight
      )
    }
  }
  get baseCanvas() {
    return this._baseCanvas
  }
  get canvas() {
    return this._baseCanvas.canvas
  }
}

