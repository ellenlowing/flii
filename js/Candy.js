class Candy {
    constructor(pos) {
        this.pos = pos;
        this.roughstyle = {
            ...globalRoughStyle,
            fill: '#ff00ff'
        };
    }

    update() {

    }

    show() {
        rc.rectangle(this.pos.x, this.pos.y, 40, 40, this.roughstyle);
    }
}