const canvas = document.getElementById('game-canvas') as HTMLCanvasElement
const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D
const top = document.getElementById('top') as HTMLDivElement
const left = document.getElementById('left') as HTMLDivElement
const right = document.getElementById('right') as HTMLDivElement
const gamerRight = document.getElementById('gamer-right') as HTMLDivElement
const wrapper = document.getElementById('wrapper') as HTMLDivElement
const warning = document.getElementById('warning') as HTMLDivElement
const startButtons = document.getElementById('start-buttons') as HTMLDivElement

// DOMオブジェクトの集合
const domObject = {
  canvas,
  ctx,
  top,
  left,
  right,
  gamerRight,
  wrapper,
  warning,
  startButtons,
}
for (const [key, value] of Object.entries(domObject)) {
  if (value === null) {
    throw new Error(`${key} could not be found`)
  }
}

export default domObject;
