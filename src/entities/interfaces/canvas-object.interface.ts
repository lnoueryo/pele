import { Canvas } from '../canvas'

export type CanvasObject = {
  x: number
  y: number
  width: number
  height: number
  getCanvasSize(canvas: Canvas): {
    x: number
    y: number
    width: number
    height: number
  }
}
