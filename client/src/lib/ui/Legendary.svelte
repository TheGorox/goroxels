<script>
	const { legend, children } = $props();
</script>

<div class="container">
	<div class="legend">
		{legend}
	</div>
	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}

	.legend {
		color: var(--bg-light);
		height: 1.8em;

		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
