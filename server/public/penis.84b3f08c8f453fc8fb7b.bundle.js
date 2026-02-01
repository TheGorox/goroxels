(self["webpackChunkgoroxels_client"] = self["webpackChunkgoroxels_client"] || []).push([["penis"],{

/***/ "../shared/config.js"
/*!***************************!*\
  !*** ../shared/config.js ***!
  \***************************/
(module) {

const mainPalette = [
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
];

const secondPalette = [[46,34,47],[62,53,70],[98,85,101],[150,108,108],[171,148,122],[105,79,98],[127,112,138],[155,171,178],[199,220,208],[255,255,255],[110,39,39],[179,56,49],[234,79,54],[245,125,74],[174,35,52],[232,59,59],[251,107,29],[247,150,23],[249,194,43],[122,48,69],[158,69,57],[205,104,61],[230,144,78],[251,185,84],[76,62,36],[103,102,51],[162,169,71],[213,224,75],[251,255,134],[22,90,76],[35,144,99],[30,188,115],[145,219,105],[205,223,108],[49,54,56],[55,78,74],[84,126,100],[146,169,132],[178,186,144],[11,94,101],[11,138,143],[14,175,155],[48,225,185],[143,248,226],[50,51,83],[72,74,119],[77,101,180],[77,155,230],[143,211,255],[69,41,63],[107,62,117],[144,94,169],[168,132,243],[234,173,237],[117,60,84],[162,75,111],[207,101,127],[237,128,153],[131,28,93],[195,36,84],[240,79,120],[246,129,129],[252,167,144],[253,203,176]]

module.exports = {
    "canvases": [{
        "name": "main",
        "cooldown": {
            "GUEST": [100, 25],
            "USER": [30, 40],
            "TRUSTED": [0, 32],
            "MOD": [0, 32]
        },
        "chunkSize": 256,
        "boardWidth": 32,
        "boardHeight": 32,
        "palette": [...mainPalette, ...secondPalette],
        "extra": {
            "palettes": [
                {
                    "name": "Goroxels Old",
                    "slice": [0, 64]
                },
                {
                    "name": "Goroxels New",
                    "slice": [64]
                },
            ]
        }
    },
    {
        "name": "test",
        "require": null,
        "cooldown": {
            "GUEST": [100, 16],
            "USER": [50, 32],
            "TRUSTED": [20, 600],
            "MOD": [25, 32]
        },
        "chunkSize": 512,
        "boardWidth": 8,
        "boardHeight": 8,
        "palette": [
            [255, 255, 255],
            [127, 127, 127],
            [0, 0, 0]
        ]
    },
    {
        "name": "timgorox",
        "cooldown": {
            "GUEST": [0, 32],
            "USER": [0, 32],
            "TRUSTED": [0, 32],
            "MOD": [0, 32]
        },
        "chunkSize": 480,
        "boardWidth": 4,
        "boardHeight": 4,
        "palette": mainPalette
    },
    {
        "name": "nsfw",
        "cooldown": {
            "GUEST": [1, 0],
            "USER": [30, 40],
            "TRUSTED": [20, 60],
            "MOD": [0, 32]
        },
        "chunkSize": 256,
        "boardWidth": 10,
        "boardHeight": 5,
        "require": "user",
        "palette": mainPalette
    },
    {
        "name": "timo",
        "cooldown": {
            "GUEST": [1, 0],
            "USER": [30, 40],
            "TRUSTED": [20, 60],
            "MOD": [0, 32]
        },
        "chunkSize": 256,
        "boardWidth": 5,
        "boardHeight": 2,
        "require": "user",
        "palette": mainPalette
    },
    {
        "name": "gorox",
        "cooldown": {
            "GUEST": [1, 0],
            "USER": [30, 40],
            "TRUSTED": [7, 60],
            "MOD": [0, 32]
        },
        "chunkSize": 256,
        "boardWidth": 18,
        "boardHeight": 13,
        "require": "user",
        "palette": mainPalette
    },
    {
        "name": "BEARZ",
        "cooldown": {
            "GUEST": [100, 25],
            "USER": [30, 40],
            "TRUSTED": [0, 32],
            "MOD": [0, 32]
        },
        "chunkSize": 256,
        "boardWidth": 8,
        "boardHeight": 8,
        "palette": mainPalette
    },
    {
        "name": "elka",
        "cooldown": {
            "GUEST": [100, 25],
            "USER": [30, 40],
            "TRUSTED": [0, 32],
            "MOD": [0, 32]
        },
        "chunkSize": 256,
        "boardWidth": 10,
        "boardHeight": 14,
        "palette": [...mainPalette, ...secondPalette],
        "extra": {
            "palettes": [
                {
                    "name": "Goroxels Old",
                    "slice": [0, 64]
                },
                {
                    "name": "Goroxels New",
                    "slice": [64]
                },
            ]
        }
    },
],
    "telek": {
        x: 3280,
        y: 1524,
        size: 250,
        canvas: 0
    }
}

/***/ },

/***/ "./src/img/palettePreviews sync \\.png$"
/*!***********************************************************!*\
  !*** ./src/img/palettePreviews/ sync nonrecursive \.png$ ***!
  \***********************************************************/
(module, __unused_webpack_exports, __webpack_require__) {

var map = {
	"./Goroxels New.png": "./src/img/palettePreviews/Goroxels New.png",
	"./Goroxels Old.png": "./src/img/palettePreviews/Goroxels Old.png"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/img/palettePreviews sync \\.png$";

/***/ },

/***/ "./src/img/palettePreviews/Goroxels New.png"
/*!**************************************************!*\
  !*** ./src/img/palettePreviews/Goroxels New.png ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "/img/Goroxels New.png");

/***/ },

/***/ "./src/img/palettePreviews/Goroxels Old.png"
/*!**************************************************!*\
  !*** ./src/img/palettePreviews/Goroxels Old.png ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + "/img/Goroxels Old.png");

/***/ },

/***/ "./src/js/EventManager.js"
/*!********************************!*\
  !*** ./src/js/EventManager.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventManager)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "./node_modules/events/events.js");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var interactjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! interactjs */ "./node_modules/interactjs/dist/interact.min.js");
/* harmony import */ var interactjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(interactjs__WEBPACK_IMPORTED_MODULE_1__);



function anyInputFocused() {
    return document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA'
}

class EventManager extends (events__WEBPACK_IMPORTED_MODULE_0___default()) {
    /**
     * 
     * @param {Element} element 
     */
    constructor(element) {
        super();

        this.el = element

        this._zoomed = false;

        // true from when two pointers started touch
        // until both of them off
        this.startedGesture = false,
            this.pointers = 0;
        function checkGesture(evName) {
            let wasGesture = this.startedGesture;
            if (evName === 'up') {
                this.pointers = Math.max(this.pointers - 1, 0);
                if (this.pointers == 0) this.startedGesture = false;
            } else if (evName === 'down') {
                if (++this.pointers >= 2)
                    wasGesture = this.startedGesture = true;
            }
            return wasGesture
        }
        checkGesture = checkGesture.bind(this)

        // some of my friends has an issue where 
        // event.movementX/Y sometimes was not present
        let pointerMovementWorkaround = {};

        const FFA_REPLACE_MOVEMENT = true;

        element.addEventListener('pointerdown', e => {
            e.gesture = checkGesture('down');
            this.emit('mousedown', e);
        });
        document.addEventListener('pointermove', e => {
            if (FFA_REPLACE_MOVEMENT || !e.movementX || !e.movementY) {
                // by default, movementX and movementY are read only
                Object.defineProperty(e, 'movementX', {
                    writable: true
                });
                Object.defineProperty(e, 'movementY', {
                    writable: true
                });

                let lastPos = pointerMovementWorkaround[e.pointerId];
                if (!lastPos) {
                    e.movementX = 0;
                    e.movementY = 0;
                } else {
                    e.movementX = e.clientX - lastPos[0];
                    e.movementY = e.clientY - lastPos[1];
                }

                pointerMovementWorkaround[e.pointerId] = [e.clientX, e.clientY];
            }
            // not emitted because Interactjs below will emit this correctly
            if (!checkGesture('move')) {
                this.emit('mousemove', e);
            }
        });
        document.addEventListener('pointerup', e => {
            let pointersCnt = this.pointers;
            e.gesture = checkGesture('up');

            // emit event only if 'pointerdown' event was on canvas
            if (pointersCnt)
                this.emit('mouseup', e);

            delete pointerMovementWorkaround[e.pointerId];
        });

        interactjs__WEBPACK_IMPORTED_MODULE_1___default()(element).gesturable({
            onmove: e => {
                // console.log(e);
                this.emit('zoom', e.ds);

                this.emit('mousemove', {
                    buttons: e.buttons,

                    clientX: e.clientX,
                    clientY: e.clientY,

                    movementX: e.dx * devicePixelRatio,
                    movementY: e.dy * devicePixelRatio,

                    gesture: true
                })
            }
        })

        this.tickLoop = setInterval(() => {
            this.emit('tick')
        }, 1000 / 60);

        document.addEventListener('keydown', e => {
            if (!anyInputFocused()) {
                this.emit('keydown', e)
            }
        });

        document.addEventListener('keyup', e => {
            if (!anyInputFocused()) {
                this.emit('keyup', e)
            }
        });

        element.addEventListener('wheel', e => this.emit('wheel', e))
        element.addEventListener('mouseleave', e => this.emit('mouseleave', e))
    }
}

/***/ },

/***/ "./src/js/config.js"
/*!**************************!*\
  !*** ./src/js/config.js ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   allColors: () => (/* binding */ allColors),
/* harmony export */   argbToId: () => (/* binding */ argbToId),
/* harmony export */   bgrPalette: () => (/* binding */ bgrPalette),
/* harmony export */   boardChunkHei: () => (/* binding */ boardChunkHei),
/* harmony export */   boardChunkWid: () => (/* binding */ boardChunkWid),
/* harmony export */   boardHeight: () => (/* binding */ boardHeight),
/* harmony export */   boardWidth: () => (/* binding */ boardWidth),
/* harmony export */   callOnLoad: () => (/* binding */ callOnLoad),
/* harmony export */   canvasId: () => (/* binding */ canvasId),
/* harmony export */   canvasName: () => (/* binding */ canvasName),
/* harmony export */   chunkSize: () => (/* binding */ chunkSize),
/* harmony export */   cooldown: () => (/* binding */ cooldown),
/* harmony export */   currentPalette: () => (/* binding */ currentPalette),
/* harmony export */   currentPaletteColors: () => (/* binding */ currentPaletteColors),
/* harmony export */   download: () => (/* binding */ download),
/* harmony export */   downloaded: () => (/* binding */ downloaded),
/* harmony export */   game: () => (/* binding */ game),
/* harmony export */   hexPalette: () => (/* binding */ hexPalette),
/* harmony export */   palettePreviews: () => (/* binding */ palettePreviews),
/* harmony export */   palettes: () => (/* binding */ palettes),
/* harmony export */   resolveWhenConfigDownloaded: () => (/* binding */ resolveWhenConfigDownloaded),
/* harmony export */   setCurrentPalette: () => (/* binding */ setCurrentPalette),
/* harmony export */   showProtected: () => (/* binding */ showProtected)
/* harmony export */ });
/* harmony import */ var _utils_color__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/color */ "./src/js/utils/color.js");
/* harmony import */ var _utils_localStorage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/localStorage */ "./src/js/utils/localStorage.js");
/* harmony import */ var _shared_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../shared/config */ "../shared/config.js");
/* harmony import */ var _shared_config__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_shared_config__WEBPACK_IMPORTED_MODULE_2__);




let canvasId;
let canvasName, chunkSize, boardWidth, boardHeight, allColors, currentPaletteColors, currentPalette, palettes;
let downloaded = false;

let bgrPalette, hexPalette, boardChunkWid, boardChunkHei, cooldown;

const game = {
    chatLimit: parseInt((0,_utils_localStorage__WEBPACK_IMPORTED_MODULE_1__.getOrDefault)('chatLimit', 100), 10),
    showProtected: false,
};

let palettePreviews = {};
const requirePreview = __webpack_require__("./src/img/palettePreviews sync \\.png$");
requirePreview.keys().map(requirePreview).forEach(path => {
    const filename = path.default.match(/([\w\d_\s]+)\.png$/);
    palettePreviews[filename[1]] = path.default;
});

function setCurrentPalette(palette){
    let startIdx = 0, endIdx = allColors.length;
    if (!palette) {
        currentPaletteColors = allColors;
    } else {
        currentPalette = palette;

        startIdx = palette.slice[0];
        endIdx = palette.slice[1] || endIdx;

        currentPaletteColors = allColors.slice(startIdx, endIdx);
    }

    return [currentPaletteColors, startIdx, endIdx];
}


let argbToId = {};

async function download() {
    const path = document.location.pathname.replace(/[^\d^\w]/g, '');
    const index = _shared_config__WEBPACK_IMPORTED_MODULE_2___default().canvases.findIndex(canvas => canvas.name === path);
    canvasId = index === -1 ? 0 : index;

    const canvasCfg = (_shared_config__WEBPACK_IMPORTED_MODULE_2___default().canvases)[canvasId];

    canvasName = canvasCfg.name;
    chunkSize = canvasCfg.chunkSize;
    boardWidth = canvasCfg.boardWidth * chunkSize;
    boardHeight = canvasCfg.boardHeight * chunkSize;
    allColors = currentPaletteColors = canvasCfg.palette;
    palettes = canvasCfg.extra?.palettes ?? null;

    // Быстрая палитра
    bgrPalette = new Uint32Array(allColors.map(rgb => (0,_utils_color__WEBPACK_IMPORTED_MODULE_0__.rgb2abgr)(...rgb)));
    hexPalette = allColors.map(_utils_color__WEBPACK_IMPORTED_MODULE_0__.rgb2hex);
    boardChunkWid = canvasCfg.boardWidth;
    boardChunkHei = canvasCfg.boardHeight;
    cooldown = canvasCfg.cooldown;

    for (let i = 0; i < bgrPalette.length; i++) {
        argbToId[bgrPalette[i]] = i;
    }

    downloaded = true;
    toCall.forEach(f => f());
    toCall = [];
}

let toCall = [];
function callOnLoad(cb) {
    if (downloaded) cb();
    else toCall.push(cb);
}

function resolveWhenConfigDownloaded() {
    if (downloaded) return Promise.resolve();
    return new Promise(res => {
        const int = setInterval(() => {
            if (downloaded) {
                clearInterval(int);
                res();
            }
        }, 10);
    });
}

function showProtected(show = true) {
    game.showProtected = show;
    globals.chunkManager.chunks.forEach(chunk => chunk.needRender = true);
    globals.renderer.needRender = true;
}


/***/ },

/***/ "./src/js/constants.js"
/*!*****************************!*\
  !*** ./src/js/constants.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ROLE: () => (/* binding */ ROLE),
/* harmony export */   ROLE_I: () => (/* binding */ ROLE_I),
/* harmony export */   keys: () => (/* binding */ keys)
/* harmony export */ });
// key codes to human readable string
// !deprecated!
const keys = { // others are ok with charCodeAt
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: "Space",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    48: "0",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    106: "*",
    107: "+",
    109: "-",
    111: "/",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'"
}

const ROLE = {
    BANNED: -1,
    GUEST: 0,
    USER: 1,
    TRUSTED: 2,
    MOD: 3,
    ADMIN: 4
}
const ROLE_I = {};
Object.keys(ROLE).forEach(x => ROLE_I[ROLE[x]] = x);



/***/ },

/***/ "./src/js/convert/color.js"
/*!*********************************!*\
  !*** ./src/js/convert/color.js ***!
  \*********************************/
(module) {

// Stolen and edited from pxlsfiddle
const colorManip = {
    // Turn a hex color string (without leading '#') into an RGB color array.
    hex2rgb(hex) {
        return [parseInt(hex.substr(0, 2), 16), parseInt(hex.substr(2, 2), 16), parseInt(hex.substr(4, 2), 16)];
    },

    // Bitshift-encode a color (RGB array)
    rgb2enc(rgb) {
        return rgb[0] << 16 | rgb[1] << 8 | rgb[2];
    },

    // Turn an RGB color array into a hex color string (without leading '#')
    rgb2hex(rgb) {
        // const rgbHex = rgb[2] | rgb[1] << 8 | rgb[0] << 16;

        return (0x1000000 + colorManip.rgb2enc(rgb)).toString(16).slice(1);
    },

    // as short-hand, from RGB to L*a*b*
    rgb2lab(col) {
        const rgb = colorManip.srgb2rgb(col);
        const xyz = colorManip.rgb2xyz(rgb);
        const lab = colorManip.xyz2lab(xyz);

        return lab;
    },

    // convert an rgb color to an srgb color
    rgb2srgb(col) {
        const rp = col[0] / 255;
        const gp = col[1] / 255;
        const bp = col[2] / 255;
        const r = (rp < 0.0031308 ? rp * 12.92 : 1.055 * Math.pow(rp, 1 / 2.4) - 0.055) * 255;
        const g = (gp < 0.0031308 ? gp * 12.92 : 1.055 * Math.pow(gp, 1 / 2.4) - 0.055) * 255;
        const b = (bp < 0.0031308 ? bp * 12.92 : 1.055 * Math.pow(bp, 1 / 2.4) - 0.055) * 255;

        return [r, g, b];
    },

    // from rgb to CIE XYZ
    rgb2xyz(col) {
        // D65 / 2&#65533;
        const r = col[0] / 255;
        const g = col[1] / 255;
        const b = col[2] / 255;

        const x = r * 41.2453 + g * 35.7580 + b * 18.0423;
        const y = r * 21.2671 + g * 71.5160 + b * 7.2169;
        const z = r * 1.9334 + g * 11.9193 + b * 95.0227;

        return [x, y, z];
    },

    // convert an srgb color to an rgb color
    srgb2rgb(col) {
        const r = col[0] / 255;
        const g = col[1] / 255;
        const b = col[2] / 255;

        const rp = (r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92) * 255;
        const gp = (g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92) * 255;
        const bp = (b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92) * 255;

        return [rp, gp, bp];
    },

    // from CIE CYZ to CIE L*a*b*
    xyz2lab(xyz) {
        // D65 / 2&#65533; | L*a*b*
        let x = xyz[0] / 95.047;
        let y = xyz[1] / 100.000;
        let z = xyz[2] / 108.883;

        x = x > 0.008856451586 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
        y = y > 0.008856451586 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
        z = z > 0.008856451586 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

        const l = 116 * y - 16;
        const a = 500 * (x - y);
        const b = 200 * (y - z);

        return [l, a, b];
    },

    // from CIE L*a*b* to DIN99-space (an improved perceptually uniform color space)
    lab2din99(lab) {
        // for graphics work, these are set to 1 and are ignored / substituted
        // const kCH = 1;
        // const kE = 1;
        const phi = 26 / 180 * Math.PI;
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);
        const factor = 100 / Math.log(139 / 100);

        // const l = factor / kE * Math.log(1 + 0.0039 * lab[0]); // non-substituted
        const l = factor * Math.log(1 + 0.0039 * lab[0]);
        if (lab[1] === 0 && lab[2] === 0) {
            return [l, 0, 0];
        }
        const e = color.a * cosPhi + color.b * sinPhi;
        const f = 0.83 * (color.b * cosPhi - color.a * sinPhi);
        const G = Math.sqrt(e * e + f * f);
        // const c = Math.log(1 + 0.075 * G) / (0.0435 * kCH * kE); // non-substituted
        const c = Math.log(1 + 0.075 * G) / 0.0435;
        const h = (Math.atan2(f, e) + Phi) / Math.PI * 180;

        return [l, c * Math.cos(h / 180 * Math.PI), c * Math.sin(h / 180 * Math.PI)];
    },

    // Mix two colors, with basic SRGB conversion in mind
    mixColors(col1, col2) {
        let mix = [0, 0, 0];
        const col1p = colorManip.srgb2rgb(col1);
        const col2p = colorManip.srgb2rgb(col2);
        for (let i = 2; i >= 0; i -= 1) {
            mix[i] = (col1p[i] + col2p[i]) / 2;
        }
        mix = colorManip.rgb2srgb(mix);

        // no amount of floating points is ever enough to prevent degradation
        // so we'll just round to 3 digits here, which is still more than enough for color conversions.
        mix[0] = Math.round(mix[0] * 1000) / 1000;
        mix[1] = Math.round(mix[1] * 1000) / 1000;
        mix[2] = Math.round(mix[2] * 1000) / 1000;

        return mix;
    },

    // Let's set up a Look-up table for mapping colors, so we can skip the relatively expensive mapping functions if we've already mapped a given color.
    // See further code comments for how this works.
    mapLUT: [],
    mappedColors: 0,

    // (modified) CIE DE2000 - the best Delta E (color difference) equation-function-thing yet (but only because a few others dropped the ball,
    // these things take forever to make it mainstream, and the mp3 effect; it's 'good enough' and people are hesitant to move to new methods).
    //
    // It works in L*a*b* space which was supposed to be perceptually uniform
    // (so moving a little bit from one color to another color would have that color be 'as different' as if you moved the same amount from any other color)
    // but, surprise, surprise, wasn't quite.
    //
    // So instead of making a new perceptually uniform color space (I mean, L*a*b* does get pretty close without being really obnoxious to transform into,
    // and they *have* been trying - boy have they ever been trying with no less than 12 since the CIEDE2000 proposal up to 2008 alone; and I'm writing this in 2017, so...)
    // color difference functions have just been stretching and warping the CIE L*a*b* color space, and re-interpreting its components, to be more perceptually uniform instead.
    //
    // To paraphrase Shizhe Shen's thesis (see below): "We do not fully understand these phenomena with which we are so familiar - as usual."
    //
    // But as with all these Delta E functions, they are intended for *small* differences,
    // which may not apply when mapping full color images to rather limited pixel art palettes.
    // Example of extreme:
    //   ciede2000([0,0,106], [143 255 0]) >= 119.45710395236401
    //   ciede2000([0,0,106], [142 255 0]) <= 102.44521098432386
    // also, look at the size of this thing and the heavy reliance on square roots and exponentializing.. ew! slow!  This doesn't even count the SRGB > RGB > XYZ > L*a*b* conversion steps.
    // (one of the main reasons people were working on different color spaces so we can just go back to euclidian distances)
    // to make it a bit more speedy, pre-convert colors to L*a*b so it doesn't have to be done repeatedly for each palette entry.
    //
    // And just because CIEDE2000 is such a freakin' nightmare, have some light reading material:
    // CIE 142-2001 - IMPROVEMENT TO INDUSTRIAL COLOUR-DIFFERENCE EVALUATION, technical report.  Draft retrieved from: http://cie.mogi.bme.hu/cie_arch/kee/div1/tc147.pdf
    // ( note: The final paper is behind paywalls and it is, along with many other standards-bodies specifications, heavily policed on the internet.  Information wants to  be ~~free~~ **commercialized**, folks. )
    // The Development of the CIE 2000 Colour-Difference Formula: CIEDE2000.  Paper retrieved from: http://onlinelibrary.wiley.com/doi/10.1002/col.1049/abstract
    // New formula for the Computation of CIE 1976 Hue Difference.  Paper retrieved from: http://onlinelibrary.wiley.com/doi/10.1002/col.5080160311/abstract
    // The CIEDE2000 Color-Difference Formula: Implementation Notes [...].  Paper retrieved from: http://www.ece.rochester.edu/~gsharma/ciede2000/ciede2000noteCRNA.pdf
    // Relative significance of the terms in the CIEDE2000 and CIE94 color-difference formulas.  Paper retrieved from: https://www.osapublishing.org/josaa/ViewMedia.cfm?uri=josaa-21-12-2269
    // Modification of CIEDE2000 for Assessing Color Quality of Image Archives.  Paper retrieved from: https://www.rit.edu/cos/colorscience/mellon/Publications/Berns_SL=1_Archiving_2016.pdf
    // Color difference formula and unfiform color space modeling and evaluation.  Thesis (gj, Shizhe Shen!) retrieved from: http://scholarworks.rit.edu/cgi/viewcontent.cgi?article=5577&context=theses
    //
    // The implementation here is my own (CtrlZ's) based on my own earlier implemention in VB of all things, with modifications to make it run in js, simplification, and added comments.
    // This includes the modification recommended by Berns (this guy colors) to do away with the SL adjustment, which led to the 'm' prefix, just in case anybody decides to copy/paste this, the 'm' in front should make them do some reading.
    //
    // maximum Delta E value <= 120
    // symmetric: true
    mciede2000lab(Lab1, Lab2) {
        const rad = 180 / Math.PI; // this is just for javascript being all about them rads, while the CIEDE2000 function uses degrees.

        // notes on variable names:
        // dX = deltaX, difference between some value in Lab1 and Lab2 or derived values thereof.
        // Xavg = average, average between some value in Lab1 and Lab2 or derived values thereof.
        // Xp = prime ('), as used in the original tech report.

        // Weighting factors.  They're all used as multipliers or divisors, and they're all 1.  So &#65533;\_(&#12484;)_/&#65533;
        // const kL = 1;
        // const kC = 1;
        // const kH = 1;

        // Get the L*, a* and b* values of both input colors.
        const L1 = Lab1[0];
        const a1 = Lab1[1];
        const b1 = Lab1[2];

        const L2 = Lab2[0];
        const a2 = Lab2[1];
        const b2 = Lab2[2];

        // Luminance is fine and needs no modification, so let's get the Luminance difference, and the Luminance average here.
        const dL = L2 - L1;
        // const Lavg = (L1 + L2) / 2.0;

        // We ~~do~~ *don't, see below* need to modify the average though, based on an assumption that the colors of interest to be seen with a surrounding background of L* = 50.
        // const Lavgp = (Lavg - 50.0)*(Lavg - 50.0);
        // In fact, the following parameters are actually set:
        // D65 lighting source at 1000 lux
        // Sample sizes should cover 4&#65533; of the observer's vision (they also need to not be )color) blind; huh.)
        // The two samples should be side-by-side with no space between them, and should be superduperflat and non-reflective (matte, but without texture)

        // Get the 'C' values using the euclidian distance between values on the the a* (red-green) and b* (blue-yellow) axes.
        // This is the same C-for-chroma as in the L*C*h&#65533; color model, very similar to saturation, but actually 'greyness'.
        const C1 = Math.sqrt(a1 * a1 + b1 * b1);
        const C2 = Math.sqrt(a2 * a2 + b2 * b2);

        // Here the a* terms are getting modified.  The reason for this is that where the colors are 'neutral', the differences in the b* term are more readily apparent than in a*.
        // If plotted on a cartesian graph a*/b*, this basically means that areas of 'sameness' in the neutral region appear as ellipses, rather than circles.
        // So why not use an ellipse formula to squash things together into a nice circular shape?  Why not indeed, and that's what's going on here.
        // How much squashing was needed, and how rapidly so depending on Chroma, was determined via fitting, so just roll with the numbers they got.

        // Get the Chroma average.  We're gonna need this to see just how much the squashing needs to be scaled.
        const Cavg = (C1 + C2) / 2.0;

        // const f = 6103515625 // Magic number?  No, just a pre-calculation of Math.pow(25,7).  But seeing as that's a fixed number, why bother with a variable?
        const G = 0.5 * (1 - Math.sqrt(Math.pow(Cavg, 7) / (Math.pow(Cavg, 7) + 6103515625))) + 1; // note: because the paper adds 1 before multiplying with the a* terms, this has been folded in here.
        const a1p = G * a1; // (1 + G) * a1
        const a2p = G * a2; // (1 + G) * a2

        // The b* term is left alone.  The papers 'suggest' this as a new variable b' anyway, but I'm skipping it.
        // const b1p = b1;
        // const b2p = b2;

        // Now that we have the modified a* as a', let's re-do the Chroma calculations.  This is a *modified* Chroma term, so C'.
        const C1p = Math.sqrt(a1p * a1p + b1 * b1); // b1p
        const C2p = Math.sqrt(a2p * a2p + b2 * b2); // b2p
        // And as with the Luminance, we can get their difference and their average, good to go.
        const dCp = C2p - C1p;
        const Cpavg = (C1p + C2p) / 2.0;

        // Now let's figure out the hue angle term.  If you read through the original tech report, this part probably gave you a head-ache.
        // The reason being that they don't mention caveats until later (2.5.1 and 2.6.1) in the report, and provide no formula where this is originally introduced (2.3).
        // See the 'Implementation Notes' paper instead; it's superior for this purpose.
        // This 'h' is the same hue as in L*C*h* as well.  Note that this is 'h' (angle), not 'H' (position in space) - we'll get H later.
        // note: because we didn't make new variables b', presume b1/b2 below to be b1p/b2p from the paper.
        let h1p = -1;
        if (a1p === 0 && b1 === 0) {
            h1p = 0; // if there's no color, then hue is defined as being 0 ('red')
        } else if (b1 >= 0) {
            h1p = Math.atan2(b1, a1p) * rad; // if the b* term is more yellow, take the angle directly
        } else {
            h1p = Math.atan2(b1, a1p) * rad + 360; // but if it's more blue, add 360 degrees so we don't end up with negative angles.  This won't make much sense here, but it will once we start getting the hue *difference* later on.
        }
        // Do the same for the second color.
        let h2p = -1;
        if (a2p === 0 && b2 === 0) {
            h2p = 0;
        } else if (b2 >= 0) {
            h2p = Math.atan2(b2, a2p) * rad;
        } else {
            h2p = Math.atan2(b2, a2p) * rad + 360;
        }
        // So now we basically have our values in L*C*h space, but with a modified C' term, so L*C'h*
        // You might be tempted to think that "L*a'b*" consitutes a color space.  Don't.
        // This is *only* for color difference calculation, and the modification to a* distorts the color space in wonky ways that aren't good for anything much else.

        // Now figure out the diference between these two values.  We're down to equation 2.10 in the draft tech report here.
        // We really want the values to just be -180&#65533; through 180&#65533; around 0 so later calculations involving sin/cos don't freak out.
        let dhp = h2p - h1p;
        if (dhp > 180) {
            dhp -= 360; // so if we ended up with a value that's too big, subtract 360&#65533;
        } else if (dhp < -180) {
            dhp += 360; // and if we ended up with a value that's too small, add 360&#65533;
        }

        // Now for the average hue angle, and a quick refresher in mathematical notations and code interpretation.
        // If you look at the implementation notes paper, you'll see this expressed in mathematical terms as follows using our existing variables and a reminder:
        //
        //         , (h1p+h2p)/2       IF   |h1p-h2p|<=180; C1pC2p != 0
        // hpavg = | (h1p+h2p+360)/2   IF   |h1p-h2p|>180; (h1p+h2p) < 360; C1pC2p != 0
        //         | (h1p+h2p-360)/2   IF   |h1p-h2p|>180; (h1p+h2p) >= 360; C1pC2p != 0
        //         ` (h1p+h2p)         IF   C1pC2p == 0
        //
        // The 'IF' isn't in there, but that's basically what it means.  hpavg is set equal to one of the four values on the left based on the condition on the right being true.
        // Because the first 3 outcomes depend on the condition for the last outcome to NOT be true, might as well start with that one instead.
        let hpavg = -1;
        if (C1p * C2p === 0) { // C1pC2p in the paper omits the multiplication sign as mathematicans often do, but multiplication between those two variables is what is meant.
            hpavg = h1p + h2p;
            // Because 2 of the other outcomes depend on the condition for the first outcome to NOT be true (|h1p-h2p|&#8804;180 == false), might as well use that as the next condition
        } else if (Math.abs(h2p - h1p) <= 180) {
            hpavg = (h1p + h2p) / 2;
            // That leaves us with two options.. either h2p+h1p is less than 360, which will be our next option...
        } else if (h2p + h1p < 360) {
            hpavg = (h1p + h2p + 360) / 2;
            // or it'll be greater than or equal to 360.  No need to specify this, as the previous directly infers it.
        } else {
            hpavg = (h1p + h2p - 360) / 2;
        }

        // So now for some fun further non-uniformity stuff, based on experiments, mostly a factor of the 'color' (chroma&hue) of the colors.
        // SL is a compensation for luma differences.  There's a bit of controversy here, as further research showed that this number may have come into being as the result of a bias toward a single test set (the 'Leeds' set). Gasp.
        // The researchers found that the easiest solution for removing this bias is to simply eliminate the term altogether, by setting S'L to 1.

        // Which, combined with the weighting k'L being set to 1, means that p just ends up equaling dL (Luma difference) - so let's skip that one, too
        // which also means we can skup Lavgp up there, so if you were wondering why that got commented out - now you know.
        // const SL = 1 + (0.015 * Lavgp / Math.sqrt(20 + Lavgp));
        // const p = dL / SL / kL;

        // SC is a compensation for chroma differences.  This is the same one as used in CIE'94, an earlier color difference formula.
        // Nothing out of the ordinary here, sverbatim from the original tech report .. minus the kC weight, seeing as that's just 1.0 anyway.
        const SC = 1 + 0.045 * Cpavg;
        const q = dCp / SC; // dCp / SC/ kC;

        // Told you we'd get H later.  Sort of anyway - since we only care about H positional difference, we can just use the hue *angle* difference directly.
        // From S&#65533;ve's work:
        const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp / rad / 2);

        // SH is a compensation for hue differences.
        // Again, while this looks complex, it's only because this a derived best fit to test samples - thus a lot of magic numbers.
        const T = 1 - 0.17 * Math.cos((hpavg - 30) / rad) + 0.24 * Math.cos(2 * hpavg / rad) + 0.32 * Math.cos((3 * hpavg + 6) / rad) - 0.2 * Math.cos((4 * hpavg - 63) / rad);
        const SH = 1 + 0.015 * Cpavg * T;
        // kH weight is 1, so ignore.
        const r = dHp / SH; // dHp / SH / kH

        // Specific compensation for weird stuff happening in the blue color region.
        // Specifically, the ellipses end up being rotated counter-clockwise.  Not for any particularly good reason, but because human vision.
        // So we'll have to rotate 'm back.. but only in the blue color region, thus here's delta Theta which focuses on the blue region.
        const dTheta = 30 * Math.exp(-1 * ((hpavg - 275) / 25.0) * ((hpavg - 275) / 25.0));
        // Here's another elliptical formula thing focusing on the Chromaticity.
        const RpC = 2 * Math.sqrt(Math.pow(Cpavg, 7) / (Math.pow(Cpavg, 7) + 6103515625));
        // and finally a rotation term (RT in the paper) that combines both into a weighting.
        const RpT = -Math.sin(2 * dTheta / rad) * RpC;

        // Now for the piece the resistance, a good ol' euclidian distance based on the Luma difference, a weighted Chroma difference, a weighted Hue difference, and the rotation term applies to Chroma and Hue.
        const deltaE = Math.sqrt(dL * dL + q * q + r * r + RpT * q * r); // p*P + q*q + r*r + RpT * q * r

        // And that's the color difference.  Hurrah!
        return deltaE;
    },

    // just in case RGB values did need to be compared, inline the RGB to L*a*b* conversion
    mciede2000(col1, col2) {
        return colorManip.mciede2000lab(colorManip.rgb2lab(col1), colorManip.rgb2lab(col2));
    },

    // and just because things are funky in this particular use case...
    // - the palette is pre-converted to L*a*b*
    // - the input image's pixels are in RGB
    // ...offer a mixed version where the first color is rgb and the second is lab
    mciede2000mix(col1rgb, col2lab) {
        return colorManip.mciede2000lab(colorManip.rgb2lab(col1rgb), col2lab);
    },

    // Because CIEDE2000 is relatively slow, we have this one, too.  It's not nearly as accurate,
    // but it does give 'okay' results with much less processing.
    // It also readily beats CIE'94 in both speed and performance when it comes to mapping to limited palettes.
    // This just biases the color differences with their apparent luminance - quick and dirty; Luma-weighted RGB
    // maximum Delta E value <= 1.75
    // symmetric: true
    lwrgbde(col1, col2) {
        const r1 = col1[0];
        const r2 = col2[0];
        const dr = (r1 - r2) / 255;
        const g1 = col1[1];
        const g2 = col2[1];
        const dg = (g1 - g2) / 255;
        const b1 = col1[2];
        const b2 = col2[2];
        const db = (b1 - b2) / 255;
        const l1 = (r1 * 0.299 + g1 * 0.587 + b1 * 0.114) / 255.0;
        const l2 = (r2 * 0.299 + g2 * 0.587 + b2 * 0.114) / 255.0;
        const dl = l1 - l2;

        return (dr * dr * 0.299 + dg * dg * 0.587 + db * db * 0.114) * 0.75 + dl * dl;
    },

    // and because 'why not', let's follow that up with a few other delta E methods that are not nearly as common for computer graphics, or just plain unsuitable (but when has that ever stopped anyone?)
    // Euclidean distance.  Input color values may be any one of RGB, XYZ, LAB
    // Side note: coldist(lab1,lab2) is equal to CIEDE1976, which is was a legit color difference formula before the realized LAB space really wasn't as perceptually uniform as they'd hoped.
    coldist(col1, col2) {
        return Math.sqrt((col2[0] - col1[0]) ** 2 + (col2[1] - col1[1]) ** 2 + (col2[2] - col1[2]) ** 2)
    },
    // Total shade difference.  Input color values may be any one of RGB, XYZ, LAB
    coldiff(col1, col2) {
        return (Math.abs(col2[0] - col1[0]) + Math.abs(col2[1] - col1[1]) + Math.abs(col2[2] - col1[2]));
    },
    // Euclidean distance for HSV / HSL, where the Hue component wraps around
    hsvdist(col1, col2) {
        let distH = Math.abs(col2[0] - col1[0]);
        if (distH > 0.5) {
            distH = 1.0 - distH;
        }
        colA = [...col1]; // make copies so we don't inadvertently change a palette array element
        colB = [...col2];
        colA[0] = 0;
        colB[0] = colH;
        return coldist(colA, colB);
    },
    // Total shade differennce for HSV / HSL, where the Hue component wraps around
    hsvdiff(col1, col2) {
        let diffH = Math.abs(col2[0] - col1[0]);
        if (diffH > 0.5) {
            diffH = 1.0 - distH;
        }
        colA = [...col1]; // make copies so we don't inadvertently change a palette array element
        colB = [...col2];
        colA[0] = 0;
        colB[0] = colH;
        return coldiff(colA, colB);
    },

    mciede1994mix(rgb1, lab2) {
        if (window.suck) {
            return colorManip.ciede1994(lab2, colorManip.rgb2lab(rgb1))
        } else {
            return colorManip.ciede1994(colorManip.rgb2lab(rgb1), lab2)
        }

    },

    // the first improvement over CIEDE1976, CIEDE1994.  Expects [L,A,B],[L,A,B], but internally works on LCH space.
    // note: non-symmetrical.  Reference color should come first, sample color second.
    ciede1994(lab1, lab2) {
        const L1 = lab1[0],
            a1 = lab1[1],
            b1 = lab1[2];
        const L2 = lab2[0],
            a2 = lab2[1],
            b2 = lab2[2];

        // These constants are defined for "graphic arts".  Values for textiles given in comments
        // const KL = 1; // 2
        const K1 = 0.045; // 0.048
        const K2 = 0.015; // 0.014

        // Whereas these are typically unity (i.e. 1; so why have them? very industry-specific use.)
        /*
        const KC = 1;
        const KH = 1;
        const SL = 1;
        */

        // get the LAB difference between the two colors
        const dL = L1 - L2;
        const da = a1 - a2;
        const db = b1 - b2;

        // get the distance between the A and B pairs
        const C1 = Math.sqrt(a1 ** 2 + b1 ** 2)
        const C2 = Math.sqrt(a2 ** 2 + b2 ** 2)
        // and get their difference to find the Chroma difference
        const dC = C1 - C2;

        // and the funky distance between differences to find the Hue component
        const dH = Math.sqrt(da ^ 2 + db ^ 2 - dC ^ 2);

        // industry specific adjustments (see above)
        const SC = 1 + K1 * C1;
        const SH = 1 + K2 * C1;

        // Because some of the constants above are just 1, and multiplying or dividing by 1 does nothing, we can ignore those and substitute in the main formula.
        // ( which is essentially a form of euclidian distance in adjusted LCH space)
        // const dE = Math.sqrt((dL/(KL*SL))**2 + (dC/(KC*SC))**2 + (dH/(KH*SH))**2); // non-substituted form
        const dE = Math.sqrt(dL ** 2 + (dC / SC) ** 2 + (dH / SH) ** 2); // substituted form

        return dE
    },

    // The strangest of common color difference formulas, CMC I:c.  Expects [L,A,B],[L,A,B], but internally works on LCH space.
    // Strangest primarily because it's not symmetrical.  cmcic(col1,col2) gives a different result from cmcic(col2,col1).
    // 'Correct' usage is to set the reference color as the first element, and the sample color as the second element.
    // This formula normally takes 'l' and 'c' weighting elements, but for graphics work these are set to 1, and are thus ignored/substituted.
    // l:1 c:1 = (
    cmcicMix(rgb1, lab2) {
        return colorManip.cmcic(colorManip.rgb2lab(rgb1), lab2)
    },

    cmcic(lab1, lab2) {
        const L1 = lab1[0],
            a1 = lab1[1],
            b1 = lab1[2];
        const L2 = lab2[0],
            a2 = lab2[1],
            b2 = lab2[2];

        const C1 = Math.sqrt(a1 * a1 + b1 * b1);
        let H = Math.atan2(b1, a1);
        H = H + 2 * Math.PI * (H < 0);

        const C2 = Math.sqrt(a2 * a2 + b2 * b2);

        const dL = (L1 - L2) ** 2;
        const dC = (C1 - C2) ** 2;
        const dH = (a1 - a2) ** 2 + (b1 - b2) ** 2 - dC;

        const F = Math.sqrt(Math.pow(C1, 4) / (Math.pow(C1, 4) + 1900));
        const rad = 180 * Math.PI;
        const T = H >= (164 / rad) && H <= (345 / rad) ? 0.56 + Math.abs(0.2 * Math.cos(H + 168 / rad)) : 0.36 + Math.abs(0.4 * Math.cos(H + 35 / rad));

        const Sl = L1 < 16 ? 0.511 : ((0.040975 * L1) / (1 + 0.01765 * L1));
        const Sc = 0.0638 * C1 / (1 + 0.0131 * C1) + 0.638;
        const Sh = Sc * (F * T + 1 - F);

        // dE = Math.sqrt(dL / (l * Sl)**2 +  dC / (c * Sc)**2 + dH / Sh**2); non-substituted
        dE = Math.sqrt(dL / Sl ** 2 + dC / Sc ** 2 + dH / Sh ** 2);

        return dE
    },

    // As mentioned in the comments for ciede2000, its internal results should not be interpreted as a new color space, as they are only useful for color differences.
    // DIN99o (a, b, c, d, ...) actually does turn things around by defining a new pereceptually uniform color space that outperforms LAB.
    // After colors have been transformed, a simple euclidean distance will do.
    // As such, there's no specific formula code here, and coldist() can be called instead.


    euclidianRgb(rgb0, rgb1) {
        var rd = rgb1[0] - rgb0[0],
            gd = rgb1[1] - rgb0[1],
            bd = rgb1[2] - rgb0[2];

        return Math.sqrt(.2126 * rd ** 2 + .7152 * gd ** 2 + .0722 * bd ** 2) / 255;
    },


    // Map a given color to the closest color in a given palette, using a given color difference (Delta E) function.
    mapcolor(col, map, deFunction) {
        // if there were a lot (thousands upon thousands) of colors in the map, slow color difference functions could be sped up a little:
        // get the euclidean distance in LAB space between the color and the map (CIE76)
        // sort that from smallest to largest
        // run the actual intended color difference function on the first N elements of that list
        // this essentially gets a rough color difference first, then refines it using the more expensive color difference function.
        // the lowest value of that second pass ends up being the actual match, which may differ from that of the rough match.
        // because palettes are very limited in number of colors, performing the above steps first actually makes it slower.

        // very simple, just loop over all of the palette colors
        let bestMatch = -1;
        let bestMatchDE = 1e6;
        const mapLength = map.length;
        for (let i = 0; i < mapLength; i += 1) {
            const de = deFunction(col, map[i]); // get the color difference
            if (de < bestMatchDE) { // and if it's smaller, make that palette color the new best match.
                bestMatchDE = de;
                bestMatch = i;
            }
        }

        return bestMatch;
    },
    getColorIndex(col, palette) {
        let result = -1;
        const paletteLength = palette.length;
        for (let i = paletteLength - 1; i >= 0; i -= 1) {
            if (col[0] === palette[i][0] && col[1] === palette[i][1] && col[2] === palette[i][2]) {
                result = i;
                break;
            }
        }

        return result;
    },
    rgb2uint32(rgb) {
        let int = 255 << 24 | rgb[2] << 16 | rgb[1] << 8 | rgb[0];
        // i love js
        int >>>= 0;

        return int
    },
    uint32toRGB(int) {
        return [
            (int & 0xff),
            (int & 0xff00) >> 8,
            (int & 0xff0000) >> 16,
        ]
    },

    // this is not actually gamma correction
    // just +contrast and -brightness
    // hope it will help to convert problematic pictures
    adjustGamma(imageData, contrast, brightness) {
        const data = imageData.data;

        const contrastLUT = new Uint8Array(256);

        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let j = 0; j < 256; j++) {
            let col = j;

            col = factor * (col - 128) + 128;

            col = Math.max(0, Math.min(255, col));

            contrastLUT[j] = col;
        }

        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] === 0) continue;

            let R = data[i],
                G = data[i + 1],
                B = data[i + 2];

            // adjusting contrast

            R = contrastLUT[R];
            G = contrastLUT[G];
            B = contrastLUT[B];

            // adjusting brightness
            R = Math.max(0, Math.min(255, R + brightness));
            G = Math.max(0, Math.min(255, G + brightness));
            B = Math.max(0, Math.min(255, B + brightness));

            data[i] = R;
            data[i + 1] = G;
            data[i + 2] = B;
        }

        return imageData
    },

    _linearTable: null,
    // lazy load lut
    get linearTable() {
        if (cm._linearTable === null) {
            const linearTable = cm._linearTable = new Float32Array(256);
            for (let i = 0; i < 256; i++) {
                linearTable[i] = (i <= 10.31475)
                    ? i / 3294.6
                    : ((i / 269.025 + 0.0513) ** 2.4);
            }
        }
        return cm._linearTable;
    },

    rgb2okLAB(rgb) {
        // linearizing rgb colors
        // it's just a LUT, nothing complicated
        r = cm.linearTable[rgb[0]];
        g = cm.linearTable[rgb[1]];
        b = cm.linearTable[rgb[2]];

        // RGB -> LMS
        const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
        const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
        const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

        // delinearizing lms
        // it's Math.cbrt but (hopefully) optimized for JIT 
        const l_ = l ** (1 / 3);
        const m_ = m ** (1 / 3);
        const s_ = s ** (1 / 3);

        // LMS -> OKLAB
        return [
            0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
            1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
            0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
        ];
    },
    okLAB2rgb(L, A, B) {
        // OKLAB -> LMS
        const l_ = L + 0.3963377774 * A + 0.2158037573 * B;
        const m_ = L - 0.1055613458 * A - 0.0638541728 * B;
        const s_ = L - 0.0894841775 * A - 1.2914855480 * B;

        // linearizing lms back
        const l = l_ * l_ * l_;
        const m = m_ * m_ * m_;
        const s = s_ * s_ * s_;

        // LMS -> linear RGB
        let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
        let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
        let b = -0.0045160939 * l - 0.0051802340 * m + 1.0096961860 * s;

        // linear RGB -> sRGB (applying gamma curve)
        r = r <= 0.0031308 ? r * 12.92 : 1.055 * Math.pow(r, 1 / 2.4) - 0.055;
        g = g <= 0.0031308 ? g * 12.92 : 1.055 * Math.pow(g, 1 / 2.4) - 0.055;
        b = b <= 0.0031308 ? b * 12.92 : 1.055 * Math.pow(b, 1 / 2.4) - 0.055;

        // denormalizing to 8bit
        r = Math.min(Math.max(r, 0), 1) * 255;
        g = Math.min(Math.max(g, 0), 1) * 255;
        b = Math.min(Math.max(b, 0), 1) * 255;

        return [r, g, b];
    },
    // simplest Euclidian distance between something with 3 components
    euclidian(c1, c2){
        const dA = c1[0] - c2[0];
        const dB = c1[1] - c2[1];
        const dC = c1[2] - c2[2];

        return Math.sqrt(dA*dA + dB*dB + dC*dC);
    },
    oklabDiff(oklab1, oklab2){
        return cm.euclidian(oklab1, oklab2);
    },
    mOklabDiffMix(rgb1, oklab1){
        const oklab2 = cm.rgb2okLAB(rgb1);
        return cm.oklabDiff(oklab1, oklab2);
    },
    mOklabDiff(rgb1, rgb2){
        const oklab1 = cm.rgb2okLAB(rgb1);
        const oklab2 = cm.rgb2okLAB(rgb2);
        return cm.oklabDiff(oklab1, oklab2);
    }
};
const cm = colorManip;

module.exports = colorManip

/***/ },

/***/ "./src/js/convert/matrices/bayer.js"
/*!******************************************!*\
  !*** ./src/js/convert/matrices/bayer.js ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const bayer2x2 = [
    [0, 2],
    [3, 1]
];

const bayer4x4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
];

const bayer8x8 = [
    [0, 48, 12, 60, 3, 51, 15, 63],
    [32, 16, 44, 28, 35, 19, 47, 31],
    [8, 56, 4, 52, 11, 59, 7, 55],
    [40, 24, 36, 20, 43, 27, 39, 23],
    [2, 50, 14, 62, 1, 49, 13, 61],
    [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58, 6, 54, 9, 57, 5, 53],
    [42, 26, 38, 22, 41, 25, 37, 21]
];

const bayer16x16 = [
    [0, 128, 32, 160, 8, 136, 40, 168, 2, 130, 34, 162, 10, 138, 42, 170],
    [192, 64, 224, 96, 200, 72, 232, 104, 194, 66, 226, 98, 202, 74, 234, 106],
    [48, 176, 16, 144, 56, 184, 24, 152, 50, 178, 18, 146, 58, 186, 26, 154],
    [240, 112, 208, 80, 248, 120, 216, 88, 242, 114, 210, 82, 250, 122, 218, 90],
    [12, 140, 44, 172, 4, 132, 36, 164, 14, 142, 46, 174, 6, 134, 38, 166],
    [204, 76, 236, 108, 196, 68, 228, 100, 206, 78, 238, 110, 198, 70, 230, 102],
    [60, 188, 28, 156, 52, 180, 20, 148, 62, 190, 30, 158, 54, 182, 22, 150],
    [252, 124, 220, 92, 244, 116, 212, 84, 254, 126, 222, 94, 246, 118, 214, 86],
    [3, 131, 35, 163, 11, 139, 43, 171, 1, 129, 33, 161, 9, 137, 41, 169],
    [195, 67, 227, 99, 203, 75, 235, 107, 193, 65, 225, 97, 201, 73, 233, 105],
    [51, 179, 19, 147, 59, 187, 27, 155, 49, 177, 17, 145, 57, 185, 25, 153],
    [243, 115, 211, 83, 251, 123, 219, 91, 241, 113, 209, 81, 249, 121, 217, 89],
    [15, 143, 47, 175, 7, 135, 39, 167, 13, 141, 45, 173, 5, 133, 37, 165],
    [207, 79, 239, 111, 199, 71, 231, 103, 205, 77, 237, 109, 197, 69, 229, 101],
    [63, 191, 31, 159, 55, 183, 23, 151, 61, 189, 29, 157, 53, 181, 21, 149],
    [255, 127, 223, 95, 247, 119, 215, 87, 253, 125, 221, 93, 245, 117, 213, 85]
];

const custom4x4 = [
    [0, 0, 0, 1],
    [0, 5, 4, 2],
    [0, 0, 0, 3],
    [0, 0, 0, 0],
];

const custom8x8 = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 13, 0, 0, 0, 8],
    [0, 15, 14, 12, 0, 10, 9, 7],
    [0, 0, 0, 11, 23, 0, 0, 6],
    [0, 0, 25, 24, 22, 0, 0, 0],
    [0, 0, 0, 3, 21, 0, 0, 18],
    [0, 5, 4, 2, 0, 20, 19, 17],
    [0, 0, 0, 1, 0, 0, 0, 16]
]; // yessir, penises

const custom7x7 = [
    [1, 3, 37, 9, 11, 45, 43],
    [4, 2, 47, 12, 10, 26, 28],
    [30, 44, 17, 47, 36, 29, 27],
    [13, 15, 46, 5, 7, 38, 40],
    [16, 14, 42, 8, 6, 41, 39],
    [48, 22, 24, 31, 33, 18, 20],
    [35, 25, 23, 34, 32, 21, 19]
];

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    2: bayer2x2,
    4: bayer4x4,
    8: bayer8x8,
    16: bayer16x16,
    c4: custom4x4,
    c8: custom8x8,
    c7: custom7x7
});

/***/ },

/***/ "./src/js/convert/patterns.js"
/*!************************************!*\
  !*** ./src/js/convert/patterns.js ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultPattern: () => (/* binding */ defaultPattern),
/* harmony export */   patterns: () => (/* binding */ patterns)
/* harmony export */ });
const patterns = [
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 0, 1, 1, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 1, 1, 0, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 0, 0, 0,
        0, 0, 1, 0, 1, 1, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 1, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 0, 1, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 1, 0, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 1, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 1, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 0, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 1, 0, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 0, 1, 1, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 1, 1, 0, 1, 1, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        1, 1, 1, 1, 1, 1, 1,
        0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 0, 1,
        1, 0, 1, 0, 1, 0, 1,
        1, 0, 1, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 1, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 1, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 1, 1, 0,
        0, 1, 1, 0, 1, 0, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 0, 1, 0, 1, 1, 0,
        0, 1, 1, 1, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 0, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 0, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 1, 0, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 1, 0, 1, 0, 1, 0,
        1, 1, 1, 1, 1, 1, 1,
        1, 1, 0, 1, 0, 1, 1,
        0, 0, 1, 1, 1, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 0, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 1, 1, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 1, 0, 0, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 1, 0, 0, 1, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 1, 1, 0, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 0, 0, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 1, 1, 0, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 1, 0, 0, 0, 1, 0,
        0, 1, 1, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 1, 1, 0, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 0, 1, 1, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 1, 1, 0, 1, 0,
        0, 1, 0, 1, 0, 1, 0,
        0, 1, 0, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 1, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 1, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 1, 0, 1, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 1, 1, 1, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    [
        0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 1, 1, 1, 1, 1, 0,
        0, 0, 0, 0, 1, 0, 0,
        0, 0, 0, 1, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0,
    ],
    
];

const defaultPattern = [
    0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 0, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 0,
    0, 0, 1, 1, 1, 0, 0,
    0, 0, 0, 1, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
];

/***/ },

/***/ "./src/js/globals.js"
/*!***************************!*\
  !*** ./src/js/globals.js ***!
  \***************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _EventManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventManager */ "./src/js/EventManager.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    socket: null,
    chunkManager: null,
    renderer: null,
    fxRenderer: null,
    player: null,
    toolManager: null,

    get eventManager() {
        if (!this._eventManager) {
            this._eventManager = new _EventManager__WEBPACK_IMPORTED_MODULE_0__["default"](document.getElementById('board'))
        }
        return this._eventManager
    },
    
    get mainCtx() {
        if (!this._mainCtx) {
            this._mainCtx = document.getElementById('board').getContext('2d')
        }
        return this._mainCtx
    },
    
    get fxCtx() {
        if (!this._fxCtx) {
            this._fxCtx = document.getElementById('fx').getContext('2d')
        }
        return this._fxCtx
    },
    
    get mobile() {
        if (this._mobile === undefined) {
            // Ленивая загрузка тяжелой проверки
            const { insanelyLongMobileBrowserCheck } = __webpack_require__(/*! ./utils/misc */ "./src/js/utils/misc.js")
            this._mobile = insanelyLongMobileBrowserCheck()
        }
        return this._mobile
    },
    
    users: {},

    // to prevent tool usage due to rebinding
    lockInputs: false,

    wandSelectedColor: null
});

/***/ },

/***/ "./src/js/translate.js"
/*!*****************************!*\
  !*** ./src/js/translate.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   translate: () => (/* binding */ translate)
/* harmony export */ });
/* harmony import */ var _translates__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./translates */ "./src/js/translates.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");


function translate(val) {
    return _translates__WEBPACK_IMPORTED_MODULE_0__["default"]._(val);
}

function init() {
    // translate inner text
    const els = [...document.getElementsByClassName('translate')];
    for (let el of els) {
        let text = el.innerText;
        // remove html padding
        text = text.replace(/^[\n\s]+/, '').replace(/[\n\s]+$/, '')
        // stupid workaround of UPPERCASING source text when text-transform: uppercase
        if (el.dataset['transform'] === 'lower') {
            text = text.toLowerCase();
        }
        const tr = translate(text);
        el.innerText = tr;
    }
    // translate attributes
    const allEls = $('*');
    const transEls = allEls.filter((_, el) => el.dataset.translate);
    for (let el of transEls) {
        try {
            const text = el[el.dataset.translate];
            const tr = translate(text);
            el[el.dataset.translate] = tr;
        } catch (e) { }
    }
}

/***/ },

/***/ "./src/js/translates.js"
/*!******************************!*\
  !*** ./src/js/translates.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_localStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/localStorage */ "./src/js/utils/localStorage.js");
/* harmony import */ var _translates_en__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./translates/en */ "./src/js/translates/en.js");
/* harmony import */ var _translates_ru__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./translates/ru */ "./src/js/translates/ru.js");


function getLang(){
    return ((0,_utils_localStorage__WEBPACK_IMPORTED_MODULE_0__.getLS)('preferredLang') || navigator.language || navigator.userLanguage || 'en').substr(0, 2)
}
const lang = getLang();




const languages = {
    en: _translates_en__WEBPACK_IMPORTED_MODULE_1__["default"],
    ru: _translates_ru__WEBPACK_IMPORTED_MODULE_2__["default"]
}

const userLanguage = languages[lang] || languages['en'];

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    _(value){
        return userLanguage[value] || languages['en'][value] || value
    }
});

/***/ },

/***/ "./src/js/translates/en.js"
/*!*********************************!*\
  !*** ./src/js/translates/en.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    // main section
    // html
    'Goroxels': 'Goroxels', // I don’t know whether to translate the name or not, but it sounds cooler in English (John)
    'CHAT': 'CHAT',
    'login to chat': 'log in to chat',
    'chat.you': 'You',
    'chat.muteDesc': 'NICK (with color codes) - mute the player (for yourself)',
    'chat.unmuteDesc': 'NICK (with color codes) - unmute the player',
    'chat.wDesc': 'ID MESSAGE - private message to the player',
    'template': 'template',
    'template url': 'image link', // (template) (John)
    'template opacity': 'template opacity',
    'settings': 'settings',
    'game settings': 'general settings',
    'open window': 'configure', // open window would be aptly translated as configure (open the settings window) (John)
    'account settings': 'account settings',
    'change name': 'change nickname',
    'logout': 'log out',
    'toolbinds settings': 'hotkeys',
    'ui settings': 'UI settings',
    'tools': 'tools',
    'online': 'online',
    'Send alerts': 'Send alerts', // ? (John)
    // js and others
    'Error!': 'Error!',
    'error.protected_pixel': 'Pixel is protected!',
    // confirm windows
    'OK': 'OK',
    'Cancel': 'Cancel',

    'confirm_template_deletion': 'Confirm template deletion?',

    'templates_title': 'Templates',

    'time.minute': 'Minute',
    'time.hour': 'Hour',
    'time.day': 'Day',

    // gradient miniwindow
    'gradient': 'Gradient',
    'fill_mode.global': 'global',
    'fill_mode.floodfill': 'flood fill',
    'bayer': 'matrix',
    'radial': 'radial',
    'magnet_mode': 'magnet mode',

    'change_palette': 'Change active palette',
    'select_palette_title': 'Choose a palette',
    'have_you_seen_pal_update_title': 'Rumor has it...',
    'have_you_seen_pal_update_body': 'Now the site has two palettes!',
    'show_me_palette_update': 'Show me!!!',

        // palette hotkey notif
    'psst': 'psst...',
    'use_p_to_swap_palette': 'Press H to swap palettes',

    'socketErr.banned': 'You have been banned. If you believe this is a mistake, contact the administration (Telegram/Discord is in Help)',
    'socketErr.bannedUntil': `You have been temporarily banned. Ban lifts in: `,

    // tools.js
    'paste.choose_from': 'Choose where to paste from',
    'from_clipboard': 'From clipboard',
    'from_file': 'From file',

    // player info window
    'ban_menu': 'ban menu',
    'ban_menu_for': 'ban menu for',
    'label.shadowBanned': 'shadowban',
    'label.banned': 'full ban',

    'btn.sendAlert': 'Send notification',
    'btn.sendModal': 'Send fullscreen',
    // tools names subsection
    'toolName.clicker': 'clicker',
    'toolName.mover': 'mover',
    'toolName.floodfill': 'floodfill',
    'toolName.pipette': 'pipette',
    'toolName.alt pipette': 'alt pipette 2nd color',
    'toolName.line': 'line',
    'toolName.right color': 'right color',
    'toolName.left color': 'left color',
    'toolName.swap colors': 'swap colors',
    'toolName.toggle chat': 'toggle chat',
    'toolName.toggle menu': 'toggle menu',
    'toolName.toggle everything': 'toggle everything',
    'toolName.ctrlZ': 'undo pixel',
    'toolName.protector': 'protector',
    'toolName.alt protector': 'erase protection',
    'toolName.grid': 'grid',
    'toolName.copy': 'copy',
    'toolName.paste': 'paste',
    'toolName.coords to chat': 'send coords to chat',
    'toolName.template 0/N opaq': 'template opacity 0/N',
    'toolName.template 1/N opaq': 'template opacity 1/N',
    'toolName.square': 'rectangle',
    'toolName.+brush size': 'brush size +',
    'toolName.-brush size': 'brush size -',
    'toolName.pixel info': 'who placed the pixel',
    'toolName.text': 'draw text',
    'toolName.reset colors': 'reset color selection',
        'toolName.wand': 'Magic Wand',
    'toolName.colorador': 'Colors Disabler',
    'toolName.palette_swap': 'Palette Swap',

    // end tools subsection
    'colors size': 'color size', // increases the size of color squares in the palette -> enlarges the palette (John)
    'palette width': 'palette size',
    'hide emojis': 'hide emojis',
    'emoji list': 'list of available emojis',
    'super secret button': 'whoever clicks it is gay',
    'show placed pixels': 'show pixel counter',
    'show patterns over the palette': 'patterns over the palette',
    'tools_to_right_pos': 'tools on the right side',
    'more emojis!': 'pile on the emojis!',
    'show protected': 'show protected pixels',
    'brush size': 'brush size',
    'max saved pixels': 'maximum saved pixels',
    'disable chat colors': 'disable chat colors',
    'chat messages limit': 'chat messages limit',
    'light grid': 'light grid',
    'enable grid': 'enable grid',
    'draw line length': 'display line length',
    'Case insensitive, 0/o i/l are same': 'Case insensitive, O/o and I/i are the same', // for captcha, if the image has HJKfY78, the value hjkfy78 will be accepted (John)
    'Can\'t recognize?': 'Can’t read it?',
    'Captcha': 'Captcha',
    'search users': 'search users',
    'OR': 'OR',
    'banned?': 'banned?',
    'convert image into palette': 'convert image to palette',
    'save canvas': 'download canvas',
    'tools.showPrevWipesBtn': 'view previous wipes',
    'prevWipesWinTitle': 'Old wipes',
    // rus intro translate (John)
    'intro.introHeader': 'where am I',
    'how to play?': 'how to play?',
    'tools': 'tools',
    'intro.tools2header': 'underground tools',
    'intro.desc': ' - online pixel canvas, made with love.',
    'intro.desc2': 'You can draw <b>without registration</b>. But if you register, you can paint <b>even faster</b> (+ you’ll unlock chat and some tools. And a bonus +5 to luck)',
    'intro.howToPlayDecs': 'It’s simple: choose a color at the bottom, click on the canvas - a pixel appears. Very easy. <br><i>but that’s far from everything</i>👁️',
    'intro.toolsDecs': 'To make life easier and the grass greener, we’ve added some features:<br><i>P.S. all keys can be reassigned in settings. And if you’re on a phone, many tools are available for selection at the top left</i>',
    'intro.toolsClicker': '<b>Clicker</b><br>YES, it clicks. NO, it won’t draw for you. [Space]<br>',
    'intro.toolsAS': '<b>Back and forth</b><br>Quickly switch colors with [A] and [S]',
    'intro.toolC': '<b>Pipette</b><br>The game has a pipette [C]',
    'intro.brush': '<b>Brush</b><br>For those who behave well, a larger brush is available<br>',
    'intro.line': '<b>Line</b><br>For straight-up guys [Shift]',
    'intro.flood': '<b>Floodfill</b><br>What are you flooding me with! [F]<br>',
    'intro.resetColors': '<b>Reset selected color</b><br>can be done with a flick of the wrist [RMB] (right-click)',
    'intro.grid': '<b>Grid</b><br> enabled with [G]',
    'intro.ctrlZ': '<b>Undo</b><br>You can even undo pixels! Key: [Z]<br>',
    'intro.tools2desc': 'These tools are optional, but they’re only cooler for it!!',
    'intro.toolsHiders': '<b>Hide the extras</b><br>from the interface with separate keybinds. [K] hides the chat, [L] hides the top panel, and [;] hides everything at once',
    'intro.multicol': '<b>Multicolor</b><br>For advanced users, we’ve added multicolor support - when the brush paints with two colors, alternating them. <br>Why? Some images with <a href="//en.wikipedia.org/wiki/Dithering" target="_blank">dithering</a> are much easier to draw this way. Worth a try.',
    'intro.multicol2': 'Select the second color with [RMB] on a color in the palette/[Alt+C] on the canvas.',
    'intro.multicol3': '(Mixed up the order? Just press [X])',
    'intro.sendCoords': '<b>Coordinates to chat</b><br>can be sent by pressing [U]',
    'intro.templateTools': '<b>Template</b><br>there are binds for templates too! [O] and [P] instantly toggle its opacity.<br>Plus, you can move the template by holding [Ctrl] and [LMB]',
    'intro.templateIntro': 'Wanderer, you’ve come so far! Well, I’ll share a secret...',
    'intro.templateDesc': 'The principle is simple and, if it helps, roughly the same as pxls.space. <br>You insert a direct image link into the URL field (top left), enter the desired coordinates, and draw over it',
    'intro.templateDescConvert': '<b>But my image isn’t in the palette :(</b><br>If you want it in the palette, go to <a href="/convert" target="_blank">/convert</a>. Insert the image into the input field at the top.',
    'intro.templateDescReminder': '<b>BY THE WAY</b><br>you can draw just like in this video. Want the same? Go to <a href="/convert" target="_blank">/convert</a> (convert to pattern -> [upload image to imgur])<br>'+
        '<i>P.S. Set template opacity to maximum.</i><br>'+
        '<i>P.P.S. If the link is red, you’ll have to upload manually. Instructions: </i><a href="//vk.cc/cOCbAd" target="_blank">vk.cc/cOCbAd</a>',
    'intro.authorHeader': 'author',
    'intro.authorText': 'Authors - Pea and Friends',
    'intro.telegram_channel': 'Telegram Channel',
    'intro.authorContacts': '<img src="./img/telegram.svg" style="vertical-align:middle;height:40px">&nbsp;<a href="//t.me/antieden">Telegram</a><br>'+
    '<img src="./img/discord-logo-circle.svg" style="vertical-align:middle;height:40px">&nbsp;goeden<br>'+
    '<img src="./img/discord-logo-circle.svg" style="vertical-align:middle;height:40px">&nbsp;<a href="//discord.gg/FeBMmwRUpA">Game Server</a>',
    'intro.my_boosty': 'My Boosty:',
    // nsfw modal
    'WARNING': 'WARNING',
    'This canvas may contain illustrations, inappropriate for people under age of 18, including:': 'This canvas may contain images inappropriate for people under 18, including but not limited to:',
    'Gore, furry, porn, hate, anime and all possible variations of these.': 'Gore, furry, porn, hate, anime, and all possible variations of these.',
    'Are you 18 y.o. and fully understanding what are you doing?': 'Are you 18 and fully understand what you’re doing?',
    'I am 18 years old and I take responsibility for my psyche on myself': 'I am 18 years old and I take responsibility for my psyche on myself',
    // converter section
    // html
    'Convert!': 'Convert!',
    'Into palette': 'Into palette',
    'GO!': 'For the Motherland!',
    'Dithering': 'Dithering',
    'None': 'No dithering',
    'Floyd-Steinberg': 'Floyd-Steinberg',
    'Stuсki': 'Stucki',
    'Chess': 'Chess',
    'Ordered (matrix)': 'Ordered (matrix)',
    'Threshold': 'Threshold',
    'Matrix size': 'Matrix size',
    'Darken': 'Darken',
    'Lighten': 'Lighten',
    'Balance': 'Balance',
    'Color function for ΔE': 'Additional color settings',
    'RGB + luminance [very fast and dirty]': 'RGB + luminance [very fast, "dirty" image]',
    'ciede2000 [slow and accurate]': 'ciede2000 [slow but accurate]',
    'CMC I:c [weird and slow]': 'CMC I:c [weird and slow (but sometimes better than others)]',
    'Euclidian + color values [fast and dirty]': 'Euclidean + color perception [fast, "dirty" image]',
    'brightness tune': 'brightness adjustment',
    'reset': 'reset',
    'constrast tune': 'contrast adjustment',
    'zoom preview automatically': 'auto-scale preview',
    'serpentine (slightly suppresses dithering artefacts)': 'serpentine (slightly suppresses dithering artifacts)',
    'Into patterns': 'Convert to patterns',
    'Choose a palette': 'Choose a palette',
    'resize': 'resize',
    'width': 'Width',
    'height': 'Height',
    'anti-alias': 'anti-aliasing',
    'tryResizePixelArt': 'try to resize pixel art',
    'doNOTconvert': 'DO NOT convert',
    'onDone.didNotConvert': 'As you requested, DID NOT convert',
    'warn.notPixelArt': '10/10 jackals, pixel art NOT FOUND (not original)',

    // js and others
    'Image is loaded, but pixels can not be gotten. Try to load it on Imgur or download->upload from file': 'Image is loaded, but pixels cannot be retrieved. Try uploading it to Imgur or downloading -> uploading from a file',
    '[clipboard]': '[clipboard]',
    '[file]': '[file]',
    'Choose a image!': 'Choose an image!',
    'Invalid link!': 'Invalid link!',
    'Done in': 'Done in', //: Done in TIME ms
    'ms.': 'ms.', // milliseconds
    's.': 's.', // seconds
    'Unknown image loading error. Maybe CORS, so try to upload on Imgur': 'Unknown image loading error. Maybe CORS, so try uploading to Imgur.',
    'If your image is big, go make a tea and watch Doctor Who': 'If your image is large, be patient. Brew some tea and watch a couple of episodes of "Doctor Who".', // or episodes of "Bones" about maniacs, I recommend Pelant and the Puppeteer (John)
    'Final image size:': 'Final image size:',
    'Upload on imgur!': 'Upload to Imgur!',
    'copy_canvas_btn': 'to clipboard',
    'download_canvas_btn': 'download',
    'Imgur upload failed, try upload manually': 'Imgur upload failed. Try uploading manually and copy the link yourself',
    'insert_link_here': 'insert link here',
    'imgur_album_link': 'That’s not the right link! Right-click on the image - "copy image link", or use the "Copy link" button',
    'Failed to load game palettes!': 'Failed to load game palettes!',
    'URL/file/clipboard': 'URL/file/clipboard',

    // admin section
    // html
    'Backup Viewer': 'Backup Viewer', // backups (John)
    'SELECT CANVAS': 'SELECT CANVAS',
    'SELECT DAY': 'SELECT DAY',
    'SELECT TIME': 'SELECT TIME',
    'rollback': 'rollback',
    'Show chunk grid': 'Show chunk grid',
    'Crop chunks from': 'Show only chunks from', // ? (John)
    'to': 'to',
    'Crop rollback too': 'Crop rollback too',
    'IP Actions': 'IP Actions',
    'Blacklist': 'Blacklist',
    'UnBlackist': 'Remove from blacklist', // ? (John)
    'Whitelist': 'Whitelist',
    'UnWhitelist': 'Remove from whitelist',
    'send': 'send', // and that’s a whole different story (John)
    'set captchaEnabled state': 'enable captcha',
    'set': 'set', // assign, set (John)
    'set afterJoinDelay value': 'change afterJoinDelay', // as you requested (John)
    'Canvas Actions': 'Canvas Actions',
    'Canvas': 'Canvas',
    'DO': 'DO',
    'wipe': 'wipe',
    'enlarge': 'enlarge', // used in the context of enlarging the canvas, as are the following lines? (John)
    'top': 'top',
    'right': 'right',
    'bottom': 'bottom',
    'left': 'left',
    // js and others TODO
    'LOG IN': 'LOG IN',

    // templates update MAIN
    'btn_show_templates': 'all templates',
    'btn_add_template': 'add template',
    'btn_share_template': 'share your template',
    // templates update CONVERT
    'you_need_login_to_use_this_feature': 'To use it, you need to be logged in',
    'template_name_shit': 'Template name must be 3-32 characters long',
    'upload_to_goroxels': 'Upload to Goroxels',
    'template_patternize': 'turn into patterns?',
    'template_is_public': 'make public?',
    'template_name_desc': 'Template name (3-32 characters)',
    'img_copied_success': 'Copied to clipboard!',
});

/***/ },

/***/ "./src/js/translates/ru.js"
/*!*********************************!*\
  !*** ./src/js/translates/ru.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    // main section
    // html
    'Goroxels': 'Goroxels', // я не знаю, переводить название или нет, но на английском звучит красивше (Джон)
    'CHAT': 'ЧАТ',
    'login to chat': 'зарегистрируйтесь для чата',
    'chat.you': 'Вы',
    'chat.muteDesc': 'НИК (с кодами цветов) - замутить игрока (для себя)',
    'chat.unmuteDesc': 'НИК (с кодами цветов) - размутить игрока',
    'chat.unmuteDesc': 'НИК (с кодами цветов) - размутить игрока',
    'chat.wDesc': 'ID MESSAGE - личное сообщение игроку',
    'template': 'шаблон',
    'template url': 'ссылка на картинку', // (шаблон) (Джон)
    'template opacity': 'непрозрачность шаблона',
    'settings': 'настройки',
    'game settings': 'общие настройки',
    'open window': 'настроить', // open window будет уместным перевести как настроить (открыть окно настройки) (Джон) 
    'account settings': 'настройки аккаунта',
    'change name': 'сменить ник',
    'logout': 'выйти',
    'toolbinds settings': 'горячие клавиши',
    'ui settings': 'настройки UI',
    'tools': 'инструменты',
    'online': 'онлайн',
    'Send alerts': 'Отправить алерты', // ? (Джон)
    // js and others
    'Error!': 'Ошибка!',
    'error.protected_pixel': 'Пиксель защищён!',
    // confirm windows
    'OK': 'OK',
    'Cancel': 'Отмена',
    
    'confirm_template_deletion': 'Подтвердить удаление шаблона?',

    'templates_title': 'Шаблоны',

    'time.minute': 'Минута',
    'time.hour': 'Час',
    'time.day': 'День',

    // gradient miniwindow
    'gradient': 'Градиент',
    'fill_mode.global': 'глобально',
    'fill_mode.floodfill': 'заливкой',
    'bayer': 'матрица',
    'radial': 'радиальный',
    'magnet_mode': 'магнит',

    // double palette notif
    'change_palette': 'Сменить активную палитру',
    'select_palette_title': 'Выбери палитру',
    'have_you_seen_pal_update_title': 'Ходят слухи, что...',
    'have_you_seen_pal_update_body': 'Теперь на сайте аж две палитры!',
    'show_me_palette_update': 'Покажи!!!',

    // palette hotkey notif
    'psst': 'псс...',
    'use_p_to_swap_palette': 'Чтобы быстро сменить палитру, нажми H',
    
    'socketErr.banned': 'Вы были забанены. Если вы считаете, что это ошибка, свяжитесь с администрацией (telegram/discord есть в Help)',
    'socketErr.bannedUntil': `Вы были временно забанены. До снятия бана: `,
    
    // tools.js
    'paste.choose_from': 'Выбери откуда вставка',
    'from_clipboard': 'Из буфера обмена',
    'from_file': 'Из файла',
    
    // player info window
    'ban_menu': 'бан меню',
    'ban_menu_for': 'бан меню для',
    'label.shadowBanned': 'шадоубан',
    'label.banned': 'полный бан',

    'btn.sendAlert': 'Отправить уведом',
    'btn.sendModal': 'Отправить на весь экран',
    // tools names subsection
    'toolName.clicker': 'кликер',
    'toolName.mover': 'двигалка',
    'toolName.floodfill': 'заливка',
    'toolName.pipette': 'пипетка',
    'toolName.alt pipette': 'пипетка 2й цвет',
    'toolName.line': 'линия',
    'toolName.right color': 'цвет справа',
    'toolName.left color': 'цвет слева',
    'toolName.swap colors': 'поменять цвета местами',
    'toolName.toggle chat': 'скрыть чат',
    'toolName.toggle menu': 'скрыть меню',
    'toolName.toggle everything': 'скрыть всё',
    'toolName.ctrlZ': 'отменить пиксель',
    'toolName.protector': 'защита',
    'toolName.alt protector': 'стереть защиту',
    'toolName.grid': 'сетка',
    'toolName.copy': 'копировать',
    'toolName.paste': 'вставка',
    'toolName.coords to chat': 'отправить коорд. в чат',
    'toolName.template 0/N opaq': 'прозрачность шаблона 0/N',
    'toolName.template 1/N opaq': 'прозрачность шаблона 1/N',
    'toolName.square': 'прямоугольник',
    'toolName.+brush size': 'размер кисти +',
    'toolName.-brush size': 'размер кисти -',
    'toolName.pixel info': 'кто поставил пиксель',
    'toolName.text': 'нарисовать текст',
    'toolName.reset colors': 'отменить выбор цвета',
    'toolName.wand': 'Волшебная палочка',
    'toolName.colorador': 'МНКБМ',
    'toolName.palette_swap': 'Сменить палитру',
	
    // end tools subsection
    'colors size': 'размер цветов', // увеличивает квадраты цветов, находящихся в палитре -> увеличивает палитру (Джон)
    'palette width': 'размер палитры',
    'hide emojis': 'спрятать эмодзи',
    'emoji list': 'лист доступных эмодзи',
    'super secret button': 'кто нажмёт тот гей',
    'show placed pixels': 'показать счётчик пикселей',
    'show patterns over the palette': 'узоры поверх палитры',
    'tools_to_right_pos': 'инструменты с правой стороны',
    'more emojis!': 'навали эмодзи!',
    'show protected': 'показать защищённые пиксели',
    'brush size': 'размер кисти',
    'max saved pixels': 'максимум сохранённых пикселей',
    'disable chat colors': 'не показывать цвета в чате',
    'chat messages limit': 'лимит сообщений чата',
    'light grid': 'светлая сетка',
    'enable grid': 'включить сетку',
    'draw line length': 'отображать длину линии',
    'Case insensitive, 0/o i/l are same': 'Регистр не имеет значения, O/o и I/i одинаковы', // для капчи, если картинка имеет на себе HJKfY78, то значение hjkfy78 будет принято  (Джон)
    'Can\'t recognize?': 'Нечитаемо?',
    'Captcha': 'Капча',
    'search users': 'поиск пользователей',
    'OR': 'ИЛИ',
    'banned?': 'забанен?',
    'convert image into palette': 'сконвертировать картинку в палитру',
    'save canvas': 'скачать полотно',
    'tools.showPrevWipesBtn': 'посмотреть предыдущие вайпы',
    'prevWipesWinTitle': 'Старые вайпы',
	// rus intro translate (джон)
    'intro.introHeader': 'куда я попал',
    'how to play?': 'как играть?',
    'tools': 'инструменты',
    'intro.tools2header': 'андеграунд инструменты',
    'intro.desc': ' - онлайн пиксельное полотно, сделанное с любовью.',
    'intro.desc2': 'Рисовать можно <b>без регистрации</b>. Но если зарегистрируешься, сможешь красить <b>ещё быстрее</b> (+тебе откроется чат и некоторые инструменты. И бонус +5 к удаче)',
    'intro.howToPlayDecs': 'Всё тривиально: выбираешь внизу цвет, кликаешь по полотну - появится пиксель. Очень просто. <br><i>но это далеко не всё</i>👁️',
    'intro.toolsDecs': 'Чтобы жить было легче, а трава зеленее, мы сделали кое-какие фичи:<br><i>P.S все клавиши можно переназначить в настройках. А если ты на телефоне, многие инструменты доступны для выбора сверху слева</i>',
    'intro.toolsClicker': '<b>Кликер</b><br>ДА, он кликает. НЕТ, за тебя он рисовать не будет. [Пробел]<br>',
    'intro.toolsAS': '<b>Туда-сюда</b><br>Быстро переключать цвета можно с помощью [A] и [S]',
    'intro.toolC': '<b>Пипетка</b><br>В игре есть пипетка [C]',
    'intro.brush': '<b>Кисть</b><br>Тем, кто хорошо себя вёл, доступен рисовальник побольше<br>',
    'intro.line': '<b>Линия</b><br>Для ровных пацанов [Shift]',
    'intro.flood': '<b>Заливка</b><br>Да что ты мне заливаешь! [F]<br>',
    'intro.resetColors': '<b>Сбросить выбранный цвет</b><br>можно лёгким движением руки [ПКМ] (правый клик)',
    'intro.grid': '<b>Сетка</b><br> включается на [G]',
    'intro.ctrlZ': '<b>Отменять</b><br>Пиксели даже можно отменять! Клавиша: [Z]<br>',
    'intro.tools2desc': 'Эти инструменты дополнительные, но от этого они только круче!!',
    'intro.toolsHiders': '<b>Убрать лишнее</b><br>с интерфейса можно отдельными кейбиндами. [K] скрывает чат, [L] скрывает верхнюю панель, а [;] скрывает всё сразу',
    'intro.multicol': '<b>Мультицвет</b><br>Для продвинутых пользователей добавлена поддержка мультицвета - это когда кисть рисует сразу двумя цветами, чередуя их. <br>Зачем? Некоторые картинки с <a href="//ru.wikipedia.org/wiki/Дизеринг" target="_blank">дизерингом</a> так рисовать намного проще. Стоит попробовать.',
    'intro.multicol2': 'Выбрать второй цвет [ПКМ] по цвету в палитре/[Alt+C] на полотне.',
    'intro.multicol3': '(Перепутал порядок? Просто нажми [X])',
	'intro.sendCoords': '<b>Координаты в чат</b><br>можно отправить, нажав [U]',
	'intro.templateTools': '<b>Шаблон</b><br>для шаблона тоже есть свои бинды! [O] и [P] моментально переключают его прозрачность.<br>А ещё перемещать шаблон можно зажав [Ctrl] и [ЛКМ]',
	'intro.templateIntro': 'Странник, ты зашёл так далеко! Что ж, я поделюсь секретом...',
	'intro.templateDesc': 'Принцип прост и, если это поможет, примерно такой же, как у pxls.space. <br>Ты вставляешь прямую ссылку на картинку в поле URL (сверху слева), вводишь нужные координаты и рисуешь поверх',
	'intro.templateDescConvert': '<b>Но моя картинка не в палитре :(</b><br>Если хочешь в палитре - иди на <a href="/convert" target="_blank">/convert</a>. Вставь картинку в поле ввода, которое сверху.',
	'intro.templateDescReminder': '<b>КСТАТИ</b><br>можно рисовать прямо как на этом видосе. Хочешь так же? Иди на <a href="/convert" target="_blank">/convert</a> (сконвертировать в узор -> [залить картинку на imgur])<br>'+
        '<i>P.S. Непрозрачность шаблона лучше поставь на максимум.</i><br>'+
        '<i>P.P.S. если ссылка красного цвета - придётся заливать вручную. Инструкция: </i><a href="//vk.cc/cOCbAd" target="_blank">vk.cc/cOCbAd</a>',
    'intro.authorHeader': 'автор',
    'intro.authorText':'Авторы - Горох со Товарищи',
    'intro.telegram_channel': 'Канал в Telegram',
    'intro.authorContacts': '<img src="./img/telegram.svg" style="vertical-align:middle;height:40px">&nbsp;<a href="//t.me/antieden">Telegram</a><br>'+
    '<img src="./img/discord-logo-circle.svg" style="vertical-align:middle;height:40px">&nbsp;goeden<br>'+
    '<img src="./img/discord-logo-circle.svg" style="vertical-align:middle;height:40px">&nbsp;<a href="//discord.gg/FeBMmwRUpA">Сервер игры</a>',
    'intro.my_boosty': 'Мой бусти:',
    // nsfw modal
    'WARNING': 'ВНИМАНИЕ',
    'This canvas may contain illustrations, inappropriate for people under age of 18, including:': 'Это полотно может содержать изображения, неприемлемые для лиц младше 18 лет, включая, но не ограничиваясь:',
    'Gore, furry, porn, hate, anime and all possible variations of these.': 'Насилие, фурри, порно, ненависть, аниме и всевозможные их комбинации.',
    'Are you 18 y.o. and fully understanding what are you doing?': 'Тебе есть 18 и ты полностью понимаешь что делаешь?',
    'I am 18 years old and I take responsibility for my psyche on myself': 'Мне есть 18 и я беру ответственность за свою психику на себя',	
    // converter section
    // html
    'Convert!': 'Конверт!',
    'Into palette': 'В палитру',
    'GO!': 'За Родину!',
    'Dithering': 'Дизеринг',
    'None': 'Нет дизеринга',
    'Floyd-Steinberg': 'Флойд-Штеинберг',
    'Stuсki': 'Штуки',
    'Chess': 'Шахматы',
    'Ordered (matrix)': 'Матричный',
    'Threshold': 'Порог',
    'Matrix size': 'Размер матрицы',
    'Darken': 'Темнее',
    'Lighten': 'Светлее',
    'Balance': 'Баланс',
    'Color function for ΔE': 'Дополнительные цветовые настройки',
    'RGB + luminance [very fast and dirty]': 'RGB + освещение [оч. быстро, "грязная" картинка]',
    'ciede2000 [slow and accurate]': 'ciede2000 [медленно, но верно]',
    'CMC I:c [weird and slow]': 'CMC I:c [всрато и медленно(но иногда лучше других)]',
    'Euclidian + color values [fast and dirty]': 'Евклид + значения восприятия [быстро, "грязная" картинка]',
    'brightness tune': 'регулировка яркости',
    'bayer_strength': 'сила матрицы💪',
    'reset': 'сброс',
    'constrast tune': 'регулировка контраста',
    'zoom preview automatically': 'автоматически масштабировать превью',
    'serpentine (slightly suppresses dithering artefacts)': 'змейка (немного подавляет артефакты дизеринга)',
    'Into patterns': 'Конвертация в узоры',
    'Choose a palette': 'Выбрать палитру',
    'resize': 'сжать',
    'width': 'Ширина',
    'height': 'Высота',
    'anti-alias': 'анти-алиасинг',
    'tryResizePixelArt': 'попытаться уменьшить пиксель-арт',
    'doNOTconvert': 'НЕ конвертировать',
    'onDone.didNotConvert': 'Как ты и просил, НЕ конвертировал',
    'warn.notPixelArt': '10/10 шакалов, пиксель арт НЕ НАЙДЕН (не оригинал)',
	
    // js and others
    'Image is loaded, but pixels can not be gotten. Try to load it on Imgur or download->upload from file': 'Картинка загружена, но пиксели не получены. Попробуй залить картинку на imgur или загрузить из файла',
    '[clipboard]': '[буфер обмена]',
    '[file]': '[файл]',
    'Choose a image!': 'Выбери изображение!',
    'Invalid link!': 'Неверная ссылка!',
    'Done in': 'Сделал за', //: Done in TIME ms
    'ms.': 'мс.', // milliseconds
    's.': 'с.', // seconds
    'Unknown image loading error. Maybe CORS, so try to upload on Imgur': 'При загрузке произошла неизвестная ошибка. Возможно CORS шалит, так что попробуй загрузить на imgur.',
    'If your image is big, go make a tea and watch Doctor Who': 'Если твоя картинка слишком большая, наберись терпения. Завари чай и посмотри пару-тройку серий "Доктора Кто".', // или серии "Костей" про маньяков, рекомендую Пеланта и Кукольника (Джон)
    'Final image size:': 'Конечный размер картинки:',
    'Upload on imgur!': 'Загрузить на imgur!',
    'copy_canvas_btn': 'в буфер обмена',
    'download_canvas_btn': 'скачать',
    'Imgur upload failed, try upload manually': 'Попытка загрузки на imgur провалена. Попробуй загрузить вручную и скопируй ссылку самостоятельно', 
    'insert_link_here': 'вставь сюда ссылку',
    'imgur_album_link': 'Это не та ссылка! Скопируй правой кнопкой по картинке - "копировать ссылку на изображение", либо по кнопке "Copy link"',
    'Failed to load game palettes!': 'Не удалось загрузить палитры игры!',
    'URL/file/clipboard': 'URL/файл/буфер обмена',

    // admin section
    // html
    'Backup Viewer': 'Просмотр бэкапов',  // бэкапы (Джон) 
    'SELECT CANVAS': 'ВЫБЕРИ ПОЛОТНО',
    'SELECT DAY': 'ВЫБЕРИ ДЕНЬ',
    'SELECT TIME': 'ВЫБЕРИ ВРЕМЯ',
    'rollback': 'откат', 
    'Show chunk grid': 'Показать сетку чанков',
    'Crop chunks from': 'Показать только чанки с',  // ? (Джон)
    'to': 'по',
    'Crop rollback too': 'Также обрезать бэкап',
    'IP Actions': 'Действия с IP',
    'Blacklist': 'В чёрный список',
    'UnBlackist': 'Убрать из чёрного', // ? (Джон)
	'Whitelist': 'В белый список',
    'UnWhitelist': 'Убрать из белого',
    'send': 'отправить', // а что - уже совсем другая история (Джон)
    'set captchaEnabled state': 'включить капчу',
    'set': 'сделать', // задать, установить (Джон)
    'set afterJoinDelay value': 'изменить afterJoinDelay',  // как ты и просил (Джон)
    'Canvas Actions': 'Действия с полотном',
    'Canvas': 'Холст',
    'DO': 'СДЕЛАЙ', 
    'wipe': 'вайп',
    'enlarge': 'расширение', // применяется в значении контекста для увеличения холста, как и последующие строки? (Джон)
    'top': 'сверху',
    'right': 'справа',
    'bottom': 'снизу',
    'left': 'слева', 
    // js and others TODO
    'LOG IN': 'ВОЙТИ',

    // templates update MAIN
    'btn_show_templates': 'все шаблоны',
    'btn_add_template': 'добавить шаблон',
    'btn_share_template': 'поделиться своим шаблоном',
    // templates update CONVERT
    'you_need_login_to_use_this_feature': 'Чтобы это использовать, войди в аккаунт',
    'template_name_shit': 'Имя шаблона должно быть 3-32 символов длиной',
    'upload_to_goroxels': 'Загрузить на Goroxels',
    'template_patternize': 'превратить в узоры?',
    'template_is_public': 'сделать публичным?',
    'template_name_desc': 'Имя шаблона (3-32 симв.)',
    'img_copied_success': 'Скопировано в буфер обмена!',


});

/***/ },

/***/ "./src/js/ui/elements.js"
/*!*******************************!*\
  !*** ./src/js/ui/elements.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   changeSelector: () => (/* binding */ changeSelector),
/* harmony export */   chat: () => (/* binding */ chat),
/* harmony export */   chatInput: () => (/* binding */ chatInput),
/* harmony export */   coords: () => (/* binding */ coords),
/* harmony export */   fxCanvas: () => (/* binding */ fxCanvas),
/* harmony export */   mainCanvas: () => (/* binding */ mainCanvas),
/* harmony export */   online: () => (/* binding */ online),
/* harmony export */   opacInput: () => (/* binding */ opacInput),
/* harmony export */   palette: () => (/* binding */ palette),
/* harmony export */   template: () => (/* binding */ template),
/* harmony export */   topMenu: () => (/* binding */ topMenu),
/* harmony export */   topMenuContent: () => (/* binding */ topMenuContent),
/* harmony export */   ui: () => (/* binding */ ui),
/* harmony export */   urlInput: () => (/* binding */ urlInput),
/* harmony export */   xInput: () => (/* binding */ xInput),
/* harmony export */   yInput: () => (/* binding */ yInput)
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
const urlInput = $('#templateURL'),
    xInput = $('#templateX'),
    yInput = $('#templateY'),
    opacInput = $('#templateOpacity'),

    ui = $('#ui'),
    chat = $('#chat'),
    chatInput = $('#chatInput'),
    template = $('#template'),
    topMenu = $('#topMenu'),

    mainCanvas = $('#board'),
    fxCanvas = $('#fx'),
    palette = $('#palette'),
    online = $('#onlineCounter'),
    coords = $('#coords'),
    topMenuContent = $('#topMenu>.content');

// you can't just change css se..
function changeSelector(selector, obj) {
    let el;
    if (!(el = document.getElementById('REPLACE-' + selector))) {
        el = document.createElement('style');
        el.id = 'REPLACE-' + selector;
    }

    let styleArr = Object.keys(obj).map(prop => prop + ':' + obj[prop]);
    el.innerText = `${selector}{${styleArr.join(';')}}`;

    document.head.appendChild(el);
}

/***/ },

/***/ "./src/js/utils/api.js"
/*!*****************************!*\
  !*** ./src/js/utils/api.js ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   apiRequest: () => (/* binding */ apiRequest),
/* harmony export */   fetchCaptcha: () => (/* binding */ fetchCaptcha),
/* harmony export */   processApiErrors: () => (/* binding */ processApiErrors),
/* harmony export */   solveCaptcha: () => (/* binding */ solveCaptcha)
/* harmony export */ });
/* provided dependency */ var toastr = __webpack_require__(/*! toastr */ "./node_modules/toastr/toastr.js");
function processApiErrors(errors) {
    if (!errors) return;
    if (Array.isArray(errors)) {
        return errors.map(processApiErrors);
    }

    const error = errors;
    let msg;
    if (typeof error === 'object') {
        msg = `[${error.path}] ${error.msg}`;
    } else {
        msg = error;
    }

    toastr.error(msg, undefined, {
        preventDuplicates: true
    });
}
async function apiRequest(path, config = {}) {
    // handle json body of request
    if (config.body && typeof config.body === 'object') {
        if (!config.headers) config.headers = {};

        config.headers['Content-Type'] = 'application/json';
        config.body = JSON.stringify(config.body);
    }
    const response = await fetch('/api' + path, config);

    if (response.headers.get('Content-Type') && response.headers.get('Content-Type').includes('application/json')) {
        try {
            const json = await response.json()

            if (json.errors) {
                processApiErrors(json.errors);
            }

            response.json = () => json;
        } catch (e) { }
    }

    return response
}

async function fetchCaptcha() {
    const resp = await apiRequest('/captcha/get');
    return await resp.text()
}

async function solveCaptcha(answer) {
    const resp = await apiRequest('/captcha/solve', {
        method: 'POST',
        body: { answer }
    });

    const json = await resp.json();

    if (json.success !== undefined)
        return json.success;

    return false
}



/***/ },

/***/ "./src/js/utils/color.js"
/*!*******************************!*\
  !*** ./src/js/utils/color.js ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyColor: () => (/* binding */ applyColor),
/* harmony export */   closestColor: () => (/* binding */ closestColor),
/* harmony export */   eq: () => (/* binding */ eq),
/* harmony export */   getPaletteColorId: () => (/* binding */ getPaletteColorId),
/* harmony export */   isDarkColor: () => (/* binding */ isDarkColor),
/* harmony export */   rgb2abgr: () => (/* binding */ rgb2abgr),
/* harmony export */   rgb2hex: () => (/* binding */ rgb2hex)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./src/js/config.js");


function rgb2abgr(r, g, b) {
    return 0xff000000 | b << 16 | g << 8 | r;
}

function component2hex(c) {
    return c.toString(16).padStart(2, '0');
}

function rgb2hex(rgb) {
    return '#' + component2hex(rgb[0]) + component2hex(rgb[1]) + component2hex(rgb[2])
}

// export function isDarkColor(r, g, b) {
//     // V value from HSV
//     return Math.max(r / 255, g / 255, b / 255) < 0.5
// }

function applyColor(origColor, tintColor) {
    var alpha = tintColor[3] / 255;

    return [
        Math.round((1 - alpha) * origColor[0] + alpha * tintColor[0]),
        Math.round((1 - alpha) * origColor[1] + alpha * tintColor[1]),
        Math.round((1 - alpha) * origColor[2] + alpha * tintColor[2])
    ];
}

function closestColor(rgb, palette) {
    let colorId = -1;
    let score = 768; // 255 + 255 + 255

    for (let i = 0; i < palette.length; i++) {
        const item = palette[i];

        let scrnow = Math.abs(rgb[0] - item[0]) + Math.abs(rgb[1] - item[1]) + Math.abs(rgb[2] - item[2]);
        if (scrnow < score) {
            score = scrnow;
            colorId = i;
        }

        if (scrnow == 0) break;
    }
    return colorId;
}

function getPaletteColorId(color) {
    // if we're using one of multiple palettes, 
    // try to find the color in this palette first
    if(_config__WEBPACK_IMPORTED_MODULE_0__.currentPalette){
        const startIdx = _config__WEBPACK_IMPORTED_MODULE_0__.currentPalette.slice[0];
        
        const colIdx = _config__WEBPACK_IMPORTED_MODULE_0__.currentPaletteColors.findIndex(palCol => eq(palCol, color));
        if(colIdx !== -1) return startIdx + colIdx;
    }
    return _config__WEBPACK_IMPORTED_MODULE_0__.allColors.findIndex(palCol => eq(palCol, color));
}

function isDarkColor(r, g, b) {
    const darkness = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return darkness > 0.5;
}

function eq(col1, col2) {
    return col1[0] === col2[0] && col1[1] === col2[1] && col1[2] === col2[2];
}

/***/ },

/***/ "./src/js/utils/localStorage.js"
/*!**************************************!*\
  !*** ./src/js/utils/localStorage.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getLS: () => (/* binding */ getLS),
/* harmony export */   getOrDefault: () => (/* binding */ getOrDefault),
/* harmony export */   removeOldKeybinds: () => (/* binding */ removeOldKeybinds),
/* harmony export */   setLS: () => (/* binding */ setLS)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./src/js/config.js");


function getOrDefault(key, defaultVal, isLocal=false){
    if(isLocal){
        if(_config__WEBPACK_IMPORTED_MODULE_0__.canvasName === undefined){
            console.warn('getLS is used before the config loaded');
        }
        key = _config__WEBPACK_IMPORTED_MODULE_0__.canvasName + '.' + key
    }
    return localStorage.getItem(key) ?? defaultVal
}

function getLS(key, isLocal=false){
    if(isLocal){
        if(_config__WEBPACK_IMPORTED_MODULE_0__.canvasName === undefined){
            console.warn('getLS is used before the config loaded');
        }
        key = _config__WEBPACK_IMPORTED_MODULE_0__.canvasName + '.' + key
    }
    return localStorage.getItem(key);
}

function setLS(key, value, isLocal=false){
    if(isLocal){
        key = _config__WEBPACK_IMPORTED_MODULE_0__.canvasName + '.' + key
    }
    return localStorage.setItem(key, value)
}

function removeOldKeybinds() {
    try {
        const str = getLS('keyBinds');
        const json = JSON.parse(str);
        for (let bind of Object.values(json)) {
            let key = bind.split('+').slice(-1);
            key = +key;
            if (!isNaN(key)) {
                localStorage.removeItem('keyBinds');
                return
            }
        }
    } catch { }
}

/***/ },

/***/ "./src/js/utils/misc.js"
/*!******************************!*\
  !*** ./src/js/utils/misc.js ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   calculateColumnSize: () => (/* binding */ calculateColumnSize),
/* harmony export */   decodeKey: () => (/* binding */ decodeKey),
/* harmony export */   getEventKeyCode: () => (/* binding */ getEventKeyCode),
/* harmony export */   getPathsafeDate: () => (/* binding */ getPathsafeDate),
/* harmony export */   getRecommendedColorSize: () => (/* binding */ getRecommendedColorSize),
/* harmony export */   halfMap: () => (/* binding */ halfMap),
/* harmony export */   htmlspecialchars: () => (/* binding */ htmlspecialchars),
/* harmony export */   initHalfmap: () => (/* binding */ initHalfmap),
/* harmony export */   insanelyLongMobileBrowserCheck: () => (/* binding */ insanelyLongMobileBrowserCheck),
/* harmony export */   isClick: () => (/* binding */ isClick),
/* harmony export */   loadImage: () => (/* binding */ loadImage),
/* harmony export */   resizeCanvas: () => (/* binding */ resizeCanvas),
/* harmony export */   reverseFade: () => (/* binding */ reverseFade),
/* harmony export */   sleep: () => (/* binding */ sleep),
/* harmony export */   stringifyKeyEvent: () => (/* binding */ stringifyKeyEvent),
/* harmony export */   testPointInPolygon: () => (/* binding */ testPointInPolygon)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./src/js/config.js");
/* harmony import */ var _globals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../globals */ "./src/js/globals.js");
/* harmony import */ var _ui_elements__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../ui/elements */ "./src/js/ui/elements.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");




let halfMap = [null, null]
function initHalfmap() {
    halfMap = [
        _config__WEBPACK_IMPORTED_MODULE_0__.boardWidth / 2,
        _config__WEBPACK_IMPORTED_MODULE_0__.boardHeight / 2
    ]
}

function insanelyLongMobileBrowserCheck() {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

function decodeKey(str) {
    let config = {
        alt: false,
        ctrl: false,
        code: null
    }

    str.split('+').forEach(param => {
        if (param === 'CTRL') {
            config.ctrl = true;
        } else if (param === 'ALT') {
            config.alt = true;
        } else {
            config.code = param;
        }
    })

    return config
}

function getEventKeyCode(ev) {
    let code;
    if (ev instanceof PointerEvent || ev instanceof MouseEvent) {
        switch (ev.button) {
            case 0:
                code = 'LMB';
                break;
            case 1:
                code = 'MMB';
                break;
            case 2:
                code = 'RMB';
                break;
            case 3:
                code = '4MB';
                break;
            case 4:
                code = '5MB';
                break;
        }
    } else {
        code = ev.code;
    }
    return code;
}
function stringifyKeyEvent(ev) {
    let code = getEventKeyCode(ev);

    let out = '';
    if (ev.altKey) {
        out += 'ALT+'
    }
    if (ev.ctrlKey) {
        out += 'CTRL+'
    }
    return out + code
}

function calculateColumnSize() {
    const columns = $('.column', _ui_elements__WEBPACK_IMPORTED_MODULE_2__.topMenuContent);
    const windowWidth = window.innerWidth;

    const colWidth = windowWidth / columns.length;

    $('.column', _ui_elements__WEBPACK_IMPORTED_MODULE_2__.topMenuContent).css('width', colWidth);
}

function htmlspecialchars(text) {
    if(!text) return '';
    
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getRecommendedColorSize() {
    if (_globals__WEBPACK_IMPORTED_MODULE_1__["default"].mobile) return 24;
    const max = 30;
    const p = $('#palette');
    // 14 is for palette padding 
    let size = Math.floor((window.innerWidth - 14) / p.children().length);
    size = Math.min(size, max);

    return size
}

function getPathsafeDate() {
    const date = new Date;

    const day = date.getDate().toString().padStart(2, '0'); // convert "1"s to "01"s
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const today = `${day}.${month}.${year}`;

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const time = `${hours}-${minutes}-${seconds}`;

    return `${today} - ${time}`
}

function testPointInPolygon(nvert, vertx, verty, testx, testy) {
    // copied and translated to js from some stackoverflow
    let i, j, c = 0;
    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
        if (((verty[i] > testy) != (verty[j] > testy)) &&
            (testx < (vertx[j] - vertx[i]) * (testy - verty[i]) / (verty[j] - verty[i]) + vertx[i]))
            c = !c;
    }
    return c;
}

function resizeCanvas(canvas, newWidth, newHeight) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;

    tempCtx.imageSmoothingEnabled = false;
    tempCtx.drawImage(canvas, 0, 0, newWidth, newHeight);

    const resizedCanvas = document.createElement('canvas');

    resizedCanvas.width = newWidth;
    resizedCanvas.height = newHeight;

    const resizedCtx = resizedCanvas.getContext('2d');

    resizedCtx.imageSmoothingEnabled = false;
    resizedCtx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);

    return resizedCanvas;
}

function loadImage(url) {
    return new Promise((res, rej) => {
        const img = new Image();
        img.src = url;

        img.onerror = rej;
        img.onload = () => res(img);
    })
}

function reverseFade(el) {
    let reboundInt = setInterval(() => {
        redrawFade();
    }, 100);

    const fadeCanvas = document.createElement('canvas');
    const ctx = fadeCanvas.getContext('2d');

    fadeCanvas.style.cssText =
        `position: absolute;
        z-index: 999`;

    window.addEventListener('resize', onresize)
    function onresize() {
        fadeCanvas.width = window.innerWidth;
        fadeCanvas.height = window.innerHeight;

        redrawFade();
    }
    onresize();

    function redrawFade() {
        ctx.clearRect(0, 0, fadeCanvas.width, fadeCanvas.height);

        ctx.fillStyle = 'black';
        ctx.globalAlpha = 0.8;
        ctx.fillRect(0, 0, fadeCanvas.width, fadeCanvas.height);

        const bnds = el.getBoundingClientRect()

        ctx.clearRect(bnds.x, bnds.y, bnds.width, bnds.height);
    }

    function clear() {
        clearInterval(reboundInt);
        window.removeEventListener('resize', onresize);
        fadeCanvas.remove();
    }

    document.body.appendChild(fadeCanvas);

    return clear;
}

async function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

// calculates mouse down/up coords and tells is it drag or click
function isClick(downPos, upPos, threshold=5){
    return Math.abs(downPos[0] - upPos[0]) < threshold &&
        Math.abs(downPos[1] - upPos[1]) < threshold;
}

/***/ }

}]);
//# sourceMappingURL=penis.84b3f08c8f453fc8fb7b.bundle.js.map