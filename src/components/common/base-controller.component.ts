import { Player } from '../../entities/player/player'
import { BaseComponent } from '../common/base.component'
import { hideElements, showElements } from '../../utils'
import { Logger } from '../../plugins/logger'

const KEYBOARDS = { top: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight' }
export default class BaseController extends BaseComponent {
  constructor() {
    super()
  }

  protected setController(player: Player) {
    document.removeEventListener('keydown', this.keydownHandler)
    document.removeEventListener('keyup', this.keyupHandler)

    this.keydownHandler = this.createKeydownHandler(player)
    this.keyupHandler = this.createKeyupHandler(player)

    document.addEventListener('keydown', this.keydownHandler)
    document.addEventListener('keyup', this.keyupHandler)
  }
  protected showController(
    sideContainers: NodeListOf<HTMLElement>,
    bottomContainers: NodeListOf<HTMLElement>,
  ) {
    if (this.isMobileDevice()) {
      if (window.innerWidth - 200 < window.innerHeight) {
        Logger.log('モバイル　縦向き')
        // 縦向きまたは十分な画面サイズではない端末
        hideElements(sideContainers)
        return showElements(bottomContainers)
      }
      // 横向き
      Logger.log('モバイル　横向き')
      showElements(sideContainers)
      return hideElements(bottomContainers)
    }
    // PCの場合
    Logger.log('PC')
    hideElements(sideContainers)
    hideElements(bottomContainers)
  }
  private keydownHandler!: (event: KeyboardEvent) => void
  private keyupHandler!: (event: KeyboardEvent) => void

  private createKeydownHandler = (player: Player) => {
    return (event: KeyboardEvent) => {
      if (event.key === KEYBOARDS.left) player.moveToLeft()
      else if (event.key === KEYBOARDS.right) player.moveToRight()
      else if (event.key === KEYBOARDS.top && !player.isJumping) player.jump()
    }
  }

  private createKeyupHandler = (player: Player) => {
    return () => {
      player.stopMovement()
    }
  }
  private isMobileDevice = () => {
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches
    const userAgent = navigator.userAgent || navigator.vendor
    const isMobileUA =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent,
      )
    return isSmallScreen || isMobileUA
  }
}
