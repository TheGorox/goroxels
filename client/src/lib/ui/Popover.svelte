<script>
	let {
		trigger,
		children,
		side = 'top',
		offset = 8,
		panelClass = '',
		panelStyle = '',
		openDelay = 0,
		closeDelay = 200,
		viewportPadding = 8
	} = $props();

	let popoverEl;

	let pos = $state({ top: 0, left: 0 });

	let openTimer;
	let closeTimer;
	let isOpen = $state(false);

	// THE WALL
	const FALLBACK_ORDER = {
		top: ['top', 'top-right', 'top-left', 'right', 'left', 'bottom-right', 'bottom-left', 'bottom'],
		'top-right': [
			'top-right',
			'top',
			'right',
			'top-left',
			'bottom-right',
			'left',
			'bottom',
			'bottom-left'
		],
		right: [
			'right',
			'top-right',
			'bottom-right',
			'top',
			'bottom',
			'top-left',
			'bottom-left',
			'left'
		],
		'bottom-right': [
			'bottom-right',
			'bottom',
			'right',
			'bottom-left',
			'top-right',
			'left',
			'top',
			'top-left'
		],
		bottom: [
			'bottom',
			'bottom-right',
			'bottom-left',
			'right',
			'left',
			'top-right',
			'top-left',
			'top'
		],
		'bottom-left': [
			'bottom-left',
			'bottom',
			'left',
			'bottom-right',
			'top-left',
			'right',
			'top',
			'top-right'
		],
		left: [
			'left',
			'top-left',
			'bottom-left',
			'top',
			'bottom',
			'top-right',
			'bottom-right',
			'right'
		],
		'top-left': [
			'top-left',
			'top',
			'top-right',
			'left',
			'bottom-left',
			'right',
			'bottom',
			'bottom-right'
		]
	};

	function coordsFor(candidateSide, rect, pw, ph) {
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;

		switch (candidateSide) {
			case 'top':
				return { top: rect.top - offset - ph, left: cx - pw / 2 };
			case 'bottom':
				return { top: rect.bottom + offset, left: cx - pw / 2 };
			case 'left':
				return { top: cy - ph / 2, left: rect.left - offset - pw };
			case 'right':
				return { top: cy - ph / 2, left: rect.right + offset };
			case 'top-left':
				return { top: rect.top - offset - ph, left: rect.left - offset - pw };
			case 'top-right':
				return { top: rect.top - offset - ph, left: rect.right + offset };
			case 'bottom-left':
				return { top: rect.bottom + offset, left: rect.left - offset - pw };
			case 'bottom-right':
				return { top: rect.bottom + offset, left: rect.right + offset };
		}
	}

	function fits(coords, pw, ph) {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		return (
			coords.left >= viewportPadding &&
			coords.top >= viewportPadding &&
			coords.left + pw <= vw - viewportPadding &&
			coords.top + ph <= vh - viewportPadding
		);
	}

	function bestPosition() {
		const rect = trigger.getBoundingClientRect();
		const pw = popoverEl.offsetWidth;
		const ph = popoverEl.offsetHeight;

		const order = FALLBACK_ORDER[side] ?? FALLBACK_ORDER.bottom;

		let chosen = null;
		for (const candidate of order) {
			const coords = coordsFor(candidate, rect, pw, ph);
			if (fits(coords, pw, ph)) {
				chosen = coords;
				break;
			}
		}

		if (!chosen) {
			chosen = coordsFor(side, rect, pw, ph);
		}

		const vw = window.innerWidth;
		const vh = window.innerHeight;
		chosen.left = Math.min(Math.max(chosen.left, viewportPadding), vw - pw - viewportPadding);
		chosen.top = Math.min(Math.max(chosen.top, viewportPadding), vh - ph - viewportPadding);

		return chosen;
	}

	function reposition() {
		if (!isOpen || !trigger || !popoverEl) return;
		pos = bestPosition();
	}

	function open() {
		clearTimeout(closeTimer);
		clearTimeout(openTimer);

		const doOpen = () => {
			if (!trigger || !popoverEl) return;
			popoverEl.showPopover();
			isOpen = true;

			pos = bestPosition();
		};

		if (openDelay > 0) {
			openTimer = setTimeout(doOpen, openDelay);
		} else {
			doOpen();
		}
	}

	function scheduleClose() {
		clearTimeout(openTimer);
		clearTimeout(closeTimer);
		closeTimer = setTimeout(() => {
			popoverEl?.hidePopover();
			isOpen = false;
		}, closeDelay);
	}

	function cancelClose() {
		clearTimeout(closeTimer);
	}

	$effect(() => {
		if (!trigger) return;

		trigger.addEventListener('mouseenter', open);
		trigger.addEventListener('mouseleave', scheduleClose);
		trigger.addEventListener('focusin', open);
		trigger.addEventListener('focusout', scheduleClose);

		return () => {
			trigger.removeEventListener('mouseenter', open);
			trigger.removeEventListener('mouseleave', scheduleClose);
			trigger.removeEventListener('focusin', open);
			trigger.removeEventListener('focusout', scheduleClose);
			clearTimeout(openTimer);
			clearTimeout(closeTimer);
		};
	});

	$effect(() => {
		if (!isOpen) return;
		const onScrollOrResize = () => reposition();
		window.addEventListener('scroll', onScrollOrResize, { passive: true, capture: true });
		window.addEventListener('resize', onScrollOrResize, { passive: true });
		return () => {
			window.removeEventListener('scroll', onScrollOrResize, true);
			window.removeEventListener('resize', onScrollOrResize);
		};
	});
</script>

<div
	bind:this={popoverEl}
	popover="manual"
	class="popover-panel {panelClass}"
	style="top:{pos.top}px; left:{pos.left}px; {panelStyle}"
	onmouseenter={cancelClose}
	onmouseleave={scheduleClose}
>
	{@render children()}
</div>

<style>
	.popover-panel {
		position: fixed;
		inset: auto;
		margin: 0;
		height: 270px;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 10px 14px;

		border-radius: 10px;
		border: 1px solid var(--popover-border, var(--bg-light));
		background: var(--popover-bg, var(--bg-mid));
		color: var(--text);
		box-shadow: 0 0 5px rgba(255, 255, 255, 0.15);

		opacity: 0;
		transform: scale(0.96);
		transition:
			opacity 0.12s ease,
			transform 0.12s ease,
			display 0.12s allow-discrete,
			overlay 0.12s allow-discrete;
	}

	.popover-panel:popover-open {
		opacity: 1;
		transform: scale(1);
	}

	@starting-style {
		.popover-panel:popover-open {
			opacity: 0;
			transform: scale(0.96);
		}
	}

	/* Контейнеры под табами */
	.popover-panel :global(.panelContainer),
	.popover-panel :global(.shadowContainer) {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	/* Промежуточные слои */
	.popover-panel :global(.scrollbarParent),
	.popover-panel :global(.panelBody),
	.popover-panel :global(.panelBody > div) {
		height: 100% !important;
		min-height: 0 !important;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	/* Виртуальный список */
	.popover-panel :global(.vtlist) {
		height: 100% !important;
		overflow-y: auto !important;
	}
</style>
