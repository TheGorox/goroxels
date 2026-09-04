import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
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
		hmr: false,
		host: '0.0.0.0', // allow lan connections
		port: 5173
	},
	build: {
		minify: mode === 'development' ? false : 'esbuild',
		sourcemap: mode === 'development',
	}
}));
