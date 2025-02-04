import { Canvas } from './canvas'

export class GameObject {
  constructor(
    protected x: number,
    protected y: number,
    protected width: number,
    protected height: number,
    protected speed: number,
  ) {}
  getCanvasSize(canvas: Canvas) {
    return {
      x: this.x * canvas.width,
      y: this.y * canvas.height,
      width: this.width * canvas.width,
      height: this.height * canvas.height,
    }
  }
  convertToJson() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      speed: this.speed,
    }
  }
}
