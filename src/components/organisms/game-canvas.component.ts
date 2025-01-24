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
  private _baseCanvas: BaseCanvasComponent
  private players: Player[] = []
  private centerButtons: HTMLDivElement
  private start: HTMLButtonElement
  public isGameRunning: boolean = false

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
    const canvasManager = new OnePlayerCanvasManager({
      canvas: this.canvas,
      players: this.players,
      maguma: Maguma.createMaguma(),
    })
    this.isGameRunning = true
    await canvasManager.loop(0)
    this.isGameRunning = false
    centerButtons.classList.remove('hide')
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

