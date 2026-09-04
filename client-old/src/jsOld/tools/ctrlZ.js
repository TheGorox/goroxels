// import pipetteIcon from '.../img/toolIcons/pipette.png'
import revertIcon from '../../img/toolIcons/revert.png';
import globals from '../globals';
import player, { placePixel } from '../player';
import Tool from '../Tool';


class CtrlZ extends Tool {
    constructor(...args) {
        super(...args);

        this.handlers();
    }

    handlers() {
        let isDown = false;

        function reset() {
            isDown = false;

            this.off('tick', tick);
            tickTime = tickMax;
            lastTick = 0;
        }
        reset = reset.bind(this);

        const down = function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.gesture) {
                return reset();
            }

            // i know about e.repeat
            if (isDown) return;
            isDown = true;

            tick();
            this.on('tick', tick);
        }.bind(this);

        const move = function (e) {
            if (e.gesture) {
                reset();
            }
        }.bind(this);

        const up = function () {
            reset();
        }.bind(this);

        const tickMax = 500;
        const tickMin = 50;

        const nocdMinTick = 2;
        // ticknow = ticknow - (ts / nocdStepFactor)
        // i.e ms passed since last tick divided by this factor
        const nocdStepFactor = 100;

        const step = 1.5;
        let tickTime = tickMax;

        let lastTick = 0;
        const tick = function () {
            const ts = Date.now() - lastTick;
            if (ts < tickTime) return;
            let multiTicks = ts / tickTime | 0;
            // when lastTick is 0 (tool is just activated)
            if (multiTicks < 0) multiTicks = 1;

            lastTick = Date.now();

            do {
                // if (tickTime <= tickMin) {
                //     if(player.bucket.delay < tickMin){
                //         tickTime = Math.max(nocdMinTick, tickTime-(ts/nocdStepFactor))
                //     }
                // }else{
                //     tickTime /= step;
                // }
                // instead of speeding up we'll do it only if alt pressed
                const altFactor = globals.toolManager.altDown ? 0.2 : 1;
                tickTime = Math.max(tickTime / step, tickMin * altFactor);

                if (player.placed.length > player.maxPlaced) {
                    player.placed = player.placed.slice(-player.maxPlaced);
                }
                if (!player.placed.length) return;
                if (!player.bucket.spend(1)) return;

                const [x, y, c] = player.placed.pop();

                placePixel(x, y, c, false, true);
            }
            while (--multiTicks);
        }.bind(this);

        this.on('down', down);
        globals.eventManager.on('mousemove', move);
        this.on('up', up);
    }
}
const ctrlZ = new CtrlZ('ctrlZ', 'KeyZ', revertIcon);
export default ctrlZ;