import { IPlayer } from '../../entities/interfaces/player.interface'
import { BaseComponent } from '../common/base.component'

export default class BottomController extends BaseComponent {
  private controller: HTMLDivElement
  private start: HTMLDivElement
  private startButton: HTMLDivElement
  private _verticalTop: HTMLDivElement
  private _verticalLeft: HTMLDivElement
  private _verticalRight: HTMLDivElement
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
    <div class="w-100">
      <div id="controller" class="hide">
        <div class="d-flex justify-center">
          <controller-button id="vertical-top" class="button-container">
            上
          </controller-button>
        </div>
        <div class="d-flex w-100" style="justify-content: space-around">
          <controller-button id="vertical-left" class="button-container">
            左
          </controller-button>
          <controller-button id="vertical-right" class="button-container">
            右
          </controller-button>
        </div>
      </div>
      <div id="start">
        <div class="w-100">
          <controller-button id="start-button" class="button-container">
            開始
          </controller-button>
        </div>
      </div>
    </div>
    `
    this.controller = this.shadow.getElementById('controller') as HTMLDivElement
    this.start = this.shadow.getElementById('start') as HTMLDivElement
    this.startButton = this.shadow.getElementById(
      'start-button',
    ) as HTMLDivElement
    this._verticalTop = this.shadow.getElementById(
      'vertical-top',
    ) as HTMLDivElement
    this._verticalLeft = this.shadow.getElementById(
      'vertical-left',
    ) as HTMLDivElement
    this._verticalRight = this.shadow.getElementById(
      'vertical-right',
    ) as HTMLDivElement
    this.startButton.addEventListener('click', () =>
      this.dispatchEvent(new CustomEvent<undefined>('setController')),
    )
  }
  setController(player: IPlayer) {
    this.verticalLeft.removeEventListener(
      'touchstart',
      this.touchStartLeftHandler,
    )
    this.verticalLeft.removeEventListener('touchend', this.touchEndLeftHandler)
    this.verticalRight.removeEventListener(
      'touchstart',
      this.touchStartRightHandler,
    )
    this.verticalRight.removeEventListener(
      'touchend',
      this.touchEndRightHandler,
    )
    this.verticalTop.removeEventListener(
      'touchstart',
      this.touchStartTopHandler,
    )

    this.touchStartLeftHandler = this.createTouchStartLeftHandler(player)
    this.touchEndLeftHandler = this.createTouchEndLeftHandler(player)
    this.touchStartRightHandler = this.createTouchStartRightHandler(player)
    this.touchEndRightHandler = this.createTouchStartRightHandler(player)
    this.touchStartTopHandler = this.createTouchStartTopHandler(player)

    this.verticalLeft.addEventListener('touchstart', this.touchStartLeftHandler)
    this.verticalLeft.addEventListener('touchend', this.touchEndLeftHandler)
    this.verticalRight.addEventListener(
      'touchstart',
      this.touchStartRightHandler,
    )
    this.verticalRight.addEventListener('touchend', this.touchEndRightHandler)
    this.verticalTop.addEventListener('touchstart', this.touchStartTopHandler)
  }
  private touchStartLeftHandler!: (event: TouchEvent) => void
  private touchEndLeftHandler!: (event: TouchEvent) => void
  private touchStartRightHandler!: (event: TouchEvent) => void
  private touchEndRightHandler!: (event: TouchEvent) => void
  private touchStartTopHandler!: (event: TouchEvent) => void

  private createTouchStartLeftHandler = (player: IPlayer) => {
    return (event: TouchEvent) => {
      player.moveToLeft()
      event.stopPropagation()
      event.preventDefault()
    }
  }

  private createTouchEndLeftHandler = (player: IPlayer) => {
    return (event: TouchEvent) => {
      player.stopMovement()
      event.stopPropagation()
      event.preventDefault()
    }
  }

  private createTouchStartRightHandler = (player: IPlayer) => {
    return (event: TouchEvent) => {
      player.moveToRight()
      event.stopPropagation()
      event.preventDefault()
    }
  }

  private createTouchEndRightHandler = (player: IPlayer) => {
    return (event: TouchEvent) => {
      player.stopMovement()
      event.stopPropagation()
      event.preventDefault()
    }
  }

  private createTouchStartTopHandler = (player: IPlayer) => {
    return (event: TouchEvent) => {
      player.isJumping || player.jump()
      event.stopPropagation()
      event.preventDefault()
    }
  }

  changeGameStatus(status: boolean) {
    if (status) {
      this.start.classList.add('hide')
      this.controller.classList.remove('hide')
      return
    }
    this.controller.classList.add('hide')
    this.start.classList.remove('hide')
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
}

const sheet = new CSSStyleSheet()
sheet.replaceSync(`
  .button-container {
    width: 33%;
    position: relative;
  }
  #vertical-top {
    margin-bottom: 32px;
  }
`)
