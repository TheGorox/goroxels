import EventEmitter from 'events';
import { translate as t } from './translate';

export default class MiniWindow extends EventEmitter {
    // 0=0 1=ok, 2=ok+cancel
    constructor(title = '', closeButtons = 1, movable=false) {
        super();

        this.title = title;

        this._closeButtons = closeButtons;

        this.element = null;
        this.bodyElement = null;

        this.closed = false;

        this._create();
        if(movable){
            this.makeMovable();
        }
    }

    _create() {
        const html = $(`
        <div class="miniWindow">
            <div class="miniWindowTitle">
                ${this.title}
            </div>
            <div class="miniWindowBody">
            </div>
            <div class="miniWindowButtons">
            </div>
        </div>
        `);

        const buttons = [];
        if (this._closeButtons >= 1) {
            const okButton = $(`<button>${t('OK')}</button>`);
            okButton.on('click', this.buttonHandler.bind(this, 'ok'));
            buttons.push(okButton);
        }
        if (this._closeButtons >= 2) {
            const cancelButton = $(`<button>${t('Cancel')}</button>`);
            cancelButton.on('click', this.buttonHandler.bind(this, 'cancel'));
            buttons.push(cancelButton);
        }

        buttons.forEach(b => $('.miniWindowButtons', html).append(b));

        this.element = html;
        this.bodyElement = $('.miniWindowBody', html);
    }

    moveTo(x, y) {
        const rect = this.element[0].getBoundingClientRect();
        const w = rect.width,
            h = rect.height;

        this.x = Math.max(-w + 10, x);
        this.y = Math.max(-h + 10, y);

        this.x = Math.min(window.innerWidth - 10, this.x);
        this.y = Math.min(window.innerHeight - 10, this.y);
    }

    moveBy(x, y) {
        this.moveTo(this.x + x, this.y + y);
    }

    makeMovable() {
        this.element.find('.miniWindowTitle').on('pointerdown', e => {
            let self = this;
            let lastX = e.clientX;
            let lastY = e.clientY;
            
            const $doc = $(document);
            $doc.on('pointermove', moved)

            function moved(e) {
                e = e.originalEvent;
                let movedX = e.clientX - lastX;
                let movedY = e.clientY - lastY;

                lastX = e.clientX;
                lastY = e.clientY;

                self.moveBy(movedX, movedY);
            }

            $doc.one('pointerup pointerleave', () => {
                $doc.off('pointermove', moved);
            });
        });

        $(this.body).on('pointerdown', e => {
            e.stopPropagation();
        })
    }

    buttonHandler(buttonName) {
        const event = {
            _cancelledClose: false,
            cancelClose: function () { this._cancelledClose = true }
        }

        switch (buttonName) {
            case 'ok':
                this.emit('okClicked', event);
                break;
            case 'cancel':
                this.emit('cancelClicked', event);
        }

        if (!event._cancelledClose) {
            this.close();
        }
    }

    center() {
        if (!this.element || this.closed) {
            return;
        }

        const $window = $(window);
        const windowWidth = $window.width();
        const windowHeight = $window.height();

        const elementWidth = this.element.outerWidth();
        const elementHeight = this.element.outerHeight();

        const left = Math.max(0, (windowWidth - elementWidth) / 2);
        const top = Math.max(0, (windowHeight - elementHeight) / 2);

        this.element.css({
            position: 'fixed',
            left: left + 'px',
            top: top + 'px',
            transform: 'none'
        });
    }

    get x() {
        return parseInt(this.element.css('left'));
    }
    set x(value) {
        this.element.css('left', value + 'px');
    }

    get y() {
        return parseInt(this.element.css('top'));
    }
    set y(value) {
        this.element.css('top', value + 'px');
    }

    get w(){
        return this.element[0].getBoundingClientRect().width;
    }
    get h(){
        return this.element[0].getBoundingClientRect().height;
    }

    pos() {

    }

    close() {
        this.removeAllListeners();
        this.element.remove();
        this.closed = true;
    }
}

export class SelectMiniWindow extends MiniWindow {
    constructor(selects, callback, title) {
        if (!selects.length) throw new Error('no selects, no way to close the window!');

        super(title, 0);

        this.selects = selects;
        this.callback = callback;
        this._sel_create();
    }

    _sel_create() {
        for (const select of this.selects) {
            const selectEl = $(`<button>${select.text}</button>`);
            selectEl.one('click', () => this.onChosen(select.id));

            this.bodyElement.append(selectEl);
        }
    }

    onChosen(id) {
        this.close();

        this.callback(id);
    }
}