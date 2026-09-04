<script>
	import Panel from './Panel.svelte';

	let {
		tabs,
		active = $bindable(tabs?.[0]?.id ?? null),
		gap = '6px',
		panelProps = {},
		...content
	} = $props();

	let activeIndex = $derived(tabs?.findIndex(tab => tab.id === active) ?? 0);

	let resolvedPanelProps = $derived.by(() => {
		if (Array.isArray(panelProps)) {
			return panelProps[activeIndex] ?? {};
		}
		return panelProps ?? {};
	});
</script>

<div class="tabsBar" style:gap={gap}>
	{#each tabs as tab (tab.id)}
		<div
			class="tabBtn {active === tab.id ? 'active' : ''}"
			role="button"
			tabindex="0"
			onclick={() => (active = tab.id)}
			onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (active = tab.id)}
		>
			{tab.label}
		</div>
	{/each}
</div>

<Panel {...resolvedPanelProps}>
	{@render content[active]?.()}
</Panel>

<style>
	.tabsBar {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 10px;
	}
	.tabBtn {
		background: var(--bg-light);
		color: var(--accent);
		border-radius: 5px;
		padding: 7px 12px;
		font-size: var(--text-x05);
		text-transform: uppercase;
		cursor: pointer;
		user-select: none;
	}
	.tabBtn.active {
		background: var(--bg-verydark);
		color: var(--bg-light);
	}
</style>