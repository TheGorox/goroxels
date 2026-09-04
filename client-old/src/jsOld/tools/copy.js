import camera from '../camera';
import { boardHeight, boardWidth, allColors } from '../config';
import { ROLE } from '../constants';
import { addFX, FX, removeFX } from '../fxcanvas';
import globals from '../globals';
import { paste } from "./paste";
import player from '../player';
import Tool from '../Tool';
import { mainCanvas } from '../ui/elements';
import { boardToScreenSpace } from '../utils/conversions';
import { testPointInPolygon } from '../utils/misc';


class Copy extends Tool {
    constructor(...args) {
        super(...args);

        // 0 - idle
        // 1 - started selection
        this.state = 0;

        this.selectFX = null;

        this.initListeners();
    }

    initListeners() {
        this.on('down', this.down.bind(this));
    }

    down(e) {
        if (this.state > 0 || paste.state > 0)
            return;

        // since default key is ctrl+c
        const isTextSelected = (window.getSelection().type === 'Range');
        if (isTextSelected) return;

        e.preventDefault();
        e.stopPropagation();

        camera.disableMove();
        player.suspendColors();
        mainCanvas.css('cursor', 'crosshair');

        this.state = 1;

        let fx;
        let startX, startY, endX, endY;

        let altPressed = false, lassoMode = false, lassoPoints = [];
        function keydown(e) {
            if (e.key === 'Alt')
                altPressed = true;
        }
        // function keyup(e) {
        //     // tf is this ... ???
        //     if (e.key === 'Alt')
        //         altPressed = false;
        // }
        function mousedown() {
            if (altPressed) {
                lassoMode = true;
                lassoPoints = [[player.x, player.y]];
            } else {
                startX = player.x;
                startY = player.y;
            }
        }
        function mousemove() {
            if (lassoMode) {
                let x = player.x, y = player.y;

                lassoPoints.push([x, y]);
            } else {
                endX = player.x + 1;
                endY = player.y + 1;
            }
        }
        function mouseup() {
            // area is selected and we can tell Paste tool to draw it
            mainCanvas.css('cursor', '');

            removeFX(fx);

            globals.eventManager.off('keydown', keydown);
            // globals.eventManager.off('keyup', keyup);
            globals.eventManager.off('mousedown', mousedown);
            globals.eventManager.off('mousemove', mousemove);
            globals.eventManager.off('mouseup', mouseup);

            this.state = 0;

            camera.enableMove();
            player.restoreColors();

            onSelected();
        }

        function render(ctx) {
            ctx.save();

            ctx.strokeStyle = 'gray';
            ctx.lineWidth = 2;
            ctx.setLineDash([3, 3]);
            ctx.globalAlpha = 1;

            if (lassoMode) {
                ctx.beginPath();
                const firstCord = boardToScreenSpace(lassoPoints[0][0], lassoPoints[0][1]);
                ctx.moveTo(...firstCord);
                for (let i = 1; i < lassoPoints.length; i++) {
                    const point = lassoPoints[i];
                    ctx.lineTo(...boardToScreenSpace(...point));
                }
                ctx.closePath();
                ctx.stroke();
            } else {
                const [x1, y1] = boardToScreenSpace(startX, startY);
                const [x2, y2] = boardToScreenSpace(endX, endY);
                ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
            }

            ctx.restore();
            return 1;
        }
        fx = new FX(render);
        addFX(fx);

        keydown = keydown.bind(this);
        // keyup = keyup.bind(this);
        mousedown = mousedown.bind(this);
        mousemove = mousemove.bind(this);
        mouseup = mouseup.bind(this);

        globals.eventManager.on('keydown', keydown);
        // globals.eventManager.on('keyup', keyup);
        globals.eventManager.on('mousedown', mousedown);
        globals.eventManager.on('mousemove', mousemove);
        globals.eventManager.on('mouseup', mouseup);


        function onSelected() {
            let minX, maxX, minY, maxY;
            if (lassoMode) {
                minX = maxX = lassoPoints[0][0];
                minY = maxY = lassoPoints[0][1];
                for (let i = 0; i < lassoPoints.length; i++) {
                    const point = lassoPoints[i];
                    if (point[0] < minX)
                        minX = point[0];
                    if (point[0] > maxX)
                        maxX = point[0];
                    if (point[1] < minY)
                        minY = point[1];
                    if (point[1] > maxY)
                        maxY = point[1];
                }
            } else {
                if ([startX, startY, endX, endY].some(x => x === undefined))
                    return;

                minX = Math.min(startX, endX);
                maxX = Math.max(startX, endX) + 1;
                minY = Math.min(startY, endY);
                maxY = Math.max(startY, endY) + 1;
            }

            // normalize coordinates
            minX = Math.max(minX, 0);
            maxX = Math.min(maxX, boardWidth);
            minY = Math.max(minY, 0);
            maxY = Math.min(maxY, boardHeight);

            const w = maxX - minX;
            const h = maxY - minY;

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;

            const ctx = canvas.getContext('2d');
            const data = ctx.createImageData(w, h);
            const protectMask = new Uint8Array(w * h);

            // poly x coordinates and y coordinates arrays
            let vertx, verty;
            if (lassoMode) {
                vertx = new Array(lassoPoints.length);
                verty = new Array(lassoPoints.length);

                for (let i = 0; i < lassoPoints.length; i++) {
                    const point = lassoPoints[i];
                    vertx[i] = point[0];
                    verty[i] = point[1];
                }
            }

            // local canvas coordinates
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    const i = (x + y * w) * 4;

                    // absolute board coordinates
                    const absX = minX + x;
                    const absY = minY + y;

                    if (lassoMode && !testPointInPolygon(lassoPoints.length, vertx, verty, absX, absY)) {
                        continue;
                    }


                    const isProtected = globals.chunkManager.getProtect(absX, absY);
                    protectMask[i / 4] = isProtected;

                    const colId = globals.chunkManager.getChunkPixel(absX, absY);
                    const col = allColors[colId];

                    data.data[i] = col[0];
                    data.data[i + 1] = col[1];
                    data.data[i + 2] = col[2];
                    data.data[i + 3] = 255;
                }
            }

            ctx.putImageData(data, 0, 0);

            // let the Paste tool do other stuff
            paste.startPlace(canvas, protectMask);
        }
    }
}
const copy = new Copy('copy', 'CTRL+KeyC', null, ROLE.MOD);

export default copy;