/* oxlint-env node */
/// <reference types="vite/client" />
/// <reference types="@types/node" />

import { readFileSync } from 'node:fs';
import type { ServerOptions } from 'node:https';
import { type UserConfig, defineConfig } from 'vite';

const IS_DEBUG = false;

// oxlint-disable-next-line import/no-default-export
export default defineConfig(({ mode }) => {
	let sslOptions: ServerOptions | undefined = undefined;

	// oxlint-disable-next-line typescript/no-unnecessary-condition
	if (mode !== 'production' || IS_DEBUG) {
		sslOptions = {
			cert: readFileSync('./certs/server.crt', 'utf-8'),
			key: readFileSync('./certs/server.key', 'utf-8')
		};
	}

	const config: UserConfig = {
		plugins: [],
		oxc: { target: 'esnext' },
		base: '/',
		envPrefix: 'APP_',
		envDir: '../',
		root: 'src',
		publicDir: '../public',
		clearScreen: false,
		server: {
			https: sslOptions,
			host: 'localhost',
			open: false,
			cors: true,
			port: 4000
		},
		build: {
			target: 'esnext',
			emptyOutDir: true,
			outDir: '../dist',
			minify: false
		},
		optimizeDeps: { esbuildOptions: { target: 'esnext' } },
		preview: {
			https: sslOptions,
			open: true,
			cors: true
		}
	};

	return config;
});
