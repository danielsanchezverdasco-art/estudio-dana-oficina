import { defineConfig } from 'vite';
import playgamaBridge from '@playgama/bridge/vite';

export default defineConfig({
  base: './',
  define: {
    __TEST_BUILD__: JSON.stringify(process.env.VITE_TEST_BUILD === '1'),
  },
  plugins: [
    playgamaBridge({ mode: 'local' }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 600,
  },
});
