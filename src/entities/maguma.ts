import { Canvas } from './canvas'
import { CanvasObject } from './interfaces/canvas-object.interface'

type IMagma = {
  x: number
  y: number
  width: number
  height: number
}

export class Maguma implements CanvasObject {
  public _x
  public _y
  public _width
  public _height
  constructor(params: IMagma) {
    this._x = params.x
    this._y = params.y
    this._width = params.width
    this._height = params.height
  }
  getCanvasSize(canvas: Canvas) {
    return {
      x: this.x * canvas.width,
      y: this.y * canvas.height,
      width: this.width * canvas.width,
      height: this.height * canvas.height,
    }
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
  static createMaguma() {
    return new Maguma({
      x: 0,
      y: 0.95,
      width: 1,
      height: 1,
    })
  }
}
