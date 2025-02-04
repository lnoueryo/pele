import { GameObject } from './game-object'

type IMagma = {
  x: number
  y: number
  width: number
  height: number
  speed: number
}

export class Maguma extends GameObject {
  constructor(params: IMagma) {
    super(params.x, params.y, params.width, params.height, params.speed)
  }

  static createMaguma() {
    return new Maguma({
      x: 0,
      y: 0.95,
      width: 1,
      height: 1,
      speed: 0,
    })
  }
}
