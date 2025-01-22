import { Canvas } from "./canvas"
import { CanvasObject } from "./interfaces/canvas-object.interface"

type IMagma = {
  x: number
  y: number
  width: number
  height: number
  canvas: Canvas
}

export class Maguma implements CanvasObject {
  public x
  public y
  public _width
  public _height
  public canvas
  constructor(params: IMagma) {
    this.x = params.x
    this.y = params.y
    this._width = params.width
    this._height = params.height
    this.canvas = params.canvas
  }
  get width() {
    return this.canvas.width * this._width
  }
  get height() {
    return this.canvas.height * this._height
  }
  static createMaguma(canvas: Canvas) {
    return new Maguma({
      x: 0,
      y: canvas.height - canvas.height * 0.05,
      width: 1,
      height: 1,
      canvas,
    })
  }
}
