export function clamp(v, min, max){
    return Math.max(Math.min(v, max), min);
}

export function remap(value, inputMin, inputMax, outputMin, outputMax) {
    return (value - inputMin) * (outputMax - outputMin) / (inputMax - inputMin) + outputMin;
}

// -32768 to 32767
export function encodeCoord(x, y) {
    return ((x & 0xFFFF) << 16) | (y & 0xFFFF);
}

export function decodeCoord(encoded) {
    const x = encoded >> 16;
    const y = (encoded << 16) >> 16;
    
    return [x, y];
}