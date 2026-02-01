import camera from "./camera";
import { boardHeight, boardWidth } from "./config";
import { FX } from "./fxcanvas";
import { boardToScreenSpace } from "./utils/conversions";

// require wipes dynamically, parsing the file name of each
const requireOldWipe = require.context('../img/old-wipes', false, /\.png$/);

const namePathEntries = requireOldWipe.keys().map(key => {
    const module = requireOldWipe(key);
    const path = module.default;
    const fname = path.match(/([\.\d]+)\.png$/)[1];

    return [fname, path];
}).sort(([name1], [name2]) => {
    // sort by date
    const [day1, month1, year1] = name1.split('.').map(Number);
    const [day2, month2, year2] = name2.split('.').map(Number);
    
    if (year1 !== year2) return year2 - year1;
    if (month1 !== month2) return month2 - month1;
    return day2 - day1;
});

export const wipes = Object.fromEntries(namePathEntries);

let historyFx = null, fxCtx = null, prevCameraState;
export let curHistoryCanvasUrl = null;
export async function showHistoryCanvas(name) {
    unloadHistoryCanvas();


    curHistoryCanvasUrl = wipes[name]
    const canvasImg = await loadHistoryCanvas(curHistoryCanvasUrl);

    // saving and changing camera borders
    // (the thing that helps you not get lost when moving canvas)
    prevCameraState = cloneCameraProps(camera);

    camera.minX = -canvasImg.width / 2;
    camera.minY = -canvasImg.height / 2;
    camera.maxX = canvasImg.width / 2;
    camera.maxY = canvasImg.height / 2;

    camera.x = 0;
    camera.y = 0;
    camera.zoom = camera.minZoom;

    globals.renderer.needRender = true;

    // need to center it in the current canvas, otherwise 
    // even camera borders change will not help
    const canvasStartX = boardWidth/2 - canvasImg.width/2;
    const canvasStartY = boardHeight/2 - canvasImg.height/2;

    historyFx = new FX(ctx => {
        if (fxCtx === null) {
            fxCtx = ctx;
            // hiding real canvas
            ctx.canvas.style.backgroundColor = 'gray';
        }

        const zoom = camera.zoom
        const topLeftPos = boardToScreenSpace(canvasStartX, canvasStartY);

        ctx.drawImage(canvasImg, ...topLeftPos, canvasImg.width * zoom, canvasImg.height * zoom);

        return 1;
    });

    globals.fxRenderer.add(historyFx, 1);
}

async function loadHistoryCanvas(path) {
    return new Promise((res, rej) => {
        const img = new Image();

        img.style.imageRendering = 'pixelated';

        img.onload = () => res(img);
        img.onerror = rej;

        img.src = path;
    });
}

function cloneCameraProps(){
    const { x, y, zoom, minX, minY, maxX, maxY } = camera;
    return { x, y, zoom, minX, minY, maxX, maxY };
}

export function unloadHistoryCanvas() {
    curHistoryCanvasUrl = null;

    globals.fxRenderer.remove(historyFx);
    if (fxCtx) {
        fxCtx.canvas.style.backgroundColor = '';
        fxCtx = null;
    }
    if (prevCameraState) {
        const { x, y, zoom, minX, minY, maxX, maxY } = prevCameraState;
        Object.assign(camera, { x, y, zoom, minX, minY, maxX, maxY });
    }
}

function sortDates(dates) {
    return dates.sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('.').map(Number);
        const [dayB, monthB, yearB] = b.split('.').map(Number);
        
        const dateA = new Date(2000 + yearA, monthA - 1, dayA);
        const dateB = new Date(2000 + yearB, monthB - 1, dayB);
        
        return dateA - dateB;
    });
}