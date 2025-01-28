import { Canvas } from './canvas'
import type { CanvasObject } from './interfaces/canvas-object.interface'
const LEFT_LIMT = 0
const TOP_LIMIT = 0
const MOVE_Y_PROBABILITY = 0.1
const Y_MOVE_SCALE = 0.15
const START_POSITION = 0.75
const SPEED_SALT = 0.75
const MIN_SPEED = 0.3
const MAX_SPEED = 0.6

type IBox = {
  x: number
  y: number
  width: number
  height: number
  speed: number
}

export class Box implements CanvasObject {
  private _x
  private _y
  private _width
  private _height
  private speed
  private ySalt = Math.random() - 0.5
  constructor(params: IBox) {
    this._width = params.width
    this._height = params.height
    this._x = params.x
    this._y = params.y
    this.speed = params.speed
  }

  moveOnIdle(deltaTime: number) {
    this._x -= this.speed * deltaTime
    this._y +=
      Math.random() < MOVE_Y_PROBABILITY
        ? (this.ySalt * this.speed * deltaTime) / Y_MOVE_SCALE
        : 0
  }

  isOutOfDisplay() {
    return this.x + this.width < LEFT_LIMT || this.y + this.height < TOP_LIMIT
  }

  getCanvasSize(canvas: Canvas) {
    return {
      x: this.x * canvas.width,
      y: this.y * canvas.height,
      width: this.width * canvas.width,
      height: this.height * canvas.height,
    }
  }

  static createBox() {
    const x = 1
    const y = 1 * START_POSITION
    const width = Math.random() * 0.25
    const height = Math.random() * 0.1
    const randomSpeed = Math.random()
    const speed =
      randomSpeed < MIN_SPEED
        ? MIN_SPEED / SPEED_SALT
        : MAX_SPEED < randomSpeed
          ? MAX_SPEED / SPEED_SALT
          : randomSpeed / SPEED_SALT
    return new Box({
      width,
      height,
      x,
      y,
      speed,
    })
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
}
