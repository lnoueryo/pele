import { IPlayer } from '../interfaces/player.interface'
import { BasePlayer, PlayerData } from './base-player'

export class OfflinePlayer extends BasePlayer {
  private id
  constructor(params: PlayerData & { id: string }) {
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
    this.id = params.id
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
      isOver: this.isOver,
    }
  }

  updateFromJson(params: { x: number; y: number }) {
    this._x = params.x
    this._y = params.y
  }
}
