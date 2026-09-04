<script>
	import { t } from '../../i18n/translate.svelte';
	import Button from '../../ui/Button.svelte';
	import Textarea from '../../ui/Textarea.svelte';
	import Window from '../../ui/Window.svelte';

	import vkIcon from '$lib/assets/icons/vk-colored.svg?raw';
	import discordIcon from '$lib/assets/icons/discord-colored.svg?raw';
	import googleIcon from '$lib/assets/icons/google-colored.svg?raw';

	let { isOpen = $bindable(true), ...rprops } = $props();
</script>

<Window title={t('login_or_register')} id="settings" bind:isOpen {...rprops}>
	<div class="body">
		<a href="/api/auth/vk">
			<Button
				icon={vkIcon}
				bg="#4C75A3"
				fullWidth={true}
				theme="light"
				style="font-size: var(--text-x2);">Войти через VK</Button
			>
		</a>
		<a href="/api/auth/discord">
			<Button
				icon={discordIcon}
				bg="#5864de"
				fullWidth={true}
				theme="light"
				style="font-size: var(--text-x2);">Войти через Discord</Button
			>
		</a>
		<a href="/api/auth/google">
			<Button
				icon={googleIcon}
				bg="white"
				fullWidth={true}
				theme="light"
                color="#222222"
				style="font-size: var(--text-x2);">Войти через Google</Button
			>
		</a>
	</div>  
</Window>

<style>
	.body {
		display: flex;
		flex-direction: column;
		gap: 5px;
		align-items: flex-end;
	}

    .body > * {
        width: 100%;
    }
</style>
