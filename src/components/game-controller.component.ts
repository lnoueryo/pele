import { Player } from '../entities/player'
import { BaseComponent } from './base.component';
import GameCanvas from './game-canvas.component';
import BottomController from './molecules/bottom-controller.component';
import LeftController from './molecules/left-controller.component';
import RightController from './molecules/right-controller.component';

const KEYBOARDS = { top: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight' }

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
.button {
  padding: 14px;
  margin: 0 7px;
}

#warning {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

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
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}

.button-container {
  width: 46%;
  position: relative;
}

.button-size {
  padding-top: 50%;
}

.controller {
  -webkit-user-select: none; /* Chrome, Safari, Opera */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  user-select: none; /* Standard syntax */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hide {
  display: none !important;
}

`)

export default class GameController extends BaseComponent {

  private _gameCanvas: GameCanvas
  private _leftController: LeftController
  private _rightController: RightController
  private _bottomController: BottomController
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <div id="wrapper">
        <div class="side-container">
          <left-controller class="buttons-container justify-between" />
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
    this._gameCanvas = this.shadow.querySelector('game-canvas')! as GameCanvas
    this._leftController = this.shadow.querySelector('left-controller')! as LeftController
    this._rightController = this.shadow.querySelector('right-controller')! as RightController
    this._bottomController = this.shadow.querySelector('bottom-controller')! as BottomController
    this.showController()
    this.gameCanvas.addEventListener('startGame', (event) => {
      const customEvent = event as CustomEvent<Player>
      this.startGame(customEvent.detail)
      this.leftController.startGame(customEvent.detail)
      this.rightController.startGame(customEvent.detail)
      this.bottomController.startGame(customEvent.detail)
    })
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
  }
  private showController() {
    const sideContainers = this.shadow.querySelectorAll('.side-container')
    const bottomContainers = this.shadow.querySelectorAll('.bottom-container')
    if (this.isMobileDevice()) {
      if (window.innerWidth - 200 < window.innerHeight) {
        // 縦向きまたは十分な画面サイズではない端末
        Array.from(sideContainers).forEach((element) => {
          element.classList.add('hide')
        })
        Array.from(bottomContainers).forEach((element) => {
          element.classList.remove('hide')
        })
        return
      }

      // 横向き
      Array.from(sideContainers).forEach((element) => {
        element.classList.remove('hide')
      })
      Array.from(bottomContainers).forEach((element) => {
        element.classList.add('hide')
      })
    } else {
      // PCの場合
      Array.from(sideContainers).forEach((element) => {
        element.classList.add('hide')
      })
      Array.from(bottomContainers).forEach((element) => {
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
}
