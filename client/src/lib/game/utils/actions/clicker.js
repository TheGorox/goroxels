export function clicker(node, options = {}) {
    let timer = null;
    let isLong = false;
    let isPressed = false; // Флаг: был ли pointerdown именно на этом элементе

    let { onclick, onlongclick, delay = 500 } = options;

    function handleDown(e) {
        isPressed = true;
        isLong = false;

        // Захватываем указатель, чтобы события не улетали на другие элементы
        if (e.pointerId !== undefined && node.setPointerCapture) {
            try {
                node.setPointerCapture(e.pointerId);
            } catch (_) { }
        }

        if (onlongclick) {
            timer = setTimeout(() => {
                isLong = true;
                onlongclick(e);
            }, delay);
        }
    }

    function handleUp(e) {
        // Если на ЭТОМ экземпляре не было pointerdown (например, DOM перерендерился во время зажатия) — игнорируем
        if (!isPressed) return;
        isPressed = false;

        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        if (isLong) {
            isLong = false;
            return;
        }

        if (onclick) {
            onclick(e);
        }
    }

    function handleCancel() {
        isPressed = false;
        isLong = false;
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    }

    node.addEventListener('pointerdown', handleDown);
    node.addEventListener('pointerup', handleUp);
    node.addEventListener('pointerleave', handleCancel);
    node.addEventListener('pointercancel', handleCancel);

    return {
        update(newOptions) {
            onclick = newOptions.onclick;
            onlongclick = newOptions.onlongclick;
            delay = newOptions.delay ?? 500;
        },
        destroy() {
            handleCancel();
            node.removeEventListener('pointerdown', handleDown);
            node.removeEventListener('pointerup', handleUp);
            node.removeEventListener('pointerleave', handleCancel);
            node.removeEventListener('pointercancel', handleCancel);
        }
    };
}