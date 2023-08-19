export class Box {
  constructor(
    public width,
    public height,
    public x,
    public y,
    public speed,
  ) { }

  moveOnIdle() {
    this.x -= this.speed;
  }

  isOutOfDisplay() {
    return this.x + this.width < 0;
  }
}