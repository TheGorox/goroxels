import { onDestroy } from "svelte";

export class EventEmitter {
    constructor() {
        this._events = Object.create(null);
    }

    on(eventName, listener) {
        if (typeof listener !== 'function') {
            throw new TypeError(`The "listener" argument must be of type Function. Received type ${typeof listener}`);
        }

        const existing = this._events[eventName];

        if (existing === undefined) {
            this._events[eventName] = listener;
        } else if (typeof existing === 'function') {
            this._events[eventName] = [existing, listener];
        } else {
            existing.push(listener);
        }

        return this;
    }

    off(eventName, listener) {
        if (typeof listener !== 'function') {
            throw new TypeError(`The "listener" argument must be of type Function. Received type ${typeof listener}`);
        }

        const existing = this._events[eventName];
        if (existing === undefined) return this;

        if (typeof existing === 'function') {
            if (existing === listener) {
                delete this._events[eventName];
            }
            return this;
        }

        const index = existing.indexOf(listener);
        if (index !== -1) {
            existing.splice(index, 1);

            if (existing.length === 1) {
                this._events[eventName] = existing[0];
            } else if (existing.length === 0) {
                delete this._events[eventName];
            }
        }

        return this;
    }

    once(eventName, listener) {
        if (typeof listener !== 'function') {
            throw new TypeError(`The "listener" argument must be of type Function. Received type ${typeof listener}`);
        }

        function onceWrapper(...args) {
            this.off(eventName, onceWrapper);
            listener.call(this, ...args);
        }

        this.on(eventName, onceWrapper);

        return this;
    }

    emit(eventName, ...args) {
        const handler = this._events[eventName];
        if (handler === undefined) return false;

        if (typeof handler === 'function') {
            handler.call(this, ...args);
            return true;
        }

        const currentListeners = handler.slice();
        for (let i = 0; i < currentListeners.length; i++) {
            currentListeners[i].call(this, ...args);
        }

        return true;
    }
}

const emitter = new EventEmitter();

const originalOn = emitter.on.bind(emitter);

emitter.on = function (eventName, listener) {
    originalOn(eventName, listener);

    // auto unsubscribe on destroy
    onDestroy(() => {
        emitter.off(eventName, listener);
    });

    return () => emitter.off(eventName, listener);
};

export { emitter };
export const emit = emitter.emit.bind(emitter);
export const on = emitter.on.bind(emitter);
export const once = emitter.once.bind(emitter);
export const off = emitter.off.bind(emitter);