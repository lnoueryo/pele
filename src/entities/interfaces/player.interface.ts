import { Box } from '../box'
import { CanvasObject } from './canvas-object.interface'

export interface IPlayer extends CanvasObject {
  vx: number
  vy: number
  vg: number
  jumpStrength: number
  isJumping: boolean
  speed: number
  color: string
  isOver: boolean
  moveOnIdle(deltaTime: number): void
  isGameOver(): void
  isPlayerCollidingWithBox(box: Box): boolean
  moveOnTopBox(boxY: number): void
  isMovingToRight(): boolean
  moveToLeft(): void
  moveToRight(): void
  jump(): void
  stopMovement(): void
  convertToJson(): object
  updateFromJson(data: object): void
}
