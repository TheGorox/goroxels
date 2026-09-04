import { OPCODES, PLACE_TYPE, STRING_OPCODES } from '../../../../shared/protocol.js';
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
		console.log('sending', data);
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

	sendPixels(pixels, flags, options = {}) {
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

		console.log(pixelData, pixels)
		const size = pixelData.length;
		if (size % 3 !== 0) {
			console.error('Invalid pixel data length');
			return;
		}

		const buffer = new ArrayBuffer(2 + size / 3 * 5);
		const dv = new DataView(buffer);

		dv.setUint8(0, PLACE_TYPE.pixels);
		
		dv.setUint8(1, flags);

		let offset = 2;
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
			console.log('pingtick');
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
		console.log('socket opened');

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
		}
		console.log('socket message', ev);
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