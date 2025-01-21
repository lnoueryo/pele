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
  warning,
  startButtons,
} = domObject
let timer: ReturnType<typeof setTimeout> | undefined = undefined
let players: PlayerArg[] = []
const socket = new WebsocketIO(`${config.websocketApiOrigin}/player`)

let userId = ''
socket.on('connect', () => {
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
  socket.on('login', (id) => {
    console.log(id)
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
    delete data[userId]
    controller.updateOtherPlayers(data)
  })
  socket.on('start', () => {
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
})

const startMultiPlayer = () => {
  startButtons.classList.add('hide')
  const cm = new MultiPlayerCanvasManager({
    canvas,
    ctx,
    socket,
  })
  socket.on('stage', (data) => {
    cm.updateBoxes(data.boxes)
  })
  controller = controller.resetGame(players.map((player) => new Player(player)))
  controller.startGame(userId)
  cm.loop(0, controller.players, userId)
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
      if (cm.isGameOver(controller.players)) onClickStartMultiPlayer()
      e.stopPropagation()
    }
  })
  window.addEventListener('resize', () => {
    controller.showController(wrapper, warning)
  })
}

const onClickStartMultiPlayer = () => {
  socket.emit('start', { id: socket.id })
  socket.emit('a', '')
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
