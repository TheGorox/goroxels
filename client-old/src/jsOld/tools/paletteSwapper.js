import { currentPalette, palettes } from '../config';
import Tool from '../Tool';
import { paletteChosen } from '../ui/palette';


const paletteSwapper = new Tool('palette_swap', 'KeyH');
paletteSwapper.on('down', function () {
    const allPalettes = palettes;
    if (!allPalettes) return;

    let paletteIdx = palettes.findIndex(p => p.name === currentPalette.name);
    paletteIdx = ++paletteIdx % palettes.length;

    const newPalette = allPalettes[paletteIdx];
    paletteChosen(newPalette.name);
});
export default paletteSwapper;