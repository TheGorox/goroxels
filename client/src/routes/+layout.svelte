<script>
	import favicon from '$lib/assets/favicon.webp';
	import Toast from '$lib/ui/Toast.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<Toast />