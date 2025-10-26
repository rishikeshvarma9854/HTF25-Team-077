import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			devOptions: { enabled: true },
			includeAssets: ['icon.svg'],
			manifest: {
				name: 'AI Outfit Planner',
				short_name: 'OutfitAI',
				description: 'Plan, manage, and get AI-powered outfit recommendations.',
				theme_color: '#111827',
				background_color: '#111827',
				display: 'standalone',
				start_url: '/',
				icons: [
					{
						src: 'icon.svg',
						sizes: '512x512',
						type: 'image/svg+xml',
						purpose: 'any maskable'
					}
				]
			}
		})
	],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url))
			}
		},
	server: {
		port: 5173,
		open: true
	}
});
