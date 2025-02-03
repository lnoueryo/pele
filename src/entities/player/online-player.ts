import { IPlayer } from '../interfaces/player.interface'
import { BasePlayer, PlayerData } from './base-player'

export class OnlinePlayer extends BasePlayer {
  private _id
  private _name
  constructor(params: PlayerData & { id: string; name: string }) {
    super({
      x: params.x,
      y: params.y,
      width: params.width,
      height: params.height,
      vx: params.vx,
      vy: params.vy,
      vg: params.vg,
      jumpStrength: params.jumpStrength,
      isJumping: params.isJumping,
      speed: params.speed,
      color: params.color,
      isOver: params.isOver,
    })
    this._id = params.id
    this._name = params.name
  }

  convertToJson() {
    return {
      id: this.id,
      name: this.name,
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
      isOver: this.isOver,
    }
  }

  updateFromJson(params: { x: number; y: number }) {
    this._x = params.x
    this._y = params.y
  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }
}
