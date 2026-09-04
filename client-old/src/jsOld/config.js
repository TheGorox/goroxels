import { rgb2abgr, rgb2hex } from './utils/color';
import { getOrDefault } from './utils/localStorage';
import config from '../../../shared/config';

export let canvasId;
export let canvasName, chunkSize, boardWidth, boardHeight, allColors, currentPaletteColors, currentPalette, palettes;
export let downloaded = false;

export let bgrPalette, hexPalette, boardChunkWid, boardChunkHei, cooldown;

export const game = {
    chatLimit: parseInt(getOrDefault('chatLimit', 100), 10),
    showProtected: false,
};

export let palettePreviews = {};
const requirePreview = require.context('../img/palettePreviews', false, /\.png$/);
requirePreview.keys().map(requirePreview).forEach(path => {
    const filename = path.default.match(/([\w\d_\s]+)\.png$/);
    palettePreviews[filename[1]] = path.default;
});

export function setCurrentPalette(palette){
    let startIdx = 0, endIdx = allColors.length;
    if (!palette) {
        currentPaletteColors = allColors;
    } else {
        currentPalette = palette;

        startIdx = palette.slice[0];
        endIdx = palette.slice[1] || endIdx;

        currentPaletteColors = allColors.slice(startIdx, endIdx);
    }

    return [currentPaletteColors, startIdx, endIdx];
}


export let argbToId = {};

export async function download() {
    const path = document.location.pathname.replace(/[^\d^\w]/g, '');
    const index = config.canvases.findIndex(canvas => canvas.name === path);
    canvasId = index === -1 ? 0 : index;

    const canvasCfg = config.canvases[canvasId];

    canvasName = canvasCfg.name;
    chunkSize = canvasCfg.chunkSize;
    boardWidth = canvasCfg.boardWidth * chunkSize;
    boardHeight = canvasCfg.boardHeight * chunkSize;
    allColors = currentPaletteColors = canvasCfg.palette;
    palettes = canvasCfg.extra?.palettes ?? null;

    // Быстрая палитра
    bgrPalette = new Uint32Array(allColors.map(rgb => rgb2abgr(...rgb)));
    hexPalette = allColors.map(rgb2hex);
    boardChunkWid = canvasCfg.boardWidth;
    boardChunkHei = canvasCfg.boardHeight;
    cooldown = canvasCfg.cooldown;

    for (let i = 0; i < bgrPalette.length; i++) {
        argbToId[bgrPalette[i]] = i;
    }

    downloaded = true;
    toCall.forEach(f => f());
    toCall = [];
}

let toCall = [];
export function callOnLoad(cb) {
    if (downloaded) cb();
    else toCall.push(cb);
}

export function resolveWhenConfigDownloaded() {
    if (downloaded) return Promise.resolve();
    return new Promise(res => {
        const int = setInterval(() => {
            if (downloaded) {
                clearInterval(int);
                res();
            }
        }, 10);
    });
}

export function showProtected(show = true) {
    game.showProtected = show;
    globals.chunkManager.chunks.forEach(chunk => chunk.needRender = true);
    globals.renderer.needRender = true;
}
