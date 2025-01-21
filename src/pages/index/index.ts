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
  warning,
  startButtons,
} = domObject
let timer: ReturnType<typeof setTimeout> | undefined = undefined

const cm = createCanvasManager()
let controller = new Game({
  top,
  left,
  right,
  gamerRight,
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
  controller.showController(wrapper, warning)
  cm.adjustCanvasSize()
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      if (cm.isGameOver(controller.players)) onClickStartOnePlayer()
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

function createCanvasManager() {
  return new OnePlayerCanvasManager({
    canvas,
    ctx,
  })
}

export { main, onClickStartOnePlayer, onChangeControllerPositionClicked, }
