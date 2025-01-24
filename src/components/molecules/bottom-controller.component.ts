import { BaseComponent } from '../common/base.component'
import { Player } from '../../entities/player'
const sheet = new CSSStyleSheet()
sheet.replaceSync(`
.button-container {
  width: 30%;
  position: relative;
}
`)

export default class BottomController extends BaseComponent {
  private _verticalTop: HTMLDivElement
  private _verticalLeft: HTMLDivElement
  private _verticalRight: HTMLDivElement
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <controller-button id="vertical-left" class="button-container">
        左
      </controller-button>
      <controller-button id="vertical-right" class="button-container">
        右
      </controller-button>
      <controller-button id="vertical-top" class="button-container">
        上
      </controller-button>
    `
    this._verticalTop = this.shadow.getElementById('vertical-top') as HTMLDivElement
    this._verticalLeft = this.shadow.getElementById('vertical-left') as HTMLDivElement
    this._verticalRight = this.shadow.getElementById('vertical-right') as HTMLDivElement
  }
  setController(player: Player) {
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
