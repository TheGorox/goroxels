import sharedConfig from '$shared/config.export';
import { rgb2abgr, rgb2hex } from './utils/color';

let initialized = false;

export const config = $state({
    canvasName: 'default',
    canvasId:    0,
    chunkSize:   0,
    boardWidth:  0,
    boardHeight: 0,
    chunksX:     0,
    chunksY:     0,
    colors:      [], // [[r,g,b], ...]
    colorsBGR:   [], // for fast pixel replacements
    colorsBGRtoIdx:   new Map(),
    colorsHex:   [], // for css
    shared:      {}  // shared config for this canvas, if needed
});

export function initConfig() {
    if (initialized) return;
    initialized = true;

    const url = new URL(window.location.href);

    const pathParts = url.pathname.split('/').filter(Boolean);
    const canvasName = pathParts.at(-1) || 'main';

    const index = sharedConfig.canvases.findIndex(canvas => canvas.name === canvasName);
    const canvasId = index === -1 ? 0 : index;

    const canvCfg = sharedConfig.canvases[canvasId];

    config.canvasName = canvasName;
    config.canvasId = canvasId;
    config.chunkSize = canvCfg.chunkSize;
    config.boardWidth = canvCfg.chunkSize * canvCfg.boardWidth;
    config.boardHeight = canvCfg.chunkSize * canvCfg.boardHeight;
    config.chunksX = canvCfg.boardWidth;
    config.chunksY = canvCfg.boardHeight;

    preparePalettes(config, canvCfg.palette);

    config.shared = sharedConfig;

    console.log(`[config] Canvas initialized: ${canvasName}`);

    return config;
}

function preparePalettes(config, allColors) {
    config.colors = allColors;
    config.colorsBGR = new Uint32Array(allColors.map(rgb => rgb2abgr(...rgb)));
    for(let i = 0; i < allColors.length; i++){
        config.colorsBGRtoIdx.set(config.colorsBGR[i], i);
    }
    config.colorsHex = allColors.map(rgb2hex);
}