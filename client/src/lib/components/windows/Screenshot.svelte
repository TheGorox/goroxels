<script>
	import { onDestroy } from 'svelte';
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

	const tool = core.toolManager.tools['screenshot'];

	const boundsAlias = ['startX', 'startY', 'endX', 'endY'];

	core.toolManager.selectTool(tool);

	onDestroy(() => {
		tool.onDeselected();
		if (core.toolManager.currentTool === tool) {
			core.toolManager.selectTool(defaultTool);
		}
	});

	function onSelectClick() {
		tool.startSelection();
	}

	function handleTakeScreenshot() {
		tool.doScreenshot();
	}

	const pref = 'w.screenshot';
</script>

<Window title={t(`${pref}.title`)} id="screenshot" bind:isOpen {...rprops}>
	<div class="panelRow">
		{#each tool.bounds as coordinate, i}
			<Legendary legend={t(`${pref}.${boundsAlias[i]}`)}>
				<Input 
					type="number" 
					draggable={true} 
					bind:bindValue={tool.bounds[i]} 
				/>
			</Legendary>
		{/each}
	</div>
	<hr>
	<div class="panelRow" style="justify-content: space-between;">
		<div class="panelRow">
			<Button icon={screenshotIcon} isActive={tool.isSelecting} onclick={onSelectClick}></Button>
			<Button onclick={() => tool.expandBoundsFullCanvas()}>{t(`${pref}.wholeCanvas`)}</Button>
			<Button onclick={() => tool.expandBoundsFullScreen()}>{t(`${pref}.visibleArea`)}</Button>
		</div>
		<div class="panelRow">
			<Button 
				onclick={handleTakeScreenshot}
				disabled={tool.bounds[0] === -1 || tool.isSelecting}
			>
				{t(`${pref}.doScreenshot`)}
			</Button>
		</div>
	</div>
</Window>