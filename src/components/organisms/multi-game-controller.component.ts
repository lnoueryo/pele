import { OnlinePlayer } from '../../entities/player/online-player'
import GameCanvas from './game-canvas.component'
import BottomController from '../molecules/bottom-controller.component'
import LeftController from '../molecules/left-controller.component'
import RightController from '../molecules/right-controller.component'
import { WebsocketIO } from '../../plugins/websocket'
import config from '../../../config'
import BaseController from '../common/base-controller.component'
import { Logger } from '../../plugins/logger'
import { onAuthStateChanged, User } from 'firebase/auth'
import auth from '../../plugins/firebase/firebase-auth'

export default class GameController extends BaseController {
  private _user: User | null = null
  private players: OnlinePlayer[] = []
  private _gameCanvas: GameCanvas<OnlinePlayer>
  private _leftController: LeftController
  private _rightController: RightController
  private _bottomController: BottomController
  private _sideContainers: NodeListOf<HTMLDivElement>
  private _bottomContainers: NodeListOf<HTMLDivElement>
  private _socket: WebsocketIO | null = null
  constructor() {
    Logger.group()
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <div id="wrapper" class="hide">
        <div class="side-container">
          <left-controller class="buttons-container" />
        </div>
        <game-canvas id="game-canvas"></game-canvas>
        <div class="side-container">
          <right-controller class="buttons-container" />
        </div>
      </div>
      <div class="bottom-container">
        <bottom-controller class="buttons-container" />
      </div>
    `
    this._gameCanvas = this.shadow.querySelector(
      'game-canvas',
    ) as GameCanvas<OnlinePlayer>
    this._leftController = this.shadow.querySelector(
      'left-controller',
    ) as LeftController
    this._rightController = this.shadow.querySelector(
      'right-controller',
    ) as RightController
    this._bottomController = this.shadow.querySelector(
      'bottom-controller',
    ) as BottomController
    this._sideContainers = this.shadow.querySelectorAll('.side-container')
    this._bottomContainers = this.shadow.querySelectorAll('.bottom-container')
    this.showController(this.sideContainers, this.bottomContainers)
    this.gameCanvas.addEventListener('setController', this.onClickStartGame)
    this.bottomController.addEventListener(
      'setController',
      this.onClickStartGame,
    )
    this.gameCanvas.addEventListener('changeGameStatus', (e: Event) => {
      const event = e as CustomEvent<boolean>
      this.bottomController.changeGameStatus(event.detail)
    })
    this.gameCanvas.addEventListener('updateObject', () => {
      this.socket.emit('position', this.player?.convertToJson())
    })
    Logger.log(
      this.gameCanvas,
      this.leftController,
      this.rightController,
      this.bottomController,
      this.sideContainers,
      this.bottomContainers,
      this.gameCanvas,
    )
    Logger.groupEnd()
  }

  async connectedCallback() {
    const wrapper = this.shadow.getElementById('wrapper')!
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this._user = user
        wrapper.classList.remove('hide')
        this.setWebsocket()
      } else {
        location.href = '/login.html'
      }
    })
    window.addEventListener('resize', () => {
      this.showController.bind(this)(this.sideContainers, this.bottomContainers)
      this.gameCanvas.fillPlayers(this.players)
    })
  }

  private onClickStartGame = () => {
    this.socket.emit('start')
  }

  startGame = async () => {
    Logger.groupEnd()
    Logger.clear()
    this.setController(this.player)
    this.leftController.setController(this.player)
    this.rightController.setController(this.player)
    this.bottomController.setController(this.player)
    await this.gameCanvas.onClickStart(this.players)
    Logger.groupEnd()
  }

  private setWebsocket() {
    this._socket = new WebsocketIO(`${config.websocketApiOrigin}/game`)
    this.socket.on('connect', () => {
      Logger.group()
      Logger.log('connected')
      Logger.log(this.user)
      this.socket.emit('player', this.user)
      this.socket.on('disconnect', () => {
        Logger.log('user disconnected')
      })
      this.socket.on('join', this.getPlayers)
      this.socket.on(
        'start',
        (
          players: {
            id: string
            name: string
            x: number
            y: number
            width: number
            height: number
            vg: number
            speed: number
            jumpStrength: number
            color: string
          }[],
        ) => {
          Logger.log('start', players)
          if (this.gameCanvas.isGameRunning) return
          this.getPlayers(players)
          this.startGame()
        },
      )
      this.socket.on(
        'position',
        (data: { id: string; x: number; y: number; isOver: boolean }) => {
          this.updatePlayers(data)
        },
      )
      this.socket.on('stage', ({ boxes: BoxesArrayBuffer, currentTime }) => {
        const boxes = BoxesArrayBuffer.map(this.parseBox)
        this.gameCanvas.canvasManager?.updateBoxes(boxes)
      })
      this.socket.on('end', (endData: {
        ranking: [
          {
            name: string
            timestamp: number
          },
        ]
        startTimestamp: number
      }) => {
        if (!this.gameCanvas.canvasManager) {
          throw new Error()
        }
        const game = this.gameCanvas.canvasManager
        game.isGameOver = true
        const timer = setInterval(() => {
          if (!this.gameCanvas.isGameRunning) {
            clearInterval(timer)
            game.endGame(endData)
          }
        })
      })
    })
  }

  private parseBox(buffer: ArrayBuffer) {
    const view = new DataView(buffer)
    const x = view.getFloat32(0)
    const y = view.getFloat32(4)
    const width = view.getFloat32(8)
    const height = view.getFloat32(12)
    const speed = view.getFloat32(16)
    return { x, y, width, height, speed }
  }
  private getPlayers = (
    newPlayers: {
      id: string
      name: string
      x: number
      y: number
      width: number
      height: number
      vg: number
      speed: number
      jumpStrength: number
      color: string
    }[],
  ) => {
    this.players = newPlayers.map((player) => {
      return new OnlinePlayer({
        ...player,
        vx: 0,
        vy: 0,
        isJumping: false,
        isOver: false,
      })
    })
    this.gameCanvas.fillPlayers(this.players)
    Logger.log('newPlayers', this.players)
  }
  updatePlayers(coordinate: { id: string; x: number; y: number }) {
    for (const player of this.players) {
      if (player.id === coordinate.id) {
        player.updateFromJson(coordinate)
      }
    }
  }
  get gameCanvas() {
    return this._gameCanvas!
  }
  get leftController() {
    return this._leftController
  }
  get rightController() {
    return this._rightController
  }
  get bottomController() {
    return this._bottomController
  }
  get sideContainers() {
    return this._sideContainers
  }
  get bottomContainers() {
    return this._bottomContainers
  }
  get socket() {
    return this._socket!
  }
  get user() {
    return this._user!
  }
  get player() {
    return this.players.find((player) => player.id === this.user.uid)!
  }
}

const sheet = new CSSStyleSheet()
sheet.replaceSync(`
#wrapper {
  position: relative;
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.side-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}
.bottom-container .buttons-container {
  position: absolute;
  bottom: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.buttons-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
  .button {
  padding: 14px;
  margin: 0 7px;
}
`)
