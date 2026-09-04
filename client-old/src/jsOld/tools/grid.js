import camera from '../camera';
import { chunkSize } from '../config';
import { addFX, FX, removeFX } from '../fxcanvas';
import Tool from '../Tool';
import { boardToScreenSpace, screenToBoardSpace } from '../utils/conversions';
import { getOrDefault, setLS } from '../utils/localStorage';
import { mapRange } from '../utils/math';


class Grid extends Tool {
    constructor(...args) {
        super(...args);

        this.state = 0;
        this.fx = null;

        this.pattern = null;

        camera.on('zoom', () => {
            if (this.state == 1) {
                this.tryRender();
            }
        });

        this.on('down', this.pressed.bind(this));
        if (JSON.parse(getOrDefault('enableGrid', false))) {
            this.show();
        }
    }

    pressed(e) {
        if (e.repeat) return;
        this.toggle();
    }

    /**@param {CanvasRenderingContext2D} ctx*/
    drawGrid(ctx) {
        let [x, y] = screenToBoardSpace(0, 0), [clientX, clientY] = boardToScreenSpace(x, y);

        let { width, height } = ctx.canvas;
        const zoom = camera.zoom;


        ctx.fillStyle = 'rgb(127,127,127)';

        // make grid fade out from zoom 16 to 5 (lower than 5 is invisible)
        const calculatedAlpha = zoom > 16 ? 0.5 : mapRange(zoom, 24, 5, 0.5, 0);
        ctx.globalAlpha = calculatedAlpha;

        let thickInterval;
        if (chunkSize % 16 == 0) thickInterval = 16;
        else if (chunkSize % 10 == 0) thickInterval = 10;
        else thickInterval = null;

        // finally, i decided to disable this feature
        thickInterval = null;

        let wid = 1;

        // kostyl
        x--; y--;

        // pixels lines
        for (; clientX < width; clientX += zoom) {
            x++;
            if (x % thickInterval == 0) wid = 1;
            else wid = 1;

            if (x % chunkSize == 0) wid = 1;

            ctx.fillRect(clientX | 0, 0, wid, height);
        }

        for (; clientY < height; clientY += zoom) {
            y++;
            if (y % thickInterval == 0) wid = 1;
            else wid = 1;

            if (y % chunkSize == 0) wid = 1;

            ctx.fillRect(0, clientY | 0, width, wid);
        }

        ctx.globalAlpha = 1;
    }

    tryRender() {
        if (!this.fx || this.fx.removed) {
            this.fx = new FX(this.render.bind(this));
            addFX(this.fx, 2);
        }
    }

    toggle() {
        if (this.state == 0) this.show();
        else this.hide();
        setLS('enableGrid', (!!this.state).toString());
    }

    show() {
        this.state = 1;
        this.tryRender();
    }

    hide() {
        this.state = 0;
        this.fx && removeFX(this.fx);
    }

    render(ctx) {
        if (camera.zoom <= 5) return 1;

        this.drawGrid(ctx);
    }
}
const grid = new Grid('grid', 'KeyG');
export default grid;