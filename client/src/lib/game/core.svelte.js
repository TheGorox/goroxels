import { getContext } from 'svelte';
import { isMobile } from './utils/system';


const core = $state({
	isMobile: isMobile(),
	persistent: null,

	config: null,
	gameConfig: null,
	player: null,
	me: null,
	ui: null,
	online: null,
	tools: null,

	// todo: make separate webcache store
	stickersCache: null,

	mainCanvas: null,
	fxCanvas: null,

	renderer: null,
	chunkManager: null,
	fx: null,
	camera: null,
	socket: null,
	input: null,

	brush: {
		imData: null,
		offsetX: 0,
		offsetY: 0,
		shape: null,
		renderMode: 0, // 0 - alpha, 1 - color
		changed: false
	}
});

export { core }

export function useGameCore() {
	return core;
}