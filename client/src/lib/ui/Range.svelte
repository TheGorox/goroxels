<script>
    const { min=0, max=1, step=0.01, name="", id="" } = $props()
</script>

<input type="range" {min} {max} {step} {name} {id} />

<style>
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		background: transparent;
		cursor: pointer;
	}

	input[type='range']::-webkit-slider-runnable-track {
		height: 2px;
		background: var(--accent); 
		border-radius: 2px;
	}

	input[type='range']::-moz-range-track {
		height: 2px;
		background: var(--accent);
		border-radius: 2px;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;

		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--text);

		border: none;
		margin-top: -6px;
	}

	input[type='range']::-moz-range-thumb {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--text);
		border: none;
	}
</style>
