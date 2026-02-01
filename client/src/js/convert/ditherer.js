// src/dithering.js

import bayer from './matrices/bayer';
import clrManip from './color';

export class Ditherer {
    constructor(paletteRGB, colorFunc = 'lwrgbde') {
        this.paletteRGB = paletteRGB;
        this.colorFunc = colorFunc;
        this.usedColors = new Map();

        this.updatePaletteDerived();

        // used to calibrate Yulioma's mixing error params
        this.dEMaxValues = {
            'lwrgbde': clrManip.lwrgbde([0,0,0], [255,255,255]),
            'ciede1994': clrManip.mciede1994mix([0,0,0], [100,0,0]),
            'ciede2000': clrManip.mciede2000mix([0,0,0], [100,0,0]),
            'cmcic': clrManip.cmcicMix([0,0,0], [100,0,0]),
            'eucl': clrManip.euclidian([0,0,0], [255,255,255]),
            'oklab': clrManip.mOklabDiffMix([0,0,0], [1,0,0])
        }

    }

    setPalette(paletteRGB) {
        this.paletteRGB = paletteRGB;
        this.usedColors.clear();
        this.updatePaletteDerived();
    }

    setColorFunc(colorFunc) {
        this.colorFunc = colorFunc;
        this.usedColors.clear();
        this.updatePaletteDerived();
    }

    updatePaletteDerived() {
        this.paletteLAB = this.paletteRGB.map(clrManip.rgb2lab);
        this.paletteOKLab = this.paletteRGB.map(clrManip.rgb2okLAB);
        this.palette32 = this.paletteRGB.map(clrManip.rgb2uint32);
    }

    get deFunction() {
        switch (this.colorFunc) {
            case 'lwrgbde': return clrManip.lwrgbde;
            case 'ciede1994': return clrManip.mciede1994mix;
            case 'ciede2000': return clrManip.mciede2000mix;
            case 'cmcic': return clrManip.cmcicMix;
            case 'eucl': return clrManip.euclidian;
            case 'oklab': return clrManip.mOklabDiffMix;
            default: return clrManip.lwrgbde;
        }
    }

    get curPaletteSpace() {
        switch (this.colorFunc) {
            case 'ciede1994':
            case 'ciede2000':
            case 'cmcic':
                return 'lab';
            case 'oklab':
                return 'oklab';
            default:
                return 'rgb';
        }
    }

    get palette() {
        switch (this.colorFunc) {
            case 'ciede1994':
            case 'ciede2000':
            case 'cmcic':
                return this.paletteLAB;
            case 'oklab':
                return this.paletteOKLab;
            default:
                return this.paletteRGB;
        }
    }

    * errorDiffusion(imageData, matrix = null) {
        const width = imageData.width;
        const height = imageData.height;
        const imgData = imageData.data;
        const buf32 = new Uint32Array(imgData.buffer);

        const serp = $('#serp')[0].checked;
        let dir = 1;
        let cntr = 0;

        for (let y = 0; y < height; y++) {
            const startX = dir > 0 ? 0 : width - 1;
            const endX = dir > 0 ? width : -1;
            const step = dir;

            for (let x = startX; x !== endX; x += step) {
                const i = x + y * width;
                const col32 = buf32[i];

                if ((col32 >> 24) === 0) {
                    buf32[i] = 0;
                    continue;
                }

                const color = clrManip.uint32toRGB(col32);
                const rgbKey = col32 & 0xffffff;

                let matchIndex = this.usedColors.get(rgbKey);
                if (matchIndex === undefined) {
                    matchIndex = clrManip.mapcolor(color, this.palette, this.deFunction);
                    this.usedColors.set(rgbKey, matchIndex);
                }

                const matchingColor = this.paletteRGB[matchIndex];
                const matchingColor32 = this.palette32[matchIndex];

                buf32[i] = matchingColor32;

                if (matrix) {
                    const dist = [
                        color[0] - matchingColor[0],
                        color[1] - matchingColor[1],
                        color[2] - matchingColor[2]
                    ];

                    for (let j = dir > 0 ? 0 : matrix.length - 1;
                        dir > 0 ? j < matrix.length : j >= 0;
                        j += dir) {
                        const [mult, dx, dy] = matrix[j];
                        const nx = x + dx * dir;
                        const ny = y + dy;

                        if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;

                        const ni = nx + ny * width;
                        const neighborColor = clrManip.uint32toRGB(buf32[ni]);

                        const I = ni * 4;
                        imgData[I] = Math.max(0, Math.min(255, neighborColor[0] + dist[0] * mult));
                        imgData[I + 1] = Math.max(0, Math.min(255, neighborColor[1] + dist[1] * mult));
                        imgData[I + 2] = Math.max(0, Math.min(255, neighborColor[2] + dist[2] * mult));
                    }
                }

                if (++cntr % 2000 === 0) {
                    yield cntr / (width * height);
                }
            }

            if (serp) dir *= -1;
        }

        return imageData;
    }

    * checkboardDithering(imageData, palUtils) {
        const width = imageData.width;
        const imgData = imageData.data;
        let cntr = 0;

        const deFunction = this.deFunction;

        let paletteMixed = palUtils.colorValuesExRGB;
        switch (this.colorFunc) {
            case 'ciede2000':
            case 'cmcic':
                paletteMixed = palUtils.colorValuesExLab;
                break
            case 'oklab':
                paletteMixed = palUtils.colorValuesExOkLab;
                break
        }

        for (let i = 0; i < imgData.length; i += 4) {
            if (imgData[i + 3] <= 127) {
                imgData[i] = imgData[i + 1] = imgData[i + 2] = imgData[i + 3] = 0;
                continue;
            }

            const color = [imgData[i], imgData[i + 1], imgData[i + 2]];
            const rgbKey = (color[0] << 16) | (color[1] << 8) | color[2];

            let matchIndex = this.usedColors.get(rgbKey);
            if (matchIndex === undefined) {
                matchIndex = clrManip.mapcolor(color, paletteMixed, deFunction);
                this.usedColors.set(rgbKey, matchIndex);
            }

            const [col1Idx, col2Idx] = [
                palUtils.colorValuesExRGB[matchIndex][3],
                palUtils.colorValuesExRGB[matchIndex][4]
            ];

            const pixelParity = (((i / 4) % width) + Math.floor((i / 4) / width)) % 2;
            const finalIndex = pixelParity === 0 ? col1Idx : col2Idx;

            const finalColor = this.paletteRGB[finalIndex];
            imgData[i] = finalColor[0];
            imgData[i + 1] = finalColor[1];
            imgData[i + 2] = finalColor[2];
            imgData[i + 3] = 255;

            if (++cntr % 2000 === 0) {
                yield cntr / (imgData.length / 4);
            }
        }

        return imageData;
    }

    * orderedDithering(imageData, matrixSize, custom = false, mode = 1, strength = 100,) {
        const M = bayer[custom ? ('c' + matrixSize) : matrixSize];
        const max = M.length ** 2;
        const width = imageData.width;
        const imgData = imageData.data;
        let cntr = 0;

        for (let i = 0; i < imgData.length; i += 4) {
            if (imgData[i + 3] <= 127) {
                imgData[i] = imgData[i + 1] = imgData[i + 2] = imgData[i + 3] = 0;
                continue;
            }

            const offset = i / 4;
            const x = offset % width;
            const y = (offset / width) | 0;
            let bayerVal = M[x % matrixSize][y % matrixSize];

            let normalized = (bayerVal + 0.5) / max;
            if (mode === 0) normalized *= -1;
            else if (mode === 2) normalized -= 0.5;

            for (let j = 0; j < 3; j++) {
                imgData[i + j] = Math.max(0, Math.min(255, imgData[i + j] + normalized * strength));
            }

            const color = [imgData[i], imgData[i + 1], imgData[i + 2]];
            const rgbKey = (color[0] << 16) | (color[1] << 8) | color[2];

            let matchIndex = this.usedColors.get(rgbKey);
            if (matchIndex === undefined) {
                matchIndex = clrManip.mapcolor(color, this.palette, this.deFunction);
                this.usedColors.set(rgbKey, matchIndex);
            }

            const finalColor = this.paletteRGB[matchIndex];
            imgData[i] = finalColor[0];
            imgData[i + 1] = finalColor[1];
            imgData[i + 2] = finalColor[2];
            imgData[i + 3] = 255;

            if (++cntr % 2000 === 0) {
                yield cntr / (imgData.length / 4);
            }
        }

        return imageData;
    }

    * yliluoma1Ordered(imageData, matrixSize, custom = false) {
        const M = bayer[custom ? ('c' + matrixSize) : matrixSize];
        const max = matrixSize * matrixSize;
        const width = imageData.width;
        const imgData = imageData.data;

        const de = this.deFunction;
        const deName = this.colorFunc;
        const paletteRGB = this.paletteRGB;
        const paletteSpace = this.curPaletteSpace;

        const mixingPlans = this.computeYuliomaMixingPlans(
            paletteRGB,
            paletteSpace,
            matrixSize,
            de,
            deName
        );

        const planCache = new Map();
        let cntr = 0;

        for (let i = 0; i < imgData.length; i += 4) {
            if (imgData[i + 3] <= 127) {
                imgData[i] = imgData[i + 1] = imgData[i + 2] = imgData[i + 3] = 0;
                continue;
            }

            const offset = i / 4;
            const x = offset % width;
            const y = (offset / width) | 0;

            const factor = (M[x % matrixSize][y % matrixSize] + 0.5) / max;

            const rgb = [imgData[i], imgData[i + 1], imgData[i + 2]];
            const rgbKey = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];

            let plan = planCache.get(rgbKey);
            if (!plan) {
                let bestErr = Infinity;
                let bestPlan = null;

                for (let p of mixingPlans) {
                    const err = de(rgb, p.mixColor);
                    if (err < bestErr) {
                        bestErr = err;
                        bestPlan = p;
                    }
                }
                plan = bestPlan;
                planCache.set(rgbKey, plan);
            }

            const idx = factor < plan.ratio ? plan.c2 : plan.c1;
            const out = paletteRGB[idx];

            imgData[i] = out[0];
            imgData[i + 1] = out[1];
            imgData[i + 2] = out[2];
            imgData[i + 3] = 255;

            if (++cntr % 2000 === 0) {
                yield cntr / (imgData.length / 4);
            }
        }

        return imageData;

    }


    computeYuliomaMixingPlans(paletteRGB, paletteSpace, order, de, deName) {
        const plans = [];
        const nn = order * order;

        for (let i = 0; i < paletteRGB.length; i++) {
            for (let j = i; j < paletteRGB.length; j++) {
                for (let r = 0; r < nn; r++) {
                    if (i === j && r !== 0) break;

                    const ratio = r / nn;

                    const c1 = paletteRGB[i];
                    const c2 = paletteRGB[j];
                    
                    const mixRGB = [
                        c1[0] + ratio * (c2[0] - c1[0]),
                        c1[1] + ratio * (c2[1] - c1[1]),
                        c1[2] + ratio * (c2[2] - c1[2])
                    ].map(v => v | 0);

                    let mixColor = mixRGB;
                    let c2Spaced = c2;
                    if(paletteSpace === 'lab'){
                        mixColor = clrManip.rgb2lab(mixRGB);
                        c2Spaced = clrManip.rgb2lab(c2);
                    }else if(paletteSpace === 'oklab'){
                        mixColor = clrManip.rgb2okLAB(mixRGB);
                        c2Spaced = clrManip.rgb2okLAB(c2);
                    }

                    // all deltaE funcs taking rgb color as 1st argument and 
                    // their own colorspace color as second
                    const diff = calcMixingError(c1, c2Spaced, ratio, de, deName);

                    plans.push({
                        c1: i,
                        c2: j,
                        ratio,
                        mixRGB,
                        mixColor,
                        diff
                    });
                }
            }
        }
        return plans;

        function calcMixingError(c1, c2, ratio, de, deName){
            const rawDiff = de(c1, c2);
            const maxDEVal = this.dEMaxValues[deName];

            const k = 0.1 * 1.75 / maxDEVal;
            const weightedErr = rawDiff * k * (Math.abs(ratio - 0.5) + 0.5);

            return weightedErr;
        }
    }
}