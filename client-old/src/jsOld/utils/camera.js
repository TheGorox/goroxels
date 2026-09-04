import camera from '../camera';
import { halfMap } from './misc';
import { boardToScreenSpace, screenToBoardSpace } from './conversions';
import {
    chunkSize,
    boardChunkWid,
    boardChunkHei,
    boardWidth,
    boardHeight
} from '../config';

export function isAreaVisible(x, y, w, h) {
    const [x1, y1] = boardToScreenSpace(x, y);
    const [x2, y2] = boardToScreenSpace(x + w, y + h);

    return x1 < window.innerWidth && x2 >= 0 && y1 < window.innerHeight && y2 >= 0;
}

export function isChunkVisible(cx, cy) {
    return isAreaVisible(cx * chunkSize, cy * chunkSize, chunkSize, chunkSize);
}

export function getVisibleChunks() {
    // todo rework it
    // rn it checks left top chunk and right bottom chunk

    let [sx, sy] = screenToBoardSpace(0, 0);
    let [ex, ey] = screenToBoardSpace(window.innerWidth, window.innerHeight);


    let startX = sx / chunkSize | 0, // math floor
        endX = ex / chunkSize + 1 | 0; // math ceil

    let startY = sy / chunkSize | 0,
        endY = ey / chunkSize + 1 | 0;

    let arr = []
    for (let x = Math.max(startX, 0); x < Math.min(endX, boardChunkWid); x++) {
        for (let y = Math.max(startY, 0); y < Math.min(endY, boardChunkHei); y++) {
            arr.push([x, y]);
        }
    }

    return arr
}

export function inBounds(x, y) {
    if (x < 0 || x >= boardWidth || y < 0 || y >= boardHeight) return false;
    return true;
}