import { MultiPlayerCanvasManager } from './../../entities/canvas_manager/multi_player_canvas_manager';
import { Player, PlayerArg } from '../../entities/player'
import { Game } from '../../entities/game'
import domObject from './dom'
import { WebsocketIO } from '../../plugins/websocket'
import config from '../../../config'
const {
  canvas,
  ctx,
  top,
  left,
  right,
  gamerRight,
  wrapper,
  startButtons,
  verticalTop,
  verticalLeft,
  verticalRight,
} = domObject
let timer: ReturnType<typeof setTimeout> | undefined = undefined
let players: PlayerArg[] = []
const socket = new WebsocketIO(`${config.websocketApiOrigin}/player`)
let isGameStarted = false
let userId = ''
socket.on('connect', () => {
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
  socket.on('login', (id) => {
    userId = id
    const player = Player.createPlayer(userId, canvas)
    socket.emit('login', {
      clientId: id,
      player,
    })
  })
  socket.on('join', (newPlayers: PlayerArg[]) => {
    players = newPlayers
    renderPlayers()
  })
  socket.on('coordinate', (data) => {
    if (data.id !== userId) {
      controller.updateOtherPlayers(data)
    }
  })
  socket.on('start', () => {
    if (isGameStarted) return
    startMultiPlayer()
  })
})
const cm = new MultiPlayerCanvasManager({
  canvas,
  ctx,
  socket,
})
let controller = new Game({
  top,
  left,
  right,
  gamerRight,
  verticalTop,
  verticalLeft,
  verticalRight,
})
function parseBox(buffer: ArrayBuffer) {
  const view = new DataView(buffer)
  const x = view.getFloat32(0)
  const y = view.getFloat32(4)
  const width = view.getFloat32(8)
  const height = view.getFloat32(12)
  const speed = view.getFloat32(16)

  return { x, y, width, height, speed }
}
const startMultiPlayer = () => {
  isGameStarted = true
  startButtons.classList.add('hide')
  const cm = new MultiPlayerCanvasManager({
    canvas,
    ctx,
    socket,
  })
  socket.on('stage', (data) => {
    const boxes = data.map(parseBox)
    cm.updateBoxes(boxes)
  })
  controller = controller.resetGame(players.map((player) => Player.createPlayer(player.id, canvas)))
  controller.startGame(userId)
  cm.loop(0, controller.players, userId)
  timer = setInterval(() => {
    if (cm.isGameOver(controller.players)) {
      clearInterval(timer)
      isGameStarted = false
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
      if (cm.isGameOver(controller.players)) onClickStartMultiPlayer()
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

const onClickStartMultiPlayer = () => {
  socket.emit('start', { id: socket.id })
  startMultiPlayer()
}

const onChangeControllerPositionClicked = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  controller.changeControllerPosition()
}

function renderPlayers(): void {
  const startButtons = document.getElementById('start-buttons')
  if (!startButtons) {
    console.error('Element #start-buttons not found')
    return
  }

  startButtons.innerHTML = ''
  const fragment = document.createDocumentFragment()
  players.forEach((player) => {
    const playerDiv = document.createElement('div')
    playerDiv.textContent = String(player.id)
    fragment.appendChild(playerDiv)
  })
  const button = document.createElement('button')
  button.innerText = 'start'
  button.addEventListener('click', () => onClickStartMultiPlayer())
  startButtons.appendChild(fragment)
  startButtons.appendChild(button)
}


export { main, onClickStartMultiPlayer, onChangeControllerPositionClicked, }
