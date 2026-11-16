// Plain-JS twin of vite.config.ts — vite loads .mjs directly WITHOUT bundling
// the config to a temp file, which is the step the sandbox EPERM wave blocks.
// Keep in sync with vite.config.ts (same values, same plugin).
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
