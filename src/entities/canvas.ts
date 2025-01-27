export class Canvas {
  constructor(private canvas: HTMLCanvasElement) {}
  private getLength(length: 'width' | 'height') {
    const lengthString =
      this.canvas.style[length] || getComputedStyle(this.canvas)[length]
    return parseInt(lengthString, 10)
  }
  get width(): number {
    return this.getLength('width')
  }
  set width(width: string) {
    this.canvas.style.width = width
  }
  get pixelWidth() {
    return this.canvas.width
  }
  set pixelWidth(width) {
    this.canvas.width = width
  }
  get pixelHeight() {
    return this.canvas.width
  }
  set pixelHeight(height) {
    this.canvas.height = height
  }
  get height(): number {
    return this.getLength('height')
  }
  set height(height: string) {
    this.canvas.style.height = height
  }
  get ctx() {
    return this.canvas.getContext('2d')!
  }
  get offsetLeft() {
    return this.canvas.offsetLeft
  }
  get offsetTop() {
    return this.canvas.offsetTop
  }
}
