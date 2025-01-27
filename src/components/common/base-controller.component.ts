import { Player } from '../../entities/player'
import { BaseComponent } from '../common/base.component'
import { hideElements, showElements } from '../../utils'

const KEYBOARDS = { top: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight' }
export default class BaseController extends BaseComponent {
  private isControllerReady = false

  constructor() {
    super()
  }

  protected setController(player: Player) {
    if (this.isControllerReady) {
      return
    }
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
    this.isControllerReady = true
  }
  protected showController(
    sideContainers: NodeListOf<HTMLElement>,
    bottomContainers: NodeListOf<HTMLElement>
  ) {
    if (this.isMobileDevice()) {
      if (window.innerWidth - 200 < window.innerHeight) {
        // 縦向きまたは十分な画面サイズではない端末
        hideElements(sideContainers)
        return showElements(bottomContainers)
      }
      // 横向き
      showElements(sideContainers)
      return hideElements(bottomContainers)
    }
    // PCの場合
    hideElements(sideContainers)
    hideElements(bottomContainers)
  }
  private isMobileDevice = () => {
    return (
      typeof window.orientation !== 'undefined' ||
      navigator.userAgent.indexOf('IEMobile') !== -1
    )
  }
}
