import _ from './assets';

import Socket from './Socket';
import globals from './globals';
import ChunkManager from './ChunkManager';
import Renderer from './Renderer';
import { FXRenderer } from './fxcanvas';
import player, { updateMe } from './player';
import ToolManager from './ToolManager';
import { calculateColumnSize, initHalfmap } from './utils/misc';

import * as config from './config';
import { init as initTranslate, translate } from './translate';
import camera from './camera';
import { Modal } from './Window';
import { getLS, setLS } from './utils/localStorage';
import * as indexedDb from './indexedDb';
import { initInputs, initOtherCoolFeatures } from './init';
import { toggleTopMenu } from './ui/toggles';
import { fixColorsWidth } from './ui/config';
import { fixChatPosition } from './Chat';

(async () => {    
    indexedDb.init();
    await config.download();

    const {
        elements,
    } = globals;

    window.onresize = () => {
        elements.mainCanvas.width = window.innerWidth;
        elements.mainCanvas.height = window.innerHeight;

        elements.fxCanvas.width = window.innerWidth;
        elements.fxCanvas.height = window.innerHeight;

        const fxCtx = elements.fxCanvas.getContext('2d');

        ctx.imageSmoothingEnabled = fxCtx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = fxCtx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = fxCtx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = fxCtx.msImageSmoothingEnabled = false;
        ctx.oImageSmoothingEnabled = fxCtx.oImageSmoothingEnabled = false;

        renderer.needRender = true;
        fxRenderer.needRender = true;

        if (!globals.mobile) {
            calculateColumnSize();
        }

        fixColorsWidth();
        fixChatPosition();
    }


    window.oncontextmenu = function (e) {
        if (e.target === globals.elements.mainCanvas ||
            e.target.classList[0] === 'paletteColor' ||
            (e.path && e.path[1].classList[0] === 'paletteColor')) {
            e.preventDefault();
        }
    }

    camera.init();
    initHalfmap();

    config.palette.forEach((color, id) => {
        const el = document.createElement('div');
        el.style.backgroundColor = `rgb(${color.join(',')})`;
        // el.classList = ['paletteColor ' + (isDarkColor(...color) ? 'dark' : 'light')];
        el.classList = ['paletteColor light'];
        el.id = 'col' + id;

        // detect long press
        let downtime = 0;

        var $el = $(el);

        $el.on('pointerdown', () => {
            downtime = Date.now();
        })

        $el.on('pointerleave', () => {
            downtime = 0;
        })

        el.onclick = e => {
            let isLong = false;
            if (downtime != 0) {
                if (Date.now() - downtime > 700) {
                    isLong = true;
                }
                downtime = 0;
            }

            let f = isLong ? player.switchSecondColor : player.switchColor;
            f.call(player, id);
        }

        el.oncontextmenu = () => {
            // right button click
            player.switchSecondColor(id);
        }

        elements.palette.appendChild(el);
    })

    const ctx = elements.mainCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const wsPort = location.protocol === 'https:' ? 443 : (location.port || 80);
    const socket = new Socket(wsPort);
    globals.socket = socket;

    const chunkManager = new ChunkManager();
    globals.chunkManager = chunkManager;

    const renderer = window.renderer = new Renderer(ctx);
    globals.renderer = renderer;

    const fxRenderer = new FXRenderer();
    globals.fxRenderer = fxRenderer;

    globals.toolManager = new ToolManager(document.getElementById('board'));

    globals.player = player;

    const renderLoop = () => {
        requestAnimationFrame(() => {
            renderer.requestRender();
            renderLoop();
        })
    }
    renderLoop();

    window.onresize();

    socket.on('opened', () => { });
    socket.on('online', count => {
        $('.online').text(count);
    });
    socket.on('closed', () => {
        $('.online').text('offline');
    })

    window.globals = globals;

    // create nsfw modal
    config.callOnLoad(() => {
        if (config.canvasName !== 'nsfw') return;
        if (getLS('modal18') == 'accepted') return;

        const m = new Modal;
        m.init();
        const mBody = $(
            `<div style="margin:0;padding:5px;text-align:center;">
                <h1>${translate('WARNING')}</h1>
                <p>${translate('This canvas may contain illustrations, inappropriate for people under age of 18, including:')}
                <br>${translate('Gore, furry, porn, hate, anime and all possible variations of these.')}</p>
                <p><b>${translate('Are you 18 y.o. and fully understanding what are you doing?')}</b></p>
                <button style="padding: 8px;">${translate('I am 18 years old and I take responsibility for my psyche on myself')}</button>
            </div>`)
        m.contEl.appendChild(mBody[0]);

        $('button', mBody).on('click', () => {
            m.close();
            setLS('modal18', 'accepted');
        });
    });

    updateMe();
    initTranslate();
    initInputs();
    initOtherCoolFeatures();
    // now hides by default
    if(globals.mobile)
        toggleTopMenu();
})();