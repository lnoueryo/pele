import { Box } from "./box"
import { Canvas } from "./canvas"
import { CanvasObject } from "./interfaces/canvas-object.interface"
export type PlayerArg = {
  id?: string | null
  x: number
  y: number
  width: number
  height: number
  canvas: Canvas
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
  private id: string = 'anonymous'
  private _x
  private _y
  private _width
  private _height
  private _canvas
  private vx
  private vy
  private _vg
  private _jumpStrength
  private _isJumping
  private _speed
  public color
  private _isOver
  constructor(params: PlayerArg) {
    this._x = params.x
    this._y = params.y
    this._width = params.width
    this._height = params.height
    this._canvas = params.canvas
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
    this._y = (boxY - this.height) / this.canvas.height
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

  updateFromJson(params: PlayerArg) {
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
  }

  isGameOver() {
    this._isOver = this.y - this.height > this.canvas.height
  }

  reset() {
    this._x = 0.5
    this._y = 0.1
    this.vx = 0
    this.vy = 0
    this._isJumping = false
    this._isOver = false
  }

  setId(id: string) {
    this.id = id
  }

  get x() {
    return this.canvas.width * this._x
  }

  get y() {
    return this.canvas.height * this._y
  }

  get width() {
    return this.canvas.width * this._width
  }

  get height() {
    return this.canvas.height * this._height
  }

  get canvas() {
    return this._canvas
  }

  get jumpStrength() {
    return -this.canvas.height * this._jumpStrength
  }

  get isJumping() {
    return this._isJumping
  }

  get vg() {
    return this.canvas.height * this._vg
  }

  get speed() {
    return this._speed * this.canvas.width
  }

  get isOver() {
    return this._isOver
  }

  static createPlayer = (canvas: Canvas) => {
    return new Player({
      x: 0.5,
      y: 0.1,
      width: 0.05,
      height: 0.05,
      canvas,
      vx: 0,
      vy: 0,
      vg: 0.0009,
      jumpStrength: -0.03,
      isJumping: false,
      speed: 0.02,
      color: `rgb(255,255,255)`,
      isOver: false,
    })
  }
}
