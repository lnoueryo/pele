import { Canvas } from './canvas'
import config from '../../config'
import { GameObject } from './game-object'
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

export class Box extends GameObject {
  private ySalt = Math.random() - 0.5
  constructor(params: IBox) {
    super(params.x, params.y, params.width, params.height, params.speed)
  }

  moveOnIdle(deltaTime: number) {
    this.x -= this.speed * deltaTime
    this.y +=
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
}
