import { CanvasManager } from './../../entities/interfaces/canvas-manager.interface'
import { Box } from '../../entities/box'
import { Canvas } from '../../entities/canvas'
import { Maguma } from '../../entities/maguma'
import { createEvent } from '../../utils'
import BaseCanvasComponent from '../atoms/base-canvas.component'
import { BaseComponent } from '../common/base.component'
import { Logger } from '../../plugins/logger'
import { IPlayer } from '../../entities/interfaces/player.interface'

export default class GameCanvas<T extends IPlayer> extends BaseComponent {
  public canvasManager: CanvasManager | null = null
  private _baseCanvas: BaseCanvasComponent
  private centerButtons: HTMLDivElement
  private start: HTMLButtonElement
  public isGameRunning = false
  private _canvasManagerClass:
    | (new <T extends IPlayer>(config: {
        canvas: Canvas
        players: T[]
        maguma: Maguma
      }) => CanvasManager)
    | null = null

  set canvasManagerClass(
    value: new <T extends IPlayer>(config: {
      canvas: Canvas
      players: T[]
      maguma: Maguma
    }) => CanvasManager,
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
    this._baseCanvas = this.shadow.getElementById(
      'canvas',
    ) as BaseCanvasComponent
    this.centerButtons = this.shadow.getElementById(
      'center-buttons',
    ) as HTMLDivElement
    this.start = this.shadow.getElementById('start') as HTMLButtonElement
    createEvent<Event>(this.start, 'click', () => {
      this.dispatchEvent(new CustomEvent<IPlayer>('setController'))
    })
    createEvent<KeyboardEvent>(document, 'keyup', (e) => {
      if (e.key === 'Enter') {
        if (!this.isGameRunning) {
          this.dispatchEvent(new CustomEvent<IPlayer>('setController'))
        }
        e.stopPropagation()
      }
    })
  }
  onClickStart = async (players: T[]) => {
    const centerButtons = this.centerButtons
    centerButtons.classList.add('hide')
    if (!this._canvasManagerClass) {
      throw new Error('fff')
    }
    this.canvasManager = new this._canvasManagerClass({
      canvas: this.canvas,
      players,
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
      new CustomEvent<boolean>('changeGameStatus', { detail: status }),
    )
  }
  private async gameLoop(canvasManager: CanvasManager, targetFPS = 60) {
    const frameDuration = 1000 / targetFPS // 目標のフレーム時間（ミリ秒）

    const requestAnimationFrameAsync = (): Promise<number> => {
      return new Promise((resolve) => requestAnimationFrame(resolve))
    }

    let lastTimestamp = performance.now() // 初回のタイムスタンプを取得
    let accumulatedTime = 0 // フレームスキップ防止用

    while (true) {
      const timestamp = await requestAnimationFrameAsync()
      let deltaTime = (timestamp - lastTimestamp) / 1000 // 秒単位で計算
      accumulatedTime += deltaTime * 1000 // ミリ秒単位

      // 目標のフレーム時間を超えないように調整
      while (accumulatedTime >= frameDuration) {
        accumulatedTime -= frameDuration
        canvasManager.loop(timestamp)
        this.dispatchEvent(new CustomEvent<Box[]>('updateObject'))
      }

      if (canvasManager.isGameOver()) {
        canvasManager.endGame()
        break
      }

      lastTimestamp = timestamp // 最後のタイムスタンプを更新
    }
  }
  fillPlayers(players: IPlayer[]) {
    const canvas = this.baseCanvas.canvas
    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height)
    const ctx = canvas.ctx
    const playerCount = players.length
    const playerSize = Math.min(
      canvas.width / (playerCount * 1.5),
      canvas.height / 4,
    )
    const playerY = 20
    for (let i = 0; i < players.length; i++) {
      const player = players[i]
      // 各プレイヤーの `x` 座標を計算
      const playerSpacing =
        (canvas.width - playerSize * playerCount) / (playerCount + 1)
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
      ctx.fillRect(
        playerX + eyeOffsetX,
        playerY + eyeOffsetY,
        eyeWidth,
        eyeHeight,
      )
      // 右目
      ctx.fillRect(
        playerX + playerSize - eyeOffsetX - eyeWidth,
        playerY + eyeOffsetY,
        eyeWidth,
        eyeHeight,
      )
      const mouthWidth = playerSize / 2
      const mouthHeight = playerSize / 8
      const mouthOffsetX = (playerSize - mouthWidth) / 2.5
      const mouthOffsetY = playerSize / 1.5
      ctx.fillRect(
        playerX + mouthOffsetX,
        playerY + mouthOffsetY,
        mouthWidth,
        mouthHeight,
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
