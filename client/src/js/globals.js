import EventManager from './EventManager';

export default {
    socket: null,
    chunkManager: null,
    renderer: null,
    fxRenderer: null,
    player: null,
    toolManager: null,

    get eventManager() {
        if (!this._eventManager) {
            this._eventManager = new EventManager(document.getElementById('board'))
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
            const { insanelyLongMobileBrowserCheck } = require('./utils/misc')
            this._mobile = insanelyLongMobileBrowserCheck()
        }
        return this._mobile
    },
    
    users: {},

    // to prevent tool usage due to rebinding
    lockInputs: false,

    wandSelectedColor: null
}