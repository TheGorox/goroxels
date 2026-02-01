import { initChat, initMobileChatToggle } from "./Chat";
import { initDraggableInputs } from "./draggableInputs";
import globals from "./globals";
import player from "./player";
import { importTemplateFromUrl, initHandlers, initTemplateMobileMove, initTemplateMoveByMouse, loadValues } from "./template";
import { initCoordsClick, initUISettings } from "./ui/config";
import { initPalette } from "./ui/palette";
import { initMobileMenuToggler } from "./ui/toggles";
import { initMenuResizer } from "./ui/config";
import { getLS, setLS } from "./utils/localStorage";
import { startWinampRadio } from "./winamp/player";
import { initButtons, initHelpButton, initOnlineViewer } from "./windows";
import { FX, FX_STATE } from "./fxcanvas";

import soundOnSvg from '../img/movie/SoundOn.svg';
import soundOffSvg from '../img/movie/SoundOff.svg';
import dimOnSvg from '../img/movie/BrightnessHigh.svg';
import dimOffSvg from '../img/movie/BrightnessHighFill.svg';
import { boardToScreenSpace } from "./utils/conversions";
import { mapRange } from "./utils/math";
import config from "../../../shared/config";
import { canvasId } from "./config";

export function initInputs() {
    loadValues();
    initHandlers();
    initButtons();
    initChat();
    initDraggableInputs();
}

export function initOtherCoolFeatures() {
    initTemplateMobileMove();

    importTemplateFromUrl();

    initTemplateMoveByMouse();
    // initModMenu();
    initMobileMenuToggler();
    initPalette();
    initUISettings();
    initMobileChatToggle();
    initHelpButton();
    player.init();
    initCoordsClick();
    initOnlineViewer();
    initMenuResizer();
    // show tooltip animation instead
    // showHelpIfFirstTime();
    startWinampRadio();

    initDraggableInputs();
    initHelpHint();

    initMovieShit();
}

function initModMenu() {
    initSliding();
    initSendAlerts();

    function initSliding() {
        $('#modMenu .title').on('click', e => {
            const m = $('#modMenu');
            if (m.data('state') === 'open') {
                m.data('state', 'close');
                m.css('right', '');
            } else {
                m.data('state', 'open');
                m.css('right', $('#modMenu .body').css('width'));
            }
        })
    }

    function initSendAlerts() {
        $('#sendAlerts').on('click', () => {
            const val = $('#sendAlertsText').val();
            if (val.length == 0 || val.length > 2000) return;

            $('#sendAlertsText').val('');
            globals.socket.sendAlert('all', val);
        })
    }
}

function initHelpHint() {
    if (getLS('helpHintShown', false) === '1') {
        return;
    }
    setLS('helpHintShown', '1', false);

    const infoHint = $(
        `<div style="position: absolute;
            border-radius: 50%;
            z-index: 999999;
            left: 50%;
            top: 50%;
            width: 30px;
            height: 30px;
            background-color: var(--primary);
            border: 3px solid var(--dark);
            display: flex;
            
            align-items: center;
            justify-content: center;">

            <span style="
                color: white;
                font-weight: bold;
                font-size: 20px;
            ">i</span>
        </div>`);
    infoHint.css('transform', 'scale(3)').css('border-spacing', '3px');

    document.body.appendChild(infoHint[0]);
    setTimeout(() => {
        infoHint.animate({
            'border-spacing': 1
        }, {
            duration: 200,
            step: (now, tween) => {
                infoHint.css('transform', `scale(${now})`);
            },
            complete: () => {
                infoHint.animate({
                    top: '-10%',
                    left: '-10%',
                    opacity: 0.5
                }, 1000, 'swing', () => infoHint.remove());
            }
        });
    }, 500);
}

function initMovieShit() {
    if (canvasId !== config.telek.canvas) return;

    function createSvgToggleButton({
        bounds,
        svgOnUrl,
        svgOffUrl,
        isEnabledRef,
        onToggle
    }) {
        let svgOn = null;
        let svgOff = null;
        let enabledAt = 0;

        loadSvgText(svgOnUrl).then(t => svgOn = t);
        loadSvgText(svgOffUrl).then(t => svgOff = t);

        function draw(ctx) {
            const svg = isEnabledRef() ? svgOn : svgOff;
            if (!svg) return FX_STATE.FINISHED;

            const rect = getIconBoardBounds(bounds);

            let fxState = FX_STATE.FINISHED;

            if (isEnabledRef()) {
                const passed = Date.now() - enabledAt;
                if (passed < 1000) fxState = FX_STATE.IN_PROCESS;

                ctx.globalAlpha =
                    passed < 1000
                        ? mapRange(1000 - passed, 0, 1000, 0.3, 1)
                        : 0.3;
            } else {
                ctx.globalAlpha = 1;
            }

            drawSvgOnCanvas(ctx, svg, rect, ctx.globalAlpha);
            ctx.globalAlpha = 1;

            return fxState;
        }

        function hitTest(cx, cy) {
            const rect = getIconBoardBounds(bounds);
            return isCursorUnderBounds(cx, cy, rect);
        }

        function toggle() {
            onToggle();
            if (isEnabledRef()) enabledAt = Date.now();
            globals.fxRenderer.needRender = true;
        }

        return {
            draw, hitTest, toggle,
            get enabledAt() { return enabledAt }
        };
    }

    let audioCreated = false;
    let audioEnabled = false;
    let audio = null;
    let lastAudioName = null;

    let dimEnabled = false;

    const origOnStringMessage = globals.socket.onStringMessage;

    globals.socket.onStringMessage = (msg) => {
        origOnStringMessage.call(globals.socket, msg);

        if (!audioEnabled) return;

        const msgParsed = JSON.parse(msg);

        if (msgParsed.c !== 'transmit' || msgParsed.data.code !== 'sync') return;

        const serverTime = msgParsed.data.payload.pts;
        const audioName = msgParsed.data.payload.name + '.mp3';

        if (!audioCreated || audioName !== lastAudioName) {
            audioCreated = true;
            lastAudioName = audioName;
            createMovieAudio(serverTime);
        } else {
            syncAudio(serverTime);
        }
    }

    function createMovieAudio(initialOffset = 0) {
        unloadAudio();

        audio = new Audio('/audio/' + lastAudioName);
        audio.currentTime = initialOffset;

        audio.play();
    }

    const MAX_RATE_DELTA = 0.005;
    let targetRate = 1;
    let currentRate = 1;
    function syncAudio(serverTime) {
        const myTime = audio.currentTime;
        const diff = serverTime - myTime;
        const diffAbs = Math.abs(diff);

        if (diffAbs > 5) {
            targetRate = 1;
            audio.currentTime = serverTime;
            audio.playbackRate = 1;
            return;
        }

        if (diffAbs > 0.05) {
            targetRate = 1 + clamp(diff * 0.1, -MAX_RATE_DELTA, MAX_RATE_DELTA);
        } else {
            targetRate = 1;
        }

        currentRate += (targetRate - currentRate) * 0.05;
        audio.playbackRate = currentRate;

        console.log('pbRate=' + audio.playbackRate);
    }

    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    // ---------- fx part
    async function loadSvgText(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch SVG: ${res.status}`);
        const svgText = await res.text();
        return svgText;
    }

    const svgCache = new Map();

    async function getSvgImage(svgString) {
        let record = svgCache.get(svgString);

        if (record) {
            // уже загружено или загружается
            await record.ready;
            return record.img;
        }

        const img = new Image();
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const ready = (async () => {
            img.src = url;
            await img.decode();
            URL.revokeObjectURL(url);
        })();

        svgCache.set(svgString, { img, ready });

        await ready;
        return img;
    }

    async function drawSvgOnCanvas(ctx, svgString, rect, alpha = 1) {
        try {
            const img = await getSvgImage(svgString);

            ctx.save();

            ctx.shadowColor = 'rgba(255,255,255,1)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            ctx.globalCompositeOperation = 'source-over';

            ctx.globalAlpha = alpha;
            ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height);

            ctx.restore();
        } catch (err) {
            console.error(err, svgString);
        }
    }


    const telekX = config.telek.x;
    const telekY = config.telek.y;
    const telekSize = config.telek.size;
    let soundIconBounds = new DOMRect(
        telekX + telekSize + 3,
        telekY,
        32, 32
    );
    let dimIconBounds = new DOMRect(
        telekX + telekSize + 2,
        telekY + 20,
        32, 32
    );
    const soundButton = createSvgToggleButton({
        bounds: soundIconBounds,
        svgOnUrl: soundOnSvg,
        svgOffUrl: soundOffSvg,
        isEnabledRef: () => audioEnabled,
        onToggle: toggleAudioState
    });

    const dimButton = createSvgToggleButton({
        bounds: dimIconBounds,
        svgOnUrl: dimOnSvg,
        svgOffUrl: dimOffSvg,
        isEnabledRef: () => dimEnabled,
        onToggle: toggleDim
    });

    function getIconBoardBounds(icon) {
        const [x, y] = boardToScreenSpace(icon.x, icon.y);
        return {
            x, y,
            width: icon.width,
            height: icon.height
        }
    }
    function getTelekBoardBounds() {
        const [x1, y1] = boardToScreenSpace(telekX, telekY, false);
        const [x2, y2] = boardToScreenSpace(telekX + telekSize, telekY + telekSize, false);

        return {
            x: Math.ceil(x1), y: Math.ceil(y1),
            width: x2 - x1 - 1,
            height: y2 - y1 - 1
        }
    }

    globals.fxRenderer.add(new FX(ctx => {
        let state = FX_STATE.FINISHED;

        state = Math.min(state, soundButton.draw(ctx));
        state = Math.min(state, dimButton.draw(ctx));

        if (dimEnabled) {
            const telekBounds = getTelekBoardBounds();

            const sinceEnabled = Date.now() - dimButton.enabledAt;
            const curOpacity = sinceEnabled > 1000 ? 1 : sinceEnabled / 1000;

            ctx.fillStyle = 'black';
            ctx.globalAlpha = mapRange(curOpacity, 0, 1, 0, 0.8);
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.clearRect(telekBounds.x, telekBounds.y, telekBounds.width, telekBounds.height);
            ctx.globalAlpha = 1;
        }

        return state;
    }), 2);

    document.addEventListener('pointerdown', e => {
        const cx = e.clientX;
        const cy = e.clientY;

        if (soundButton.hitTest(cx, cy) || dimButton.hitTest(cx, cy)) {
            player.suspendColors();
        }
    });

    document.addEventListener('pointerup', () => {
        setTimeout(() => player.restoreColors());
    });

    document.addEventListener('click', e => {
        const cx = e.clientX;
        const cy = e.clientY;

        if (soundButton.hitTest(cx, cy)) {
            e.preventDefault();
            e.stopPropagation();
            soundButton.toggle();
            return;
        }

        if (dimButton.hitTest(cx, cy)) {
            e.preventDefault();
            e.stopPropagation();
            dimButton.toggle();
        }
    });

    function isCursorUnderBounds(cx, cy, bounds) {
        return (cx >= bounds.x && cx < bounds.x + bounds.width &&
            cy >= bounds.y && cy < bounds.y + bounds.height)
    }

    function unloadAudio() {
        if (audio) {
            audio.pause();
            audio.src = '';
            audio.load();
            audio.currentTime = 0;

            audio = null;
        }
    }

    function toggleAudioState() {
        audioEnabled = !audioEnabled;
        if (!audioEnabled) {
            unloadAudio();
            audioCreated = false;
        }

        globals.fxRenderer.needRender = true;
    }

    function toggleDim() {
        dimEnabled = !dimEnabled;

        globals.fxRenderer.needRender = true;
    }
}