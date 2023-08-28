class Path {
    constructor() {
        this.points = [];
        this.angles = [];
        this.stepSize = 20;
        this.roughstyle = {
            ...globalRoughStyle, 
            strokeLineDash: [2, 10],
            roughness: 0,
            strokeWidth: 3
        };
    }

    get lastPt() {
        return this.points[this.points.length-1];
    }

    get lastAngle() {
        return this.angles[this.angles.length-1];
    }

    addPoint(x, y) {
        if(this.points.length < 1) {
            this.points.push(createVector(x, y));
            return;
        }

        const nextPt = createVector(x, y);
        let d = nextPt.dist(this.lastPt);
        while(d > this.stepSize) {
            const nextPtCopy = nextPt.copy();
            const lastPtCopy = this.lastPt.copy();
            const diff = nextPtCopy.sub(this.lastPt);
            diff.normalize();
            diff.mult(this.stepSize);
            this.points.push(lastPtCopy.add(diff));
            this.angles.push(diff.heading());
            d -= this.stepSize;
        }
    }

    clearPoints() {
        this.points = [];
    }

    addRoughPoint(x, y) {
        this.points.push([x, y]);

        if(this.points.length > 60) {
            this.points.shift();
        }
    }

    show() {
        rc.linearPath(this.points, this.roughstyle);
    }
}