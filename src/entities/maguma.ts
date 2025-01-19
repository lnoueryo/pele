type IMagma = {
  x: number
  y: number
  width: number
  height: number
}

export class Maguma {
  public x
  public y
  public width
  public height
  constructor(params: IMagma) {
    this.x = params.x
    this.y = params.y
    this.width = params.width
    this.height = params.height
  }
}
