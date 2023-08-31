class Catchmark {
    constructor(center, radius, handedness, flycaught=false) {
        this.center = center;
        this.handedness = handedness;
        this.r1 = radius * videoWidthVal;
        this.r2 = this.r1 * (Math.random() * 0.3 + 0.5);
        this.scale = map(radius, 0, 0.25, 0.2, 3);
        this.fontscale = map(radius, 0, 0.25, 50, 300);
        this.steps = Math.random() * 0.4 + 0.1;
        this.flycaught = flycaught;
        this.roughstyle = {
            ...globalRoughStyle, 
            stroke: flycaught ? '#ff0000' : '#ffff00',
            disableMultiStroke: true,
            fill: '#ffffff',
            fillStyle: 'hachure'
        };
    }

    show(opacity) {
        // sparks
        // for(let deg = 0; deg < Math.PI * 2; deg += Math.PI * 0.1) {
        //     let x1 = this.r1 * Math.cos(deg) + this.center.x * videoWidthVal;
        //     let y1 = this.r1 * Math.sin(deg) + this.center.y * videoHeightVal;
        //     let x2 = this.r2 * Math.cos(deg) + this.center.x * videoWidthVal;
        //     let y2 = this.r2 * Math.sin(deg) + this.center.y * videoHeightVal;
        //     rc.line(x1, y1, x2, y2, this.roughstyle);
        // }

        // emoji
        canvasCtx.font = `${this.fontscale}px Arial`;
        canvasCtx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        canvasCtx.fillText("✊", this.center.x * videoWidthVal - this.r1 * 0.75, this.center.y * videoHeightVal + this.r1 * 0.75);

        // debug
        // rc.circle(this.center.x * videoWidthVal, this.center.y * videoHeightVal, 50);

        // fist svg
        // canvasCtx.save();
        // canvasCtx.translate((this.center.x) * videoWidthVal, this.center.y * videoHeightVal);
        // if(this.handedness == 'Right') {
        //     canvasCtx.scale(this.scale, this.scale);
        // } else {
        //     canvasCtx.scale(-this.scale, this.scale);
        // }
        // rc.path("M90.67,32.361c1.5-16-16-17.5-16-17.5c-5-14.5-18-7-18-7c-6.5-14.5-19.5-4.5-19.5-4.5c-18.5-5.5-20.5,10.5-20.5,10.5c-1.312,4.964-0.896,21.13-0.896,21.13c-1.25-9.5-8.604-3.13-8.604-3.13c-9.5,10.5-5,18-5,18c8,14,27,32.5,27,32.5c7,6,3,9.5,3,9.5l48.5,0.5l2.666-9C94.336,62.361,90.67,32.361,90.67,32.361z", this.roughstyle);
        // canvasCtx.restore();
    }
}