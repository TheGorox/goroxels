import { useGameCore } from "./core.svelte";

export default class Chunk {
    constructor(x, y) {
        this.core = useGameCore();

        this.x = x;
        this.y = y;

        this.width = this.core.config.chunkSize;
        this.height = this.core.config.chunkSize;

        // main image
        this.canvas = null;
        this.ctx = null;
        this.imgData = null;
        this.view = null;

        // protection mask
        this.pCanvas = null;
        this.pCtx = null;
        this.pImgData = null;
        this.pView = null;

        this._needRedraw = false;

        this.loadedAt = 0;
    }

    init(buffer) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d', { alpha: false });

        // imgData and view are basically the same memory
        this.imgData = this.ctx.createImageData(this.width, this.height);
        this.view = new Uint32Array(this.imgData.data.buffer);

        // --------------

        this.pCanvas = document.createElement('canvas');
        this.pCanvas.width = this.width;
        this.pCanvas.height = this.height;
        this.pCtx = this.canvas.getContext('2d', { alpha: true });

        this.pImgData = this.ctx.createImageData(this.width, this.height);
        this.pView = new Uint32Array(this.imgData.data.buffer);

        this.loadedAt = Date.now();

        this.loadFromBuffer(buffer);
        this.requestRedraw();
    }

    loadFromBuffer(buffer) {
        let col, isProtected;
        const bgrPalette = this.core.config.colorsBGR;
        for (let i = 0; i < buffer.byteLength; i++) {
            col = buffer[i];
            isProtected = col & 0x80;

            isProtected && (this.pView[i] = 0xFFFF0000);
            this.view[i] = bgrPalette[col & 0x7F];
        }
    }

    set(x, y, col) {
        const bgrPalette = this.core.config.colorsBGR;

        const i = x + y * this.width;
        this.view[i] = bgrPalette[col];
    }
    
    get(x, y, raw=false) {
        const bgrToIdx = this.core.config.colorsBGRtoIdx;
        
        const i = x + y * this.width;
        return raw ? this.view[i] : bgrToIdx.get(this.view[i]);
    }
    
    getProtectedState(x, y){
        const i = x + y * this.width;
        return this.pView[i] === 0;
    }


    requestRedraw() {
        this._needRedraw = true;
    }

    redraw() {
        if (!this._needRedraw) return;

        this._needRedraw = false;

        this.ctx.putImageData(this.imgData, 0, 0);
        if (this.core.ui.showProtection.v) {
            // actual protection rendering must be done by some shader/fx
            // this is just a mask reference
            this.pCtx.putImageData(this.pImgData, 0, 0);
        }
    }
}