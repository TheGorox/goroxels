import { getJson } from "../game/utils/api";
import { apiGet, apiPost } from "./core";


export async function getStickerpacks() {
    const resp = await apiGet('/stickers/list');

    return await getJson(resp);
}

export async function addStickerpack(name, iconFile) {
    const resp = await apiPost('/stickers/pack/add', {
        title: name,
        icon: iconFile
    }, {
        isForm: true
    });

    return await getJson(resp);
}

export async function addSticker(name, file, packId) {
    const resp = await apiPost('/stickers/add', {
        code: name,
        file: file,
        packId: packId
    }, {
        isForm: true
    });

    return await getJson(resp);
}