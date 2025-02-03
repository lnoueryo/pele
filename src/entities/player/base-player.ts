import { Box } from '../box'
import { Canvas } from '../canvas'
export type PlayerData = {
  name: string
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
export abstract class BasePlayer {
  protected _name
  protected _x
  protected _y
  protected _width
  protected _height
  protected _vx
  protected _vy
  protected _vg
  protected _jumpStrength
  protected _isJumping
  protected _speed
  public color
  protected _isOver
  protected _timestamp: number = Date.now()
  constructor(params: PlayerData) {
    this._name = params.name
    this._x = params.x
    this._y = params.y
    this._width = params.width
    this._height = params.height
    this._vx = params.vx
    this._vy = params.vy
    this._vg = params.vg
    this._jumpStrength = params.jumpStrength
    this._isJumping = params.isJumping
    this._speed = params.speed
    this.color = params.color
    this._isOver = params.isOver
  }

  moveToLeft() {
    this._vx = -this._speed
  }

  moveToRight() {
    this._vx = this._speed
  }

  jump() {
    this._vy = this._jumpStrength
    this._isJumping = true
  }

  stopMovement() {
    this._vx = 0
  }

  moveOnIdle(deltaTime: number) {
    this._vy += this._vg * deltaTime
    this._x += this.vx * deltaTime
    this._y += this.vy * deltaTime
  }

  moveOnTopBox(boxY: number) {
    this._y = boxY - this.height
    this._vy = 0
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

  updateFromJson(params: { x: number; y: number }) {
    this._x = params.x
    this._y = params.y
  }

  isGameOver() {
    if (this.isOver) return
    this._isOver = this.y - this.height > 1
    if (this.isOver) {
      console.log(Date.now())
      this._timestamp = Date.now()
    }
  }

  isMovingToRight() {
    return 0 <= this.vx
  }

  getCanvasSize(canvas: Canvas) {
    return {
      x: this.x * canvas.width,
      y: this.y * canvas.height,
      width: this.width * canvas.width,
      height: this.height * canvas.height,
    }
  }

  get name() {
    return this._name
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

  get vx() {
    return this._vx
  }

  get vy() {
    return this._vy
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

  get timestamp() {
    return this._timestamp
  }
}
