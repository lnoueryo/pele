import { Box } from './box'

const KEYBOARDS = [
    {top: 'ArrowUp', left: 'ArrowLeft', right: 'ArrowRight'},
    {top: 'x', left: 'z', right: 'c'},
]

const PLAYER_DELAY = 1

export class CanvasManager {
    private boxCreationProbability = 0.07
    private currentTime = 0
    constructor(private canvas, private ctx, private players,private maguma, private boxes: Box[] = [], private startTime = 0) {
        console.log(players)
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


        this.loop(0)
    }

    private loop = (timestamp) => {

        this.updateCurrentTime(timestamp)
        this.resetCanvas()

        if (this.isGameOver()) return this.endGame();
        if(this.currentTime > PLAYER_DELAY) {
            for (const player of this.players) {
                player.moveOnIdle()
    
            }
        }

        for (const box of this.boxes) {

            box.moveOnIdle()
            if (box.isOutOfDisplay()) this.deleteBox(box);

            this.fillBox(box)
            this.players.forEach((player) => {
                if (player.isPlayerCollidingWithBox(box)) player.moveOnTopBox(box.y)
            })

        }

        if (Math.random() < this.boxCreationProbability) {
            this.createBox();
        }

        this.players.forEach(player => {
            this.fillPlayer(player)
        });

        this.fillMaguma();

        requestAnimationFrame(this.loop);
    }

    private updateCurrentTime(timestamp) {
        if (this.startTime === 0) this.startTime = timestamp;
        this.currentTime = (timestamp - this.startTime) / 1000;
    }

    private fillBox(box) {
        this.ctx.fillStyle = 'brown';
        this.ctx.fillRect(box.x, box.y, box.width, box.height);
    }

    private fillPlayer(player) {
        this.ctx.strokeStyle = 'blue';
        this.ctx.fillStyle = player.color;
        this.ctx.fillRect(player.x, player.y, player.width, player.height);
        this.ctx.fillStyle = 'red';
        this.ctx.strokeRect(player.x, player.y, player.width, player.height);
        this.ctx.fillRect(player.x + 10, player.y + 5, player.width / 5, player.height / 5);
        this.ctx.fillRect(player.x + player.width - 15, player.y + 5, player.width / 5, player.height / 5);
        this.ctx.fillRect(player.x + 10, player.y + player.height - 15, player.width - 20, player.height / 5);
    }

    private fillMaguma(){
        this.ctx.fillStyle = `rgb(${ Math.random() * (255-200)+200},30, 20)`;
        this.ctx.fillRect(this.maguma.x, this.maguma.y, this.maguma.width, this.maguma.height);
    }

    private createBox() {
        const width = Math.random() * this.canvas.width / 4.2
        const height = Math.random() * 50 + 20
        const x = this.canvas.width
        const y = this.canvas.height - 100 - Math.random() * 100
        const speed = (Math.random() * (15 - 3) + 3)
        const box = new Box(width, height, x, y, speed)
        this.boxes.push(box);
    }

    deleteBox(box) {
        const index = this.boxes.indexOf(box);
        this.boxes.splice(index, 1);
    }

    resetCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    endGame() {
        this.ctx.fillStyle = 'black';
        this.ctx.font = '48px Arial';
        this.ctx.fillText(`${this.isGameOver().id ? '黒' : '白'}の勝ち。`, 180, this.canvas.height / 4);
        this.ctx.fillText(`頑張った時間: ${(this.currentTime - PLAYER_DELAY).toFixed(2)} 秒`, 180, this.canvas.height / 3);
    }

    isGameOver() {
        return this.players.find((player) => {
            return player.y + player.height > this.canvas.height;
        })
    }
}