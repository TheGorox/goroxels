import { onToolManager, mobile, renderFX, getColByCord, getPixel, getProtect, getCurCol } from "./toolUtils";
import clickerIcon from '../../img/toolIcons/clicker.png';
import camera from '../camera';
import { hexPalette } from '../config';
import { ROLE } from '../constants';
import { addFX, FX } from '../fxcanvas';
import globals from '../globals';
import me from '../me';
import player, { placePixel, placePixels } from '../player';
import Tool from '../Tool';
import { boardToScreenSpace, screenToBoardSpace } from '../utils/conversions';
import shapes from '../utils/shapes';


export class Clicker extends Tool {
    constructor(...args) {
        super(...args);

        this._pendingPixels = {};

        this.minZoom = 2;

        this.on('down', this.down);
        this.on('up', this.up);
        this.on('move', this.move);
        this.on('leave', this.up);
        this.on('_gesture', this.ongesture);

        onToolManager(() => {
            // mobile is already subscribed to pointer events
            // so this will duplicate them
            if (!mobile) {
                globals.eventManager.on('mousedown', this.mousedown.bind(this));
                globals.toolManager.on('move', this.move.bind(this));
                globals.eventManager.on('mouseup', this.mouseup.bind(this));
            }
        });

        this.clrInterval = setInterval(() => {
            if (this.clearPending())
                renderFX();
        }, 250);

        // pending pixels debug visualizer
        this.fx = new FX(this.render.bind(this));
        // addFX(this.fx);
    }

    // mouse zone
    mousedown(e) {
        if (e.button !== 0) return;
        this.screenPos = [e.clientX, e.clientY];
    }
    mouseup(e) {
        if (globals.toolManager.tools['mover'].key !== 'LMB' || camera.zoom <= 1) return;

        if (e.button !== 0 || !this.screenPos) return;
        const dx = Math.abs(e.clientX - this.screenPos[0]);
        const dy = Math.abs(e.clientY - this.screenPos[1]);
        if (dx > 5 || dy > 5) return;

        const [x, y] = [player.x, player.y];
        const color = getColByCord(x, y);
        if (this.checkPixel(x, y) && ~color)
            placePixel(player.x, player.y, getColByCord(x, y));
    }
    // end of mouse zone
    down(e) {
        if (this.mouseIsDown || camera.zoom < this.minZoom) return;

        this.lastPos = [player.x, player.y];
        this.screenPos = [e.clientX, e.clientY];



        this.mouseIsDown = true;

        if (!mobile)
            this.emit('move', {});
        else {
            this.pointerId = e.pointerId;
        }
    }
    up(e) {
        if (this.mouseIsDown) {
            if (mobile)
                this.emit('move', e, true);
            this.mouseIsDown = false;
        }
    }

    ongesture() {
        this.mouseIsDown = false;
        this.lastPos = null;
    }

    checkPixel(x, y) {
        const key = `${x},${y}`;
        const myColor = getColByCord(x, y);

        const pixel = getPixel(x, y), isProtected = getProtect(x, y);
        if (pixel === myColor || pixel === -1 || (isProtected && me.role < ROLE.TRUSTED)) return;

        if (this._pendingPixels[key] && this._pendingPixels[key][0] === myColor) return;
        this._pendingPixels[key] = [myColor, Date.now()];

        return true;
    }

    /*
    */
    move(e, isUp = false) {
        if (e.gesture) {
            // if gesture is started, we reset mousedown state
            this.ongesture();
            return;
        }
        if (!this.mouseIsDown ||
            e.gesture ||
            getCurCol() === -1) return;

        // mobile and same pointerid as at down but also not initiated by 'up' event
        if (mobile && this.pointerId !== e.pointerId)
            return;

        const screenX = e.clientX, screenY = e.clientY;

        const dx = Math.abs(screenX - this.screenPos[0]);
        const dy = Math.abs(screenY - this.screenPos[1]);

        if (dx < 5 && dy < 5 && !isUp) {
            return;
        }

        // workaround for the bug when drawing line is torn apart
        const mover = globals.toolManager.tools.mover;
        let x, y;
        if (mover.antijitterDownPos) {
            [x, y] = mover.antijitterDownPos;
        } else if (e.clientX && e.clientY) {
            [x, y] = screenToBoardSpace(e.clientX, e.clientY);
        } else {
            [x, y] = [player.x, player.y];
        }
        
        
        let line = shapes.line(x, y, this.lastPos[0], this.lastPos[1]);
        this.lastPos = [x, y];
        
        let circle = [[0, 0]];
        if (player.brushSize !== 1) {
            circle = globals.renderer.preRendered.brush.circle;
        }

        let c = 0;
        for (let [x, y] of line) {
            let pixels = [];

            if (!this.checkAllowance(circle.length)) return;
            circle.forEach(([cx, cy]) => {
                let _x = x + cx;
                let _y = y + cy;
                if (this.checkPixel(_x, _y)) {
                    const myColor = getColByCord(_x, _y); // duplicate
                    pixels.push([_x, _y, myColor]);
                }
                c++;
            });

            this.place(pixels);
        }
    }

    checkAllowance(count) {
        return player.bucket.allowance >= count;
    }

    place(pixels) {
        if (pixels.length === 0) return;

        player.bucket.spend(pixels.length);

        if (pixels.length == 1) {
            placePixel(...pixels[0]);
        }
        else
            placePixels(pixels);
    }

    render(ctx) {
        const zoom = camera.zoom;
        ctx.lineWidth = zoom / 5;
        ctx.globalAlpha = .5;

        for (let key of Object.keys(this._pendingPixels)) {
            let [x, y] = key.split(',').map(x => parseInt(x, 10));

            const color = this._pendingPixels[key][0];
            ctx.strokeStyle = '#000000';
            ctx.fillStyle = hexPalette[color];

            const [scrX, scrY] = boardToScreenSpace(x, y);


            ctx.strokeRect(scrX, scrY, zoom, zoom);
        }

        ctx.globalAlpha = 1;

        return 1;
    }

    clearPending() {
        let deletedSome = false;
        Object.keys(this._pendingPixels).forEach(key => {
            let timestamp = this._pendingPixels[key][1];

            if (Date.now() - timestamp > 500) {
                delete this._pendingPixels[key];
                deletedSome = true;
            }
        });

        return deletedSome;
    }
}
const clicker = new Clicker('clicker', 'Space', clickerIcon);
export default clicker;