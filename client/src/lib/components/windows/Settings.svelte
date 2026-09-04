<script>
	import * as stickerApi from '../../api/stickers';
	import { changeName } from '../../api/user';
	import { useGameCore } from '../../game/core.svelte';
	import { player } from '../../game/player.svelte';
	import { _, t } from '../../i18n/translate.svelte';
	import { notify } from '../../toast';
	import Button from '../../ui/Button.svelte';
	import Input from '../../ui/Input.svelte';
	import Legendary from '../../ui/Legendary.svelte';
	import Select from '../../ui/Select.svelte';
	import Tabs from '../../ui/Tabs.svelte';
	import Textarea from '../../ui/Textarea.svelte';
	import UploadHandler from '../../ui/UploadHandler.svelte';
	import Window from '../../ui/Window.svelte';
	import CollapsibleBlock from '../../ui/windowComponents/CollapsibleBlock.svelte';
	import Row from '../../ui/windowComponents/Row.svelte';

	let { isOpen = $bindable(true), ...rprops } = $props();

	const core = useGameCore();

	let nameInputBlocked = $state(false);

	async function nameHandleKeyDown(event) {
		if (nameInputBlocked) return;

		if (event.key === 'Enter') {
			event.stopPropagation();

			nameInputBlocked = true;
			const newNickname = event.target.value;

			try {
				const success = await changeName(newNickname);
				if (success)
					notify.info(t('w.settings.nicknameChanged', { values: { name: newNickname } }));
			} finally {
				setTimeout(() => {
					nameInputBlocked = false;
				}, 1000);
			}
		}
	}

	let stickerpackUploadingIcon = $state(null);
	let stickerpackUploadName = $state(null);

	let stickerUploadFile = $state(null);
	let stickerUploadCode = $state(null);

	async function createStickerPack() {
		const pack = await stickerApi.addStickerpack(stickerpackUploadName, stickerpackUploadingIcon);
		if (!pack) return;

		if (core.stickersCache) {
			core.stickersCache.push(pack);
		}
	}

	async function addSticker() {
		const currentStickerpack = core.stickersCache?.find((p) => p.title);
		if (!currentStickerpack) return;

		const sticker = await stickerApi.addSticker(
			stickerUploadCode,
			stickerUploadFile,
			currentStickerpack.id
		);
		if (!sticker) return;

		currentStickerpack.stickers.push(sticker);
	}

	let packsList = $derived(core.stickersCache?.map((x) => x.title));
	let currentPackName = $state('General');
	let currentStickers = $derived.by(() => {
		let pack = core.stickersCache?.find((p) => p.title);
		return pack?.stickers ?? [];
	});
	// processEnter()
</script>

<Window title={$_('w.settings.title')} id="settings" bind:isOpen noPanelBody {...rprops}>
	<div class="body">
		<Tabs
			tabs={[
				{ id: 'general', label: $_('w.settings.general') },
				{ id: 'user', label: $_('w.settings.user') },
				{ id: 'hotkeys', label: $_('w.settings.hotkeys') },
				{ id: 'admin', label: $_('w.settings.admin') }
			]}
			panelProps={{ padding: '4px', maxHeight: '400px' }}
		>
			{#snippet general()}
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
				<div>emoji</div>
			{/snippet}
			{#snippet user()}
				<Row>
					{#snippet left()}
						{$_('username')}
					{/snippet}
					{#snippet right()}
						<Input
							type="text"
							value={player.nickname}
							onkeydown={nameHandleKeyDown}
							disabled={nameInputBlocked}
						></Input>
					{/snippet}
				</Row>
			{/snippet}
			{#snippet hotkeys()}
				<div>todo 3</div>
			{/snippet}
			{#snippet admin()}
				<CollapsibleBlock blockName={$_('stickers').toUpperCase()}>
					<div class="createStickerpackPanel">
						Create sticker pack
						<Row alignRight="center">
							{#snippet left()}
								<UploadHandler
									onFileSelect={(file) => (stickerpackUploadingIcon = file)}
									onClear={() => (stickerpackUploadingIcon = null)}
									aspectRatio={1}
								></UploadHandler>
							{/snippet}
							{#snippet right()}
								<Legendary legend={$_('sticker_pack_name')}>
									<Input type="text" bind:bindValue={stickerpackUploadName}></Input>
								</Legendary>
								<Button onclick={createStickerPack}>Create sticker pack</Button>
							{/snippet}
						</Row>
					</div>
					<hr />
					<div class="stickersPanel">
						Add sticker
						<Row alignRight="center">
							{#snippet left()}
								<UploadHandler
									onFileSelect={(file) => (stickerUploadFile = file)}
									onClear={() => (stickerUploadFile = null)}
									aspectRatio={1}
									aspectRatioTolerance={0.5}
								></UploadHandler>
							{/snippet}
							{#snippet right()}
								<Select options={packsList} bind:value={currentPackName}></Select>
								<Legendary legend={$_('sticker_code')}>
									<Input type="text" bind:bindValue={stickerUploadCode}></Input>
								</Legendary>
								<Button onclick={addSticker}>Add sticker</Button>
							{/snippet}
						</Row>
						<div class="stickers">
							{#each currentStickers as sticker (sticker.id)}
								<div class="stickerTile">
									<img src={sticker.thumbUrl} alt={sticker.code} title={`:${sticker.code}:`} />
									<div class="closeBtn"></div>
								</div>
							{/each}
						</div>
					</div>
				</CollapsibleBlock>
			{/snippet}
		</Tabs>
	</div>
</Window>

<style>
	.body {
		display: flex;
		flex-direction: column;
		gap: 5px;
		align-items: center;

		width: 400px;
		max-width: 90vw;
	}

	.stickers {
		gap: 5px;
		display: flex;
		flex-wrap: wrap;
		margin-top: 5px;
	}
</style>
