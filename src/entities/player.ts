import { Box } from "./box"
export type PlayerArg = {
  id: string
  x: number
  y: number
  width: number
  height: number
  vx: number
  vy: number
  vg: number
  jumpStrength: number
  isJumping: boolean
  speed: number
  color: string
}
export class Player {
  public id
  public x
  public y
  public width
  public height
  public vx
  public vy
  public vg
  public jumpStrength
  public isJumping
  private speed
  public color
  constructor(params: PlayerArg) {
    this.id = params.id
    this.x = params.x
    this.y = params.y
    this.width = params.width
    this.height = params.height
    this.vx = params.vx
    this.vy = params.vy
    this.vg = params.vg
    this.jumpStrength = params.jumpStrength
    this.isJumping = params.isJumping
    this.speed = params.speed
    this.color = params.color
  }

  moveToLeft() {
    this.vx = -this.speed
  }

  moveToRight() {
    this.vx = this.speed
  }

  jump() {
    this.vy = this.jumpStrength
    this.isJumping = true
  }

  stopMovement() {
    this.vx = 0
  }

  moveOnIdle() {
    this.vy += this.vg
    this.x += this.vx
    this.y += this.vy
  }

  moveOnTopBox(boxY: number) {
    this.y = boxY - this.height
    this.vy = 0
    this.isJumping = false
  }

  isPlayerCollidingWithBox(box: Box) {
    return (
      this.x + this.width > box.x &&
      this.x < box.x + box.width &&
      this.y + this.height > box.y &&
      this.y < box.y + box.height &&
      this.vy >= 0
    )
  }

  convertToJson() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      vx: this.vx,
      vy: this.vy,
      vg: this.vg,
      jumpStrength: this.jumpStrength,
      isJumping: this.isJumping,
      speed: this.speed,
      color: this.color,
    }
  }

  updateFromJson(params: PlayerArg) {
    this.x = params.x
    this.y = params.y
    this.width = params.width
    this.height = params.height
    this.vx = params.vx
    this.vy = params.vy
    this.vg = params.vg
    this.jumpStrength = params.jumpStrength
    this.isJumping = params.isJumping
    this.speed = params.speed
  }

  static createPlayer = (id: string, canvas: HTMLCanvasElement) => {
    return new Player({
      id,
      x: canvas.width / 2,
      y: 20,
      width: 40,
      height: 40,
      vx: 0,
      vy: 0,
      vg: 0.5,
      jumpStrength: -15,
      isJumping: false,
      speed: 8,
      color: id ? `rgb(255,255,255)` : `rgb(0,0,0)`,
    })
  }
}
