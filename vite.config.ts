import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const vitePort = Number(env.VITE_PORT || 5173);
    const hmrHost = env.VITE_HMR_HOST || 'localhost';
    const usePolling = env.VITE_USE_POLLING === 'true';

    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                ssr: 'resources/js/ssr.tsx',
                refresh: true,
            }),
            react(),
            tailwindcss(),
        ],
        resolve: {
            alias: {
                '@': '/resources/js',
            },
        },
        server: {
            host: '0.0.0.0',
            port: vitePort,
            strictPort: true,
            hmr: {
                host: hmrHost,
                port: vitePort,
            },
            watch: {
                ignored: ['**/storage/framework/views/**'],
                usePolling,
            },
        },
    };
});
