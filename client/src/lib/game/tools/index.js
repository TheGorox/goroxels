import grid from './grid.svelte.js';
import mover from './mover.svelte.js';
import { screenshot } from './screenshot.svelte.js';
import brush from './brush.svelte.js';

export const tools = {
	mover,
	grid,
	screenshot,
	brush
};

export const defaultTool = mover;