<script>
	import TiltShadow from './TiltShadow.svelte';

	let {
		magnetSides = [],
		padding = '20px',
		innerPadding = '4px',
		innerBodyPadding = '4px',
		radius = '20px',
		width = 'auto',
		height = 'auto',
		maxHeight = 'auto',
		shadowDistance,
		header,
		footer,
		children,
		noBody = false,
		panelBodyRef = $bindable()
	} = $props();

	const isTopMagnet = $derived(magnetSides.includes('top'));
	const isRightMagnet = $derived(magnetSides.includes('right'));
	const isBottomMagnet = $derived(magnetSides.includes('bottom'));
	const isLeftMagnet = $derived(magnetSides.includes('left'));

	const needScroll = $derived(maxHeight !== 'auto' || height !== 'auto');
</script>

<div
	class="panelContainer"
	style:--topleft-radius={isLeftMagnet || isTopMagnet ? 0 : radius}
	style:--topright-radius={isRightMagnet || isTopMagnet ? 0 : radius}
	style:--bottomleft-radius={isLeftMagnet || isBottomMagnet ? 0 : radius}
	style:--bottomright-radius={isRightMagnet || isBottomMagnet ? 0 : radius}
	style:--panel-padding={padding}
	style:--inner-padding={innerPadding}
	style:--inner-body-padding={innerBodyPadding}
	style:--width={width}
	style:--height={height}
	style:--max-height={maxHeight}
	style:--shadow-distance={shadowDistance}
	style:--scroll={needScroll ? 'auto' : 'unset'}
>
	{#if header}
		<div class="header">
			{@render header()}
		</div>
	{/if}
	{#if children && !noBody}
		<TiltShadow
			sides={['top']}
			topColor="var(--bg-mid-dark)"
			radius="5px"
			distance={shadowDistance}
			style="width: 100%"
		>
			<div class="scrollbarParent">
				<div class="panelBody" bind:this={panelBodyRef}>
					<div>
						{@render children()}
					</div>
				</div>
			</div>
		</TiltShadow>
	{/if}
	{#if footer}
		<div class="footer">
			{@render footer()}
		</div>
	{/if}
</div>

<style>
	.panelContainer {
		/* display: flex;
		flex-direction: ; */

		padding: var(--panel-padding);
		background-color: var(--bg-mid);
		border-radius: var(--topleft-radius) var(--topright-radius) var(--bottomright-radius)
			var(--bottomleft-radius);

		display: flex;
		flex-direction: column;
		gap: var(--panel-padding);
		position: relative;
	}

	.panelBody {
		font-family: inherit;
		font-size: var(--text-base);
		color: var(--accent);

		color: var(--text);

		width: var(--width);
		height: var(--height);

		max-height: var(--max-height);

		padding: var(--inner-body-padding);
	}

	.scrollbarParent {
		background: var(--bg-dark);
		border: none;
		border-radius: 5px;
		position: relative;
		padding: var(--inner-padding);
	}

	.panelBody div {
		position: relative;
		z-index: 1;
	}

	.panelBody :global(hr) {
		height: 1px;
		background-color: var(--bg-mid);
		border: none;
	}
	.panelContainer :global(.vr) {
		width: 1px;
		background-color: var(--bg-light);
		border: none;
	}

	.panelBody :global(.panelRow) {
		display: flex;
		gap: 10px;
	}

	.header {
		padding: 0;
		margin-bottom: var(--shadow-distance);
	}
	.header :global(.title) {
		color: var(--accent);
		font-size: 1.6em;
		user-select: none;
	}

	/* SCROLLBAR ZONE */

	.panelBody {
		overflow-y: var(--scroll);
	}

	.panelContainer :global(::-webkit-scrollbar) {
		width: 8px;
	}

	.panelContainer :global(::-webkit-scrollbar-button) {
		display: none;
		height: 0;
	}

	.panelContainer :global(::-webkit-scrollbar-track) {
		background: var(--bg-light);
		border-radius: 50px;
		margin: 10px 20px;
	}

	.panelContainer :global(::-webkit-scrollbar-thumb) {
		background: var(--bg-mid);
		border-radius: 50px;
		border: 1px solid transparent;
		background-clip: content-box;
	}
</style>
