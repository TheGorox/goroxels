const EventEmitter = require('events');
const ChatMessage = require('./ChatMessage');

const {
    createStringPacket
} = require('./protocol');
const { STRING_OPCODES, OPCODES } = require('../../shared/protocol.js');
const Bucket = require('../../shared/classes/Bucket.js').default;

const logger = require('./logger')('CLIENT', 'debug');

const CLIENT_STATES = {
    CANVAS_NOT_CHOSEN: 0,
    CAPTCHA: 1,
    READY: 2
}

class Client extends EventEmitter {
    static lastId = 0;

    #weirds = 0;

    constructor(socket) {
        super();

        this.socket = socket;
        this.bucket = null;
        this.wsBucket = new Bucket(15, 50, true);

        this.canvas = null;

        this.id = ++Client.lastId;

        this.user = null;

        this.joinTime = 0;
        this.isAlive = true;

        this.subscribedChs = [];
        this.chatBuckets = {};

        // these are described in ChunkPlaceInfo.js
        // concretely there they are just to not determine placer flag/id
        // every time player places a pixel
        this.placeInfoFlag = 0;
        this.placeInfoNumber = 0;

        this.on('pong', () => {
            this.heartbeat();
        })
    }

    get weirds(){
        return this.#weirds;
    }

    set weirds(newValue){
        this.#weirds = newValue;
        if(this.#weirds > 5){
            logger.warn(`Killing client ${this.id} (${this.user?.username || 'Unknown'}|${this.ip}) for weirdness (weirds: ${this.#weirds})`);
            this.sendReload();
            this.kill();
        }
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    send(message) {
        this.socket.send(message);
    }

    sendError(message) {
        const str = JSON.stringify({ c: STRING_OPCODES.error, errors: [message] });
        this.send(str);
    }

    sendChatWarn(from, msg, channel, isServer=false) {
        const chatMessage = new ChatMessage('', `${msg}`, Date.now(), isServer, null, Math.random());
        const packet = createStringPacket.chatMessage(chatMessage, channel);
        this.send(JSON.stringify(packet));
    }

    sendChatWarn(msg, channel) {
        this.sendChatWarn('', `[b][WARN] ${msg}[/b]`, channel, true);
    }

    sendCaptcha() {
        let buf = Buffer.allocUnsafe(1);
        buf.writeUInt8(OPCODES.captcha, 0);

        this.send(buf);
    }

    kill() {
        logger.debug(`killing this client (${this.id})`)
        this.socket.close();
    }

    ping() {
        const buf = Buffer.alloc(1 + 8);
        buf.writeUint8(OPCODES.ping);
        buf.writeBigUInt64BE(BigInt(Date.now()), 1);

        this.send(buf);

        this._pingTime = Date.now();
    }

    heartbeat() {
        this.isAlive = true;
    }

    isCooldownZero() {
        return this.bucket && this.bucket.delay === 0;
    }

    sendReload(){
        const str = JSON.stringify({ c: STRING_OPCODES.reload });
        this.send(str);
    }
}

module.exports = {
    Client,
    CLIENT_STATES
}