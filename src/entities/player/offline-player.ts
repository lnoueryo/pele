import { BasePlayer, PlayerData } from './base-player'

export class OfflinePlayer extends BasePlayer {
  constructor(params: PlayerData & { name: string }) {
    super({
      name: params.name,
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
    this._name = params.name
  }

  convertToJson() {
    return {
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
}
