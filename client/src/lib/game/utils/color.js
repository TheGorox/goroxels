export function rgb2abgr(r, g, b) {
    return 0xff000000 | b << 16 | g << 8 | r;
}

function component2hex(c) {
    return c.toString(16).padStart(2, '0');
}

export function rgb2hex(rgb) {
    return '#' + component2hex(rgb[0]) + component2hex(rgb[1]) + component2hex(rgb[2])
}

// export function isDarkColor(r, g, b) {
//     // V value from HSV
//     return Math.max(r / 255, g / 255, b / 255) < 0.5
// }

export function applyColor(origColor, tintColor) {
    var alpha = tintColor[3] / 255;

    return [
        Math.round((1 - alpha) * origColor[0] + alpha * tintColor[0]),
        Math.round((1 - alpha) * origColor[1] + alpha * tintColor[1]),
        Math.round((1 - alpha) * origColor[2] + alpha * tintColor[2])
    ];
}

export function closestColor(rgb, palette) {
    let colorId = -1;
    let score = 768; // 255 + 255 + 255

    for (let i = 0; i < palette.length; i++) {
        const item = palette[i];

        let scrnow = Math.abs(rgb[0] - item[0]) + Math.abs(rgb[1] - item[1]) + Math.abs(rgb[2] - item[2]);
        if (scrnow < score) {
            score = scrnow;
            colorId = i;
        }

        if (scrnow == 0) break;
    }
    return colorId;
}

export function getPaletteColorId(color) {
    // if we're using one of multiple palettes, 
    // try to find the color in this palette first
    if(currentPalette){
        const startIdx = currentPalette.slice[0];
        
        const colIdx = currentPaletteColors.findIndex(palCol => eq(palCol, color));
        if(colIdx !== -1) return startIdx + colIdx;
    }
    return allColors.findIndex(palCol => eq(palCol, color));
}

export function isDarkColor(r, g, b) {
    const darkness = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return darkness > 0.5;
}

export function eq(col1, col2) {
    return col1[0] === col2[0] && col1[1] === col2[1] && col1[2] === col2[2];
}

const luminanceCache = new Map();
function getLuminance(hex) {
    if (luminanceCache.has(hex)) return luminanceCache.get(hex);

    const rgb = hex.startsWith('#') ? hex.slice(1) : hex;
    const res = (rgb.length === 3 ? rgb.split('').map(c => c + c).join('') : rgb)
        .match(/.{2}/g)
        .map(v => {
            const val = parseInt(v, 16) / 255;
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });

    const luminance = res[0] * 0.2126 + res[1] * 0.7152 + res[2] * 0.0722;
    
    luminanceCache.set(hex, luminance);
    return luminance;
}

export function checkCssContrast(hex1, hex2) {
    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);
    
    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}