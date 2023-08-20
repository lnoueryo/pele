import { CanvasManager } from './canvas_manager'
import { Player } from './player'
import { Maguma } from './maguma'

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
    cm = new CanvasManager(
        canvas,
        ctx,
        players,
        createMaguma(),
    )
    cm.startGame()
    timer = setInterval(() => {
        if(cm.isGameOver()) {
            clearInterval(timer)
            buttons.classList.remove('hide');
        }
    }, 100)
}

let timer = null;

let cm = null;

document.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        if(cm === null || cm.isGameOver()) onStartGameClicked(tempIndex)
    }
})
const height = window.innerHeight;
canvas.style.width = (height - 20) + 'px';
canvas.style.height = (height - 20) + 'px';
window.addEventListener('resize', function() {
    const height = window.innerHeight;
    canvas.style.width = (height - 20) + 'px';
    canvas.style.height = (height - 20) + 'px';
});
export { CanvasManager, Player , Maguma}
