// Diagnostic 2: run the SAME vite.build() as build-retry.mjs (with the
// Playgama bridge plugin), then attempt the same fresh-fd write loop,
// LOGGING the exact error of every failed chunk.
import { createRequire } from 'node:module';
import { mkdirSync, openSync, writeSync, closeSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const WORK = '/home/hatch/workspace/dana-games/sushi-belt-frenzy';
const require = createRequire(join(WORK, 'package.json'));
const { build } = require('vite');
const playgamaBridge = require('@playgama/bridge/vite').default;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const result = await build({
  configFile: false,
  root: WORK,
  logLevel: 'info',
  base: './',
  define: { __TEST_BUILD__: JSON.stringify(false) },
  plugins: [playgamaBridge({ mode: 'local' })],
  build: { outDir: 'dist', emptyOutDir: false, sourcemap: false, chunkSizeWarningLimit: 600, copyPublicDir: false, write: false },
});
console.log('VITE DONE');
const outputs = Array.isArray(result) ? result.flatMap((r) => r.output) : result.output;
const o = outputs[0];
const target = join('dist', o.fileName);
mkdirSync(dirname(target), { recursive: true });
const data = Buffer.isBuffer(o.code) ? o.code : Buffer.from(o.code);
console.log('TARGET', target, 'bytes', data.length);
try { const fd0 = openSync(target, 'w'); closeSync(fd0); } catch (e) { console.log('truncate fail', e.code); }
let off = 0;
const t0 = Date.now();
let attempts = 0;
while (off < data.length && Date.now() - t0 < 30000) {
  attempts++;
  const len = Math.min(65536, data.length - off);
  try {
    const fd = openSync(target, 'a');
    try {
      const n = writeSync(fd, data, off, len);
      if (n !== len) throw new Error(`short ${n}/${len}`);
    } finally { closeSync(fd); }
    off += len;
    console.log(`+${((Date.now() - t0) / 1000).toFixed(1)}s chunk OK off=${off}`);
  } catch (e) {
    console.log(`+${((Date.now() - t0) / 1000).toFixed(1)}s chunk FAIL code=${e.code} errno=${e.errno} syscall=${e.syscall} msg=${e.message}`);
    try { off = statSync(target).size; } catch { off = 0; }
    await sleep(2000);
  }
}
console.log(`DIAG2 DONE attempts=${attempts} off=${off}`);
