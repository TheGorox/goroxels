<script>
	import { onMount } from 'svelte';

	let {
		inputRef = $bindable(null),
		draggable = false,
		type = 'text',
		children,
		placeholderColor = 'var(--bg-light)',
		bindValue = $bindable(undefined),
		...props
	} = $props();

	// svelte-ignore state_referenced_locally
	if(type === 'number' && bindValue === undefined){
		bindValue = 0;
	}

	const dragStartDelayMs = 500;
	const dragStartMaxJitter = 5;
	const moveFactor = 2; // Δ move -> value change ratio

	$effect(() => {
		let cleanupDraggableFn;
		if (type === 'number' && draggable) {
			const cleanupDraggableFn = makeInputDraggable();
		}

		return () => {
			cleanupDraggableFn?.();
		};
	});

	function makeInputDraggable() {
		let downTime = null;
		let downPos = { x: -1, y: -1 };
		let initialValue = null;
		let startedDrag = false;

		const onmousedown = (e) => {
			downTime = Date.now();
			downPos.x = e.clientX;
			downPos.y = e.clientY;

			document.addEventListener('pointermove', onmousemove);
			document.addEventListener('pointerup', onmouseup);
			document.addEventListener('pointercancel', onmouseup);
		};
		const onmousemove = (e) => {
			if (!downTime || Date.now() - downTime < dragStartDelayMs) return;
			e.preventDefault();

			if (!startedDrag) {
				const dx = Math.abs(e.clientX - downPos.x);
				const dy = Math.abs(e.clientY - downPos.y);
				if (Math.max(dx, dy) > dragStartMaxJitter) {
					cleanupDrag();
					return;
				}
				startedDrag = true;
				document.body.style.cursor = 'move';
				initialValue = Number(bindValue) || 0;
				if (isNaN(initialValue)) initialValue = null;
			}

			if (initialValue === null) return;

			const dx = e.clientX - downPos.x;
			const newValue = Math.floor(initialValue + dx / moveFactor);
			bindValue = newValue;
		};
		const onmouseup = (e) => {
			if (startedDrag) {
				e.preventDefault();
			}
			cleanupDrag();
		};

		function cleanupDrag() {
			startedDrag = false;
			downTime = null;
			initialValue = null;
			downPos.x = -1;
			downPos.y = -1;

			document.body.style.cursor = 'auto';

			document.removeEventListener('pointermove', onmousemove);
			document.removeEventListener('pointerup', onmouseup);
			document.removeEventListener('pointercancel', onmouseup);
		}

		inputRef.addEventListener('pointerdown', onmousedown);

		return () => {
			cleanupDrag();
		};
	}
</script>

<div class="inputContainer">
	<input
		{type}
		{...props}
		bind:this={inputRef}
		bind:value={bindValue}
		style:--placeholder-color={placeholderColor}
	/>
	<div class="childrenContainer">
		{@render children()}
	</div>
</div>

<style>
	/* remove arrows for number inputs */
	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input {
		font-family: BoldPixels;
		font-size: 1em;
		padding: 0.2rem 0.1rem;
		border-radius: 5px;
		border: 2px solid transparent;
		background-color: var(--bg-verydark);
		color: var(--text);

		width: 6em;

		font-weight: normal;
		line-height: 1;
		-webkit-font-smoothing: none;
		-moz-osx-font-smoothing: unset;
	}

	input:disabled {
		color: var(--bg-mid);
	}

	input::placeholder {
		color: var(--placeholder-color);
		opacity: 1;
	}

	input:focus {
		outline: none;
		border: 2px solid var(--bg-light);
	}

	.inputContainer {
		position: relative;
	}

	.childrenContainer {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		pointer-events: none;
	}

	.childrenContainer > :global(*) {
		pointer-events: all;
	}
</style>
