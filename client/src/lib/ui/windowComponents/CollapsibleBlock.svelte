<script>
	import { slide } from 'svelte/transition';
	import Button from '../Button.svelte';
	import Row from './Row.svelte';

	import ltIcon from '$lib/assets/icons/icon_lt.svg?raw';

	const { blockName, children } = $props();

	const btnIconStyle = $derived(
        `transform: rotate(${isOpen ? '90' : '270'}deg);\n` + 
        'transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);'
    );

	let isOpen = $state(false);
</script>

<Row alignRight="right" padding=0>
	{#snippet left()}
		{blockName}
	{/snippet}
	{#snippet right()}
		<Button icon={ltIcon} onclick={() => (isOpen = !isOpen)} iconStyle={btnIconStyle}></Button>
	{/snippet}
</Row>

{#if isOpen}
	<div class="collapsiblePart" transition:slide={{ duration: 250 }}>
		{@render children()}
	</div>
{/if}

<style>
</style>
