import { Box } from '../box'
import { BasePlayer, PlayerData } from './base-player'

export type ComputerMode = 'slowest' | 'fastest' | 'highest' | 'nearest'

export class ComputerPlayer extends BasePlayer {
  private mode: ComputerMode = 'nearest'
  constructor(params: PlayerData & { name: string; mode: ComputerMode }) {
    super({
      id: params.id,
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
    const targetBox = this.getTargetBox(candidates, this.mode)
    let { x: targetBoxX } = targetBox.convertToJson()
    const { y: targetBoxY, width: targetBoxWidth } = targetBox.convertToJson()
    // **目標のボックスが上にある**
    if (!this.isJumping && targetBoxY < this.y) {
      this.jump()
    }
    if (
      Math.abs(this.x - targetBoxX - targetBoxWidth) < 0.05 &&
      Math.abs(this.y - targetBoxY) < 0.05
    ) {
      const candidates = this.getCandidateBoxes(boxes)
      const newTargetBox = this.getTargetBox(candidates, 'nearest')
      const { x } = newTargetBox.convertToJson()
      targetBoxX = x
    }
    const moveDirection = this.x < targetBoxX ? 1 : -1
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
    const candidates = boxes.filter((box) => {
      const { x, y, speed } = box.convertToJson()
      return x >= 0.3 && x <= 0.9 && y <= 0.7 && y >= 0.1 && speed < 0.6
    })
    return candidates.length === 0 ? boxes : candidates
  }

  private getTargetBox(candidates: Box[], mode: ComputerMode) {
    switch (mode) {
      case 'slowest':
        return candidates.reduce((slowestBox, currentBox) => {
          const { speed: currentBoxSpeed } = currentBox.convertToJson()
          const { speed: slowestBoxSpeed } = slowestBox.convertToJson()
          return currentBoxSpeed < slowestBoxSpeed ? currentBox : slowestBox
        }, candidates[0])

      case 'fastest':
        return candidates.reduce((fastestBox, currentBox) => {
          const { speed: currentBoxSpeed } = currentBox.convertToJson()
          const { speed: fastestBoxSpeed } = fastestBox.convertToJson()
          return currentBoxSpeed > fastestBoxSpeed ? currentBox : fastestBox
        }, candidates[0])

      case 'highest':
        return candidates.reduce((highestBox, currentBox) => {
          const { y: currentBoxY } = currentBox.convertToJson()
          const { y: highestBoxY } = highestBox.convertToJson()
          return currentBoxY < highestBoxY ? currentBox : highestBox
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
    const { x, y } = box.convertToJson()
    return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2))
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
}
