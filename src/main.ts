import { CanvasManager } from './canvas_manager'
import { Player } from './player'
import { Maguma } from './maguma'
import { Game } from './game'

const createCanvasManager = () => {
    return new CanvasManager(
        canvas,
        ctx,
        createMaguma()
    )
}

const createPlayer = (id) => {
    return new Player(
        id,
        canvas.width / 2,
        20,
        40,
        40,
        0,
        0,
        0.5,
        -15,
        false,
        8,
        id ? `rgb(255,255,255)` : `rgb(0,0,0)`
    )
}

const createMaguma = () => {
    return new Maguma(
        0,
        canvas.height-50,
        800,
        50,
    )
}

let tempIndex = 1;

export const onStartGameClicked = (index) => {
    tempIndex = index
    const buttons = document.getElementById('start-buttons')
    buttons.classList.add('hide');
    const players = []
    for (let i = 0; i < index; i++) {
        players.push(createPlayer(i))
    }
    const cm = createCanvasManager()
    controller = controller.resetGame(cm, players)
    controller.startGame()
    timer = setInterval(() => {
        if(controller.isGameOver()) {
            clearInterval(timer)
            buttons.classList.remove('hide');
        }
    }, 100)
}

export const onChangeControllerPositionClicked = (e) => {
    e.preventDefault()
    e.stopPropagation()
    controller.changeControllerPosition()
}


let timer = null;
let controller = null;
console.log(controller)
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const main = () => {
    const top = document.getElementById('top')
    const left = document.getElementById('left')
    const right = document.getElementById('right')
    const gamerRight = document.getElementById('gamer-right')
    const cm = createCanvasManager()

    controller = new Game(top, left, right, gamerRight, cm)
    controller.showController()

    document.addEventListener('keyup', (e) => {
        if(e.key === 'Enter') {
            if(controller.isGameOver()) onStartGameClicked(tempIndex)
            e.stopPropagation()
        }
    })

    window.addEventListener('resize', () => {
        controller.showController()
    });
}

main()

export { CanvasManager, Player , Maguma, Game}
