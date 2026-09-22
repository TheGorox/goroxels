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

        // protection        
        this.pMask = null;        // Uint8Array(w*h), 0/255
        this.pLevels = [];        // pLevels[0] = pMask, pLevels[L] = Uint8Array((w>>L)*(h>>L))
        this.pVersion = 0;

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
        this.pMask = new Uint8Array(this.width * this.height);
        this.pLevels = [this.pMask];

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

            if (isProtected) {
                this.pMask[i] = 255;
            }
            this.view[i] = bgrPalette[col & 0x7F];
        }

        this.afterSetProtection()
    }

    setProtectedRaw(x, y, on) {
        this.pMask[x + y * this.width] = on ? 255 : 0;
    }

    // should be called after each protection batch
    afterSetProtection() {
        this.pLevels.length = 1; // LOD invalidation
        this.pVersion++;
    }

    getProtectedState(x, y) {
        return this.pMask[x + y * this.width] !== 0;
    }

    set(x, y, col) {
        const bgrPalette = this.core.config.colorsBGR;

        const i = x + y * this.width;
        this.view[i] = bgrPalette[col];
    }

    get(x, y, raw = false) {
        const bgrToIdx = this.core.config.colorsBGRtoIdx;

        const i = x + y * this.width;
        return raw ? this.view[i] : bgrToIdx.get(this.view[i]);
    }


    requestRedraw() {
        this._needRedraw = true;
    }

    redraw() {
        if (!this._needRedraw) return;

        this._needRedraw = false;

        this.ctx.putImageData(this.imgData, 0, 0);
    }

    getMaskLevel(L) {
        while (this.pLevels.length <= L) {
            const src = this.pLevels[this.pLevels.length - 1];
            const sw = this.width >> (this.pLevels.length - 1);
            const dw = sw >> 1;
            const dst = new Uint8Array(dw * dw);
            for (let y = 0; y < dw; y++) {
                const r0 = (y * 2) * sw, r1 = r0 + sw;
                for (let x = 0; x < dw; x++) {
                    const x2 = x * 2;
                    dst[y * dw + x] = src[r0 + x2] | src[r0 + x2 + 1] | src[r1 + x2] | src[r1 + x2 + 1];
                }
            }
            this.pLevels.push(dst);
        }
        return this.pLevels[L];
    }
}