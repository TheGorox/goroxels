import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import path from 'node:path';

import sharedConfig from '../shared/config.test.js';

// websocket upgrades happen on /<canvasName>, so the dev server has to forward
// them to the real backend. plain http requests on those paths must keep being
// handled by vite (the app only uses them as websocket endpoints in dev).
const canvasWsProxies = Object.fromEntries(
	sharedConfig.canvases.map((canvas) => [
		`/${canvas.name}`,
		{
			changeOrigin: true,
			ws: true,
			bypass: (req) => (req.headers.upgrade === 'websocket' ? undefined : req.url)
		}
	])
);

// SvelteKit dev responses don't get `server.headers`, so set the isolation
// headers the production server uses with an explicit middleware.
function crossOriginIsolation() {
	return {
		name: 'goroxels-cross-origin-isolation',
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
				res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
				next();
			});
		}
	};
}

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const backend = env.GOROXELS_API || process.env.GOROXELS_API || 'http://localhost:8000';

	const proxy = {
		'/api': { target: backend, changeOrigin: true },
		'/config.json': { target: backend, changeOrigin: true },
		'/uploads': { target: backend, changeOrigin: true },
		'/changelog': { target: backend, changeOrigin: true },
		'/robots.txt': { target: backend, changeOrigin: true },
		...Object.fromEntries(
			Object.entries(canvasWsProxies).map(([key, value]) => [key, { ...value, target: backend }])
		)
	};

	return {
		plugins: [crossOriginIsolation(), sveltekit()],
		resolve: {
			alias: {
				$shared: path.resolve('../shared'),
				'@': path.resolve('./src')
			}
		},
		server: {
			fs: {
				allow: ['../shared']
			},
			host: '0.0.0.0', // allow lan connections
			port: 5173,
			proxy
		},
		build: {
			minify: mode === 'development' ? false : 'esbuild',
			sourcemap: mode === 'development'
		}
	};
});
