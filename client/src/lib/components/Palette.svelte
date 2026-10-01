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

		return allColors.slice(left, right);
	});

	const firstColorHex = $derived(core?.config.colorsHex?.[player.primaryCol]);
	const secondColorHex = $derived(core?.config.colorsHex?.[player.seconaryCol] || firstColorHex);
	$inspect(firstColorHex);

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
		{#each currentColors as color, index}
			<div
				class="colorSwatch"
				style:background-color={color}
                class:primaryColor={player.primaryCol === index}
                class:seconaryColor={player.seconaryCol === index}
				onclick={(e) => colorClicked(e, index)}
				oncontextmenu={(e) => colorContextmenu(e, index)}
			></div>
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
        clip-path: polygon(100% 0, 0 0, 0 100%)
    }

    .colorSwatch.seconaryColor:not(.colorSwatch.primaryColor)::after {
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

</style>
