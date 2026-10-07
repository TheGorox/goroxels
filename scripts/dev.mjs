// Runs the backend and the vite dev server together.
//
// The vite dev server is the one you open in the browser: it serves the client
// from src with HMR and proxies /api, /uploads, /config.json and the websocket
// canvas endpoints to the backend.
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const children = [];
let shuttingDown = false;

function shutdown(code = 0) {
	if (shuttingDown) return;
	shuttingDown = true;

	for (const child of children) {
		if (!child.killed) child.kill('SIGINT');
	}

	setTimeout(() => process.exit(code), 300);
}

function start(name, cwd, stdio) {
	const child = spawn(npm, ['run', 'dev'], { cwd, stdio, env: process.env });

	child.on('exit', (code, signal) => {
		if (shuttingDown) return;
		console.log(`\n[dev] ${name} stopped (${signal || code}), shutting down`);
		shutdown(code ?? 1);
	});

	child.on('error', (err) => {
		console.error(`[dev] failed to start ${name}:`, err.message);
		shutdown(1);
	});

	children.push(child);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

// the server reads console commands from stdin, so it gets no stdin here to
// avoid fighting with vite's interactive keybindings
start('server', path.join(root, 'server'), ['ignore', 'inherit', 'inherit']);
start('client', path.join(root, 'client'), 'inherit');
