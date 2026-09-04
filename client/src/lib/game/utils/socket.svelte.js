const SEND_INTERVAL_MS = 50;

export function createPixelBufferizer(socket, core){
    const flushInterval = setInterval(() => {
        if(pixelsQueue.length){
            flushQueue();
        }
    }, SEND_INTERVAL_MS);

    const pixelsQueue = [];
    const lastFlags = 0;


    function enqueuePixels(pixels, flags=[], ){
        const newFlags = packFlags(flags);
        if(newFlags !== lastFlags){
            const success = flushQueue();
            if(!success) return false;
        }

        pixelsQueue.push(...pixels);

        return true;
    }

    function flushQueue(){
        if(!pixelsQueue.length || !socket.isConnected){
            return false;
        }

        socket.sendPixels(pixelsQueue, lastFlags);
        pixelsQueue.length = 0;
        return true;
    }

    return {
        terminate: () => {
            clearInterval(flushInterval);
        }
    }
}

function packFlags(flagsArr){
    return flagsArr.reduce((acc, cur) => acc |= cur, 0);
}