<script>
	import { _ } from 'svelte-i18n';
	import { notify } from '$lib/toast.js';
	import icon from '$lib/assets/icons/mountain.svg?raw';

	let {
		onFileSelect,
		onClear,
		accept = 'image/*',
		maxSizeMb = null,
		minWidth = null,
		maxWidth = null,
		minHeight = null,
		maxHeight = null,
		aspectRatio = null,
		aspectRatioTolerance = 0.03
	} = $props();

	let isDragging = $state(false);
	let fileInput = $state(null);
	let selectedFile = $state(null);

	function validateAndProcessFile(file) {
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			notify.error('Выберите файл изображения');
			return;
		}

		if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
			notify.error(`Файл слишком большой (макс. ${maxSizeMb} MB)`);
			return;
		}

		const img = new Image();
		const objectUrl = URL.createObjectURL(file);

		img.onload = () => {
			const { width, height } = img;
			URL.revokeObjectURL(objectUrl);

			if (minWidth && width < minWidth) {
				notify.error(`Ширина изображения меньше ${minWidth}px (текущая: ${width}px)`);
				return;
			}
			if (maxWidth && width > maxWidth) {
				notify.error(`Ширина изображения больше ${maxWidth}px (текущая: ${width}px)`);
				return;
			}
			if (minHeight && height < minHeight) {
				notify.error(`Высота изображения меньше ${minHeight}px (текущая: ${height}px)`);
				return;
			}
			if (maxHeight && height > maxHeight) {
				notify.error(`Высота изображения больше ${maxHeight}px (текущая: ${height}px)`);
				return;
			}

			if (aspectRatio !== null) {
				const currentRatio = width / height;
				if (Math.abs(currentRatio - aspectRatio) > aspectRatioTolerance) {
					notify.error(`Неверное соотношение сторон (ожидается ~${aspectRatio.toFixed(2)})`);
					return;
				}
			}

			selectedFile = file;
			onFileSelect?.(file);
		};

		img.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			notify.error('Не удалось загрузить файл изображения');
		};

		img.src = objectUrl;
	}

	function handleDrop(e) {
		e.preventDefault();
		isDragging = false;

		const file = e.dataTransfer?.files?.[0];
		if (file) validateAndProcessFile(file);
	}

	function handleDragOver(e) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e) {
		e.preventDefault();
		isDragging = false;
	}

	function handleInputChange(e) {
		const file = e.target.files?.[0];
		if (file) validateAndProcessFile(file);
		e.target.value = '';
	}

	function triggerSelect() {
		fileInput?.click();
	}

	function handleClear(e) {
		e.stopPropagation();
		selectedFile = null;
		onClear?.();
	}
</script>

<input
	bind:this={fileInput}
	type="file"
	{accept}
	style="display: none;"
	onchange={handleInputChange}
/>

<div
	class="uploadContainer"
	class:dragging={isDragging}
	onclick={triggerSelect}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	role="button"
	tabindex="0"
	onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && triggerSelect()}
>
	<div class="iconContainer">
		{@html icon}
	</div>
	<span>
		{selectedFile ? selectedFile.name : $_('uploadContainerText')}
	</span>
	{#if selectedFile && onClear}
		<button class="removeBtn" onclick={handleClear} type="button">✕</button>
	{/if}
</div>

<style>
	.uploadContainer {
		position: relative;
		padding: 8px;

		aspect-ratio: 1 / 1;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		min-height: 85px;

		border: 4px dashed var(--text);

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		user-select: none;
		cursor: pointer;
		overflow: hidden;
		transition: border-color 0.15s ease, background-color 0.15s ease;
	}

	.uploadContainer.dragging {
		border-style: solid;
		border-color: var(--accent, #fff);
		background-color: rgba(255, 255, 255, 0.05);
	}

	.iconContainer {
		width: 40%;
		height: 40%;
		max-width: 80px;
		max-height: 80px;
		margin-bottom: 8px;
		
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.iconContainer :global(svg) {
		width: 100% !important;
		height: 100% !important;
		max-width: 100% !important;
		max-height: 100% !important;
		display: block;
	}

	.uploadContainer span {
		width: 90%;
		white-space: normal;
		text-align: center;
		text-transform: uppercase;
		font-size: clamp(10px, 4.5vw, 14px);
		line-height: 1.2;
		word-break: break-all;
	}

	.removeBtn {
		position: absolute;
		top: 4px;
		right: 4px;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
		border: none;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		line-height: 1;
	}
</style>