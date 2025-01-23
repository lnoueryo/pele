import { OnePlayerCanvasManager } from "../../entities/canvas_manager/one_player_canvas_manager"
import { Maguma } from "../../entities/maguma"
import { Player } from "../../entities/player"
import { createEvent } from "../../utils"
import BaseCanvasComponent from "../atoms/base-canvas.component"
import { BaseComponent } from "../common/base.component"

const sheet = new CSSStyleSheet()
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

.button {
  padding: 14px;
  margin: 0 7px;
}
`)

export default class GameCanvas extends BaseComponent {
  private _baseCanvas: BaseCanvasComponent
  private _player: Player
  private _players: Player[] = []
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
          <base-canvas id="canvas"></base-canvas>
        </div>
      </div>
    `
    this._baseCanvas = this.shadow.getElementById('canvas') as BaseCanvasComponent
    this.onePlayer = this.shadow.getElementById('one-player') as HTMLButtonElement
    this.startButtons = this.shadow.getElementById('start-buttons') as HTMLDivElement
    this._player = Player.createPlayer(this.canvas)
    this.baseCanvas.adjustCanvasSize()
    const player = this.player
    this.onePlayer.addEventListener('click', () => {
      this.onClickStart()
      this.dispatchEvent(
        new CustomEvent<Player>('startGame', { detail: player })
      )
    })
    createEvent<KeyboardEvent>(document, 'keyup', (e) => {
      if (e.key === 'Enter') {
        if (!this.isGameRunning) {
          this.onClickStart()
          this.dispatchEvent(
            new CustomEvent<Player>('startGame', { detail: player })
          )
        }
        e.stopPropagation()
      }
    })
    window.addEventListener('resize', this.baseCanvas.adjustCanvasSize.bind(this))
  }
  onClickStart = async() => {
    const startButtons = this.startButtons
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
  set player(player: Player) {
    this._player = player
  }
  get player() {
    return this._player!
  }
  get players() {
    return this._players
  }
  get baseCanvas() {
    return this._baseCanvas
  }
  get canvas() {
    return this._baseCanvas.canvas
  }
}

