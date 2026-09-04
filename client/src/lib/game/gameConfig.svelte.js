import { persistent } from './stores/persistent.svelte';

let initialized = false;

let chatLimitStore;

export const config = $state({
    get chatLimit() {
        return chatLimitStore?.v ?? 100;
    }
});

export function initGameConfig() {
    if (initialized) return;
    initialized = true;

    chatLimitStore = persistent('chatLimit', 100);
    
    return config;
}