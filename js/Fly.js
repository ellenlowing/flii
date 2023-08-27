class Fly {
    constructor() {
        this.roughstyle = {
            fill: 'blue',
            stroke: 'blue'
        };
        this.seedx = Math.random() * 5;
        this.seedy = Math.random() * 5;
        this.reset();
    }

    reset() {
        this.pos = {x: Math.random(), y: Math.random()};
        this.speed = 0.005;
    }

    respawn() {
        this.pos = {x: Math.random(), y: Math.random()};
        this.speed += 0.0005;
        console.log(this.speed);
    }

    update(vx, vy) {
        // let x = this.clamp(this.pos.x + noise.perlin2(this.seedx, Date.now() * 0.001) * 0.01, 0, 1);
        // let y = this.clamp(this.pos.y + noise.perlin2(this.seedy, Date.now() * 0.001) * 0.01, 0, 1);
        let x = this.clamp(this.pos.x + vx * this.speed, 0, 1);
        let y = this.clamp(this.pos.y + vy * this.speed, 0, 1);
        this.pos = {x: x, y: y};
    }

    show() {
        rc.circle(this.pos.x * videoWidthVal, this.pos.y * videoHeightVal, 20, this.roughstyle);
    }

    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
}