import moveIcon from '$lib/assets/icons/icon_mover.svg?raw';
import { screenToBoardSpace } from '../utils/camera.js';
import { clamp } from '../utils/math.js';

const zoomLevels = [
    1/64, 1/32, 1/16, 1/8, 1/4, 1/2, 1,
    1.25, 1.5, 2, 4, 6, 8,
    10, 12, 16, 20, 25, 32, 40, 50, 64
];

function getNearestZoomLevel(desiredZoom) {
    let closest = zoomLevels[0];
    let minDiff = Math.abs(desiredZoom - closest);

    for (let z of zoomLevels) {
        const diff = Math.abs(desiredZoom - z);
        if (diff < minDiff) {
            minDiff = diff;
            closest = z;
        }
    }
    return closest;
}

class MoverTool {
    core = null;

    name = 'mover';
    icon = moveIcon;
    keybind = 'LMB';
    showOnPanel = true;
    isBackground = true;
    backgroundToolProps = {
        nonIntrusiveListeners: ['pointerdrag']
    }

    isActive = $state(false);

    mousedown = false;
    downPos = [0, 0];
    lastPos = [0, 0];
    downTime = 0;

    onSelected() {
        this.mousedown = false;
        this.isActive = false;
    }

    onDeselected() {
        this.mousedown = false;
        this.isActive = false;
    }

    onDown(e = null, isConsumed) {
        if(isConsumed) return;

        this.mousedown = true;
        this.isActive = true;
        this.downTime = Date.now();
    }

    onUp(e = null, isConsumed) {
        if(isConsumed) return;

        this.mousedown = false;
        this.isActive = false;
    }

    onpointermove(e) {
        this.updateMousePos(e);
    }

    updateMousePos(e) {
        if (!this.core) return;
        const camera = this.core.camera;
        camera.updateMouse(e.clientX, e.clientY);
    }

    onpointerdrag(e, isConsumedMode=false) {
        if (!this.core || !isConsumedMode && !this.mousedown) return;

        const camera = this.core.camera;
        camera.x -= e.dx / camera.currentZoom;
        camera.y -= e.dy / camera.currentZoom;

        this.updateMousePos(e);
    }

    onpointerpinch(e) {
        if (!this.core) return;
        const camera = this.core.camera;
        const canvas = this.core.mainCanvas;
        
        camera.x -= e.dx / camera.currentZoom;
        camera.y -= e.dy / camera.currentZoom;
        
        const [centerWorldX, centerWorldY] = screenToBoardSpace(e.centerX, e.centerY);
        
        camera.currentZoom *= e.ds;
        camera.targetZoom = camera.currentZoom;
        
        camera.x = centerWorldX - (e.centerX - canvas.clientWidth / 2) / camera.currentZoom;
        camera.y = centerWorldY - (e.centerY - canvas.clientHeight / 2) / camera.currentZoom;
    }
    
    onwheel(e) {
        if (!this.core) return;
        const camera = this.core.camera;

        const closestZoom = getNearestZoomLevel(camera.targetZoom);
        const closestZoomIdx = zoomLevels.indexOf(closestZoom);

        const scrollingUp = e.deltaY < 0;
        const newZoomLevelIdx = clamp(closestZoomIdx + (scrollingUp ? 1 : -1), 0, zoomLevels.length - 1);

        this.updateMousePos(e);
        camera.targetZoom = zoomLevels[newZoomLevelIdx];
    }

    isLongTap() {
        return Date.now() - this.downTime > 600; 
    }
}

export default new MoverTool();