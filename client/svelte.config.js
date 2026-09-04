import adapter from '@sveltejs/adapter-static';
import path from 'node:path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: 'index.html',
			pages: 'build',
			assets: 'build'
		})
	},
	ssr: false,
	vitePlugin: {
		dynamicCompileOptions: ({ filename }) =>
			filename.includes('node_modules') ? undefined : { runes: true }
	},
	compilerOptions: {
		// disable a11y warnings - they're not applicable for this app
		warningFilter: (warning) => !warning.code.startsWith('a11y-')
	}
};

export default config;
