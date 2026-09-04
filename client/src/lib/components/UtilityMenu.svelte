<script>
	import Panel from '../ui/Panel.svelte';

	import settingsIcon from '$lib/assets/icons/icon_settings.svg?raw';
	import reportBugIcon from '$lib/assets/icons/icon_bugreport.svg?raw';
	import infoIcon from '$lib/assets/icons/icon_help.svg?raw';
	import Window from '../ui/Window.svelte';

	import Settings from './windows/Settings.svelte';
	import Help from './windows/Help.svelte';
	import ReportBug from './windows/ReportBug.svelte';
	import IconButton from '../ui/IconButton.svelte';

	let isSettingsOpen = $state(false);
	let isBugOpen = $state(false);
	let isInfoOpen = $state(false);
</script>

<div class="utilityMenu">
	<Panel magnetSides={['right']} padding="10px">
		{#snippet footer()}
			<div class="buttons">

				<IconButton active={isSettingsOpen} onclick={() => (isSettingsOpen = true)} icon={settingsIcon}/>
				<IconButton active={isBugOpen} onclick={() => (isBugOpen = true)} icon={reportBugIcon}/>
				<IconButton active={isInfoOpen} onclick={() => (isInfoOpen = true)} icon={infoIcon}/>

			</div>
		{/snippet}
	</Panel>
</div>

{#if isSettingsOpen}
	<Settings bind:isOpen={isSettingsOpen}></Settings>
{/if}

{#if isBugOpen}
	<ReportBug bind:isOpen={isBugOpen}></ReportBug>
{/if}

{#if isInfoOpen}
	<Help bind:isOpen={isInfoOpen}></Help>
{/if}

<style>
	.utilityMenu {
		position: absolute;
		top: 10px;
		right: 0;
	}

	

    .buttons {
        display: flex;
        gap: 10px;

        color: var(--accent);
    }

	.buttons > :global(.icon-btn svg) {
		fill: currentColor;
		filter: drop-shadow(0 2px 0px rgba(0, 0, 0, 0.22));
	}

    .buttons > :global(.icon-btn.active svg) {
		color: var(--bg-dark);
        filter: none;
	}
</style>
