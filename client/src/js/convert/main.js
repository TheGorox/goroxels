import '../../css/converters.css';

import '../../img/folder.png';
import '../../img/pattern.png';
import '../../img/palette.png';
import '../../img/palette2.png';

import './setImmediate';

import palettes from './palettes';
import converterWProm from './converterWASM';
import clrManip from './color';
import * as importedPatterns from './patterns';

import imgZoom from './imgzoom';
import openImage from './openImage';
import { isImagePixelArt, resizeCanvas } from './resize';
import { linkNumberRangeInputs } from './dom';

import { upload } from './imgur';

import { Ditherer } from './ditherer';
import errorDiffMatrices from './matrices/errorDiffusion';

import { init as initTranslates, translate as t } from '../translate';
import { processApiErrors } from '../utils/api';
import { sleep } from '../utils/misc';

(async () => {
    const module = await converterWProm;
    window.convModule = module;
    window.clrManip = clrManip;
})();


initTranslates();

let resizeKeepAspectRatio = true;

// автоматический корректор инпута
$('input[type=number]').on('change', (e) => {
    let input = e.target;

    if (input.max) {
        input.value = Math.min(input.value, input.max);
    }

    if (input.min) {
        input.value = Math.max(input.value, input.min);
    }
});

let utils = {
    // технически, любой путь подойдёт
    isURLValid(url) {
        if (!url || !url.length) return false;

        try {
            new URL(url);
        } catch {
            return false;
        }

        return true
    },
    isURLImage(url) {
        return new RegExp('\.(png|jpg|gif)$').test(url);
    }
}

const paletteSel = $('#paletteSel');
function applyPalettes(selected) {
    let paletteSelected = false;
    Object.keys(palettes).forEach(key => {
        const newEl = $(`<option id="p_${key}">${key}</option>`);
        newEl.val(key);

        if (key === selected) {
            paletteSelected = true;
            newEl.attr('selected', '');
            palUtils.setPalette(palettes[key]);
        }


        paletteSel.prepend(newEl);
    });

    // in case some palette was deleted
    if (!paletteSelected) {
        $('#p_goroxels1').attr('selected', '');
        palUtils.setPalette(palettes['goroxels1']);
    }
    paletteSel.append('<option value="_custom">custom</option>');
}

paletteSel.on('change', () => {
    const val = paletteSel.val();

    if (val === "_custom") {
        $('#userPalette').show();
    } else {
        $('#userPalette').hide();

        const pal = palettes[val];

        localStorage.setItem('converterPalette', val);
        palUtils.setPalette(pal);
        palUtils.updatePalette();

        visualizePalette();

        converterPreload(false);
    }

    palUtils.usedColors = [];
    patUtils.usedColors = [];
});

$('#userPalette').attr('placeholder',
    '[[r, g, b],[r, g, b], ...] | ["#hex", "#hex", ...] | [[r, g, b], ["#hex"], ...]');
$('#userPalette').on('input', () => {
    tryParseUserPalette();
    visualizePalette();
});

function visualizePalette() {
    const pal = paletteRGB;

    $('#palette').children().remove();

    pal.forEach(col => {
        const el = $(`<div class="paletteCol" style="background-color:rgb(${col.join(',')})"></div>`);
        $('#palette').append(el);
    });
}


function tryParseUserPalette() {
    try {
        let tempPal = JSON.parse($('#userPalette').val())

        if (tempPal.length === 0)
            throw new Error('Null palette length')

        tempPal = tempPal.map(el => {
            if (typeof el === 'string') { // hex
                if (el.startsWith('#')) el = el.slice(1);

                return clrManip.hex2rgb(el);
            } else if (typeof el === 'object' && el.length === 3) { // rgb array
                return el
            }

            throw new Error('Unknown color type')
        })

        palUtils.setPalette(tempPal);
        palUtils.updatePalette();

        converterPreload(false);
    } catch (e) {
        $('#userPalette').css('background-color', 'rgb(249,141,141)');
        return
    }
    $('#userPalette').css('background-color', '')
}

let paletteRGB,
    paletteLAB,
    paletteOKLab,
    palette32;

let palUtils = {
    // all the dithering happens in thing below (ditherer.js)
    ditherer: null,
    
    colorValuesExRGB: [],
    colorValuesExLab: [],
    colorValuesExOkLab: [],

    converterInterval: null,
    usedColors: [],

    setPalette(palette) {
        paletteRGB = palette;
        this.ditherer?.setPalette(palette);
        this.updatePalette();
    },
    updatePalette() {
        paletteLAB = paletteRGB.map(clrManip.rgb2lab);
        paletteOKLab = paletteRGB.map(clrManip.rgb2okLAB);
        palette32 = paletteRGB.map(clrManip.rgb2uint32);

        this.ditherPalette();
    },
    ditherPalette() {
        if ($('#ditheringMode').val() !== 'check') return;

        // спи.. взято на вооружение!
        this.colorValuesExRGB = [];
        this.colorValuesExLab = [];
        this.colorValuesExOkLab = [];

        const isOklab = $('#colorfunc').val() === 'oklab';
        const clrDiffFn = isOklab ? clrManip.mOklabDiff : clrManip.mciede2000;
        const paletteWithL = isOklab ? paletteOKLab : paletteLAB;
        // lab max diff is 120
        // oklab max diff is ~1.509 
        // but realistic max between oklab black/white is ~1.0
        const thresMulti = isOklab ? 0.01 : 1.2

        const threshold = +$('#palThresold').val() * thresMulti; // UI is presented as a range of 0..100, but ciede2000 maxes out at ~120.
        paletteRGB.forEach((col1, col1idx) => {
            paletteRGB.forEach((col2, col2idx) => {
                if (col2idx >= col1idx) {
                    if (clrDiffFn(col1, col2) <= threshold) {
                        const mix = clrManip.mixColors(col1, col2);
                        const col1lab = paletteWithL[col1idx];
                        const col2lab = paletteWithL[col2idx];
                        if (col1lab[0] >= col2lab[0]) { // put lighter colors first regardless of combo
                            this.colorValuesExRGB.push([mix[0], mix[1], mix[2], col1idx, col2idx]);
                        } else {
                            this.colorValuesExRGB.push([mix[0], mix[1], mix[2], col2idx, col1idx]);
                        }
                    }
                }
            });
        });
        this.colorValuesExRGB.forEach((val, idx) => {
            if (isOklab) {
                this.colorValuesExOkLab[idx] = clrManip.rgb2okLAB(val.map(x => x | 0));

                this.colorValuesExOkLab[idx][3] = val[3];
                this.colorValuesExOkLab[idx][4] = val[4];

            } else {
                this.colorValuesExLab[idx] = clrManip.rgb2lab(val);
                this.colorValuesExLab[idx][3] = val[3];
                this.colorValuesExLab[idx][4] = val[4];
            }
        });
    }
}

let palImageChanged = false;
$('#palFolder').on('click', () => {
    openImage(dataURL => {
        palImageChanged = true;
        $('#palInput').val(t('[file]'));
        $('#palInput').data('source', 'dataURL');

        palUtils.dataURL = dataURL;

        converterPreload();
    })
})

$('#palGOBtn').on('click', () => {
    converterPreload();
});

$('#palInput').on('keydown', (e) => {
    $('#palInput')[0].dataset.source = "url";
    if (e.code === 'Enter') {
        converterPreload();
    } else {
        palImageChanged = true;
    }
});

$('#ditheringMode').on('change', () => {
    let val = $('#ditheringMode').val();

    if (val === 'ordered') {
        $('#ordMatrix').removeClass('hidden');
    } else {
        $('#ordMatrix').addClass('hidden');
    }

    if (val === 'check') {
        $('#thresoldDiv').removeClass('hidden');
    } else {
        $('#thresoldDiv').addClass('hidden');
    }

    // serpentine mode is only works for error dithering
    if (['f-s', 'stuki', 'sierra', 'sierra-lite'].includes(val)) {
        $('#serpBlock').removeClass('hidden');
    } else {
        $('#serpBlock').addClass('hidden');
    }
});

$('#palInput').on('paste', (e) => {
    let files = e.originalEvent.clipboardData.items;
    let images = [];
    for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image')) {
            images.push(files[i].getAsFile());
        };
    }
    if (!images.length) return;
    e.preventDefault();

    let image = images[0];

    const reader = new FileReader();
    reader.onload = function (ev) {
        $('#palInput').val(t('[clipboard]'));
        $('#palInput').data('source', 'dataURL');
        const tempImage = new Image();
        tempImage.onload = function () {
            palImageChanged = true;

            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = tempImage.width;
            tempCanvas.height = tempImage.height;
            const clipCtx = tempCanvas.getContext("2d");
            clipCtx.drawImage(tempImage, 0, 0);
            palUtils.dataURL = tempCanvas.toDataURL("image/png");
            converterPreload();
        };
        tempImage.src = ev.target.result;
    };
    reader.readAsDataURL(image);
});

linkNumberRangeInputs($('#resizeXInput')[0], $('#resizeXRange')[0])
linkNumberRangeInputs($('#resizeYInput')[0], $('#resizeYRange')[0])

function converterPreload(showWarn = true) {
    let path = $('#palInput').val();
    if ($('#palInput').data('source') !== 'dataURL') {
        if (!path.length) {
            return showWarn && toastr.error(t('Choose a image!'));
        }

        if (utils.isURLValid(path)) {
            startPaletteConverter(path);
        } else {
            return showWarn && toastr.error(t('Invalid link!'));
        }
    } else {
        startPaletteConverter(palUtils.dataURL);
    }
}

function startPaletteConverter(url) {
    clearImmediate(palUtils.converterInterval);

    let tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';
    tempImg.src = url;

    tempImg.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.width = tempImg.width;
        canvas.height = tempImg.height;


        let ctx = canvas.getContext('2d');
        ctx.drawImage(tempImg, 0, 0);


        if (palImageChanged) {
            showResizeOptions();
            palImageChanged = false;
            $('#resizeXRange').attr('max', canvas.width * 2);
            $('#resizeYRange').attr('max', canvas.height * 2);
            $('#resizeXInput,#resizeXRange').val(canvas.width);
            $('#resizeYInput,#resizeYRange').val(canvas.height);
            $('#resizeXInput').data('ar', canvas.width / canvas.height);

            $('#resizeAA').prop('checked', false);
            $('#tryResizePixelArt').prop('checked', false);
        } else {
            let resizeWidth, resizeHeight;
            let withAA = $('#resizeAA').is(':checked');

            if ($('#tryResizePixelArt').is(':checked')) {
                const { result, pixelSize } = isImagePixelArt(canvas);
                if (!result) {
                    toastr.warning(t('warn.notPixelArt'));
                } else {
                    resizeWidth = canvas.width / pixelSize;
                    resizeHeight = canvas.height / pixelSize;
                    withAA = false;

                    // update inputs to reflect new sizes
                    $('#resizeXInput,#resizeXRange').val(resizeWidth);
                    $('#resizeYInput,#resizeYRange').val(resizeHeight);
                }
            }

            if (!resizeWidth || !resizeHeight) {
                resizeWidth = $('#resizeXInput').val();
                resizeHeight = $('#resizeYInput').val();
            }


            canvas = resizeCanvas(canvas, resizeWidth, resizeHeight, withAA);
            ctx = canvas.getContext('2d');
        }

        tempImg = null;

        try {
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch (e) {
            return toastr.error(t('Image is loaded, but pixels can not be shown. Try to load it on Imgur or download->upload from file'))
        }

        const contrast = +$('#colorAdj').val();
        const brightness = +$('#brightAdj').val();
        imgData = clrManip.adjustGamma(imgData, contrast, brightness);

        const doNotConvert = $('#doNotConvert').is(':checked');

        if (doNotConvert) {
            ctx.putImageData(imgData, 0, 0);

            onDone(canvas, 'palOut',
                () => {
                    toastr.info(t('onDone.didNotConvert'));
                });
            return;
        }

        palUtils.updatePalette();

        const ditherer = palUtils.ditherer;
        ditherer.usedColors.clear();

        let convGen; // converterGenerator
        switch ($('#ditheringMode').val()) {
            case 'none':
                convGen = ditherer.errorDiffusion(imgData);
                break;
            case 'f-s':
                convGen = ditherer.errorDiffusion(imgData, errorDiffMatrices.floydSteinberg);
                break;
            case 'stuki':
                convGen = ditherer.errorDiffusion(imgData, errorDiffMatrices.stuki);
                break;
            case 'sierra':
                convGen = ditherer.errorDiffusion(imgData, errorDiffMatrices.sierraTwo);
                break;
            case 'check':
                convGen = ditherer.checkboardDithering(imgData, palUtils);
                break;
            case 'ordered':
                let matrix = $('#ordMatrixSelect').val();
                let mode = $('#ordMatrixModeSelect').val();

                if (mode == 'des') mode = 0;
                else if (mode == 'asc') mode = 1;
                else mode = 2;

                let custom = false;
                if (matrix.startsWith('c')) {
                    custom = true;
                    matrix = matrix.slice(1);
                }

                const bayerStrength = +$('#bayerAdj').val();
                convGen = ditherer.orderedDithering(imgData, +matrix, custom, mode, bayerStrength);
                break;
            default:
                toastr.warning('O_o');
                return;
        }


        let startTime = Date.now();
        const progressBar = $('#palLB>.barProgress');
        progressBar.parent().parent().removeClass('opaque');
        palUtils.converterInterval = setImmediate(function rec() {
            let loaded = convGen.next();

            if (loaded.done) {
                progressBar.parent().parent().addClass('opaque');
                progressBar.css('width', 0);
                ctx.putImageData(imgData, 0, 0);
                onDone(canvas, 'palOut',
                    () => {
                        toastr.success(`${t('Done in')} ${(Date.now() - startTime) / 1000}${t('s.')}`);
                    });
            } else {
                let perc = loaded.value * 100;
                if (perc > 97) perc = 100;
                progressBar.css('width', perc + '%');
                palUtils.converterInterval = setImmediate(rec);
            }
        });
    }

    tempImg.onerror = () => {
        toastr.error('Unknown image loading error. Maybe CORS, so try to upload on Imgur')
    }
}

$('#palThresold').on('change', () => {
    palUtils.ditherPalette();
    converterPreload();
});
$('#colorAdj').on('input', (e) => {
    $('#colorAdjLabel').text(e.target.value);
});
$('#resetContrast').on('click', () => {
    $('#colorAdj').val(0);
    $('#colorAdjLabel').text(0);
});

$('#brightAdj').on('input', (e) => {
    $('#brightAdjLabel').text(e.target.value);
});
$('#resetBrightness').on('click', () => {
    $('#brightAdj').val(0);
    $('#brightAdjLabel').text(0);
});

$('#bayerAdj').on('input', (e) => {
    $('#bayerAdjLabel').text(e.target.value);
});
$('#bayerAdj').trigger('input');

document.onkeydown = e => {
    if (e.key === 'Enter' && !e.repeat) {
        converterPreload();
    }
}

// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------

let patUtils = {
    patterns: importedPatterns.patterns,
    defaultPattern: importedPatterns.defaultPattern,
    patternSize: Math.sqrt(importedPatterns.patterns[0].length),

    usedColors: [],

    patternsCans: [], // список картинок с паттернами для ускоренного рисования
    async generatePatterns() {
        this.patternsCans = [];
        const patternSize = this.patternSize;
        let pattern, ctx, color;
        for (let i = 0; i < paletteRGB.length; i++) {
            let canvas = document.createElement('canvas');
            canvas.width = canvas.height = patternSize;


            pattern = this.patterns[i % this.patterns.length];
            color = paletteRGB[i];

            ctx = canvas.getContext('2d');

            ctx.fillStyle = `rgb(${color.join(',')})`;

            for (let j = 0; j < pattern.length; j++) {
                if (!pattern[j]) continue;

                const x = j % patternSize,
                    y = j / patternSize | 0;

                ctx.fillRect(x, y, 1, 1);
            }

            this.patternsCans.push(await createImageBitmap(canvas));
        }
    },
    drawPattern(ctx, pattern, startX, startY, color) {
        let s = this.patternSize;
        ctx.fillStyle = `rgb(${color.join(',')})`;
        for (let x = 0; x < s; x++) {
            for (let y = 0; y < s; y++) {
                if (!pattern[x + y * s]) continue
                ctx.fillRect(startX + x, startY + y, 1, 1);
            }
        }
    },
    // todo расширяемые паттерны
    async * patternize(canvas) {
        const ctx = canvas.getContext('2d');
        const {
            data: imgData,
            width, height
        } = ctx.getImageData(0, 0, canvas.width, canvas.height);


        await this.generatePatterns();


        const patternSize = this.patternSize;

        const newWidth = width * patternSize;
        const newHeight = height * patternSize;


        // actual palette32 includes opacity, i don't need it
        let palette32 = paletteRGB.map(c => (c[0] << 16) + (c[1] << 8) + c[2])
        let colorMap = new Map();
        palette32.forEach((el, i) => colorMap.set(el, i))

        let color, colId, color32, pattern;

        const CHUNK_SIZE = 500;
        const CHUNKS_X = Math.ceil(width / CHUNK_SIZE);
        const CHUNKS_Y = Math.ceil(height / CHUNK_SIZE);


        const chunks = [];

        let counter = 0;
        for (let cx = 0; cx < CHUNKS_X; cx++) {
            for (let cy = 0; cy < CHUNKS_Y; cy++) {
                const startX = cx * CHUNK_SIZE;
                const startY = cy * CHUNK_SIZE;
                const endX = Math.min((cx + 1) * CHUNK_SIZE, width);
                const endY = Math.min((cy + 1) * CHUNK_SIZE, height);

                const chunkCanvas = document.createElement('canvas');
                chunkCanvas.width = (endX - startX) * patternSize;
                chunkCanvas.height = (endY - startY) * patternSize;

                const chunkCtx = chunkCanvas.getContext('2d');


                for (let x = startX; x < endX; x++) {
                    for (let y = startY; y < endY; y++) {
                        counter++;

                        const i = (x + y * width) * 4;

                        color = [imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3]];
                        if (color[3] !== 255) continue;

                        color32 = (color[0] << 16) + (color[1] << 8) + color[2];

                        colId = colorMap.get(color32);

                        pattern = this.patternsCans[colId];

                        const localX = (x - startX) * patternSize;
                        const localY = (y - startY) * patternSize;
                        if (pattern) {
                            chunkCtx.drawImage(pattern, localX, localY);
                        } else {
                            this.drawPattern(chunkCtx, this.defaultPattern, localX, localY, color);
                        }

                        if (i % 3000 === 0) {
                            yield counter / (imgData.length / 4)
                        }
                    }
                }

                chunks.push([
                    cx, cy, chunkCanvas
                ]);
            }
        }

        let compositeCanvas = document.createElement('canvas');
        compositeCanvas.width = newWidth;
        compositeCanvas.height = newHeight;

        const compCtx = compositeCanvas.getContext('2d');
        for (const chunk of chunks) {
            const [cx, cy, chunkCanvas] = chunk;
            const offX = cx * CHUNK_SIZE * patternSize;
            const offY = cy * CHUNK_SIZE * patternSize;

            compCtx.drawImage(chunkCanvas, offX, offY);
        }


        // for (let i = 0; i < imgData.length; i += 4) {
        //     if (imgData[i + 3] < 127) continue;

        //     _i = i / 4;
        //     imgX = _i % width;
        //     imgY = _i / width | 0;

        //     absX = imgX * patternSize;
        //     absY = imgY * patternSize;

        //     color = [imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3]];
        //     color32 = (color[0] << 16) + (color[1] << 8) + color[2];

        //     colId = colorMap.get(color32);

        //     pattern = this.patternsCans[colId];

        //     if (pattern) {
        //         ctx2.drawImage(pattern, absX, absY);
        //     } else {
        //         this.drawPattern(ctx2, this.defaultPattern, absX, absY, color)
        //     }

        //     console.log('cyc');
        //     if (i % 2000 === 0) {
        //         yield i / imgData.length
        //     }
        // }
        //newCanvas.getContext('2d').putImageData(newImgData, 0, 0);

        return compositeCanvas;
    }
}

$('#patFolder').on('click', () => {
    openImage(dataURL => {
        $('#patInput').val(t('[file]'));
        $('#patInput').data('source', 'dataURL');

        patUtils.dataURL = dataURL;

        patternPreload();
    })
})

$('#patGOBtn').on('click', () => {
    patternPreload();
});

$('#patInput').on('keydown', (e) => {
    $('#patInput').data('source', 'url');
    if (e.code === 'Enter') {
        patternPreload();
    }
});

$('#patInput').on('paste', (e) => {
    let files = e.originalEvent.clipboardData.items;
    let images = [];
    for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image')) {
            images.push(files[i].getAsFile());
        };
    }
    if (!images.length) return;
    e.preventDefault();

    let image = images[0];

    const reader = new FileReader();
    reader.onload = function (ev) {
        $('#patInput').val(t('[clipboard]'));
        $('#patInput').data('source', 'dataURL');

        const tempImage = new Image();
        tempImage.onload = function () {
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = tempImage.width;
            tempCanvas.height = tempImage.height;
            const clipCtx = tempCanvas.getContext("2d");
            clipCtx.drawImage(tempImage, 0, 0);
            patUtils.dataURL = tempCanvas.toDataURL("image/png");
            patternPreload();
        };
        tempImage.src = ev.target.result;
    };
    reader.readAsDataURL(image);
})

function patternPreload() {
    let path = $('#patInput').val();
    if ($('#patInput').data('source') !== 'dataURL') {
        if (!path.length) {
            return toastr.error(t('Choose a image!'));
        }

        if (utils.isURLValid(path) && utils.isURLImage(path)) {
            patternatorStart(path);
        } else {
            return toastr.error(t('Invalid link!'));
        }
    } else {
        patternatorStart(patUtils.dataURL);
    }
}

function patternatorStart(url) {
    clearImmediate(patUtils.converterInterval);

    let tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';
    tempImg.src = url;

    tempImg.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.width = tempImg.width;
        canvas.height = tempImg.height;

        if (canvas.width > 800 || canvas.height > 800) {
            //toastr.warning('Image is wider than 800px, this can crash the page');
        }

        let ctx = canvas.getContext('2d');
        ctx.drawImage(tempImg, 0, 0);

        try {
            ctx.getImageData(0, 0, 1, 1);
        } catch (e) {
            return toastr.error(t('Image is loaded, but pixels can not be gotten. Try to load it on Imgur or download->upload from file'))
        }

        toastr.warning(t('If your image is big, go make a tea and watch Doctor Who'));
        let convGen = patUtils.patternize(canvas);



        let toast = toastr.info(`(0%)`, "PATTERN", {
            timeOut: 0,
            extendedTimeOut: 0,
            closeButton: true,
            tapToDismiss: false
        });

        let startTime = Date.now();
        patUtils.converterInterval = setTimeout(async function rec() {
            let loaded = await convGen.next();

            if (toast && toast.find('.toast-message').length) {
                toast.find('.toast-message').text(`${(loaded.value * 100) | 0}%`);
            }

            if (loaded.done) {
                toast.remove();
                onDone(loaded.value, 'patOut',
                    () => {
                        toastr.success(`${t('Done in')} ${(Date.now() - startTime) / 1000}s.`);
                    });
            } else {
                patUtils.converterInterval = setTimeout(rec);
            }
        });
    }

    tempImg.onerror = () => {
        toastr.error(t('Unknown image loading error. Maybe CORS, so try to upload on Imgur'))
    }
}

function createImgData(width, height) {
    let tempCanvas = document.createElement('canvas');

    let newImgData = tempCanvas.getContext('2d').createImageData(width, height);
    tempCanvas = null;

    return newImgData
}

async function copyCanvasToClipboard(canvas) {
    const blob = await new Promise(res => canvas.toBlob(res));
    const item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([item]);
}

async function copyToClipboard(text) {
    await navigator.clipboard.writeText(text);
}

function downloadCanvas(canvas) {
    const link = document.createElement('a');
    link.download = 'filename.png';
    link.href = canvas.toDataURL()
    link.click();
}

async function showUploadPrompt(palettizedCanvas) {
    return new Promise((res, rej) => {
        try {
            const prompt = $('<div class="upload-prompt"></div>');
            const thumbCanvas = document.createElement('canvas');
            const thumbCtx = thumbCanvas.getContext('2d');

            let thumbWidth, thumbHeight;
            if (palettizedCanvas.width > palettizedCanvas.height) {
                thumbWidth = 50;
                thumbHeight = Math.round((palettizedCanvas.height / palettizedCanvas.width) * 50);
            } else {
                thumbHeight = 50;
                thumbWidth = Math.round((palettizedCanvas.width / palettizedCanvas.height) * 50);
            }

            thumbCanvas.width = 50;
            thumbCanvas.height = 50;

            thumbCtx.clearRect(0, 0, 50, 50);
            thumbCtx.drawImage(
                palettizedCanvas,
                (50 - thumbWidth) / 2,
                (50 - thumbHeight) / 2,
                thumbWidth,
                thumbHeight
            );

            const thumbImg = $('<img>').attr('src', thumbCanvas.toDataURL());


            const namesSelect = $(`<select style="margin-right: 3px;"/>`)
                .addClass('template-names');

            const nameInput = $(`<input type="text" placeholder="${t('template_name_desc')}">`)
                .addClass('template-name');

            const namesContainer = $('<div/>');
            namesContainer.append(namesSelect, nameInput);

            const patternContainer = $('<div class="checkbox-container"></div>');
            const patternCheckbox = $('<input type="checkbox" id="convertToPattern" checked>')
                .addClass('pattern-checkbox');
            const patternLabel = $(`<label for="convertToPattern">${t('template_patternize')}</label>`);
            patternContainer.append(patternCheckbox, patternLabel);

            const publicContainer = $('<div class="checkbox-container"></div>');
            const publicCheckbox = $('<input type="checkbox" id="isPublicTemplate">')
                .addClass('public-checkbox');
            const publicLabel = $(`<label for="isPublicTemplate">${t('template_is_public')}</label>`);
            publicContainer.append(publicCheckbox, publicLabel);

            const confirmButton = $(`<button>${t('upload_to_goroxels')}</button>`).addClass('confirm-upload');
            prompt.append(thumbImg, namesContainer, patternContainer, publicContainer, confirmButton);
            $('body').append(prompt);

            async function onConfirmClick() {
                confirmButton.prop('disabled', true);

                const templateName = nameInput.val().trim();
                if (templateName.length < 3 || templateName.length > 32) {
                    toastr.error(t('template_name_shit'));
                    return;
                }

                try {
                    const formData = new FormData();
                    const thumbBlob = await new Promise((resolve, reject) => {
                        thumbCanvas.toBlob(b => b ? resolve(b) : reject(new Error("Failed to create thumbnail")), 'image/png');
                    });
                    formData.append('thumb', thumbBlob, 'thumbnail.png');

                    let patternCanvas = palettizedCanvas, patternized = false;
                    if (patternCheckbox.is(':checked')) {
                        if (!patUtils || typeof patUtils.patternize !== "function") {
                            throw new Error("Patternize utility not available");
                        }

                        let toast = toastr.info(`(0%)`, "PATTERN", {
                            timeOut: 0,
                            extendedTimeOut: 0,
                            closeButton: true,
                            tapToDismiss: false
                        });

                        patternized = true;

                        const patternGen = patUtils.patternize(palettizedCanvas);
                        let patternResult;
                        while (!(patternResult = await patternGen.next()).done) {
                            await sleep(0);
                            if (toast && toast.find('.toast-message').length) {
                                toast.find('.toast-message').text(`${(patternResult.value * 100) | 0}%`);
                            }
                        }
                        toast.remove();

                        patternCanvas = patternResult.value;
                    }

                    const patternBlob = await new Promise((resolve, reject) => {
                        patternCanvas.toBlob(b => b ? resolve(b) : reject(new Error("Failed to create pattern")), 'image/png');
                    });
                    formData.append('pattern', patternBlob, 'pattern.png');

                    const isPublic = publicCheckbox.is(':checked');

                    let url = `/api/template/add?name=${encodeURIComponent(templateName)}&public=${isPublic}`;
                    if (patternized) {
                        url += `&width=${palettizedCanvas.width}`;
                    }

                    const response = await fetch(url, {
                        method: 'POST',
                        body: formData,
                        credentials: 'include'
                    });

                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const result = await response.json();

                    if (result.errors) {
                        processApiErrors(result.errors);
                        return;
                    }

                    toastr.success('Template uploaded successfully!');
                    prompt.remove();
                    res(result);

                } catch (error) {
                    confirmButton.removeAttr('disabled');

                    toastr.error('Upload failed: ' + error.message);
                    rej(error);
                }
            }

            confirmButton.on('click', onConfirmClick);

            fetch(`/api/template/list?self=1`, {
                credentials: 'include'
            }).then(async response => {
                const result = await response.json();

                if (result.errors) {
                    if (result.errors[0] === 'Not permitted') {
                        toastr.warning(t('you_need_login_to_use_this_feature'));
                        prompt.remove();
                        return;
                    }
                    processApiErrors(result.errors);
                    return;
                }

                const templates = result;

                for (const template of templates) {
                    const option = $(`<option value="${template.name}">${template.name}</option>`);
                    namesSelect.append(option);
                }

                namesSelect.on('change', () => {
                    nameInput.val(namesSelect.val());
                })
            }).catch(toastr.error);

        } catch (err) {
            rej(err);
        }
    });
}


function onDone(canvas, convClass, callback) {
    $(`#${convClass} > *`).remove();

    canvas.className = 'outputImg';

    const zoomChecked = $('#autoZoom')[0].checked;

    let newImg = document.createElement('img');
    newImg.className = 'outputImg' + (zoomChecked ? ' zoomed' : '');
    newImg.src = canvas.toDataURL();
    if (!zoomChecked) newImg.style.width = Math.min(canvas.width, parseInt($(`#${convClass}`).css('width')) / 2) + 'px';

    $(`#${convClass}`)[0].appendChild(newImg);

    $(`#${convClass}`).append(
        `<div class="afterImage">
            <div class="line"><button class="uploadButton"> ${t('Upload on imgur!')}</button></div>
            ${convClass === 'palOut' ? `<div class="line"><button class="uploadGrokselsButton">${t('upload_to_goroxels')}</button></div>` : ''}
            <div class="line"><span class="uploadedUrl"></span></div>
            ${convClass === 'patOut' ? `<div class="line">${t('Final image size:')} ${canvas.width}x${canvas.height}</div>` : ''}
            <div class="line"><button class="copyToClipButton">${t('copy_canvas_btn')}</button></div>
            <div class="line"><button class="downloadButton">${t('download_canvas_btn')}</button></div>
        </div>`
    );
    imgZoom.createZoomHandler($(`#${convClass}`).children(0)[0]);

    $(`#${convClass} .uploadButton`).one('click', async () => {
        $(`#${convClass} .uploadedUrl`).text('Uploading...');

        try {
            const link = await upload(canvas.toDataURL().split(",")[1]);
            const isPNG = link.endsWith('png');
            if (!isPNG) {
                toastr.warn('JPEG!!!');
                throw new Error;
            }

            $(`#${convClass} .uploadedUrl`).html(
                `<span style="color:rgb(0, 190, 0)">${link}${convClass === 'patOut' ? `?width=${canvas.width / 7}` : ''}</span>`
            )
        } catch {
            const text = t('Imgur upload failed, try upload manually');
            let html;
            if (convClass === 'patOut') {
                html = `${text}<br><input id="patternLinkGenerator" placeholder="${t('insert_link_here')}">&nbsp;<span id="patternLink"></span>`;
                setTimeout(() => {
                    const span = $('#patternLink');
                    $('#patternLinkGenerator').on('input', e => {
                        const input = e.target;
                        let link = input.value;
                        input.style.backgroundColor = '';

                        if (link.includes('imgur') && !link.endsWith('.png')) {
                            if (link.includes('/a/')) {
                                input.style.backgroundColor = 'red';
                                return span.text(t('imgur_album_link'))
                            }

                            link += '.png';
                        }

                        link += `?width=${canvas.width / 7}`;

                        span.text(link);
                    })
                })
            } else {
                html = text;
            }

            $(`#${convClass} .uploadedUrl`).html(html)
        }
    });

    $(`#${convClass} .copyToClipButton`).one('click', () => {
        copyCanvasToClipboard(canvas)
            .then(() => toastr.success(t('img_copied_success')));
    });

    $(`#${convClass} .downloadButton`).one('click', () => {
        downloadCanvas(canvas)
    });

    if (convClass === 'palOut') {
        $(`#${convClass} .uploadGrokselsButton`).one('click', () => {
            $(`#${convClass} .uploadGrokselsButton`).prop('disabled', true);

            showUploadPrompt(canvas).then(template => {
                if (template === null || template === undefined) {
                    return;
                }
                const filePath = template.file;
                $(`#${convClass} .uploadedUrl`).text(`GRX/?f=${filePath}&w=${canvas.width}`);
            });
        });
    }

    $(`#${convClass} .uploadedUrl`).on('click', (e) => {
        copyToClipboard(e.target.innerText).then(() => toastr.success(t('conv.url_copied_success')));
    });

    callback();
}

$('#aspectRatioLock').on('click', e => {
    const btn = e.target;
    if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        resizeKeepAspectRatio = false;
    } else {
        btn.classList.add('active');
        resizeKeepAspectRatio = true;
    }
})

function showResizeOptions() {
    $('#resizeXInput,#resizeYInput').parent().removeClass('hidden');
}

// listeners to keep aspect ratio
$('#resizeXInput,#resizeXRange').on('input', e => {
    // to prevent infinite cycle of input events
    if (!e.originalEvent?.isTrusted || !resizeKeepAspectRatio) return;
    const newWidth = e.target.value

    const ar = parseFloat($('#resizeXInput').data('ar'));
    const newHeight = Math.floor(newWidth / ar);
    $('#resizeYInput,#resizeYRange').val(newHeight);
});
$('#resizeYInput,#resizeYRange').on('input', e => {
    if (!e.originalEvent?.isTrusted || !resizeKeepAspectRatio) return;
    const newHeight = e.target.value

    const ar = parseFloat($('#resizeXInput').data('ar'));
    const newWidth = Math.floor(newHeight * ar);
    $('#resizeXInput,#resizeXRange').val(newWidth);
});

$('#colorfunc').on('change', () => {
    palUtils.ditherer.setColorFunc($('#colorfunc').val());
    palUtils.ditherPalette();
    converterPreload(false);
});



let palName = localStorage.getItem('converterPalette') ?? 'goroxels1';
applyPalettes(palName);

// palUtils
palUtils.updatePalette();
visualizePalette();
palUtils.ditherer = new Ditherer(paletteRGB, $('#colorfunc').val());