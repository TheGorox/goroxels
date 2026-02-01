import { renderFX, getColByCord, getPixel, getCurCol } from "./toolUtils";
import floodfillIcon from '../../img/toolIcons/floodfill.png';
import camera from '../camera';
import { hexPalette } from '../config';
import { addFX, FX } from '../fxcanvas';
import globals from '../globals';
import player, { placePixel } from '../player';
import Tool from '../Tool';
import { inBounds } from '../utils/camera';
import { boardToScreenSpace, screenToBoardSpace } from '../utils/conversions';


class FloodFill extends Tool {
    constructor(...args) {
        super(...args);

        this.on('up', this.up);
        this.on('down', this.down);
        this.on('leave', this.up);

        this.on('tick', this.tick);

        this.previewing = false;
        this.fx = null;
        this.prevStack = [];
    }

    up(e, isCancel) {
        if (this.active) { // stop and return
            this.active = false;
            return;
        }

        if (this.previewing) {
            this.fx.remove();
            renderFX();
            this.previewing = false;
        } else return; // means that key wasn't pressed


        if (isCancel)
            return;

        const cord = screenToBoardSpace(e.clientX, e.clientY);
        if (getColByCord(...cord) === -1 || !inBounds(...cord) || e.type === 'mouseleave') {
            return;
        }

        this.active = true;

        this.stack = [
            [player.x, player.y]
        ];

        this.playerCol = player.color;
        this.secondPlayerCol = player.secondCol;
        this.fillingCol = getPixel(player.x, player.y);
    }

    down(e) {
        // preview floodfill
        if (e.repeat || this.previewing || this.active) {
            return;
        }

        const cord = screenToBoardSpace(e.clientX, e.clientY);
        if (getColByCord(...cord) === -1 || !inBounds(...cord)) {
            return;
        }
        let _lastX, _lastY;

        restart.apply(this);

        this.showedPixels = [];
        this.fillingCol = getPixel(player.x, player.y);

        let fx = new FX(tick.bind(this));
        addFX(fx, 0);

        this.fx = fx;

        //globals.renderer.needRender = true;
        this.previewing = true;

        function restart() {
            this.prevStack = [
                [player.x, player.y]
            ];
            this.showedPixels = [];

            _lastX = player.x;
            _lastY = player.y;

            this.playerCol = player.color;
            this.secondPlayerCol = player.secondCol;
            this.fillingCol = getPixel(player.x, player.y);
        }

        function paint() {
            if (!this.prevStack.length) return 1;

            let [x, y] = this.prevStack.pop();

            let color = getColByCord(x, y, this.playerCol, this.secondPlayerCol);
            let tileCol = getPixel(x, y);
            let painted = this.showedPixels.indexOf(x + ',' + y) !== -1;

            if (painted || tileCol === color || tileCol !== this.fillingCol || !inBounds(x, y)) {
                return 0;
            }

            this.showedPixels.push(x + ',' + y);

            let top = this.checkP(x, y - 1);
            let bottom = this.checkP(x, y + 1);
            let left = this.checkP(x - 1, y);
            let right = this.checkP(x + 1, y);
            if (top && left) {
                this.checkP(x - 1, y - 1);
            }
            if (top && right) {
                this.checkP(x + 1, y - 1);
            }
            if (bottom && left) {
                this.checkP(x - 1, y + 1);
            }
            if (bottom && right) {
                this.checkP(x + 1, y + 1);
            }

            return 0;
        }

        function tick(ctx) {
            if (globals.mobile && globals.toolManager.tool !== this) {
                this.up({}, true);
                return 1;
            }
            if (player.x != _lastX || player.y != _lastY) {
                restart.call(this);
            }
            if (getCurCol() === -1) return 1;

            let res = 0;
            for (let i = 0; i < 700 && res == 0; i++)
                res = paint.call(this);


            ctx.strokeWidth = camera.zoom;

            this.showedPixels.forEach((p, i) => {
                let [x, y] = p.split(',').map(x => parseInt(x, 10));

                let alpha = 1;
                let len = this.showedPixels.length;
                if (len >= 100 && i < len / 2) {
                    alpha = 1 - (((len / 2) - i) / (len / 2));
                    if (alpha <= 0) return;
                }
                ctx.globalAlpha = alpha;

                const color = getColByCord(x, y, this.playerCol, this.secondPlayerCol);
                ctx.strokeStyle = hexPalette[color];

                let [absX, absY] = boardToScreenSpace(x, y);
                ctx.strokeRect(absX, absY, camera.zoom, camera.zoom);
            });

            return res;
        }
    }

    checkP(x, y) {
        if (getPixel(x, y) !== this.fillingCol) return false;
        this.prevStack.unshift([x, y]);
        return true;
    }

    tick() {
        if (!this.active) return;

        for (let i = 0; i < 15 && this.stack.length; i++) {
            let nextX = this.stack[this.stack.length - 1][0];

            if (!player.bucket.spend(1)) break;

            let [x, y] = this.stack.pop();

            let color = getColByCord(x, y, this.playerCol, this.secondPlayerCol);
            let tileCol = getPixel(x, y);

            if (tileCol === color || tileCol !== this.fillingCol || !inBounds(x, y)) {
                continue;
            }

            //this.stack.push([x, y]);
            let top = this.check(x, y - 1);
            let bottom = this.check(x, y + 1);
            let left = this.check(x - 1, y);
            let right = this.check(x + 1, y);
            if (top && left) {
                this.check(x - 1, y - 1);
            }
            if (top && right) {
                this.check(x + 1, y - 1);
            }
            if (bottom && left) {
                this.check(x - 1, y + 1);
            }
            if (bottom && right) {
                this.check(x + 1, y + 1);
            }

            placePixel(x, y, color);
        }

        if (!this.stack.length) return this.active = false;
    }

    check(x, y) {
        if (getPixel(x, y) !== this.fillingCol) return false;
        this.stack.unshift([x, y]);
        return true;
    }
}
const floodfill = new FloodFill('floodfill', 'KeyF', floodfillIcon);
export default floodfill;