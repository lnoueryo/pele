import { Box } from '../box'
import { Canvas } from '../canvas'
import type { GameObject } from '../game-object'
export interface IPlayer {
  id: string
  name: string
  vx: number
  vy: number
  vg: number
  jumpStrength: number
  isJumping: boolean
  color: string
  isOver: boolean
  timestamp: number
  moveOnIdle(deltaTime: number): void
  isGameOver(): void
  isPlayerCollidingWithBox(box: Box): boolean
  moveOnTopBox(boxY: number): void
  isMovingToRight(): boolean
  moveToLeft(): void
  moveToRight(): void
  jump(): void
  stopMovement(): void
  updateFromJson(data: object): void
  convertToJson: GameObject['convertToJson']
  getCanvasSize: GameObject['getCanvasSize']
}
