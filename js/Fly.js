class Fly {
    constructor() {
        this.roughstyle = {
            ...globalRoughStyle,
            fill: 'black',
            stroke: 'black'
        };
        this.wingstyle = {
            ...globalRoughStyle,
            fill: 'white',
            stroke: 'black',
            fillStyle: 'cross-hatch',
            fillWidth: 2
        };
        this.eyestyle = {
            ...globalRoughStyle,
            fill: '#A0250C',
            stroke: '#000000',
            strokeWidth: 0.3,
            roughness: 1
        };
        this.seedx = Math.random() * 5;
        this.seedy = Math.random() * 5;
        this.reset();
        this.heading = 0;
    }

    reset() {
        this.pos = {x: Math.random(), y: Math.random()};
        this.speed = 0.005;
    }

    respawn() {
        this.pos = {x: Math.random(), y: Math.random()};
        this.heading = Math.random() * Math.PI;
        this.speedup();
    }

    speedup() {
        this.speed += 0.001;
    }

    update(vx, vy) {
        let x = clamp(this.pos.x + vx * this.speed, 0, 1);
        let y = clamp(this.pos.y + vy * this.speed, 0, 1);
        this.pos = {x: x, y: y};
        if(vx != 0 && vy != 0) {
            this.heading = Math.atan2(vy, vx) + Math.PI / 2;
        }
    }

    show() {
        canvasCtx.save();
        canvasCtx.translate(this.pos.x * videoWidthVal, this.pos.y * videoHeightVal);
        canvasCtx.rotate(this.heading);
        rc.ellipse(10, 0, 20, 10, this.wingstyle);
        rc.ellipse(-10, 0, 20, 10, this.wingstyle);
        rc.ellipse(0, 0, 12, 20, this.roughstyle);
        rc.polygon([[-2, -10], [0, -20], [2, -10]], this.roughstyle);
        rc.ellipse(-3.5, -10, 6, 6, this.eyestyle);
        rc.ellipse(3.5, -10, 6, 6, this.eyestyle);
        canvasCtx.restore();
    }
}