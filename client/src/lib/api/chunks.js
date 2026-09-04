import { apiGet } from "./core";

// check whick chunks was changed from the last time
export async function checkChunks(canvasId, chunks, hashes) {
    const chunksFormatted = JSON.stringify(chunks.flat());
    const hashesFormatted = JSON.stringify(hashes);

    const params = new URLSearchParams();
    params.set('canvas', canvasId);
    params.set('chunks', chunksFormatted);
    params.set('hashes', hashesFormatted);

    const resp = await apiGet(`/chunks/check?${params.toString()}`);

    const respData = await resp.json();
    if (respData.errors) return null;

    if (!Array.isArray(respData) || respData.length !== chunks.length) {
        throw new Error('Unknown chunks format: ' + respData);
    }

    return respData;
}

export async function getChunk(canvasId, x, y) {
    const resp = await apiGet(`/chunks/get?canvas=${canvasId}&x=${x}&y=${y}`, {
        credentials: 'omit'
    });

    return resp;
}