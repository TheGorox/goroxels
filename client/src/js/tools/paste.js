import camera from '../camera';
import { boardHeight, boardWidth, allColors } from '../config';
import { ROLE } from '../constants';
import { addFX, FX, removeFX } from '../fxcanvas';
import globals from '../globals';
import me from '../me';
import { SelectMiniWindow } from '../MiniWindow';
import player from '../player';
import Tool from '../Tool';
import { translate as t } from '../translate';
import { closestColor } from '../utils/color';
import { boardToScreenSpace } from '../utils/conversions';
import { getLS } from '../utils/localStorage';
import { mapRange } from '../utils/math';
import { sleep } from '../utils/misc';


// WARNING: it's not supposed to be a bot
// so it won't check for connection or re-check image
// write your own bots please 
class Paste extends Tool {
    constructor(...args) {
        super(...args);

        // 0 - idle
        // 1 - choosing
        // 2 - placing
        // 3 - drawing
        this.state = 0;

        this.moveFX = null;
        this.drawInterval = null;

        this.lastClipboardEvent = {
            ev: null,
            date: null
        };

        this.initListeners();
    }

    initListeners() {
        this.on('down', this.down.bind(this));
    }

    async down() {
        if (this.state === 0 || this.state === 1) {
            this.state = 1;

            // in case 'Paste' event launched later
            await sleep(100);

            try {
                let whichOne = 'file';
                if (this.isImagePasted()) {
                    whichOne = await this.promptClipboardOrFile();
                }

                let canvas;
                if (whichOne === 'clip') {
                    canvas = await this.getClipboardImage(this.lastClipboardEvent.ev);
                } else if (whichOne === 'file') {
                    canvas = await this.askFileImage();
                }
                if (canvas)
                    this.startPlace(canvas);

                this.lastClipboardEvent.ev = null;
                this.lastClipboardEvent.date = null;
            } finally {
                this.state = 0;
            }
        } else if (this.state == 2) {
            // this.state = 0
            // this.stopPlace();
        } else if (this.state == 3) {
            this.state = 0;
            this.stopDraw();
        }
    }

    async promptClipboardOrFile() {
        return new Promise((res, rej) => {
            try {
                const btns = [{
                    text: t('from_clipboard'),
                    id: 'clip'
                },
                {
                    text: t('from_file'),
                    id: 'file'
                }];

                const win = new SelectMiniWindow(btns, res, t('paste.choose_from'));
                document.body.appendChild(win.element[0]);

                win.center();
            } catch (error) {
                rej(error);
            }
        });
    }

    isImagePasted() {
        const lastEv = this.lastClipboardEvent;
        if (!lastEv.images || Date.now() - lastEv.date > 1000) return false;
        return true;
    }

    async getClipboardImage() {
        const { images } = this.lastClipboardEvent;
        if (!images?.length) return null;
        return await this.readCanvasFromFile(images[0]);
    }

    async askFileImage() {
        // get file from system
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png';

        input.click();

        return new Promise((res, rej) => {
            input.onchange = () => {
                input.onchange = null;

                if (!input.files.length || input.files[0] == "") {
                    return rej();
                }

                // read first file with filereader
                this.readCanvasFromFile(input.files[0])
                    .then(res)
                    .catch(rej);
            };
        });
    }

    readCanvasFromFile(file) {
        return new Promise((res, rej) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () => {
                    // draw image on canvas to get its data
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    res(canvas);
                };
                img.onerror = rej;
            };
            reader.onerror = rej;
        });
    }

    startPlace(canvas, protectMask = null) {
        if (protectMask && protectMask.length !== canvas.width * canvas.height) {
            throw new Error('protect mask length mismatch');
        }

        player.suspendColors();
        this.state = 2;

        let xPos = player.x, yPos = player.y;

        function render(ctx) {
            const [x, y] = boardToScreenSpace(xPos, yPos);
            const z = camera.zoom;

            const opacity = mapRange(Math.sin(Date.now() / 400), -1, 1, 0.5, 1);
            ctx.globalAlpha = opacity;

            ctx.save();
            ctx.scale(z, z);
            ctx.drawImage(canvas, x / z, y / z);
            ctx.restore();

            ctx.globalAlpha = 1;
            return 0;
        }

        const fx = this.moveFX = new FX(render);
        addFX(fx);

        function move() {
            let newX = player.x, newY = player.y;
            if (newX == xPos && newY == yPos)
                return;

            xPos = newX;
            yPos = newY;
        }

        let lastX, lastY;
        let down = function (e) {
            lastX = e.clientX;
            lastY = e.clientY;
        };

        let up = function (e) {
            if (e.button == 2) {
                this.state = 0;
                this.stopPlace(); off();
                return;
            };

            let [x, y] = [e.clientX, e.clientY];
            if (Math.abs(x - lastX) > 5 || Math.abs(y - lastY) > 5) return;

            off();
            player.restoreColors();

            this.stopPlace();
            this.startDraw(canvas, xPos, yPos, protectMask);
        };
        up = up.bind(this);

        function off() {
            globals.eventManager.off('mousedown', down);
            globals.eventManager.off('mouseup', up);
            globals.toolManager.off('move', move);
        }

        globals.eventManager.on('mousedown', down);
        globals.eventManager.on('mouseup', up);
        globals.toolManager.on('move', move);
    }

    stopPlace() {
        removeFX(this.moveFX);
        this.removeAllListeners('move');
    }

    startDraw(canvas, startX, startY, protectMask = null) {
        if(me.role < ROLE.TRUSTED && (canvas.width > 150 || canvas.height > 150)){
            toastr.warning('no, comrade');
            return;
        }

        this.state = 3;

        const ctx = canvas.getContext('2d');
        const { width: w } = canvas;

        let imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let offset = -4;

        const isMod = me.role >= ROLE.MOD;

        function draw() {
            let allowance = Math.floor(player.bucket.allowance);
            if (allowance == 0) return;

            let pixels = [], protectPixels = [];

            let max = 13106;
            if (getLS('ya', false) === 'polkovnik') {
                max = 52441;
            }
            while (allowance > 0 && offset < imgdata.length - 4 && pixels.length < max && protectPixels.length < max) {
                offset += 4;

                let rgba = [
                    imgdata[offset],
                    imgdata[offset + 1],
                    imgdata[offset + 2],
                    imgdata[offset + 3],
                ];

                if (rgba[3] < 127) continue;

                let off = offset / 4;
                const offX = off % w, offY = off / w | 0;

                const boardX = startX + offX, boardY = startY + offY;
                if (boardX < 0 || boardX >= boardWidth ||
                    boardY < 0 || boardY >= boardHeight)
                    continue;

                if (isMod && protectMask) {
                    const protectedState = protectMask[offX + offY * w];
                    protectPixels.push([boardX, boardY, protectedState]);
                }


                const color = closestColor(rgba, allColors);
                const oldCol = globals.chunkManager.getChunkPixel(boardX, boardY);
                if (oldCol == color) continue;

                allowance--;

                pixels.push([boardX, boardY, color]);
            }

            if (pixels.length) {
                player.bucket.spend(pixels.length);
                globals.socket.sendPixels(pixels);
                if (protectPixels.length) {
                    globals.socket.sendPixels(protectPixels, true);
                }
            }

            if (offset >= imgdata.length - 4) {
                this.state = 0;
                this.stopDraw();
            }
        }

        this.drawInterval = setInterval(draw.bind(this), 50);
    }

    stopDraw() {
        clearInterval(this.drawInterval);
    }
}
export const paste = new Paste('paste', 'CTRL+KeyV', null, ROLE.MOD);
document.addEventListener('paste', (ev) => {
    // paste event does not work for other than ctrl+v
    // so skip in case some another tool assigned for this key
    // (check your sanity if you do :D)
    if (paste.key !== 'CTRL+KeyV') return;

    const images = [];
    for (const item of ev.clipboardData.items) {
        if (item.type.startsWith('image/')) {
            images.push(item.getAsFile());
        }
    }

    if (images.length) {
        paste.lastClipboardEvent = {
            images,
            date: Date.now()
        };
    }
});

export default paste;