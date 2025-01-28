import { BaseComponent } from '../common/base.component'
import { Player } from '../../entities/player/player'
const sheet = new CSSStyleSheet()
sheet.replaceSync(`
  .button-container {
    width: 47%;
    position: relative;
  }
`)

export default class LeftController extends BaseComponent {
  private isControllerReady = false
  private _left: HTMLDivElement
  private _right: HTMLDivElement
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <controller-button id="left" class="button-container">
        左
      </controller-button>
      <controller-button id="right" class="button-container">
        右
      </controller-button>
    `
    this._left = this.shadow.getElementById('left') as HTMLDivElement
    this._right = this.shadow.getElementById('right') as HTMLDivElement
  }

  setController(player: Player) {
    if (this.isControllerReady) {
      return
    }
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
    this.isControllerReady = true
  }
  get left() {
    return this._left!
  }
  get right() {
    return this._right!
  }
}
