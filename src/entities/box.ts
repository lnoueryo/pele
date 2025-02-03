import { Canvas } from './canvas'
import type { CanvasObject } from './interfaces/canvas-object.interface'
import config from '../../config'
const LEFT_LIMIT = 0
const TOP_LIMIT = 0
const {
  moveYProbability: MOVE_Y_PROBABILITY,
  yMoveScale: Y_MOVE_SCALE,
  startPosition: START_POSITION,
  speedSalt: SPEED_SALT,
  minSpeed: MIN_SPEED,
  maxSpeed: MAX_SPEED,
} = config.boxSetting

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
  private _speed
  private ySalt = Math.random() - 0.5
  constructor(params: IBox) {
    this._width = params.width
    this._height = params.height
    this._x = params.x
    this._y = params.y
    this._speed = params.speed
  }

  moveOnIdle(deltaTime: number) {
    this._x -= this.speed * deltaTime
    this._y +=
      Math.random() < MOVE_Y_PROBABILITY
        ? (this.ySalt * this.speed * deltaTime) / Y_MOVE_SCALE
        : 0
  }

  isOutOfDisplay() {
    return this.x + this.width < LEFT_LIMIT || this.y + this.height < TOP_LIMIT
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
  get speed() {
    return this._speed
  }
}
