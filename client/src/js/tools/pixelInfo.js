import camera from '../camera';
import { canvasId } from '../config';
import { addFX, FX } from '../fxcanvas';
import globals from '../globals';
import player from '../player';
import Tool from '../Tool';
import { apiRequest } from '../utils/api';
import { boardToScreenSpace } from '../utils/conversions';
import { htmlspecialchars } from '../utils/misc';


const pixelInfo = new Tool('pixel info', 'KeyI');
let last = null, pinfoFx = null;
function removeLast() {
    if (last) {
        last.remove();
        last = null;
    }
    if (pinfoFx) {
        pinfoFx.remove();
        pinfoFx = null;
    }
}
globals.eventManager.on('mouseup', removeLast);
pixelInfo.on('up', async () => {
    removeLast();

    const [x, y] = [player.x, player.y];

    const resp = await apiRequest(`/pixelInfo?canvas=${canvasId}&x=${x}&y=${y}`);
    const data = await resp.json();
    if (!data || !data.type) return;

    const el = $('<div class="infoBubble"><span style="user-select:text"></span></div>');
    last = el;

    const coordsLegend = $('<div>');
    coordsLegend[0].style.cssText =
        `position: absolute;
    top: -7px;
    left: 0;
    width: 100%;
    font-size: 14px;
    font-weight: bold;
    text-shadow: rgb(255 255 255) -1px 1px 0px, rgb(255 255 255) 1px 1px 0px, rgb(255 255 255) 1px -1px 0px, rgb(255 255 255) -1px -1px 0px;
    text-align: center;`;
    coordsLegend.text(`(${x}, ${y})`);

    el.append(coordsLegend);

    let text = '';

    if (data.type === 'UID') {
        const sanitizedName = htmlspecialchars(data.placer.nick);

        text += '<b>UID</b>&nbsp;' + data.placer.id + '<br>',
            text += '<b>name</b>&nbsp;' + sanitizedName;
    } else {
        text += `<b>${data.type}</b>`;
        if (data.placer) {
            text += '&nbsp;' + data.placer;
        }
    }

    $('span', el).html(text);

    $('body').append(el);

    const w = el[0].clientWidth;
    const h = el[0].clientHeight;

    function fixPos() {
        const [clientX, clientY] = boardToScreenSpace(x, y);
        const posX = clientX + (camera.zoom / 2) - (w / 2);
        const posY = clientY - h - 11;

        el.css('top', posY).css('left', posX);

        return 1;
    }
    fixPos();


    pinfoFx = new FX(() => {
        fixPos();
    });
    addFX(pinfoFx, 2);
});

export default pixelInfo;