import { mobile } from "./toolUtils";
import wandCursor from '../../img/toolIcons/wand-cur.png';
import wandIcon from '../../img/toolIcons/wand-cur.png';
import { allColors } from '../config';
import { addFX, FX, FX_STATE } from '../fxcanvas';
import globals from '../globals';
import player from '../player';
import Tool from '../Tool';
import { isDarkColor } from '../utils/color';
import { screenToBoardSpace } from '../utils/conversions';
import { isClick } from '../utils/misc';
import { generateShader } from '../utils/webGL';


const WAND_STATE = {
    DISABLED: 0,
    SELECTING: 1,
    RENDERING: 2
};
class MagicWand extends Tool {
    constructor(...args) {
        super(...args);

        this.state = WAND_STATE.DISABLED;

        this.mouseListeners = {
            down: this.mousedown.bind(this),
            up: this.mouseup.bind(this)
        };

        this.downPos = null;

        this.fx = null;

        this.selectedColor = null;

        this.maskCanvas = null;
        this.maskImData = null;
        this.maskBuffer = null;

        this.glData = {
            selColorLoc: null,
            screenSizeLoc: null,
            sdfRadiusLoc: null,
            isDarkLoc: null
        };

        this.on('up', this.up.bind(this));
        this.on('selected', this.selected.bind(this));
        this.on('deselected', this.deselected.bind(this));
    }

    // mobile events
    selected() {
        if (this.state === WAND_STATE.RENDERING) {
            this.stopRendering();
        }
        this.startSelecting();
    }
    deselected() {
        if (this.state === WAND_STATE.SELECTING) {
            this.stopSelecting();
        }
    }

    up() {
        switch (this.state) {
            case WAND_STATE.DISABLED: {
                this.startSelecting();
                break;
            }
            case WAND_STATE.SELECTING: {
                this.stopSelecting();
                break;
            }
            case WAND_STATE.RENDERING: {
                this.stopRendering();
                if (mobile) {
                    this.startSelecting();
                }
                break;
            }
        }
    }

    mousedown(e) {
        this.downPos = [e.clientX, e.clientY];
    }

    mouseup(e) {
        if (!this.downPos) return;

        const upPos = [e.clientX, e.clientY];
        if (!isClick(this.downPos, upPos)) {
            return;
        }

        this.stopSelecting();

        const boardPos = screenToBoardSpace(...upPos);
        const boardColId = globals.chunkManager.getChunkPixel(...boardPos);
        const rgbCol = allColors[boardColId];

        this.selectedColor = rgbCol;
        globals.wandSelectedColor = boardColId;

        this.startRendering();
    }

    startSelecting() {
        this.state = WAND_STATE.SELECTING;

        this.changeCursor(1);
        player.suspendColors();

        globals.eventManager.on('mousedown', this.mouseListeners.down);
        globals.eventManager.on('mouseup', this.mouseListeners.up);
    }

    stopSelecting() {
        this.state = WAND_STATE.DISABLED;

        this.changeCursor(0);
        player.restoreColors();

        globals.eventManager.off('mousedown', this.mouseListeners.down);
        globals.eventManager.off('mouseup', this.mouseListeners.up);
    }

    changeCursor(cursorState) {
        if (cursorState === 1) {
            document.body.style.cursor = `url('${wandCursor}') 2 2, auto`;
        } else {
            document.body.style.cursor = '';
        }
    }

    glRenderMask() {
        const gl = this.glData.gl;

        gl.viewport(0, 0, this.maskCanvas.width, this.maskCanvas.height);

        const mainCanvas = globals.mainCtx.canvas;

        gl.bindTexture(gl.TEXTURE_2D, this.glData.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE, mainCanvas);

        const [r, g, b] = this.selectedColor;

        gl.uniform4f(this.glData.selColorLoc, r / 255, g / 255, b / 255, 1);
        gl.uniform2f(this.glData.screenSizeLoc, mainCanvas.width, mainCanvas.height);
        gl.uniform1f(this.glData.sdfRadiusLoc, 5);
        gl.uniform1f(this.glData.isDarkLoc, isDarkColor(...this.selectedColor) ? 1 : 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    startRendering() {
        this.state = WAND_STATE.RENDERING;

        // first time we need to (re)generate it
        // to prevent the old mask from showing off
        this.generateMaskCanvas();

        this.fx = new FX(ctx => {
            if (this.state !== WAND_STATE.RENDERING) {
                return FX_STATE.REMOVED;
            }
            const w = ctx.canvas.width;
            const h = ctx.canvas.height;

            // handling window resize
            if (w !== this.maskCanvas.width ||
                h !== this.maskCanvas.height) {
                this.generateMaskCanvas();
            }

            this.glRenderMask();

            ctx.globalAlpha = 0.8;
            ctx.drawImage(this.maskCanvas, 0, 0);
            ctx.globalAlpha = 1;

            return FX_STATE.FINISHED;
        });
        addFX(this.fx);
    }

    stopRendering() {
        this.state = WAND_STATE.DISABLED;

        // cleaning up
        this.maskCanvas = null;
        this.maskImData = null;
        this.maskBuffer = null;

        this.fx = null;

        this.selectedColor = null;
        globals.wandSelectedColor = null;

        globals.fxRenderer.needRender = true;
    }

    generateMaskCanvas() {
        const canvas = document.createElement('canvas');
        canvas.width = globals.mainCtx.canvas.width;
        canvas.height = globals.mainCtx.canvas.height;


        this.maskCanvas = canvas;

        this.generateShader();
    }
    generateShader() {
        const maskCanvas = this.maskCanvas;

        const fragmentShader = `
        precision mediump float;
        uniform sampler2D u_image;
        uniform vec4 u_selectedColor;
        uniform vec2 u_screenSize;
        uniform float u_sdfRadius;
        uniform float u_isDark;
        varying vec2 v_texCoord;

        void main() {
            vec3 outColor = vec3(0.0);

            vec4 color = texture2D(u_image, v_texCoord);
            float match = all(equal(color, u_selectedColor)) ? 0.0 : 1.0;

            float dx = 1.0 / u_screenSize.x;
            float dy = 1.0 / u_screenSize.y;

            
            // process only surrounding pixels
            if(match == 1.0 && u_isDark == 1.0){
                float maxLength = length(vec2(u_sdfRadius, u_sdfRadius));
                float mindist = 10000.0;
                const float maxRadius = 5.0;
                for(float x = -maxRadius; x < maxRadius; x++){
                    if(abs(x) > u_sdfRadius) continue;
                    for(float y = -maxRadius; y < maxRadius; y++){
                        if(abs(y) > u_sdfRadius) continue;

                        vec2 newCoord = vec2(dx*x + v_texCoord.x, dy*y + v_texCoord.y);
                        vec4 color = texture2D(u_image, newCoord);
                        bool match = all(equal(color, u_selectedColor));

                        if(match){
                            mindist = min(mindist, length(vec2(x, y)));
                        }
                    }
                }
                if(mindist != 10000.0){
                    float norm = 1.0 - mindist / maxLength;

                    outColor = vec3(norm);
                }
            }

            gl_FragColor = vec4(outColor, match);
        }
        `;

        const { gl, program, texture } = generateShader(maskCanvas, fragmentShader);

        this.glData.selColorLoc = gl.getUniformLocation(program, "u_selectedColor");
        this.glData.screenSizeLoc = gl.getUniformLocation(program, "u_screenSize");
        this.glData.sdfRadiusLoc = gl.getUniformLocation(program, "u_sdfRadius");
        this.glData.isDarkLoc = gl.getUniformLocation(program, "u_isDark");

        this.glData.gl = gl;
        this.glData.texture = texture;
    }
}
const wand = new MagicWand('wand', 'KeyW', wandIcon);
export default wand;