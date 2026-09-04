import { onToolManager, getColByCord, renderFX, checkBounds, getPixel } from "./toolUtils";
import lineIcon from '../../img/toolIcons/line.png';
import camera from '../camera';
import { boardWidth, hexPalette } from '../config';
import { ROLE } from '../constants';
import { addFX, FX, removeFX } from '../fxcanvas';
import globals from '../globals';
import me from '../me';
import player, { placePixel } from '../player';
import Tool from '../Tool';
import { boardToScreenSpace } from '../utils/conversions';
import { getOrDefault } from '../utils/localStorage';
import shapes from '../utils/shapes';


class Line extends Tool {
    constructor(...args) {
        super(...args);

        this.drawLength = JSON.parse(getOrDefault('drawLineLen', false));;

        onToolManager(() => {
            this.handlers();
        });
    }

    handlers() {
        let startCoords, endCoords, lastCoords = [], fx, isDown = false, line, startColor1, startColor2, startCircleSize;

        function down(e) {
            if (isDown) return;
            isDown = true;

            startCoords = [player.x, player.y];

            [startColor1, startColor2] = [player.color, player.secondCol];

            startCircleSize = 1;
            if (player.brushSize !== 1) {
                startCircleSize = globals.renderer.preRendered.brush.circle.length;
            }

            move(e);
        }

        function move(e) {
            if (!isDown || !startCoords) return;
            if (e.gesture) {
                isDown = false;
                return startCoords = null;
            };

            endCoords = [player.x, player.y];

            if (player.color === -1 && player.secondCol === -1) {
                fx && removeFX(fx);
                return;
            }
            if (endCoords[0] != lastCoords[0] || endCoords[1] != lastCoords[1]) {
                lastCoords = endCoords;

                const line = buildLine(...startCoords, ...endCoords);

                fx && removeFX(fx);
                fx = new FX((ctx) => {
                    ctx.globalAlpha = .5;

                    // draw line pixel by pixel
                    line.forEach(([x, y]) => {
                        const color = getColByCord(x, y);
                        ctx.fillStyle = hexPalette[color];

                        let [screenX, screenY] = boardToScreenSpace(x, y);
                        ctx.fillRect(screenX, screenY, camera.zoom, camera.zoom);
                    });

                    // draw (non pixelated) black line over the line
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = camera.zoom / 5;

                    const startScreen = boardToScreenSpace(...line[0]);
                    const endScreen = boardToScreenSpace(...line[line.length - 1]);

                    ctx.beginPath();
                    ctx.lineCap = 'round';
                    ctx.moveTo(...startScreen.map(z => z += camera.zoom / 2));
                    ctx.lineTo(...endScreen.map(z => z += camera.zoom / 2));

                    // draw line length text
                    function angle(cx, cy, ex, ey) {
                        var dy = ey - cy;
                        var dx = ex - cx;
                        var theta = Math.atan2(dy, dx); // range (-PI, PI]
                        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]

                        //if (theta < 0) theta = 360 + theta; // range [0, 360)
                        return theta;
                    }

                    function toRadians(angle) {
                        return angle * (Math.PI / 180);
                    }

                    if (this.drawLength && line.length > 1) {
                        let [startPosX, startPosY] = startScreen;
                        let [endPosX, endPosY] = endScreen;

                        let minX = Math.min(startPosX, endPosX);
                        let minY = Math.min(startPosY, endPosY);
                        let maxX = Math.max(startPosX, endPosX);
                        let maxY = Math.max(startPosY, endPosY);

                        let [midPosX, midPosY] = [maxX - Math.abs(maxX - minX) / 2, maxY - Math.abs(maxY - minY) / 2];

                        // append half-pixel offset to center text in the middle
                        midPosX += camera.zoom * 0.5;
                        midPosY += camera.zoom * 0.5;

                        let lineAngle = angle(startPosX, startPosY, endPosX, endPosY);
                        if (lineAngle > 90) {
                            lineAngle -= 180;
                        } else if (lineAngle < -90) {
                            lineAngle += 180;
                        }

                        let lineRads = toRadians(lineAngle);
                        let offsetX = 40 * Math.sin(lineRads);
                        let offsetY = 40 * Math.cos(lineRads);

                        midPosX += offsetX;
                        midPosY -= offsetY;



                        ctx.save();
                        ctx.globalAlpha = .7;

                        const fontHei = 20; //camera.zoom / 1.5;
                        ctx.font = fontHei + 'px sans-serif';
                        ctx.fillStyle = 'black';
                        ctx.strokeStyle = 'white';

                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.lineWidth = fontHei / 6;

                        const text = line.length;
                        const [x, y] = [midPosX, midPosY];

                        ctx.strokeText(text, x, y);
                        ctx.fillText(text, x, y);

                        ctx.restore();
                    }

                    ctx.stroke();

                    ctx.globalAlpha = 1;

                    return 1;
                });
                addFX(fx);
            }
        }

        function buildLine(x1, y1, x2, y2) {
            let circle = [[0, 0]];
            if (player.brushSize !== 1) {
                circle = globals.renderer.preRendered.brush.circle;
            }

            const w = boardWidth;

            // to not repeat already added pixels
            const placed = new Set();

            const bruhLinePixels = [];
            const linePixels = shapes.line(x1, y1, x2, y2);

            // starting from the end and then
            // reversing brushed array will
            // make pixels rendering looking more brush-like
            for (let i = linePixels.length - 1; i >= 0; i--) {
                const [x, y] = linePixels[i];
                circle.forEach(([offX, offY]) => {
                    const absX = x + offX;
                    const absY = y + offY;

                    const encoded = absX + absY * w;

                    if (placed.has(encoded)) return;
                    placed.add((encoded));

                    bruhLinePixels.push([absX, absY]);
                });
            }

            return bruhLinePixels.reverse();
        }

        function up() {
            this.off('tick', tick);

            if (!isDown || !startCoords) return;
            isDown = false;

            fx && fx.remove();

            if (!endCoords) endCoords = [player.x, player.y];

            line = buildLine(...startCoords, ...endCoords);

            if (line.length > 150 && me.role < ROLE.TRUSTED) {
                return;
            }

            startCoords = null;
            endCoords = null;

            renderFX();
            this.on('tick', tick);
        }

        function tick() {
            if (player.color === -1 && player.secondCol === -1) {
                // assume player cancelled line
                line = null;
            }

            let placed = 0;
            while (true) {
                if (!line || !line.length) {
                    this.off('tick', tick);
                    return;
                }

                const [x, y] = line.pop();
                const col = getColByCord(x, y, startColor1, startColor2);

                if (col === undefined || col === -1) return this.off('tick', tick);
                if (!checkBounds(x, y) || getPixel(x, y) === col) continue;

                if (!player.bucket.spend(1)) return line.push([x, y]);

                placePixel(x, y, col);
                placed++;
                if (placed >= startCircleSize / 2) {
                    return;
                }
            }
        }

        down = down.bind(this);
        move = move.bind(this);
        up = up.bind(this);

        tick = tick.bind(this);

        this.on('down', down);
        // TODO maybe it's too many listeners
        // so it'd be good to make some sort of local signal
        // that there was gesture (this listener is only for e.gesture to reset start coords)
        globals.toolManager.on('move', move);
        this.on('up', up);
    }
}
const line = new Line('line', 'ShiftLeft', lineIcon);
export default line;