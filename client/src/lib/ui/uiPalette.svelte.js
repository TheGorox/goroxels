import { persistent } from '$lib/game/stores/persistent.svelte.js';

export const PRESETS = {
	dark: {
		colors: {
			'--bg-verydark': '#142C3E',
			'--bg-mid-dark': '#18364B',
			'--bg-dark': '#1b3c53',
			'--bg-mid': '#234c6a',
			'--bg-light': '#456882',
			'--accent': '#d2c1b6',
			'--text': '#ffffff',
		}
	}	
};

const currentPaletteName = persistent('rootPaletteName', 'dark');

export function getRootPalette(){
	const name = currentPaletteName.v;
	return PRESETS[name] || PRESETS.dark;
}

export function switchPalette(name) {
	if (PRESETS[name]) {
		currentPaletteName.v = name;
		applyPaletteToDOM(PRESETS[name].colors);
	}
}

export function saveCustomPalette(name, colors) {
	PRESETS[name] = { name, colors };
	currentPaletteName.v = name;
	applyPaletteToDOM(colors);
}

function applyPaletteToDOM(colors) {
	const root = document.documentElement;
	Object.entries(colors).forEach(([varName, value]) => {
		root.style.setProperty(varName, value);
	});
}

export function initRootPalette() {
	const saved = currentPaletteName.v;
	applyPaletteToDOM((PRESETS[saved] || PRESETS.dark).colors);
}