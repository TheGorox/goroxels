const crypto = require('node:crypto');

function terminateWsWithMessage(socket, code, message){
    const reasonText = message; // up to 123 bytes

    const secWsAccept = crypto
        .createHash('sha1')
        .update(request.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
        .digest('base64');

    socket.write(
        'HTTP/1.1 101 Switching Protocols\r\n' +
        'Upgrade: websocket\r\n' +
        'Connection: Upgrade\r\n' +
        `Sec-WebSocket-Accept: ${secWsAccept}\r\n\r\n`
    );

    const closeCode = 4000 + code; // codes 4000-4999 are user codes free to use
    const reasonBuffer = Buffer.from(reasonText, 'utf8');
    const frame = Buffer.alloc(4 + reasonBuffer.length);

    frame[0] = 0x88; // Fin = 1, Opcode = 8 (Close)
    frame[1] = 2 + reasonBuffer.length; // payload size
    frame.writeUInt16BE(closeCode, 2);
    reasonBuffer.copy(frame, 4);

    socket.write(frame);
    socket.destroy();
}

module.exports = {
    terminateWsWithMessage
}