import { mobile, onToolManager, getCurCol, renderFX } from "./toolUtils";
import pixelInfo from './pixelInfo';
import moveIcon from '../../img/toolIcons/move.png';
import camera from '../camera';
import { hexPalette } from '../config';
import { addFX, FX } from '../fxcanvas';
import globals from '../globals';
import player from '../player';
import Tool from '../Tool';
import { changeSelector } from '../ui/elements';
import { boardToScreenSpace, screenToBoardSpace } from '../utils/conversions';


class Mover extends Tool {
    constructor(...args) {
        super(...args);

        this.handlers();

        this.downPos = [0, 0];

        // time when "down" was called
        this.downTime = 0;

        this.lastPos = [0, 0];
        this.lastPlayerPos = [0, 0];
        this.antijitterDownPos = [0, 0];

        if (!mobile) {
            this.fx = new FX(this.renderCursor);

            addFX(this.fx, 2);
        }
    }

    handlers() {
        // костыль
        onToolManager(() => {
            this.on('down', this.down);
            this.on('up', this.up);
            // bind to toolManager for handling not only on canvas
            globals.toolManager.on('move', this.move.bind(this));
            this.on('leave', this.up);
        });
    }

    renderCursor(ctx) {
        const zoom = camera.zoom;

        const color = getCurCol();

        if (~color && zoom > 1) {
            if (player.brushSize == 1) {
                let [x, y] = boardToScreenSpace(player.x, player.y);
                ctx.strokeStyle = hexPalette[color];
                //ctx.fillStyle = hexPalette[player.color];
                ctx.lineWidth = zoom / 5;

                let w, h;
                let halfLineWid = ctx.lineWidth / 2;

                x += halfLineWid;
                y += halfLineWid;

                w = zoom - ctx.lineWidth;
                h = w;

                //ctx.fillRect(x, y, zoom, zoom);
                ctx.strokeRect(x, y, w + 1, h + 1);

                //renderFX();
            } else {
                let offX = 0.5, offY = 0.5;
                if (player.brushSize % 2 === 0) {
                    offX = 1;
                    offY = 1;
                }
                const center = player.brushSize / 2;
                const [x, y] = boardToScreenSpace(player.x - center + offX, player.y - center + offY);
                ctx.drawImage(globals.renderer.preRendered.brush.canvas, x, y);
            }
        }

        return 1;
    }

    down(e) {
        if (e.ctrlKey) return;

        this.mousedown = true;

        // little workaround to keep any ui text
        // unselected while canvas moves
        // guess it's inefficient
        changeSelector('#ui>div>*', { 'pointer-events': 'none' });

        this.downPos = this.lastPos = [e.clientX, e.clientY];
        this.antijitterDownPos = screenToBoardSpace(e.clientX, e.clientY);

        this.downTime = Date.now();
    }
    up(e) {
        if (e.ctrlKey) return;

        this.mousedown = false;
        changeSelector('#ui>div>*', { 'pointer-events': 'all' });
        this.antijitterDownPos = null;

        // long tap to get pixel info
        if (mobile && this.moveThreshold() && !e.gesture) {
            const ela = Date.now() - this.downTime;
            if (ela < 1000) return;

            pixelInfo.emit('up');
        }
    }

    move(e) {
        // for template mover
        if (e.ctrlKey) return;

        if (this.lastPlayerPos[0] != player.x ||
            this.lastPlayerPos[1] != player.y ||
            this.mousedown) {
            renderFX();
        }

        
        this.lastPlayerPos = [player.x, player.y];
        
        if (!this.mousedown) return;

        this.lastPos = [e.clientX, e.clientY];
        if (!mobile) {

            if (this.moveThreshold())
                return;
        }

        // now works without pixel ratio, i'll keep it here if not
        camera.moveBy(-e.movementX / camera.zoom /* / devicePixelRatio */, -e.movementY / camera.zoom /* / devicePixelRatio */);
    }

    moveThreshold() {
        return (Math.abs(this.downPos[0] - this.lastPos[0]) < 5 &&
            Math.abs(this.downPos[1] - this.lastPos[1]) < 5);
    }
}
const mover = new Mover('mover', 'LMB', moveIcon);
export default mover;