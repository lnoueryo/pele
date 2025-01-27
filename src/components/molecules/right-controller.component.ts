import { BaseComponent } from '../common/base.component'
import { Player } from '../../entities/player'
const sheet = new CSSStyleSheet()
sheet.replaceSync(`
  .button-container {
    width: 47%;
    position: relative;
  }
`)

export default class RightController extends BaseComponent {
  private isControllerReady = false
  private _top: HTMLDivElement
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <controller-button id="top" class="button-container">
        上
      </controller-button>
    `
    this._top = this.shadow.getElementById('top') as HTMLDivElement
  }

  setController(player: Player) {
    if (this.isControllerReady) {
      return
    }
    this.top.addEventListener('touchstart', (e) => {
      player.isJumping || player.jump()
      e.stopPropagation()
      e.preventDefault()
    })
    this.isControllerReady = true
  }
  get top() {
    return this._top!
  }
}
