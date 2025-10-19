import { getLS, setLS } from '../utils/localStorage';
import { loadImage } from '../utils/misc';
import globals from '../globals';
import { boardToScreenSpace, screenToBoardSpace } from '../utils/conversions';
import { FX } from '../fxcanvas';
import { clamp, mapRange } from '../utils/math';
import camera from '../camera';
import player from '../player';

import winampFontPng from '../../font/pixel/winamp.png';
import winampFontDesc from '../../font/pixel/winamp.txt';
import { PixelFont } from '../tools';

import startBtnImg from '../../img/winamp/enableRadioBtn.png';
import { apiRequest } from '../utils/api';


async function importMaterials() {
    require.context('../../img/winamp', false, /\.png$/)
    const images = {
        bg: await import('../../img/winamp/bg2.png'),
        hrSlider: await import('../../img/winamp/hr-slider-btn-small.png'),
        hrSliderBig: await import('../../img/winamp/slider-btn.png'),
        digits: await import('../../img/winamp/digits.png'),
    }

    const wFont = new PixelFont(winampFontPng, winampFontDesc);
    await wFont.load();

    return {
        images,
        fonts: {
            winamp: wFont
        }
    }
}

class UIRect {
    constructor(x, y, w, h) {
        Object.assign(this, {
            x, y, w, h
        });
    }
}

let tempColors;
function preserveColors() {
    tempColors = [player.color, player.secondCol];

    player.switchColor(-1);
    player.switchSecondColor(-1);
}
function restoreColors() {
    player.switchColor(tempColors[0]);
    player.switchSecondColor(tempColors[1]);
}

export function initRadio() {
    const player = new WinampPlayer();
    player.init();
    window.wPlayer = player;
}

let documentClicked = false, onDocumentClickCallbacks = [];
document.addEventListener('click', () => {
    documentClicked = true;

    onDocumentClickCallbacks.forEach(cb => cb());
    onDocumentClickCallbacks.length = 0;
})

export async function createRadioStarterBtn() {
    const btnImg = await loadImage(startBtnImg);
    const bW = btnImg.width;
    const bH = btnImg.height;

    const bX = -btnImg.width - 5;
    const bY = 0;

    function renderBtn(ctx) {
        const z = camera.zoom;
        const [canvasX, canvasY] = boardToScreenSpace(bX, bY);

        if (this.needRender)
            this.redraw();

        ctx.save();
        ctx.scale(z, z);
        ctx.drawImage(btnImg, canvasX / z, canvasY / z);
        ctx.restore();

        return 1;
    }

    let btnFx = new FX(renderBtn);
    globals.fxRenderer.add(btnFx, 2);

    let mousedownAt = 0, listeners = [];
    function onMousedown(e) {
        const boardPos = screenToBoardSpace(e.clientX, e.clientY);
        if (checkIsButtonPos(...boardPos)) {
            mousedownAt = Date.now();
        }
    }

    async function onMouseup(e) {
        const boardPos = screenToBoardSpace(e.clientX, e.clientY);
        if (checkIsButtonPos(...boardPos)) {
            if (Date.now() - mousedownAt < 500) {
                await onBtnClick();
            }
        }
    }

    globals.eventManager.on('mousedown', onMousedown);
    globals.eventManager.on('mouseup', onMouseup);

    listeners.push(['mousedown', onMousedown]);
    listeners.push(['mouseup', onMouseup]);

    function removeBtn() {
        if (btnFx) {
            globals.fxRenderer.remove(btnFx);
            btnFx = null;
        }
        for (const [ev, fn] of listeners) {
            globals.eventManager.off(ev, fn);
        }
        listeners = [];
    }

    async function onBtnClick() {
        removeBtn();

        initRadio();
    }

    function checkIsButtonPos(x, y) {
        return x >= bX && x < bX + bW && y >= bY && y < bY + bH;
    }
}

class WinampPlayer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.playerPosition = JSON.parse(getLS('winamp.position', true) || '[-275,0]');
        this.sndBalance = 0; // -1; 1
        this.volumeLvl = +(getLS('winamp.volume', true) || '0.5'); // 0; 1

        this.queue = null;
        this.currentTrack = null;

        this.images = null;
        this.needRender = true;

        this.startPolling();

        this.config = {
            width: 275,
            height: 348,
            headerRect: new UIRect(2, 2, 262, 12),
            closeBtnRect: new UIRect(265, 4, 7, 7),
            volumeBoundsRect: new UIRect(108, 61, 63, 4),
            soundBalanceBoundsRect: new UIRect(178, 61, 35, 4),
            volumeSliderRect: new UIRect(-1, -1, -1, -1),
            balanceSliderRect: new UIRect(-1, -1, -1, -1),
            titleRect: new UIRect(111, 24, 155, 12),
            kbpsRect: new UIRect(111, 41, 16, 10),
            khzRect: new UIRect(156, 41, 11, 10),
            mm1Rect: new UIRect(48, 26, 9, 13),
            mm2Rect: new UIRect(60, 26, 9, 13),
            ss1Rect: new UIRect(78, 26, 9, 13),
            ss2Rect: new UIRect(90, 26, 9, 13),
            progressSliderBndRect: new UIRect(16, 72, 249, 10),
            queueBoxRect: new UIRect(18, 257, 238, 48)
        }

        this._cache = {};
        this._holdingButton = null;
        this._lastHoldPos = null;
        this._destroyed = false;
        this.noFeed = false;
        this.title = null;
        this.visibleTitle = null;

        this._boundHandlers = {};
        this._socketHandlers = {};
    }

    addAudioStoppedListeners() {
        this.audio.addEventListener("pause", () => {
            // controls are disabled, but you can still
            // press "pause/play" button and it will stop
            // the player. this is not good because the 
            // whole radio will be screwed
            if (!this.audio._destroyed) {
                this.audio.play().catch(err => {
                    console.warn("Resume blocked until user interaction:", err);
                });
            }
        });

        this.audio.addEventListener("stalled", () => {
            console.warn("Stream stalled");
            this.restartStream();
        });

        this.audio.addEventListener("error", (e) => {
            console.error("Audio error", e);
            this.restartStream();
        });

        this.audio.addEventListener("ended", () => {
            console.warn("Stream ended");
            this.restartStream();
        });
    }

    async init() {
        setLS('radioLover', '1');

        await this.loadMaterials();
        this.recalculateButtons();
        this.initTouchControls();
        this.setTitle('Goroxels Radio 1.0 alpha');

        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;

        this._fx = new FX(this.render.bind(this));
        globals.fxRenderer.add(this._fx, 2);

        await this.updateSong();
        this.startPolling();

        // socket handlers
        this._socketHandlers.radio = (type) => {
            switch (type) {
                case 0: this.updateSong(); break;
                case 1: this.updateQueue(); break;
            }
        };
        this._socketHandlers.opened = () => {
            this.updateSong();
        };

        globals.socket.on('radio', this._socketHandlers.radio);
        globals.socket.on('opened', this._socketHandlers.opened);

        this.ackRender();
        this.initAutoRender();
    }

    volume(val) {
        this.volumeLvl = val;
        this.gainNode.gain.value = val;
        setLS('winamp.volume', val.toString(), true);
    }

    balance(val) {
        this.sndBalance = val;
        this.pannerNode.pan.value = val;
    }


    initAutoRender() {
        setInterval(() => this.ackRender(), 1000);
    }

    initTouchControls() {
        const self = this;

        function mousedown(e) {
            if (self._holdingButton) mouseup(e);
            let obj = self.getObjectAtPosition(e.clientX, e.clientY);
            if (obj) {
                preserveColors();
                camera.disableMove();
                self.onObjMousedown.call(self, obj, e);
                self._lastHoldPos = screenToBoardSpace(e.clientX, e.clientY);
            }
        }
        function mouseup(e) {
            self._lastHoldPos = null;
            camera.enableMove();
            if (self._holdingButton) {
                self.onObjMouseup.call(self, self._holdingButton, e);
                self._holdingButton = false;
                setTimeout(restoreColors);
            }
        }
        function mousemove(e) {
            if (self._holdingButton) {
                self.onObjMousemove.call(self, self._holdingButton, e);
                self._lastHoldPos = screenToBoardSpace(e.clientX, e.clientY);
            }
        }

        this._boundHandlers.mousedown = (e) => {
            if (this._destroyed) return;
            if (e.gesture) return mouseup(e);
            mousedown(e);
        };
        this._boundHandlers.mouseup = (e) => {
            if (this._destroyed) return;
            mouseup(e);
        };
        this._boundHandlers.mousemove = (e) => {
            if (this._destroyed) return;
            if (e.gesture) return;
            mousemove(e);
        };

        globals.eventManager.on('mousedown', this._boundHandlers.mousedown);
        globals.eventManager.on('mouseup', this._boundHandlers.mouseup);
        globals.eventManager.on('mousemove', this._boundHandlers.mousemove);
    }

    close() {
        setLS('radioLover', '0');

        if (this.audio) {
            this.audio._destroyed = true;
            this.audio.pause();
            this.audio.src = "";
            this.audio.remove();
        }

        if (this.audioCtx) {
            this.audioCtx.close();
        }

        clearTimeout(this.__pollTimeout);
        clearInterval(this._titleRollerInterval);
        globals.fxRenderer.remove(this._fx);

        // remove eventManager handlers
        if (this._boundHandlers) {
            globals.eventManager.off('mousedown', this._boundHandlers.mousedown);
            globals.eventManager.off('mouseup', this._boundHandlers.mouseup);
            globals.eventManager.off('mousemove', this._boundHandlers.mousemove);
            this._boundHandlers = {};
        }

        // remove socket handlers
        if (this._socketHandlers) {
            globals.socket.off('radio', this._socketHandlers.radio);
            globals.socket.off('opened', this._socketHandlers.opened);
            this._socketHandlers = {};
        }

        this._destroyed = true;


        createRadioStarterBtn();
    }

    getObjectAtPosition(screenX, screenY) {
        const objsToCheck = [
            this.config.headerRect,
            this.config.closeBtnRect,
            this.config.volumeSliderRect,
            this.config.balanceSliderRect,
        ];

        const [boardX, boardY] = screenToBoardSpace(screenX, screenY);
        const [playerX, playerY] = this.getRelPos(boardX, boardY);

        for (let obj of objsToCheck) {
            if (playerX >= obj.x && playerX < obj.x + obj.w &&
                playerY >= obj.y && playerY < obj.y + obj.h) {
                return obj;
            }
        }
    }

    onObjMousedown(obj) {
        this._holdingButton = obj;
    }
    onObjMouseup(obj, e) {
        switch (obj) {
            case this.config.closeBtnRect: {
                if (this.getObjectAtPosition(e.clientX, e.clientY) === this.config.closeBtnRect) {
                    this.close();
                }
            }
        }
    }
    onObjMousemove(obj, e) {
        const [movX, movY] = this.calcMovement(e);

        switch (obj) {
            case this.config.headerRect: {
                this.playerPosition[0] += movX;
                this.playerPosition[1] += movY;

                setLS('winamp.position', JSON.stringify(this.playerPosition), true);

                this.ackRender();

                break;
            }
            case this.config.volumeSliderRect: {
                const [relX] = this.getRelPos(...screenToBoardSpace(e.clientX, e.clientY));

                const bndRect = this.config.volumeBoundsRect;
                const sliderImg = this.images.hrSlider;

                const [clampedX, clampedY] = this.clampHrSliderPos(relX, bndRect, sliderImg);

                this.config.volumeSliderRect.x = clampedX;
                this.config.volumeSliderRect.y = clampedY;

                const newValue = this.mapHrSliderPos(clampedX, bndRect, sliderImg, 0, 1);
                this.volume(newValue);

                this.ackRender();

                break;
            }

            case this.config.balanceSliderRect: {
                const [relX] = this.getRelPos(...screenToBoardSpace(e.clientX, e.clientY));

                const bndRect = this.config.soundBalanceBoundsRect;
                const sliderImg = this.images.hrSlider;

                const [clampedX, clampedY] = this.clampHrSliderPos(relX, bndRect, sliderImg);

                this.config.balanceSliderRect.x = clampedX;
                this.config.balanceSliderRect.y = clampedY;

                const newValue = this.mapHrSliderPos(clampedX, bndRect, sliderImg, -1, 1);
                this.balance(newValue);

                this.ackRender();

                break;
            }
        }
    }

    // clamp mouse position to slider bounds
    clampHrSliderPos(relX, bndRect, sliderImg) {
        // center the slider to the mouse pos
        relX -= sliderImg.width / 2;

        const clampX = clamp(relX, bndRect.x, bndRect.x + bndRect.w - sliderImg.width);
        const constY = bndRect.y + (bndRect.h / 2) - (sliderImg.height / 2) + 1;

        return [clampX | 0, constY | 0];
    }

    // convert slider position to output value
    mapHrSliderPos(posX, bndRect, sliderImg, minValue, maxValue) {
        const minPosX = bndRect.x;
        const maxPosX = bndRect.x + bndRect.w - sliderImg.width;

        const mappedVal = mapRange(posX, minPosX, maxPosX, minValue, maxValue);
        return mappedVal;
    }

    // convert value to position
    reverseMapHrSliderPos(value, bndRect, sliderImg, minValue, maxValue) {
        const minPosX = bndRect.x;
        const maxPosX = bndRect.x + bndRect.w - sliderImg.width;

        const mappedPosX = mapRange(value, minValue, maxValue, minPosX, maxPosX);
        return mappedPosX | 0;
    }

    // convert global board position to local canvas position
    getRelPos(boardX, boardY) {
        const playerX = boardX - this.playerPosition[0];
        const playerY = boardY - this.playerPosition[1];

        return [playerX, playerY];
    }

    // getHrSliderPos(minX, maxX, )

    calcMovement(e) {
        if (!this._lastHoldPos) {
            return null;
        }

        const curBoardPos = screenToBoardSpace(e.clientX, e.clientY);

        const diffX = curBoardPos[0] - this._lastHoldPos[0];
        const diffY = curBoardPos[1] - this._lastHoldPos[1];

        return [diffX, diffY];
    }

    async loadMaterials() {
        const {
            images: urlsObj,
            fonts
        } = await importMaterials();

        const imgObj = {};
        for (let key of Object.keys(urlsObj)) {
            let url = urlsObj[key].default;

            imgObj[key] = await loadImage(url);
        }

        this.images = imgObj;
        this.fonts = fonts;
    }

    ackRender() {
        this.needRender = true;
        globals.fxRenderer.requestRender();
    }

    render(ctx) {
        if (this._destroyed) return 2;

        const [x, y] = boardToScreenSpace(this.playerPosition[0], this.playerPosition[1]);
        const z = camera.zoom;

        if (this.needRender)
            this.redraw();

        ctx.save();
        ctx.scale(z, z);
        ctx.drawImage(this.canvas, x / z, y / z);
        ctx.restore();

        return 1
    }

    generateQueueText() {
        if (!this.queue) return '';

        const queue = [
            ...this.queue.queue,
            ...this.queue.defaultQueue
        ].slice(0, 7);

        const str = queue.map(s => {
            let title = cutTextToWidth(s.title, 190);
            return `${s.id ?? 'x'}. ${title} <${s.duration / 60 | 0}:${pad2(s.duration % 60 | 0)}>`

            function cutTextToWidth(text, maxWidth) {
                let curWidth = 0;
                let curText = '';
                for (const ch of text) {
                    // every dot is 3px wide
                    if (curWidth >= maxWidth - 9) {
                        curText += '...';
                        break;
                    }

                    if (ch === ' ' || /[А-я]/.test(ch)) curWidth += 5;
                    else if (/[A-z]/.test(ch)) curWidth += 4;
                    else if (ch === '.') curWidth += 2;
                    else curWidth += 4;

                    curWidth += 1;

                    curText += ch;
                }

                return curText;
            }
        }).join('\n');

        return str;
    }

    redraw() {
        this.needRender = false;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.images.bg, 0, 0);
        this.ctx.drawImage(this.images.hrSlider, this.config.volumeSliderRect.x, this.config.volumeSliderRect.y);
        this.ctx.drawImage(this.images.hrSlider, this.config.balanceSliderRect.x, this.config.balanceSliderRect.y);

        this.drawTextInInput(this.title, this.config.titleRect, '#00E200');

        if (this.currentTrack) {
            const kbps = (2 * 2 * this.currentTrack.sampleRate) / 1000 | 0; // channels*sampleSize(16bit=2byte)*sampleRate
            const khz = this.currentTrack.sampleRate / 1000 | 0;

            this.drawTextInInput(kbps.toString(), this.config.kbpsRect, '#00E200');
            this.drawTextInInput(khz.toString(), this.config.khzRect, '#00E200');

            const sPassed = (Date.now() - this.currentTrack.startedAt) / 1000;

            const mmPassed = pad2((sPassed / 60 | 0).toString());
            const ssPassed = pad2((sPassed % 60 | 0).toString());

            this.drawBigDigit(this.config.mm1Rect, mmPassed[0]);
            this.drawBigDigit(this.config.mm2Rect, mmPassed[1]);
            this.drawBigDigit(this.config.ss1Rect, ssPassed[0]);
            this.drawBigDigit(this.config.ss2Rect, ssPassed[1]);

            const progressPosX = this.reverseMapHrSliderPos(sPassed, this.config.progressSliderBndRect, this.images.hrSliderBig, 0, this.currentTrack.duration);
            const progressPosY = this.config.progressSliderBndRect.y;

            this.ctx.drawImage(this.images.hrSliderBig, progressPosX, progressPosY);
        }

        // this shit eats a lot of cpu
        const queueText = this.generateQueueText();
        if (queueText && queueText !== this._cache.queueText) {
            const qTextImg = this.fonts.winamp.drawText(queueText, '#00E200');
            if (qTextImg) {
                this._cache.queueTextImg = qTextImg;
                this._cache.queueText = queueText;
                this.ctx.drawImage(qTextImg, this.config.queueBoxRect.x, this.config.queueBoxRect.y);
            }
        } else if (queueText) {
            this.ctx.drawImage(this._cache.queueTextImg, this.config.queueBoxRect.x, this.config.queueBoxRect.y);
        }
    }

    drawBigDigit(rect, number) {
        const digitW = rect.w;
        this.ctx.drawImage(this.images.digits, digitW * number, 0, rect.w, rect.h, rect.x, rect.y, rect.w, rect.h);
    }

    drawTextInInput(text, inputRect, color) {
        const drawnText = this.fonts.winamp.drawText(text, color);
        this.ctx.drawImage(drawnText, 0, 0, inputRect.w, drawnText.height, inputRect.x, ((inputRect.y + inputRect.h / 2) - drawnText.height / 2) | 0, inputRect.w, drawnText.height);
    }

    recalculateButtons() {
        const smallSliderWidth = this.images.hrSlider.width;
        const smallSliderHeight = this.images.hrSlider.height;

        const volRect = this.config.volumeBoundsRect;
        const volSliderX = mapRange(this.volumeLvl, 0, 1, volRect.x, (volRect.x + volRect.w) - smallSliderWidth);
        const volSliderY = ((volRect.y + volRect.h / 2) - smallSliderHeight / 2) + 1

        this.config.volumeSliderRect.x = volSliderX | 0;
        this.config.volumeSliderRect.y = volSliderY | 0;
        this.config.volumeSliderRect.w = smallSliderWidth;
        this.config.volumeSliderRect.h = smallSliderHeight;

        const balRect = this.config.soundBalanceBoundsRect;
        const balSliderX = mapRange(this.sndBalance, -1, 1, balRect.x, (balRect.x + balRect.w) - smallSliderWidth);
        const balSliderY = ((balRect.y + balRect.h / 2) - smallSliderHeight / 2) + 1

        this.config.balanceSliderRect.x = balSliderX | 0;
        this.config.balanceSliderRect.y = balSliderY | 0;
        this.config.balanceSliderRect.w = smallSliderWidth;
        this.config.balanceSliderRect.h = smallSliderHeight;
    }

    initAudioChain() {
        if (!this.audioCtx || this.audioCtx.state === "closed") {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.value = this.volumeLvl;

        this.pannerNode = this.audioCtx.createStereoPanner();
        this.pannerNode.pan.value = this.sndBalance;

        if (this.audio) {
            try { this.audio._destroyed = true; } catch { }
            try { this.audio.pause(); } catch { }
            try { this.audio.remove(); } catch { }
        }

        this.audio = document.createElement("audio");
        this.audio.autoplay = true;
        this.audio.controls = false;
        this.audio._destroyed = false;

        this.addAudioStoppedListeners();

        const srcNode = this.audioCtx.createMediaElementSource(this.audio);
        srcNode.connect(this.gainNode).connect(this.pannerNode).connect(this.audioCtx.destination);
    }

    async startStream() {
        if (this._destroyed) return;
        if (this._streaming) return;

        this._streaming = true;

        const startFn = () => {
            try {
                if (!this.audio || this.audio._destroyed) {
                    this.initAudioChain();
                }

                this.audio.src = `${location.protocol}//${location.hostname}/api/radio/stream`;
                this.audio.autoplay = true;

                const playPromise = this.audio.play();
                if (playPromise) {
                    playPromise.catch(err => console.warn("Playback blocked until user interaction:", err));
                }
            } catch (err) {
                console.error("Failed to start stream:", err);
                this._streaming = false;

                if (!this._destroyed) {
                    setTimeout(() => this.startStream(), 5000);
                }
            }
        };

        if (!documentClicked) {
            onDocumentClickCallbacks.push(startFn);
        } else {
            startFn();
        }
    }

    async restartStream() {
        if (this._destroyed) return;
        this._streaming = false;
        console.info("Restarting radio stream...");
        await this.startStream();
    }

    async startPolling() {
        if (this._destroyed) return;
        await this.startStream();
    }


    async updateSong() {
        if (this._destroyed) return;

        this.noFeed = true;

        const song = await this.fetchCurTrack();

        this.currentTrack = song;

        const curTrackMins = song.duration / 60 | 0;
        const curTrackSecs = song.duration % 60 | 0;
        this.setTitle(this.currentTrack.title + ` <${curTrackMins}:${pad2(curTrackSecs)}>`);


        this.noFeed = false;

        this.ackRender();

        this.updateQueue().then(() => this.ackRender());
    }

    async updateQueue() {
        const queue = await this.fetchQueue();
        if (!queue) return;

        this.queue = queue;
        this.ackRender();
    }

    async fetchCurTrack() {
        const resp = await apiRequest('/radio/current-song');
        const json = await resp.json();
        if (!json.success) {
            // toastr.error('cannot fetch current song! reload the page.');
            return
        }

        return json.song;
    }

    async fetchQueue() {
        const resp = await apiRequest('/radio/get-queue');
        const json = await resp.json();
        if (!json.success) {
            // toastr.warn('cannot fetch song queue');
            return
        }

        return json.queues;
    }

    setTitle(title) {
        this._titleSet = Date.now();

        this.title = title;

        clearInterval(this._titleRollerInterval)

        // roll only if it exceeds input width
        if (this.fonts.winamp.measureText(this.title).width > this.config.titleRect.w) {
            this._titleRollerInterval = setInterval(() => {
                // rotate title by 1 char
                const titleArr = this.title.split('');
                titleArr.push(titleArr.shift());

                this.title = titleArr.join('');
                this.ackRender();
            }, 300);
        }
    }
}


function pad2(num) {
    return num.toString().padStart(2, '0');
}

export function startWinampRadio() {
    if (getLS('radioLover') === '1') {
        initRadio();
    } else {
        createRadioStarterBtn();
    }

}



export default WinampPlayer