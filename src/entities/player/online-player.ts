import { Logger } from '../../plugins/logger'
import { Box } from '../box'
import { Canvas } from '../canvas'
import { CanvasObject } from '../interfaces/canvas-object.interface'
export type PlayerData = {
  id: string
  x: number
  y: number
  width: number
  height: number
  vx: number
  vy: number
  vg: number
  jumpStrength: number
  isJumping: boolean
  speed: number
  color: string
  isOver: boolean
}
export class Player implements CanvasObject {
  private _id
  private _x
  private _y
  private _width
  private _height
  private vx
  private vy
  private _vg
  private _jumpStrength
  private _isJumping
  private _speed
  public color
  private _isOver
  constructor(params: PlayerData) {
    this._id = params.id
    this._x = params.x
    this._y = params.y
    this._width = params.width
    this._height = params.height
    this.vx = params.vx
    this.vy = params.vy
    this._vg = params.vg
    this._jumpStrength = params.jumpStrength
    this._isJumping = params.isJumping
    this._speed = params.speed
    this.color = params.color
    this._isOver = params.isOver
  }

  moveToLeft() {
    this.vx = -this._speed
  }

  moveToRight() {
    this.vx = this._speed
  }

  jump() {
    this.vy = this._jumpStrength
    this._isJumping = true
  }

  stopMovement() {
    this.vx = 0
  }

  moveOnIdle() {
    this.vy += this._vg
    this._x += this.vx
    this._y += this.vy
  }

  moveOnTopBox(boxY: number) {
    this._y = boxY - this.height
    this.vy = 0
    this._isJumping = false
  }

  isPlayerCollidingWithBox(box: Box) {
    return (
      this.x + this.width > box.x &&
      this.x < box.x + box.width &&
      this.y + this.height > box.y &&
      this.y < box.y + box.height &&
      this.vy >= 0
    )
  }

  convertToJson() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      vx: this.vx,
      vy: this.vy,
      vg: this.vg,
      jumpStrength: this.jumpStrength,
      isJumping: this.isJumping,
      speed: this.speed,
      color: this.color,
      isOver: this.isOver,
    }
  }

  updateFromJson(params: { x: number; y: number }) {
    this._x = params.x
    this._y = params.y
  }

  isGameOver() {
    this._isOver = this.y - this.height > 1
  }

  isMovingToRight() {
    return 0 <= this.vx
  }

  reset() {
    this._x = 0.5
    this._y = 0.1
    this.vx = 0
    this.vy = 0
    this._isJumping = false
    this._isOver = false
  }

  getCanvasSize(canvas: Canvas) {
    return {
      x: this.x * canvas.width,
      y: this.y * canvas.height,
      width: this.width * canvas.width,
      height: this.height * canvas.height,
    }
  }

  get id() {
    return this._id
  }

  get x() {
    return this._x
  }

  get y() {
    return this._y
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  get jumpStrength() {
    return -this._jumpStrength
  }

  get isJumping() {
    return this._isJumping
  }

  get vg() {
    return this._vg
  }

  get speed() {
    return this._speed
  }

  get isOver() {
    return this._isOver
  }

  static createPlayer = (
    id: string,
    playerSetting: {
      x: number
      y: number
      width: number
      height: number
      vg: number
      jumpStrength: number
      speed: number
    },
  ) => {
    Logger.log('create player')
    return new Player({
      id,
      ...playerSetting,
      vx: 0,
      vy: 0,
      isJumping: false,
      color: `rgb(255,255,255)`,
      isOver: false,
    })
  }

  static createPlayerFromServer = (player: {
    id: string
    x: number
    y: number
    width: number
    height: number
    vg: number
    speed: number
    jumpStrength: number
    color: string
  }) => {
    Logger.log('create player from server')
    return new Player({
      id: player.id,
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height,
      vx: 0,
      vy: 0,
      vg: player.vg,
      speed: player.speed,
      jumpStrength: player.jumpStrength,
      color: player.color,
      isJumping: false,
      isOver: false,
    })
  }
}
