<script>
	import Panel from './Panel.svelte';
	import TiltShadow from './TiltShadow.svelte';

	let {
		side = 'left',
		magnetSides = ['left'],
		containerWidth,
		containerHeight,
		label,
		children,
		panelProps = {},
		renderInBody = false,
		drawerState = $bindable('closed')
	} = $props();


	function onTabClick(){
		drawerState = drawerState === 'closed' ? 'open' : 'closed';
		console.log(drawerState)
	}
	const stateClass = $derived(drawerState === 'closed' ? 'closed' : '');
	
	const isBottom = $derived(side === 'bottom');
	const isLeft = $derived(side === 'left');

	const dynamicSideClass = $derived(isBottom ? 'bottom' : 'left');
	const shadowsPanel = $derived(isBottom ? ['bottom', 'top'] : ['left', 'top']);
	const shadowsTab = $derived(isBottom ? ['bottom', 'top'] : ['left', 'top']);

	

	const childrenProps = $derived({
		footer: renderInBody ? undefined : children, 
		children: renderInBody ? children : undefined
	});

	let drawerWidth = $state(0);
	let drawerHeight = $state(0);
</script>

<div
	class="drawer {dynamicSideClass} {stateClass}"
	style:--observed-width="{containerWidth}px"
	style:--observed-height="{containerHeight}px"
	bind:clientWidth={drawerWidth}
	bind:clientHeight={drawerHeight}
	style:--my-width="{drawerWidth}px"
	style:--my-height="{drawerHeight}px"
>
	<TiltShadow sides={shadowsPanel} {magnetSides} radius="10px" distance="4px">
		<Panel {magnetSides} radius="10px" padding="10px" {...childrenProps} {...panelProps}>
		</Panel>
	</TiltShadow>
	
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="drawerTabContainer {dynamicSideClass}" style="" onclick={onTabClick}>
		<TiltShadow sides={[dynamicSideClass]} magnetSides={[dynamicSideClass]} radius="10px" distance="4px">
			<Panel magnetSides={[dynamicSideClass]} radius="10px" padding="5px">
				{#snippet footer()}
					{@render label()}
				{/snippet}
			</Panel>
		</TiltShadow>
	</div>
</div>

<style>
	.drawer {
		position: absolute;
		color: var(--accent);
	}

	.drawer.left {
		transition: left 0.6s cubic-bezier(0.23, 1, 0.32, 1);

		left: calc(var(--observed-width) + 4px);
		top: calc(var(--observed-height) * -1 + 20px);
	}

	.drawer.left.closed {
		left: calc(var(--observed-width) - var(--my-width));
	}

	.drawer.bottom {
		transition: bottom 0.6s cubic-bezier(0.23, 1, 0.32, 1);

		left: 0;
		bottom: calc(var(--observed-height) + 8px);
	}
	
	.drawer.bottom.closed {
		bottom: calc(var(--observed-height) - var(--my-height));
	}

	.drawerTabContainer {
		position: absolute;
		font-size: var(--text-sm);
	}

	.drawerTabContainer.left {
		left: calc(100% + 4px);
		top: 10px;
	}

	.drawerTabContainer.bottom {
		bottom: calc(100% + 8px);
		left: 10px;
	}
</style>
