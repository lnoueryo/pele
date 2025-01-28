import config from '../../../config'
import { SoloPlayer } from '../../entities/player/solo-player'
import GameCanvas from './game-canvas.component'
import BottomController from '../molecules/bottom-controller.component'
import LeftController from '../molecules/left-controller.component'
import RightController from '../molecules/right-controller.component'
import BaseController from '../common/base-controller.component'
import { OnePlayerCanvasManager } from '../../entities/canvas_manager/one_player_canvas_manager'
import { Logger } from '../../plugins/logger'

export default class GameController extends BaseController {
  private player: SoloPlayer
  private _gameCanvas: GameCanvas<SoloPlayer>
  private _leftController: LeftController
  private _rightController: RightController
  private _bottomController: BottomController
  private _sideContainers: NodeListOf<HTMLDivElement>
  private _bottomContainers: NodeListOf<HTMLDivElement>
  constructor() {
    Logger.group()
    Logger.log('初期処理')
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
        <bottom-controller class="buttons-container">
          <button>start</button>
        </bottom-controller>
      </div>
    `
    this._gameCanvas = this.shadow.querySelector(
      'game-canvas',
    ) as GameCanvas<SoloPlayer>
    this._leftController = this.shadow.querySelector(
      'left-controller',
    ) as LeftController
    this._rightController = this.shadow.querySelector(
      'right-controller',
    ) as RightController
    this._bottomController = this.shadow.querySelector(
      'bottom-controller',
    ) as BottomController
    this._sideContainers = this.shadow.querySelectorAll('.side-container')
    this._bottomContainers = this.shadow.querySelectorAll('.bottom-container')
    this.gameCanvas.canvasManagerClass = OnePlayerCanvasManager
    this.showController(this.sideContainers, this.bottomContainers)
    this.player = new SoloPlayer({
      id: 'anonymous',
      ...config.playerSetting,
      vx: 0,
      vy: 0,
      color: `rgb(255,255,255)`,
      isJumping: false,
      isOver: false,
    })
    this.gameCanvas.addEventListener('setController', this.startGame)
    this.bottomController.addEventListener('setController', this.startGame)
    this.gameCanvas.addEventListener('changeGameStatus', (e: Event) => {
      const event = e as CustomEvent<boolean>
      this.bottomController.changeGameStatus(event.detail)
    })
    window.addEventListener('resize', () => {
      this.showController.bind(this)(this.sideContainers, this.bottomContainers)
    })
    Logger.log(this.player)
    Logger.log(
      this.gameCanvas,
      this.leftController,
      this.rightController,
      this.bottomController,
      this.sideContainers,
      this.bottomContainers,
      this.gameCanvas,
    )
    Logger.groupEnd()
  }

  startGame = async () => {
    Logger.clear()
    this.player = new SoloPlayer({
      id: 'anonymous',
      ...config.playerSetting,
      vx: 0,
      vy: 0,
      color: `rgb(255,255,255)`,
      isJumping: false,
      isOver: false,
    })
    this.setController(this.player)
    this.leftController.setController(this.player)
    this.rightController.setController(this.player)
    this.bottomController.setController(this.player)
    await this.gameCanvas.onClickStart([this.player])
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
