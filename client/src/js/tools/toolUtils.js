import { boardHeight, boardWidth } from '../config';
import player from '../player';
import globals from '../globals';


export const mobile = globals.mobile;

export function getPixel(x, y) {
    return globals.chunkManager.getChunkPixel(x, y)
}

export function getProtect(x, y) {
    return globals.chunkManager.getProtect(x, y)
}

export function isOdd(x, y) {
    return ((x + y) % 2) === 0
}

export function getCurCol() {
    if (player.secondCol === -1) {
        return ~player.color ? player.color : -1;
    }
    if (player.color === -1) return player.secondCol;

    return isOdd(player.x, player.y) ? player.color : player.secondCol
}

export function getColByCord(x, y, first = player.color, second = player.secondCol) {
    if (second === -1) return first;
    if (first === -1) return second;

    return isOdd(x, y) ? first : second
}

export function checkBounds(x, y) {
    return (x >= 0 && x < boardWidth && y >= 0 && y < boardHeight)
}

let tmLoaded = false;
let onTMID = setInterval(() => {
    if (globals.toolManager) {
        clearInterval(onTMID);
        _onTmLoaded();
    }
}, 5);
let tmCallbacks = [];
function _onTmLoaded() {
    tmLoaded = true;
    tmCallbacks.forEach(cb => cb(globals.toolManager));
    tmCallbacks = [];
}
export function onToolManager(cb) {
    if (tmLoaded) cb(globals.toolManager);
    else tmCallbacks.push(cb)
}

export function renderFX() {
    globals.fxRenderer.needRender = true;
}