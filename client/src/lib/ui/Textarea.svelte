<script>
	const { children, placeholderColor = 'var(--bg-light)', ...props } = $props();
</script>

<div class="textareaContainer">
	<textarea {...props} style:--placeholder-color={placeholderColor}></textarea>
	{#if children}
		<div class="childrenContainer">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	textarea {
		font-family: BoldPixels;
		font-size: 1em;
		font-weight: normal;
		line-height: 1.2;
		-webkit-font-smoothing: none;
		-moz-osx-font-smoothing: unset;

		background-color: var(--bg-verydark);
		color: var(--text);
		border: 2px solid transparent;
		border-radius: 5px;
		
		padding: 0.5rem;
		width: 100%;
		min-height: 5em;
		box-sizing: border-box;
		resize: vertical;
		display: block;
	}

	textarea::placeholder {
		color: var(--placeholder-color);
		opacity: 1;
	}

	textarea:focus {
		outline: none;
		border: 2px solid var(--bg-light);
	}

	.textareaContainer {
		position: relative;
		width: 100%;
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