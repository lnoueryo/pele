
export const onMounted = () => {
  const gameController = document.createElement('game-controller')
  const app = document.getElementById('app')!
  app.appendChild(gameController)
}