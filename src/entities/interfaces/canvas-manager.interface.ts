import { Box } from '../box'

export type CanvasManager = {
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
