import GameController from "../../components/game-controller.component"
export const onMounted = () => {
  customElements.define('game-controller', GameController)
  const gameController = document.createElement('game-controller') as GameController
  const app = document.getElementById('app')!
  app.appendChild(gameController)
}