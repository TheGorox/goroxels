/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/css/converters.css"
/*!********************************!*\
  !*** ./src/css/converters.css ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/img/folder.png"
/*!****************************!*\
  !*** ./src/img/folder.png ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "/img/folder.png");

/***/ },

/***/ "./src/img/palette.png"
/*!*****************************!*\
  !*** ./src/img/palette.png ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "/img/palette.png");

/***/ },

/***/ "./src/img/palette2.png"
/*!******************************!*\
  !*** ./src/img/palette2.png ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "/img/palette2.png");

/***/ },

/***/ "./src/img/pattern.png"
/*!*****************************!*\
  !*** ./src/img/pattern.png ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "/img/pattern.png");

/***/ },

/***/ "./src/js/convert/converterWASM.js"
/*!*****************************************!*\
  !*** ./src/js/convert/converterWASM.js ***!
  \*****************************************/
() {

// import { converter } from "../../../lib/converter/bin/converter"
// import wasmConverter from "../../../lib/converter/bin/converter.wasm"

// // Since webpack will change the name and potentially the path of the
// // `.wasm` file, we have to provide a `locateFile()` hook to redirect
// // to the appropriate URL.
// // More details: https://kripken.github.io/emscripten-site/docs/api_reference/module.html
// const wasm = converter({
//   locateFile(path) {
//     if (path.endsWith(`.wasm`)) {
//       return wasmConverter
//     }
//     return path
//   },
// })

// export default wasm

/***/ },

/***/ "./src/js/convert/ditherer.js"
/*!************************************!*\
  !*** ./src/js/convert/ditherer.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ditherer: () => (/* binding */ Ditherer)
/* harmony export */ });
/* harmony import */ var _matrices_bayer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matrices/bayer */ "./src/js/convert/matrices/bayer.js");
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./color */ "./src/js/convert/color.js");
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_color__WEBPACK_IMPORTED_MODULE_1__);
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
// src/dithering.js




class Ditherer {
    constructor(paletteRGB, colorFunc = 'lwrgbde') {
        this.paletteRGB = paletteRGB;
        this.colorFunc = colorFunc;
        this.usedColors = new Map();

        this.updatePaletteDerived();

        // ===== deltaE range smoke tests =====

// RGB → RGB
console.log(
  `lwrgbde: min=${_color__WEBPACK_IMPORTED_MODULE_1___default().lwrgbde([0,0,0], [0,0,0])} ` +
  `max=${_color__WEBPACK_IMPORTED_MODULE_1___default().lwrgbde([0,0,0], [255,255,255])}`
);

console.log(
  `euclidian: min=${_color__WEBPACK_IMPORTED_MODULE_1___default().euclidian([0,0,0], [0,0,0])} ` +
  `max=${_color__WEBPACK_IMPORTED_MODULE_1___default().euclidian([0,0,0], [255,255,255])}`
);

// RGB → LAB
console.log(
  `ciede1994: min=${_color__WEBPACK_IMPORTED_MODULE_1___default().mciede1994mix(
    [0,0,0],
    [0,0,0]
  )} max=${_color__WEBPACK_IMPORTED_MODULE_1___default().mciede1994mix(
    [0,0,0],
    [100,0,0]
  )}`
);

console.log(
  `ciede2000: min=${_color__WEBPACK_IMPORTED_MODULE_1___default().mciede2000mix(
    [0,0,0],
    [0,0,0]
  )} max=${_color__WEBPACK_IMPORTED_MODULE_1___default().mciede2000mix(
    [0,0,0],
    [100,0,0]
  )}`
);

console.log(
  `cmcic: min=${_color__WEBPACK_IMPORTED_MODULE_1___default().cmcicMix(
    [0,0,0],
    [0,0,0]
  )} max=${_color__WEBPACK_IMPORTED_MODULE_1___default().cmcicMix(
    [0,0,0],
    [100,0,0]
  )}`
);

// RGB → OKLab
console.log(
  `oklab: min=${_color__WEBPACK_IMPORTED_MODULE_1___default().mOklabDiffMix(
    [0,0,0],
    [0,0,0]
  )} max=${_color__WEBPACK_IMPORTED_MODULE_1___default().mOklabDiffMix(
    [0,0,0],
    [1,0,0]
  )}`
);

// ===================================

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
        this.paletteLAB = this.paletteRGB.map((_color__WEBPACK_IMPORTED_MODULE_1___default().rgb2lab));
        this.paletteOKLab = this.paletteRGB.map((_color__WEBPACK_IMPORTED_MODULE_1___default().rgb2okLAB));
        this.palette32 = this.paletteRGB.map((_color__WEBPACK_IMPORTED_MODULE_1___default().rgb2uint32));
    }

    get deFunction() {
        switch (this.colorFunc) {
            case 'lwrgbde': return (_color__WEBPACK_IMPORTED_MODULE_1___default().lwrgbde);
            case 'ciede1994': return (_color__WEBPACK_IMPORTED_MODULE_1___default().mciede1994mix);
            case 'ciede2000': return (_color__WEBPACK_IMPORTED_MODULE_1___default().mciede2000mix);
            case 'cmcic': return (_color__WEBPACK_IMPORTED_MODULE_1___default().cmcicMix);
            case 'eucl': return (_color__WEBPACK_IMPORTED_MODULE_1___default().euclidian);
            case 'oklab': return (_color__WEBPACK_IMPORTED_MODULE_1___default().mOklabDiffMix);
            default: return (_color__WEBPACK_IMPORTED_MODULE_1___default().lwrgbde);
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

                const color = _color__WEBPACK_IMPORTED_MODULE_1___default().uint32toRGB(col32);
                const rgbKey = col32 & 0xffffff;

                let matchIndex = this.usedColors.get(rgbKey);
                if (matchIndex === undefined) {
                    matchIndex = _color__WEBPACK_IMPORTED_MODULE_1___default().mapcolor(color, this.palette, this.deFunction);
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
                        const neighborColor = _color__WEBPACK_IMPORTED_MODULE_1___default().uint32toRGB(buf32[ni]);

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
                console.log('LOOOL');
                imgData[i] = imgData[i + 1] = imgData[i + 2] = imgData[i + 3] = 0;
                continue;
            }

            const color = [imgData[i], imgData[i + 1], imgData[i + 2]];
            const rgbKey = (color[0] << 16) | (color[1] << 8) | color[2];

            let matchIndex = this.usedColors.get(rgbKey);
            if (matchIndex === undefined) {
                matchIndex = _color__WEBPACK_IMPORTED_MODULE_1___default().mapcolor(color, paletteMixed, deFunction);
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
        const M = _matrices_bayer__WEBPACK_IMPORTED_MODULE_0__["default"][custom ? ('c' + matrixSize) : matrixSize];
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
                matchIndex = _color__WEBPACK_IMPORTED_MODULE_1___default().mapcolor(color, this.palette, this.deFunction);
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
        const M = _matrices_bayer__WEBPACK_IMPORTED_MODULE_0__["default"][custom ? ('c' + matrixSize) : matrixSize];
        const max = matrixSize * matrixSize;
        const width = imageData.width;
        const imgData = imageData.data;

        const de = this.deFunction;
        const paletteRGB = this.paletteRGB;
        const paletteSpace = this.curPaletteSpace;

        const mixingPlans = this.computeYuliomaMixingPlans(
            paletteRGB,
            paletteSpace,
            matrixSize,
            de
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


    computeYuliomaMixingPlans(paletteRGB, paletteSpace, order, de) {
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
                    let errorScale
                    if(paletteSpace === 'lab'){
                        mixColor = _color__WEBPACK_IMPORTED_MODULE_1___default().rgb2lab(mixRGB);
                        c2Spaced = _color__WEBPACK_IMPORTED_MODULE_1___default().rgb2lab(c2);
                    }else if(paletteSpace === 'oklab'){
                        mixColor = _color__WEBPACK_IMPORTED_MODULE_1___default().rgb2okLAB(mixRGB);
                        c2Spaced = _color__WEBPACK_IMPORTED_MODULE_1___default().rgb2okLAB(c2);
                    }

                    // all deltaE funcs taking rgb color as 1st argument and 
                    // their own colorspace color as second
                    const diff = de(c1, c2Spaced)

                    plans.push({
                        c1: i,
                        c2: j,
                        ratio,
                        mixRGB,
                        mixColor
                        
                    });
                }
            }
        }
        return plans;

        function calcMixingError(c1, c2, de){
            const rawDiff = de(c1, c2);

        }
    }
}

/***/ },

/***/ "./src/js/convert/dom.js"
/*!*******************************!*\
  !*** ./src/js/convert/dom.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   linkNumberRangeInputs: () => (/* binding */ linkNumberRangeInputs),
/* harmony export */   watchInput: () => (/* binding */ watchInput)
/* harmony export */ });
function watchInput(inputElement, callback) {
    inputElement.addEventListener('input', (event) => {
        callback(event.target.value);
    });  
    
    return new Proxy(inputElement, {
        set(target, property, value) {
            if (property === 'value') {
                const oldValue = target.value;
                target[property] = value;
                if (oldValue !== value) {
                    callback(value);
                }
                return true;
            }
            target[property] = value;
            return true;
        },
        get(target, property) {
            if (property === 'value') {
                return target.value;
            }
            return target[property];
        }
    });
}

function linkNumberRangeInputs(numberInp, rangeInp) {
    numberInp.addEventListener('input', e => rangeInp.value = e.target.value);
    rangeInp.addEventListener('input', e => numberInp.value = e.target.value);
}


/***/ },

/***/ "./src/js/convert/imgur.js"
/*!*********************************!*\
  !*** ./src/js/convert/imgur.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   upload: () => (/* binding */ upload)
/* harmony export */ });
async function upload(image){
    const formData = new FormData();
    formData.append('image', image);
    formData.append('type', 'base64');

    const resp = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            'Authorization': 'Client-ID 134a48816a3c4d6'
        },
        body: formData,
        redirect: 'follow'
    })
    const json = await resp.json();
    if(!json.success) throw new Error('Imgur upload eror');

    return json.data.link;
}

window.imgurUpload = upload;

/***/ },

/***/ "./src/js/convert/imgzoom.js"
/*!***********************************!*\
  !*** ./src/js/convert/imgzoom.js ***!
  \***********************************/
(module, __unused_webpack_exports, __webpack_require__) {

/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
// Нагло спизжено у pxlsfiddle
// Модифицировано
const imgZoom = {
    dlg: null,
    canvas: null,
    scaleLabel: null,
    customLabel: null,
  
    scales: [2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 17, 20, 24, 28, 32], // empirically determined; originally 17 was 16, but a simple polynomial of n=3 fit showed that value was an outlier. So is 8, but by half, and scaling non-integer? no thanks.
    scaleIndex: 2, // scale = 4
  
    src: null,
  
    // get the mouse position relative to an image based on its original size
    getImgMousePos(element, e) {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const paddingRect = {
        left: parseInt(style.paddingLeft, 10),
        right: parseInt(style.paddingRight, 10),
        top: parseInt(style.paddingTop, 10),
        bottom: parseInt(style.paddingBottom, 10)
      };
  
      return {
        x: (e.clientX - rect.left - paddingRect.left) / (rect.width - (paddingRect.left + paddingRect.right)) * element.naturalWidth,
        y: (e.clientY - rect.top - paddingRect.top) / (rect.height - (paddingRect.top + paddingRect.bottom)) * element.naturalHeight
      };
    },
  
    // sets up event handlers for a given image element to pop up the zoom window
    createZoomHandler(el, cb) {
      el.onmouseenter = function () {
        imgZoom.src = el;
        const scale = imgZoom.scales[imgZoom.scaleIndex];
        imgZoom.scaleLabel.textContent = `${el.width}x${el.height}px; pixel zoom x${scale}`;
        imgZoom.canvas.width = el.naturalWidth;
        imgZoom.canvas.height = el.naturalHeight;
        imgZoom.canvas.getContext("2d").drawImage(el, 0, 0);
        imgZoom.dlg.style.display = "block";
      };
      el.onmouseleave = function () {
        imgZoom.src = null;
        imgZoom.customLabel.style.display = "none";
        imgZoom.dlg.style.display = "none";
      };
      el.onmousemove = function (e) {
        const scale = imgZoom.scales[imgZoom.scaleIndex];
  
        const mousePos = imgZoom.getImgMousePos(el, e);
        imgZoom.canvas.style.transform = `scale(${scale})`;
        imgZoom.canvas.style.left = `${imgZoom.dlg.offsetWidth / 2 - mousePos.x * scale - scale / 2}px`;
        imgZoom.canvas.style.top = `${imgZoom.dlg.offsetHeight / 2 - mousePos.y * scale - scale / 2}px`;
  
        if (typeof cb !== "undefined") {
          cb(el, mousePos, scale);
  
          return true;
        }
  
        return true;
      };
      el.onwheel = function (e) {
        if (e.altKey) {
          if (e.deltaY < 0) {
            imgZoom.scaleIndex = Math.min(imgZoom.scaleIndex + 1, imgZoom.scales.length - 1);
          } else if (e.deltaY > 0) {
            imgZoom.scaleIndex = Math.max(imgZoom.scaleIndex - 1, 0);
          }
          if (e.deltaY !== 0) {
            const scale = imgZoom.scales[imgZoom.scaleIndex];
            imgZoom.scaleLabel.textContent = `pixel zoom x${scale}`;
            el.onmousemove(e);
          }
          e.preventDefault();
        }
      };
      el.onclick = () => {
        if (!$(el).hasClass('zoomed')) {
          $(el).addClass('zoomed');
          $(el).css('width', '');
        } else {
          $(el).removeClass('zoomed');
          $(el).css('width', Math.min(parseInt($(el).parent().css('width')) / 2, $(el)[0].width));
          console.log($(el).parent().css('width'), $(el).parent(), 2)
        }
      }
    },
    refresh() {
      // imgZoom.canvas.width = imgZoom.src.width;
      // imgZoom.canvas.height = imgZoom.src.height;
      if (typeof imgZoom.src.naturalWidth !== "undefined") {
        imgZoom.canvas.width = imgZoom.src.naturalWidth;
        imgZoom.canvas.height = imgZoom.src.naturalHeight;
      } else {
        imgZoom.canvas.width = imgZoom.src.width;
        imgZoom.canvas.height = imgZoom.src.height;
      }
      imgZoom.canvas.getContext("2d").drawImage(imgZoom.src, 0, 0);
    },
    init() {
      const tmp = document.createElement("template");
      tmp.innerHTML = `<div id="_imgZoom" style="z-index:1555; background-color:rgba(0,0,0,0); position:fixed; top:0; right:0; border-width:0 0 2px 2px; border-style:solid; border-color:#000; border-radius:0 0 0 5px; padding:0 2px; text-align:right; pointer-events:none; display:none; width:50vw; height:50vh; overflow:hidden;"><canvas id="_imgZoomCanvas" style="position:absolute; image-rendering:-moz-crisp-edges; image-rendering:pixelated; transform-origin:0 0; transform:scale(4);"></canvas><strong id="_imgZoomLevel" style="background-color:#404040; border-radius:5px 0 0 0; padding:2px; position:absolute; bottom:0; right:0;">pixel zoom x4</strong><strong id="_imgZoomLabel" style="background-color:#404040; border-radius:0 5px 0 0; padding:2px; position:absolute; bottom:0; left:0; max-width:300px"></strong><div id="_imgZoomCrosshair" style="opacity:0.25;"><div style="background-color:#000; width:2px; height:20px; position:absolute; top:calc(50% - 10px); left:calc(50% - 1px);"></div><div style="background-color:#000; height:2px; width:20px; position:absolute; top:calc(50% - 1px); left:calc(50% - 10px);"></div></div></div>`;
      this.dlg = tmp.content.firstChild;
      document.body.appendChild(this.dlg);
      this.canvas = document.getElementById("_imgZoomCanvas");
      this.scaleLabel = document.getElementById("_imgZoomLevel");
      this.customLabel = document.getElementById("_imgZoomLabel");
  
      // zoom handlers for pixel images
      const pixelImages = document.querySelectorAll(".zoom");
      for (const imgElement of pixelImages) {
        this.createZoomHandler(imgElement);
      }
  
      // zoom handlers for future pixel images
      function cb(mutations) {
        for (const mut of mutations) {
          for (const addedNode of mut.addedNodes) {
            if (addedNode.querySelectorAll) {
              const zoomElements = addedNode.querySelectorAll("img.zoom");
              for (const el of zoomElements) {
                imgZoom.createZoomHandler(el);
              }
            }
          }
        }
      };
      const observer = new MutationObserver(cb);
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  };
  imgZoom.init();

  module.exports = imgZoom

/***/ },

/***/ "./src/js/convert/main.js"
/*!********************************!*\
  !*** ./src/js/convert/main.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_converters_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../css/converters.css */ "./src/css/converters.css");
/* harmony import */ var _img_folder_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../img/folder.png */ "./src/img/folder.png");
/* harmony import */ var _img_pattern_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../img/pattern.png */ "./src/img/pattern.png");
/* harmony import */ var _img_palette_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../img/palette.png */ "./src/img/palette.png");
/* harmony import */ var _img_palette2_png__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../img/palette2.png */ "./src/img/palette2.png");
/* harmony import */ var _setImmediate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./setImmediate */ "./src/js/convert/setImmediate.js");
/* harmony import */ var _setImmediate__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_setImmediate__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _palettes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./palettes */ "./src/js/convert/palettes.js");
/* harmony import */ var _converterWASM__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./converterWASM */ "./src/js/convert/converterWASM.js");
/* harmony import */ var _converterWASM__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_converterWASM__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./color */ "./src/js/convert/color.js");
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_color__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _patterns__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./patterns */ "./src/js/convert/patterns.js");
/* harmony import */ var _imgzoom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./imgzoom */ "./src/js/convert/imgzoom.js");
/* harmony import */ var _imgzoom__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_imgzoom__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _openImage__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./openImage */ "./src/js/convert/openImage.js");
/* harmony import */ var _resize__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./resize */ "./src/js/convert/resize.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./dom */ "./src/js/convert/dom.js");
/* harmony import */ var _imgur__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./imgur */ "./src/js/convert/imgur.js");
/* harmony import */ var _ditherer__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./ditherer */ "./src/js/convert/ditherer.js");
/* harmony import */ var _matrices_errorDiffusion__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./matrices/errorDiffusion */ "./src/js/convert/matrices/errorDiffusion.js");
/* harmony import */ var _translate__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../translate */ "./src/js/translate.js");
/* harmony import */ var _utils_api__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../utils/api */ "./src/js/utils/api.js");
/* harmony import */ var _utils_misc__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../utils/misc */ "./src/js/utils/misc.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* provided dependency */ var toastr = __webpack_require__(/*! toastr */ "./node_modules/toastr/toastr.js");




























(async () => {
    const module = await (_converterWASM__WEBPACK_IMPORTED_MODULE_7___default());
    window.convModule = module;
    window.clrManip = (_color__WEBPACK_IMPORTED_MODULE_8___default());
})();


(0,_translate__WEBPACK_IMPORTED_MODULE_17__.init)();

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
    Object.keys(_palettes__WEBPACK_IMPORTED_MODULE_6__["default"]).forEach(key => {
        const newEl = $(`<option id="p_${key}">${key}</option>`);
        newEl.val(key);

        if (key === selected) {
            paletteSelected = true;
            newEl.attr('selected', '');
            palUtils.setPalette(_palettes__WEBPACK_IMPORTED_MODULE_6__["default"][key]);
        }


        paletteSel.prepend(newEl);
    });

    // in case some palette was deleted
    if (!paletteSelected) {
        $('#p_goroxels1').attr('selected', '');
        palUtils.setPalette(_palettes__WEBPACK_IMPORTED_MODULE_6__["default"]['goroxels1']);
    }
    paletteSel.append('<option value="_custom">custom</option>');
}

paletteSel.on('change', () => {
    const val = paletteSel.val();

    if (val === "_custom") {
        $('#userPalette').show();
    } else {
        $('#userPalette').hide();

        const pal = _palettes__WEBPACK_IMPORTED_MODULE_6__["default"][val];

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

                return _color__WEBPACK_IMPORTED_MODULE_8___default().hex2rgb(el);
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
        paletteLAB = paletteRGB.map((_color__WEBPACK_IMPORTED_MODULE_8___default().rgb2lab));
        paletteOKLab = paletteRGB.map((_color__WEBPACK_IMPORTED_MODULE_8___default().rgb2okLAB));
        palette32 = paletteRGB.map((_color__WEBPACK_IMPORTED_MODULE_8___default().rgb2uint32));

        this.ditherPalette();
    },
    ditherPalette() {
        if ($('#ditheringMode').val() !== 'check') return;

        // спи.. взято на вооружение!
        this.colorValuesExRGB = [];
        this.colorValuesExLab = [];
        this.colorValuesExOkLab = [];

        const isOklab = $('#colorfunc').val() === 'oklab';
        const clrDiffFn = isOklab ? (_color__WEBPACK_IMPORTED_MODULE_8___default().mOklabDiff) : (_color__WEBPACK_IMPORTED_MODULE_8___default().mciede2000);
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
                        const mix = _color__WEBPACK_IMPORTED_MODULE_8___default().mixColors(col1, col2);
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
                this.colorValuesExOkLab[idx] = _color__WEBPACK_IMPORTED_MODULE_8___default().rgb2okLAB(val.map(x => x | 0));

                this.colorValuesExOkLab[idx][3] = val[3];
                this.colorValuesExOkLab[idx][4] = val[4];

            } else {
                this.colorValuesExLab[idx] = _color__WEBPACK_IMPORTED_MODULE_8___default().rgb2lab(val);
                this.colorValuesExLab[idx][3] = val[3];
                this.colorValuesExLab[idx][4] = val[4];
            }
        });
    }
}

let palImageChanged = false;
$('#palFolder').on('click', () => {
    (0,_openImage__WEBPACK_IMPORTED_MODULE_11__["default"])(dataURL => {
        palImageChanged = true;
        $('#palInput').val((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('[file]'));
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
        $('#palInput').val((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('[clipboard]'));
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

(0,_dom__WEBPACK_IMPORTED_MODULE_13__.linkNumberRangeInputs)($('#resizeXInput')[0], $('#resizeXRange')[0])
;(0,_dom__WEBPACK_IMPORTED_MODULE_13__.linkNumberRangeInputs)($('#resizeYInput')[0], $('#resizeYRange')[0])

function converterPreload(showWarn = true) {
    let path = $('#palInput').val();
    if ($('#palInput').data('source') !== 'dataURL') {
        if (!path.length) {
            return showWarn && toastr.error((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('Choose a image!'));
        }

        if (utils.isURLValid(path)) {
            startPaletteConverter(path);
        } else {
            return showWarn && toastr.error((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('Invalid link!'));
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
                const { result, pixelSize } = (0,_resize__WEBPACK_IMPORTED_MODULE_12__.isImagePixelArt)(canvas);
                if (!result) {
                    toastr.warning((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('warn.notPixelArt'));
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


            canvas = (0,_resize__WEBPACK_IMPORTED_MODULE_12__.resizeCanvas)(canvas, resizeWidth, resizeHeight, withAA);
            ctx = canvas.getContext('2d');
        }

        tempImg = null;

        try {
            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch (e) {
            return toastr.error((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('Image is loaded, but pixels can not be shown. Try to load it on Imgur or download->upload from file'))
        }

        const contrast = +$('#colorAdj').val();
        const brightness = +$('#brightAdj').val();
        imgData = _color__WEBPACK_IMPORTED_MODULE_8___default().adjustGamma(imgData, contrast, brightness);

        const doNotConvert = $('#doNotConvert').is(':checked');

        if (doNotConvert) {
            ctx.putImageData(imgData, 0, 0);

            onDone(canvas, 'palOut',
                () => {
                    toastr.info((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('onDone.didNotConvert'));
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
                convGen = ditherer.errorDiffusion(imgData, _matrices_errorDiffusion__WEBPACK_IMPORTED_MODULE_16__["default"].floydSteinberg);
                break;
            case 'stuki':
                convGen = ditherer.errorDiffusion(imgData, _matrices_errorDiffusion__WEBPACK_IMPORTED_MODULE_16__["default"].stuki);
                break;
            case 'sierra':
                convGen = ditherer.errorDiffusion(imgData, _matrices_errorDiffusion__WEBPACK_IMPORTED_MODULE_16__["default"].sierraTwo);
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
                        toastr.success(`${(0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('Done in')} ${(Date.now() - startTime) / 1000}${(0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('s.')}`);
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
    patterns: _patterns__WEBPACK_IMPORTED_MODULE_9__.patterns,
    defaultPattern: _patterns__WEBPACK_IMPORTED_MODULE_9__.defaultPattern,
    patternSize: Math.sqrt(_patterns__WEBPACK_IMPORTED_MODULE_9__.patterns[0].length),

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
    ;(0,_openImage__WEBPACK_IMPORTED_MODULE_11__["default"])(dataURL => {
        $('#patInput').val((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('[file]'));
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
        $('#patInput').val((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('[clipboard]'));
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
            return toastr.error((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('Choose a image!'));
        }

        if (utils.isURLValid(path) && utils.isURLImage(path)) {
            patternatorStart(path);
        } else {
            return toastr.error((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('Invalid link!'));
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
            return toastr.error((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('Image is loaded, but pixels can not be gotten. Try to load it on Imgur or download->upload from file'))
        }

        toastr.warning((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('If your image is big, go make a tea and watch Doctor Who'));
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
                        toastr.success(`${(0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('Done in')} ${(Date.now() - startTime) / 1000}s.`);
                    });
            } else {
                patUtils.converterInterval = setTimeout(rec);
            }
        });
    }

    tempImg.onerror = () => {
        toastr.error((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('Unknown image loading error. Maybe CORS, so try to upload on Imgur'))
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

            const nameInput = $(`<input type="text" placeholder="${(0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('template_name_desc')}">`)
                .addClass('template-name');

            const namesContainer = $('<div/>');
            namesContainer.append(namesSelect, nameInput);

            const patternContainer = $('<div class="checkbox-container"></div>');
            const patternCheckbox = $('<input type="checkbox" id="convertToPattern" checked>')
                .addClass('pattern-checkbox');
            const patternLabel = $(`<label for="convertToPattern">${(0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('template_patternize')}</label>`);
            patternContainer.append(patternCheckbox, patternLabel);

            const publicContainer = $('<div class="checkbox-container"></div>');
            const publicCheckbox = $('<input type="checkbox" id="isPublicTemplate">')
                .addClass('public-checkbox');
            const publicLabel = $(`<label for="isPublicTemplate">${(0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('template_is_public')}</label>`);
            publicContainer.append(publicCheckbox, publicLabel);

            const confirmButton = $(`<button>${(0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('upload_to_goroxels')}</button>`).addClass('confirm-upload');
            prompt.append(thumbImg, namesContainer, patternContainer, publicContainer, confirmButton);
            $('body').append(prompt);

            async function onConfirmClick() {
                confirmButton.prop('disabled', true);

                const templateName = nameInput.val().trim();
                if (templateName.length < 3 || templateName.length > 32) {
                    toastr.error((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('template_name_shit'));
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
                            await (0,_utils_misc__WEBPACK_IMPORTED_MODULE_19__.sleep)(0);
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
                        (0,_utils_api__WEBPACK_IMPORTED_MODULE_18__.processApiErrors)(result.errors);
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
                        toastr.warning((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('you_need_login_to_use_this_feature'));
                        prompt.remove();
                        return;
                    }
                    (0,_utils_api__WEBPACK_IMPORTED_MODULE_18__.processApiErrors)(result.errors);
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
            <div class="line"><button class="uploadButton"> ${(0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('Upload on imgur!')}</button></div>
            ${convClass === 'palOut' ? `<div class="line"><button class="uploadGrokselsButton">${(0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('upload_to_goroxels')}</button></div>` : ''}
            <div class="line"><span class="uploadedUrl"></span></div>
            ${convClass === 'patOut' ? `<div class="line">${(0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('Final image size:')} ${canvas.width}x${canvas.height}</div>` : ''}
            <div class="line"><button class="copyToClipButton">${(0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('copy_canvas_btn')}</button></div>
            <div class="line"><button class="downloadButton">${(0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('download_canvas_btn')}</button></div>
        </div>`
    );
    _imgzoom__WEBPACK_IMPORTED_MODULE_10___default().createZoomHandler($(`#${convClass}`).children(0)[0]);

    $(`#${convClass} .uploadButton`).one('click', async () => {
        $(`#${convClass} .uploadedUrl`).text('Uploading...');

        try {
            const link = await (0,_imgur__WEBPACK_IMPORTED_MODULE_14__.upload)(canvas.toDataURL().split(",")[1]);
            const isPNG = link.endsWith('png');
            if (!isPNG) {
                toastr.warn('JPEG!!!');
                throw new Error;
            }

            $(`#${convClass} .uploadedUrl`).html(
                `<span style="color:rgb(0, 190, 0)">${link}${convClass === 'patOut' ? `?width=${canvas.width / 7}` : ''}</span>`
            )
        } catch {
            const text = (0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('Imgur upload failed, try upload manually');
            let html;
            if (convClass === 'patOut') {
                html = `${text}<br><input id="patternLinkGenerator" placeholder="${(0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('insert_link_here')}">&nbsp;<span id="patternLink"></span>`;
                setTimeout(() => {
                    const span = $('#patternLink');
                    $('#patternLinkGenerator').on('input', e => {
                        const input = e.target;
                        let link = input.value;
                        input.style.backgroundColor = '';

                        if (link.includes('imgur') && !link.endsWith('.png')) {
                            if (link.includes('/a/')) {
                                input.style.backgroundColor = 'red';
                                return span.text((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('imgur_album_link'))
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
            .then(() => toastr.success((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('img_copied_success')));
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
        copyToClipboard(e.target.innerText).then(() => toastr.success((0,_translate__WEBPACK_IMPORTED_MODULE_17__.translate)('conv.url_copied_success')));
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
palUtils.ditherer = new _ditherer__WEBPACK_IMPORTED_MODULE_15__.Ditherer(paletteRGB, $('#colorfunc').val());

/***/ },

/***/ "./src/js/convert/matrices/errorDiffusion.js"
/*!***************************************************!*\
  !*** ./src/js/convert/matrices/errorDiffusion.js ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    //      X   7
    //  3   5   1
    floydSteinberg: [
        [7 / 16, 1, 0],
        [3 / 16, -1, 1],
        [5 / 16, 0, 1],
        [1 / 16, 1, 1]
    ],
    //          X   8   4 
    //  2   4   8   4   2
    //  1   2   4   2   1
    stuki: [
        [8 / 42, 1, 0],
        [4 / 42, 2, 0],
        [2 / 42, -2, 1],
        [4 / 42, -1, 1],
        [8 / 42, 0, 1],
        [4 / 42, 1, 1],
        [2 / 42, 2, 1],
        [1 / 42, -2, 2],
        [2 / 42, -1, 2],
        [4 / 42, 0, 2],
        [2 / 42, 1, 2],
        [1 / 42, 2, 2],
    ],
    //          X   4   3
    //  1   2   3   2   1
    sierraTwo: [
        [4 / 16, 1, 0],
        [3 / 16, 2, 0],
        [1 / 16, -2, 1],
        [2 / 16, -1, 1],
        [3 / 16, 0, 1],
        [2 / 16, 1, 1],
        [1 / 16, 2, 1],
    ],
});

/***/ },

/***/ "./src/js/convert/openImage.js"
/*!*************************************!*\
  !*** ./src/js/convert/openImage.js ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// https://stackoverflow.com/questions/3582671/how-to-open-a-local-disk-file-with-javascript
// copied and edited

function clickElem(elem) {
    // Thx user1601638 on Stack Overflow (6/6/2018 - https://stackoverflow.com/questions/13405129/javascript-create-and-save-file )
    var eventMouse = document.createEvent("MouseEvents")
    eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    elem.dispatchEvent(eventMouse)
}

function openImage(callback) {
    const readFile = function (e) {
        document.body.removeChild(fileInput);

        var file = e.target.files[0];
        if (!file) return;

        var reader = new FileReader();
        reader.onload = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(file);
    }
    const fileInput = document.createElement("input");
    fileInput.type = 'file';
    fileInput.accept = 'image/png';
    fileInput.style.display = 'none';
    fileInput.onchange = readFile;
    document.body.appendChild(fileInput);
    clickElem(fileInput);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (openImage);

/***/ },

/***/ "./src/js/convert/palettes.js"
/*!************************************!*\
  !*** ./src/js/convert/palettes.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   loadGamePalettes: () => (/* binding */ loadGamePalettes)
/* harmony export */ });
/* provided dependency */ var toastr = __webpack_require__(/*! toastr */ "./node_modules/toastr/toastr.js");
let palettes = {
    goroxels1: [
        [255, 255, 255],
        [180, 180, 180],
        [133, 133, 133],
        [90, 90, 90],
        [61, 61, 61],
        [30, 30, 30],
        [19, 19, 19],
        [0, 0, 0],
        [14, 7, 27],
        [26, 25, 50],
        [42, 47, 78],
        [66, 76, 110],
        [101, 115, 146],
        [146, 161, 185],
        [216, 220, 255],
        [187, 254, 255],
        [12, 241, 255],
        [0, 205, 249],
        [0, 172, 237],
        [0, 152, 220],
        [0, 105, 170],
        [0, 57, 109],
        [3, 25, 63],
        [28, 20, 67],
        [37, 27, 90],
        [56, 42, 115],
        [88, 56, 143],
        [133, 72, 202],
        [168, 113, 231],
        [255, 173, 225],
        [228, 109, 230],
        [202, 72, 202],
        [146, 220, 186],
        [93, 175, 141],
        [50, 132, 100],
        [35, 103, 78],
        [36, 82, 59],
        [26, 122, 62],
        [20, 160, 46],
        [89, 193, 53],
        [156, 219, 67],
        [185, 228, 90],
        [255, 235, 87],
        [255, 200, 37],
        [255, 162, 20],
        [237, 118, 20],
        [234, 89, 22],
        [195, 64, 3],
        [57, 31, 33],
        [93, 44, 40],
        [138, 72, 54],
        [191, 111, 74],
        [230, 156, 105],
        [246, 202, 159],
        [255, 223, 191],
        [246, 129, 135],
        [245, 85, 93],
        [234, 50, 60],
        [196, 36, 48],
        [137, 30, 43],
        [87, 28, 39],
        [59, 20, 67],
        [98, 36, 97],
        [147, 56, 143]
    ],
    goroxels2: [[46, 34, 47], [62, 53, 70], [98, 85, 101], [150, 108, 108], [171, 148, 122], [105, 79, 98], [127, 112, 138], [155, 171, 178], [199, 220, 208], [255, 255, 255], [110, 39, 39], [179, 56, 49], [234, 79, 54], [245, 125, 74], [174, 35, 52], [232, 59, 59], [251, 107, 29], [247, 150, 23], [249, 194, 43], [122, 48, 69], [158, 69, 57], [205, 104, 61], [230, 144, 78], [251, 185, 84], [76, 62, 36], [103, 102, 51], [162, 169, 71], [213, 224, 75], [251, 255, 134], [22, 90, 76], [35, 144, 99], [30, 188, 115], [145, 219, 105], [205, 223, 108], [49, 54, 56], [55, 78, 74], [84, 126, 100], [146, 169, 132], [178, 186, 144], [11, 94, 101], [11, 138, 143], [14, 175, 155], [48, 225, 185], [143, 248, 226], [50, 51, 83], [72, 74, 119], [77, 101, 180], [77, 155, 230], [143, 211, 255], [69, 41, 63], [107, 62, 117], [144, 94, 169], [168, 132, 243], [234, 173, 237], [117, 60, 84], [162, 75, 111], [207, 101, 127], [237, 128, 153], [131, 28, 93], [195, 36, 84], [240, 79, 120], [246, 129, 129], [252, 167, 144], [253, 203, 176]],
    pixelzone: [
        [38, 38, 38],
        [0, 0, 0],
        [128, 128, 128],
        [255, 255, 255],
        [153, 98, 61],
        [255, 163, 200],
        [207, 115, 230],
        [128, 0, 128],
        [229, 0, 0],
        [229, 137, 0],
        [229, 229, 0],
        [150, 230, 70],
        [0, 190, 0],
        [0, 230, 230],
        [0, 136, 204],
        [0, 0, 230]
    ],
    pixelplanet: [
        [255, 255, 255],
        [228, 228, 228],
        [196, 196, 196],
        [136, 136, 136],
        [78, 78, 78],
        [0, 0, 0],
        [244, 179, 174],
        [255, 167, 209],
        [255, 84, 178],
        [255, 101, 101],
        [229, 0, 0],
        [154, 0, 0],
        [254, 164, 96],
        [229, 149, 0],
        [160, 106, 66],
        [96, 64, 40],
        [245, 223, 176],
        [255, 248, 137],
        [229, 217, 0],
        [148, 224, 68],
        [2, 190, 1],
        [104, 131, 56],
        [0, 101, 19],
        [202, 227, 255],
        [0, 211, 221],
        [0, 131, 199],
        [0, 0, 234],
        [25, 25, 115],
        [207, 110, 228],
        [130, 0, 128],
    ],
    pixelplace: [
        [255, 255, 255],
        [196, 196, 196],
        [136, 136, 136],
        [34, 34, 34],
        [255, 167, 209],
        [229, 0, 0],
        [229, 149, 0],
        [160, 106, 66],
        [229, 217, 0],
        [148, 224, 68],
        [2, 190, 1],
        [0, 211, 221],
        [0, 131, 199],
        [0, 0, 234],
        [207, 110, 228],
        [130, 0, 128],
        [255, 223, 204],
        [85, 85, 85],
        [0, 0, 0],
        [236, 8, 236],
        [107, 0, 0],
        [255, 57, 4],
        [99, 60, 31],
        [81, 225, 25],
        [0, 102, 0],
        [54, 186, 255],
        [4, 75, 255]
    ],
    wplaceFree: [[0, 0, 0], [60, 60, 60], [120, 120, 120], [210, 210, 210], [255, 255, 255], [96, 0, 24], [237, 28, 36], [255, 127, 39], [246, 170, 9], [249, 221, 59], [255, 250, 188], [14, 185, 104], [19, 230, 123], [135, 255, 94], [12, 129, 110], [16, 174, 166], [19, 225, 190], [40, 80, 158], [64, 147, 228], [96, 247, 242], [107, 80, 246], [153, 177, 251], [120, 12, 153], [170, 56, 185], [224, 159, 249], [203, 0, 122], [236, 31, 128], [243, 141, 169], [104, 70, 52], [149, 104, 42], [248, 178, 119]],
    wplacePremium: [[0, 0, 0], [60, 60, 60], [120, 120, 120], [210, 210, 210], [255, 255, 255], [96, 0, 24], [237, 28, 36], [255, 127, 39], [246, 170, 9], [249, 221, 59], [255, 250, 188], [14, 185, 104], [19, 230, 123], [135, 255, 94], [12, 129, 110], [16, 174, 166], [19, 225, 190], [40, 80, 158], [64, 147, 228], [96, 247, 242], [107, 80, 246], [153, 177, 251], [120, 12, 153], [170, 56, 185], [224, 159, 249], [203, 0, 122], [236, 31, 128], [243, 141, 169], [104, 70, 52], [149, 104, 42], [248, 178, 119], [170, 170, 170], [165, 14, 30], [250, 128, 114], [228, 92, 26], [214, 181, 148], [156, 132, 49], [197, 173, 49], [232, 212, 95], [74, 107, 58], [90, 148, 74], [132, 197, 115], [15, 121, 159], [187, 250, 242], [125, 199, 255], [77, 49, 184], [74, 66, 132], [122, 113, 196], [181, 174, 241], [219, 164, 99], [209, 128, 81], [255, 197, 165], [155, 82, 73], [209, 128, 120], [250, 182, 164], [123, 99, 82], [156, 132, 107], [51, 57, 65], [109, 117, 141], [179, 185, 209], [109, 100, 63], [148, 140, 107], [205, 197, 158]]
};
palettes['goroxels1+2 (EXPERT)'] = [...palettes.goroxels1, ...palettes.goroxels2];

async function loadConfig() {
    const resp = await fetch('/config.json');
    return await resp.json();
}

async function loadGamePalettes() {
    try {
        const config = await loadConfig();
        config.canvases.forEach(canvas => {
            palettes['game.' + canvas.name] = canvas.palette;
        });
    } catch (e) {
        toastr.warning('Failed to load game palettes')
    }
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (palettes);

/***/ },

/***/ "./src/js/convert/resize.js"
/*!**********************************!*\
  !*** ./src/js/convert/resize.js ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isImagePixelArt: () => (/* binding */ isImagePixelArt),
/* harmony export */   resizeCanvas: () => (/* binding */ resizeCanvas)
/* harmony export */ });
function resizeCanvas(canvas, width, height, antiAliasing = true) {
    width = Math.max(0, Math.floor(Number(width) || 0));
    height = Math.max(0, Math.floor(Number(height) || 0));
    const dpr = window.devicePixelRatio || 1;
    const targetRatio = antiAliasing ? dpr : 1;

    const prevW = canvas.width;
    const prevH = canvas.height;

    const copyCanvas = document.createElement("canvas");
    copyCanvas.width = Math.max(1, prevW);
    copyCanvas.height = Math.max(1, prevH);
    const copyCtx = copyCanvas.getContext("2d");
    if (prevW && prevH) {
        copyCtx.drawImage(canvas, 0, 0);
    }

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = Math.max(1, Math.round(width * targetRatio));
    canvas.height = Math.max(1, Math.round(height * targetRatio));

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = !!antiAliasing;
    if ("imageSmoothingQuality" in ctx) {
        ctx.imageSmoothingQuality = antiAliasing ? "high" : "low";
    }
    ctx.setTransform(targetRatio, 0, 0, targetRatio, 0, 0);

    if (prevW && prevH) {
        ctx.drawImage(copyCanvas, 0, 0, copyCanvas.width, copyCanvas.height,
            0, 0, width, height);
    }
    return ctx.canvas;
}

// searches for pixel chunks and automatically
// determines them zoom
function isImagePixelArt(canvas) {
    const ctx = canvas.getContext("2d");
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = img.data;

    const maxSize = 10;
    let supposedSize = 0;
    let confirms = 0;
    const maxBound = Math.min(img.width, img.height);

    let curSize = 0;
    let lastSize = 0;
    let lastSizeCombos = 0;
    let lastCol = -1;

    let result = false;
    let pixelSize = 1;

    const encodeClr = (r, g, b) => (r << 16) | (g << 8) | b;

    for (let diagonale = 0; diagonale < maxBound; diagonale++) {
        const idx = (diagonale + diagonale * img.width) * 4;
        const curCol = encodeClr(d[idx], d[idx + 1], d[idx + 2]);

        curSize += 1;

        if (curCol !== lastCol) {
            lastCol = curCol;

            if (curSize === lastSize && lastSize > 0) {
                lastSizeCombos++;

                if (lastSizeCombos >= 1) {
                    if (confirms > 0) {
                        if (confirms >= 1) {
                            result = true;
                            pixelSize = supposedSize;
                            return { result, pixelSize };
                        } else {
                            const div = img.width % supposedSize;
                            if (supposedSize !== lastSize || div !== 0) {
                                return { result: false, pixelSize: 1 };
                            }
                        }
                    }

                    lastSizeCombos = 0;
                    confirms++;
                    supposedSize = lastSize;
                    lastSize = 0;
                }
            } else {
                if (
                    curSize < maxSize &&
                    curSize > 1 &&
                    (curSize < lastSize * 2 || lastSize === 0)
                ) {
                    lastSize = curSize;
                }
                if (lastSize && curSize === 1) {
                    return { result: false, pixelSize: 1 };
                }
            }

            curSize = 0;
        }
    }

    return { result: false, pixelSize: 1 };
}


/***/ },

/***/ "./src/js/convert/setImmediate.js"
/*!****************************************!*\
  !*** ./src/js/convert/setImmediate.js ***!
  \****************************************/
(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof __webpack_require__.g === "undefined" ? this : __webpack_require__.g : self));

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd define */
/******/ 	(() => {
/******/ 		__webpack_require__.amdD = function () {
/******/ 			throw new Error('define cannot be used indirect');
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"converters": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkgoroxels_client"] = self["webpackChunkgoroxels_client"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors","penis"], () => (__webpack_require__("./src/js/convert/main.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=converters.977b1c6b18e0c1e976ef.bundle.js.map