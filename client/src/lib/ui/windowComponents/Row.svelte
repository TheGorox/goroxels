<script>
	let { alignLeft = 'left', alignRight = 'left', left, right, padding=3, children } = $props();

	let isRightPinned = $derived(alignRight === 'right');
	let isLeftPinned = $derived(alignLeft === 'left');

	// Вспомогательная функция для маппинга пропсов выравнивания в flex-значения
	function getFlexAlign(align) {
		if (align === 'right') return 'flex-end';
		if (align === 'center') return 'center';
		return 'flex-start'; // для 'left' или любого другого значения
	}
</script>

<div class="row" style:--padding={padding + 'px'}>
	{#if left}
		<div
			class="slot-wrapper left"
			class:allow-shrink={isLeftPinned}
			style:--align={getFlexAlign(alignLeft)}
		>
			{@render left()}
		</div>
	{/if}

	{#if right}
		<div
			class="slot-wrapper right"
			class:allow-shrink={isRightPinned}
			style:--align={getFlexAlign(alignRight)}
		>
			{@render right()}
		</div>
	{/if}

	{#if !left && !right && children}
		{@render children()}
	{/if}
</div>

<style>
	.row {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		box-sizing: border-box;

		padding: 3px 0;
	}

	.slot-wrapper :global(.inputContainer),
	.slot-wrapper :global(input) {
		width: 100%;
	}

	.slot-wrapper {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: var(--align);
		gap: 10px;

		flex: 1 0 50%;
		min-width: 0;

		padding: var(--padding);
	}

	/* Если под-контейнер всего один — забирает 100% */
	.slot-wrapper:only-child {
		flex: 1 1 100%;
	}

	.slot-wrapper.allow-shrink {
		flex-shrink: 1;
	}
</style>