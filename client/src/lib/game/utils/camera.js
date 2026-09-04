import { useGameCore } from '../core.svelte';

export function screenToBoardSpace(x, y, rounded=false){
    const core = useGameCore();
    const canvas = core.mainCanvas;
    const camera = core.camera;

    
    const worldX = camera.x + (x - canvas.clientWidth / 2) / camera.currentZoom;
    const worldY = camera.y + (y - canvas.clientHeight / 2) / camera.currentZoom;

    if(rounded){
        return [Math.floor(worldX), Math.floor(worldY)];
    }
    return [worldX, worldY];
}

export function boardToScreenSpace(worldX, worldY, rounded=false) {
    const core = useGameCore();
    const canvas = core.mainCanvas;
    const camera = core.camera;
    
    const screenX = canvas.clientWidth / 2 + (worldX - camera.x) * camera.currentZoom;
    const screenY = canvas.clientHeight / 2 + (worldY - camera.y) * camera.currentZoom;

    if(rounded){
        return [Math.floor(screenX), Math.floor(screenY)];
    }
    return [screenX, screenY];
}


export function isAreaVisible(x, y, w, h) {
    const core = useGameCore();
    const canvas = core.mainCanvas;
    
    const [x1, y1] = boardToScreenSpace(x, y);
    const [x2, y2] = boardToScreenSpace(x + w, y + h);

    return x1 < window.innerWidth && x2 >= 0 && y1 < window.innerHeight && y2 >= 0;
}

export function isChunkVisible(cx, cy) {
    const core = useGameCore();
    const chunkSize = core.config.chunkSize;

    return isAreaVisible(cx * chunkSize, cy * chunkSize, chunkSize, chunkSize);
}

let _visibleChunks = [];
let _lastVisChunksKey = '';
export function getVisibleChunks() {
    const core = useGameCore();
    const chunkSize = core.config.chunkSize;
    const boardChunkWid = core.config.chunksX;
    const boardChunkHei = core.config.chunksY;

    
    let [sx, sy] = screenToBoardSpace(0, 0);
    let [ex, ey] = screenToBoardSpace(window.innerWidth, window.innerHeight);
    
    
    let startX = sx / chunkSize | 0;
    let endX = ex / chunkSize + 1 | 0;
    
    let startY = sy / chunkSize | 0;
    let endY = ey / chunkSize + 1 | 0;

    
    startX = startX < 0 ? 0 : startX; // math.max
    endX = endX > boardChunkWid ? boardChunkWid : endX; // math.min
    startY = startY < 0 ? 0 : startY; // math.max
    endY = endY > boardChunkHei ? boardChunkHei : endY; // math.min

    
    const key = startX + ',' + endX + ',' + startY + ',' + endY;
    if (key === _lastVisChunksKey) return _visibleChunks;
    _lastVisChunksKey = key;
    
    _visibleChunks.length = 0;
    for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
            _visibleChunks.push(x, y);
        }
    }

    return _visibleChunks;
}

export function isInBounds(x, y) {
    const core = useGameCore();
    const cfg = core.config;

    if (x < 0 || x >= cfg.boardWidth || y < 0 || y >= cfg.boardHeight) return false;
    return true;
}