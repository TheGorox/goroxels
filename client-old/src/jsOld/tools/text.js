import { mobile } from "./toolUtils";
import min5fontSheet from '../../font/pixel/min5.png';
import min5fontInfo from '../../font/pixel/min5.txt';
import camera from '../camera';
import { hexPalette } from '../config';
import { ROLE } from '../constants';
import { addFX, FX, removeFX } from '../fxcanvas';
import globals from '../globals';
import MiniWindow from '../MiniWindow';
import { paste } from "./paste";
import player from '../player';
import Tool from '../Tool';
import { boardToScreenSpace } from '../utils/conversions';
import { mapRange } from '../utils/math';


export class PixelFont {
    static defaultVSpacing = 1;

    constructor(imagePath, infoPath) {
        this.imagePath = imagePath;
        this.infoPath = infoPath;

        this.defaultWidth = null;
        this.defaultHeight = null;
        this.letters = {};

        this.loaded = false;
        this._isLoading = false;
    }

    async load() {
        if (this._isLoading) return;
        this._isLoading = true;

        try {
            const fontCanvas = await new Promise((res, rej) => {
                const img = new Image();

                img.onload = () => {
                    const canvas = document.createElement('canvas');

                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    res(canvas);
                };

                img.onerror = rej;

                img.src = this.imagePath;
            });

            const fontInfoResp = await fetch(this.infoPath);
            const fontInfo = await fontInfoResp.json();

            const defaultWidth = fontInfo.defaultWidth;
            this.defaultWidth = defaultWidth;
            const height = fontInfo.fixedHeight;
            this.defaultHeight = height;

            const fontCanvasCtx = fontCanvas.getContext('2d');
            this.letters = {};

            let offsetX = 0;
            for (let letter of fontInfo.letters) {
                const {
                    letter: letterSymbol, width = defaultWidth
                } = letter;

                const slice = fontCanvasCtx.getImageData(offsetX, 0, width, height);
                this.letters[letterSymbol] = slice;

                // extra 1 because it's one white pixel before each next letter
                offsetX += width + 1;
            }
        } catch (error) {
            this._isLoading = false;
            throw error;
        }

        this._isLoading = false;
        this.loaded = true;
    }

    drawText(text, color = 'black') {
        if (!this.loaded) throw new Error('font not loaded');

        text = text.toUpperCase();

        const {
            width: textWidth, height: textHeight
        } = this.measureText(text);

        if (textWidth == 0 || textHeight == 0) {
            return null;
        }

        const colorCanvas = document.createElement('canvas');
        const textCanvas = document.createElement('canvas');

        colorCanvas.width = textCanvas.width = textWidth;
        colorCanvas.height = textCanvas.height = textHeight;

        const colorCanvasCtx = colorCanvas.getContext('2d');
        const textCanvasCtx = textCanvas.getContext('2d');

        const textLetters = text.split('');
        let cursorX = 0, cursorY = 0;
        for (let letter of textLetters) {
            if (letter == '\n') {
                cursorY += this.defaultHeight + PixelFont.defaultVSpacing;
                cursorX = 0;
                continue;
            }

            if (letter == ' ') {
                cursorX += this.defaultWidth;
                continue;
            }

            let letterImData = this.letters[letter];
            if (!letterImData) {
                cursorX += this.defaultWidth;
                continue;
            }

            textCanvasCtx.putImageData(letterImData, cursorX, cursorY);
            cursorX += letterImData.width + 1; // 1 is the constant spacing
        }

        // first, we draw text canvas shaped, colored rect 
        // then we will put the text on top of it, using
        // globalComposite property.
        // this will keep only those pixels of colored rect, in which
        // letters are. this will "color" the letters in the color of the rect
        colorCanvasCtx.fillStyle = color;
        colorCanvasCtx.fillRect(0, 0, textWidth, textHeight);

        colorCanvasCtx.globalCompositeOperation = 'destination-atop';
        colorCanvasCtx.drawImage(textCanvas, 0, 0);

        return colorCanvas;
    }

    measureText(text) {
        if (!this.loaded) throw new Error('font not loaded');

        text = text.toUpperCase();

        const textLetters = text.split('');
        let curWidth = 0, maxWidth = 0, height = this.defaultHeight;

        for (let letter of textLetters) {
            if (letter == '\n') {
                height += this.defaultHeight + PixelFont.defaultVSpacing;
                maxWidth = Math.max(curWidth, maxWidth);
                curWidth = 0;
                continue;
            }

            if (letter == ' ') {
                curWidth += this.defaultWidth;
                continue;
            }

            if (this.letters[letter]) {
                curWidth += (this.letters[letter].width || this.defaultWidth) + 1;
            }
        }

        return {
            width: Math.max(curWidth, maxWidth), height
        };
    }
}
class Text extends Tool {
    constructor(...args) {
        super(...args);

        this.fonts = [
            new PixelFont(min5fontSheet, min5fontInfo)
        ];
        this.fonts.forEach(f => f.load());

        this.miniWindow = null;

        this.on('down', this.down.bind(this));
    }

    down(e) {
        if (this.miniWindow && !this.miniWindow.closed) return;

        globals.lockInputs = true;

        this.miniWindow = new MiniWindow('Draw text', 2);
        const winEl = this.miniWindow.element;
        if (mobile) {
            winEl.css('left', 0).css('top', 0);
        } else {
            winEl.css('left', window.screen.width / 3).css('top', window.screen.height / 3);
        }

        const innerHtml = $(`
            <textarea style="width: 100%;"></textarea>
            <div style="display:flex; margin: 2px 0">
                <div style="display: flex">
                    <div>x:</div> <input type="number" class="textXCord" style="width: 100%">
                </div>
                <div style="display: flex; margin-left: 2px">
                    <div>y:</div> <input type="number" class="textYCord" style="width: 100%">
                </div>
            </div>
        `);

        this.miniWindow.bodyElement.css('max-width', 200).css('display', 'flex').css('flex-direction', 'column');
        this.miniWindow.bodyElement.append(innerHtml);
        document.body.appendChild(winEl[0]);

        const textInput = $('textarea', this.miniWindow.bodyElement);
        const xCordInput = $('.textXCord', this.miniWindow.bodyElement);
        const yCordInput = $('.textYCord', this.miniWindow.bodyElement);

        const lastCord = [player.x, player.y];
        xCordInput.val(lastCord[0]);
        yCordInput.val(lastCord[1]);

        const font = this.fonts[0];

        let lastText = null, lastColor = player.color, lastTextCanvas = null;
        const previewFx = new FX((ctx) => {
            const text = textInput.val();
            if (!text) return 0;

            if (!font.loaded) {
                return 0;
            }

            // remap the sine value based on the time
            // to the min-max opacity borders
            ctx.globalAlpha = mapRange(Math.sin(Date.now() / 400), -1, 1, 0.2, 0.9);

            const x = xCordInput.val();
            const y = yCordInput.val();

            if (lastText !== text || lastColor !== player.color) {
                lastText = text;
                lastColor = player.color;
                lastTextCanvas = font.drawText(lastText, hexPalette[lastColor]);
            }

            const [screenX, screenY] = boardToScreenSpace(x, y);


            ctx.save();
            ctx.scale(camera.zoom, camera.zoom);

            ctx.imageSmoothingEnabled = false;

            const deZoomedX = screenX / camera.zoom;
            const deZoomedY = screenY / camera.zoom;

            if (~player.secondCol) {
                ctx.fillStyle = hexPalette[player.secondCol];
                ctx.fillRect(deZoomedX, deZoomedY, lastTextCanvas.width, lastTextCanvas.height);
            }
            ctx.drawImage(lastTextCanvas, deZoomedX, deZoomedY);

            ctx.restore();

            return 0;
        });
        addFX(previewFx);

        this.miniWindow.on('okClicked', () => {
            globals.lockInputs = false;

            removeFX(previewFx);

            const text = textInput.val();
            if (!text || !lastTextCanvas) return;

            // add background if second color is selected
            if (~player.secondCol) {
                const ctx = lastTextCanvas.getContext('2d');
                // draw only on opaque pixels
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = hexPalette[player.secondCol];
                ctx.fillRect(0, 0, lastTextCanvas.width, lastTextCanvas.height);
            }

            const x = +xCordInput.val();
            const y = +yCordInput.val();

            paste.startDraw(lastTextCanvas, x, y);
        });

        this.miniWindow.on('cancelClicked', () => {
            globals.lockInputs = false;

            removeFX(previewFx);
        });
    }
}
const text = new Text('text', 'KeyT', null, ROLE.USER);
export default text;