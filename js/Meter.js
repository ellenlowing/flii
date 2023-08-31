class Meter {
    constructor(x, y, w) {
        this.value = 0;
        this.w = w;
        this.h = 10;
        this.x = x;
        this.y = y;
        this.outlinestyle = {
            fill: '#ffffff00',
            stroke: '#ffffff',
            roughness: 0.5,
            strokeWidth: 2
        };
        this.fillstyle = {
            stroke: '#ffffff00',
            fill: '#ff0000',
            roughness: 0.5,
            fillStyle: 'zigzag',
            hachureGap: 1
        };
    }

    update(x, y) {
        this.outlinestyle.roughness = map(this.value, 0, 1, 0.5, 2);
        this.fillstyle.roughness = this.outlinestyle.roughness;
        this.x = x;
        this.y = y;
    }

    show() {
        canvasCtx.save();
        canvasCtx.translate(this.x * videoWidthVal, this.y * videoHeightVal);
        canvasCtx.scale(-1, 1);
        rc.rectangle(0, 0, this.w, this.h, this.outlinestyle);
        if(this.value > 0) {
            rc.rectangle(2, 2, this.w * this.value - 4, this.h - 4, this.fillstyle);
        }
        canvasCtx.restore();
    }
}