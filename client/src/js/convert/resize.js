export function resizeCanvas(canvas, width, height, antiAliasing = true) {
    width = Math.max(0, Math.floor(Number(width) || 0));
    height = Math.max(0, Math.floor(Number(height) || 0));
    const dpr = window.devicePixelRatio || 1;
    const targetRatio = antiAliasing ? dpr : 1;

    const prevW = canvas.width;
    const prevH = canvas.height;

    const copyCanvas = document.createElement("canvas");
    copyCanvas.width = Math.max(1, prevW);
    copyCanvas.height = Math.max(1, prevH);
    const copyCtx = copyCanvas.getContext("2d");
    if (prevW && prevH) {
        copyCtx.drawImage(canvas, 0, 0);
    }

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = Math.max(1, Math.round(width * targetRatio));
    canvas.height = Math.max(1, Math.round(height * targetRatio));

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = !!antiAliasing;
    if ("imageSmoothingQuality" in ctx) {
        ctx.imageSmoothingQuality = antiAliasing ? "high" : "low";
    }
    ctx.setTransform(targetRatio, 0, 0, targetRatio, 0, 0);

    if (prevW && prevH) {
        ctx.drawImage(copyCanvas, 0, 0, copyCanvas.width, copyCanvas.height,
            0, 0, width, height);
    }
    return ctx.canvas;
}

// searches for pixel chunks and automatically
// determines them zoom
export function isImagePixelArt(canvas) {
    const ctx = canvas.getContext("2d");
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = img.data;

    const maxSize = 10;
    let supposedSize = 0;
    let confirms = 0;
    const maxBound = Math.min(img.width, img.height);

    let curSize = 0;
    let lastSize = 0;
    let lastSizeCombos = 0;
    let lastCol = -1;

    let result = false;
    let pixelSize = 1;

    const encodeClr = (r, g, b) => (r << 16) | (g << 8) | b;

    for (let diagonale = 0; diagonale < maxBound; diagonale++) {
        const idx = (diagonale + diagonale * img.width) * 4;
        const curCol = encodeClr(d[idx], d[idx + 1], d[idx + 2]);

        curSize += 1;

        if (curCol !== lastCol) {
            lastCol = curCol;

            if (curSize === lastSize && lastSize > 0) {
                lastSizeCombos++;

                if (lastSizeCombos >= 1) {
                    if (confirms > 0) {
                        if (confirms >= 1) {
                            result = true;
                            pixelSize = supposedSize;
                            return { result, pixelSize };
                        } else {
                            const div = img.width % supposedSize;
                            if (supposedSize !== lastSize || div !== 0) {
                                return { result: false, pixelSize: 1 };
                            }
                        }
                    }

                    lastSizeCombos = 0;
                    confirms++;
                    supposedSize = lastSize;
                    lastSize = 0;
                }
            } else {
                if (
                    curSize < maxSize &&
                    curSize > 1 &&
                    (curSize < lastSize * 2 || lastSize === 0)
                ) {
                    lastSize = curSize;
                }
                if (lastSize && curSize === 1) {
                    return { result: false, pixelSize: 1 };
                }
            }

            curSize = 0;
        }
    }

    return { result: false, pixelSize: 1 };
}
