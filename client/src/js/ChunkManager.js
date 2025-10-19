import globals from './globals';
import Chunk from './Chunk';
import {
    bgrPalette,
    argbToId,
    boardWidth, boardHeight, chunkSize, canvasId
} from './config';
import {
    boardToChunk
} from './utils/conversions'
import TempChunkPlaceholder from './TempChunkPlaceholder';
import { apiRequest } from './utils/api';
import { getLS, setLS } from './utils/localStorage';
import { isChunkVisible } from './utils/camera';

const CHUNK_LOADING_THREADS = 5;
const CHUNK_CACHE_NAME = 'chunks-cache-v1';
const cacheApiSupported = ('caches' in window);

export default class ChunkManager {
    constructor() {
        this.chunks = new Map();

        this.loadingChunks = new Set();

        this.checkQueue = [];
        this._checkInterval = null;
        this.checking = false;
        this.chunkHashes = null;

        // globals.socket.on('chunk', (cx, cy, cdata) => {
        //     let key = this.getChunkKey(cx, cy);
        //     if (this.loadingChunks.has(key)){
        //         this.loadingChunks.delete(key);
        //     }

        //     let chunk = new Chunk(cx, cy, cdata);
        //     this.chunks.set(key, chunk);

        //     globals.renderer.needRender = true;
        // })

        globals.socket.on('place', (x, y, col) => {
            this.setChunkPixel(x, y, col);

            globals.renderer.needRender = true;
        })

        globals.socket.on('protect', (x, y, state) => {
            this.setProtect(x, y, state);

            globals.renderer.needRender = true;
        });

        this.init();
    }

    init() {
        this.loadSavedChunkHashes();
        this.initCheckInterval();
    }

    loadSavedChunkHashes() {
        this.chunkHashes = JSON.parse(getLS(`chunkHashes`, true)) ?? {};
    }
    saveChunkHashes() {
        setLS(`chunkHashes`, JSON.stringify(this.chunkHashes), true);
    }

    initCheckInterval() {
        this._checkInterval = setInterval(async () => {
            if (!this.checkQueue.length || this.checking) return;
            this.checking = true;

            // console.log(this.checkQueue.size);

            try {
                // converting to array to remove checked chunks
                const asArr = this.checkQueue//[...this.checkQueue];
                await this.checkChunks(asArr.splice(0, 32).map(this.fromChunkKey));

                // this.checkQueue = new Set(asArr);
            } finally {
                this.checking = false;
            }
        }, 1);
    }

    async checkChunks(chunkList) {
        // some chunks may not have hash
        let chunksListFinal = [];
        let hashList = [];
        for (let [cx, cy] of chunkList) {
            if (!isChunkVisible(cx, cy)) continue;
            if (this.loadingChunks.has(this.getChunkKey(cx, cy))) continue;

            const hash = this.chunkHashes[`${cx},${cy}`];
            if (typeof hash === 'string' && hash.length >= 16) {
                // this is intentional: the array is flattened
                chunksListFinal.push(cx, cy);
                hashList.push(hash);
            } else {
                this.requestChunk(cx, cy);
            }
        }

        if (!hashList.length) return;

        const chunksFormatted = JSON.stringify(chunksListFinal);
        const hashesFormatted = JSON.stringify(hashList);

        const params = new URLSearchParams();
        params.set('canvas', canvasId);
        params.set('chunks', chunksFormatted);
        params.set('hashes', hashesFormatted);

        const resp = await apiRequest(`/chunks/check?${params.toString()}`);

        const respData = await resp.json();
        if (respData.errors) return;

        if (!Array.isArray(respData)) {
            throw new Error('Server returned unknown shit: ' + respData);
        }

        for (let i = 0; i < chunksListFinal.length; i += 2) {
            const [cx, cy] = [chunksListFinal[i], chunksListFinal[i + 1]];

            const isActual = respData[i / 2];
            if (isActual) {
                this.loadChunkFromCache(cx, cy);
            } else {
                delete this.chunkHashes[`${cx},${cy}`];
                this.saveChunkHashes();

                this.requestChunk(cx, cy);
            }
        }
    }

    clearChunks() {
        this.chunks.clear();
    }

    getChunkKey(x, y) {
        return x << 16 | y
    }

    fromChunkKey(key) {
        return [
            key >> 16,
            key & 0xFFFF
        ]
    }

    reloadChunks(chunksToReload) {
        if (!chunksToReload) {
            this.clearChunks();
        } else {
            for (const { x: cx, y: cy } of chunksToReload) {
                this.chunks.delete(this.getChunkKey(cx, cy));
            }
        }
    }

    async requestChunk(x, y) {
        let key = this.getChunkKey(x, y);

        if (!this.loadingChunks.has(key) &&
            this.loadingChunks.size < CHUNK_LOADING_THREADS) {

            this.loadingChunks.add(key);

            try {
                const resp = await apiRequest(`/chunks/get?canvas=${canvasId}&x=${x}&y=${y}`, {
                    credentials: 'omit'
                });

                const newHash = resp.headers.get('X-Compressed-Hash');
                if (newHash && cacheApiSupported) {
                    this.chunkHashes[`${x},${y}`] = newHash;
                    this.saveChunkHashes();

                    const cache = await caches.open(CHUNK_CACHE_NAME);
                    await cache.put(`${canvasId}-${x}-${y}`, resp.clone());
                }

                // use pako only if chunk got from socket
                // const cdataCompressed = await resp.arrayBuffer();
                // const cdata = Pako.inflate(cdataCompressed);

                await this.loadChunkFromResp(x, y, resp);
            } finally {
                if (this.loadingChunks.has(key)) {
                    this.loadingChunks.delete(key);
                }
            }
            // globals.socket.requestChunk(x, y);
        }
    }

    async loadChunkFromCache(x, y) {
        const chunkKey = this.getChunkKey(x, y);
        if (this.loadingChunks.has(chunkKey)) return;

        this.loadingChunks.add(chunkKey);

        try {
            const cache = await caches.open(CHUNK_CACHE_NAME);
            const resp = await cache.match(`${canvasId}-${x}-${y}`);
            if (!resp) {
                console.log('cache no match');
                delete this.chunkHashes[`${x},${y}`];
                this.saveChunkHashes();

                this.loadChunk(x, y);
                return;
            }

            await this.loadChunkFromResp(x, y, resp, true);

        } finally {
            this.loadingChunks.delete(chunkKey);
        }
    }

    async loadChunkFromResp(x, y, resp, cached = false) {
        const cdata = await resp.arrayBuffer();

        let chunk = new Chunk(x, y, new Uint8Array(cdata));
        this.chunks.set(this.getChunkKey(x, y), chunk);

        if (!cached) {
            chunk.render(); // workaround because TempChunkPlaceholder getting zeroes until chunk is rendered once
            new TempChunkPlaceholder(x, y).save(chunk.canvas);
        }

        globals.renderer.needRender = true;
    }

    loadChunk(x, y) {
        if (!cacheApiSupported) {
            // old method (threaded chunk queue)
            this.requestChunk(x, y);
            return;
        }

        // new method (bulk chunk check for updates)
        const chunkKey = this.getChunkKey(x, y);
        if (this.checkQueue.includes(chunkKey) || this.checking || this.loadingChunks.has(chunkKey)) {
            return;
        }

        this.checkQueue.push(this.getChunkKey(x, y));
    }

    clearLoadingChunks() {
        this.loadingChunks = new Set;
    }

    hasChunk(x, y) {
        let key = this.getChunkKey(x, y);

        return this.chunks.has(key);
    }

    getChunk(x, y) {
        let key = this.getChunkKey(x, y);

        if (!this.chunks.has(key)) {
            return 0
        }
        return this.chunks.get(key)
    }

    getChunkPixel(x, y) {
        let [cx, cy, offx, offy] = boardToChunk(x, y);
        let chunk = this.getChunk(cx, cy);

        if (!chunk || x < 0 || y < 0) return -1

        let argb = chunk.get(offx, offy);

        return argbToId[argb]
    }

    setChunkPixel(x, y, col) {
        let [cx, cy, offx, offy] = boardToChunk(x, y);

        let key = this.getChunkKey(cx, cy);
        if (this.chunks.has(key)) {
            this.chunks.get(key).set(offx, offy, bgrPalette[col])
        }
    }

    setProtect(x, y, state) {
        let [cx, cy, offx, offy] = boardToChunk(x, y);

        let key = this.getChunkKey(cx, cy);
        if (this.chunks.has(key)) {
            this.chunks.get(key).setProtect(offx, offy, state)
        }
    }

    getProtect(x, y) {
        let [cx, cy, offx, offy] = boardToChunk(x, y);
        let chunk = this.getChunk(cx, cy);
        if (!chunk) return -1

        return chunk.getProtect(offx, offy);
    }

    // for the screenshot function
    dumpAll() {
        const canvas = document.createElement('canvas');
        canvas.width = boardWidth;
        canvas.height = boardHeight;

        const ctx = canvas.getContext('2d');

        this.chunks.forEach(chunk => {
            if (!chunk.canvas) return;

            const offX = chunk.x * chunkSize,
                offY = chunk.y * chunkSize;

            ctx.drawImage(chunk.canvas, offX, offY)
        })
        return canvas
    }
}