// CJS twin of vite.config.ts — vite loads .cjs configs by compiling the
// bundled code IN MEMORY (module._compile), with NO temp-file write, which
// is the exact step the sandbox EPERM wave blocks for ESM configs.
// Keep in sync with vite.config.ts (same values, same plugin).
const { defineConfig } = require('vite');
const playgamaBridge = require('@playgama/bridge/vite').default;

module.exports = defineConfig({
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
    // LOCAL WORKAROUND (sandbox EPERM): vite's copyFileSync of public/ fails
    // persistently in this VM. public/ is copied afterwards by
    // copy-public-retry.mjs (read + writeSync retry loop). The repo's
    // vite.config.ts keeps copyPublicDir at its default (true).
    copyPublicDir: false,
  },
});
