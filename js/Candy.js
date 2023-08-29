class Candy {
    constructor() {
        this.pos = {x: Math.random(), y: Math.random()};
        this.roughstyle = {
            ...globalRoughStyle,
            fill: '#ff00ff'
        };
        this.r = 40;
        this.nr = this.r / videoWidthVal;
    }

    update() {

    }

    show() {
        rc.circle(this.pos.x * videoWidthVal, this.pos.y * videoHeightVal, this.r * 2, this.roughstyle);
    }
}