import { defineConfig } from 'vite';

const isTest = process.env.TEST_BUILD === '1';

export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    outDir: isTest ? 'dist-test' : 'dist',
    emptyOutDir: true,
    sourcemap: mode !== 'production',
    chunkSizeWarningLimit: 1200,
    ...(isTest
      ? {
          rollupOptions: {
            input: { test: 'test.html' },
          },
        }
      : {}),
  },
}));
