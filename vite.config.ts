import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		port: 5173,
		proxy: {
			'/socket.io': {
				target: 'http://localhost:3000', 
				ws: true,                       // Active la redirection WebSocket
				changeOrigin: true
			}
		}
	}
});

