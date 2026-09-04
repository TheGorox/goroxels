import { emitter } from "./events";

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 */
export function createInputHandler(canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });

    let camX = 0;
    let camY = 0;
    let currentZoom = 1;
    let targetZoom = 1;
    const LERP_FACTOR = 0.22;

    // Pivot — точка мира, которая должна оставаться под курсором
    let pivotScreenX = 0;
    let pivotScreenY = 0;
    let pivotWorldX = 0;
    let pivotWorldY = 0;

    // Текущая позиция мыши (обновляется всегда)
    let mouseScreenX = 0;
    let mouseScreenY = 0;

    const activePointers = new Map();
    let prevAvgX = 0;
    let prevAvgY = 0;
    let prevDist = 0



    function getPointersArray() { return Array.from(activePointers.values()); }
    function getAveragePosition() {
        const points = getPointersArray();
        if (points.length === 0) return { x: 0, y: 0 };
        let sx = 0, sy = 0;
        for (const p of points) { sx += p.x; sy += p.y; }
        return { x: sx / points.length, y: sy / points.length };
    }
    function getFingerDistance() {
        const points = getPointersArray();
        if (points.length < 2) return 0;
        const dx = points[0].x - points[1].x;
        const dy = points[0].y - points[1].y;
        return Math.hypot(dx, dy);
    }

    function onPointerDown(e) {
        canvas.setPointerCapture(e.pointerId);
        activePointers.set(e.pointerId, {
            x: e.clientX, 
            y: e.clientY,
            startX: e.clientX,
            startY: e.clientY
        });

        let isGesture = false;
        if (activePointers.size > 1) {
            const avg = getAveragePosition();
            prevAvgX = avg.x;
            prevAvgY = avg.y;
            prevDist = getFingerDistance();

            isGesture = true;
        }

        e.gesture = isGesture;
        emitter.emit('pointerdown', e);
    }


    function onPointerMove(e) {
        const pointer = activePointers.get(e.pointerId);
        if (!pointer) {
            emitter.emit('pointermove', e);
            return;
        };

        const oldX = pointer.x;
        const oldY = pointer.y;
        pointer.x = e.clientX;
        pointer.y = e.clientY;

        const count = activePointers.size;

        if (count === 1) {
            e.startX = pointer.startX;
            e.startY = pointer.startY;

            e.dx = pointer.x - oldX;
            e.dy = pointer.y - oldY;

            emitter.emit('pointerdrag', e);
        }
        else if (count === 2) {
            const avg = getAveragePosition();
            const dx = avg.x - prevAvgX;
            const dy = avg.y - prevAvgY;

            const currentDist = getFingerDistance();

            emitter.emit('pointerpinch', {
                ds: currentDist / prevDist,
                dx, dy,
                centerX: avg.x,
                centerY: avg.y
            });

            prevAvgX = avg.x;
            prevAvgY = avg.y;
            prevDist = currentDist;
        }
    }

    function onPointerUp(e) {
        const oldPointer = activePointers.get(e.pointerId);
        if(!oldPointer) return;
        
        activePointers.delete(e.pointerId);

        e.startX = oldPointer.startX;
        e.startY = oldPointer.startY;

        emitter.emit('pointerup', e);
    }

    function onWheel(e) {
        e.preventDefault();

        emitter.emit('wheel', e);
    }

    canvas.addEventListener('pointerdown', onPointerDown, { passive: true });
    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerup', onPointerUp, { passive: true });
    canvas.addEventListener('pointercancel', onPointerUp, { passive: true });
    canvas.addEventListener('wheel', onWheel, { passive: false });

    document.addEventListener('keydown', e => emitter.emit('keydown', e));
    document.addEventListener('keyup', e => emitter.emit('keyup', e));
}