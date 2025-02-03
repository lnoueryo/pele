import './styles/styles.css'
import CommonHead from './components/common/head.component'
import BaseCanvasComponent from './components/atoms/base-canvas.component'
import ControllerButton from './components/atoms/controller-button.component'
import BottomController from './components/molecules/bottom-controller.component'
import LeftController from './components/molecules/left-controller.component'
import GameCanvas from './components/organisms/game-canvas.component'
import OfflineGameController from './components/organisms/offline-game-controller.component'
import OnlineGameController from './components/organisms/online-game-controller.component'
import RightController from './components/molecules/right-controller.component'
import IndexPage from './components/pages/index.component'
import OfflinePage from './components/pages/offline.component'
import OnlinePage from './components/pages/online.component'
import LoginPage from './components/pages/login.component'

customElements.define('common-head', CommonHead)
customElements.define('base-canvas', BaseCanvasComponent)
customElements.define('controller-button', ControllerButton)
customElements.define('game-canvas', GameCanvas)
customElements.define('bottom-controller', BottomController)
customElements.define('left-controller', LeftController)
customElements.define('right-controller', RightController)
customElements.define('offline-game-controller', OfflineGameController)
customElements.define('online-game-controller', OnlineGameController)
customElements.define('index-page', IndexPage)
customElements.define('offline-page', OfflinePage)
customElements.define('online-page', OnlinePage)
customElements.define('login-page', LoginPage)

const routes = new Map<string, string>([
  ['/', 'index-page'],
  ['/index.html', 'index-page'],
  ['/multi.html', 'online-page'],
  ['/solo.html', 'offline-page'],
  ['/login.html', 'login-page'],
])

const path = location.pathname
if (routes.has(path)) {
  const renderingComponent = routes.get(path)!
  const app = document.getElementById('app')!
  const component = document.createElement(renderingComponent)
  app.appendChild(component)
}
document.head.appendChild(document.createElement('common-head'))
