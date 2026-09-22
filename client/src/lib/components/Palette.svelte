<script>
	let { bottom = 0, right = 0 } = $props();

	import switchColorIcon from '$lib/assets/icons/switchClr.svg?raw';
	import { onMount } from 'svelte';
	import { player } from '../game/player.svelte';
	import { useGameCore } from '../game/core.svelte';

	const core = useGameCore();

	const currentColors = $derived.by(() => {
		const allColors = core?.config?.colorsHex;
		if (!allColors) return null;

		const paletteSlice = core.config.palettes[player.palette] || [];
		if (!paletteSlice) return null;

		const left = paletteSlice[0] ?? 0;
		const right = paletteSlice[1] ?? allColors.length;

		console.log(allColors.slice(left, right), { paletteSlice }, player.palette);
		return allColors.slice(left, right);
	});
</script>

<div class="container" style:bottom="{bottom}px" style:right="{right}px">
	<div class="head">
		{@html switchColorIcon}
	</div>
	123: {player.nickname}
	<div class="paletteContainer">
		{#each currentColors as color}
			<div class="colorSwatch" style:background-color={color}></div>
		{/each}
	</div>
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
	}
</style>
