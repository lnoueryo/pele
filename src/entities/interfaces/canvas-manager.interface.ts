import { Box } from '../box'
import { IPlayer } from './player.interface'

export type CanvasManager<T extends IPlayer> = {
  loop: (timestamp: number) => Box[]
  isGameOver: () => boolean
  endGame: () => void
  updateBoxes: (
    boxesJson: {
      x: number
      y: number
      width: number
      height: number
      speed: number
    }[],
  ) => void
}
