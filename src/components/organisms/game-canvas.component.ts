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
  public player: Player
  private players: Player[] = []
  private startButtons: HTMLDivElement
  public isGameRunning: boolean = false

  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <div id="canvas-container">
        <div id="start-buttons">
          <slot />
        </div>
        <div id="canvas-frame">
          <base-canvas id="canvas"></base-canvas>
        </div>
      </div>
    `
    this._baseCanvas = this.shadow.getElementById('canvas') as BaseCanvasComponent
    this.startButtons = this.shadow.getElementById('start-buttons') as HTMLDivElement
    this.player = Player.createPlayer('anonymous')
    createEvent<KeyboardEvent>(document, 'keyup', (e) => {
      if (e.key === 'Enter') {
        if (!this.isGameRunning) {
          this.dispatchEvent(
            new CustomEvent<Player>('startGame')
          )
        }
        e.stopPropagation()
      }
    })
  }
  onClickStart = async() => {
    const startButtons = this.startButtons
    startButtons.classList.add('hide')
    const canvasManager = new OnePlayerCanvasManager({
      canvas: this.canvas,
      players: this.players,
      maguma: Maguma.createMaguma(),
    })
    this.isGameRunning = true
    await canvasManager.loop(0)
    this.isGameRunning = false
    startButtons.classList.remove('hide')
  }
  setPlayers(players: Player[]) {
    this.players = players
  }
  get baseCanvas() {
    return this._baseCanvas
  }
  get canvas() {
    return this._baseCanvas.canvas
  }
}

