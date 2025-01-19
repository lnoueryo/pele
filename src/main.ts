import { CanvasManager } from './canvas_manager'
import { Player } from './player'
import { Maguma } from './maguma'
import { Game } from './game'

const createCanvasManager = () => {
  return new CanvasManager({
    canvas,
    ctx,
    maguma: createMaguma(),
  })
}

const createPlayer = (id: number) => {
  const initialParams = {
    id,
    x: canvas.width / 2,
    y: 20,
    width: 40,
    height: 40,
    vx: 0,
    vy: 0,
    vg: 0.5,
    jumpStrength: -15,
    isJumping: false,
    speed: 8,
    color: id ? `rgb(255,255,255)` : `rgb(0,0,0)`,
  }
  return new Player(initialParams)
}

const createMaguma = () => {
  const initialParams = {
    x: 0,
    y: canvas.height - 50,
    width: 800,
    height: 50,
  }
  return new Maguma(initialParams)
}

let tempIndex = 1

export const onStartGameClicked = (index: number) => {
  tempIndex = index
  const buttons = document.getElementById('start-buttons')!
  buttons.classList.add('hide')
  const players = []
  for (let i = 0; i < index; i++) {
    players.push(createPlayer(i))
  }
  const cm = createCanvasManager()
  controller = controller.resetGame(cm, players)
  controller.startGame()
  timer = setInterval(() => {
    if (controller.isGameOver()) {
      clearInterval(timer)
      buttons.classList.remove('hide')
    }
  }, 100)
}

export const onChangeControllerPositionClicked = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  controller.changeControllerPosition()
}

let timer: ReturnType<typeof setTimeout> | undefined = undefined
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!
const top = document.getElementById('top') as HTMLDivElement
const left = document.getElementById('left') as HTMLDivElement
const right = document.getElementById('right') as HTMLDivElement
const gamerRight = document.getElementById('gamer-right') as HTMLDivElement
const wrapper = document.getElementById('wrapper') as HTMLDivElement
const warning = document.getElementById('warning') as HTMLDivElement
const cm = createCanvasManager()
let controller = new Game({
  top,
  left,
  right,
  gamerRight,
  cm,
})
const main = () => {
  controller.showController(wrapper, warning)

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      if (controller.isGameOver()) onStartGameClicked(tempIndex)
      e.stopPropagation()
    }
  })

  window.addEventListener('resize', () => {
    controller.showController(wrapper, warning)
  })
}

main()

export { CanvasManager, Player, Maguma, Game }
