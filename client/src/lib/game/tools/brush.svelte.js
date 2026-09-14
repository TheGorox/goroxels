import moveIcon from '$lib/assets/icons/icon_clicker.svg?raw';
import { PIXEL_FLAG_MASK } from '$shared/protocol.js';
import { off } from '../events.js';
import { player } from '../player.svelte.js';
import { socket } from '../socket.svelte.js';
import { screenToBoardSpace } from '../utils/camera.js';
import { clamp } from '../utils/math.js';
import shapes from '../utils/shapes.js';

// circle generator is fucking up on small sizes
const fixedBrushes = {
    1: [0, 0],
    2: [0, 0, 1, 0, 0, 1, 1, 1],
    3: [-1, -1, 0, -1, 1, -1, -1, 0, 0, 0, 1, 0, -1, 1, 0, 1, 1, 1]
}

class BrushTool {
    core = null;

    name = 'clicker';
    icon = moveIcon;
    keybind = 'Space';
    showOnPanel = true;
    isBackground = false;

    isActive = $state(false);

    mousedown = false;
    downPos = [0, 0];
    lastPos = [0, 0];
    downTime = 0;

    // brush props
    lastImData = null;
    brushShape = null;
    lastOffset = [0, 0];

    init() {
        $effect(() => {
            if (!this.core?.camera) return;

            player.brushSize?.v; player.primaryCol?.v; player.seconaryCol?.v;

            this.preRenderBrush();
        });

        $effect(() => {
            const tm = this.core?.toolManager;
            if (!tm) return;

            tm.currentTool;

            this.updateCoreBrush();
        });
    }
    postInit() {
    }
    destroy() {

    }

    updateCoreBrush() {
        if (['mover', 'clicker'].some(allowedTool => this.core.toolManager.currentTool.name === allowedTool)) {
            this.core.brush.imData = this.lastImData;
            if (this.imData) {
                this.core.brush.offsetX = Math.floor(this.lastImData.width / 2 - 0.5);
                this.core.brush.offsetY = Math.floor(this.lastImData.height / 2 - 0.5);
            }
            if (this.lastOffset) {
                this.core.brush.offsetX = this.lastOffset[0];
                this.core.brush.offsetY = this.lastOffset[1];
            }

            this.core.brush.changed = true;
        }
    }

    onSelected() {
        this.mousedown = false;
        this.isActive = false;
    }

    onDeselected() {
        this.mousedown = false;
        this.isActive = false;
    }

    // e may be null if the tool is used by keybinds
    onDown(e = null) {
        this.isActive = true;
        this.downTime = Date.now();

        if (e) {
            this.lastPos = screenToBoardSpace(e.clientX, e.clientY, true);
        } else {
            this.lastPos = [
                this.core.camera.pivotWorldX | 0,
                this.core.camera.pivotWorldY | 0
            ];
        }

        this.drawTick(e);

        return true;
    }

    onUp(e = null) {
        this.isActive = false;

        this.lastPos = null;

        return true;
    }

    onMove(e) {
        if (!this.isActive) return;

        this.drawTick(e);
    }

    onpointermove(e) {
        this.onMove(e);
    }

    onpointerdrag(e) {
        this.onMove(e);

        return true;
    }

    drawTick(e) {
        let pos;
        if (e) {
            pos = screenToBoardSpace(e.clientX, e.clientY, true);
        } else {
            pos = [
                this.core.camera.pivotWorldX | 0,
                this.core.camera.pivotWorldY | 0
            ];
        }
        const lastPos = this.lastPos || pos;
        this.lastPos = pos;

        // const globalBrushShape = this.core.brush
        const pixels = shapes.advancedLine(lastPos[0], lastPos[1], pos[0], pos[1], this.brushShape);
        const pixelsCount = pixels.length / 2;
        const pixelsWithColors = new Array(pixelsCount * 3).fill(0);

        const canOverwriteProtection = false; // FIXME

        let k = 0, shouldBlinkProtection = false;
        for (let i = 0, j = 0; i < pixelsWithColors.length; i += 3, j += 2) {
            const x = pixels[j];
            const y = pixels[j + 1];
            const playerCol = player.getColorByCoord(x, y);

            let boardCol, isProtected;
            if(canOverwriteProtection){
                boardCol = this.core.chunkManager.getPixel(x, y, true)
            }else {
                [boardCol, isProtected] = this.core.chunkManager.getPixel(x, y, true, true);
                if(isProtected){
                    shouldBlinkProtection = true;
                    continue;
                }
            }

            if (boardCol === this.core.config.colorsBGR[playerCol]) continue;

            if (!player.bucket?.spend(1)) {
                break;
            }

            pixelsWithColors[k] = x;
            pixelsWithColors[k + 1] = y;
            pixelsWithColors[k + 2] = playerCol;
            k += 3;

        }
        pixelsWithColors.length = k;

        if (pixelsWithColors.length === 0) return;

        this.core.chunkManager.setPixels(pixelsWithColors, false)
        socket.sendPixels(pixelsWithColors)
    }

    isLongTap() {
        return Date.now() - this.downTime > 600;
    }

    render(ctx) {

    }

    preRenderBrush() {
        const size = player.brushSize?.v ?? 1;

        const oldImData = this.core.brush.imData;
        let imData = oldImData;
        if (oldImData?.width !== size || oldImData?.height !== size) {
            imData = new ImageData(size, size);
        }

        const data = imData.data;
        const u32view = new Uint32Array(data.buffer);

        const palette = this.core.config.colorsBGR;

        const generationalSize = size % 2 === 0 ? size - 1 : size;

        const circle = fixedBrushes[size] || shapes.filledCircle(0, 0, Math.floor(generationalSize / 2 + 1));

        const sortedCircle = new Int32Array(circle.length);
        const temp = [];
        for (let i = 0; i < circle.length; i += 2) {
            temp.push({ x: circle[i], y: circle[i + 1], d: circle[i] * circle[i] + circle[i + 1] * circle[i + 1] });
        }
        temp.sort((a, b) => a.d - b.d);
        for (let i = 0; i < temp.length; i++) {
            sortedCircle[i * 2] = temp[i].x;
            sortedCircle[i * 2 + 1] = temp[i].y;
        }

        const offset = Math.floor(size / 2 - 0.5);
        for (let i = 0; i < sortedCircle.length; i += 2) {
            const x = sortedCircle[i] + offset;
            const y = sortedCircle[i + 1] + offset;
            const idx = y * size + x;
            const color = palette[player.getColorByCoord(x, y)];
            u32view[idx] = color;
            if (x < 0 || y < 0 || x >= size || y >= size) {
                console.warn('Brush generator produced out of bounds pixel:', x, y, { offset, size });
            }
        }

        this.lastImData = imData;
        this.lastOffset = [offset, offset];
        this.brushShape = sortedCircle;

        this.updateCoreBrush();
    }
}

export default new BrushTool();