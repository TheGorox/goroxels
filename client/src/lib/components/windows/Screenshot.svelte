<script>
	import { onDestroy, onMount } from 'svelte';
	import { t } from '../../i18n/translate.svelte';
	import { useGameCore } from '../../game/core.svelte';
	import Button from '../../ui/Button.svelte';
	import Input from '../../ui/Input.svelte';
	import Legendary from '../../ui/Legendary.svelte';
	import Window from '../../ui/Window.svelte';

	import screenshotIcon from '$lib/assets/icons/icon_settings.svg?raw';
	import { defaultTool } from '../../game/tools';
	
	let { isOpen = $bindable(true), ...rprops } = $props();

	const core = useGameCore();

	
	const screenshotTool = core.toolManager.tools['screenshot'];

	const boundsAlias = ['startX', 'startY', 'endX', 'endY'];

	core.toolManager.selectTool(screenshotTool);

	onDestroy(() => {
		screenshotTool.onDeselected();
		if (core.toolManager.currentTool === screenshotTool) {
			core.toolManager.selectTool(defaultTool);
		}
	});

	function onSelectClick() {
		screenshotTool.startSelection();
	}

	function handleTakeScreenshot() {
		screenshotTool.doScreenshot();
	}

	const pref = 'w.screenshot';

	onMount(() => {
		return () => {

		}
	})
</script>

<Window title={t(`${pref}.title`)} id="screenshot" bind:isOpen {...rprops}>
	<div class="panelRow">
		{#each screenshotTool.bounds as coordinate, i}
			<Legendary legend={t(`${pref}.${boundsAlias[i]}`)}>
				<Input 
					type="number" 
					draggable={true} 
					bind:bindValue={screenshotTool.bounds[i]} 
				/>
			</Legendary>
		{/each}
	</div>
	<hr>
	<div class="panelRow" style="justify-content: space-between;">
		<div class="panelRow">
			<Button icon={screenshotIcon} isActive={screenshotTool.isSelecting} onclick={onSelectClick}></Button>
			<Button onclick={() => screenshotTool.expandBoundsFullCanvas()}>{t(`${pref}.wholeCanvas`)}</Button>
			<Button onclick={() => screenshotTool.expandBoundsFullScreen()}>{t(`${pref}.visibleArea`)}</Button>
		</div>
		<div class="panelRow">
			<Button 
				onclick={handleTakeScreenshot}
				disabled={screenshotTool.bounds[0] === -1 || screenshotTool.isSelecting}
			>
				{t(`${pref}.doScreenshot`)}
			</Button>
		</div>
	</div>
</Window>