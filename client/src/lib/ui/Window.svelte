<script module>
	const activeIds = new Set();
</script>

<script>
	import { onDestroy, onMount, tick } from 'svelte';
	import Panel from './Panel.svelte';

	import closeIcon from '$lib/assets/icons/icon_close.svg?raw';

	let {
		id,
		title = 'Window',
		resizable = false,
		isOpen = $bindable(true),
		onClose = () => {},
		noPanelBody = false,
		maxHeight = '80vh',
		children
	} = $props();

	let container = $state();
	let x = $state(0);
	let y = $state(0);
	let isDragging = $state(false);

	if (activeIds.has(id)) {
		isOpen = false;
		onClose();
	} else {
		activeIds.add(id);
		onDestroy(() => {
			activeIds.delete(id);
		});
	}

	async function centerWindow() {
		if (!container) return;
		await tick();
		const rect = container.getBoundingClientRect();
		x = (window.innerWidth - rect.width) / 2;
		y = (window.innerHeight - rect.height) / 2;
	}

	function handleMouseDown(e) {
		if (e.button !== 0) return;
		isDragging = true;

		const startX = e.clientX - x;
		const startY = e.clientY - y;

		function onMouseMove(e) {
			if (!isDragging) return;
			x = e.clientX - startX;
			y = e.clientY - startY;
		}

		function onMouseUp() {
			isDragging = false;
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		}

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
	}

	function close() {
		isOpen = false;
		onClose();
	}

	onMount(() => {
		if (isOpen) centerWindow();
	});

	let lastSelectionRemove = 0;
	$effect(() => {
		x;
		y;

		if (Date.now() - lastSelectionRemove < 500) return;

		lastSelectionRemove = Date.now();
		window.getSelection().removeAllRanges();
	});
</script>

{#if isOpen}
	<div
		bind:this={container}
		class="windowWrapper"
		class:resizable
		style:left="{x}px"
		style:top="{y}px"
		style:max-height={maxHeight}
	>
		<Panel noBody={noPanelBody} {maxHeight}>
			{#snippet header()}
				<div class="windowHeader" onmousedown={handleMouseDown} role="presentation">
					<span class="title">{title}</span>
					<button
						class="close-btn"
						onclick={close}
						aria-label="Close"
						onmousedown={(e) => e.stopPropagation()}
					>
						{@html closeIcon}
					</button>
				</div>
				{#if noPanelBody}
					{@render children?.()}
				{/if}
			{/snippet}

			{#if noPanelBody === false}
				{@render children?.()}
			{/if}
		</Panel>
	</div>
{/if}

<style>
	.windowWrapper {
		position: fixed;
		z-index: 1000;
		display: flex;
		flex-direction: column;
		white-space: nowrap;
	}

	.windowWrapper.resizable {
		resize: both;
		overflow: hidden;
		min-width: 200px;
		min-height: 100px;
	}

	.windowHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: move;
		user-select: none;
		width: 100%;
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--accent, #fff);
		cursor: pointer;
		margin-left: 10px;
	}

	.close-btn:hover {
		color: #ff4444;
	}

	:global(.windowWrapper .panelContainer) {
		height: 100%;
		width: 100%;
	}

	.title {
		text-transform: uppercase;
	}
</style>