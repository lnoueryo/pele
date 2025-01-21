import { Player, PlayerArg } from './player'

const KEYBOARDS = { top: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight' }

type IGame = {
  top: HTMLDivElement
  left: HTMLDivElement
  right: HTMLDivElement
  gamerRight: HTMLDivElement
  players?: Player[]
  controllerPosition?: string
}

export class Game {
  private top
  private left
  private right
  private gamerRight
  public players
  private controllerPosition
  constructor(params: IGame) {
    this.top = params.top
    this.left = params.left
    this.right = params.right
    this.gamerRight = params.gamerRight
    this.players = params.players || []
    this.controllerPosition = params.controllerPosition || 'default'
  }

  changeControllerPosition() {
    if (this.controllerPosition == 'default') {
      this.top.classList.add('hide')
      this.right.classList.add('hide')
      this.right.parentElement?.classList.remove('justify-between')
      this.gamerRight.classList.remove('hide')
      this.controllerPosition = 'gamer'
    } else if (this.controllerPosition == 'gamer') {
      this.top.classList.remove('hide')
      this.right.classList.remove('hide')
      this.right.parentElement?.classList.add('justify-between')
      this.gamerRight.classList.add('hide')
      this.controllerPosition = 'default'
    }
  }

  execute = (id: string) => {
    if (this.players.length === 0) return
    const player = this.players.find(player => player.id === id)!
    player.isJumping || player.jump()
  }

  updatePlayers(players: Player[]) {
    return new Game({
      top: this.top,
      left: this.left,
      right: this.right,
      gamerRight: this.gamerRight,
      players,
      controllerPosition: this.controllerPosition,
    })
  }

  resetGame(players: Player[]) {
    return new Game({
      top: this.top,
      left: this.left,
      right: this.right,
      gamerRight: this.gamerRight,
      players,
      controllerPosition: this.controllerPosition,
    })
  }

  startGame(userId: string) {
    const player = this.players.find(player => player.id === userId)!
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
    this.gamerRight.addEventListener('touchstart', (e) => {
      player.moveToRight()
      e.stopPropagation()
      e.preventDefault()
    })
    this.gamerRight.addEventListener('touchend', (e) => {
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
    this.top.addEventListener('touchstart', (e) => {
      player.isJumping || player.jump()
      e.stopPropagation()
      e.preventDefault()
    })

    document.removeEventListener('touchstart', () => this.execute(userId))
    if (this.controllerPosition == 'gamer') {
      document.addEventListener('touchstart',  () => this.execute(userId))
    }
  }

  showController(wrapper: HTMLDivElement, warning: HTMLDivElement) {
    const sideContainers = document.getElementsByClassName('side-container')

    if (this.isMobileDevice()) {
      if (window.innerWidth - 200 < window.innerHeight) {
        // 縦向きまたは十分な画面サイズではない端末
        wrapper.classList.add('hide')
        warning.classList.remove('hide')
        return
      }

      // 横向き
      Array.from(sideContainers).forEach((element) => {
        element.classList.remove('hide')
      })
    } else {
      // PCの場合
      Array.from(sideContainers).forEach((element) => {
        element.classList.add('hide')
      })
    }

    wrapper.classList.remove('hide')
    warning.classList.add('hide')
  }

  isMobileDevice = () => {
    return (
      typeof window.orientation !== 'undefined' ||
      navigator.userAgent.indexOf('IEMobile') !== -1
    )
  }

  updateOtherPlayers(players: {[key: string]: PlayerArg}) {
    this.players.forEach((player) => {
      if (player.id in players) {
        player.updateFromJson(players[player.id])
      }
    })
  }

}
