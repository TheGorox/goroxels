<script>
	import { onMount, tick } from 'svelte';
	import { _ } from 'svelte-i18n';

	import curvedArrowIcon from '$lib/assets/icons/icon_curved_arrow.svg?raw';
	import emojiIcon from '$lib/assets/icons/icon_emoji.svg?raw';
	import logOutIcon from '$lib/assets/icons/icon_exit.svg?raw';
	import ltIcon from '$lib/assets/icons/icon_lt.svg?raw';
	import settingsIcon from '$lib/assets/icons/icon_settings.svg?raw';
	import generalStickerpackIcon from '$lib/assets/generalStickerpack.png';

	import { useGameCore } from '../game/core.svelte';
	import { emitter } from '../game/events';
	import { player } from '../game/player.svelte';
	import { socket } from '../game/socket.svelte';
	import { persistent, persistentPerCanvas } from '../game/stores/persistent.svelte';
	import { checkCssContrast } from '../game/utils/color';
	import { t } from '../i18n/translate.svelte';
	import Button from '../ui/Button.svelte';
	import DrawerPanel from '../ui/DrawerPanel.svelte';
	import Input from '../ui/Input.svelte';
	import Panel from '../ui/Panel.svelte';
	import TiltShadow from '../ui/TiltShadow.svelte';
	import Popover from '../ui/Popover.svelte';
	import Tabs from '../ui/Tabs.svelte';
	import VirtualList from '../ui/VirtualList.svelte';

	import Login from './windows/Login.svelte';

	import { getEmoji } from '../constants/emoji';
	import { clicker } from '../game/utils/actions/clicker';
	import { animateEmoji } from '../game/utils/emoji';

	const core = useGameCore();

	const { toolManager, children } = $props();

	const now = Date.now();

	let messagesByChannel = $state({
		global: []
	});

	function formatTime(timestamp) {
		const d = new Date(timestamp);

		const dd = d.getDate();
		const mm = d.getMonth() + 1;
		const yy = d.getFullYear();

		const h = d.getHours();
		const m = d.getMinutes();
		const s = d.getSeconds();

		const fullTime = d.toISOString().replace('T', ' ').replace('Z', '');
		const time = `[${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}]`;

		return {
			fullTime,
			time
		};
	}

	let currentReplyTarget = $state(null);
	let currentChannel = persistentPerCanvas('chatChannel', 'global');

	let availableChannels = $derived.by(() => {
		const set = new Set(['global']);
		if (core.config?.canvasName) {
			set.add(core.config.canvasName);
		}
		Object.keys(messagesByChannel).forEach((ch) => set.add(ch));
		return Array.from(set);
	});

	let currentMessages = $derived.by(() => {
		const ch = currentChannel.v;
		const list = messagesByChannel[ch] || [];
		const limit = core.gameConfig.chatLimit ?? 100;
		return list.slice(-limit);
	});

	let chatHeight = $state(0);
	let chatWidth = $state(0);

	let tabWidth = $state(0);

	let channelsTabHeight = $state(0);
	let channelsTabWidth = $state(0);
	let channelsBodyHeight = $derived(`${channelsTabHeight + 11}px`);

	let chatCollapsed = $state(false);
	let offsetLeft = $derived.by(() => {
		if (chatCollapsed) {
			return -chatWidth + 'px';
		}
		return 0;
	});

	let channelsDrawerOffset = $derived(chatCollapsed ? (channelsTabWidth + 4 + 10) * -1 : 0);

	const palette = core.config.colorsHex;

	let channelsDrawerState = $state('closed');
	let usersDrawerState = $state('closed');

	$effect(() => {
		if (chatCollapsed) {
			usersDrawerState = 'closed';
			channelsDrawerState = 'closed';
		}
	});

	function getUsername(user) {
		if (!user.registered) {
			return `GUEST ${user.connections[0]}`;
		}
		return user.username;
	}
	function formatNicknameWbr(username) {
		return username?.replace(/([#._@/])/g, '$1<wbr>');
	}

	function needOutline(color) {
		if (!color) return false;

		const bgColor =
			getComputedStyle(document.documentElement).getPropertyValue('--bg-dark').trim() ?? '#000000';

		const dist = checkCssContrast(bgColor, color);
		return dist < 3.9;
	}

	let chatInputRef = $state(null);
	function processEnter() {
		const chatFocused = document.activeElement === chatInputRef;
		if (chatFocused) {
			sendCurrentMessage();
		} else {
			chatInputRef.focus();
		}
	}

	function sendCurrentMessage() {
		const inputText = chatInputRef.value.trim();
		if (!inputText) return;

		const msgObj = {
			text: inputText,
			replyTo: currentReplyTarget
		};

		const channel = currentChannel.v;

		const sent = socket.sendChatMessage(msgObj, channel);
		if (sent) {
			chatInputRef.value = '';
		} else {
			// TODO mark chat input that message didn't sent
		}
	}

	let isLoginOpen = $state(false);

	let panelBodyRef = $state(null);
	let emojiButtonRef = $state(null);

	const emoji = getEmoji();
	let favEmojiList = persistent('favEmoji', ['🙁', '🤔', '😀', '😄', '💚', '😡', '👋', '👍', '😐']);

	let emojiMegaList = $derived([
		...chunkArray(favEmojiList.v, 6).map((row) => ({ type: 'emojiRow', data: row })),
		{ type: 'spacer', height: 14 },
		...chunkArray(emoji.flat(), 6).map((row) => ({ type: 'emojiRow', data: row }))
	]);

	function chunkArray(arr, size = 6) {
		return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
			padEnd(arr.slice(i * size, i * size + size), size, '	')
		);
	}

	function padEnd(arr, targetLength, padValue = undefined) {
		const needToPad = Math.max(0, targetLength - arr.length);
		return [...arr, ...Array(needToPad).fill(padValue)];
	}

	function emojiClicked(clickEv) {
		console.trace('click', Date.now());

		chatInputRef.value += clickEv.target.innerText;
		chatInputRef.focus();
	}

	function emojiLongClicked(clickEv) {
		console.trace('click', Date.now());
		const emoji = clickEv.target.innerText;
		const favEm = favEmojiList.v;

		let isRemoved = false;
		if (favEm.includes(emoji)) {
			favEm.splice(favEm.indexOf(emoji), 1);
			isRemoved = true;
		} else {
			favEm.push(emoji);
		}

		animateEmoji(clickEv.target, 0.7, isRemoved);

		favEmojiList.v = [...favEm];
	}

	emitter.on('sock.chatMessage', (msg) => {
		const ch = msg.ch || 'global';
		if (!messagesByChannel[ch]) {
			messagesByChannel[ch] = [];
		}

		messagesByChannel[ch].push(msg);

		const limit = core.gameConfig.chatLimit;
		if (messagesByChannel[ch].length > limit * 1.5) {
			messagesByChannel[ch] = messagesByChannel[ch].slice(-limit);
		}

		let scolledDown =
			Math.abs(panelBodyRef.scrollHeight - panelBodyRef.offsetHeight - panelBodyRef.scrollTop) < 30;
		if (scolledDown) {
			tick().then(() => {
				scrollDownMessages();
			});
		}
	});

	function scrollDownMessages() {
		panelBodyRef.scrollBy(0, 999);
	}

	let activeStickerpack = $state('General');
	let activeStickers = $derived(
		core?.stickersCache?.find((p) => p.title === activeStickerpack)?.stickers || []
	);

	function handleHorizontalScroll(e) {
		if (event.cancelable && navigator.maxTouchPoints > 0) {
			return;
		}

		const target = event.currentTarget;

		if (event.deltaY !== 0) {
			event.preventDefault();
			target.scrollLeft += event.deltaY;
		}
	}

	onMount(() => {
		emitter.on('keydown', (e) => {
			if (e.code === 'Enter' && !e.altKey) {
				processEnter();
			}
		});
	});
</script>

<div
	class="chatContainer"
	bind:clientWidth={chatWidth}
	bind:clientHeight={chatHeight}
	style:--offset-left={offsetLeft}
>
	<TiltShadow sides={['top', 'bottom']} magnetSides={['left']} radius="10px" distance="4px">
		<Panel
			magnetSides={['left']}
			padding="5px"
			innerPadding="0 8px"
			radius="7px"
			shadowDistance="4px"
			width="220px"
			height="275px"
			bind:panelBodyRef
		>
			{#snippet header()}
				<div class="options">
					<div class="leftOptions">
						<div class="myusersUsername">{player.nickname}</div>
						<div class="channel">@{currentChannel.v}</div>
					</div>
					<div class="rightOptions">
						{@html settingsIcon}
						{@html logOutIcon}
					</div>
				</div>
			{/snippet}
			<div class="messages">
				{#each currentMessages as message, index (message.id)}
					{@const formattedTime = formatTime(message.time)}
					{#if index > 0}
						<hr />
					{/if}
					<div class="message">
						<div class="messageHead">
							<div class="chatUsername">{message.nick}</div>
							<div class="msgTime" title={formattedTime.fullTime}>
								{formattedTime.time}
							</div>
						</div>
						<div class="messageText">
							{message.msg}
						</div>
					</div>
				{/each}
			</div>
			{#snippet footer()}
				{#if player.isGuest}
					<Button theme="light" fullWidth={true} onclick={() => (isLoginOpen = true)}>
						{$_('login_or_register')}
					</Button>
				{:else}
					<Input
						type="text"
						placeholder={$_('chat.placeholder')}
						style="width: 100%; background-color: var(--bg-dark); padding: 8px; padding-right: 24px;"
						bind:inputRef={chatInputRef}
					>
						<div class="emojiIcon" bind:this={emojiButtonRef}>
							{@html emojiIcon}
						</div>
					</Input>
				{/if}
			{/snippet}
		</Panel>
	</TiltShadow>
	<div class="submenus">
		{@render children()}

		<div class="channelsDrawer" style:--offset-x={channelsDrawerOffset + 'px'}>
			<DrawerPanel
				side="left"
				magnetSides={['left']}
				containerWidth={chatWidth}
				containerHeight={chatHeight}
				bind:drawerState={channelsDrawerState}
			>
				<div style="min-height: {channelsBodyHeight};" class="channelsList">
					{#each availableChannels as channel}
						<button
							class="channelItem {currentChannel.v === channel ? 'active' : ''}"
							onclick={() => (currentChannel.v = channel)}
						>
							@{channel}
						</button>
					{/each}
				</div>
				{#snippet label()}
					<div
						class="channelsDrawerTab"
						bind:clientHeight={channelsTabHeight}
						bind:clientWidth={channelsTabWidth}
					>
						{$_('chat.channels')}
					</div>
				{/snippet}
			</DrawerPanel>
		</div>

		<DrawerPanel
			side="bottom"
			magnetSides={['left', 'bottom']}
			containerWidth={chatWidth}
			containerHeight={chatHeight}
			renderInBody={true}
			bind:drawerState={usersDrawerState}
			panelProps={{
				height: '270px',
				maxHeight: '270px',
				padding: '8px 4px 4px 4px',
				shadowDistance: '4px'
			}}
		>
			<div style="width: 190px;">
				{#if core.online?.users?.length}
					{#each core.online.users as user, i (user.userId ?? -user.connections[0])}
						{@const { lastCoords, lastColor } = user}
						{#if i > 0}
							<hr />
						{/if}

						<div class="userBlock">
							<div class="badge">{@html settingsIcon}</div>
							<div class="usersUsername">{@html formatNicknameWbr(getUsername(user))}</div>

							<div
								class="coords {needOutline(palette[lastColor]) ? 'outline' : ''}"
								style="color: {palette[lastColor]}"
								onclick={() =>
									lastCoords &&
									setTimeout(() => core?.camera.centerOn(lastCoords[0], lastCoords[1]))}
							>
								<div>{lastCoords?.[0] ?? ''}</div>
								<div>{lastCoords?.[1] ?? ''}</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
			{#snippet label()}
				<div class="usersTab">
					<div class="">{$_('chat.players')}</div>
					<span class="usersLabel">{core.online?.users?.length ?? 0}</span>
				</div>
			{/snippet}
		</DrawerPanel>

		<div class="toggleChatTab" bind:clientWidth={tabWidth} style:--tab-width={tabWidth + 'px'}>
			<TiltShadow sides={['left']} magnetSides={['left']} radius="10px" distance="4px">
				<Panel magnetSides={['left']} radius="5px" padding="0px">
					{#snippet footer()}
						<button
							class="lt {chatCollapsed ? 'collapsed' : ''}"
							onclick={() => (chatCollapsed = !chatCollapsed)}
							style:padding="7px"
						>
							{@html ltIcon}
						</button>
					{/snippet}
				</Panel>
			</TiltShadow>
		</div>
	</div>
</div>

{#if isLoginOpen}
	<Login bind:isOpen={isLoginOpen}></Login>
{/if}

{#if emojiButtonRef}
	<Popover
		trigger={emojiButtonRef}
		closeDelay={9999999}
		panelStyle="width: 251px; height: 270px; user-select: none;"
	>
		<Tabs
			tabs={[
				{ id: 'emoji', label: $_('emoji') },
				{ id: 'stickers', label: $_('stickers') }
			]}
			panelProps={[
				{ padding: '0', innerPadding: '0 8px 0 0' },
				{ padding: '0', innerPadding: '0', innerBodyPadding: '5px' }
			]}
		>
			{#snippet emoji()}
				<VirtualList items={emojiMegaList}>
					{#snippet emojiRow(item)}
						<span class="emojiRow">
							{#each item.data as emoji}
								<span use:clicker={{ onclick: emojiClicked, onlongclick: emojiLongClicked }}>
									{emoji}
								</span>
							{/each}
						</span>
					{/snippet}
					{#snippet emojisAll(entry)}
						<div>{entry.data}</div>
					{/snippet}
					{#snippet spacer(entry)}
						<div style="height:{entry.height}px"></div>
					{/snippet}
				</VirtualList>
			{/snippet}
			{#snippet stickers()}
				<div class="stickersHeader" onwheel={handleHorizontalScroll}>
					{#each core.stickersCache as stickerpack (stickerpack.id)}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="stickerpackContainer {activeStickerpack === stickerpack.title ? 'active' : ''}"
							onclick={() => activeStickerpack = stickerpack.title}
						>
							<img
								src={stickerpack.iconUrl || generalStickerpackIcon}
								alt={stickerpack.title}
								title={stickerpack.title}
								style:height="32px"
							/>
						</div>
					{/each}
				</div>
				<hr style:margin="5px 0" />
				<div class="currentStickers">
					{#each activeStickers as sticker (sticker.id)}
						<img src={sticker.thumbUrl} alt={sticker.code} title={`:${sticker.code}:`} />
					{/each}
				</div>
			{/snippet}
		</Tabs>
	</Popover>
{/if}

<style>
	.emojiRow {
		display: flex;
		justify-content: space-evenly;
	}
	.emojiRow > * {
		min-width: 20px;
	}
	.channelsDrawer {
		transform: translateX(var(--offset-x));
		transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.channelsDrawerTab {
		writing-mode: tb;
		user-select: none;
		cursor: pointer;
		text-transform: uppercase;
	}

	.channelsList {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 4px 0;
	}

	.channelItem {
		background: none;
		border: 1px solid transparent;
		color: var(--text);
		padding: 4px 8px;
		text-align: left;
		cursor: pointer;
		border-radius: 4px;
		font-size: var(--text-xxs);
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	.channelItem:hover {
		background-color: var(--bg-dark);
	}

	.channelItem.active {
		color: var(--accent);
		border-color: var(--accent);
		background-color: var(--bg-dark);
	}

	.chatContainer {
		position: absolute;
		bottom: 10px;
		left: var(--offset-left);
		z-index: 1;
		transition: left 0.6s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.submenus {
		position: relative;
		z-index: -1;
	}

	.options {
		padding: 0 5px;
		padding-top: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.leftOptions,
	.rightOptions {
		display: flex;
	}

	.leftOptions {
		align-items: baseline;
		gap: 13px;
	}
	.rightOptions {
		align-items: center;
		gap: 18px;
		color: var(--bg-light);
	}

	.myusersUsername {
		font-family: Inter-SemiBold;
		font-size: var(--text-xs);
		color: var(--text);
	}

	.channel {
		font-size: var(--text-xxs);
		color: var(--accent);
	}

	.messages {
		padding: 8px 0;
	}

	.messageHead {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.chatUsername {
		font-size: var(--font-base);
	}

	.msgTime {
		color: var(--bg-light);
		font-size: 0.5rem;
		font-family: 'Inter-SemiBold';
	}

	.messageText {
		font-family: Inter-Light;
		font-size: var(--text-xxs);
		letter-spacing: 0.02rem;
	}

	.emojiIcon {
		color: var(--bg-light);
		height: inherit;
		display: flex;
		align-items: center;
		position: absolute;
		right: 5px;

		anchor-name: 'emojiPopoverIcon';
	}

	.usersTab {
		display: inline-flex;
		align-items: center;
		text-transform: uppercase;
		gap: 7px;
	}

	.usersLabel {
		color: var(--bg-mid);
		background-color: var(--accent);
		border-radius: 5px;
		padding: 2px;
		font-size: var(--text-xxs);
	}

	.userBlock {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 10px;
		align-items: center;
	}

	.badge {
		display: contents;
	}

	.usersUsername {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.coords {
		display: flex;
		flex-direction: column;
		align-items: flex-end;

		font-size: var(--text-xxs);
		color: var(--bg-light);
		white-space: nowrap;

		cursor: pointer;
	}

	.coords.outline {
		text-shadow:
			1px 0 0 #ffffff,
			-1px 0 0 #ffffff,
			0 1px 0 #ffffff,
			0 -1px 0 #ffffff;
	}

	.toggleChatTab {
		position: absolute;
		right: calc(var(--tab-width) * -1 + -4px);
		bottom: 10px;
	}

	.lt {
		background: none;
		border: none;
		display: block;
		padding: 0;
		margin: 0;

		color: var(--accent);
		margin-bottom: -5px;
	}

	.lt > :global(svg) {
		transition: transform 0.4s ease;
	}

	.lt.collapsed > :global(svg) {
		transform: rotate(180deg);
	}

	.stickersHeader {
		display: flex;
		gap: 5px;

		overflow-x: auto;
		overflow-y: hidden;
		white-space: nowrap;

		scrollbar-width: none;
		scroll-behavior: smooth;

		min-height: max-content;
	}

	.stickersHeader::-webkit-scrollbar {
		display: none;
	}

	.stickerpackContainer {
		display: flex;
		padding: 3px;
		border-radius: 5px;
		cursor: pointer;
	}

	.currentStickers {
		display: flex;
		flex-wrap: wrap;
		overflow-y: auto;
		padding-right: 5px;
		gap: 3px;
	}


	.currentStickers img {
		background-color: var(--bg-verydark);
	}

	.stickerpackContainer.active {
		background-color: var(--bg-mid);
	}
</style>
