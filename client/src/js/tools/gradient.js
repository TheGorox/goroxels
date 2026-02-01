import { mobile } from "./toolUtils";
import wandCursor from '../../img/toolIcons/wand-cur.png';
import wandIcon from '../../img/toolIcons/wand-cur.png';
import { allColors, argbToId, hexPalette } from '../config';
import { addFX, FX, FX_STATE, removeFX } from '../fxcanvas';
import globals from '../globals';
import player from '../player';
import Tool from '../Tool';
import { isDarkColor, rgb2abgr } from '../utils/color';
import { boardToScreenSpace, screenToBoardSpace } from '../utils/conversions';
import { isClick } from '../utils/misc';
import { generateShader } from '../utils/webGL';
import bayerMatrices from '../convert/matrices/bayer';
import camera from "../camera";
import MiniWindow from "../MiniWindow";
import { translate as t } from "../translate";
import { capitalize } from "../utils/strings";
import { getLS, setLS } from "../utils/localStorage";


const GRAD_STATE = {
    DISABLED: 0,
    ENABLED: 1,
    SELECTING: 2,
    PREVIEWING: 2
};
const FILL_MODE = {
    FLOODFILL: 0,
    GLOBAL: 1,
}

let gradientCanvas = null, gradientCtx = null;
function generateGradient(w, h, x1, y1, x2, y2, color1, color2) {
    if (gradientCanvas === null || gradientCanvas.width < w || gradientCanvas.height < h ||
        // re-create the canvas if its too big - causes lags
        gradientCanvas.width / w >= 2 || gradientCanvas.height / h >= 2
    ) {
        if (gradientCanvas === null) {
            gradientCanvas = document.createElement('canvas');
            gradientCtx = gradientCanvas.getContext('2d');
        }
        gradientCanvas.width = w;
        gradientCanvas.height = h;
    } else {
        gradientCtx.clearRect(0, 0, w, h);
    }

    // edge case
    // if (x1 === x2 && y1 === y2) {
    //     gradientCtx.save();
    //     gradientCtx.fillStyle = color2;
    //     gradientCtx.fillRect(0, 0, w, h);
    //     gradientCtx.restore();
    //     return gradientCanvas;
    // }

    // const grad = gradientCtx.createLinearGradient(x1, y1, x2, y2);

    // // we should swap colors because createLinearGradient does the same
    // grad.addColorStop(0.0, color2);
    // grad.addColorStop(1.0, color1);

    // gradientCtx.save();
    // gradientCtx.fillStyle = grad;
    // gradientCtx.fillRect(0, 0, w, h);
    // gradientCtx.restore();

    return gradientCanvas;
}


function euclidianRGBA(c1, c2) {
    const dR = c1[0] - c2[0];
    const dG = c1[1] - c2[1];
    const dB = c1[2] - c2[2];
    const dA = c1[3] - c2[3];

    return Math.sqrt(dR * dR + dG * dG + dB * dB + dA * dA);
}
function distXY(cord1, cord2) {
    const dx = cord1[0] - cord2[0];
    const dy = cord1[1] - cord2[1];

    return Math.sqrt(dx * dx + dy * dy);
}
function nearestColorId(rgba, palette) {
    let dist = 510, colId = -1;
    for (let i = 0; i < palette.length; i++) {
        const col = palette[i];

        const curDist = euclidianRGBA(rgba, col);
        if (curDist < dist) {
            dist = curDist;
            colId = i;
        }
    }
    return colId;
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(max, num))
}
// we can use these functions to draw gradients without drawing it
function getLinearGradientPosition(x, y, x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;

    const len2 = dx * dx + dy * dy;

    if (len2 === 0)
        return 0;

    const t = ((x - x0) * dx + (y - y0) * dy) / len2;

    return clamp(t, 0, 1);
}
function getRadialGradientPosition(x, y, x0, y0, x1, y1) {
    const maxDist = Math.hypot(x1 - x0, y1 - y0);

    if (maxDist === 0)
        return 0;

    const dist = Math.hypot(x - x0, y - y0);

    const t = dist / maxDist;

    return clamp(t, 0, 1);
}

// quantize gradient to the palette using some dithering
function ditherGradient(ctx, color1, color2, matrixSize, gradientProps) {
    const matrix = bayerMatrices[matrixSize];
    const matrixLen = matrixSize ** 2;

    let firstTransparent = color1 === null,
        secondTransparent = color2 === null;
    if (firstTransparent) {
        color1 = [0, 0, 0, 0];
    }
    if (secondTransparent) {
        color2 = [0, 0, 0, 0];
    }

    if (color1.length === 3) {
        color1 = [...color1, 255];
    }
    if (color2.length === 3) {
        color2 = [...color2, 255];
    }

    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    const ox = gradientProps.originX;
    const oy = gradientProps.originY;

    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;

            const matrixVal = matrix[Math.abs(ox + x) % matrixSize][Math.abs(oy + y) % matrixSize];
            const matrixValNorm = ((matrixVal + 0.5) / matrixLen);

            let gradientPos;
            if (gradientProps.isRadial) {
                gradientPos = getRadialGradientPosition(x, y, gradientProps.p1[0], gradientProps.p1[1], gradientProps.p2[0], gradientProps.p2[1]);
            } else {
                gradientPos = getLinearGradientPosition(x, y, gradientProps.p1[0], gradientProps.p1[1], gradientProps.p2[0], gradientProps.p2[1]);
            }

            const useFirst = gradientPos < matrixValNorm;
            let col = useFirst ? color1 : color2;

            data[i + 0] = col[0];
            data[i + 1] = col[1];
            data[i + 2] = col[2];
            data[i + 3] = col[3];
        }
    }

    ctx.putImageData(imageData, 0, 0);
    return ctx.canvas;
}

function selectColor(ctx, rgb, startX, startY, floodfillMode) {
    const canvas = ctx.canvas;
    const w = canvas.width;
    const h = canvas.height;

    const imData = ctx.getImageData(0, 0, w, h);
    const view = new Int32Array(imData.data.buffer);
    if (!rgb) {
        ctx.clearRect(0, 0, w, h);
        return;
    }

    const targetAbgr = rgb2abgr(...rgb);

    if (floodfillMode === FILL_MODE.GLOBAL) {
        for (let i = 0; i < view.length; i++) {
            const color = view[i];

            if (color !== targetAbgr) {
                view[i] = 0;
            }
        }
    } else if (floodfillMode === FILL_MODE.FLOODFILL) {
        floodFillScanline(view, w, h, startX, startY);
    }

    ctx.putImageData(imData, 0, 0);
}
function floodFillScanline(view, w, h, startX, startY) {
    const startIndex = startY * w + startX;
    const targetColor = view[startIndex];
    if (targetColor === undefined) return;

    const fillColor = targetColor - 0x01000000;
    if (targetColor === fillColor) return;

    const stack = [startIndex];

    while (stack.length) {
        let idx = stack.pop();

        let left = idx;
        while (left % w > 0 && view[left - 1] === targetColor) left--;

        let right = idx;
        while (right % w < w - 1 && view[right + 1] === targetColor) right++;

        for (let x = left; x <= right; x++) {
            view[x] = fillColor;

            const up = x - w;
            const down = x + w;

            if (up >= 0 && view[up] === targetColor) stack.push(up);
            if (down < w * h && view[down] === targetColor) stack.push(down);
        }
    }

    for (let i = 0; i < view.length; i++) {
        if (view[i] !== fillColor) view[i] = 0;
    }
}

function doISOSetup(start_x, start_y, x1, y1) {
    const dx = x1 - start_x;
    const dy = y1 - start_y;

    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < 0) angle += 360;

    const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315];

    let closest = snapAngles.reduce((prev, curr) => {
        const diffPrev = Math.min(Math.abs(prev - angle), 360 - Math.abs(prev - angle));
        const diffCurr = Math.min(Math.abs(curr - angle), 360 - Math.abs(curr - angle));
        return diffCurr < diffPrev ? curr : prev;
    });

    const rad = closest * Math.PI / 180;
    const len = Math.sqrt(dx * dx + dy * dy);

    x1 = start_x + Math.cos(rad) * len;
    y1 = start_y + Math.sin(rad) * len;

    return [x1 | 0, y1 | 0];
}





class Gradient extends Tool {
    constructor(...args) {
        super(...args);

        this.state = GRAD_STATE.DISABLED;

        this.mouseListeners = {
            down: this.mousedown.bind(this),
            move: this.mousemove.bind(this),
            up: this.mouseup.bind(this)
        };

        // color on which to render/draw the gradient
        this.selectedColor = null;

        this.firstPointPos = null;
        this.secondPointPos = null;

        this.movingFirstPoint = false;
        this.movingSecondPoint = false;
        this.movingDone = false;

        this.previewCanvas = null;
        this.previewProps = {
            // canvas x/y to know where to draw the preview
            x: null,
            y: null,
            // w/h of the current gradient, since old(larger) canvas could be reused
            w: null,
            h: null,
        }
        this.fx = null;

        this.options = {
            globalMaxRadius: 10,
            fillMode: parseInt(getLS('grad:fill_mode') || FILL_MODE.FLOODFILL),
            isRadial: getLS('grad:radial') === 'true',
            magnetMode: getLS('grad:magnet_mode') === 'true',
            matrixSize: parseInt(getLS('grad:matrix_size') || 2)
        }

        this.menuWindow = null;
        this.lastMenuPos = null;

        this.on('up', this.up.bind(this));
        this.on('selected', this.selected.bind(this));
        this.on('deselected', this.deselected.bind(this));
    }

    // mobile events
    selected() {
        if (this.state !== GRAD_STATE.DISABLED) return;


        this.state = GRAD_STATE.ENABLED;
        this.showSubmenu();
        this.addMouseListeners();
        this.addFx();
    }
    deselected() {
        this.firstPointPos = this.secondPointPos = null;
        this.movingFirstPoint = this.movingSecondPoint = false;
        this.movingDone = false;
        this.previewCanvas = null;
        
        
        this.removeMouseListeners();
        this.hideSubmenu();
        this.removeFx();
        
        this.state = GRAD_STATE.DISABLED;
    }

    showSubmenu() {
        const menuWin = new MiniWindow(t('gradient'), 2, true);
        const body = $(
            `<div>
            <select id="gradientFillMode">
                <option value="${FILL_MODE.GLOBAL}">
                    ${t('fill_mode.global')}
                </option>
                <option value="${FILL_MODE.FLOODFILL}">
                    ${t('fill_mode.floodfill')}
                </option>
            </select><br>
            ${capitalize(t('bayer'))}: <select id="gradientMatrixSize">
                <option value="2">
                    2
                </option>
                <option value="4">
                    4
                </option>
                <option value="8">
                    8
                </option>
            </select><br>
            <label for="gradientIsRadial">${capitalize(t('radial'))}:</label><input type="checkbox" id="gradientIsRadial">
            <label for="gradientMagnetMode">${capitalize(t('magnet_mode'))}:</label><input type="checkbox" id="gradientMagnetMode">
            </div>`
        );
        menuWin.bodyElement.append(body);
        document.body.appendChild(menuWin.element[0]);

        const fillModeSel = body.find('#gradientFillMode');
        fillModeSel.val(this.options.fillMode.toString());
        fillModeSel.on('change', e => {
            this.options.fillMode = parseInt(fillModeSel.val());
            setLS('grad:fill_mode', fillModeSel.val());
            this.updatePreview();
        });

        const bayerSizeSel = body.find('#gradientMatrixSize');
        bayerSizeSel.val(this.options.matrixSize.toString());
        bayerSizeSel.on('change', e => {
            this.options.matrixSize = parseInt(bayerSizeSel.val());
            setLS('grad:matrix_size', bayerSizeSel.val());
            this.updatePreview();
        });

        const isRadialCb = body.find('#gradientIsRadial');
        isRadialCb.prop('checked', this.options.isRadial);
        isRadialCb.on('change', e => {
            this.options.isRadial = isRadialCb.is(':checked');
            setLS('grad:radial', isRadialCb.is(':checked'));
            this.updatePreview();
        });

        const magnetModeCb = body.find('#gradientMagnetMode');
        magnetModeCb.prop('checked', this.options.magnetMode);
        magnetModeCb.on('change', e => {
            this.options.magnetMode = magnetModeCb.is(':checked');
            setLS('grad:magnet_mode', magnetModeCb.is(':checked'));
            this.updatePreview();
        });

        this.menuWindow = menuWin;
        if (this.lastMenuPos) {
            menuWin.x = this.lastMenuPos[0];
            menuWin.y = this.lastMenuPos[1];
        } else {
            menuWin.x = window.innerWidth - menuWin.w;
            menuWin.y = window.innerHeight / 2;
        }

        const originalMoveTo = this.menuWindow.moveTo.bind(this.menuWindow);
        this.menuWindow.moveTo = (x, y) => {
            this.lastMenuPos = [x, y];
            originalMoveTo(x, y);
        }

        this.menuWindow.on('okClicked', this.menuOkClicked.bind(this));
        this.menuWindow.on('cancelClicked', this.menuCancelClicked.bind(this));

    }
    hideSubmenu() {
        if(!this.menuWindow) return;
        this.menuWindow.close();
        this.menuWindow = null;
    }

    menuOkClicked(){
        this.drawRendered();
        this.deselected();
    }
    menuCancelClicked(){
        this.deselected();
    }

    up() {
        if (mobile) return;

        switch (this.state) {
            case GRAD_STATE.DISABLED: {
                this.selected();
                break;
            }
            default: {
                this.deselected();
                break;
            }
        }
    }

    mousedown(e) {
        camera.disableMove();
        if (this.firstPointPos) {
            const distToFirstPoint = distXY(boardToScreenSpace(this.firstPointPos[0] + 0.5, this.firstPointPos[1] + 0.5), [e.clientX, e.clientY]);
            if (distToFirstPoint < 10) {
                this.movingFirstPoint = true;
                return;
            }

            const distToSecondPoint = distXY(boardToScreenSpace(this.secondPointPos[0] + 0.5, this.secondPointPos[1] + 0.5), [e.clientX, e.clientY]);
            if (distToSecondPoint < 10) {
                this.movingSecondPoint = true;
                return;
            }
        } else {
            this.firstPointPos = [player.x, player.y];
            this.selectedColor = globals.chunkManager.getChunkPixel(player.x, player.y);
        }
    }

    mousemove(e) {
        if (e.buttons !== 1 || !this.firstPointPos) return;
        if (this.movingFirstPoint) {
            // avoiding updates on the same pixel
            if (this.firstPointPos?.at(0) === player.x && this.firstPointPos?.at(1) === player.y) return;

            this.firstPointPos = [player.x, player.y];
            if(this.secondPointPos && this.options.magnetMode){
                this.firstPointPos = doISOSetup(...this.secondPointPos, ...this.firstPointPos)
            }

            this.selectedColor = globals.chunkManager.getChunkPixel(player.x, player.y);
            this.updatePreview();
        } else if (this.movingSecondPoint || !this.movingDone) {
            if (this.secondPointPos?.at(0) === player.x && this.secondPointPos?.at(1) === player.y) return;

            let secondPoint = [player.x, player.y];
            if(this.options.magnetMode){
                secondPoint = doISOSetup(...this.firstPointPos, ...secondPoint)
            }
            this.secondPointPos = secondPoint;
            this.updatePreview();
        }
    }

    

    mouseup(e) {
        camera.enableMove();

        if (this.movingFirstPoint || this.movingSecondPoint) {
            this.movingFirstPoint = false;
            this.movingSecondPoint = false;
        }

        this.movingDone = true;
    }

    addMouseListeners() {
        globals.eventManager.on('mousedown', this.mouseListeners.down);
        globals.eventManager.on('mousemove', this.mouseListeners.move);
        globals.eventManager.on('mouseup', this.mouseListeners.up);
    }

    removeMouseListeners() {
        globals.eventManager.off('mousedown', this.mouseListeners.down);
        globals.eventManager.off('mousemove', this.mouseListeners.move);
        globals.eventManager.off('mouseup', this.mouseListeners.up);
    }

    addFx() {
        if (this.fx) {
            console.warn('adding fx while it\'s ON');
            return;
        }

        const strokeCol = '#a65d49ff';
        const fillCol = 'white';


        this.fx = new FX(ctx => {
            if (!this.firstPointPos || !this.secondPointPos) {
                return FX_STATE.FINISHED;
            }

            //actual gradient drawing
            if (this.previewCanvas) {
                ctx.globalAlpha = 1;
                const screenPos = boardToScreenSpace(this.previewProps.x, this.previewProps.y);
                ctx.drawImage(
                    this.previewCanvas,
                    0, 0, this.previewProps.w, this.previewProps.h,
                    screenPos[0], screenPos[1], this.previewProps.w * camera.zoom, this.previewProps.h * camera.zoom
                );
                ctx.globalAlpha = 1;
            }

            // everything below are just some visuals
            // for the gradient's dot-to-dot position

            // white-ish glow
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            const firstPos = boardToScreenSpace(this.firstPointPos[0] + 0.5, this.firstPointPos[1] + 0.5);
            const secondPos = boardToScreenSpace(this.secondPointPos[0] + 0.5, this.secondPointPos[1] + 0.5);

            ctx.strokeStyle = strokeCol;
            ctx.fillStyle = fillCol;

            ctx.beginPath();
            // dotted line between the points
            ctx.setLineDash([10, 10]);
            ctx.lineWidth = 5;

            ctx.moveTo(...firstPos);
            ctx.lineTo(...secondPos);

            ctx.stroke();
            // removing dots to draw solid cirles
            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.moveTo(firstPos[0] + 10, firstPos[1]);
            ctx.arc(...firstPos, 10, 0, Math.PI * 2);
            ctx.moveTo(secondPos[0] + 10, secondPos[1]);
            ctx.arc(...secondPos, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('1', firstPos[0], firstPos[1]);
            ctx.fillText('2', secondPos[0], secondPos[1]);

            // ctx.restore();
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';


            return FX_STATE.FINISHED;
        });
        addFX(this.fx);
    }
    removeFx() {
        removeFX(this.fx);
        this.fx = null;
    }

    updatePreview() {
        if(!this.firstPointPos || !this.secondPointPos) return;

        const deltaX = -(this.firstPointPos[0] - this.secondPointPos[0]);
        const deltaY = -(this.firstPointPos[1] - this.secondPointPos[1]);

        let maxW, maxH, firstOffX, firstOffY, secondOffX, secondOffY;
        // centering the points to spread the gradient in all directions
        if (this.options.isRadial) {
            maxH = maxW = Math.hypot(deltaX, deltaY) * 2;
            firstOffX = Math.floor(maxW / 2);
            firstOffY = Math.floor(maxH / 2);
        } else {
            maxW = maxH = Math.max(Math.abs(deltaX) * 2, Math.abs(deltaY) * 2, this.options.globalMaxRadius * 2);
            firstOffX = Math.floor((maxW - deltaX) / 2);
            firstOffY = Math.floor((maxH - deltaY) / 2);
        }
        secondOffX = firstOffX + deltaX;
        secondOffY = firstOffY + deltaY;

        this.previewProps.x = this.firstPointPos[0] - firstOffX;
        this.previewProps.y = this.firstPointPos[1] - firstOffY;
        this.previewProps.w = maxW;
        this.previewProps.h = maxH;

        const firstColHex = hexPalette[player.color] ?? '#00000000';
        const secondColHex = hexPalette[player.secondCol] ?? '#00000000';

        const generatedGrad = generateGradient(
            maxW, maxH,
            firstOffX, firstOffY,
            secondOffX, secondOffY,
            firstColHex, secondColHex
        );

        const firstColRgb = allColors[player.color] ?? null;
        const secondColRgb = allColors[player.secondCol] ?? null;

        const ditheredGrad = ditherGradient(
            generatedGrad.getContext('2d'),
            firstColRgb,
            secondColRgb,
            this.options.matrixSize,
            {
                ...this.options,
                p1: [firstOffX, firstOffY],
                p2: [secondOffX, secondOffY],
                originX: this.previewProps.x,
                originY: this.previewProps.y
            }
        );

        // finally, we need to mask this canvas to draw only on the same color
        const boardDump = globals.chunkManager.dumpZone(
            this.previewProps.x,
            this.previewProps.y,
            this.previewProps.w,
            this.previewProps.h
        );

        const dumpCtx = boardDump.getContext('2d');
        selectColor(dumpCtx,
            allColors[this.selectedColor],
            firstOffX, firstOffY,
            this.options.fillMode);

        dumpCtx.globalCompositeOperation = 'source-in';
        dumpCtx.drawImage(ditheredGrad, 0, 0);

        this.previewCanvas = boardDump;
    }

    drawRendered(){
        globals.toolManager.tools.paste.startDraw(this.previewCanvas, this.previewProps.x, this.previewProps.y);
    }
}
const gradient = new Gradient('gradient', 'KeyB', wandIcon);
export default gradient;
