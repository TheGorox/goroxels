import camera from './camera';
import {
    halfMap,
    loadImage
} from './utils/misc'

let winWid = window.innerWidth / 2,
    winHei = window.innerHeight / 2;

window.addEventListener('resize', () => {
    winWid = window.innerWidth / 2;
    winHei = window.innerHeight / 2;
})

import {
    urlInput,
    xInput,
    yInput,
    opacInput,
    chatInput
} from './ui/elements';
import { boardToScreenSpace, screenToBoardSpace } from './utils/conversions';
import globals from './globals';
import { addFX, FX } from './fxcanvas';
import { getOrDefault, setLS } from './utils/localStorage';
import me from './me';
import { apiRequest } from './utils/api';
import { templatesWindow } from './windows';
import player from './player';

const widthRegEx = /w(?:idth)?=(\d+)$/;

export class TemplateFx {
    constructor() {

    }
}

// singletone atm
class Template {
    constructor() {
        this.x = 0;
        this.y = 0;

        this.templateImg;
        this.templateResizeW = null;

        this._lastUrl = null;

        addFX(new FX(this.renderFx.bind(this)));
    }

    get url() {
        return urlInput.val()
    }

    get opacity() {
        return +opacInput.val()
    }

    set opacity(val) {
        opacInput.val(val);
    }

    renderFx(ctx) {
        if (!this.templateImg) return 1;

        ctx.imageSmoothingEnabled = false;

        const [posX, posY] = boardToScreenSpace(this.x, this.y);
        const zoom = camera.zoom;

        let canvasW, canvasH;
        // patternized or not
        if (this.templateResizeW) {
            canvasW = this.templateResizeW;
            // sometimes AR does not align template properly
            // so we need to divide by the pattern size(7) manually
            if (this.templateImg.width / this.templateResizeW === 7) {
                canvasH = Math.floor(this.templateImg.height / 7);
            } else {
                const ar = this.templateImg.width / this.templateImg.height;
                canvasH = Math.floor(this.templateResizeW / ar);
            }
        } else {
            canvasW = this.templateImg.width;
            canvasH = this.templateImg.height;
        }

        const oldOpac = ctx.globalAlpha;
        ctx.globalAlpha = this.opacity;

        ctx.drawImage(this.templateImg, posX, posY, canvasW * zoom | 0, canvasH * zoom | 0);

        ctx.globalAlpha = oldOpac;
        return 1;
    }

    update() {
        this.updatePosition();
        this.updateImage();
    }

    updatePosition() {
        this.x = parseInt(xInput.val(), 10);
        this.y = parseInt(yInput.val(), 10);

        globals.fxRenderer.requestRender();
    }

    static parseImageUrl(url) {
        let width = null;
        let match;
        if (match = url.match(widthRegEx)) {
            width = +match[1];
        }

        if (url.startsWith('GRX')) {
            const file = url.match(/f=(.+\.png)/)[1];
            url = `/api/template/img?t=orig&f=${file}`;
        }

        return {
            url, width
        }
    }

    async updateImage() {
        if (this.url === this._lastUrl) {
            return;
        }

        const {
            url: parsedUrl, width: parsedWidth
        } = Template.parseImageUrl(this.url);

        this.templateImg = await loadImage(parsedUrl);
        this._lastUrl = this.url;

        this.templateResizeW = parsedWidth;

        globals.fxRenderer.requestRender();
    }

    get isPatterns() {
        return !isNaN(this.templateResizeW) &&
            this.templateImg.width % 7 == 0 &&
            this.templateImg.height % 7 == 0;
    }
}
const template = new Template();

export function loadValues() {
    const urlVal = getOrDefault('template.url', 'https://i.imgur.com/4GQIMQ7.png', true);
    urlInput.val(urlVal);

    const xVal = getOrDefault('template.x', 0, true);
    xInput.val(parseInt(xVal, 10));

    const yVal = getOrDefault('template.y', 0, true);
    yInput.val(parseInt(yVal, 10));

    const opacVal = getOrDefault('template.opac', 0.5, true);
    opacInput.val(parseFloat(opacVal));
}

function saveTemplate() {
    setLS('template.x', template.x, true);
    setLS('template.y', template.y, true);
    setLS('template.url', template.url, true);
    setLS('template.opac', template.opacity, true);
}

export function updateTemplate() {
    template.update();
    saveTemplate();
}

export function initHandlers() {
    urlInput.on('input', updateTemplate);
    xInput.on('input', updateTemplate);
    yInput.on('input', updateTemplate);
    opacInput.on('input', updateTemplate);

    updateTemplate();
}

export function initTemplateMoveByMouse() {
    $(document).on('mousedown', e => {
        if (!e.ctrlKey) return;

        // preventing default movement
        e.stopPropagation();
        e.preventDefault();

        let lastCord = screenToBoardSpace(e.clientX, e.clientY).map(x => x |= 0);

        function mousemove(e) {
            e.stopPropagation();
            e.preventDefault();

            const boardPos = screenToBoardSpace(e.clientX, e.clientY);
            boardPos[0] |= 0;
            boardPos[1] |= 0;

            let [lastX, lastY] = boardPos;

            if (lastX === lastCord[0] && lastY === lastCord[1])
                return;

            // console.log(lastX, lastY, boardPos, lastCord)

            xInput.val(template.x -= lastCord[0] - lastX);
            yInput.val(template.y -= lastCord[1] - lastY);

            template.updatePosition();

            lastCord = boardPos;

            saveTemplate();
        }
        $(document).on('mousemove', mousemove);
        $(document).one('mouseup mouseleave', () => {
            $(document).off('mousemove', mousemove);
        })
    })
}

export function importTemplateFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const tUrl = urlParams.get('t_url');
    const tX = urlParams.get('t_x');
    const tY = urlParams.get('t_y');
    if (!tUrl || !tX || !tY) return

    urlInput.val(decodeURIComponent(tUrl));
    xInput.val(+tX);
    yInput.val(+tY);

    updateTemplate();
    removeAllSearchParams();
}

function removeAllSearchParams() {
    const url = new URL(window.location);
    url.search = '';
    window.history.replaceState(null, '', url);
}

export function shareTemplate() {
    const imgUrl = urlInput.val();
    const x = xInput.val();
    const y = yInput.val();

    const curUrl = location.origin + location.pathname;

    const importUrl = `${curUrl}?t_url=${encodeURIComponent(imgUrl)}&t_x=${x}&t_y=${y}`;

    chatInput.val(importUrl);
    chatInput.trigger('focus');

    // to trigger input events, such as white text color for links
    const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true
    });
    chatInput[0].dispatchEvent(inputEvent);
}

export async function showTemplates() {
    if (!me.registered) {
        return toastr.error('needs_login_to_use_templates');
    }
    const resp = await apiRequest('/template/list');

    const respData = await resp.json();
    if (respData.errors) return;

    templatesWindow(respData);
}

export function initTemplateMobileMove() {
    const moveBtn = $('#manualMoveBtn');

    let isMovingEnabled = false;

    let lastPressCord;
    // let pointerId;
    function mousedown(e) {
        if (!isMovingEnabled) return;

        lastPressCord = screenToBoardSpace(e.clientX, e.clientY).map(x => x |= 0);

        // sometimes mouseup's not emitted
        mouseup();

        globals.eventManager.on('mousemove', mousemove);
    }

    function mousemove(e) {
        if (e.gesture) return;

        const boardPos = screenToBoardSpace(e.clientX, e.clientY);
        boardPos[0] |= 0;
        boardPos[1] |= 0;

        let [lastX, lastY] = boardPos;

        if (lastX === lastPressCord[0] && lastY === lastPressCord[1])
            return;

        console.log({ lastX, lastY, boardPos, lastPressCord })

        xInput.val(template.x -= lastPressCord[0] - lastX);
        yInput.val(template.y -= lastPressCord[1] - lastY);

        template.updatePosition();

        lastPressCord = boardPos;

        saveTemplate();
    }

    function mouseup() {
        globals.eventManager.off('mousemove', mousemove);
    }

    globals.eventManager.on('mousedown', mousedown);
    globals.eventManager.on('mouseup', mouseup);

    moveBtn.on('click', () => {
        if (isMovingEnabled) {
            moveBtn.removeClass('active');
            // just to be sure
            mouseup();

            globals.toolManager.unblockToolChange();
            restoreTool();
        } else {
            moveBtn.addClass('active');
            saveAndResetTool();
            globals.toolManager.blockToolChange();
        }

        isMovingEnabled = !isMovingEnabled;
    });

    // workaround, because to just cancel events 
    // (to prevent tools doing their job during the placement) 
    // we need to rewrite whole eventManager
    let savedTool, savedColors;
    function saveAndResetTool() {
        savedTool = globals.toolManager.tool;
        savedColors = [player.color, player.secondCol];

        globals.toolManager.selectTool(globals.toolManager.tools['clicker']);
        player.resetColors();
    }

    function restoreTool() {
        globals.toolManager.selectTool(savedTool);
        [player.color, player.secondCol] = savedColors;
    }
}




export default template;