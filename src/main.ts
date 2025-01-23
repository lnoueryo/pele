import './styles/styles.css'
import ControllerButton from './components/atoms/controller-button.component'
import BottomController from './components/molecules/bottom-controller.component'
import LeftController from './components/molecules/left-controller.component'
import GameCanvas from './components/game-canvas.component'
import GameController from './components/game-controller.component'
import RightController from './components/molecules/right-controller.component'

customElements.define('controller-button', ControllerButton)
customElements.define('game-canvas', GameCanvas)
customElements.define('bottom-controller', BottomController)
customElements.define('left-controller', LeftController)
customElements.define('right-controller', RightController)
customElements.define('game-controller', GameController)