const KEYBOARDS = [
    {top: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight'},
    {top: 'x', left: 'z', right: 'c'},
]

export class Game {
    constructor(private top, private left, private right, private gamerRight, private cm, private players = [], private controllerPosition = 'default') {


    }

    changeControllerPosition() {
        if(this.controllerPosition == 'default') {
            this.top.classList.add('hide')
            this.right.classList.add('hide')
            this.right.parentElement.classList.remove('justify-between');
            this.gamerRight.classList.remove('hide')
            this.controllerPosition = 'gamer'
        }
        else if(this.controllerPosition == 'gamer') {
            this.top.classList.remove('hide')
            this.right.classList.remove('hide')
            this.right.parentElement.classList.add('justify-between');
            this.gamerRight.classList.add('hide')
            this.controllerPosition = 'default'
        }
    }

    excute = () => {
        if(this.players.length == 0) return;
        this.players[0].isJumping || this.players[0].jump()
    }

    updatePlayers(players) {
        return new Game(
            this.top,
            this.left,
            this.right,
            this.gamerRight,
            this.cm,
            players,
            this.controllerPosition
        )
    }

    resetGame(cm, players) {
        return new Game(
            this.top,
            this.left,
            this.right,
            this.gamerRight,
            cm,
            players,
            this.controllerPosition
        )
    }

    startGame() {
        this.players.forEach((player, i) => {
            document.addEventListener('keydown', (event) => {
                if (event.key === KEYBOARDS[i].left) player.moveToLeft();
                else if (event.key === KEYBOARDS[i].right) player.moveToRight();
                else if (event.key === KEYBOARDS[i].top && !player.isJumping) player.jump();
            });

            document.addEventListener('keyup', (event) => {
                if (event.key === KEYBOARDS[i].left || event.key === KEYBOARDS[i].right) player.stopMovement()
            });
        });

        this.right.addEventListener('touchstart', (e) => {
            this.players[0].moveToRight();
            e.stopPropagation()
            e.preventDefault();
        });
        this.right.addEventListener('touchend', (e) => {
            this.players[0].stopMovement()
            e.stopPropagation()
            e.preventDefault();
        });
        this.gamerRight.addEventListener('touchstart', (e) => {
            this.players[0].moveToRight();
            e.stopPropagation()
            e.preventDefault();
        });
        this.gamerRight.addEventListener('touchend', (e) => {
            this.players[0].stopMovement()
            e.stopPropagation()
            e.preventDefault();
        });
        this.left.addEventListener('touchstart', (e) => {
            this.players[0].moveToLeft();
            e.stopPropagation()
            e.preventDefault();
        });
        this.left.addEventListener('touchend', (e) => {
            this.players[0].stopMovement()
            e.stopPropagation()
            e.preventDefault();
        });
        this.top.addEventListener('touchstart', (e) => {
            this.players[0].isJumping || this.players[0].jump()
            e.stopPropagation()
            e.preventDefault();
        });

        document.removeEventListener('touchstart', this.excute)
        if(this.controllerPosition == 'gamer') {
            document.addEventListener('touchstart', this.excute);
        }
        this.cm.loop(0, this.players)
    }

    showController() {
        const wrapper = document.getElementById('wrapper')
        const sideContainers = document.getElementsByClassName('side-container')
        const warning = document.getElementById('warning')

        if (this.isMobileDevice()) {
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
        this.cm.adjustCanvasSize()
    }

    isMobileDevice = () => {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    isGameOver() {
        return this.cm.isGameOver(this.players)
    }
}