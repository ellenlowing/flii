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
    }

    update(vx, vy) {
        let x = 0, y = 0;
        if(gameState == 'FREE') {
            x = clamp(this.pos.x + vx * this.speed, 0, 1);
            y = clamp(this.pos.y + vy * this.speed, 0, 1);
        } else if (gameState == 'BITING') {
            x = this.pos.x;
            y = this.pos.y;
        }
        
        this.pos = {x: x, y: y};
    }

    show() {
        rc.circle(this.pos.x * videoWidthVal, this.pos.y * videoHeightVal, 20, {...globalRoughStyle, ...this.roughstyle});
    }
}