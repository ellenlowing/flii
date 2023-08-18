class Fly {
    constructor(x, y) {
        this.pos = {x: x, y: y};
        this.roughstyle = {
            fill: 'blue',
            stroke: 'blue'
        };
        this.seedx = Math.random() * 5;
        this.seedy = Math.random() * 5;
    }

    update() {
        let x = this.clamp(this.pos.x + noise.perlin2(this.seedx, Date.now() * 0.001) * 0.01, 0, 1);
        let y = this.clamp(this.pos.y + noise.perlin2(this.seedy, Date.now() * 0.001) * 0.01, 0, 1);
        this.pos = {x: x, y: y};
    }

    show() {
        rc.circle(this.pos.x * videoWidthVal, this.pos.y * videoHeightVal, 20, this.roughstyle);
    }

    clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
}