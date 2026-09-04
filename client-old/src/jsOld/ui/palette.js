import { allColors, currentPalette, currentPaletteColors, hexPalette, palettes, setCurrentPalette } from "../config";
import config from './config';
import { patterns } from "../convert/patterns";
import globals from "../globals";
import player from "../player";
import { isDarkColor } from "../utils/color";
import { getLS, setLS } from "../utils/localStorage";
import { fixColorsWidth, unloadPalettePatterns } from "./config";
import { palette } from "./elements";
import { mobile } from "../tools/toolUtils";

export function initPalette() {
    const saved = getLS('palette', true) || undefined;
    paletteChosen(saved);
}
export function paletteChosen(name) {
    const palette = palettes?.find(pal => pal.name === name) || palettes?.at(0);
    let [paletteColors, startIdx] = setCurrentPalette(palette);

    $('#palette>.paletteColor').remove();
    addPaletteColors(paletteColors, startIdx);

    if (getLS('showPalettePatterns') == 1) {
        showPatternsOnPalette();
        globals.showPatterns = true;
    }

    fixColorsWidth();

    if(name)
        setLS('palette', name, true);

    globals.toolManager.tools['colorador'].updateUIPalette();
}


function addPaletteColors(colors, startId) {
    colors.forEach((color, id) => {
        id += startId;

        const colorEl = document.createElement('div');
        colorEl.style.backgroundColor = `rgb(${color.join(',')})`;
        colorEl.classList = ['paletteColor light'];
        colorEl.id = 'col' + id;

        // detect long press
        let downtime = 0;

        var $clrEl = $(colorEl);

        $clrEl.on('pointerdown', () => {
            downtime = Date.now();
        })

        $clrEl.on('pointerleave', () => {
            downtime = 0;
        })

        colorEl.onclick = e => {
            let isLong = false;
            if (downtime != 0) {
                if (Date.now() - downtime > 700) {
                    isLong = true;
                }
                downtime = 0;
            }

            if(mobile && globals.toolManager.tool === globals.toolManager.tools.colorador){
                globals.toolManager.tools['colorador'].mmb(id);
                return
            }
            let f = isLong ? player.switchSecondColor : player.switchColor;
            f.call(player, id);
        }

        // only for MMB events
        colorEl.onmouseup = e => {
            if (e.button !== 1) {
                return;
            }

            globals.toolManager.tools['colorador'].mmb(id);
        }

        colorEl.oncontextmenu = () => {
            // right button click
            player.switchSecondColor(id);
        }

        palette.append(colorEl);
    })
}


export function showPatternsOnPalette() {
    unloadPalettePatterns();

    // just iterate through all colors
    allColors.forEach(([r, g, b], i) => {
        if(!$(`#col${i}`)[0]) return;
        
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
                    if (imd[toI(x, y) + 3]) continue;

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
                ctx.fillRect(i % 14, i / 14 | 0, 1, 1);
        }


        const dataurl = canvas.toDataURL();
        const img = document.createElement('img');
        img.src = dataurl;
        $(`#col${i}`).append(img);
    });
    $('.paletteColor').addClass('patternColor');
}
