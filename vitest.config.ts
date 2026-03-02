import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['tests/js/setup.ts'],
        include: ['tests/js/**/*.test.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            include: ['resources/js/**/*.{ts,tsx}'],
            exclude: ['resources/js/types/**', 'resources/js/app.tsx', 'resources/js/ssr.tsx'],
        },
    },
});
