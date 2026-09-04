<script>
	import { onMount, setContext } from 'svelte';
	import { render } from 'svelte/server';

	import { core } from './core.svelte.js';
	import { initConfig } from './canvasConfig.svelte.js';
	import { createCamera } from './camera.svelte.js';
	import { createRenderer } from './renderer.svelte.js';
	import { createInputHandler } from './inputs.js';
	import { socket } from './socket.svelte.js';
	import { player } from './player.svelte.js';
	import { online } from './online.svelte.js';
	import { initChunkManager } from './сhunkManager.js';
	import { persistent } from './stores/persistent.svelte.js';

	import { createOverlayRenderer } from './fx/fx.svelte.js';
	import { WebGLFxRenderer } from './fx/glFx.svelte.js';
	import { initGlobalCursor } from './fx/globalCursor.svelte.js';

	import { createToolManager } from './tools/toolManager.svelte.js';
	import ToolPanel from '../components/ToolsPanel.svelte';

	import Logo from '../ui/Logo.svelte';
	import Chat from '../components/Chat.svelte';
	import Toast from '../ui/Toast.svelte';
	import UtilityMenu from '../components/UtilityMenu.svelte';
	import CoordsMenu from '../components/CoordsMenu.svelte';
	import DebugMetrics from '../components/DebugMetrics.svelte';
	import Window from '../ui/Window.svelte';
	import ReportBug from '../components/windows/ReportBug.svelte';

	import Button from '../ui/Button.svelte';
	import Range from '../ui/Range.svelte';
	import Input from '../ui/Input.svelte';
	import Panel from '../ui/Panel.svelte';
	import Legendary from '../ui/Legendary.svelte';
	import { initRootPalette } from '../ui/uiPalette.svelte.js';
	import '$lib/i18n/translate.svelte.js';
	import '@/app.css';

	import icon from '$lib/assets/icons/icon_settings.svg?raw';
	import { initGameConfig } from './gameConfig.svelte.js';
	import { getStickerpacks } from '../api/stickers.js';
	import { processPendingPixels } from './pixelsQueue.svelte.js';

	// loading config is the first thing we want to do
	// anything else can be done after mount

	let cfg = (core.config = initConfig());
	core.gameConfig = initGameConfig();

	let canvasRef, fxCanvasRef, glCanvasRef;
	let camera;
	let toolManager = $state(null);
	let saveInterval;

	// localStorage.clear();

	const CAMERA_KEYS = {
		zoom: `canvas-${cfg.canvasId}-zoom`,
		offsetX: `canvas-${cfg.canvasId}-offsetX`,
		offsetY: `canvas-${cfg.canvasId}-offsetY`
	};

	function loadCameraFromStorage() {
		const z = localStorage.getItem(CAMERA_KEYS.zoom);
		if (z !== null) camera.targetZoom = parseFloat(z);
		else camera.targetZoom = 1;

		const ox = localStorage.getItem(CAMERA_KEYS.offsetX);
		if (ox !== null) camera.x = parseFloat(ox);
		else camera.x = cfg.boardWidth / 2;

		const oy = localStorage.getItem(CAMERA_KEYS.offsetY);
		if (oy !== null) camera.y = parseFloat(oy);
		else camera.y = cfg.boardHeight / 2;

		// make it zoom harder to make more impressive animation
		camera.currentZoom = 0.1;

		// we need to set these initially, so zooming animation can
		// work properly
		camera.pivotWorldX = camera.x;
		camera.pivotWorldY = camera.y;
		camera.mouseScreenX = Math.floor(window.innerWidth / 2);
		camera.mouseScreenY = Math.floor(window.innerHeight / 2);
	}

	function startCameraSaveInterval() {
		saveInterval = setInterval(() => {
			localStorage.setItem(CAMERA_KEYS.zoom, camera.targetZoom.toString());
			localStorage.setItem(CAMERA_KEYS.offsetX, camera.x.toString());
			localStorage.setItem(CAMERA_KEYS.offsetY, camera.y.toString());
		}, 600);
	}

	onMount(() => {
		core.mainCanvas = canvasRef;

		// init events listeners
		online.init();
		core.online = online;

		camera = core.camera = createCamera(canvasRef, cfg);

		loadCameraFromStorage();
		startCameraSaveInterval();

		core.toolManager = toolManager = createToolManager();

		const renderer = createRenderer(canvasRef, core);
		core.renderer = renderer;
		core.requestRender = () => renderer.requestRender();

		renderer.init();

		core.fx = createOverlayRenderer(fxCanvasRef, core);
		core.fx.start();

		core.gl = new WebGLFxRenderer(glCanvasRef, core);
		core.gl.start();

		socket.init(core);

		const input = createInputHandler(canvasRef, camera);
		core.input = input;

		player.init();
		core.player = player;

		const canvases = [canvasRef, fxCanvasRef, glCanvasRef];

		const resize = () => {
			const dpr = 1; //window.devicePixelRatio;
			const w = window.innerWidth * dpr;
			const h = window.innerHeight * dpr;

			for (const canvas of canvases) {
				updateSize(canvas);

				const ctx = canvas.getContext('2d');
				ctx && (ctx.imageSmoothingEnabled = false);
			}

			// canvasRef.getContext('2d').scale(dpr, dpr);
			renderer.requestRender();

			function updateSize(canvas) {
				canvas.width = w;
				canvas.height = h;
			}
		};
		window.addEventListener('resize', resize);
		resize();

		core.ui = {
			showProtection: persistent('showProtection', false, 500)
		};

		core.chunkManager = initChunkManager(core);

		// it's not in the renderer itself because we have multiple renderers
		function renderLoop() {
			processPendingPixels();

			renderer.render();
			camera.updateLerp();
			requestAnimationFrame(renderLoop);
		}
		renderLoop();

		try {
			initGlobalCursor(core);
		} catch (error) {
			console.error('unexpected shader error:', error);
		}

		initRootPalette(); // ui theme

		queueMicrotask(async () => {
			try {
				core.stickersCache = await getStickerpacks();
			} catch (error) {
				console.error('failed to load stickers');
			}
		});

		window.core = core;

		return () => {
			clearInterval(saveInterval);
			window.removeEventListener('resize', resize);
			socket.terminate();
			renderer.destroy?.();
		};
	});
</script>

<div class="game-core" style="width: 100vw; height: 100vh; overflow: hidden; background: #111;">
	<canvas bind:this={canvasRef} class="game-canvas" />
	<canvas bind:this={fxCanvasRef} class="fx-canvas" />
	<canvas bind:this={glCanvasRef} class="fx-canvas" />
</div>

<div id="ui">
	<Logo />
	<ToolPanel {toolManager} />
	<Chat />
	<UtilityMenu />
	<CoordsMenu />
	<DebugMetrics />
</div>

<Toast />

<style>
	.game-core {
		position: fixed;
		inset: 0;
	}

	.game-canvas,
	.fx-canvas {
		width: 100%;
		height: 100%;
		touch-action: none;
		position: fixed;
		top: 0;
		left: 0;
	}

	.fx-canvas {
		pointer-events: none;
	}

	#ui {
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 10;
		pointer-events: none;
	}

	#ui > :global(*) {
		pointer-events: all;
	}

	.shit {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 999;
		padding: 10px;
		background-color: white;
		color: black;
	}
</style>
