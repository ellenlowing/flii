// Global variables to share between files
const canvasElement = document.getElementById("output_canvas");
const rc = rough.canvas(canvasElement);
const videoHeightVal = canvasElement.height;
const videoWidthVal = canvasElement.width;
const globalRoughStyle = {
    roughness: 1.4,
    fillStyle: 'solid'
}

const clamp = (num, min, max) => {
    return Math.min(Math.max(num, min), max);
}

const map = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}