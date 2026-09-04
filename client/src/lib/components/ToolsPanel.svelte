<script>
	import Button from '../ui/Button.svelte';
	import Panel from '../ui/Panel.svelte';
	import TiltShadow from '../ui/TiltShadow.svelte';

	const { toolManager } = $props();

	function select(tool) {
		toolManager?.selectTool(tool);
	}
</script>

<div class="toolsContainer">
	<TiltShadow sides={['top', 'bottom']} magnetSides={["left"]} radius="10px" distance="4px">
		<Panel magnetSides={["left"]} padding="9px 5px 5px 5px" radius="7px" shadowDistance="4px">
			<div class="toolsPanel">
				{#if toolManager}
					{#each Object.values(toolManager.tools) as tool}
						{#if tool.showOnPanel !== false}
							<Button icon={tool.icon} onclick={() => select(tool)} isActive={toolManager.currentTool === tool}></Button>
						{/if}
					{/each}
				{/if}
			</div>
		</Panel>
	</TiltShadow>
</div>

<style>
	.toolsContainer {
		position: absolute;
		top: 75px;
	}

	.toolsPanel {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
</style>
