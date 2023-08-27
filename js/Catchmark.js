class Catchmark {
    constructor(center, radius) {
        this.center = center;
        this.r1 = radius * videoWidthVal;
        this.r2 = this.r1 * (Math.random() * 0.3 + 0.5);
        this.steps = Math.random() * 0.4 + 0.1;
        this.roughstyle = {
            ...globalRoughStyle, 
            stroke: '#ffff00',
            disableMultiStroke: false
        };
    }

    show() {
        for(let deg = 0; deg < Math.PI * 2; deg += Math.PI * 0.1) {
            let x1 = this.r1 * Math.cos(deg) + this.center.x * videoWidthVal;
            let y1 = this.r1 * Math.sin(deg) + this.center.y * videoHeightVal;
            let x2 = this.r2 * Math.cos(deg) + this.center.x * videoWidthVal;
            let y2 = this.r2 * Math.sin(deg) + this.center.y * videoHeightVal;
            rc.line(x1, y1, x2, y2, this.roughstyle);
        }
    }
}