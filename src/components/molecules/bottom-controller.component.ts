import { BaseComponent } from '../common/base.component'
import { Player } from '../../entities/player/player'
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

export default class BottomController extends BaseComponent {
  private isControllerReady = false
  private controller: HTMLDivElement
  private start: HTMLDivElement
  private startButton: HTMLDivElement
  private _verticalTop: HTMLDivElement
  private _verticalLefts: NodeListOf<Element>
  private _verticalRights: NodeListOf<Element>
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
          <controller-button class="vertical-left button-container">
            左
          </controller-button>
          <controller-button class="vertical-right button-container">
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
    this._verticalLefts = this.shadow.querySelectorAll(
      'controller-button.vertical-left',
    ) as NodeListOf<Element>
    this._verticalRights = this.shadow.querySelectorAll(
      'controller-button.vertical-right',
    ) as NodeListOf<Element>
    this.startButton.addEventListener('click', () =>
      this.dispatchEvent(new CustomEvent<undefined>('setController')),
    )
  }
  setController(player: Player) {
    if (this.isControllerReady) {
      return
    }
    Array.from(this.verticalRights).forEach((verticalRight) => {
      verticalRight.addEventListener('touchstart', (e) => {
        player.moveToRight()
        e.stopPropagation()
        e.preventDefault()
      })
      verticalRight.addEventListener('touchend', (e) => {
        player.stopMovement()
        e.stopPropagation()
        e.preventDefault()
      })
    })
    Array.from(this.verticalLefts).forEach((verticalLeft) => {
      verticalLeft.addEventListener('touchstart', (e) => {
        player.moveToLeft()
        e.stopPropagation()
        e.preventDefault()
      })
      verticalLeft.addEventListener('touchend', (e) => {
        player.stopMovement()
        e.stopPropagation()
        e.preventDefault()
      })
    })

    this.verticalTop.addEventListener('touchstart', (e) => {
      player.isJumping || player.jump()
      e.stopPropagation()
      e.preventDefault()
    })
    this.isControllerReady = true
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
  get verticalLefts() {
    return this._verticalLefts!
  }
  get verticalRights() {
    return this._verticalRights!
  }
}
