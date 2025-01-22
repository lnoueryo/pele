import { OnePlayerCanvasManager } from '../../entities/canvas_manager/one_player_canvas_manager'
import { Player } from '../../entities/player'
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
  // warning,
  startButtons,
  verticalTop,
  verticalLeft,
  verticalRight,
} = domObject
let timer: ReturnType<typeof setTimeout> | undefined = undefined

const cm = createCanvasManager()
let controller = new Game({
  top,
  left,
  right,
  gamerRight,
  verticalTop,
  verticalLeft,
  verticalRight,
})

const startOnePlayer = () => {
  startButtons.classList.add('hide')
  const players = []
  players.push(Player.createPlayer('1', canvas))
  const cm = createCanvasManager()
  controller = controller.resetGame(players)
  controller.startGame('1')
  cm.loop(0, controller.players, '1')
  timer = setInterval(() => {
    if (cm.isGameOver(controller.players)) {
      clearInterval(timer)
      startButtons.classList.remove('hide')
    }
  }, 100)
}

const main = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  const length = width <= height ? width : height
  cm.adjustCanvasSize(length)
  controller.showController(wrapper)
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      if (cm.isGameOver(controller.players)) onClickStartOnePlayer()
      e.stopPropagation()
    }
  })
  window.addEventListener('resize', () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const length = width <= height ? width : height
    cm.adjustCanvasSize(length)
    controller.showController(wrapper)
  })
}

const onClickStartOnePlayer = startOnePlayer

const onChangeControllerPositionClicked = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  controller.changeControllerPosition()
}

function createCanvasManager() {
  return new OnePlayerCanvasManager({
    canvas,
    ctx,
  })
}

export { main, onClickStartOnePlayer, onChangeControllerPositionClicked, }
