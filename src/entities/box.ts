import { Canvas } from "./canvas"
import type { CanvasObject } from "./interfaces/canvas-object.interface"
const LEFT_LIMT = 0
const TOP_LIMIT = 0
const MOVE_Y_PROBABILITY = 0.1
const Y_MOVE_SCALE = 0.1
const START_POSITION = 0.75
const SPEED_SALT = 25
const MIN_SPEED = 0.3
const MAX_SPEED = 0.6

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
  private ySalt = (Math.random() - 0.5)
  constructor(params: IBox) {
    this._width = params.width
    this._height = params.height
    this._x = params.x
    this._y = params.y
    this._canvas = params.canvas
    this._speed = params.speed
  }

  moveOnIdle() {
    this._x -= this._speed
    this._y +=
      Math.random() < MOVE_Y_PROBABILITY
        ? this.ySalt * this._speed / Y_MOVE_SCALE
        : 0
  }

  isOutOfDisplay() {
    return this._x + this._width < LEFT_LIMT || this._y + this._height < TOP_LIMIT
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

  get speed() {
    return this.canvas.width * this._speed
  }

  get canvas() {
    return this._canvas
  }

  static createBox(canvas: Canvas) {
    const x = 1
    const y = 1 * START_POSITION
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
