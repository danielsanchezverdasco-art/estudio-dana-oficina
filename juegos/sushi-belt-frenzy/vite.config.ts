import { defineConfig } from 'vite';
import playgamaBridge from '@playgama/bridge/vite';

export default defineConfig({
  // Relative base so the zip works when served from any sub-path.
  base: './',
  // __TEST_BUILD__ is replaced at build time. In the production build it is
  // false and the test handle (testhandle.ts) is tree-shaken away entirely;
  // the test build (VITE_TEST_BUILD=1) keeps it for probing.
  define: {
    __TEST_BUILD__: JSON.stringify(process.env.VITE_TEST_BUILD === '1'),
  },
  plugins: [
    // mode 'local' = the bridge file is bundled INTO the zip (self-contained);
    // the plugin injects <script src="./playgama-bridge.js"> as the first
    // script in <head> and emits the file into dist/.
    playgamaBridge({ mode: 'local' }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 600,
  },
});
