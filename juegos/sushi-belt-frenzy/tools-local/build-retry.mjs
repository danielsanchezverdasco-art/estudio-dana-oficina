// Build the game WITHOUT letting vite write anything: vite.build() with
// write:false returns the bundle in memory, and this script writes each
// output file with the read/writeSync retry loop that survives the sandbox
// EPERM wave (vite's own writes truncate to 0 bytes and fail).
// Usage: node tools-local/build-retry.mjs <outDir> [test|prod]
//   test -> __TEST_BUILD__ true (keeps window.__game handle)
//   prod -> __TEST_BUILD__ false (handle tree-shaken away)
// public/ is NOT copied by this script — run copy-public-retry.mjs after.
import { createRequire } from 'node:module';
import { mkdirSync, openSync, writeSync, closeSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const WORK = '/home/hatch/workspace/dana-games/sushi-belt-frenzy';
const require = createRequire(join(WORK, 'package.json'));
const { build } = require('vite');
const playgamaBridge = require('@playgama/bridge/vite').default;

const outDir = process.argv[2];
const isTest = process.argv[3] === 'test';
if (!outDir) { console.error('usage: node tools-local/build-retry.mjs <outDir> [test|prod]'); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CHUNK = 65536; // 64 KB per writeSync: a failed chunk retries alone.
const DEADLINE_MS = 600000; // the EPERM wave flips in seconds; spin tightly
// (2 ms sleeps) so the writes land inside the first good second.

async function writeFileRetry(path, data) {
  const t0 = Date.now();
  // Truncate once (best effort — the chunk loop creates the file if needed).
  try { const fd0 = openSync(path, 'w'); closeSync(fd0); } catch { /* retry below */ }
  // Write chunk by chunk, each chunk with a FRESH fd in append mode.
  // LESSON (16/11): a fd opened while the EPERM gate is closed stays
  // denied even after the gate reopens — the old held-fd loop spun for
  // 9+ minutes writing 0 bytes while fresh shell/node processes wrote
  // fine to the same directory. A fresh open per chunk mirrors the
  // pattern that works. After any failure, resync the offset to the real
  // file size (a short write lands a correct prefix).
  let off = 0;
  while (off < data.length) {
    const len = Math.min(CHUNK, data.length - off);
    try {
      const fd = openSync(path, 'a');
      try {
        const n = writeSync(fd, data, off, len);
        if (n !== len) throw new Error(`short write ${n}/${len}`);
      } finally { closeSync(fd); }
      off += len;
    } catch (e) {
      if (Date.now() - t0 > DEADLINE_MS) throw e;
      try { off = statSync(path).size; } catch { off = 0; }
      await sleep(20);
    }
  }
}

const result = await build({
  configFile: false,
  root: WORK,
  logLevel: 'info',
  base: './',
  define: { __TEST_BUILD__: JSON.stringify(isTest) },
  plugins: [playgamaBridge({ mode: 'local' })],
  build: {
    outDir,
    emptyOutDir: false,
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    copyPublicDir: false,
    write: false,
  },
});

const outputs = Array.isArray(result) ? result.flatMap((r) => r.output) : result.output;
for (const o of outputs) {
  const target = join(outDir, o.fileName);
  mkdirSync(dirname(target), { recursive: true });
  const data = o.type === 'chunk' ? o.code : o.source;
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  await writeFileRetry(target, buf);
  console.log('wrote', target, buf.length, 'bytes');
}
console.log('BUILD_RETRY_OK', outputs.length, 'files');
