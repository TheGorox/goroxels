const zlib = require('zlib');

const WebSocket = require('ws');
const { Server: WebSocketServer } = require('ws');

const logger = require('./logger')('WEBSOCKET', 'debug');
const config = require('./config');

const { MAX_CLIENTS_PER_IP } = require('./config');
const { ROLE, ROLE_I, MINUTE, chatBucket } = require('./constants');

const { Client } = require('./Client');
const Bucket = require('../../shared/classes/Bucket.js').default;
const ChatChannel = require('./ChatChannel');

const {
    createPacket,
    createStringPacket,
} = require('./protocol');
const { STRING_OPCODES, OPCODES, PLACE_TYPE, PIXEL_FLAG_MASK } = require('../../shared/protocol.js');

const { checkCanvasConditions } = require('./utils/canvas');
const { checkRole } = require('./utils/role');
const { getIPFromRequest, getIPv6Subnet, ipToInt } = require('./utils/ip');

const { needCaptcha } = require('./captcha');


let instance = null;

// conditions for msg broadcasting
const CONDITION = {
    sameCanvas: (client, dontSendToTarget = false) => {
        return _c => _c.canvas === client.canvas && (!dontSendToTarget || _c !== client);
    }
};

const ROLE_LIMITS = {
    'ADMIN': 16 * 1024 * 1024,  // 16 MB
    'MOD': 16 * 1024 * 1024,    // 16 MB
    'TRUSTED': 5 * 1024 * 1024, // 5 MB
    'USER': 100 * 1024,         // 100 KB
    'GUEST': 10 * 1024          // 10 KB
};

const CLIENT_ALLOWED_FLAGS = PIXEL_FLAG_MASK.takeOwnership | PIXEL_FLAG_MASK.isProtect | PIXEL_FLAG_MASK.usesMask;
const SERVER_ALLOWED_FLAGS = PIXEL_FLAG_MASK.isSingle | PIXEL_FLAG_MASK.isProtect | PIXEL_FLAG_MASK.usesMask | PIXEL_FLAG_MASK.compressed;

const isPositiveNumber = (v) => Number.isFinite(v) && v > 0;

class Server {
    /**
     * 
     * @returns {Server}
     */
    static getInstance() {
        return instance
    }

    static PIXEL_SEND_INTERVAL = 50;

    constructor() {
        this.canvases = global.canvases;
        // chat channels
        this.channels = {};

        this.clients = new Map();
        this.leaved = new Map();
        this.connections = {
            TOTAL: {}
        }
        this.onlineStats = {};

        this.broadcastPixelQueue = new Map();

        this.wss = null;

        instance = this;

        // motd can be set through console command
        this.MOTD = null;


        setInterval(this.updateOnlineStats.bind(this), 10000);
    }

    verifyClient(request, socket) {
        const ip = socket.realIp;
        if (this.connections['TOTAL'][ip] && this.connections['TOTAL'][ip] > 50)
            return false
        return true
    }

    run() {
        this.startTime = Date.now();

        const wss = new WebSocketServer({
            noServer: true,
            maxPayload: ROLE_LIMITS.GUEST,
            closeTimeout: 5000,
        });

        this.channels.global = new ChatChannel('global');

        this.canvases.forEach(canvas => {
            this.channels[canvas.name] = new ChatChannel(canvas.name);
            this.channels[canvas.name].canvas = canvas;

            this.connections[canvas.name] = {};

            const bufferLimit = 256 * 1024;
            const buffer = Buffer.alloc(bufferLimit);

            this.broadcastPixelQueue.set(canvas, {
                buffer,
                view: new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength),
                curOffset: 0,

                interval: null
            });
            this.startOrRestartPixelQueueBroadcastInterval(canvas);
        });

        wss.on('connection', (socket, request, user, canvas) => {
            const ip = getIPv6Subnet(getIPFromRequest(request));
            const ipInt = ipToInt(ip);

            const client = new Client(socket);
            client.user = user;
            client.ip = ip;
            client.ipInt = ipInt;

            client.canvas = canvas;

            let cooldown = client.canvas.cooldown.GUEST;
            if (client.user) {
                const role = client.user.role || 'USER';
                client.socket._receiver._maxPayload = ROLE_LIMITS[role];

                if (role == 'ADMIN')
                    cooldown = [0, 32]
                else {
                    cooldown = client.canvas.cooldown[client.user.role];
                }
            }


            this.clients.set(client.id, client);

            if (this.connections['TOTAL'][ip])
                this.connections['TOTAL'][ip] += 1;
            else
                this.connections['TOTAL'][ip] = 1;

            socket.onclose = () => {
                logger.debug('socket closed')
                this.clients.delete(client.id);

                // won't let users use reconnection to reset cd or spam
                const currentIp = ip;
                const canvasName = client.canvas ? client.canvas.name : null;

                setTimeout(() => {
                    if (this.connections['TOTAL'][currentIp]) this.connections['TOTAL'][currentIp]--;
                    if (canvasName && this.connections[canvasName] && this.connections[canvasName][currentIp]) {
                        this.connections[canvasName][currentIp]--;
                    }
                }, 900);

                if (!client.user || !client.user.isApiSocket) {
                    if (client.canvas) {
                        const packet = {
                            c: STRING_OPCODES.userLeave,
                            id: client.id
                        };
                        this.broadcastString(JSON.stringify(packet), CONDITION.sameCanvas(client));
                    };

                    this.leaved.set(client.id, client);
                }

                socket = null;

                this.broadcastOnline();
            }

            socket.onmessage = (event) => this.onmessage(client, event);

            socket.on('error', err => {
                logger.error('Socket client error: ' + err.message)
            })

            if (needCaptcha(client.ip, client)) {
                client.sendCaptcha();
            }

            client.bucket = new Bucket(...cooldown);
            this.onCanvasChosen(client.canvas, client);
        });
        wss.on('error', err => {
            logger.error(err);
        })

        this.wss = wss;
        setInterval(this.ping.bind(this), 35000);
    }

    // sometimes we may need to change interval delay
    startOrRestartPixelQueueBroadcastInterval(canvas, intervalDelay = Server.PIXEL_SEND_INTERVAL) {
        const objPixelQueueRef = this.broadcastPixelQueue.get(canvas);

        // this bytes are never changed later and the writer preserves them
        objPixelQueueRef.buffer.writeUint8(OPCODES.place, 0);
        objPixelQueueRef.buffer.writeUint8(PLACE_TYPE.pixels, 1);

        if(objPixelQueueRef.curOffset === 0){
            objPixelQueueRef.curOffset = 2;
        }

        clearInterval(objPixelQueueRef.interval);
        objPixelQueueRef.interval = setInterval(() => {
            this.flushPixelQueue(canvas);
        }, intervalDelay);
    }

    flushPixelQueue(canvas) {
        const pixelQueue = this.broadcastPixelQueue.get(canvas);
        if (pixelQueue.curOffset > 2) {
            let subBuffer = pixelQueue.buffer.subarray(0, pixelQueue.curOffset);
            this.broadcastForCanvasFast(canvas, subBuffer);
            pixelQueue.curOffset = 2; // reset to the position after header (opcode + type)
        }
    }


    initOnlineBroadcast() {
        // todo
    }

    checkUser(client) {
        return !!client.user
    }

    checkCanvas(client) {
        return client.canvas !== null
    }

    checkShadowBan(client) {
        if (!client.user) return true;
        return !client.user.shadowBanned;
    }

    checkCaptcha(client) {
        if (needCaptcha(client.ip, client)) {
            client.sendError('error.captcha');
            return false
        }

        return true
    }

    checkDelay(client) { // delay for placing after join
        // can be set only through the admin menu
        if (config.afterJoinDelay === 0) return true;
        if (!client.joinTime) return false;

        return (Date.now() >= (client.joinTime + config.afterJoinDelay))
    }

    checkCanvasRequires(client, canvas) {
        if (!canvas || !canvas.require) return true;

        return checkCanvasConditions(client.user, canvas.require)
    }

    onmessage(client, ev) {
        if(client.terminated) return;

        if (ev.type !== 'message') return;

        // ws rate limiting
        if (!client.wsBucket.spend(1)) {
            logger.debug(`killing client ${client.id}: ws rate limit hit`);
            client.kill();
            return;
        }

        client.isAlive = true;

        let message = ev.data;

        try {
            if (typeof message === 'string') {
                logger.debug('Got string message: ' + message);

                this.handleStringMessage(message, client);
            } else {
                this.handleBinaryMessage(message, client);
            }
        } catch (e) {
            logger.error(e.message)
            client.weirds += 0.5;
        }
    }

    broadcastReloadChunks(canvas, chunks) {
        const packet = createStringPacket.chunksReload(chunks);
        const packetStr = JSON.stringify(packet);
        this.broadcastStringByCond(packetStr, CONDITION.sameCanvas({ canvas }));
    }


    handleBinaryMessage(message, client) {
        switch (message.readUInt8(0)) {
            case OPCODES.ping: {
                client.emit('pong');
                break;
            }

            case OPCODES.place: {

                if (!this.checkCanvas(client) ||
                    !this.checkCaptcha(client) ||
                    !this.checkDelay(client) ||
                    !this.checkShadowBan(client)) return;


                const isGuest = !client.user;
                
                const clientCanvas = client.canvas;
                
                const isMod = !isGuest && ROLE[client.user.role] >= ROLE.MOD;
                const isTrusted = !isGuest && ROLE[client.user.role] >= ROLE.TRUSTED;
                const isApiSocket = !!client.user?.isApiSocket;

                const placeSubtype = message.readUInt8(1);
                const dv = new DataView(message.buffer, message.byteOffset, message.byteLength);
                
                let flags = dv.getUint8(2) & CLIENT_ALLOWED_FLAGS;
                const isProtect = !!(flags & PIXEL_FLAG_MASK.isProtect);
                const takeOwnership = !!(flags & PIXEL_FLAG_MASK.takeOwnership);
                const usesMask = !!(flags & PIXEL_FLAG_MASK.usesMask);
                
                const {
                    realWidth, realHeight
                } = client.canvas;
                const maxClrId = isProtect ? 1 : client.canvas.palette.length - 1;
                
                switch (placeSubtype) {
                    case PLACE_TYPE.pixels: {
                        if (!takeOwnership && !isMod) {
                            client.sendReload();
                            client.kill();
                            return;
                        }

                        const broadcastQueue = this.broadcastPixelQueue.get(client.canvas);
                        const size = dv.byteLength - 3;
                        if (size % 5 !== 0) {
                            client.sendReload();
                            client.kill();
                            return;
                        }

                        const outSize = 2 + 1 + 2 + size; // uid + flags + size + pixels
                        const isSingle = size === 5;
                        if (isSingle) {
                            flags |= PIXEL_FLAG_MASK.isSingle;
                        } else if (outSize >= broadcastQueue.buffer.byteLength - 2) {
                            client.sendError('pixel buffer overflow');
                            client.kill();
                            return;
                        }

                        if (broadcastQueue.curOffset + outSize >= broadcastQueue.byteLength) {
                            this.flushPixelQueue(clientCanvas);
                            client.weirds += 0.5;
                        }

                        const outDv = broadcastQueue.view;
                        
                        // using vitual offset so we don't have to revert changes if something goes wrong
                        let virtOffset = broadcastQueue.curOffset;

                        outDv.setUint16(virtOffset, client.id); virtOffset += 2;
                        outDv.setUint8(virtOffset, flags & SERVER_ALLOWED_FLAGS); virtOffset += 1;
                        
                        let outSizePos = virtOffset;
                        if (!isSingle) virtOffset += 2;

                        let pixelsWrote = 0;

                        for (let i = 3; i < size; i += 5) {
                            const x = dv.getUint16(i);
                            const y = dv.getUint16(i + 2);
                            const c = dv.getUint8(i + 4);
                            
                            if (x >= realWidth ||
                                y >= realHeight ||
                                c > maxClrId) {
                                    client.weirds += 1;
                                    break;
                                };
                                
                                if (!client.bucket.spend(1)) {
                                    break;
                                }
                            

                            if (!isTrusted) {
                                // check for protection
                                const oldPixel = client.canvas.chunkManager.getChunkPixel(x, y);
                                if (oldPixel & 0x80) {
                                    continue;
                                }
                            }

                            
                            if (isProtect && isTrusted) {
                                client.canvas.chunkManager.setPixelProtected(x, y, c);
                            } else {
                                client.canvas.chunkManager.setChunkPixel(x, y, c, !isApiSocket); // <-- do not backup apisocket pixels
                                if (takeOwnership || !isMod) { // only mods can place without taking ownership
                                    client.canvas.chunkManager.setPlacerDataRaw(x, y, client.placeInfoFlag, client.placeInfoNumber);
                                }
                            }

                            outDv.setUint16(virtOffset, x); virtOffset += 2;
                            outDv.setUint16(virtOffset, y); virtOffset += 2;
                            outDv.setUint8(virtOffset, c); virtOffset += 1;

                            pixelsWrote++;
                        }

                        console.log({pixelsWrote})

                        if (pixelsWrote > 0) {
                            if (!isSingle) {
                                outDv.setUint16(outSizePos, pixelsWrote * 5);
                            }

                            broadcastQueue.curOffset = virtOffset;
                        }

                        break;
                    }
                    case PLACE_TYPE.pixelsRect: {

                        if (!takeOwnership && !isMod) {
                            client.sendReload();
                            client.kill();
                            return;
                        }

                        const x = dv.getUint16(3);
                        const y = dv.getUint16(5);
                        const w = dv.getUint16(7);
                        const h = dv.getUint16(9);

                        if (w === 0 || h === 0 || x + w > realWidth || y + h > realHeight) {
                            client.weirds += 1;
                            break;
                        }

                        let dataOffset = 11;
                        let mask = null;
                        let expectedColors = w * h;

                        if (usesMask) {
                            const maskBytes = Math.ceil((w * h) / 8);
                            if (dataOffset + maskBytes > dv.byteLength) {
                                client.sendReload();
                                client.kill();
                                return;
                            }
                            mask = new Uint8Array(message.buffer, message.byteOffset + dataOffset, maskBytes);
                            dataOffset += maskBytes;

                            expectedColors = 0;
                            for (let i = 0; i < w * h; i++) {
                                if (mask[i >> 3] & (1 << (7 - (i & 7)))) {
                                    expectedColors++;
                                }
                            }
                        }

                        if (dataOffset + expectedColors > dv.byteLength) {
                            client.sendReload();
                            client.kill();
                            return;
                        }

                        if (!client.bucket.spend(expectedColors)) {
                            break;
                        }

                        const colors = new Uint8Array(message.buffer, message.byteOffset + dataOffset, expectedColors);
                        let colorIdx = 0;
                        let pixelsWrote = 0;

                        for (let i = 0; i < w * h; i++) {
                            if (usesMask && !(mask[i >> 3] & (1 << (7 - (i & 7))))) {
                                continue;
                            }

                            const px = x + (i % w);
                            const py = y + Math.floor(i / w);
                            const c = colors[colorIdx++];

                            if (c > maxClrId) {
                                client.weirds += 1;
                                continue;
                            }

                            if (!isTrusted) {
                                const oldPixel = client.canvas.chunkManager.getChunkPixel(px, py);
                                if (oldPixel & 0x80) continue;
                            }

                            if (isProtect && isTrusted) {
                                client.canvas.chunkManager.setPixelProtected(px, py, c);
                            } else {
                                client.canvas.chunkManager.setChunkPixel(px, py, c, !isApiSocket);
                                if (takeOwnership || !isMod) {
                                    client.canvas.chunkManager.setPlacerDataRaw(px, py, client.placeInfoFlag, client.placeInfoNumber);
                                }
                            }
                            pixelsWrote++;
                        }

                        if (pixelsWrote > 0) {
                            // const shouldCompress = 
                            const serverFlags = flags & SERVER_ALLOWED_FLAGS;
                            const payloadSize = dv.byteLength - 3;
                            const outBuf = Buffer.allocUnsafe(5 + payloadSize);

                            outBuf.writeUInt8(OPCODES.place, 0);
                            outBuf.writeUInt8(PLACE_TYPE.pixelsRect, 1);
                            outBuf.writeUInt16BE(client.id, 2);
                            outBuf.writeUInt8(serverFlags, 4);

                            message.copy(outBuf, 5, 3);

                            // this.broadcastRect(outBuf); 
                        }

                        break;
                    }
                }

                break
            }
        }
    }

    handleStringMessage(msg, client) {
        try {
            msg = JSON.parse(msg);
        } catch {
            logger.debug('cannot parse string message: ' + msg);
            return
        }

        switch (msg.c) {
            // unsubscribes is not provided by the moment
            case STRING_OPCODES.subscribeChat: {
                if (!msg.ch || typeof msg.ch !== 'string' ||
                    this.channels[msg.ch] === undefined) {

                    return client.sendError('invalid channel');
                }

                if (!this.checkCanvasRequires(client, this.channels[msg.ch].canvas)) {
                    return client.sendError('Access for this channel is restricted')
                }

                // for the moment it's the only way to detect if
                // client is reconnected after server reload
                if (msg.reconnect) {
                    if (Date.now() - this.startTime < 10000) {
                        const packet = createStringPacket.reload();
                        client.send(JSON.stringify(packet));
                        return
                    }
                }

                const ch = this.channels[msg.ch];

                if (client.subscribedChs.includes(ch))
                    return

                client.subscribedChs.push(ch);
                if (this.checkUser(client)) {
                    if (!client.chatBuckets[ch.name]) {
                        client.chatBuckets[ch.name] = new Bucket(...chatBucket[client.user.role]);
                    }
                }
                if (!msg.reconnect) {
                    this.onChatSubscribed(ch, client);
                }

                break
            }


            case STRING_OPCODES.chatMessage: {
                if (!this.checkUser(client) ||
                    !this.checkCaptcha(client) ||
                    !msg?.msg.text || msg.ch === undefined
                ) return;

                const channel = this.channels[msg.ch];
                if (!channel) return;

                if (!this.checkCanvasRequires(client, this.channels[msg.ch].canvas)) {
                    return client.sendError('Access for this channel is restricted')
                }

                const nick = client.user.name;
                const message = msg.msg.text.trim();
                const replyingTo = msg.msg.replyTo;
                if (replyingTo !== null && !isPositiveNumber(replyingTo)) return;

                let maxLen = 200, user = client.user;
                switch (true) {
                    case checkRole(user, ROLE.TRUSTED): maxLen = 250;
                    case checkRole(user, ROLE.MOD): maxLen = 400;
                    case checkRole(user, ROLE.ADMIN): maxLen = Infinity;
                }

                if (!message.length || message.length > maxLen) return;

                if (!client.chatBuckets[channel.name].spend(1)) {
                    return client.sendChatWarn('You\'ve been hit chat limit. Wait')
                }

                if (msg.whisper) {
                    let target = null;
                    for (let [_, client] of this.clients.entries()) {
                        if (client.user && client.user.id == msg.whisper && client.subscribedChs.includes(channel)) {
                            target = client;
                            break
                        }
                    }

                    if (!target) {
                        return client.sendChatWarn(`User with id "${msg.whisper}" is not online on this canvas`);
                    }

                    // why span? name color tags which aren't closed will spread to the message
                    target.sendChat(`[w] ${client.user.name}`, `[i]${message}[/i]`, channel.name, false);
                    return
                }

                const chatMessage = channel.addMessage(
                    nick,
                    message,
                    false,
                    Date.now(),
                    replyingTo
                );

                const packet = createStringPacket.chatMessage(chatMessage, channel.name);
                this.broadcastString(JSON.stringify(packet), receiver => {
                    return receiver.subscribedChs.includes(channel)
                });

                break
            }

            
            case STRING_OPCODES.alert: {
                if (!this.checkUser(client) ||
                    ROLE[client.user.role] < ROLE.MOD
                ) {
                    return
                }

                if (msg.msg.length == 0) {
                    return
                }

                let packet = createStringPacket.alert(msg.msg, msg.type);

                if (msg.to === 'all') packet.msg = '[all] ' + packet.msg;

                packet = JSON.stringify(packet);

                if (msg.to === 'all' && ROLE[client.user.role] === ROLE.ADMIN) {
                    this.clients.forEach(client => client.send(packet));
                } else if (!isNaN(msg.to)) {
                    const id = +msg.to;
                    const client = this.clients.get(id);
                    if (!client) return;

                    client.send(packet);
                }

                break
            }
            // temporary
            case 'transmit': {
                if (!client.user.isApiSocket) return;

                this.broadcastString(JSON.stringify(msg), c => c.canvas.id === msg.canvas);
                break;
            }
        }
    }

    broadcastRect(rect, canvas) {

    }


    broadcastOnline() {
        let online = [...this.clients.values()].reduce((s, c) => c.canvas ? s + 1 : s, 0);

        let buf = Buffer.alloc(1 + 3);
        buf.writeUInt8(OPCODES.online, 0);
        buf.writeUInt16BE(online, 1);

        this.broadcastBinary(buf);
    }

    broadcastForCanvasFast(canvas, buffer) {
        // we create a frame manually
        // to avoid object recreation
        // for every receiver
        const frame = WebSocket.Sender.frame(buffer, {
            readOnly: true,
            mask: false,
            rsv1: false,
            opcode: 2,
            fin: true,
        });

        const toSend = Buffer.concat(frame);

        this.clients.forEach(client => {
            if (client.canvas !== canvas) {
                return
            }


            try {
                client.socket._socket.write(toSend);
            } catch (error) {
                logger.error(`WebSocket broadcast error: ${error.message}`);
            }
        });
    }

    broadcastReload(canvas) {
        const packet = createStringPacket.reload();
        this.broadcastString(JSON.stringify(packet), canvas ? c => c.canvas == canvas : null);
    }


    broadcastBinary(data) {
        this.clients.forEach(client => client.send(data));
    }

    broadcastString(msg, checkFunc) {
        if (checkFunc)
            this.broadcastStringByCond(msg, checkFunc);
        else
            this.clients.forEach(client => client.send(msg));
    }

    broadcastStringByCond(msg, checkFunc) {
        this.clients.forEach(client => checkFunc(client) && client.send(msg));
    }

    onChatSubscribed(ch, client) {
        logger.debug(client.ip + ' subscribed ' + ch.name);

        const messagesPacketsArr = [];
        ch.getMessages().forEach(msg => {
            const packet = createStringPacket.chatMessage(msg, ch.name);
            messagesPacketsArr.push(packet);
        });

        const motdText = this.MOTD ? ('[b]MOTD: ' + this.MOTD + '[/b]') : (`Welcome to the [#00f986]Goroxels 2.0[], server ${ch.name}!`)
        messagesPacketsArr.push(
            createStringPacket.chatMessage({
                name: '',
                message: motdText,
                isServer: true,
                time: Date.now()
            }, ch.name)
        );

        const messagesBatch = createStringPacket.batch(messagesPacketsArr);
        client.send(JSON.stringify(messagesBatch));
    }

    sendServerMessage(message, channel, addToLog = true) {
        const packet = createStringPacket.chatMessage({
            nick: '',
            message
        }, channel ? channel.name : undefined);
        packet.server = true;
        addToLog && channel && channel.addMessage('', message, true)
        this.broadcastString(JSON.stringify(packet), receiver => {
            return channel ? receiver.subscribedChs.includes(channel) : true
        })
    }

    onCanvasChosen(canvas, client) {
        const role = client.user ? client.user.role : 'GUEST';
        if (!this.connections[canvas.name][client.ip])
            this.connections[canvas.name][client.ip] = 1;
        else
            this.connections[canvas.name][client.ip]++;

        if (this.connections[canvas.name][client.ip] > MAX_CLIENTS_PER_IP[role]) {
            client.sendError('connections limit');
            return client.kill();
        }

        let placeInfoFlag, placeInfoNumber;
        if (client.user) {
            placeInfoFlag = 2;
            placeInfoNumber = client.user.id;
        } else {
            if (typeof client.ipInt === 'bigint') {
                placeInfoFlag = 3;
            } else {
                placeInfoFlag = 1
            }

            placeInfoNumber = client.ipInt;
        }

        client.placeInfoFlag = placeInfoFlag;
        client.placeInfoNumber = placeInfoNumber;

        const packet = createStringPacket.userJoin(client);
        client.joinTime = Date.now();

        if (!client.user || !client.user.isApiSocket)
            this.broadcastString(JSON.stringify(packet), CONDITION.sameCanvas(client, true));

        // new ME packet
        packet.user.isMe = true;
        client.send(JSON.stringify(packet));

        const userPacketsArr = [];

        this.clients.forEach(_client => {
            if (_client.user && _client.user.isApiSocket) return;

            if (_client !== client && _client.canvas === canvas) {
                const userJoinPacket = createStringPacket.userJoin(_client);
                userPacketsArr.push(userJoinPacket);
            }
        });

        if (userPacketsArr.length > 0) {
            const usersBatch = createStringPacket.batch(userPacketsArr);
            client.send(JSON.stringify(usersBatch));
        }

        this.broadcastOnline();
    }

    // close any socket by condition function
    closeBy(condition) {
        this.clients.forEach(client => {
            if (condition(client)) {
                client.kill();
                this.leaved.set(client.id, client)
                this.clients.delete(client.id);
            }
        })
    }

    closeByIp(ip) {
        this.closeBy(client => client.ip === ip);
    }

    closeByUser(user) {
        this.closeBy(client => client.user && client.user.id === user.id);
    }

    ping() {
        for (const client of this.clients.values()) {
            if (!client.isAlive) {
                client.kill();
                this.clients.delete(client.id);
            }
            client.isAlive = false;
        }
    }

    updateOnlineStats() {
        for (let key of Object.keys(this.connections)) {
            let totalPerCanvas = 0;
            for (let ipConns of Object.values(this.connections[key])) {
                if (ipConns == 0) continue;
                totalPerCanvas++;
            }
            this.onlineStats[key] = totalPerCanvas;
        }
    }

    broadcastRadioChange(type = 0) {
        const packet = createPacket.radioChange(type);
        this.broadcastBinary(packet);
    }
}

module.exports = Server