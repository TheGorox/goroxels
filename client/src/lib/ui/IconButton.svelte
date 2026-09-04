<script>
    let { active = false, icon, ...restProps } = $props();
</script>

<button
    class="icon-btn"
    class:active={active}
    {...restProps}
>
    {@html icon}
</button>

<style>
    .icon-btn {
		display: inline-flex;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: var(--accent);
		transition: color 0.2s;
	}

	.icon-btn.active {
		color: var(--bg-dark);
	}
</style>