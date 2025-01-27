import { Canvas } from "../../entities/canvas";
import { BaseComponent } from "../common/base.component"
const CANVAS_WIDTH_PIXEL = 1600
const CANVAS_HEIGHT_PIXEL = 1600
const CANVAS_RATIO = CANVAS_WIDTH_PIXEL / CANVAS_HEIGHT_PIXEL

const sheet = new CSSStyleSheet()
sheet.replaceSync(`
#canvas-frame {
  border: 8px solid black;
}

canvas {
  height: 100vh;
}
`)

export default class BaseCanvasComponent extends BaseComponent {
  private _canvas: Canvas
  constructor() {
    super()
    this.shadow.adoptedStyleSheets.push(sheet)
    this.shadow.innerHTML = `
      <div id="canvas-frame">
        <canvas id="canvas"></canvas>
      </div>
    `
    const canvas = this.shadow.getElementById('canvas') as HTMLCanvasElement
    this._canvas = new Canvas(canvas)
    this.adjustCanvasSize()
    window.addEventListener('resize', () => {
      this.adjustCanvasSize()
    })
  }
  adjustCanvasSize() {
    const width = window.innerWidth
    const height = window.innerHeight
    const length = width <= height ? width : height
    this.canvas.width = (length - 20) * CANVAS_RATIO + 'px'
    this.canvas.height = (length - 20) * CANVAS_RATIO + 'px'
    this.canvas.pixelWidth = this.canvas.width
    this.canvas.pixelHeight = this.canvas.height
  }
  get canvas() {
    return this._canvas!
  }
}

