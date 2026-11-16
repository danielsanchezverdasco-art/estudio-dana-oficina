// Build the game WITHOUT letting vite write anything: vite.build() with
// write:false returns the bundle in memory, and this script writes each
// output file with the read/writeSync retry loop that survives the sandbox
// EPERM wave (vite's own writes truncate to 0 bytes and fail).
// Adapted from the Ramp Physics r2 helper (same pattern, Robot WORK path).
// Usage: node build-retry.mjs <outDir> [test|prod]
//   test -> __TEST_BUILD__ true (keeps window.__game handle)
//   prod -> __TEST_BUILD__ false (handle tree-shaken away)
// public/ is NOT copied by this script — run copy-public-retry.mjs after.
import { createRequire } from 'node:module';
import { mkdirSync, openSync, writeSync, closeSync } from 'node:fs';
import { join, dirname } from 'node:path';

const WORK = '/home/hatch/workspace/dana-games/quien-es-el-robot/work';
const require = createRequire(join(WORK, 'package.json'));
const { build } = require('vite');
const playgamaBridge = require('@playgama/bridge/vite').default;

const outDir = process.argv[2];
const isTest = process.argv[3] === 'test';
if (!outDir) { console.error('usage: node build-retry.mjs <outDir> [test|prod]'); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const CHUNK = 65536; // 64 KB per writeSync: a failed chunk retries alone.
const DEADLINE_MS = 600000; // the EPERM wave flips in seconds; spin tightly
// (2 ms sleeps) so the writes land inside the first good second.

async function writeFileRetry(path, data) {
  const t0 = Date.now();
  const fd = openSync(path, 'w');
  try {
    let off = 0;
    while (off < data.length) {
      const len = Math.min(CHUNK, data.length - off);
      let done = false;
      while (!done) {
        try {
          const n = writeSync(fd, data, off, len);
          if (n !== len) throw new Error(`short write ${n}/${len}`);
          off += len;
          done = true;
        } catch (e) {
          if (Date.now() - t0 > DEADLINE_MS) throw e;
          await sleep(2);
        }
      }
    }
  } finally { closeSync(fd); }
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
