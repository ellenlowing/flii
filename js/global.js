// Global variables to share between files
const canvasElement = document.getElementById("output_canvas");
const rc = rough.canvas(canvasElement);
const videoHeightVal = canvasElement.height;
const videoWidthVal = canvasElement.width;
const globalRoughStyle = {
    roughness: 1.4,
    fillStyle: 'solid'
}

// game states could be 
// 1. FREE : human freely catching fly
// 2. BITING : Flii has locked on this target and is biting 
let gameState = 'FREE';

const clamp = (num, min, max) => {
    return Math.min(Math.max(num, min), max);
}

const map = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}