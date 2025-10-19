import { fixChatPosition, toggleEmojis, updateEmojis } from "../Chat";
import { hexPalette, palette } from "../config";
import { patterns } from "../convert/patterns";
import globals from "../globals";
import { togglePlaced, updatePlaced } from "../player";
import { isDarkColor } from "../utils/color";
import { getLS, getOrDefault } from "../utils/localStorage";
import { getRecommendedColorSize } from "../utils/misc";
import { chatInput, coords } from "./elements";

export function initUISettings() {
    fixColorsWidth();
    toggleEmojis(getLS('hideEmojis') != 1);
    updateEmojis(getOrDefault('emojis', '🙁 🤔 😀 😄 💚 😡 👋 👍 😐').split(' '));
    togglePlaced(!+getOrDefault('hidePlaced', 1))
    updatePlaced(getLS('placedCount', true));
    if (getLS('showPalettePatterns') == 1) {
        showPatternsOnPalette();
        globals.showPatterns = true;
    }
    if (getLS('swapToolsPos') == 1) {
        swapToolsPos(getLS('swapToolsPos'));
    }
}

export function initCoordsClick() {
    coords.on('click', function () {
        chatInput[0].value += this.innerText;
        chatInput.trigger('focus');
    })
}

export function fixColorsWidth() {
    const savedWidth = getLS('colorSize', true);
    const calculated = getRecommendedColorSize();

    const colSize = +savedWidth || calculated
    setPaletteColorsSize(colSize);
    fixChatPosition();
}

// an old analog for setPaletteColorsSize
export function setPaletteRows(rows) {
    let width = (window.innerWidth / 100) * rows;

    $('#palette').css('max-width', width);
}


export function setPaletteColorsSize(size) {
    if (size === undefined) {
        size = getRecommendedColorSize();
    }
    $('.paletteColor').css('width', size).css('height', size);
}

// beta and probably temprorary
// purposely not optimised
export function showPatternsOnPalette() {
    unloadPalettePatterns();

    palette.forEach(([r, g, b], i) => {

        const pat = patterns[i % patterns.length];

        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 14;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = hexPalette[i];

        for (let i = 0; i < 7 * 7; i++) {
            if (!pat[i]) continue;
            const x = i % 7;
            const y = i / 7 | 0;

            ctx.fillRect(x * 2, y * 2, 2, 2);
        }

        function toI(x, y) {
            return (x + y * 14) * 4;
        }

        // draw contour
        let imd = ctx.getImageData(0, 0, 14, 14).data;
        if (isDarkColor(r, g, b)) {
            ctx.fillStyle = 'white';
            let coords = [];
            for (let x = 0; x < 14; x++) {
                for (let y = 0; y < 14; y++) {
                    if (imd[toI(x, y) + 3]) continue

                    const top = imd[toI(x, y - 1) + 3];
                    const bottom = imd[toI(x, y + 1) + 3];
                    const left = imd[toI(x - 1, y) + 3];
                    const right = imd[toI(x + 1, y) + 3];

                    const leftTop = imd[toI(x - 1, y - 1) + 3];
                    const rightTop = imd[toI(x + 1, y - 1) + 3];
                    const leftBottom = imd[toI(x - 1, y + 1) + 3];
                    const rightBottom = imd[toI(x + 1, y + 1) + 3];

                    if (top || bottom || left || right ||
                        leftTop || rightTop || leftBottom || rightBottom) {
                        ctx.fillRect(x, y, 1, 1);
                    }
                }
            }
        }


        imd = ctx.getImageData(0, 0, 14, 14).data;
        ctx.fillStyle = 'black';
        for (let i = 0; i < 14 * 14; i++) {
            if (!imd[i * 4 + 3])
                ctx.fillRect(i % 14, i / 14 | 0, 1, 1)
        }


        const dataurl = canvas.toDataURL();
        const img = document.createElement('img');
        img.src = dataurl;
        $(`#col${i}`).append(img);
    });
    $('.paletteColor').addClass('patternColor');
}
export function swapToolsPos(state){
    const qs = $('#tools,.showMenu,.showChat')
    if(state == 1){
        qs.addClass('right');
    }else{
        qs.removeClass('right');
    }
}

export function unloadPalettePatterns() {
    $('.paletteColor>img').remove();
    $('.paletteColor').removeClass('patternColor');
}