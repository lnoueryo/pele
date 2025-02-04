import { CanvasManager } from './../../entities/interfaces/canvas-manager.interface'
import { Canvas } from '../../entities/canvas'
import { Maguma } from '../../entities/maguma'
import { createEvent, isMobileDevice } from '../../utils'
import BaseCanvasComponent from '../atoms/base-canvas.component'
import { BaseComponent } from '../common/base.component'
import { Logger } from '../../plugins/logger'
import { IPlayer } from '../../entities/interfaces/player.interface'
import { OnlinePlayer } from '../../entities/player/online-player'
import { MainPlayer } from '../../entities/player/main-player'

export default class GameCanvas<
  T extends IPlayer,
  U extends CanvasManager,
> extends BaseComponent {
  public mode = 'time-survival'
  public canvasManagerClass:
    | (new (params: {
        canvas: Canvas
        players: IPlayer[]
        maguma: Maguma
      }) => U)
    | null = null
  public canvasManager: U | null = null
  private _baseCanvas: BaseCanvasComponent
  private centerButtons: HTMLDivElement
  private start: HTMLButtonElement
  private dropdown: HTMLDivElement
  public isGameRunning = false

  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <div id="canvas-container">
        <div id="dropdown">
          <select id="mode-select">
            <option value="time-survival">Time Survival</option>
            <option value="battle-royale">Battle Royale</option>
          </select>
        </div>
        <div id="center-buttons" class="mobile-hide">
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
    this.dropdown = this.shadow.getElementById('dropdown') as HTMLDivElement
    const modeSelect = this.shadow.getElementById(
      'mode-select',
    ) as HTMLSelectElement
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
    modeSelect.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLSelectElement
      this.mode = target.value
    })
    this.switchHideButtons()
    window.addEventListener('resize', this.switchHideButtons)
  }
  onClickStart = async (players: T[]) => {
    if (!this.canvasManagerClass) {
      throw new Error('no canvas manager')
    }
    const centerButtons = this.centerButtons
    const dropdown = this.dropdown
    centerButtons.classList.add('hide')
    dropdown.classList.add('hide')
    this.changeGameStatus(true)
    this.canvasManager = new this.canvasManagerClass({
      canvas: this.canvas,
      players,
      maguma: Maguma.createMaguma(),
    })
    Logger.group()
    Logger.log('ゲーム開始')
    await this.gameLoop(this.canvasManager)
    Logger.log('ゲーム終了')
    Logger.groupEnd()
    this.changeGameStatus(false)
    centerButtons.classList.remove('hide')
    dropdown.classList.remove('hide')
  }
  changeGameStatus(status: boolean) {
    this.isGameRunning = status
    this.dispatchEvent(
      new CustomEvent<boolean>('changeGameStatus', { detail: status }),
    )
  }
  private async gameLoop(canvasManager: U, targetFPS = 60) {
    const frameDuration = 1000 / targetFPS // 目標のフレーム時間（ミリ秒）

    const requestAnimationFrameAsync = (): Promise<number> => {
      return new Promise((resolve) => requestAnimationFrame(resolve))
    }

    const startTimestamp = Date.now()
    let lastTimestamp = performance.now()
    let accumulatedTime = 0

    while (true) {
      const timestamp = await requestAnimationFrameAsync()
      const deltaTime = (timestamp - lastTimestamp) / 1000
      accumulatedTime += deltaTime * 1000

      // 目標のフレーム時間を超えないように調整
      while (accumulatedTime >= frameDuration) {
        accumulatedTime -= frameDuration
        canvasManager.loop(timestamp, startTimestamp)
        this.dispatchEvent(new CustomEvent('updateObject'))
      }

      if (canvasManager.isGameOver) {
        this.dispatchEvent(
          new CustomEvent<{
            ranking: { name: string; timestamp: number }[]
            startTimestamp: number
          }>('endGame', {
            detail: {
              ranking: canvasManager.players
                .map((player) => {
                  return {
                    name: player.name,
                    timestamp: player.timestamp,
                  }
                })
                .sort((a, b) => b.timestamp - a.timestamp),
              startTimestamp,
            },
          }),
        )
        break
      }
      {
        startTimestamp
      }
      lastTimestamp = timestamp // 最後のタイムスタンプを更新
    }
  }
  fillPlayers(players: OnlinePlayer[] & MainPlayer[]) {
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
      ctx.fillStyle = 'black'
      const fontSize = Math.max(12, playerSize / 8)
      ctx.font = `${fontSize}px Arial`
      ctx.textAlign = 'center'
      const textX = playerX + playerSize / 2
      const textY = playerY + playerSize + fontSize * 1.5
      ctx.fillText(player.name, textX, textY, playerSize * 0.8)
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
  private switchHideButtons = () => {
    if (isMobileDevice()) {
      this.centerButtons.classList.add('mobile-hide')
    } else {
      this.centerButtons.classList.remove('mobile-hide')
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
  position: relative;
}

#center-buttons {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#dropdown {
  position: absolute;
  top: 5%;
  right: 5%;
}

#mode-select {
  height: 28px;
  min-width: 112px;
}

.button {
  padding: 14px;
  margin: 0 7px;
}
  .mobile-hide {
    display: none;
  }
`)
