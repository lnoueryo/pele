import { BaseComponent } from '../common/base.component'
import { Player } from '../../entities/player'
const sheet = new CSSStyleSheet()
sheet.replaceSync(`
.button-container {
  width: 100%;
  position: relative;
}
`)

export default class BottomController extends BaseComponent {
  private isControllerReady = false
  private _verticalTop: HTMLDivElement
  private _verticalLefts: NodeListOf<Element>
  private _verticalRights: NodeListOf<Element>
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
    <div class="w-100">
      <controller-button id="vertical-top" class="button-container">
        上
      </controller-button>
      <div class="d-flex w-100" style="justify-content: space-between">
        <controller-button class="vertical-left button-container">
          左
        </controller-button>
        <controller-button class="vertical-right button-container">
          右
        </controller-button>
        <controller-button class="vertical-left button-container">
          左
        </controller-button>
        <controller-button class="vertical-right button-container">
          右
        </controller-button>
      </div>
    </div>
    `
    this._verticalTop = this.shadow.getElementById('vertical-top') as HTMLDivElement
    this._verticalLefts = this.shadow.querySelectorAll('controller-button.vertical-left') as NodeListOf<Element>
    this._verticalRights = this.shadow.querySelectorAll('controller-button.vertical-right') as NodeListOf<Element>
    console.log(this.verticalLefts);
    console.log(this.verticalRights);
    console.log(this.verticalTop);
  }
  setController(player: Player) {
    if (this.isControllerReady) {
      return
    }
    [ ...this.verticalRights ].forEach((verticalRight) => {
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
    });

    [ ...this.verticalLefts ].forEach((verticalLeft) => {
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
    });

    this.verticalTop.addEventListener('touchstart', (e) => {
      player.isJumping || player.jump()
      e.stopPropagation()
      e.preventDefault()
    })
    this.isControllerReady = true
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
