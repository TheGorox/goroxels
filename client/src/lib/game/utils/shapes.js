// NOTE: modified to return a flat array of coordinates instead of an array of [x, y] pairs for better performance

import { decodeCoord, encodeCoord } from "./math";

const circleCache = new Map();


export default {
    // uglified for speed
    line: function (x, y, x2, y2) {
    let pointArr = [];

    let steep = Math.abs(y2 - y) > Math.abs(x2 - x);
    if (steep) {
        let tmp;
        tmp = x; x = y; y = tmp;
        tmp = x2; x2 = y2; y2 = tmp;
    }
    
    let reverseFlag = false;
    if (x > x2) {
        let tmp;
        tmp = x; x = x2; x2 = tmp;
        tmp = y; y = y2; y2 = tmp;
        reverseFlag = true;
    }

    let dx = x2 - x;
    let dy = Math.abs(y2 - y);
    let err = dx >> 1; 
    let stepY = (y < y2) ? 1 : -1;

    for (; x <= x2; x++) {
        if (steep) {
            pointArr.push(x, y);
        } else {
            pointArr.push(y, x);
        }
        
        err -= dy;
        if (err < 0) {
            y += stepY;
            err += dx;
        }
    }

    // array is flat, so regular .reverse() won't work here
    if (!reverseFlag) {
        let len = pointArr.length;
        for (let i = 0; i < len / 2; i += 2) {
            let j = len - 2 - i;
            
            let tmpX = pointArr[i];
            let tmpY = pointArr[i + 1];
            
            pointArr[i] = pointArr[j];
            pointArr[i + 1] = pointArr[j + 1];
            
            pointArr[j] = tmpX;
            pointArr[j + 1] = tmpY;
        }
    }

    return pointArr;
},

    filledCircle: function (centerX, centerY, r) {
        if (centerX === 0 && centerY === 0 && circleCache.has(r)) {
            return circleCache.get(r);
        }

        let pixels = [];
        const squareR = r * r;

        for (let _x = -r + centerX; _x < r + centerX; _x++) {
            for (let _y = -r + centerY; _y < r + centerY; _y++) {
                if (isIn(_x, _y)) {
                    pixels.push(_x, _y)
                }
            }
        }

        function isIn(_x, _y) {
            let dx = _x - centerX,
                dy = _y - centerY;

            if (dx * dx + dy * dy <= squareR * 0.8)
                return true
            return false
        }

        circleCache.set(r, pixels);
        return pixels
    },

    square(x1, y1, x2, y2) {
        const minX = Math.min(x1, x2),
            minY = Math.min(y1, y2),
            maxX = Math.max(x1, x2),
            maxY = Math.max(y1, y2);

        let pixels = [];
        for (let y = minY; y < maxY + 1; y++) {
            for (let x = minX; x < maxX + 1; x++) {
                pixels.push(x, y);
            }
        }

        return pixels
    },

    // NOTE: supports only 16bit coordinates
    advancedLine(x1, y1, x2, y2, shape) {
        const pixels = new Set();

        const linePixels = this.line(x1, y1, x2, y2);
        const brushPixels = shape;

        const lineLen = linePixels.length;
        const brushLen = brushPixels.length;

        for (let i = 0; i < lineLen; i += 2) {
            const ox = linePixels[i];
            const oy = linePixels[i + 1];

            for (let j = 0; j < brushLen; j += 2) {
                const px = ox + brushPixels[j];
                const py = oy + brushPixels[j + 1];

                pixels.add(encodeCoord(px, py));
            }
        }

        const size = pixels.size;
        const result = new Int32Array(size * 2);

        let idx = 0;
        for (const encoded of pixels) {
            const decoded = decodeCoord(encoded);
            const y = decoded[0];
            const x = decoded[1];
            result[idx++] = x;
            result[idx++] = y;
        }

        return result;
    }
}