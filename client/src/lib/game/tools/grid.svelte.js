import moveIcon from '$lib/assets/icons/icon_settings.svg?raw';
import { tick } from 'svelte';
import { FX_STATE } from '../fx/fx.svelte';
import { persistent } from '../stores/persistent.svelte';
import { clamp, remap } from '../utils/math';

class GridTool {
    core = null;
    name = 'grid';
    icon = moveIcon;
    keybind = 'KeyG';
    showOnPanel = false;
    isBackground = false;

    #activeStore = persistent('gridActive', false);
    get isActive() {
        return this.#activeStore.v;
    }
    set isActive(value) {
        this.#activeStore.v = value;


        console.log('set isActive', value)
    }
    toggledAt = 0;

    postInit() {
        if (this.isActive){
            this.updateFx.bind(this);
        }
    }


    onUp(e = null) {
        this.isActive = !this.isActive;
        this.toggledAt = Date.now();

        this.updateFx();
    }

    updateFx() {
        if (this.isActive) {
            this.core.fx.addFx('grid', 1, this.render.bind(this));
        } else {
            this.core.fx.requestRender();
        }
    }

    render(ctx) {
        console.log('render')
        const camera = this.core.camera;
        if (camera.currentZoom <= 2) {
            return FX_STATE.FINISHED;
        }

        let retCode = FX_STATE.FINISHED;

        const canvasW = ctx.canvas.clientWidth;
        const canvasH = ctx.canvas.clientHeight;

        const vlines = Math.ceil(canvasW / camera.currentZoom);
        const hlines = Math.ceil(canvasH / camera.currentZoom);

        let startX = ((-camera.x * camera.currentZoom) + canvasW / 2) % camera.currentZoom;
        let startY = ((-camera.y * camera.currentZoom) + canvasH / 2) % camera.currentZoom;

        let targetAlpha = remap(clamp(camera.currentZoom, 3, 20), 3, 20, 0, .8);
        let curAlpha = targetAlpha;
        // make it appear and disappear smoothly
        const sinceToggledMs = Date.now() - this.toggledAt;
        if (sinceToggledMs < 300) {
            let mod = clamp(sinceToggledMs / 250, 0, 1);
            curAlpha *= this.isActive ? mod : (1 - mod);
            retCode = FX_STATE.IN_PROCESS;
        } else if (!this.isActive) {
            return FX_STATE.REMOVED;
        }

        ctx.beginPath();
        ctx.globalAlpha = curAlpha;
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;
        let x = startX;
        for (let line = 0; line < vlines; line++) {
            x += camera.currentZoom;

            const _x = (x | 0) + 0.5;

            ctx.moveTo(_x, 0);
            ctx.lineTo(_x, window.innerHeight);
        }
        let y = startY;
        for (let line = 0; line < hlines; line++) {
            y += camera.currentZoom;

            const _y = (y | 0) + 0.5;

            ctx.moveTo(0, _y);
            ctx.lineTo(window.innerWidth, _y);
        }
        ctx.stroke();

        return retCode;
    }
}

export default new GridTool();