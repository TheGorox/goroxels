import { OPCODES, PIXEL_FLAG_MASK, PLACE_TYPE, STRING_OPCODES } from '../../../../shared/protocol.js';
import { config } from './canvasConfig.svelte.js';
import { emitter } from './events.js';
import { createPixelBufferizer } from './utils/socket.svelte.js';

const PING_INTERVAL = 25000;

class Socket {
    isConnected = $state(false);

    #socket = null;
    #eventTarget = null;
    #core = null;

    #pingWorker = null;
    #alive = false;
    #justStarted = true;

    #connectAttempts = 0;
    #reconnectTimeoutFactor = 1.5;
    #reconnectMaxTimeout = 20000;

    pixelsBufferizer = null;

    init(core) {
        this.#core = core;
        this.#eventTarget = emitter;

        this.#open();
        this.#initPingWorker();

        this.pixelsBufferizer = createPixelBufferizer(this, core);
    }

    send(data) {
        this.#alive = true;

        if (!this.isConnected) {
            console.error('trying to send something on closed socket!', data);
            return false;
        }

        this.#socket.send(data);
        return true;
    }

    sendPing() {
        const uarr = new Uint8Array(1);
        uarr[0] = OPCODES.ping;

        this.send(uarr);
    }

    sendPixels(pixels, flags = PIXEL_FLAG_MASK.takeOwnership, options = {}) {
        if (!pixels || pixels.length === 0) return;

        let pixelData;
        if (Array.isArray(pixels[0])) {
            pixelData = pixels.flat();
        } else if (typeof pixels[0] === 'object') {
            pixelData = [];
            for (const p of pixels) {
                pixelData.push(p.x, p.y, p.c);
            }
        } else {
            pixelData = pixels;
        }

        const size = pixelData.length;
        if (size % 3 !== 0) {
            console.error('Invalid pixel data length');
            return;
        }

        const buffer = new ArrayBuffer(3 + size / 3 * 5);
        const dv = new DataView(buffer);

        dv.setUint8(0, OPCODES.place);
        dv.setUint8(1, PLACE_TYPE.pixels);

        dv.setUint8(2, flags);

        let offset = 3;
        for (let i = 0; i < pixelData.length; i += 3) {
            const x = pixelData[i];
            const y = pixelData[i + 1];
            const c = pixelData[i + 2];

            dv.setUint16(offset, x);
            offset += 2;
            dv.setUint16(offset, y);
            offset += 2;
            dv.setUint8(offset, c);
            offset += 1;
        }

        this.send(buffer);
    }

    sendChatMessage(msg, channel) {
        const packet = {
            c: STRING_OPCODES.chatMessage,
            ch: channel,
            msg
        };

        return this.send(JSON.stringify(packet));
    }

    sendChatSubscribe(channel, isReconnect) {
        const packet = {
            c: STRING_OPCODES.subscribeChat,
            ch: channel,
            reconnect: isReconnect
        };

        this.send(JSON.stringify(packet));
    }

    terminate() {
        // todo
    }

    #open = () => {
        if (this.#socket && this.#socket.readyState !== WebSocket.CLOSED) {
            this.#removeAllListeners();
            this.#socket.close();
            this.#onclose(false);
        }

        const canvasName = config.canvasName;
        if (!canvasName) throw new Error('socket should be initialized after the config!');

        const isHttps = document.location.protocol.startsWith('https');
        const host = document.location.host; // with port
        const path = `${isHttps ? 'wss' : 'ws'}:${host}/${canvasName}`;

        this.#socket = new WebSocket(path);
        this.#socket.binaryType = 'arraybuffer';
        this.#socket.addEventListener('open', this.#onopen);
        this.#socket.addEventListener('message', this.#onmessage);
        this.#socket.addEventListener('close', this.#onclose);
    };

    #initPingWorker() {
        // ping needs a worker because unfocused tab optimization has crossed all borders
        const workerCode = `
			let timer = null;
			self.onmessage = function(e) {
				if (e.data === 'start') {
					clearInterval(timer);
					timer = setInterval(() => {
						self.postMessage('tick');
					}, ${PING_INTERVAL});
				} else if (e.data === 'stop') {
					clearInterval(timer);
				}
			};
		`;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.#pingWorker = new Worker(URL.createObjectURL(blob));

        this.#pingWorker.postMessage('start');

        this.#pingWorker.onmessage = () => {
            this.#executePingTick();
        };
    }

    #executePingTick() {
        if (!this.isConnected) return;

        // ping is only for the client (help yourself)
        if (!this.#alive) {
            this.sendPing();
        }

        this.#alive = false;
        this.sendPing();
    }

    #onopen = () => {
        this.#connectAttempts = 0;
        this.isConnected = true;

        this.#alive = false;

        this.#dispatch('connected');

        this.#subscribeChats();
        this.#justStarted = false;
    };

    #subscribeChats() {
        const isReconnect = !this.#justStarted;

        this.sendChatSubscribe('global', isReconnect);
        this.sendChatSubscribe(this.#core.config.canvasName, isReconnect);
    }

    #onmessage = (ev) => {
        const data = ev.data;
        if (typeof data === 'string') {
            this.#handleStringMessage(data);
        } else {
            const dv = new DataView(ev.data);
            this.#handleBinaryMessage(dv);
        }
    };

    #handleStringMessage(msg) {
        const parsed = typeof msg === 'object' ? msg : JSON.parse(msg);
        const op = parsed.c;

        switch (op) {
            case STRING_OPCODES.batch: {
                for (const packet of parsed.packets) {
                    this.#handleStringMessage(packet);
                }
                break;
            }
            case STRING_OPCODES.userJoin: {
                const user = parsed.user;

                this.#dispatch('userJoin', user);
                if (user.isMe) {
                    this.#dispatch('me', user);
                }
                break;
            }
            case STRING_OPCODES.userLeave: {
                this.#dispatch('userLeave', parsed.id);
                break;
            }
            case STRING_OPCODES.chatMessage: {
                delete parsed['c'];

                this.#dispatch('chatMessage', parsed);
                break;
            }
        }
    }

    #handleBinaryMessage(dv) {
        if (dv.byteLength === 0) return;

        const opcode = dv.getUint8(0);

        switch (opcode) {
            case OPCODES.online: {
                if (dv.byteLength < 3) return;
                this.#dispatch('online', dv.getUint16(1));
                break;
            }

            case OPCODES.radioChange: {
                if (dv.byteLength < 2) return;
                this.#dispatch('radioChange', dv.getUint8(1));
                break;
            }

            case OPCODES.place: {
                if (dv.byteLength < 2) return;

                const type = dv.getUint8(1);

                switch (type) {
                    case PLACE_TYPE.pixels: {
                        let offset = 2;

                        while (offset + 3 <= dv.byteLength) {
                            const id = dv.getUint16(offset);
                            const flags = dv.getUint8(offset + 2);
                            offset += 3;

                            if (flags & PIXEL_FLAG_MASK.compressed) {
                                this.#dispatch('binary', {
                                    opcode,
                                    type,
                                    id,
                                    flags,
                                    bytes: new Uint8Array(dv.buffer, dv.byteOffset, dv.byteLength)
                                });
                                break;
                            }

                            const isSingle = Boolean(flags & PIXEL_FLAG_MASK.isSingle);
                            let size = 5;

                            if (!isSingle) {
                                if (offset + 2 > dv.byteLength) break;
                                size = dv.getUint16(offset);
                                offset += 2;
                            }

                            if (size === 0 || size % 5 !== 0 || offset + size > dv.byteLength) break;

                            const pixels = [];

                            for (let i = 0; i < size; i += 5) {
                                pixels.push(
                                    dv.getUint16(offset + i),
                                    dv.getUint16(offset + i + 2),
                                    dv.getUint8(offset + i + 4)
                                );
                            }

                            offset += size;

                            this.#dispatch('pixels', {
                                id,
                                flags,
                                pixels
                            });
                        }

                        break;
                    }

                    case PLACE_TYPE.pixelsRect: {
                        if (dv.byteLength < 13) return;

                        const id = dv.getUint16(2);
                        const flags = dv.getUint8(4);
                        const x = dv.getUint16(5);
                        const y = dv.getUint16(7);
                        const w = dv.getUint16(9);
                        const h = dv.getUint16(11);

                        const total = w * h;

                        if (!Number.isSafeInteger(total) || total < 0) return;

                        let offset = 13;
                        let mask = null;
                        let expectedColors = total;

                        if (flags & PIXEL_FLAG_MASK.usesMask) {
                            const maskBytes = Math.ceil(total / 8);

                            if (offset + maskBytes > dv.byteLength) return;

                            mask = new Uint8Array(dv.buffer, dv.byteOffset + offset, maskBytes);
                            offset += maskBytes;

                            expectedColors = 0;

                            for (let i = 0; i < total; i++) {
                                if (mask[i >> 3] & (1 << (7 - (i & 7)))) {
                                    expectedColors++;
                                }
                            }
                        }

                        if (offset + expectedColors > dv.byteLength) return;

                        const colors = new Uint8Array(dv.buffer, dv.byteOffset + offset, expectedColors);

                        this.#dispatch('pixelsRect', {
                            id,
                            flags,
                            x,
                            y,
                            w,
                            h,
                            mask,
                            colors
                        });

                        break;
                    }
                }

                break;
            }

            default: {
                this.#dispatch('binary', {
                    opcode,
                    bytes: new Uint8Array(dv.buffer, dv.byteOffset, dv.byteLength)
                });
                break;
            }
        }
    }

    #onclose = (reopen = true) => {
        this.isConnected = false;

        if (reopen) {
            const time = Math.min(
                300 * Math.pow(this.#reconnectTimeoutFactor, this.#connectAttempts),
                this.#reconnectMaxTimeout
            );
            this.#connectAttempts++;
            setTimeout(this.#open, time);
        }
    };

    #removeAllListeners() {
        if (!this.#socket) return;

        this.#socket.removeEventListener('open', this.#onopen);
        this.#socket.removeEventListener('message', this.#onmessage);
        this.#socket.removeEventListener('close', this.#onclose);
    }

    #dispatch(evName, data = null) {
        this.#eventTarget.emit('sock.' + evName, data);
    }
}

export const socket = new Socket();