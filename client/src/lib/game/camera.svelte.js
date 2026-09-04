import { screenToBoardSpace } from "./utils/camera";

export function createCamera(canvas, canvasConfig) {
    const camera = $state({
        x: 0, // camera center x
        y: 0, // camera center y
        currentZoom: 1,
        targetZoom: 1,

        // world point that should stay under the mouse
        pivotWorldX: 0,
        pivotWorldY: 0,

        // current mouse pos
        mouseScreenX: 0,
        mouseScreenY: 0,

        noMoving: false,

        lerpFactor: 0.22,
    });

    const minZoom = 0.1;
    const maxZoom = 64;

    const halfW = canvasConfig.boardWidth / 2;
    const halfH = canvasConfig.boardHeight / 2;

    function clamp(){
        camera.x = Math.max(-halfW, Math.min(camera.x, halfW));
        camera.y = Math.max(-halfH, Math.min(camera.y, halfH));
    }

    function clampZoom(){
        camera.targetZoom = Math.max(minZoom, Math.min(camera.targetZoom, maxZoom));
    }

    const cameraApi = {
        centerOn: (x, y) => {
            camera.x = x;
            camera.y = y;
        },
        updateMouse(screenX, screenY) {
			camera.mouseScreenX = screenX;
			camera.mouseScreenY = screenY;

            const [pivWorldX, pivWorldY] = screenToBoardSpace(screenX, screenY);
			camera.pivotWorldX = pivWorldX;
			camera.pivotWorldY = pivWorldY;
		},
        moveBy(dx, dy) {
			if (camera.noMoving) return;
			camera.x += dx / camera.currentZoom;
			camera.y += dy / camera.currentZoom;
			clamp();
		},

		setTargetZoom(value) {
			camera.targetZoom = value;
			clampZoom();
		},

		disableMove() { camera.noMoving = true; },
		enableMove() { camera.noMoving = false; },

		updateLerp() {
            if(camera.currentZoom === camera.targetZoom) return;

			const prevZoom = camera.currentZoom;
			camera.currentZoom += (camera.targetZoom - camera.currentZoom) * camera.lerpFactor;

			if (Math.abs(camera.currentZoom - prevZoom) > 0.0001) {
				camera.x = camera.pivotWorldX - (camera.mouseScreenX - canvas.clientWidth / 2) / camera.currentZoom;
				camera.y = camera.pivotWorldY - (camera.mouseScreenY - canvas.clientHeight / 2) / camera.currentZoom;
			}
		}
    }

    Object.assign(camera, cameraApi);

    return camera;
}