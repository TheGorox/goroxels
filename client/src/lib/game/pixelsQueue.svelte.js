import { useGameCore } from './core.svelte';

const MULTIPLIER = 1000000; 

const expiresMap = new Map(); 
const oldColMap = new Map();


export function queuePixelRevert(x, y, oldColor) {
    const key = y * MULTIPLIER + x;
    
    if (expiresMap.has(key)) {
        expiresMap.set(key, performance.now() + 3000);
        return;
    }

    expiresMap.set(key, performance.now() + 3000);
    oldColMap.set(key, oldColor);
}

export function confirmPixel(x, y) {
    const key = y * MULTIPLIER + x;
    expiresMap.delete(key);
    oldColMap.delete(key);
}

export function processPendingPixels() {
    if (expiresMap.size === 0) return;

    const core = useGameCore();
    if(!core || !core.chunkManager) return;
    
    const now = performance.now();
    let needRender = false;

    for (const [key, expires] of expiresMap) {
        if (now >= expires) {
            const y = Math.floor(key / MULTIPLIER);
            const x = key % MULTIPLIER;
            
            core.chunkManager.setPixels([x, y, oldColMap.get(key)], false);
            
            expiresMap.delete(key);
            oldColMap.delete(key);
            needRender = true;
        }
    }

    if (needRender) core.renderer.needRender = true;
}