export const FX_STATE = {
	IN_PROCESS: 0, // force rendering next frame
	FINISHED: 1,   // passive render (draw on next canvas clear)
	REMOVED: 2     // don't render and delete
}

const MAX_LAYER = 4;

export class OverlayRenderer {
    #ctx;
    #overlayCanvas;
    #core;
    #rafId = null;
    #isRunning = false;
    #layers = Array.from({ length: MAX_LAYER+1 }, () => []);
    #needRender = true;

    constructor(overlayCanvas, core) {
        this.#overlayCanvas = overlayCanvas;
        this.#core = core;
        this.#ctx = overlayCanvas.getContext('2d', {
            alpha: true,
            desynchronized: true
        });

        this.#setupCameraWatch();
    }

    #setupCameraWatch() {
        $effect(() => {
            this.#core.camera.x;
            this.#core.camera.y;
            this.#core.camera.currentZoom;
            this.#needRender = true;
        });
    }

    #render = () => {
        this.#rafId = requestAnimationFrame(this.#render);

        if (!this.#isRunning || !this.#needRender) return;
        this.#needRender = false;

        this.#ctx.clearRect(0, 0, this.#overlayCanvas.width, this.#overlayCanvas.height);

        for (const layer of this.#layers) {
            if (layer.length === 0) continue;

            for (const { id, render: renderFn } of layer) {
                try {
                    const retCode = renderFn(this.#ctx);
                    switch (retCode) {
                        case FX_STATE.REMOVED:
                            this.removeFx(id);
                            break;
                        case FX_STATE.IN_PROCESS:
                            this.#needRender = true;
                            break;
                        case FX_STATE.FINISHED:
                            break;
                        default:
                            console.warn(`fx should return a state! (${id})`);
                    }
                } catch (error) {
                    console.error('Error in fx callback: ', error);
                    this.removeFx(id);
                }
            }
        }
    };

    start() {
        if (this.#isRunning) return;
        this.#isRunning = true;
        this.#render();
    }

    stop() {
        this.#isRunning = false;
        if (this.#rafId) {
            cancelAnimationFrame(this.#rafId);
            this.#rafId = null;
        }
    }

    resize(width, height) {
        this.#overlayCanvas.width = width;
        this.#overlayCanvas.height = height;
    }

    clear() {
        this.#ctx.clearRect(0, 0, this.#overlayCanvas.width, this.#overlayCanvas.height);
    }

    addFx(id, layer, renderFn) {
        if (layer < 0 || layer > MAX_LAYER) {
            console.warn(`Layer ${layer} is < 0 or > ${MAX_LAYER}.`);
            return;
        }

        this.removeFx(id);
        this.#layers[layer].push({ id, render: renderFn });
        this.#needRender = true;
    }

    removeFx(id) {
        for (const layer of this.#layers) {
            const index = layer.findIndex(fx => fx.id === id);
            if (index !== -1) {
                layer.splice(index, 1);
                this.#needRender = true;
                return;
            }
        }
    }

    requestRender() {
        this.#needRender = true;
    }
}

export function createOverlayRenderer(overlayCanvas, core) {
    return new OverlayRenderer(overlayCanvas, core);
}