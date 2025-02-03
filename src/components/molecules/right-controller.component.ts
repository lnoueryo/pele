import { IPlayer } from '../../entities/interfaces/player.interface'
import { createEvent } from '../../utils'
import { BaseComponent } from '../common/base.component'

export default class RightController extends BaseComponent {
  private _top: HTMLDivElement
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <fab-button>開始</fab-button>
      <controller-button id="top" class="button-container">
        上
      </controller-button>
    `
    this._top = this.shadow.getElementById('top') as HTMLDivElement
    const fabButton = this.shadow.querySelector('fab-button') as HTMLDivElement
    createEvent<Event>(fabButton, 'click', () => {
      this.dispatchEvent(new CustomEvent<IPlayer>('setController'))
    })
  }

  setController(player: IPlayer) {
    this.top.removeEventListener('touchstart', this.touchStartTopHandler)

    this.touchStartTopHandler = this.createTouchStartTopHandler(player)

    this.top.addEventListener('touchstart', this.touchStartTopHandler)
  }
  private touchStartTopHandler!: (event: TouchEvent) => void
  private createTouchStartTopHandler = (player: IPlayer) => {
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
  fab-button {
    position: fixed;
    right: 10px;
    top: 10px;
  }
`)
