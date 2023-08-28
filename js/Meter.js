class Meter {
    constructor() {
        this.value = 0;
        this.w = 300;
        this.h = 40;
        this.x = videoWidthVal / 2 - this.w / 2;
        this.y = videoHeightVal * 0.95 - this.h;
        this.outlinestyle = {
            fill: '#ffffff00',
            stroke: '#ffffff',
            roughness: 0.5
        };
        this.fillstyle = {
            stroke: '#ffffff00',
            fill: '#ff0000',
            roughness: 0.5,
            fillStyle: 'zigzag',
            hachureGap: 1
        };
        this.maxedCount = 0;
    }

    update() {
        this.value += 0.001;
        this.outlinestyle.roughness = map(this.value, 0, 1, 0, 2.5);
        this.fillstyle.roughness = this.outlinestyle.roughness;

        if(this.value >= 1) {
            this.maxedCount++;
            this.value = 0;
        }
    }

    show() {
        canvasCtx.save();
        canvasCtx.translate(this.x, this.y);
        canvasCtx.scale(-1, 1);
        rc.rectangle(0, 0, this.w, this.h, this.outlinestyle);
        rc.rectangle(0, 0, this.w * this.value, this.h, this.fillstyle);
        canvasCtx.restore();
    }
}