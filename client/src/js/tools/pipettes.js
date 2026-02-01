import { mobile, getPixel, renderFX } from "./toolUtils";
import player from '../player';
import Tool from '../Tool';


export class Pipette extends Tool {
    constructor(...args) {
        super(...args);

        if (mobile) {
            return;
            this.on('down', this.mobileDown.bind(this));
            this.on('up', this.mobileUp.bind(this));
        }
        else
            this.on('down', this.down);
    }

    down(e) {
        const color = getPixel(player.x, player.y);

        if (color === -1) return;

        if (e.__alt)
            player.switchSecondColor(color);

        else
            player.switchColor(color);

        renderFX();
    }

    // separate handlers for handling both
    // primary and seconary colors on mobiles
    // DISABLED FOR THE MOMENT
    // is pipette really need in game
    // with restricted palette .. ?
    mobileDown() {
        this.downCord = [player.x, player.y];
        this.downTime = Date.now();
    }

    mobileUp() {
        let lastCord = [player.x, player.y];
        let lastTime = Date.now();

        this.downCord = null;
        this.downTime = null;
    }
}
export const pipette = new Pipette('pipette', 'KeyC');
export const altPipette = new Pipette('alt pipette', 'ALT+KeyC');
altPipette.off('down', altPipette.down);
altPipette.on('down', (e) => {
    e.__alt = true;
    altPipette.down.call(altPipette, e);
});

