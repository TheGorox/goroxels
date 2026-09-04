<script>
	import TiltShadow from './TiltShadow.svelte';

	const {
		children,
		icon = null,
		isActive = $bindable(false),
		theme = 'dark',
		fullWidth = false,
		bg = null,
		color = null,
		topShadowColor = null,
		bottomShadowColor = null,
		style = '',
		iconStyle = '',
		...rest
	} = $props();

	let isLight = $derived(theme === 'light');

	let sides = $derived(isLight ? (isActive ? [] : ['bottom']) : isActive ? ['bottom'] : ['top']);

	let topColor = $derived(
		topShadowColor ??
			(isLight ? 'transparent' : isActive ? 'var(--bg-verydark)' : 'var(--bg-light)')
	);

	let bottomColor = $derived(
		bottomShadowColor ??
			(isLight ? 'var(--bg-dark)' : isActive ? 'var(--bg-light)' : 'var(--bg-verydark)')
	);

	let buttonStyle = $derived(
		[
			fullWidth ? 'width: 100%' : '',
			bg ? `background: ${bg}` : '',
			color ? `color: ${color}` : '',
			style
		]
			.filter(Boolean)
			.join(';')
	);
</script>

<TiltShadow {sides} {topColor} {bottomColor} style={fullWidth ? 'width: 100%' : ''} radius="10px">
	<button class="btn {isActive ? 'active' : ''} {theme}" style={buttonStyle} {...rest}>
		<div class="btn-content">
			{#if icon !== null}
				<span class="btn-icon" style={iconStyle}>
					{@html icon}
				</span>
			{/if}
			{#if children}
				<span class="btn-text">
					{@render children()}
				</span>
			{/if}
		</div>
	</button>
</TiltShadow>

<style>
	.btn {
		position: relative;
		background: var(--bg-mid);
		border: none;
		border-radius: 10px;

		font-family: inherit;
		font-size: var(--text-base);
		color: var(--accent);
		padding: 0.45rem;

		text-transform: uppercase;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn.light {
		background: var(--bg-light);
		color: #fff;
		transform: translateY(0);
		transition: transform 0.1s ease;
	}

	.btn.light.active {
		transform: translateY(2px);
	}

	.btn .btn-content {
		position: relative;
		z-index: 1;

		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		height: 100%;
	}

	.btn-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		height: 100%;
	}

	/* Автоматически растягиваем и подгоняем SVG-иконку по высоте текста */
	.btn-icon :global(svg) {
		height: 1em;
		width: auto;
		fill: currentColor;
	}

	.btn-text {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.btn:active {
		transform: none;
	}
	.btn:active:not(.active) {
		transform: translateY(-2px);
	}

	.btn.light:active:not(.active) {
		transform: translateY(2px);
	}

	.btn.active {
		color: var(--bg-light);
	}

	.btn.light.active {
		color: #fff;
	}
</style>
