import { Player } from '../../entities/player'
import GameCanvas from './game-canvas.component'
import BottomController from '../molecules/bottom-controller.component'
import LeftController from '../molecules/left-controller.component'
import RightController from '../molecules/right-controller.component'
import { WebsocketIO } from '../../plugins/websocket'
import config from '../../../config'
import BaseController from '../common/base-controller.component'
import { MultiPlayerCanvasManager } from '../../entities/canvas_manager/multi_player_canvas_manager'

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

export default class GameController extends BaseController {
  private player: Player | null = null
  private _gameCanvas: GameCanvas
  private _leftController: LeftController
  private _rightController: RightController
  private _bottomController: BottomController
  private _sideContainers: NodeListOf<HTMLDivElement>
  private _bottomContainers: NodeListOf<HTMLDivElement>
  private _socket: WebsocketIO
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <div id="wrapper">
        <div class="side-container">
          <left-controller class="buttons-container justify-between" />
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
    this._gameCanvas = this.shadow.querySelector('game-canvas') as GameCanvas
    this._leftController = this.shadow.querySelector('left-controller') as LeftController
    this._rightController = this.shadow.querySelector('right-controller') as RightController
    this._bottomController = this.shadow.querySelector('bottom-controller') as BottomController
    this._sideContainers = this.shadow.querySelectorAll('.side-container')
    this._bottomContainers = this.shadow.querySelectorAll('.bottom-container')
    this.showController(this.sideContainers, this.bottomContainers)
    this.gameCanvas.canvasManagerClass = MultiPlayerCanvasManager
    // TODO websocketのコネクション作成とイベント設定
    // this.inputName()
    this._socket = new WebsocketIO(`${config.websocketApiOrigin}/player`)
    this.socket.on('connect', (e) => {
      console.log('connected')
      this.socket.on('disconnect', () => {
        console.log('user disconnected')
      })
      this.socket.on('connected', async(id) => {
        this.socket.emit('create-player', id);
      })
      this.socket.on('create-player', async(player) => {
        this.player = Player.createPlayerFromServer(player)
      })
      this.socket.on('join', (newPlayers: {
        id: string
        x: number
        y: number
        width: number
        height: number
        vg: number
        speed: number
        jumpStrength: number
        color: string
      }[]) => {
        if (!this.player) {
          throw new Error('no player')
        }
        const filteredPlayer = newPlayers.filter(player => player.id !== this.player?.id)
        this.gameCanvas.setPlayers([this.player, ...filteredPlayer.map(player => Player.createPlayerFromServer(player))])
      })
      this.socket.on('start', () => {
        if (this.gameCanvas.isGameRunning) return
        this.gameCanvas.onClickStart()
      })
      this.socket.on('coordinate', (data: { id: string, x: number, y: number, isOver: boolean }) => {
        if (data.id !== this.player?.id) {
          this.gameCanvas.updatePlayers(data)
        }
      })
      this.socket.on('stage', (data) => {
        const boxes = data.map(this.parseBox)
        this.gameCanvas.canvasManager?.updateBoxes(boxes)
        if (!this.gameCanvas.isGameRunning) {
          console.log(data)
        }
      })
    })
    this.gameCanvas.addEventListener('setController', () => {
      if (!this.player) {
        throw new Error('no player')
      }
      this.socket.emit('start', this.player.convertToJson())
      this.setController(this.player)
      this.leftController.setController(this.player)
      this.rightController.setController(this.player)
      this.bottomController.setController(this.player)
      this.gameCanvas.onClickStart()
    })
    this.gameCanvas.addEventListener('updateObject', () => {
      this.socket.emit('coordinate', this.player?.convertToJson())
    })
    window.addEventListener('resize', () => {
      this.showController.bind(this)(this.sideContainers, this.bottomContainers)
    })
  }

  connectedCallback() {

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
  private inputName(): string {
    const name = prompt('名前を入力してね')
    if (name === null) {
      return location.href = '/'
    } else if(!name) {
      return this.inputName()
    }
    return name
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
    return this._socket
  }
}
