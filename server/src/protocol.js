const { STRING_OPCODES, OPCODES } = require('../../shared/protocol.js');


const createPacket = {
    pixelSendQueueBufferSize: 9,
    pixelSendEnqueue: (x, y, col, uid, targBuffer, targBufferOffset) => {
        const offs = targBufferOffset;
        targBuffer.writeUInt16BE(x, offs);
        targBuffer.writeUInt16BE(y, offs+2);
        targBuffer.writeUInt8(col, offs+4);
        targBuffer.writeUInt32BE(uid, offs+5);

        return null
    },
    pixelSend: (x, y, col, uid) => {
        const buf = Buffer.allocUnsafe(1 + 9);
        buf.writeUInt8(OPCODES.place, 0);
        buf.writeUint16BE(x, 1);
        buf.writeUint16BE(y, 3);
        buf.writeUint8(col, 5);
        buf.writeUInt32BE(uid, 6);

        return buf
    },
    // pixelsSend: (pixels, uid){

    // },
    online: (count) => {
        const buf = Buffer.allocUnsafe(1 + 2);
        buf.writeUInt8(OPCODES.online, 0);
        buf.writeUInt16BE(count, 1);

        return buf
    },

    radioChange: (type) => {
        const buf = Buffer.allocUnsafe(1 + 1);
        buf.writeUInt8(OPCODES.updateRadio, 0);
        buf.writeUInt8(type, 1);

        return buf
    }
}

const createStringPacket = {
    error: (...errors) => {
        return {
            c: STRING_OPCODES.error,
            errors: errors
        }
    },
    batch: (packets) => {
        return {
            c: STRING_OPCODES.batch,
            packets
        }
    },
    userJoin: (client) => {
        return {
            c: STRING_OPCODES.userJoin,
            user: {
                nick: client.user ? client.user.name : null,
                userId: client.user ? client.user.id : null,
                id: client.id,
                registered: !!client.user,
                role: client.user ? client.user.role : null,
                badges: client.user ? client.user.badges : null,
                isMe: false
            }
        }
    },
    userLeave: (client) => {
        return {
            c: STRING_OPCODES.userLeave,
            id: client.id
        }
    },
    chatMessage: (message, channel) => {
        return {
            c: STRING_OPCODES.chatMessage,
            nick: message.name,
            msg: message.message,
            id: message.id ?? Math.random(),
            replyingTo: message.replyingTo,
            time: message.time,
            server: message.isServer,
            ch: channel,
        }
    },
    alert(message, type=0){
        return {
            c: STRING_OPCODES.alert,
            msg: message,
            type: type
        }
    },
    me(id){
        return {
            c: STRING_OPCODES.me,
            id
        }
    },
    reload(){
        return {
            c: STRING_OPCODES.reload
        }
    },
    chunksReload(chunks){
        return {
            c: STRING_OPCODES.reloadChunks,
            chunks
        }
    }
}

module.exports = {
    createPacket,
    createStringPacket,
    // unpackPacket
}