<script>
	import Panel from '../ui/Panel.svelte';
	import Window from '../ui/Window.svelte';

	import screenshotIcon from '$lib/assets/icons/icon_camera.svg?raw';
	import gridIcon from '$lib/assets/icons/icon_grid.svg?raw';

	import { useGameCore } from '../game/core.svelte';
	import { clamp } from '../game/utils/math';
	import Screenshot from './windows/Screenshot.svelte';
	import IconButton from '../ui/IconButton.svelte';

	const core = useGameCore();

	let isScreenshotOpen = $state(false);
	let isGridEnabled = $state(false);

	function formatX(x) {
		return clamp(Math.floor(x), 0, core.config?.boardWidth).toString().padStart(4, '0');
	}
	function formatY(y) {
		return clamp(Math.floor(y), 0, core.config?.boardHeight).toString().padStart(4, '0');
	}
</script>

<div class="utilityMenu">
	<Panel magnetSides={['right']} padding="6px">
		{#snippet footer()}
			<div class="buttons">
				<IconButton
					active={isScreenshotOpen}
					onclick={() => (isScreenshotOpen = true)}
					icon={screenshotIcon}
				/>
				<div class="vr"></div>

				<IconButton
					active={core.toolManager?.tools.grid.isActive}
					onclick={() => core.toolManager?.tools.grid.onUp()}
					icon={gridIcon}
				/>
				<div class="vr"></div>

				X: {formatX(core.camera?.pivotWorldX)}
				<div class="vr"></div>
				Y: {formatY(core.camera?.pivotWorldY)}
			</div>
		{/snippet}
	</Panel>
</div>

{#if isScreenshotOpen}
	<Screenshot bind:isOpen={isScreenshotOpen}></Screenshot>
{/if}

<style>
	.utilityMenu {
		position: absolute;
		bottom: 10px;
		right: 0;
	}

	.buttons {
		display: flex;
		gap: 5px;

		color: var(--accent);
	}

	.buttons > :global(.icon-btn svg) {
		fill: currentColor;
	}

	.buttons > :global(.icon-btn.active svg) {
		color: var(--bg-dark);
		filter: none;
	}
</style>
