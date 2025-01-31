import { Box } from '../box'

export type CanvasManager = {
  isGameOver: boolean
  loop: (timestamp: number, startTimestamp: number) => Box[]
  endGame: (result: {
    ranking: [
      {
        name: string
        timestamp: number
      },
    ]
    startTimestamp: number
  }) => void
  updateBoxes: (
    boxesJson: {
      x: number
      y: number
      width: number
      height: number
      speed: number
    }[],
  ) => void
  fillTime(elapsedTime: number): void
}
