import { Box } from '../box'
import { GameObject } from '../game-object'
import { IPlayer } from '../interfaces/player.interface'
export type PlayerData = {
  id: string
  name: string
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
  isOver: boolean
}
export abstract class BasePlayer extends GameObject implements IPlayer {
  protected _id
  protected _name
  protected _vx
  protected _vy
  protected _vg
  protected _jumpStrength
  protected _isJumping
  public color
  protected _isOver
  protected _timestamp: number = Date.now()
  constructor(params: PlayerData) {
    super(params.x, params.y, params.width, params.height, params.speed)
    this._id = params.id
    this._name = params.name
    this._vx = params.vx
    this._vy = params.vy
    this._vg = params.vg
    this._jumpStrength = params.jumpStrength
    this._isJumping = params.isJumping
    this.color = params.color
    this._isOver = params.isOver
  }

  moveToLeft() {
    this._vx = -this.speed
  }

  moveToRight() {
    this._vx = this.speed
  }

  jump() {
    this._vy = this._jumpStrength
    this._isJumping = true
  }

  stopMovement() {
    this._vx = 0
  }

  moveOnIdle(deltaTime: number) {
    this._vy += this._vg * deltaTime
    this.x += this.vx * deltaTime
    this.y += this.vy * deltaTime
  }

  moveOnTopBox(boxY: number) {
    this.y = boxY - this.height
    this._vy = 0
    this._isJumping = false
  }

  isPlayerCollidingWithBox(box: Box) {
    const { x, y, width, height } = box.convertToJson()
    return (
      this.x + this.width > x &&
      this.x < x + width &&
      this.y + this.height > y &&
      this.y < y + height &&
      this.vy >= 0
    )
  }

  updateFromJson(params: {
    x: number
    y: number
    isOver: boolean
    timestamp: number
  }) {
    this.x = params.x
    this.y = params.y
    this._isOver = params.isOver
    this._timestamp = params.timestamp
  }

  isGameOver() {
    if (this.isOver) return
    this._isOver = this.y - this.height >= 1
    this._timestamp = Date.now()
    if (this.isOver) {
      this.y = 1
    }
  }

  isMovingToRight() {
    return 0 <= this.vx
  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  get jumpStrength() {
    return -this._jumpStrength
  }

  get isJumping() {
    return this._isJumping
  }

  get vx() {
    return this._vx
  }

  get vy() {
    return this._vy
  }

  get vg() {
    return this._vg
  }

  get isOver() {
    return this._isOver
  }

  get timestamp() {
    return this._timestamp
  }
}
