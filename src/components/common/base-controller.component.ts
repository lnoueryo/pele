import { Player } from '../../entities/player'
import { BaseComponent } from '../common/base.component'

const KEYBOARDS = { top: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight' }
export default class BaseController extends BaseComponent {
  constructor() {
    super()
  }

  protected setController(player: Player) {
    document.addEventListener('keydown', (event) => {
      if (event.key === KEYBOARDS.left) player.moveToLeft()
      else if (event.key === KEYBOARDS.right) player.moveToRight()
      else if (event.key === KEYBOARDS.top && !player.isJumping)
        player.jump()
    })
    document.addEventListener('keyup', (event) => {
      if (event.key === KEYBOARDS.left || event.key === KEYBOARDS.right)
        player.stopMovement()
    })
  }
  protected showController(
    sideContainers: NodeListOf<HTMLElement>,
    bottomContainers: NodeListOf<HTMLElement>
  ) {
    if (this.isMobileDevice()) {
      if (window.innerWidth - 200 < window.innerHeight) {
        // 縦向きまたは十分な画面サイズではない端末
        this.hideElements(sideContainers)
        return this.showElements(bottomContainers)
      }
      // 横向き
      this.showElements(sideContainers)
      return this.hideElements(bottomContainers)
    }
    // PCの場合
    this.hideElements(sideContainers)
    this.hideElements(bottomContainers)
  }
  private hideElements(elements: NodeListOf<HTMLElement>) {
    Array.from(elements).forEach((element) => {
      element.classList.add('hide')
    })
  }
  private showElements(elements: NodeListOf<HTMLElement>) {
    Array.from(elements).forEach((element) => {
      element.classList.remove('hide')
    })
  }
  private isMobileDevice = () => {
    return (
      typeof window.orientation !== 'undefined' ||
      navigator.userAgent.indexOf('IEMobile') !== -1
    )
  }
}
