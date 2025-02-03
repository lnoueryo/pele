import { Box } from '../box'
import { BasePlayer, PlayerData } from './base-player'

export type ComputerMode = 'slowest' | 'fastest' | 'highest' | 'nearest'

export class ComputerPlayer extends BasePlayer {
  private mode: ComputerMode = 'nearest'
  constructor(params: PlayerData & { name: string; mode: ComputerMode }) {
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
    this.mode = params.mode
  }

  decideNextMove(boxes: Box[]) {
    if (boxes.length === 0) return
    const candidates = this.getCandidateBoxes(boxes)
    let targetBox = this.getTargetBox(candidates, this.mode)

    // **目標のボックスが上にある**
    if (!this.isJumping && targetBox.y < this.y) {
      this.jump()
    }
    if (
      Math.abs(this.x - targetBox.x - targetBox.width) < 0.05 &&
      Math.abs(this.y - targetBox.y) < 0.05
    ) {
      const candidates = this.getCandidateBoxes(boxes)
      targetBox = this.getTargetBox(candidates, 'nearest')
    }
    const moveDirection = this.x < targetBox.x ? 1 : -1
    const speedFactor = 0.9
    this._vx += moveDirection * speedFactor
    if (Math.abs(this.vx) > 0.25) this._vx *= 0.4
    boxes.forEach((box) => {
      if (this.isPlayerCollidingWithBox(box)) {
        this._vx *= 0.1
      }
    })
  }

  private getCandidateBoxes(boxes: Box[]) {
    const candidates = boxes.filter(
      (box) =>
        box.x >= 0.3 &&
        box.x <= 0.9 &&
        box.y <= 0.7 &&
        box.y >= 0.1 &&
        box.speed < 0.6,
    )
    return candidates.length === 0 ? boxes : candidates
  }

  private getTargetBox(candidates: Box[], mode: ComputerMode) {
    switch (mode) {
      case 'slowest':
        return candidates.reduce((slowestBox, currentBox) => {
          return currentBox.speed < slowestBox.speed ? currentBox : slowestBox
        }, candidates[0])

      case 'fastest':
        return candidates.reduce((fastestBox, currentBox) => {
          return currentBox.speed > fastestBox.speed ? currentBox : fastestBox
        }, candidates[0])

      case 'highest':
        return candidates.reduce((highest, box) => {
          return box.y < highest.y ? box : highest
        }, candidates[0])

      case 'nearest':
        return candidates.reduce((nearestBox, currentBox) => {
          return this.calculateDistance(currentBox) <
            this.calculateDistance(nearestBox)
            ? currentBox
            : nearestBox
        }, candidates[0])
    }
  }

  private calculateDistance(box: Box) {
    return Math.sqrt(Math.pow(box.x - this.x, 2) + Math.pow(box.y - this.y, 2))
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
