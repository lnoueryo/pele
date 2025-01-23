import { Player } from '../../entities/player'
import { BaseComponent } from '../common/base.component'
import GameCanvas from './game-canvas.component'
import BottomController from '../molecules/bottom-controller.component'
import LeftController from '../molecules/left-controller.component'
import RightController from '../molecules/right-controller.component'

const KEYBOARDS = { top: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight' }

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

export default class GameController extends BaseComponent {

  private _gameCanvas: GameCanvas
  private _leftController: LeftController
  private _rightController: RightController
  private _bottomController: BottomController
  private _sideContainers: NodeListOf<HTMLDivElement>
  private _bottomContainers: NodeListOf<HTMLDivElement>
  private onePlayer: HTMLButtonElement
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <div id="wrapper">
        <div class="side-container">
          <left-controller class="buttons-container justify-between" />
        </div>
        <game-canvas id="game-canvas">
          <button id="one-player" class="button">start</button>
          <button class="button" onclick="location.href = '/'">back</button>
        </game-canvas>
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
    this._bottomController = this.shadow.querySelector('bottom-controller')! as BottomController
    this._sideContainers = this.shadow.querySelectorAll('.side-container')
    this._bottomContainers = this.shadow.querySelectorAll('.bottom-container')
    this.onePlayer = this.shadow.getElementById('one-player') as HTMLButtonElement
    this.onePlayer.addEventListener('click', () => {
      this.startGame(this.gameCanvas.player)
      this.gameCanvas.onClickStart()
    })
    this.showController()
    this.gameCanvas.addEventListener('startGame', (event) => {
      const customEvent = event as CustomEvent<Player>
      this.startGame(customEvent.detail)
    })
    window.addEventListener('resize', this.showController.bind(this))
  }

  private startGame(player: Player) {
    document.addEventListener('keydown', (event) => {
      if (event.key === KEYBOARDS.left) player.moveToLeft()
      else if (event.key === KEYBOARDS.right) player.moveToRight()
      else if (event.key === KEYBOARDS.top && !player.isJumping)
        player.jump()
    })
    document.addEventListener('keyup', (event) => {
      if (event.key === KEYBOARDS.left || event.key === KEYBOARDS.right)
        player.stopMovement()
    })
    this.leftController.startGame(player)
    this.rightController.startGame(player)
    this.bottomController.startGame(player)
  }
  private showController() {
    if (this.isMobileDevice()) {
      if (window.innerWidth - 200 < window.innerHeight) {
        // 縦向きまたは十分な画面サイズではない端末
        Array.from(this.sideContainers).forEach((element) => {
          element.classList.add('hide')
        })
        Array.from(this.bottomContainers).forEach((element) => {
          element.classList.remove('hide')
        })
        return
      }

      // 横向き
      Array.from(this.sideContainers).forEach((element) => {
        element.classList.remove('hide')
      })
      Array.from(this.bottomContainers).forEach((element) => {
        element.classList.add('hide')
      })
    } else {
      // PCの場合
      Array.from(this.sideContainers).forEach((element) => {
        element.classList.add('hide')
      })
      Array.from(this.bottomContainers).forEach((element) => {
        element.classList.add('hide')
      })
    }
  }
  private isMobileDevice = () => {
    return (
      typeof window.orientation !== 'undefined' ||
      navigator.userAgent.indexOf('IEMobile') !== -1
    )
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
