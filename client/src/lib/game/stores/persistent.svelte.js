import { useGameCore } from "../core.svelte";

export function persistent(key, initial,debounceMs = 600) {
    console.log(key, JSON.parse(localStorage.getItem(key) ?? 'null') ?? initial, `localStorage.getItem('${key}')=`,localStorage.getItem(key) , initial);
    
    let value = $state(
        JSON.parse(localStorage.getItem(key) ?? 'null') ?? initial
    );

    let timer;

    // TODO when routes, clean up the effect !!!
    let cleanup = $effect.root(() => {
        $effect(() => {
            value;
    
            clearTimeout(timer);
            timer = setTimeout(() => {
                console.log('save')
                localStorage.setItem(key, JSON.stringify(value));
            }, debounceMs);
        });
    })

    return {
        get v() { return value; },
        set v(newVal) { value = newVal; }
    };
}

export function persistentPerCanvas(key, initial, debounceMs = 600) {
	const core = useGameCore();
    if(!core.config?.canvasName) throw new Error('trying to make persistent store without config loaded');
	const storageKey = `${core.config.canvasName}-${key}`;

	return persistent(storageKey, initial, debounceMs);
}