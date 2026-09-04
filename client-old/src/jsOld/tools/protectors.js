import { mobile, getProtect } from "./toolUtils";
import protectIcon from '../../img/toolIcons/protect.png';
import { Clicker } from "./clicker";
import { showProtected } from '../config';
import { ROLE } from '../constants';
import globals from '../globals';


export class Protector extends Clicker {
    constructor(...args) {
        super(...args);

        this.minZoom = 1;

        // is this unprotector
        this._alt = false;
        // first touch determines whether protect or not (for full down-move-up):
        // protected => unprotect; unprotected => protect,
        // i.e. inverts pixel state
        this._mobileIsProtect = null;
    }

    getProtectState() {
        if (mobile)
            return this._mobileIsProtect;

        else
            return this._alt ? false : true;

    }

    // override Clicker's mouse events
    mousedown() { }
    mouseup() { }

    down(e) {
        if (this.mouseIsDown) return;

        super.down(e);

        showProtected(); // force protect visibility
        this._mobileIsProtect = !getProtect(...this.lastPos);
    }

    checkPixel(x, y) {
        const key = `${x},${y}`;
        const state = this.getProtectState();

        const curState = getProtect(x, y);
        if (curState === state) return;

        if (this._pendingPixels[key] && this._pendingPixels[key][0] === state) return;
        this._pendingPixels[key] = [state, Date.now()];

        return true;
    }

    checkAllowance() { return true; }

    place(pixels) {
        // now we should replace colors from
        // clicker's move func with protect state
        const state = this.getProtectState();
        pixels.forEach(p => p[2] = state);
        if (!pixels.length) return;

        globals.socket.sendPixels(pixels, true);
    }

    render() { }
}

export const protector = new Protector('protector', 'KeyV', protectIcon, ROLE.MOD);
export const altProtector = new Protector('alt protector', 'ALT+KeyV', null, ROLE.MOD);
altProtector._alt = true;

