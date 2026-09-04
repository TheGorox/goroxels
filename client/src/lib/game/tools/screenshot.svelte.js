import screenshotIcon from '$lib/assets/icons/icon_settings.svg?raw';
import { untrack } from 'svelte';
import { FX_STATE } from '../fx/fx.svelte';
import { screenToBoardSpace, boardToScreenSpace } from '../utils/camera';
import { getPathsafeDate } from '../utils/system';
import { clamp } from '../utils/math';

class ScreenshotTool {
    core = null;
    name = 'screenshot';
    icon = screenshotIcon;
    keybind = 'KeyS';
    showOnPanel = false;
    isBackground = false;

    isSelecting = $state(false);

    #boundsData = $state([-1, -1, -1, -1]);
    bounds = null;

    cachedStrokeColor = 'cyan';

    constructor() {
        this.bounds = new Proxy(this.#boundsData, {
            get(target, prop) {
                return target[prop];
            },
            set: (target, prop, value) => {
                if (!isNaN(Number(prop))) {
                    let num = Number(value) || 0;
                    
                    if (this.core?.config) {
                        const isX = prop === '0' || prop === '2';
                        const max = isX ? this.core.config.boardWidth : this.core.config.boardHeight;
                        num = Math.max(0, Math.min(num, max));
                    }

                    target[prop] = num; 

                    this.core?.fx.requestRender(); 
                    return true;
                }
                
                target[prop] = value;
                return true;
            }
        });
    }

    updateBound(index, value) {
        this.bounds[index] = Number(value) || 0;
        this.core.fx.requestRender();
    }

    expandBoundsFullCanvas() {
        this.bounds[0] = 0;
        this.bounds[1] = 0;
        this.bounds[2] = this.core.config.boardWidth;
        this.bounds[3] = this.core.config.boardHeight;

        this.core.fx.requestRender();
    }

    expandBoundsFullScreen() {
        [this.bounds[0], this.bounds[1]] = screenToBoardSpace(0, 0, true);
        [this.bounds[2], this.bounds[3]] = screenToBoardSpace(window.innerWidth, window.innerHeight, true);

        this.core.fx.requestRender();
    }

    onSelected() {
        this.bounds.fill(-1);
        this.isSelecting = false;

        const color = getComputedStyle(document.documentElement).getPropertyValue('--bg-light').trim();
        this.cachedStrokeColor = color || 'cyan';

        this.core.fx.addFx('screenshot', 0, this.renderFx.bind(this));
    }

    onDeselected() {
        console.log('removing fs');
        this.core.fx.removeFx('screenshot');
    }

    startSelection() {
        this.isSelecting = true;
        this.bounds.fill(-1);
        this.core.fx.requestRender();
    }

    onDown(e) {
        if (!this.isSelecting) return false;

        const [worldX, worldY] = screenToBoardSpace(e.clientX, e.clientY, true);
        this.bounds[0] = worldX;
        this.bounds[1] = worldY;
        this.bounds[2] = worldX;
        this.bounds[3] = worldY;

        return true;
    }

    onpointerdrag(e) {
        if (!this.isSelecting || this.bounds[0] === -1) return false;

        const [worldX, worldY] = screenToBoardSpace(e.clientX, e.clientY, true);
        this.bounds[2] = worldX;
        this.bounds[3] = worldY;

        // make the bounds always under the cursor
        if (this.bounds[2] > this.bounds[0]) this.bounds[2] += 1;
        if (this.bounds[3] > this.bounds[1]) this.bounds[3] += 1;

        this.core.fx.requestRender();
        return true;
    }

    onUp(e) {
        if (!this.isSelecting) return false;

        this.isSelecting = false;
        return true;
    }

    renderFx(ctx) {
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#000000cc';
        ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

        if (this.bounds[0] === -1) return FX_STATE.FINISHED;

        const z = this.core.camera.currentZoom;

        const [startX, startY] = boardToScreenSpace(this.bounds[0], this.bounds[1], true);
        const [endX, endY] = boardToScreenSpace(this.bounds[2], this.bounds[3], true);

        ctx.clearRect(startX, startY, endX - startX, endY - startY);

        ctx.strokeStyle = this.cachedStrokeColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 4]);
        ctx.strokeRect(startX, startY, endX - startX, endY - startY);
        ctx.setLineDash([]);

        return FX_STATE.FINISHED;
    }

    doScreenshot() {
        const minX = Math.min(this.bounds[0], this.bounds[2]);
        const minY = Math.min(this.bounds[1], this.bounds[3]);
        const maxX = Math.max(this.bounds[0], this.bounds[2]);
        const maxY = Math.max(this.bounds[1], this.bounds[3]);

        const destCanvas = document.createElement('canvas');
        destCanvas.width = maxX - minX
        destCanvas.height = maxY - minY;

        const ctx = destCanvas.getContext('2d');

        const chunkSize = this.core.config.chunkSize;

        const minChunkX = minX / chunkSize | 0;
        const minChunkY = minY / chunkSize | 0;
        const maxChunkX = maxX / chunkSize | 0;
        const maxChunkY = maxY / chunkSize | 0;

        for (let cx = minChunkX; cx < maxChunkX + 1; cx++) {
            for (let cy = minChunkY; cy < maxChunkY + 1; cy++) {
                const chunk = this.core.chunkManager.getChunk(cx, cy);
                if (chunk === null || chunk.imgData === null) continue;

                const offsetX = (cx * chunkSize) - minX;
                const offsetY = (cy * chunkSize) - minY;

                ctx.drawImage(chunk.canvas, offsetX, offsetY);
            }
        }

        let href = destCanvas.toDataURL()

        const link = document.createElement('a');
        link.download = `GX ${this.core.config.canvasName} ${getPathsafeDate()}.png`;
        link.href = href;
        link.click();
        link.remove();
    }
}

export const screenshot = new ScreenshotTool();