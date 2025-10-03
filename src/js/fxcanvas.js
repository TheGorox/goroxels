import globals from './globals';

const NOT_FINISHED = 0,
    FINISHED = 1,
    DELETED = 2;

export class FX {
    constructor(renderFunc) {
        this.renderFunc = renderFunc;

        this.removed = false;
    }

    render(ctx) {
        return this.renderFunc(ctx);
    }

    remove() {
        this.removed = true;
    }
}

export class FXRenderer {
    constructor() {
        // three layers
        this.fxList = [[], [], []];
        this.ctx = globals.fxCtx;

        this.needRender = true;
        this.needClear = false;
    }

    add(fx, layer = 0) {
        this.fxList[layer].push(fx);

        this.needRender = true;
    }

    /*
      You can request it by returning zero in rendering
      functions or explicitly ↓
    */
    requestRender() {
        this.needRender = true;
    }

    render() {
        if (!this.needRender) return;

        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        this.needRender = false;

        for (let layer = 0; layer < this.fxList.length; layer++) {
            this.fxList[layer].forEach(fx => {
                try {
                    if (fx.removed) return this.remove(fx);

                    let r = fx.render(this.ctx);

                    /*
                        0 - not finished yet
                        1 - finished but continue rendering
                        2 - finished
                    */

                    if (r == 2) {
                        this.remove(fx);
                    } else if (r == 0) {
                        this.needRender = true;
                    }
                } catch (error) {
                    console.error(error);
                }

            })
        }
    }

    remove(fx) {
        for (let layer = 0; layer < this.fxList.length; layer++) {
            let idx = this.fxList[layer].indexOf(fx);
            if (idx != -1) {
                this.fxList[layer][idx].remove();
                this.fxList[layer].splice(idx, 1);
                this.needRender = true;
                break
            }
        }

    }
}

// fxRenderer is loaded later then tools/template
// so here is the workaround
let _deferredFX = [];
export function addFX(fx, layer) {
    if (globals.fxRenderer) {
        globals.fxRenderer.add(fx, layer);
    } else _deferredFX.push([fx, layer]);
}

export function removeFX(fx) {
    globals.fxRenderer.remove(fx);
}
let fxi = setInterval(() => {
    if (globals.fxRenderer) {
        clearInterval(fxi);
        for (let [fx, layer] of _deferredFX) {
            addFX(fx, layer);
        }
        _deferredFX = [];
    }
}, 5);