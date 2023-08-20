import { Box } from './box'

export class CanvasManager {
    private boxCreationProbability = 0.07
    private currentTime = 0
    constructor(private canvas, private ctx, private player, private boxes: Box[] = [], private startTime = 0) {

    }

    startGame() {

        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') this.player.moveToLeft();
            else if (event.key === 'ArrowRight') this.player.moveToRight();
            else if (event.key === 'ArrowUp' && !this.player.isJumping) this.player.jump();
        });

        document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') this.player.stopMovement()
        });

        this.loop(0)
    }

    private loop = (timestamp) => {

        this.updateCurrentTime(timestamp)
        this.resetCanvas()

        if (this.isGameOver()) return this.endGame();

        this.player.moveOnIdle()

        for (const box of this.boxes) {

            box.moveOnIdle()
            if (box.isOutOfDisplay()) this.deleteBox(box);

            this.fillBox(box)
            if (this.player.isPlayerCollidingWithBox(box)) this.player.moveOnTopBox(box.y)

        }

        if (Math.random() < this.boxCreationProbability) {
            this.createBox();
        }

        this.fillPlayer()

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

    private fillPlayer() {
        this.ctx.strokeStyle = 'blue';
        this.ctx.fillStyle = 'red';
        this.ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);
        this.ctx.fillRect(this.player.x + 10, this.player.y + 5, this.player.width / 5, this.player.height / 5);
        this.ctx.fillRect(this.player.x + this.player.width - 15, this.player.y + 5, this.player.width / 5, this.player.height / 5);
        this.ctx.fillRect(this.player.x + 10, this.player.y + this.player.height - 15, this.player.width - 20, this.player.height / 5);
    }

    private createBox() {
        const width = Math.random() * this.canvas.width / 4.2
        const height = Math.random() * 50 + 20
        const x = this.canvas.width
        const y = this.canvas.height - 100 - Math.random() * 100
        const speed = Math.random() * 10
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
        this.ctx.fillText(`頑張った時間: ${this.currentTime.toFixed(2)} 秒`, 180, this.canvas.height / 2);
    }

    isGameOver() {
        return this.player.y + this.player.height > this.canvas.height;
    }
}