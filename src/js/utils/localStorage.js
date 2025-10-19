import { canvasName } from "../config";

export function getOrDefault(key, defaultVal, isLocal=false){
    if(isLocal){
        if(canvasName === undefined){
            console.warn('getLS is used before the config loaded');
        }
        key = canvasName + '.' + key
    }
    return localStorage.getItem(key) ?? defaultVal
}

export function getLS(key, isLocal=false){
    if(isLocal){
        if(canvasName === undefined){
            console.warn('getLS is used before the config loaded');
        }
        key = canvasName + '.' + key
    }
    return localStorage.getItem(key);
}

export function setLS(key, value, isLocal=false){
    if(isLocal){
        key = canvasName + '.' + key
    }
    return localStorage.setItem(key, value)
}

export function removeOldKeybinds() {
    try {
        const str = getLS('keyBinds');
        const json = JSON.parse(str);
        for (let bind of Object.values(json)) {
            let key = bind.split('+').slice(-1);
            key = +key;
            if (!isNaN(key)) {
                localStorage.removeItem('keyBinds');
                return
            }
        }
    } catch { }
}