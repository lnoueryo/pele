import { CanvasManager } from './canvas_manager'
import { Player } from './player'
import { Maguma } from './maguma'


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

const adjustCanvasSize = () => {
    const wrapper = document.getElementById('wrapper')
    const sideContainers = document.getElementsByClassName('side-container')
    const warning = document.getElementById('warning')

    if (isMobileDevice()) {
        if ((window.innerWidth - 200) < window.innerHeight) {
            // 縦向きまたは十分な画面サイズではない端末
            wrapper.classList.add('hide')
            warning.classList.remove('hide')
            return;
        }

        // 横向き
        Array.from(sideContainers).forEach(element => {
            element.classList.remove('hide');
        });
    } else {
        // PCの場合
        Array.from(sideContainers).forEach(element => {
            element.classList.add('hide');
        });
    }

    wrapper.classList.remove('hide')
    warning.classList.add('hide')
    const height = window.innerHeight;
    canvas.style.width = ((height - 20) * CANVAS_RATIO) + 'px';
    canvas.style.height = (height - 20) + 'px';
}

const isMobileDevice = () => {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

let timer = null;
let cm = null;
const CANVAS_WIDTH_PIXEL = 800;
const CANVAS_HEIGHT_PIXEL = 800;
const CANVAS_RATIO = CANVAS_WIDTH_PIXEL / CANVAS_HEIGHT_PIXEL
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const main = () => {
    canvas.width = CANVAS_WIDTH_PIXEL;
    canvas.height = CANVAS_HEIGHT_PIXEL;
    adjustCanvasSize()
    document.addEventListener('keyup', (e) => {
        if(e.key === 'Enter') {
            if(cm === null || cm.isGameOver()) onStartGameClicked(tempIndex)
        }
    })

    window.addEventListener('resize', function() {
        adjustCanvasSize()
    });
}

main()

export { CanvasManager, Player , Maguma}
