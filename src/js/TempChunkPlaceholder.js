// this class is for loading/getting saved chunk placeholder,
// based on the previous loaded chunk image

import { canvasId, chunkSize } from './config.js';
import * as idxDb from './indexedDb.js'
import { resizeCanvas } from './utils/misc';

export default class TempChunkPlaceholder {
    constructor(chunkX, chunkY) {
        this.x = chunkX;
        this.y = chunkY;
    }

    // load from localStorage
    async load() {
        return new Promise((res, rej) => {
            const dbKey = `${canvasId}-${this.x}-${this.y}`;
            idxDb.addInitCallback(async () => {
                try {
                    const chunkData = await this._loadFromDb(dbKey);
                    const chunkCanvas = this._fromData(chunkData);

                    res(chunkCanvas);
                } catch (error) {
                    rej(error);
                }
            })
        })
    }

    async _loadFromDb(dbKey) {
        return new Promise((res, rej) => {
            let transaction = idxDb.database.transaction("chunkPlaceholders", "readonly");

            let request = transaction.objectStore("chunkPlaceholders").get(dbKey);
    
            request.onsuccess = function () {
                const chunk = request.result;

                if(chunk === undefined) return res(null);
                return res(chunk);
            };
    
            request.onerror = function (event) {
                rej(request.error);
            };
    
            transaction.onabort = function () {
                rej(request.error);
            };
        })
    }

    _fromData(savedChunk){
        const canvas = document.createElement('canvas');

        canvas.width = savedChunk.width;
        canvas.height = savedChunk.height;

        const ctx = canvas.getContext('2d');
        
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        imageData.data.set(savedChunk.data);

        ctx.putImageData(imageData, 0, 0);

        return resizeCanvas(canvas, chunkSize, chunkSize);
    }

    async save(chunkCanvas){
        return new Promise((res, rej) => {
            const dbKey = `${canvasId}-${this.x}-${this.y}`;
            idxDb.addInitCallback(async () => {
                try {
                    await this._saveToDb(dbKey, chunkCanvas);

                    res();
                } catch (error) {
                    rej(error);
                }
            })
        })
    }

    async _saveToDb(dbKey, chunkCanvas){
        return new Promise((res, rej) => {
            // 50x50 is hardcoded size for all previews
            const resizedChunkCanvas = resizeCanvas(chunkCanvas, 50, 50);
            const resizedImgData = resizedChunkCanvas.getContext('2d').getImageData(0, 0, 50, 50);

            let transaction = idxDb.database.transaction("chunkPlaceholders", "readwrite");

            let request = transaction.objectStore("chunkPlaceholders").put({
                'chunk_key': dbKey,

                width: resizedImgData.width,
                height: resizedImgData.height,
                data: resizedImgData.data,
            });
    
            request.onsuccess = function () {
                res();
            };
    
            request.onerror = function (event) {
                rej(request.error);
            };
    
            transaction.onabort = function () {
                rej(request.error);
            };
        })
    }
}