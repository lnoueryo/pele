import { Box } from './box'

export class Player {
    constructor(
        private id,
        private x,
        private y,
        private width,
        private height,
        private vx,
        private vy,
        private vg,
        private jumpStrength,
        private isJumping,
        private speed
    ) {}

    moveToLeft() {
        this.vx = -this.speed;
    }

    moveToRight() {
        this.vx = this.speed;
    }

    jump() {
        this.vy = this.jumpStrength;
        this.isJumping = true;
    }

    stopMovement() {
        this.vx = 0;
    }

    moveOnIdle() {
        this.vy += this.vg;
        this.x += this.vx;
        this.y += this.vy;
    }

    moveOnTopBox(boxY) {
        this.y = boxY - this.height;
        this.vy = 0;
        this.isJumping = false;
    }

    isPlayerCollidingWithBox(box: Box) {
        return this.x + this.width > box.x &&
        this.x < box.x + box.width &&
        this.y + this.height > box.y &&
        this.y < box.y + box.height &&
        this.vy >= 0
    }
}