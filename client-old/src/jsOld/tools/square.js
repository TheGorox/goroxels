import { getColByCord, renderFX, checkBounds, getPixel } from "./toolUtils";
import camera from '../camera';
import { hexPalette } from '../config';
import { addFX, FX, removeFX } from '../fxcanvas';
import player, { placePixel, placePixels } from '../player';
import Tool from '../Tool';
import { boardToScreenSpace } from '../utils/conversions';
import shapes from '../utils/shapes';


class Square extends Tool {
    constructor(...args) {
        super(...args);

        this.handlers();
    }

    handlers() {
        let startCoords, endCoords, lastCoords = [], fx, isDown = false, square, color, color2;

        function down() {
            if (isDown) return;
            isDown = true;

            startCoords = [player.x, player.y];

            [color, color2] = [player.color, player.secondCol];

            this.emit('move');
        }

        function move() {
            if (!isDown || !startCoords) return;

            endCoords = [player.x, player.y];

            if (endCoords[0] != lastCoords[0] || endCoords[1] != lastCoords[1]) {
                lastCoords = endCoords;

                let minX = Math.min(startCoords[0], lastCoords[0]);
                let minY = Math.min(startCoords[1], lastCoords[1]);
                let maxX = Math.max(startCoords[0], lastCoords[0]);
                let maxY = Math.max(startCoords[1], lastCoords[1]);

                
                fx && removeFX(fx);
                fx = new FX((ctx) => {
                    ctx.globalAlpha = .5;
                    
                    if (player.color !== -1 && player.secondCol !== -1) {
                        const pixels = shapes.square(minX, minY, maxX, maxY);
                        // slow render for duo colors
                        for (let [x, y] of pixels) {
                            const [sx, sy] = boardToScreenSpace(x, y);
                            const color = getColByCord(x, y);
                            ctx.fillStyle = hexPalette[color];
                            ctx.fillRect(sx, sy, camera.zoom, camera.zoom);
                        }
                    }else{
                        // simplest way to get one of the colors lol
                        const color = getColByCord(0, 0);
                        ctx.fillStyle = hexPalette[color];

                        let [startX, startY] = boardToScreenSpace(minX, minY);
                        let [endX, endY] = boardToScreenSpace(maxX+1, maxY+1);


                        

                        ctx.fillRect(startX, startY, endX-startX, endY-startY);
                    }

                    ctx.globalAlpha = 1;

                    return 1;
                });
                addFX(fx);
            }
        }

        function up() {
            this.off('tick', tick);
            isDown = false;

            if (!startCoords) return;

            fx && fx.remove();

            if (!endCoords) endCoords = [player.x, player.y];

            square = shapes.square(...startCoords, ...endCoords);

            renderFX();

            if (square.length <= 1) return;
            this.on('tick', tick);
        }

        function tick() {
            let infCd = (player.bucket.allowance === Infinity);

            if (!this.lastTick) this.lastTick = Date.now();

            if (infCd && Date.now() - this.lastTick < 50) return;
            this.lastTick = Date.now();

            // ограничитель для 0кд
            let counter = 0;
            let toSend = [];
            while (counter < 1000) {
                if (!square || !square.length) {
                    this.off('tick', tick);
                    break;
                }

                const [x, y] = square.pop();
                const col = getColByCord(x, y, color, color2);

                if (col === undefined || col === -1) return this.off('tick', tick);
                if (!checkBounds(x, y)) continue;
                if (getPixel(x, y) === col) continue;
                if (!player.bucket.spend(1)) return square.push([x, y]);

                counter++;

                if (infCd) {
                    toSend.push([x, y, col]);
                } else {
                    placePixel(x, y, col);
                }
            }

            if (toSend.length) {
                placePixels(toSend, true);
            }
        }

        down = down.bind(this);
        move = move.bind(this);
        up = up.bind(this);

        tick = tick.bind(this);

        this.on('down', down);
        this.on('move', move);
        this.on('up', up);
    }
}
const square = new Square('square', 'KeyJ');
export default square;