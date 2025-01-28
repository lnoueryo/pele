import { BaseComponent } from '../common/base.component'
import { Player } from '../../entities/player/player'

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

  setController(player: Player) {

    this.top.removeEventListener('touchstart', this.touchStartTopHandler)

    this.touchStartTopHandler = this.createTouchStartTopHandler(player)

    this.top.addEventListener('touchstart', this.touchStartTopHandler)
  }
  private touchStartTopHandler!: (event: TouchEvent) => void
  private createTouchStartTopHandler = (player: Player) => {
    return (event: TouchEvent) => {
      player.isJumping || player.jump()
      event.stopPropagation()
      event.preventDefault()
    }
  }
  get top() {
    return this._top!
  }
}

const sheet = new CSSStyleSheet()
sheet.replaceSync(`
  .button-container {
    width: 47%;
    position: relative;
  }
`)