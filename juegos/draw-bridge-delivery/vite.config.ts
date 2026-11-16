// TS twin of vite.config.mjs — the repo ships the .ts; the .mjs twin exists
// locally because vite loads .mjs directly WITHOUT bundling the config to a
// temp file, which is the step the sandbox EPERM wave blocks. Keep in sync.
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
