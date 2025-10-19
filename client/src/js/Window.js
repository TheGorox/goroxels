// copied from template 3.0
// copyright GOROX

import jQuery from 'jquery';
import closeSVG from '../img/cross.svg'
import { translate as t } from './translate';

let windows = [];
window.windows = windows;

export default class Window {
    static Exists(title) {
        return windows.some(x => x.title === title)
    }
    static Find(title) {
        return windows.find(x => x.title === title)
    }
    constructor(config) {
        // all values also will be loaded from config few lines below

        // title can be passed instead of config
        if (typeof config == 'string')
            config = { title: config }

        this.created = false;

        this.x = 0;
        this.y = 0;

        this.title = "";

        this.parent = document.body;

        // do not set to false if closeable
        this.moveable = true;
        this.closeable = true;
        this.closed = false;

        this.center = false;

        // here
        Object.assign(this, config);

        if (Window.Exists(this.title)) {
            this.oldWindow = Window.Find(this.title);
            return
        }

        this.created = true;

        if (!this.block) { // for static windows like chat
            this.block = this.createParentBlock();
            this.moveTo(this.x, this.y); // user defined coordinates
            this.parent.appendChild(this.block);
        }

        if (this.center) {
            this.moveToCenter();
            // костыль: центрирует неправильно до рендера
            setTimeout(() => this.moveToCenter());
        }

        this.addFeatures();

        windows.push(this);
    }

    get width() {
        return this.element?.getBoundingClientRect().width;
    }

    get height() {
        return this.element?.getBoundingClientRect().height;
    }

    get left() {
        return this.x;
    }
    get right() {
        return this.x + this.width;
    }
    get top() {
        return this.y;
    }
    get bottom() {
        return this.y + this.height;
    }

    updateTitle(newTitle, temp = false) {
        if (!temp) {
            this.title = newTitle;
        }
        const head = $('.windowTitle', this.element);

        // this makes ".innerHtml = ..." of method below purposeless
        // since html is not saved here
        head.text(newTitle);
    }

    createParentBlock() {
        let el = document.createElement('div');
        el.className = 'window';
        this.element = el;

        let head = document.createElement('div');
        head.className = 'windowHeader'
        head.innerHTML = '<h3 class="windowTitle">' + this.title + '</h3>';
        el.appendChild(head);

        if (this.closeable) {
            const closer = document.createElement('div');
            closer.className = 'closeWindow';
            closer.innerHTML = '<div></div>';

            closer.addEventListener('pointerdown', event => {
                // prevent window moving
                event.stopPropagation();
            });
            closer.addEventListener('click', () => this.close());
            head.appendChild(closer);
        }

        let body = document.createElement('div');
        body.className = 'windowBody';
        el.appendChild(body);
        this.body = body;

        return el
    }

    moveTo(x, y) {
        const rect = this.block.getBoundingClientRect();
        const w = rect.width,
            h = rect.height;

        this.x = Math.max(-w + 10, x);
        this.y = Math.max(-h + 10, y);

        this.x = Math.min(window.innerWidth - 10, this.x);
        this.y = Math.min(window.innerHeight - 10, this.y);

        this.block.style.left = this.x + 'px';
        this.block.style.top = this.y + 'px';
    }

    moveBy(x, y) {
        this.moveTo(this.x + x, this.y + y);
    }

    moveToCenter() {
        let windowWidth = window.innerWidth,
            windowHeight = window.innerHeight;

        let blockWidth = this.block.offsetWidth,
            blockHeight = this.block.offsetHeight;

        this.moveTo(
            windowWidth / 2 - blockWidth / 2,
            windowHeight / 2 - blockHeight / 2
        );
    }

    addFeatures() {
        if (this.moveable) {
            $(this.block).on('pointerdown', e => {
                let self = this;
                let lastX = e.clientX;
                let lastY = e.clientY;

                jQuery(document).on('pointermove', moved)

                function moved(e) {
                    e = e.originalEvent;
                    let movedX = e.clientX - lastX;
                    let movedY = e.clientY - lastY;

                    lastX = e.clientX;
                    lastY = e.clientY;

                    self.moveBy(movedX, movedY);
                }

                jQuery(document).one('pointerup pointerleave', () => {
                    jQuery(document).off('pointermove', moved);
                });
            });

            $(this.body).on('pointerdown', e => {
                e.stopPropagation();
            })
        }

        // for window be in screen after
        // screen rotation
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.moveTo(this.x, this.y);
            }, 500);
        })
    }

    close() {
        jQuery(this.block).remove();
        this.closed = true;
        windows.splice(windows.indexOf(this), 1);
    }
}

let Modal_exists = false;
export class Modal {
    static get isRunning() {
        return Modal_exists
    }
    static set isRunning(val) {
        return Modal_exists = val;
    }

    constructor() {
        if (Modal.isRunning)
            throw new Error('Modal is running');

        this.body = null;

    }
    
    init() {
        const els =
        $(`<div class="modalBg">
            <div class="modalCont">
            </div>
            </div>`);
            
            this.bgEl = els[0];
        this.contEl = this.bgEl.children[0];
        
        $(document.body).append(els);

        Modal.isRunning = true;
    }

    close() {
        Modal.isRunning = false;
        this.bgEl.remove();
    }
}

export class ConfirmModal extends Modal {
    constructor(msg, cb = null) {
        super();

        this.msg = msg;
        this.cb = cb;

        this.init();
    }

    init() {
        super.init();

        const mBody = $(
            `<div style="margin:0;padding:5px;text-align:center;color:var(--light-text)">
                <p>${this.msg}</p>
                <button class='confirmBtn' style="padding: 8px;">${t('OK')}</button>
                <button class='cancelBtn' style="padding: 8px;">${t('Cancel')}</button>
            </div>`)
        this.contEl.appendChild(mBody[0]);

        $('button', mBody).on('click', () => {
            this.close();
        });

        $('.confirmBtn', mBody).on('click', () => {
            if (this.cb) this.cb(true);
        });
        $('.cancelBtn', mBody).on('click', () => {
            if (this.cb) this.cb(false);
        });
    }
}