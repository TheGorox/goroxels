import { api } from "../api";
import Chunk from "./Chunk.svelte";
import { confirmPixel, queuePixelRevert } from './pixelsQueue.svelte';
import { persistentPerCanvas } from "./stores/persistent.svelte";
import { getVisibleChunks, isChunkVisible, screenToBoardSpace } from "./utils/camera";

const LIMBO_INTERVAL_MS = 500;

const CHECK_LIMIT = 32;
const CHECK_DELAY = 1000;

const CHUNK_LOADING_THREADS = 5;

const CHUNK_CACHE_NAME = 'chunks-cache-v2';
const CACHE_SUPPORTED = 'caches' in window;


export function initChunkManager(core) {
    purgeOldCaches();

    const chunkSize = core.config.chunkSize;

    const chunks = new Map();

    // visible but not loaded chunks that are not in any of loading queues yet
    let limboQueue = [];
    let limboInterval;

    // chunks that are not loaded and not loading.
    // goroxels checking mechanism is batch checking:
    // did the chunks updated or not(by saving their caches)
    let isValidating = false;
    let checkRic = null;
    let lastCheck = 0;
    const chunkHashes = persistentPerCanvas('chunkHashes', {});

    let loadingQueue = new Set(); // chunks waiting for load
    let inFlight = new Set(); // currently loading chunks
    let loadingRic = null;
    let loadingCount = 0;

    // the whole chunk loading process looks like this:
    // see the chunk(limboQueue) -> check the chunk(checkQueue) -> load the chunk(loadingQueue)


    function startLimboInterval() {
        limboInterval = setInterval(() => {

            let chunkList = getVisibleChunks();
            chunkList = chunkList
                .reduce((acc, _, i, src) =>
                    // reshape flat chunk list into pairs of [cx, cy]
                    i % 2 === 0 ? [...acc, src.slice(i, i + 2)] : acc, []);

            // remove invisible chunks from loading queue
            const visibleChunkKeys = chunkList.map(coords => getChunkKey(...coords));

            for (const key of loadingQueue.keys()) {
                if (!visibleChunkKeys.includes(key)) {
                    loadingQueue.delete(key);
                }
            }

            // filter out already loaded ones
            chunkList = chunkList
                .filter(([cx, cy]) => {
                    const ck = getChunkKey(cx, cy);
                    if ([chunks, loadingQueue, inFlight].some(q => q.has(ck))) return false;
                    return true;
                });


            if (!chunkList.length) return;

            limboQueue = sortChunks(chunkList);

            pingCheckingInterval();
        }, LIMBO_INTERVAL_MS);
    }
    startLimboInterval();

    function pingCheckingInterval() {
        if (checkRic) return;
        checkRic = requestIdleCallback(checkChunks, { timeout: 500 });
    }
    async function checkChunks() {
        checkRic = null;

        if (isValidating) return;
        isValidating = true;

        try {
            if (!limboQueue.length || Date.now() - lastCheck < CHECK_DELAY) return;

            let validateQueueChunks = [];
            let validateQueueHashes = [];

            for (const [cx, cy] of limboQueue) {
                const key = getChunkKey(cx, cy);

                if (isChunkHashed(key)) {
                    // that one is ours and we have no choice
                    // but to process it immideately
                    validateQueueChunks.push([cx, cy]);
                    validateQueueChunks.push(chunkHashes[key]);
                } else {
                    // that one is managed by another loader
                    loadingQueue.add(key);
                    pingLoadingInterval();
                }
            }

            if (!validateQueueChunks.length) return;

            let toLoadFromCache = [];

            try {
                const result = await api.validateChunks(core.config.canvasId, validateQueueChunks, validateQueueHashes)
                for (let i = 0; i < validateQueueChunks.length; i++) {
                    const isHashValid = !!result[i];
                    const chunkKey = getChunkKey(...validateQueueChunks[i]);

                    if (isHashValid) {
                        toLoadFromCache.push(chunkKey);
                    } else {
                        validateQueue.add(chunkKey);
                    }
                }
            } catch (e) {
                console.error(e);
            }

            for (const [cx, cy] of toLoadFromCache) {
                try {
                    const isSuccess = await loadChunkFromCache(cx, cy);
                    if (!isSuccess) {
                        const key = getChunkKey(cx, cy);
                        loadingQueue.add(key);
                        pingLoadingInterval();
                    }
                } catch (error) {
                    console.error(`can not load chunk ${cx},${cy} from cache: ${error}`);
                }
            }
        } finally {
            limboQueue.length = 0;
            isValidating = false;
        }
    }

    function pingLoadingInterval() {
        if (loadingRic) return;
        loadingRic = requestAnimationFrame(loadChunks);
    }

    let _lastLoadSort = 0;
    async function loadChunks() {
        loadingRic = null;

        while (loadingQueue.size > 0 && loadingCount < CHUNK_LOADING_THREADS) {
            if (Date.now() - _lastLoadSort > 500) {
                _lastLoadSort = Date.now();
                loadingQueue = new Set(sortChunks([...loadingQueue].map(fromChunkKey)).map(([cx, cy]) => getChunkKey(cx, cy)));
            }

            loadingCount++;

            const chunkKey = loadingQueue.values().next().value;
            loadingQueue.delete(chunkKey);

            const [cx, cy] = fromChunkKey(chunkKey);
            if (!isChunkVisible(cx, cy) || inFlight.has(chunkKey)) {
                loadingCount--;
                continue;
            }

            inFlight.add(chunkKey);


            new Promise(async (res, rej) => {
                try {
                    const resp = await api.getChunk(core.config.canvasId, cx, cy);

                    const newHash = resp.headers.get('X-Compressed-Hash');
                    if (newHash && CACHE_SUPPORTED) {
                        // await saveChunkToCache(chunkKey, resp, newHash);
                    }

                    res([cx, cy, resp]);
                } catch (error) {
                    rej(error);
                }
            }).then(chunk => {
                loadChunkFromResp(...chunk);
            }).catch(e => {
                console.error(e);
            }).finally(() => {
                inFlight.delete(chunkKey);
                loadingCount--;
            });
        }

        if (loadingQueue.size > 0) {
            pingLoadingInterval();
        }
    }



    function distNoRoot(x1, y1, x2, y2) {
        return (x1 - x2) ** 2 + (y1 - y2) ** 2;
    }

    function sortChunks(chunkList) {
        let [centerX, centerY] = screenToBoardSpace(window.innerWidth / 2, window.innerHeight / 2);
        // instead of multiplying every chunk by chunk size
        // we can divide center by chunk size
        centerX /= core.config.chunkSize;
        centerY /= core.config.chunkSize;

        // sort them by distance from the center
        chunkList = chunkList.sort((chunkA, chunkB) => {
            return distNoRoot(centerX, centerY, ...chunkA) - distNoRoot(centerX, centerY, ...chunkB);
        });

        return chunkList;
    }

    function isChunkHashed(chunkKey) {
        return Object.hasOwn(chunkHashes.v, chunkKey);
    }

    function handleInputPixels(pixels, isProtect) {

    }

    function getChunkKey(x, y) {
        return x << 16 | y;
    }

    function fromChunkKey(key) {
        return [
            key >> 16,
            key & 0xFFFF
        ];
    }

    function reloadChunks(chunksToReload) {
        if (!chunksToReload) {
            chunks.clear();
        } else {
            for (const { x, y } of chunksToReload) {
                chunks.delete(getChunkKey(x, y));
            }
        }
    }

    function getChunk(x, y) {
        return chunks.get(getChunkKey(x, y)) ?? null;
    }

    function getChunkByPixelPos(x, y){
        const cx = Math.floor(x / chunkSize);
        const cy = Math.floor(y / chunkSize);

        return getChunk(cx, cy);
    }

    function purgeOldCaches() {
        if (!CACHE_SUPPORTED) return;

        const cachesToKeep = [CHUNK_CACHE_NAME];
        caches.keys().then((keyList) =>
            Promise.all(
                keyList.map((key) => {
                    if (!cachesToKeep.includes(key)) {
                        return caches.delete(key);
                    }
                    return undefined;
                }),
            )
        );
    }

    async function loadChunkFromCache(cx, cy) {
        const chunkKey = getChunkKey(cx, cy);

        const cache = await caches.open(CHUNK_CACHE_NAME);
        const resp = await cache.match(`${core.config.canvasId}-${chunkKey}`);
        if (!resp) {
            delete chunkHashes[chunkKey];

            return false;
        }

        await this.loadChunkFromResp(x, y, resp, true);
    }

    async function saveChunkToCache(chunkKey, resp, newHash) {
        const cache = await caches.open(CHUNK_CACHE_NAME);
        await cache.put(`${core.config.canvasId}-${chunkKey}`, resp.clone());

        chunkHashes[chunkKey] = newHash;
    }

    async function loadChunkFromResp(x, y, resp) {
        const cdata = await resp.arrayBuffer();

        const chunk = new Chunk(x, y);
        chunk.init(new Uint8Array(cdata));

        chunks.set(getChunkKey(x, y), chunk);

        core.renderer.requestRender();
    }

    function setPixels(pixelsArr, fromServer=false) {
        for (let i = 0; i < pixelsArr.length; i += 3) {
            const x = pixelsArr[i];
            const y = pixelsArr[i + 1];
            const colId = pixelsArr[i + 2];

            const cx = Math.floor(x / chunkSize);
            const cy = Math.floor(y / chunkSize);
            const offx = x % chunkSize;
            const offy = y % chunkSize;

            const chunk = getChunk(cx, cy);
            if(!chunk) continue;

            const oldCol = chunk.get(offx, offy);
            
            if(!fromServer)
                queuePixelRevert(x, y, oldCol);
            else
                confirmPixel(x, y);

            chunk.set(offx, offy, colId);
            chunk.requestRedraw(); // it's faster to call this function than to use Sets
        }
        core.renderer.requestRender();
    }

    function getPixel(x, y, raw=false, withProtection=false){
        const chunk = getChunkByPixelPos(x, y);
        const cOffX = x % chunkSize;
        const cOffY = y % chunkSize;

        let protectionState = null;
        if(withProtection){
            protectionState = chunk.getProtectedState(cOffX, cOffY);
            return [chunk.get(cOffX, cOffY, raw), protectionState];
        }

        return chunk.get(cOffX, cOffY, raw);
    }

    return {
        handleInputPixels,
        getChunk,
        setPixels,
        getPixel
    }
}
