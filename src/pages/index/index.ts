import { CanvasManager } from '../../entities/canvas_manager'
import { Player } from '../../entities/player'
import { Maguma } from '../../entities/maguma'
import { Game } from '../../entities/game'
import domObject from './dom'
const {
  canvas,
  ctx,
  top,
  left,
  right,
  gamerRight,
  wrapper,
  warning,
  startButtons,
} = domObject
let timer: ReturnType<typeof setTimeout> | undefined = undefined
const maguma = new Maguma({
  x: 0,
  y: canvas.height - 50,
  width: 800,
  height: 50,
})

const cm = new CanvasManager({
  canvas,
  ctx,
  maguma,
})
let controller = new Game({
  top,
  left,
  right,
  gamerRight,
  cm,
})

const startOnePlayer = () => {
  startButtons.classList.add('hide')
  const players = []
  players.push(Player.createPlayer('1', canvas))
  const cm = createCanvasManager()
  controller = controller.resetGame(cm, players)
  controller.startGame('1')
  timer = setInterval(() => {
    if (controller.isGameOver()) {
      clearInterval(timer)
      startButtons.classList.remove('hide')
    }
  }, 100)
}

const main = () => {
  controller.showController(wrapper, warning)
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      if (controller.isGameOver()) onClickStartOnePlayer()
      e.stopPropagation()
    }
  })
  window.addEventListener('resize', () => {
    controller.showController(wrapper, warning)
  })
}

const onClickStartOnePlayer = startOnePlayer

const onChangeControllerPositionClicked = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  controller.changeControllerPosition()
}

const createCanvasManager = () => {
  const maguma = new Maguma({
    x: 0,
    y: canvas.height - 50,
    width: 800,
    height: 50,
  })
  return new CanvasManager({
    canvas,
    ctx,
    maguma,
  })
}

export { main, onClickStartOnePlayer, onChangeControllerPositionClicked, }
