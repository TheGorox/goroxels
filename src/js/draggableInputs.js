export function initDraggableInputs() {
    const DRAG_THRESHOLD = 5;

    document.querySelectorAll('input[type=number].valueDrag').forEach(input => {
        input.style.cursor = 'ew-resize';

        let startX = 0;
        let startValue = 0;
        let dragging = false;
        let armed = false;

        const step = () => {
            let s = parseFloat(input.step);
            return isNaN(s) || s <= 0 ? 1 : s;
        };

        const min = () => {
            let m = parseFloat(input.min);
            return isNaN(m) ? -Infinity : m;
        };

        const max = () => {
            let m = parseFloat(input.max);
            return isNaN(m) ? Infinity : m;
        };

        input.addEventListener('mousedown', e => {
            if (e.button !== 0) return;
            armed = true;
            dragging = false;
            startX = e.clientX;
            startValue = parseFloat(input.value) || 0;
            e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
            if (!armed) return;
            let dx = e.clientX - startX;

            if (!dragging && Math.abs(dx) >= DRAG_THRESHOLD) {
                dragging = true;

                input.blur();
                document.body.style.userSelect = 'none';
                document.body.style.cursor = 'ew-resize';
            }

            if (dragging) {
                let val = startValue + dx * step();
                val = Math.min(max(), Math.max(min(), val));
                input.value = val;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });

        document.addEventListener('mouseup', e => {
            if (!armed) return;
            if (dragging) {
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            if(e.target === input){
                $(input).trigger('focus');
            }

            document.body.style.userSelect = '';
            document.body.style.cursor = '';
            armed = false;
            dragging = false;
        });
    });
}