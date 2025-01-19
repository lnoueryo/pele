import { Box } from "./box"
type PlayerArg = {
  id: number
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
}
