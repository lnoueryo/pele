import { Canvas } from "./canvas"
import type { CanvasObject } from "./interfaces/canvas-object.interface"
const LEFT_LIMT = 0
const TOP_LIMIT = 0
const MOVE_Y_PROBABILITY = 0.1
const Y_MOVE_SCALE = 0.05
const START_POSITION = 4
const SPEED_SALT = 28
const MIN_SPEED = 0.08
const MAX_SPEED = 0.9

type IBox = {
  x: number
  y: number
  width: number
  height: number
  canvas: Canvas
  speed: number
}

export class Box implements CanvasObject {
  private _x
  private _y
  private _width
  private _height
  private _speed
  private _canvas
  constructor(params: IBox) {
    this._width = params.width
    this._height = params.height
    this._x = params.x
    this._y = params.y
    this._canvas = params.canvas
    this._speed = params.speed
  }

  moveOnIdle() {
    this._x -= this.speed
    this._y +=
      Math.random() < MOVE_Y_PROBABILITY
        ? Math.sin(this.speed) * this.canvas.height * Y_MOVE_SCALE
        : 0
  }

  isOutOfDisplay() {
    return this.x + this.width < LEFT_LIMT || this.y + this.height < TOP_LIMIT
  }

  get x() {
    return this._x
  }

  get y() {
    return this._y
  }

  get width() {
    return this.canvas.width * this._width
  }

  get height() {
    return this.canvas.height * this._height
  }

  get speed() {
    return this.canvas.width * this._speed
  }

  get canvas() {
    return this._canvas
  }

  static createBox(canvas: Canvas) {
    const x = canvas.width
    const y = canvas.height - canvas.height / START_POSITION
    const width = Math.random() / 4.2
    const height = Math.random() * 0.1
    const randomSpeed = Math.random()
    const speed = randomSpeed < MIN_SPEED ? MIN_SPEED / SPEED_SALT : MAX_SPEED < randomSpeed ? MAX_SPEED / SPEED_SALT : randomSpeed / SPEED_SALT
    return new Box({
      width,
      height,
      x,
      y,
      canvas,
      speed,
    })
  }
 }
