import { CanvasManager } from './canvas_manager'
import { Player } from './player'

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 800;

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
    )
}

const onStartGameClicked = () => {
    const button = document.getElementById('start-button')
    button.classList.add('hide');
    cm = new CanvasManager(
        canvas,
        ctx,
        createPlayer(0)
    )
    cm.startGame()
    timer = setInterval(() => {
        if(cm.isGameOver()) {
            clearInterval(timer)
            button.classList.remove('hide');
        }
    }, 100)
}

let timer = null;

let cm = null;

document.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        if(cm === null || cm.isGameOver()) onStartGameClicked()
    }
})
export { CanvasManager, Player}