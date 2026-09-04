import player, { updateBrush } from '../player';
import Tool from '../Tool';


export const incBrush = new Tool('+brush size', 'BracketRight'); // [
incBrush.on('down', () => {
    if (player.brushSize >= 100) return;
    // 1,2,3,5,7,9,...
    const delta = player.brushSize >= 3 ? 2 : 1;
    updateBrush(player.brushSize + delta);
});
export const decBrush = new Tool('-brush size', 'BracketLeft'); // ]
decBrush.on('down', () => {
    if(player.brushSize === 1) return;

    const delta = player.brushSize <= 4 ? 1 : 2;
    updateBrush(player.brushSize - delta);
});
