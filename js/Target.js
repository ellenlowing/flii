class Target {
    constructor(index) {
        this.landmarkIndex = index;
        this.roughstyle = {
            ...globalRoughStyle, 
            fillStyle: 'cross-hatch',
            fill: '#ff0000',
            stroke: '#ff0000',
            roughness: 0.5,
            strokeWidth: 2,
            hachureGap: 5
        }
        this.radius = 40;
        this.normradius = this.radius / videoWidthVal;
        this.pos = {x: 0, y: 0, z: 0};
        this.active = true;
    }

    // Target states could be: [bool]
    // 1. 'ACTIVE' : not yet bitten
    // 2. 'NOT ACTIVE' : bitten alrdy ouch

    update(pos) {
        this.pos = pos;
    }

    show() {
        if(this.active) {
            rc.circle(this.pos.x * videoWidthVal, this.pos.y * videoHeightVal, this.radius * 2, this.roughstyle);
        } else {
            // TODO show blood
            rc.circle(this.pos.x * videoWidthVal, this.pos.y * videoHeightVal, this.radius, this.roughstyle);
        }
    }
}