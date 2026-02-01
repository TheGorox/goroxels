const compressWorker = {
    worker: new Worker(new URL('./compress.worker.js', import.meta.url)),

    decompress: async (imUint8Arr) => {
        return new Promise((res, rej) => {
            let timeout = setTimeout(onerror.bind(this, 'timeout'), 10_000);

            const taskId = Math.random();
            compressWorker.worker.postMessage(
                { data: imUint8Arr, level: 2, id: taskId},
                [imUint8Arr.buffer]
            );

            compressWorker.worker.addEventListener('message', onmessage);
            compressWorker.worker.addEventListener('error', onerror);

            function onerror(err){
                cleanup();

                rej(err);
            }
            function onmessage(e){
                if(e.data.id !== taskId) return;

                cleanup();
                res(e.data.decompressed);
            }
            function cleanup(){
                compressWorker.worker.removeEventListener('message', onmessage);
                compressWorker.worker.removeEventListener('error', onerror);

                clearTimeout(timeout);
            }
        })
    }
}
window.wowo = compressWorker;

export default {
    compressWorker
}