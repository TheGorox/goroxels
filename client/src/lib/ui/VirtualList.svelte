<script>
	import { VirtualList } from 'svelte-virtuallists';

	let { items, style = 'height:100%;', class: className = '', ...content } = $props();
</script>

<VirtualList {items} {style} class={className}>
	{#snippet vl_slot({ index, item })}
		{@render content[item.type]?.(item)}
	{/snippet}
</VirtualList>