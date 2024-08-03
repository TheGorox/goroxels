import PcmPlayer from './PcmPlayer';
import { getLS, setLS } from '../utils/localStorage';
import { loadImage } from '../utils/misc';
import globals from '../globals';
import { boardToScreenSpace, screenToBoardSpace } from '../utils/conversions';
import { FX } from '../fxcanvas';
import { clamp, map } from '../utils/math';
import camera from '../camera';
import player from '../player';
import { apiRequest } from '../actions';

import winampFontPng from '../../font/pixel/winamp.png';
import winampFontDesc from '../../font/pixel/winamp.txt';
import { PixelFont } from '../tools';


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

class WinampPlayer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.playerPosition = JSON.parse(getLS('winamp.position', true) || '[0,0]');
        this.sndBalance = 0; // -1; 1
        this.volumeLvl = +(getLS('winamp.volume', true) || '0.001'); // 0; 1

        this.queue = null;
        this.currentTrack = null;

        this.images = null;
        this.needRender = true;

        this.pcmPlayer = null;

        this.config = {
            width: 275,
            height: 348,

            headerRect: new UIRect(2, 2, 262, 12),
            closeBtnRect: new UIRect(265, 4, 7, 7),
            volumeBoundsRect: new UIRect(108, 61, 63, 4),
            soundBalanceBoundsRect: new UIRect(178, 61, 35, 4),

            // needs calculation
            volumeSliderRect: new UIRect(-1, -1, -1, -1),
            balanceSliderRect: new UIRect(-1, -1, -1, -1),

            titleRect: new UIRect(111, 24, 155, 12),

            kbpsRect: new UIRect(111, 41, 16, 10),
            khzRect: new UIRect(156, 41, 11, 10),

            // big mm:ss clock
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
    }

    rebuildPcmPlayer(sampleRate) {
        if (this.pcmPlayer) {
            this.pcmPlayer.destroy();
        }

        this.pcmPlayer = new PcmPlayer({
            inputCodec: 'Int16',
            channels: 2,
            sampleRate,
            flushTime: 2000
        })

        this.pcmPlayer.volume(this.volumeLvl);
        this.pcmPlayer.balance(this.sndBalance);
    }

    async init() {
        await this.loadMaterials();
        this.recalculateButtons();
        this.initTouchControls();

        this.setTitle('Goroxels Radio 1.0 alpha');

        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;

        globals.fxRenderer.add(new FX(this.render.bind(this)), 2);

        await this.updateSong();
        await this.updateQueue();
        this.startPolling();

        globals.socket.on('radio', type => {
            switch(type){
                case 0:
                    this.updateSong();
                case 1:
                    this.updateQueue();
            }
        });

        globals.socket.on('opened', () => {
            this.updateSong();
            this.updateQueue();
        })

        this.ackRender();
        this.initAutoRender();
    }

    initAutoRender() {
        setInterval(() => {
            this.ackRender();
        }, 1000);
    }

    initTouchControls() {
        globals.eventManager.on('mousedown', e => {
            if(this._destroyed) return;

            if (e.gesture) return mouseup(e);

            mousedown(e);
        });
        globals.eventManager.on('mouseup', e => {
            if(this._destroyed) return;

            mouseup(e);
        });
        globals.eventManager.on('mousemove', e => {
            if(this._destroyed) return;

            if (e.gesture) return;

            mousemove(e);
        });

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
        switch(obj){
            case this.config.closeBtnRect: {
                if(this.getObjectAtPosition(e.clientX, e.clientY) === this.config.closeBtnRect){
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
                this.volumeLvl = newValue;

                this.pcmPlayer.volume(this.volumeLvl);

                setLS('winamp.volume', this.volumeLvl.toString(), true);

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
                this.sndBalance = newValue;

                this.pcmPlayer.balance(this.sndBalance);

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

        const mappedVal = map(posX, minPosX, maxPosX, minValue, maxValue);
        return mappedVal;
    }

    // convert value to position
    reverseMapHrSliderPos(value, bndRect, sliderImg, minValue, maxValue) {
        const minPosX = bndRect.x;
        const maxPosX = bndRect.x + bndRect.w - sliderImg.width;

        const mappedPosX = map(value, minValue, maxValue, minPosX, maxPosX);
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
        if(this._destroyed) return 2;

        const [x, y] = boardToScreenSpace(this.playerPosition[0], this.playerPosition[1]);
        const z = camera.zoom;

        if(this.needRender)
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
            let title = s.title;
            if(title.length > 42){
                title = title.slice(0, 42-3) + '...';
            }
            return `${s.id}. ${title} <${s.duration / 60 | 0}:${pad2(s.duration % 60 | 0)}>`
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
        if(queueText && queueText !== this._cache.queueText){
            const qTextImg = this.fonts.winamp.drawText(queueText, '#00E200');
            if(qTextImg){
                this._cache.queueTextImg = qTextImg;
                this._cache.queueText = queueText;
                this.ctx.drawImage(qTextImg, this.config.queueBoxRect.x, this.config.queueBoxRect.y);
            }
        }else if(queueText){
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
        const volSliderX = map(this.volumeLvl, 0, 1, volRect.x, (volRect.x + volRect.w) - smallSliderWidth);
        const volSliderY = ((volRect.y + volRect.h / 2) - smallSliderHeight / 2) + 1

        this.config.volumeSliderRect.x = volSliderX | 0;
        this.config.volumeSliderRect.y = volSliderY | 0;
        this.config.volumeSliderRect.w = smallSliderWidth;
        this.config.volumeSliderRect.h = smallSliderHeight;

        const balRect = this.config.soundBalanceBoundsRect;
        const balSliderX = map(this.sndBalance, -1, 1, balRect.x, (balRect.x + balRect.w) - smallSliderWidth);
        const balSliderY = ((balRect.y + balRect.h / 2) - smallSliderHeight / 2) + 1

        this.config.balanceSliderRect.x = balSliderX | 0;
        this.config.balanceSliderRect.y = balSliderY | 0;
        this.config.balanceSliderRect.w = smallSliderWidth;
        this.config.balanceSliderRect.h = smallSliderHeight;
    }

    close() {
        this.pcmPlayer.destroy();

        clearTimeout(this.__pollTimeout);
        clearInterval(this._titleRollerInterval);


        this._destroyed = true;
    }

    async startPolling() {
        try {
            const aborter = new AbortController();

            const resp = await fetch(`${location.protocol}//${location.hostname}/api/radio/stream`, {
                signal: aborter.signal
            });
            const reader = resp.body.getReader();

            let acc = new Uint8Array();

            while (1) {
                if(this._destroyed) {
                    aborter.abort('destroy');
                };
                const { done, value } = await reader.read();
                if (done) break;

                // this fuck sometimes causes an error like "new Uint16array length should divide by 2 bla bla bla"
                // i guess this is because of transmission issues, so let's workaround
                if(value.length % 2 !== 0 || acc.length > 0){
                    acc = joinByteArrays(acc, value);

                    if(acc.length % 2 == 0){
                        this.feed(acc.subarray());
                        acc = new Uint8Array();
                    }
                }else{
                    this.feed(value)
                }
            }

            function joinByteArrays(arr1, arr2){
                const mergedArray = new Uint8Array(arr1.length + arr2.length);
                mergedArray.set(arr1);
                mergedArray.set(arr2, arr1.length);

                return mergedArray;
            }
        } catch (error) {
            if(this._destroyed) return;

            console.error('player stream ERRORed, restart in 1s');
            clearTimeout(this.__pollTimeout);
            this.__pollTimeout = setTimeout(this.startPolling.bind(this), 1000);
            return;
        }

        console.warn('player stream stopped, restart in 10s');
        clearTimeout(this.__pollTimeout);
        this.__pollTimeout = setTimeout(this.startPolling.bind(this), 10000);
    }

    feed(data) {
        if (this.noFeed || !this.pcmPlayer) return;

        this.pcmPlayer.feed(data);
    }

    async updateSong() {
        this.noFeed = true;

        const song = await this.fetchCurTrack();
        if (!this.currentTrack || this.currentTrack.sampleRate != song.sampleRate) {
            this.rebuildPcmPlayer(song.sampleRate);
        }

        this.currentTrack = song;

        const curTrackMins = song.duration / 60 | 0;
        const curTrackSecs = song.duration % 60 | 0;
        this.setTitle(this.currentTrack.title + ` <${curTrackMins}:${pad2(curTrackSecs)}>`);


        this.noFeed = false;

        this.ackRender();
    }

    async updateQueue(){
        const queue = await this.fetchQueue();
        if(!queue) return;

        this.queue = queue;
        this.ackRender();
    }

    async fetchCurTrack() {
        const resp = await apiRequest('/radio/current-song');
        const json = await resp.json();
        if (!json.success) {
            toastr.error('cannot fetch current song! reload the page.');
            return
        }

        return json.song;
    }

    async fetchQueue() {
        const resp = await apiRequest('/radio/get-queue');
        const json = await resp.json();
        if (!json.success) {
            toastr.warn('cannot fetch song queue');
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

export default WinampPlayer