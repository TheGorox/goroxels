<script>
	import { t } from '../../i18n/translate.svelte';
	import Button from '../../ui/Button.svelte';
	import Textarea from '../../ui/Textarea.svelte';
	import Window from '../../ui/Window.svelte';

	let { isOpen = $bindable(true), ...rprops } = $props();
</script>

<Window title={t('w.bugreport.title')} id="bugreport" bind:isOpen {...rprops}>
	<div class="body">
		<Textarea></Textarea>
		<Button>Submit</Button>
	</div>
</Window>

<style>
	.body {
		display: flex;
		flex-direction: column;
		gap: 5px;
		align-items: flex-end;
	}
</style>
