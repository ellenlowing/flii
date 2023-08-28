class Target {
    constructor(index) {
        this.landmarkIndex = index;
        this.state = 'ACTIVE';
        this.roughstyle = {
            ...globalRoughStyle, 
            fillStyle: 'cross-hatch',
            fill: '#ff0000',
            stroke: '#ff0000',
            roughness: 0.5,
            strokeWidth: 2,
            hachureGap: 30
        }
        this.radius = 40;
        this.pos = {x: 0, y: 0, z: 0};
    }

    update(pos) {
        this.pos = pos;
        switch(this.state) {
            case 'ACTIVE':
                break;
            
            case 'BITING':
                // shows meter
                break;
        }
    }

    show() {
        // target states could be 
        // 1. ACTIVE : target is still active 
        // 2. BITING : Flii has locked on this target and is biting 
        // 3. BITTEN : Flii has conquered the human and bitten this target.

        switch(this.state) {
            case 'ACTIVE':
                rc.circle(this.pos.x * videoWidthVal, this.pos.y * videoHeightVal, 80, this.roughstyle);
                break;
            
            case 'BITING':
                // shows meter
                break;

            case 'BITTEN':
                // bleeding
                break;
        }
    }

    setState(state) {
        this.state = state;
    }
}