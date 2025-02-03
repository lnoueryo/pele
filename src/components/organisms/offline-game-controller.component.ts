import config from '../../../config'
import { OfflinePlayer } from '../../entities/player/offline-player'
import GameCanvas from './game-canvas.component'
import BottomController from '../molecules/bottom-controller.component'
import LeftController from '../molecules/left-controller.component'
import RightController from '../molecules/right-controller.component'
import BaseController from '../common/base-controller.component'
import { Logger } from '../../plugins/logger'
import {
  ComputerMode,
  ComputerPlayer,
} from '../../entities/player/computer-player'
import { IPlayer } from '../../entities/interfaces/player.interface'

export default class GameController extends BaseController {
  private player: OfflinePlayer
  private _mode: HTMLSelectElement
  private _gameCanvas: GameCanvas<IPlayer>
  private _leftController: LeftController
  private _rightController: RightController
  private _bottomController: BottomController
  private _sideContainers: NodeListOf<HTMLDivElement>
  private _bottomContainers: NodeListOf<HTMLDivElement>
  constructor() {
    Logger.group()
    Logger.log('初期処理')
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
    <div id="wrapper">
      <select id="mode">
        <option value="time-survival">Time Survival</option>
        <option value="battle-royale">Battle Royale</option>
      </select>
      <div id="controller-wrapper">
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
    </div>
    `
    this._mode = this.shadow.getElementById('mode') as HTMLSelectElement
    this._gameCanvas = this.shadow.querySelector(
      'game-canvas',
    ) as GameCanvas<IPlayer>
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
    this.player = new OfflinePlayer({
      id: 'anonymous',
      ...config.playerSetting,
      vx: 0,
      vy: 0,
      color: `rgb(255,255,255)`,
      isJumping: false,
      isOver: false,
    })
    this.mode.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLSelectElement
      this.gameCanvas.mode = target.value
    })
    this.gameCanvas.addEventListener('setController', this.startGame)
    this.bottomController.addEventListener('setController', this.startGame)
    this.rightController.addEventListener('setController', this.startGame)
    this.gameCanvas.addEventListener('changeGameStatus', (e: Event) => {
      const event = e as CustomEvent<boolean>
      this.bottomController.changeGameStatus(event.detail)
    })
    this.gameCanvas.addEventListener('endGame', (e: Event) => {
      const event = e as CustomEvent<{
        ranking: [
          {
            name: ''
            timestamp: number
          },
        ]
        startTimestamp: number
      }>
      this.gameCanvas.canvasManager?.endGame(event.detail)
      this.mode.classList.remove('hide')
    })
    window.addEventListener('resize', () => {
      this.showController.bind(this)(this.sideContainers, this.bottomContainers)
    })
    Logger.log(this.player)
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

  startGame = async () => {
    Logger.clear()
    this.player = new OfflinePlayer({
      id: 'anonymous',
      ...config.playerSetting,
      vx: 0,
      vy: 0,
      color: `rgb(255,255,255)`,
      isJumping: false,
      isOver: false,
    })
    this.setController(this.player)
    this.leftController.setController(this.player)
    this.rightController.setController(this.player)
    this.bottomController.setController(this.player)
    const players = []
    players.push(this.player)
    if (this.gameCanvas.mode === 'battle-royale') {
      type Computer = {
        id: string
        mode: ComputerMode
        color: string
      }
      const computers: Computer[] = [
        {
          id: '1',
          mode: 'nearest',
          color: `rgb(0,0,255)`,
        },
        {
          id: '2',
          mode: 'fastest',
          color: `rgb(255,0,0)`,
        },
        {
          id: '3',
          mode: 'slowest',
          color: `rgb(0,255,0)`,
        },
        {
          id: '4',
          mode: 'highest',
          color: `rgb(255,255,0)`,
        },
      ]
      computers.forEach((computer) => {
        const cpu = new ComputerPlayer({
          id: computer.id,
          mode: computer.mode,
          ...config.playerSetting,
          vx: 0,
          vy: 0,
          color: computer.color,
          isJumping: false,
          isOver: false,
        })
        players.push(cpu)
      })
    }
    const spacing = 1 / (players.length + 1)
    players.forEach((player, i) => {
      player.updateFromJson({
        x: spacing * (i + 1),
        y: player.y,
      })
    })
    this.mode.classList.add('hide')
    await this.gameCanvas.onClickStart(players)
  }

  get mode() {
    return this._mode!
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
}

const sheet = new CSSStyleSheet()
sheet.replaceSync(`
#wrapper {
  position: relative
}
#mode {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 3;
}
#controller-wrapper {
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
.bottom-container {
  position: relative;
  height: 50vh;
}
.bottom-container .buttons-container {
  position: absolute;
  bottom: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  transform: translate(0px, 50%);
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
