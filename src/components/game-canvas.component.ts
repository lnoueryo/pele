import { Canvas } from "../entities/canvas"
import { OnePlayerCanvasManager } from "../entities/canvas_manager/one_player_canvas_manager"
import { Maguma } from "../entities/maguma"
import { Player } from "../entities/player"
import { createEvent } from "../utils"
import { BaseComponent } from "./base.component"
const CANVAS_WIDTH_PIXEL = 1600
const CANVAS_HEIGHT_PIXEL = 1600
const CANVAS_RATIO = CANVAS_WIDTH_PIXEL / CANVAS_HEIGHT_PIXEL

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
#canvas-container {
  margin: 0;
  padding: 0;
}

#start-buttons {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#canvas-frame {
  border: 8px solid black;
}

canvas {
  height: 100vh;
}

.button {
  padding: 14px;
  margin: 0 7px;
}
`)

export default class GameCanvas extends BaseComponent {
  private _player: Player
  private _players: Player[] = []
  private _canvas: Canvas
  private onePlayer: HTMLButtonElement
  private startButtons: HTMLDivElement
  public isGameRunning: boolean = false

  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <div id="canvas-container">
        <div id="start-buttons">
          <button id="one-player" class="button">1p start</button>
          <button id="multiple-play" class="button" onclick="location.href='/multiple.html'">multiple start</button>
        </div>
        <div id="canvas-frame">
          <canvas id="canvas"></canvas>
        </div>
      </div>
    `
    const canvas = this.shadow.getElementById('canvas') as HTMLCanvasElement
    this._canvas = new Canvas(canvas)
    this.onePlayer = this.shadow.getElementById('one-player') as HTMLButtonElement
    this.startButtons = this.shadow.getElementById('start-buttons') as HTMLDivElement
    this._player = Player.createPlayer(this.canvas)
    this.adjustCanvasSize()
    const player = this.player
    this.onePlayer.addEventListener('click', () => {
      this.onClickStartOnePlayer()
      this.dispatchEvent(
        new CustomEvent<Player>('startGame', { detail: player })
      )
    })
    createEvent<KeyboardEvent>(document, 'keyup', (e) => {
      if (e.key === 'Enter') {
        if (!this.isGameRunning) {
          this.onClickStartOnePlayer()
          this.dispatchEvent(
            new CustomEvent<Player>('startGame', { detail: player })
          )
        }
        e.stopPropagation()
      }
    })
    window.addEventListener('resize', this.adjustCanvasSize.bind(this))
  }
  onClickStartOnePlayer = async() => {
    const startButtons = this.startButtons
    if (!startButtons) {
      throw new Error('startButtonはnullです')
    }
    if (!startButtons.classList.contains('hide')) {
      startButtons.classList.add('hide')
    }
    startButtons.classList.add('hide')
    this.player.reset()
    this._players = [this.player]
    const canvasManager = new OnePlayerCanvasManager({
      canvas: this.canvas,
      players: this.players,
      maguma: Maguma.createMaguma(this.canvas),
    })
    this.isGameRunning = true
    await canvasManager.loop(0)
    this.isGameRunning = false
    startButtons.classList.remove('hide')
  }
  adjustCanvasSize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const length = width <= height ? width : height
    this.canvas.width = (length - 20) * CANVAS_RATIO + 'px'
    this.canvas.height = (length - 20) * CANVAS_RATIO + 'px'
    this.canvas.pixelWidth = this.canvas.width
    this.canvas.pixelHeight = this.canvas.height
  }
  set player(player: Player) {
    this._player = player
  }
  get player() {
    return this._player!
  }
  get canvas() {
    return this._canvas!
  }
  get players() {
    return this._players
  }
}

