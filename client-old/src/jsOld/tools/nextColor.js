import { allColors, currentPalette } from '../config';
import player from '../player';
import Tool from '../Tool';


export const colorDec = new Tool('left color', 'KeyA');
colorDec.on('down', function () {
    const minIndex = currentPalette?.slice[0] ?? 0;
    const maxIndex = currentPalette?.slice[1] ?? allColors.length;

    let color = player.color - 1;
    if (color < minIndex) color = maxIndex - 1;

    // palette overflow fix
    color = Math.min(maxIndex - 1, Math.max(minIndex, color));

    player.switchColor(color);
});
export const colorInc = new Tool('right color', 'KeyS');
colorInc.on('down', function () {
    // allColors and currentpalette can be different
    // we must overflow the color if its id exceeds 
    // not all palette length, but the current used one
    const minIndex = currentPalette?.slice[0] ?? 0;
    const maxIndex = currentPalette?.slice[1] ?? allColors.length;

    let color = player.color + 1;
    if (color >= maxIndex) color = minIndex;

    // palette overflow fix
    color = Math.min(maxIndex - 1, Math.max(minIndex, color));

    player.switchColor(color);
});
