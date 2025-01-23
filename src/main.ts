import './styles/styles.css'
import CommonHead from './components/common/head.component'
import BaseCanvasComponent from './components/atoms/base-canvas.component'
import ControllerButton from './components/atoms/controller-button.component'
import BottomController from './components/molecules/bottom-controller.component'
import LeftController from './components/molecules/left-controller.component'
import GameCanvas from './components/organisms/game-canvas.component'
import GameController from './components/organisms/game-controller.component'
import RightController from './components/molecules/right-controller.component'
import IndexPage from './components/pages/index.component'
import SoloPage from './components/pages/solo.component'

customElements.define('common-head', CommonHead)
customElements.define('base-canvas', BaseCanvasComponent)
customElements.define('controller-button', ControllerButton)
customElements.define('game-canvas', GameCanvas)
customElements.define('bottom-controller', BottomController)
customElements.define('left-controller', LeftController)
customElements.define('right-controller', RightController)
customElements.define('game-controller', GameController)
customElements.define('index-page', IndexPage)
customElements.define('solo-page', SoloPage)

const routes = new Map<string, string>([
  ['/', 'index-page'],
  ['/index.html', 'index-page'],
  ['/multiple.html', 'index-page'],
  ['/solo.html', 'solo-page'],
])

const path = location.pathname;
if (routes.has(path)) {
  const renderingComponent = routes.get(path)!
  const app = document.getElementById('app')!
  console.log(app)
  const component = document.createElement(renderingComponent)
  app.appendChild(component)
}
document.head.appendChild(document.createElement('common-head'))
