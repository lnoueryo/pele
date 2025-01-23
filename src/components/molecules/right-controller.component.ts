
import { BaseComponent } from '../base.component'
import { Player } from '../../entities/player'
const sheet = new CSSStyleSheet()
sheet.replaceSync(`
  .button-container {
    width: 47%;
    position: relative;
  }
`)

export default class RightController extends BaseComponent {
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

  startGame(player: Player) {
    this.top.addEventListener('touchstart', (e) => {
      player.isJumping || player.jump()
      e.stopPropagation()
      e.preventDefault()
    })
  }
  get top() {
    return this._top!
  }
}
