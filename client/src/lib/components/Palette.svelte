<script>
	let { bottom = 0, right = 0 } = $props();

    import switchColorIcon from '$lib/assets/icons/switchClr.svg?raw';
	import { player } from '../game/player.svelte';
</script>

<div class="container" style:bottom="{bottom}px" style:right="{right}px">
    <div class="head">
        {@html switchColorIcon}
    </div>
    <div class="paletteContainer">
        {#each player.palette as color}
            
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
        background-color: var(--bg-mid);
        border-radius: 10px 10px 0 0;
        padding: 5px;
    }

    .paletteContainer {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
    }

    .color-card {
        width: 100px;
        aspect-ratio: 1 / 1;
        border: 2px solid black;
    }
</style>
