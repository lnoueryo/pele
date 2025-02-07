import { IPlayer } from '../../entities/interfaces/player.interface'
import { BaseComponent } from '../common/base.component'

export default class LeftController extends BaseComponent {
  private _left: HTMLDivElement
  private _right: HTMLDivElement
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <fab-button onclick="location.href='/'">戻る</fab-button>
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

  setController(player: IPlayer) {
    console.log(player)
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
  }
  get left() {
    return this._left!
  }
  get right() {
    return this._right!
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
    left: 10px;
    top: 10px;
  }
`)
