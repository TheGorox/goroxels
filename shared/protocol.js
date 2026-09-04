export const OPCODES = {
    place:       0x1,
    online:      0x2,
    canvas:      0x3,
    captcha:     0x5,
    ping:        0x6,
    updateRadio: 0x8
}

export const PIXEL_FLAG_MASK = {
    isSingle:      0b10000000, // server only: 1 = single pixel, 0 = batch
    isProtect:     0b01000000,
    takeOwnership: 0b00100000, // client only
    compressed:    0b00010000, // only for rects, means mask+colors are compressed together
    usesMask:      0b00001000  // only for rects, means that it uses mask for empty pixels (color 0) instead of skipping them in data
}

export const PLACE_TYPE = {
    // === NOT RECT (pixels) ===
    // CLIENT OUT: opcode: u8, type: u8 (0x0), flags: u8, [x: u16, y: u16, color: u8] until end of buffer
    // SERVER OUT: opcode: u8, type: u8 (0x0), STREAM UNTIL END OF BUFFER:
    //             [ uid: u16, flags: u8,
    //               IF flags.isSingle THEN x: u16, y: u16, color: u8
    //               ELSE size: u16, [x: u16, y: u16, color: u8] x size ]
    pixels:     0x0,

    // === RECT (pixelsRect) ===
    // CLIENT OUT: opcode: u8, type: u8 (0x1), flags: u8, x: u16, y: u16, w: u16, h: u16, [mask: 1-bit stream]*, colors: u8[w*h]
    // SERVER OUT: opcode: u8, type: u8 (0x1), uid: u16, flags: u8, x: u16, y: u16, w: u16, h: u16, [DATA]
    // * DATA structure (if compressed, deflateSync contains this whole block):
    //   [flag.usesMask ? 1-bit mask stream (1 bit = transparency, padded to full byte at the end)] + [colors: u8[w*h]]
    pixelsRect: 0x1 
}

export const CLOSE_CODES = {
    BANNED: 0,
    SERVER_ERROR: 1,
    CLIENT_ERROR: 2
}

export const STRING_OPCODES = {
    error: 'e',
    userJoin: 'u',
    userLeave: 'l',
    subscribeChat: 's',
    chatMessage: 'c',
    alert: 'a',
    me: 'm',
    reload: 'r',
    reloadChunks: 'rc',
    batch: 'b'
}