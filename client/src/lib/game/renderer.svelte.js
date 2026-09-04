import placeholderImgPath from '$lib/assets/chunkPlaceholder.png';
import { getVisibleChunks } from './utils/camera';
import { remap } from './utils/math';
import bayer from './utils/matrices/bayer';

const CHUNK_FADEOUT_MS = 700;

export function createRenderer(canvas, core) {
    const ctx = canvas.getContext('2d', { alpha: false });

    let chunkPlaceholder = null;
    let placeholderLoadTimeoutId = null;

    let needRender = true;

    const camera = core.camera;
    $effect(() => {
        camera.x;
        camera.y;
        camera.currentZoom;

        needRender = true;
    });

    // fancy placeholder fade-out
    let placeholderLevels = null;


    function init() {
        loadPlaceholderLoop();
    }

    function loadPlaceholderLoop() {
        const csize = core.config.chunkSize;
        loadImg(placeholderImgPath, csize, csize)
            .then(img => {
                chunkPlaceholder = img;
                placeholderLevels = preparePlaceholderDithering(img, 4);
                requestRender();
            })
            .catch(err => {
                console.error(`unable to load chunk placeholder: ${err}, retrying in 3s`);
                placeholderLoadTimeoutId = setTimeout(loadPlaceholderLoop, 3000);
            });
    }

    let i = 0;
    function render() {
        if (!needRender) return;
        needRender = false;

        correctSmoothing();

        const camX = camera.x;
        const camY = camera.y;
        const zoom = camera.currentZoom;
        const chunkSize = core.config.chunkSize;

        const halfW = canvas.width / 2;
        const halfH = canvas.height / 2;

        ctx.fillStyle = '#A187FF';
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        const now = Date.now();
        const chunkManager = core.chunkManager;

        const chunks = getVisibleChunks();
        
        for (let i = 0; i < chunks.length; i += 2) {
            ctx.globalAlpha = 1;

            const cx = chunks[i];
            const cy = chunks[i + 1];

            const worldLeft = cx * chunkSize;
            const worldTop = cy * chunkSize;

            let screenLeft = halfW + (worldLeft - camX) * zoom;
            let screenTop = halfH + (worldTop - camY) * zoom;

            let screenRight = halfW + (worldLeft + chunkSize - camX) * zoom;
            let screenBottom = halfH + (worldTop + chunkSize - camY) * zoom;

            screenLeft = Math.floor(screenLeft);
            screenTop = Math.floor(screenTop);
            screenRight = Math.floor(screenRight);
            screenBottom = Math.floor(screenBottom);

            const screenW = screenRight - screenLeft;
            const screenH = screenBottom - screenTop;

            const chunk = chunkManager.getChunk(cx, cy);

            if (chunk) {
                chunk.redraw();
                ctx.drawImage(chunk.canvas, screenLeft, screenTop, screenW, screenH);

                const sinceLoad = now - chunk.loadedAt;
                if (sinceLoad < CHUNK_FADEOUT_MS && placeholderLevels?.length) {
                    if(zoom > 0.99){
                        // draw dithered placeholder if big zoom

                        const curLevel = Math.floor(remap(sinceLoad, 0, CHUNK_FADEOUT_MS, 0, placeholderLevels.length - 1));
                        // ctx.globalAlpha = remap(sinceLoad, 0, CHUNK_FADEOUT_MS, 1, 0);
                        const curPlaceholder = placeholderLevels[curLevel];
                        ctx.drawImage(curPlaceholder, screenLeft, screenTop, screenW, screenH);
                    }else{
                        // or simple fade-out otherwise

                        ctx.globalAlpha = 1 - (sinceLoad / CHUNK_FADEOUT_MS);
                        ctx.drawImage(chunkPlaceholder, screenLeft, screenTop, screenW, screenH);
                    }
                    needRender = true;
                }
            } else if (chunkPlaceholder) {
                ctx.drawImage(chunkPlaceholder, screenLeft, screenTop, screenW, screenH);
            }
        }
    }

    let lastZoom = null;
    function correctSmoothing() {

        if (lastZoom === camera.targetZoom) {
            return;
        }
        lastZoom = camera.targetZoom;

        if (core.isMobile) {
            ctx.imageSmoothingEnabled = false;
            ctx.canvas.style.imageRendering = 'pixelated';
            return;
        };

        if (camera.targetZoom < 1) {
            ctx.imageSmoothingEnabled = true;
            ctx.canvas.style.imageRendering = 'auto';
        } else {
            ctx.imageSmoothingEnabled = false;
            ctx.canvas.style.imageRendering = 'pixelated';
        }
    }

    function requestRender() {
        needRender = true;
    }


    return {
        init,
        requestRender,
        render,
    }
}

function preparePlaceholderDithering(placeholder, msize = 4) {
    const levels = [];

    const matrix = bayer[msize];

    const w = placeholder.width;
    const h = placeholder.height;

    for (let level = 0; level < msize ** 2; level++) {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(placeholder, 0, 0);

        const imd = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const dataData = new Uint32Array(imd.data.buffer);

        for (let j = 0; j < w * h; j++) {
            const x = j % w;
            const y = j / w | 0;

            const mx = x % msize;
            const my = y % msize;

            if (level > matrix[my][mx]) {
                dataData[j] = 127;
            }
        }
        ctx.putImageData(imd, 0, 0);

        levels.push(canvas);
    }

    return levels;
}

async function loadImg(path, targetWidth, targetHeight) {
    return new Promise((res, rej) => {
        const image = new Image();
        image.src = path;
        image.onload = () => {
            // canvas is drawn faster than image
            const canvas = document.createElement('canvas');
            canvas.width = targetWidth ?? image.width;
            canvas.height = targetHeight ?? image.height;

            canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);

            res(canvas);
        }
        image.onerror = err => {
            rej(err);
        }
    });
}