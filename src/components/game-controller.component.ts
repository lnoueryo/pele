import { Player } from '../entities/player'
import GameCanvas from './game-canvas.component'
customElements.define('game-canvas', GameCanvas)
const KEYBOARDS = { top: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight' }

export default class GameController extends HTMLElement {
  private _top: HTMLDivElement | null = null
  private _left: HTMLDivElement | null = null
  private _right: HTMLDivElement | null = null
  private _gamerRight: HTMLDivElement | null = null
  private _verticalTop: HTMLDivElement | null = null
  private _verticalLeft: HTMLDivElement | null = null
  private _verticalRight: HTMLDivElement | null = null
  private _gameCanvas: GameCanvas | null = null
  connectedCallback() {
    this.innerHTML = `
      <div id="wrapper">
        <div class="side-container">
          <div class="buttons-container justify-between">
            <div id="left" class="button-container">
              <button class="controller">左</button>
              <div class="button-size"></div>
            </div>
            <div id="right" class="button-container">
              <button class="controller">右</button>
              <div class="button-size"></div>
            </div>
          </div>
        </div>
        <game-canvas id="game-canvas"></game-canvas>
        <div class="side-container">
          <div class="buttons-container">
            <div id="top" class="button-container">
              <button class="controller">上</button>
              <div class="button-size"></div>
            </div>
            <div id="gamer-right" class="button-container hide">
              <button class="controller">右</button>
              <div class="button-size"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-container">
        <div class="buttons-container">
          <div id="vertical-left" class="button-container">
            <button class="controller">左</button>
            <div class="button-size"></div>
          </div>
          <div id="vertical-right" class="button-container">
            <button class="controller">右</button>
            <div class="button-size"></div>
          </div>
          <div id="vertical-top" class="button-container">
            <button class="controller">上</button>
            <div class="button-size"></div>
          </div>
        </div>
      </div>
    `
    this._top = document.getElementById('top') as HTMLDivElement
    this._left = document.getElementById('left') as HTMLDivElement
    this._right = document.getElementById('right') as HTMLDivElement
    this._gamerRight = document.getElementById('gamer-right') as HTMLDivElement
    this._verticalTop = document.getElementById('vertical-top') as HTMLDivElement
    this._verticalLeft = document.getElementById('vertical-left') as HTMLDivElement
    this._verticalRight = document.getElementById('vertical-right') as HTMLDivElement
    if (!this._top || !this._left || !this._right || !this._gamerRight || !this._verticalTop || !this._verticalLeft || !this._verticalRight) {
      throw new Error('buttonがnullです')
    }

    this._gameCanvas = this.querySelector('game-canvas')! as GameCanvas
    this.showController()
    this.gameCanvas.addEventListener('startGame', (event) => {
      const customEvent = event as CustomEvent<Player>
      this.startGame(customEvent.detail)
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
    this.right.addEventListener('touchstart', (e) => {
      player.moveToRight()
      e.stopPropagation()
      e.preventDefault()
    })
    this.right.addEventListener('touchend', (e) => {
      player.stopMovement()
      e.stopPropagation()
      e.preventDefault()
    })
    this.gamerRight.addEventListener('touchstart', (e) => {
      player.moveToRight()
      e.stopPropagation()
      e.preventDefault()
    })
    this.gamerRight.addEventListener('touchend', (e) => {
      player.stopMovement()
      e.stopPropagation()
      e.preventDefault()
    })
    this.left.addEventListener('touchstart', (e) => {
      player.moveToLeft()
      e.stopPropagation()
      e.preventDefault()
    })
    this.left.addEventListener('touchend', (e) => {
      player.stopMovement()
      e.stopPropagation()
      e.preventDefault()
    })
    this.top.addEventListener('touchstart', (e) => {
      console.log(player)
      player.isJumping || player.jump()
      e.stopPropagation()
      e.preventDefault()
    })
    this.verticalRight.addEventListener('touchstart', (e) => {
      player.moveToRight()
      e.stopPropagation()
      e.preventDefault()
    })
    this.verticalRight.addEventListener('touchend', (e) => {
      player.stopMovement()
      e.stopPropagation()
      e.preventDefault()
    })
    this.verticalLeft.addEventListener('touchstart', (e) => {
      player.moveToLeft()
      e.stopPropagation()
      e.preventDefault()
    })
    this.verticalLeft.addEventListener('touchend', (e) => {
      player.stopMovement()
      e.stopPropagation()
      e.preventDefault()
    })
    this.verticalTop.addEventListener('touchstart', (e) => {
      player.isJumping || player.jump()
      e.stopPropagation()
      e.preventDefault()
    })
  }
  private showController() {
    const sideContainers = document.getElementsByClassName('side-container')
    const bottomContainers = document.getElementsByClassName('bottom-container')

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
  get top() {
    return this._top!
  }
  get left() {
    return this._left!
  }
  get right() {
    return this._right!
  }
  get gamerRight() {
    return this._gamerRight!
  }
  get verticalTop() {
    return this._verticalTop!
  }
  get verticalLeft() {
    return this._verticalLeft!
  }
  get verticalRight() {
    return this._verticalRight!
  }
  get gameCanvas() {
    return this._gameCanvas!
  }
}
