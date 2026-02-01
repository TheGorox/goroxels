import ChunkPlaceholder from '../img/chunkPlaceholder.png';
import camera from './camera';
import { chunkSize, hexPalette } from './config';
import globals from './globals';
import Pattern from './Pattern';
import { getVisibleChunks } from './utils/camera';
import {
    halfMap,
    insanelyLongMobileBrowserCheck
} from './utils/misc';
import template from './template';
import shapes from './utils/shapes';
import player from './player';
import TempChunkPlaceholder from './TempChunkPlaceholder';

const isMobile = insanelyLongMobileBrowserCheck();


export default class Renderer {
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    constructor(ctx) {
        this.ctx = ctx;
        this.canvas = this.ctx.canvas;

        this.chunkPlaceholderPattern = new Pattern(ChunkPlaceholder);
        this.chunkPlaceholderPattern.onload = () => {
            this.needRender = true;
        }
        this.chunkPreviews = {};

        this.needRender = true;

        this.preRendered = {
            brush: {
                canvas: undefined,
                ctx: undefined,
                imageData: undefined,

                circle: undefined,
            }
        }

        this.preRender();
        this.initAndroidGcChecker();
    }

    preRender() {
        this.preRenderBrush();
    }

    preRenderBrush() {
        // TODO make it render only before brush used
        // because it renders on every zoom
        const size = player.brushSize,
            zoom = camera.zoom;

        if (zoom < 1) return

        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = zoom * (size+2);
        const ctx = canvas.getContext('2d');

        let r = Math.floor(size / 2);
        
        let circle
        if(size === 2){
            r = 0;
            circle = [[0,0],[1,0],[0,1],[1,1]]
        }else{
            circle = shapes.filledCircle(0, 0, r+1);
        }
        let circleMatrix = [];
        for (let y = 0; y < size + 1; y++) {
            circleMatrix.push((new Array(size + 1)).fill(0))
        }

        circle.forEach(([x, y]) => {
            circleMatrix[x + r][y + r] = 1;
        })

        const lineW = zoom / 8;
        const halfLineW = lineW / 2;

        ctx.beginPath();
        ctx.lineWidth = lineW;
        ctx.strokeStyle = hexPalette[player.color];
        ctx.lineCap = 'butt';

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (isBound(x, y)) continue;

                let upper = isBound(x, y - 1),
                    left = isBound(x - 1, y),
                    right = isBound(x + 1, y),
                    bottom = isBound(x, y + 1);

                if (upper) {
                    // the margin is for join neighbouring lines
                    const margin = !isBound(x + 1, y) ? lineW : 0;

                    ctx.moveTo(x * zoom, y * zoom + halfLineW);
                    ctx.lineTo((x + 1) * zoom + margin, y * zoom + halfLineW);
                }
                if (left) {
                    const margin = !isBound(x, y - 1) ? lineW : 0;

                    ctx.moveTo(x * zoom + halfLineW, y * zoom - margin);
                    ctx.lineTo(x * zoom + halfLineW, (y + 1) * zoom);
                }
                if (right) {
                    const margin = !isBound(x, y + 1) ? lineW : 0;
                    
                    ctx.moveTo((x + 1) * zoom - halfLineW, y * zoom);
                    ctx.lineTo((x + 1) * zoom - halfLineW, (y + 1) * zoom + margin);
                }
                if (bottom) {
                    const margin = !isBound(x - 1, y) ? lineW : 0;

                    ctx.moveTo((x + 1) * zoom, (y + 1) * zoom - halfLineW);
                    ctx.lineTo(x * zoom - margin, (y + 1) * zoom - halfLineW);
                }
            }
        }

        ctx.stroke();
        ctx.closePath();

        function isBound(x, y) {
            if (x < 0 || x >= size || y < 0 || y >= size) return true;

            return !circleMatrix[x][y];
        }

        this.preRendered.brush.canvas = canvas;
        this.preRendered.brush.ctx = canvas;
        this.preRendered.brush.imageData = canvas;
        this.preRendered.brush.circle = circle;
    }

    initAndroidGcChecker() {
        setInterval(() => {
            this.checkAndroidGc();
        }, 1000);
    }

    // check chunks for being cleared by aggressive android gc
    checkAndroidGc() {
        if (!globals.mobile) return;
        const bad = this.ctx.imageSmoothingEnabled;
        if (bad) {
            console.log('detected broken render, repairing');

            // workaround
            window.onresize();

            globals.chunkManager.reRenderAll();
        }
    }

    requestRender() {
        if (this.needRender) {
            this.needRender = false;

            this.render()
        }

        globals.fxRenderer.render();
    }

    correctSmoothing() {
        if (isMobile) return;

        if (camera.zoom < 1) {
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.canvas.style.imageRendering = 'auto'
        } else {
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.canvas.style.imageRendering = 'pixelated'
        }
    }

    render() {
        // smooth when zoom < 1, pixelated otherwise
        this.correctSmoothing();

        let visibleChunks = getVisibleChunks();

        // clear veiwport
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let camX = camera.x + halfMap[0] - ((this.canvas.width >> 1) / camera.zoom);
        let camY = camera.y + halfMap[1] - ((this.canvas.height >> 1) / camera.zoom);

        let zoom = camera.zoom;

        if (zoom === 1) {
            // for Firefox, to render normally at least on zoom 1
            camX = Math.floor(camX)
            camY = Math.floor(camY)
        }

        this.ctx.save();
        this.ctx.translate(Math.floor(-camX * zoom), Math.floor(-camY * zoom));
        this.ctx.scale(zoom, zoom);

        visibleChunks.forEach(chunkCord => {
            let [cx, cy] = chunkCord;

            let offX = cx * chunkSize;
            let offY = cy * chunkSize;


            if (!globals.chunkManager.hasChunk(cx, cy)) {
                globals.chunkManager.loadChunk(cx, cy);

                // search for chunk preview placeholder
                let chunkPreview = this.chunkPreviews[`${cx}-${cy}`];
                if (!chunkPreview) {
                    // create one if not found (one-time op)
                    chunkPreview = this.chunkPreviews[`${cx}-${cy}`] = {
                        loaded: false,
                        data: null
                    };
                    new TempChunkPlaceholder(cx, cy).load().then(imgData => {
                        chunkPreview.data = imgData;
                        chunkPreview.loaded = true;
                        this.needRender = true;
                    });
                } else if (chunkPreview.loaded && chunkPreview.data !== null) {
                    // or, render it if it's loaded and found in db
                    this.ctx.drawImage(chunkPreview.data, offX, offY, chunkSize, chunkSize);

                    // also render default placeholder over it, to clarify we are dealing with preview
                    if (this.chunkPlaceholderPattern.loaded) {
                        this.ctx.globalAlpha = 0.5;
                        this.ctx.drawImage(this.chunkPlaceholderPattern.canvas, offX, offY, chunkSize, chunkSize);
                        this.ctx.globalAlpha = 1;
                    }
                } else {

                    // fallback to default placeholder if available
                    if (this.chunkPlaceholderPattern.loaded)
                        this.ctx.drawImage(this.chunkPlaceholderPattern.canvas, offX, offY, chunkSize, chunkSize);
                }

                return
            }

            const chunk = globals.chunkManager.getChunk(cx, cy);

            chunk.render();
            this.ctx.drawImage(chunk.ctx.canvas, offX, offY);
        });

        this.ctx.restore();
    }
}

