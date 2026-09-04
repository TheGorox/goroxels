<script lang="ts">
	import { onMount } from 'svelte';

	type Option = string | {
		value: string;
		label: string;
	};

	let {
		options = [],
		value = $bindable(''),
		placeholder = 'ВЫБЕРИТЕ ОПЦИЮ'
	}: {
		options?: Option[];
		value?: string;
		placeholder?: string;
	} = $props();

	let open = $state(false);
	let root: HTMLDivElement;
	let focusedIndex = $state(-1);

	const normalizedOptions = $derived(
		options.map((option) =>
			typeof option === 'string'
				? { value: option, label: option }
				: option
		)
	);

	const selectedLabel = $derived(
		normalizedOptions.find((option) => option.value === value)?.label ?? placeholder
	);

	function select(option: { value: string; label: string }) {
		value = option.value;
		open = false;
		focusedIndex = -1;
	}

	function toggle() {
		open = !open;

		if (open) {
			focusedIndex = normalizedOptions.findIndex(
				(option) => option.value === value
			);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();

			if (!open) {
				toggle();
			} else if (focusedIndex >= 0) {
				select(normalizedOptions[focusedIndex]);
			}
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();

			if (!open) {
				open = true;
				focusedIndex = 0;
			} else {
				focusedIndex = Math.min(
					focusedIndex + 1,
					normalizedOptions.length - 1
				);
			}
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();

			if (open) {
				focusedIndex = Math.max(focusedIndex - 1, 0);
			}
		}

		if (event.key === 'Escape') {
			open = false;
			focusedIndex = -1;
		}
	}

	function handleDocumentClick(event: MouseEvent) {
		if (root && !root.contains(event.target as Node)) {
			open = false;
			focusedIndex = -1;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleDocumentClick);

		return () => {
			document.removeEventListener('click', handleDocumentClick);
		};
	});
</script>

<div
	class:open
	class="select"
	bind:this={root}
	tabindex="0"
	role="combobox"
	aria-expanded={open}
	aria-haspopup="listbox"
	onkeydown={handleKeydown}
>
	<button
		class="trigger"
		type="button"
		onclick={toggle}
		aria-expanded={open}
	>
		<span>{selectedLabel}</span>

		<span class="arrow">
			{#if open}
				<svg viewBox="0 0 16 10" aria-hidden="true">
					<path d="M1 9L8 2L15 9" />
				</svg>
			{:else}
				<svg viewBox="0 0 16 10" aria-hidden="true">
					<path d="M1 1L8 8L15 1" />
				</svg>
			{/if}
		</span>
	</button>

	{#if open}
		<div class="dropdown" role="listbox">
			{#each normalizedOptions as option, index}
				<button
					class:focused={index === focusedIndex}
					class:selected={option.value === value}
					class="option"
					type="button"
					role="option"
					aria-selected={option.value === value}
					onmouseenter={() => focusedIndex = index}
					onclick={() => select(option)}
				>
					<span class="icon">
						<svg viewBox="0 0 16 16" aria-hidden="true">
							<path d="M4 1H12V4H15V12H12V15H4V12H1V4H4V1Z" />
						</svg>
					</span>

					<span>{option.label}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.select {
		position: relative;
		width: 100%;
		font-family: 'BoldPixels';
		outline: none;
	}

	.trigger {
		display: flex;
		align-items: center;
		width: 100%;
		height: 42px;
		padding: 0;
		border: 3px solid var(--bg-mid);
		border-radius: 11px;
		background: var(--bg-mid-dark);
		color: var(--text);
		font: inherit;
		font-size: 16px;
		text-align: left;
		cursor: pointer;
		box-shadow:
			inset 0 2px 0 rgba(255, 255, 255, 0.06),
			inset 0 -2px 0 rgba(0, 0, 0, 0.18);
	}

	.trigger > span:first-child {
		flex: 1;
		padding: 0 20px;
	}

	.arrow {
		display: grid;
		place-items: center;
		width: 68px;
		height: 100%;
		border-left: 2px solid var(--bg-mid);
	}

	.arrow svg {
		width: 16px;
		height: 10px;
		fill: none;
		stroke: var(--accent);
		stroke-width: 2;
		stroke-linecap: square;
		stroke-linejoin: miter;
	}

	.dropdown {
		position: absolute;
		z-index: 20;
		top: calc(100% + 5px);
		left: 0;
		width: 100%;
		padding: 10px;
		border: 3px solid var(--bg-mid);
		border-radius: 11px;
		background: var(--bg-mid-dark);
		box-shadow:
			0 5px 0 rgba(0, 0, 0, 0.18),
			inset 0 2px 0 rgba(255, 255, 255, 0.04);
	}

	.option {
		display: flex;
		align-items: center;
		gap: 16px;
		width: 100%;
		min-height: 58px;
		padding: 0 14px;
		border: 0;
		border-bottom: 2px solid var(--bg-mid);
		background: transparent;
		color: var(--text);
		font: inherit;
		font-size: 11px;
		text-align: left;
		cursor: pointer;
	}

	.option:last-child {
		border-bottom: 0;
	}

	.option:hover,
	.option.focused,
	.option.selected {
		border-radius: 8px;
		background: var(--bg-mid);
	}

	.icon {
		display: grid;
		place-items: center;
		flex: 0 0 18px;
		width: 18px;
		height: 18px;
	}

	.icon svg {
		width: 15px;
		height: 15px;
		fill: none;
		stroke: var(--accent);
		stroke-width: 1.5;
		stroke-linejoin: miter;
	}

	@media (max-width: 600px) {
		.trigger {
			height: 52px;
			font-size: 10px;
		}

		.option {
			min-height: 52px;
			font-size: 9px;
		}
	}
</style>