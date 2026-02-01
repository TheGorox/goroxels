import { canvasName } from '../config';
import globals from '../globals';
import { curHistoryCanvasUrl } from '../history';
import { getPathsafeDate } from './misc';


export function makeScreenshot() {
    let canvas = globals.chunkManager.dumpAll();    
    let href = curHistoryCanvasUrl ?? canvas.toDataURL()
    
    const link = document.createElement('a');
    link.download = `GX ${canvasName} ${getPathsafeDate()}.png`;
    link.href = href;
    link.click();
    link.remove();
}
