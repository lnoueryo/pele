import { Box } from '../box'
import { Player } from '../player/player'

export type CanvasManager = {
  loop: (timestamp: number) => Box[]
  isGameOver: (players: Player[]) => boolean
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
