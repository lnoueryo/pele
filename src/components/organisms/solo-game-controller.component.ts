import config from '../../../config'
import { Player } from '../../entities/player'
import GameCanvas from './game-canvas.component'
import BottomController from '../molecules/bottom-controller.component'
import LeftController from '../molecules/left-controller.component'
import RightController from '../molecules/right-controller.component'
import BaseController from '../common/base-controller.component'
import { OnePlayerCanvasManager } from '../../entities/canvas_manager/one_player_canvas_manager'

const sheet = new CSSStyleSheet()
sheet.replaceSync(`
#wrapper {
  position: relative;
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.side-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}
.bottom-container .buttons-container {
  position: absolute;
  bottom: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.buttons-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
  .button {
  padding: 14px;
  margin: 0 7px;
}
`)
let playerSetting: {
  x: number
  y: number
  width: number
  height: number
  vg: number
  jumpStrength: number
  speed: number
}
async function loadPlayerSetting() {
  const response = await fetch(`${config.httpApiOrigin}/players`)
  if (!response.ok) {
    throw new Error('Failed to fetch player settings')
  }
  return await response.json()
}
playerSetting = await loadPlayerSetting()
export default class GameController extends BaseController {
  private player: Player
  private _gameCanvas: GameCanvas
  private _leftController: LeftController
  private _rightController: RightController
  private _bottomController: BottomController
  private _sideContainers: NodeListOf<HTMLDivElement>
  private _bottomContainers: NodeListOf<HTMLDivElement>
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <div id="wrapper">
        <div class="side-container">
          <left-controller class="buttons-container" />
        </div>
        <game-canvas id="game-canvas"></game-canvas>
        <div class="side-container">
          <right-controller class="buttons-container" />
        </div>
      </div>
      <div class="bottom-container">
        <bottom-controller class="buttons-container" />
      </div>
    `
    this._gameCanvas = this.shadow.querySelector('game-canvas') as GameCanvas
    this._leftController = this.shadow.querySelector('left-controller') as LeftController
    this._rightController = this.shadow.querySelector('right-controller') as RightController
    this._bottomController = this.shadow.querySelector('bottom-controller') as BottomController
    this._sideContainers = this.shadow.querySelectorAll('.side-container')
    this._bottomContainers = this.shadow.querySelectorAll('.bottom-container')
    this.gameCanvas.canvasManagerClass  = OnePlayerCanvasManager
    this.showController(this.sideContainers, this.bottomContainers)
    this.player = Player.createPlayer('anonymous', playerSetting)
    this.gameCanvas.addEventListener('setController', ()  => {
      this.setController(this.player)
      this.leftController.setController(this.player)
      this.rightController.setController(this.player)
      this.bottomController.setController(this.player)
      this.gameCanvas.setPlayers([this.player])
      this.gameCanvas.onClickStart()
    })
    window.addEventListener('resize', () => {
      this.showController.bind(this)(this.sideContainers, this.bottomContainers)
    })
  }

  get gameCanvas() {
    return this._gameCanvas!
  }
  get leftController() {
    return this._leftController
  }
  get rightController() {
    return this._rightController
  }
  get bottomController() {
    return this._bottomController
  }
  get sideContainers() {
    return this._sideContainers
  }
  get bottomContainers() {
    return this._bottomContainers
  }
}
