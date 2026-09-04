import { mobile } from "./toolUtils";
import disabledColorSvg from '../../img/disabled-color.svg';
import disableCur from '../../img/toolIcons/disable-cur.png';
import disableIcon from '../../img/toolIcons/disable.png';
import { allColors, resolveWhenConfigDownloaded } from '../config';
import { addFX, FX, FX_STATE } from '../fxcanvas';
import globals from '../globals';
import player from '../player';
import template from '../template';
import Tool from '../Tool';
import { translate as t } from '../translate';
import { mainCanvas } from '../ui/elements';
import { getPaletteColorId } from '../utils/color';
import { screenToBoardSpace } from '../utils/conversions';
import { getOrDefault, setLS } from '../utils/localStorage';
import { isClick } from '../utils/misc';
import { generateShader, MAX_TEX_SIZE } from '../utils/webGL';


export const COLORADOR_STATE = {
    DISABLED: 0,
    SELECTING: 1
};
class TemplateColorador extends Tool {
    constructor(...args) {
        super(...args);

        this.colorsWhitelist = [];
        resolveWhenConfigDownloaded().then(() => {
            this.colorsWhitelist = JSON.parse(getOrDefault('coloradorColors', '[]', true));
            if (this.colorsWhitelist.length) {
                addFX(new FX(() => {
                    if (!template.templateImg?.width) return FX_STATE.IN_PROCESS;

                    try {
                        this.update();
                    } catch (error) { }

                    return FX_STATE.REMOVED;
                }));
            }
        });

        this.state = COLORADOR_STATE.DISABLED;

        this.on('up', this.up.bind(this));
        this.on('selected', this.selected.bind(this));
        this.on('deselected', this.deselected.bind(this));

        this.mouseListeners = {
            down: this.mousedown.bind(this),
            up: this.mouseup.bind(this)
        };

        // needed for the reference
        this.origTemplateCanvas = null;
        this.origTemplateCtx = null;
        // the one that is monkeypatched into the Template
        this.templateCanvas = null;
        this.templateUpdated = false;

        this.glData = {
            gl: null,
            imageLoc: null,
            colorsWhitelistLoc: null,
            screenSizeLoc: null,
            disabledOpacityLoc: null,
            texture: null,
        };
    }

    selected() {
        this.startSelecting();
    }
    deselected() {
        this.stopSelecting();
    }

    up() {
        switch (this.state) {
            case COLORADOR_STATE.DISABLED: {
                this.startSelecting();
                break;
            }
            case COLORADOR_STATE.SELECTING: {
                this.stopSelecting();
                break;
            }
        }
    }

    mmb(colorId) {
        this.toggleWhitelistColor(allColors[colorId]);
    }

    mousedown(e) {
        this.downPos = [e.clientX, e.clientY];
    }

    mouseup(e) {
        try {
            if (!this.downPos) return;

            const upPos = [e.clientX, e.clientY];
            if (!isClick(this.downPos, upPos)) {
                return;
            }

            this.regenerateTemplateIfNeeded();

            const boardPos = screenToBoardSpace(...upPos);

            if (this.isOutsideTemplate(...boardPos)) {
                this.colorsWhitelist.length = 0;
                this.update();
                return;
            }

            const templateCol = this.getTemplateColor(...boardPos);
            if (!templateCol) return;

            const templateColId = getPaletteColorId(templateCol);
            if (templateColId === -1) {
                toastr.warning(t('color_not_in_palette'));
                return;
            }

            this.toggleWhitelistColor(templateCol);
        } finally {
            if (mobile) {
                this.startSelecting();
            }
        }
    }
    isOutsideTemplate(boardX, boardY) {
        const div = template.isPatterns ? 7 : 1;
        const templateW = template.templateImg.width / div;
        const templateH = template.templateImg.height / div;

        return boardX < template.x || boardY < template.y ||
            boardX >= template.x + templateW ||
            boardY >= template.y + templateH;
    }


    getTemplateColor(boardX, boardY) {
        const temCtx = this.origTemplateCtx;

        const temX = boardX - template.x;
        const temY = boardY - template.y;

        let color = null;
        if (!template.isPatterns) {
            const temColor = temCtx.getImageData(temX, temY, 1, 1).data;
            // no color if it is opaque
            if (temColor[3] === 0) {
                return null;
            }
            color = temColor.slice(0, 3);
        } else {
            const multedTemX = temX * 7;
            const multedTemY = temY * 7;

            // finding the color in the 7x7 pattern cell
            toBreak: for (let x = 0; x < 7; x++) {
                for (let y = 0; y < 7; y++) {
                    const curX = multedTemX + x;
                    const curY = multedTemY + y;

                    const curColor = temCtx.getImageData(curX, curY, 1, 1).data;
                    // alpha
                    if (curColor[3] !== 0) {
                        color = curColor.slice(0, 3);
                        break toBreak;
                    }
                }
            }
        }

        return color;

    }

    toggleWhitelistColor(targetCol) {
        const whitelistColId = this.colorsWhitelist.findIndex(rgb => rgb[0] === targetCol[0] && rgb[1] === targetCol[1] && rgb[2] === targetCol[2]);
        if (whitelistColId !== -1) {
            this.removeWhitelistColor(whitelistColId);
        } else {
            this.addWhitelistColor(targetCol);
        }
    }
    addWhitelistColor(rgb) {
        this.colorsWhitelist.push([...rgb]);
        this.update();
    }
    removeWhitelistColor(idx) {
        this.colorsWhitelist.splice(idx, 1);
        this.update();
    }

    updateUIPalette() {
        $('.paletteColor>img.disabledClr').remove();

        if (!this.colorsWhitelist.length) return;

        $(`.paletteColor`).append(`<img src="${disabledColorSvg}" class="disabledClr">`);

        for (const rgb of this.colorsWhitelist) {
            const id = getPaletteColorId(rgb);
            if (id === -1) {
                console.warn('color', rgb, 'not found in the palette');
                continue;
            }

            $(`#col${id}>img.disabledClr`).remove();
        }
    }

    update() {
        setLS('coloradorColors', JSON.stringify(this.colorsWhitelist), true);

        this.regenerateTemplateIfNeeded();

        if (this.colorsWhitelist.length > 0) {
            this.render(this.state === COLORADOR_STATE.SELECTING);

            this.patchTemplate();
        } else {
            this.unpatchTemplate();
        }

        this.updateUIPalette();
    }

    regenerateTemplateIfNeeded() {
        if (!this.origTemplateCanvas || !this.templateCanvas || this.templateCanvas !== template.templateImg) {
            this.templateUpdated = true;
            this.glData.gl = null;

            const templateImg = template.templateImg;

            const origCanv = this.origTemplateCanvas = document.createElement('canvas');
            const templCanv = this.templateCanvas = document.createElement('canvas');

            origCanv.width = templCanv.width = templateImg.width;
            origCanv.height = templCanv.height = templateImg.height;

            this.origTemplateCtx = origCanv.getContext('2d');
            this.origTemplateCtx.drawImage(templateImg, 0, 0);
        }
    }

    startSelecting() {
        this.state = COLORADOR_STATE.SELECTING;

        this.changeCursor(1);
        player.suspendColors();

        this.clearListeners();

        globals.eventManager.on('mousedown', this.mouseListeners.down);
        globals.eventManager.on('mouseup', this.mouseListeners.up);

        this.render(true);
    }

    stopSelecting() {
        this.state = COLORADOR_STATE.DISABLED;

        this.changeCursor(0);
        player.restoreColors();

        this.clearListeners();

        this.render(false);
    }

    clearListeners() {
        globals.eventManager.off('mousedown', this.mouseListeners.down);
        globals.eventManager.off('mouseup', this.mouseListeners.up);
    }



    render(drawDisabled) {
        if (!this.origTemplateCanvas) {
            this.regenerateTemplateIfNeeded();
        }

        const w = this.origTemplateCanvas.width;
        const h = this.origTemplateCanvas.height;

        let cpuFallback = (w > MAX_TEX_SIZE || h > MAX_TEX_SIZE);

        if (!cpuFallback) {
            this.generateShader();
            this.renderShader(drawDisabled);
        } else {
            this.glData.gl = null;
            this.glData.texture = null;

            console.log('colorador cpu fallback');
            this.renderCpu(drawDisabled);
        }
    }

    createWhitelistTexture(gl, colors) {
        const data = new Uint8Array(colors.flat());
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, colors.length, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        return tex;
    }

    renderShader(drawDisabled) {
        if (!this.glData.gl) {
            this.regenerateTemplateIfNeeded();
            this.generateShader();
        }

        if (!this.colorsWhitelist.length) return;

        const gl = this.glData.gl;

        gl.viewport(0, 0, this.templateCanvas.width, this.templateCanvas.height);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.glData.texture);
        if (this.templateUpdated) {
            this.templateUpdated = false;

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                gl.UNSIGNED_BYTE, this.origTemplateCanvas);
        }
        gl.uniform1i(this.glData.imageLoc, 0);

        gl.activeTexture(gl.TEXTURE1);
        const whitelistTexture = this.createWhitelistTexture(gl, this.colorsWhitelist);
        gl.bindTexture(gl.TEXTURE_2D, whitelistTexture);
        gl.uniform1i(this.glData.colorsWhitelistLoc, 1);

        gl.uniform2f(this.glData.screenSizeLoc, mainCanvas.width, mainCanvas.height);

        const disabledOpacity = drawDisabled ? 0.1 : 0;
        gl.uniform1f(this.glData.disabledOpacityLoc, disabledOpacity);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    generateShader() {
        if (!this.colorsWhitelist.length) return;

        const fragmentShader = `
        #define COLORS_SIZE ${this.colorsWhitelist.length}
        precision mediump float;
        uniform sampler2D u_image;
        uniform sampler2D u_colorsWhitelist;
        uniform vec2 u_screenSize;
        uniform float u_disabledOpacity;
        varying vec2 v_texCoord;

        bool colorMatch(vec3 a, vec3 b) {
            return distance(a, b) < 0.01;
        }

        void main() {
            vec4 color = texture2D(u_image, v_texCoord);
            
            if(color.a < 0.001){
                gl_FragColor = color;
                return;
            }

            for(int i = 0; i < COLORS_SIZE; i++){
                vec3 wl = texture2D(u_colorsWhitelist, vec2((float(i) + 0.5) / float(COLORS_SIZE), 0.5)).rgb;
                if(colorMatch(wl, color.rgb)){
                    gl_FragColor = color;
                    return;
                }
            }

            
            gl_FragColor = vec4(0.0, 0.0, 0.0, u_disabledOpacity);
        }
        `;

        let existingGl = this.glData.gl;
        const { gl, program, texture } = generateShader(existingGl ?? this.templateCanvas, fragmentShader, existingGl ? false : true);

        this.glData.imageLoc = gl.getUniformLocation(program, "u_image");
        this.glData.colorsWhitelistLoc = gl.getUniformLocation(program, "u_colorsWhitelist");
        this.glData.screenSizeLoc = gl.getUniformLocation(program, "u_screenSize");
        this.glData.disabledOpacityLoc = gl.getUniformLocation(program, "u_disabledOpacity");

        this.glData.gl = gl;
        if (texture) {
            this.glData.texture = texture;
        }
    }

    renderCpu(drawDisabled) {
        const REPLACE_ALPHA = drawDisabled ? 15 : 0;

        const ctx = this.origTemplateCtx;
        const imgData = ctx.getImageData(0, 0, this.origTemplateCanvas.width, this.origTemplateCanvas.height);
        const data = imgData.data;

        const key = rgb => (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
        const whitelistSet = new Set(this.colorsWhitelist.map(key));

        const n = data.length;
        for (let i = 0; i < n; i += 4) {
            if (data[i + 3] === 0) continue;
            const k = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
            if (!whitelistSet.has(k)) {
                data[i] = data[i + 1] = data[i + 2] = 0;
                data[i + 3] = REPLACE_ALPHA;
            }
        }

        this.templateCanvas.getContext('2d').putImageData(imgData, 0, 0);
    }

    patchTemplate() {
        template.templateImg = this.templateCanvas;
        globals.fxRenderer.needRender = true;
    }
    unpatchTemplate() {
        template.templateImg = this.origTemplateCanvas;
        globals.fxRenderer.needRender = true;
    }

    changeCursor(cursorState) {
        if (cursorState === 1) {
            document.body.style.cursor = `url('${disableCur}') 0 0, auto`;
        } else {
            document.body.style.cursor = '';
        }
    }

}
const colorador = new TemplateColorador('colorador', 'KeyD', disableIcon);
export default colorador;