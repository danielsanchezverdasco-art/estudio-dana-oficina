// Bundle the game WITHOUT writing anything: vite.build() with write:false
// returns the bundle in memory, and this script prints it as base64 JSON
// on stdout. A separate plain node process (write-bundle.mjs) does the
// writing.
//
// WHY (diagnosed 16/11 07:24): merely require('vite') poisons the process
// — every subsequent write fails with EPERM, even with fresh fds, while
// plain node processes write fine to the same directory. (Vite loads
// native bindings; the sandbox then denies the process's writes.) The
// only window where bundle+write in one process worked was the minutes
// right after a VM restart (06:55). Splitting the two halves into two
// processes makes the build work at any time.
// Usage: node tools-local/bundle.mjs <outDir> [test|prod]
//   Prints ONE JSON line: [{fileName, base64}] — nothing else on stdout
//   (vite logging is silenced).
import { createRequire } from 'node:module';
import { join } from 'node:path';

const WORK = '/home/hatch/workspace/dana-games/sushi-belt-frenzy';
const require = createRequire(join(WORK, 'package.json'));
const { build } = require('vite');
const playgamaBridge = require('@playgama/bridge/vite').default;

const outDir = process.argv[2];
const isTest = process.argv[3] === 'test';
if (!outDir) { console.error('usage: node tools-local/bundle.mjs <outDir> [test|prod]'); process.exit(2); }

const result = await build({
  configFile: false,
  root: WORK,
  logLevel: 'silent',
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
const files = outputs.map((o) => {
  const data = o.type === 'chunk' ? o.code : o.source;
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  return { fileName: o.fileName, base64: buf.toString('base64') };
});
process.stdout.write(JSON.stringify(files) + '\n');
