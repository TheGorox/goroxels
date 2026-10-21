<script>
	let { bottom = 0, right = 0 } = $props();

	import switchColorIcon from '$lib/assets/icons/switchClr.svg?raw';
	import { onMount } from 'svelte';
	import { player } from '../game/player.svelte';
	import { useGameCore } from '../game/core.svelte';

	const core = useGameCore();

	const currentPaletteSlice = $derived(core?.config?.palettes[player.palette] || []);
	$inspect(currentPaletteSlice);

	const currentColors = $derived.by(() => {
		const allColors = core?.config?.colorsHex;
		if (!allColors) return null;

		console.log({ currentPaletteSlice });

		if (!currentPaletteSlice) return null;

		const leftIdx = currentPaletteSlice[0] ?? 0;
		const rightIdx = currentPaletteSlice[1] ?? allColors.length;

		return allColors.slice(leftIdx, rightIdx).map((color, i) => ({
			colorId: leftIdx + i,
            color
		}));
	});
    $inspect(currentColors)

	const getColor1Hex = () => core?.config.colorsHex?.[player.primaryCol];
	const getColor2Hex = () => core?.config.colorsHex?.[player.seconaryCol];

	const firstColorHex = $derived(getColor1Hex() ?? getColor2Hex());
	const secondColorHex = $derived(getColor2Hex() ?? getColor1Hex());

	function colorClicked(e, id) {
		const isLeftClick = e.button === 0;
		const isRightClick = e.button === 2;
		const isMMBClick = e.button === 1;
		if (isLeftClick) {
			player.setPrimaryColor(id);
		} else if (isRightClick) {
			player.setSeconaryColor(id);
		} else if (isMMBClick) {
			// TODO for color selector
		}
	}

	function colorContextmenu(e, id) {
		e.stopPropagation();
		e.preventDefault();

		player.setSeconaryColor(id);
	}
</script>

<div class="container" style:bottom="{bottom}px" style:right="{right}px">
	<div class="head">
		{@html switchColorIcon}
	</div>
	<div class="colorsDisplayContainer">
		<div style:background-color={firstColorHex}></div>
		<div style:background-color={secondColorHex}></div>
	</div>
	<div class="paletteContainer">
		{#each currentColors as {color, colorId}, index}
			<div
				class="colorSwatch"
				style:background-color={color}
				class:primaryColor={player.primaryCol === colorId}
				class:seconaryColor={player.seconaryCol === colorId}
				onclick={(e) => colorClicked(e, colorId)}
				oncontextmenu={(e) => colorContextmenu(e, colorId)}
			></div>
		{/each}
	</div>
	{#each Object.keys(core.config?.palettes) as paletteName, i}
		{@const selected = paletteName === player.palette}

		<div
			class="paletteBadge"
			style:top={`${45 + i * (30 + 5)}px`}
			style:width={selected ? '' : '20px'}
			onclick={() => (player.palette = paletteName)}
		>
			<div>
				{selected ? paletteName : i + 1}
			</div>
		</div>
	{/each}
</div>

<style>
	.container {
		position: fixed;
		display: flex;
		flex-direction: column;
	}

	.head {
		display: flex;
		justify-content: center;

		background-color: var(--bg-mid);
		border-radius: 10px 10px 0 0;
		padding: 5px;
	}

	.head :global(svg) {
		width: 76px;
		flex-shrink: 0;
		display: block;
		color: var(--bg-light);
	}

	.paletteContainer {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		border-top: 2px solid black;
		border-left: 2px solid black;
	}

	.colorSwatch {
		width: 34px;
		height: 34px;
		box-sizing: border-box;
		border-right: 2px solid black;
		border-bottom: 2px solid black;
		position: relative;
	}

	.colorSwatch.primaryColor::after {
		content: '';
		position: absolute;
		width: 16px;
		height: 16px;
		background: #000;
		top: 0;
		left: 0;
		clip-path: polygon(100% 0, 0 0, 0 100%);
	}

	.colorSwatch.seconaryColor::before {
		content: '';
		position: absolute;
		width: 16px;
		height: 16px;
		background: #000;
		right: 0;
		bottom: 0;
		clip-path: polygon(100% 0, 100% 100%, 0 100%);
	}

	.colorsDisplayContainer {
		display: flex;
		height: 11px;

		border-right: 2px solid black;
		border-top: 2px solid black;
		border-left: 2px solid black;
	}

	.colorsDisplayContainer > div {
		flex: 1;
	}
	.colorsDisplayContainer > div:first-child {
		flex: 1;
		border-right: 2px solid black;
	}

	.paletteBadge {
		position: absolute;
		left: 0;
		top: 0;
		width: 100px;
		height: 30px;
		background: var(--bg-mid);
		color: var(--accent);

		transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);

		padding: 2px;

		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;

		transform: translateX(-100%);

		cursor: pointer;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.paletteBadge > div {
		width: auto;
		text-align: center;
		text-overflow: clip;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
