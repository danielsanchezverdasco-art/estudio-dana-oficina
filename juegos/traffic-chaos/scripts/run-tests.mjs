// Compile the node:test suites + the engine-free rules to CommonJS with tsc
// (from the shared tree) and run them under plain node. No test-runner
// install needed; works offline. The suites only touch the engine-free
// subgraph (config, rules/, sim/, levels.ts) — no Phaser import.
// EPERM-tolerant: the compile step retries (the sandbox blocks exec writes
// intermittently and can truncate the target — retry the whole unit).
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, '.build-tests');
const entry = resolve(outDir, 'test/entry.js');
const tsc = resolve(root, 'node_modules/.bin/tsc');

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  return r.status ?? 1;
}

if (!existsSync(tsc)) {
  console.error(`tsc not found at ${tsc} — node_modules symlink broken?`);
  process.exit(1);
}

let ok = false;
for (let attempt = 1; attempt <= 60; attempt++) {
  const code = run(tsc, [
    '--ignoreConfig',
    resolve(root, 'test/entry.ts'),
    resolve(root, 'src/config.ts'),
    resolve(root, 'src/rules/traffic.ts'),
    resolve(root, 'src/rules/tutorial.ts'),
    resolve(root, 'src/sim/policies.ts'),
    resolve(root, 'src/levels.ts'),
    '--module',
    'commonjs',
    '--target',
    'es2020',
    '--moduleResolution',
    'bundler',
    '--types',
    'node',
    '--esModuleInterop',
    '--skipLibCheck',
    '--strict',
    '--outDir',
    outDir,
  ]);
  if (code === 0 && existsSync(entry)) {
    ok = true;
    break;
  }
  console.error(`[run-tests] compile attempt ${attempt} failed (exit ${code}) — retrying in 30 s…`);
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 30000);
}
if (!ok) {
  console.error('[run-tests] compile failed after 60 attempts — EPERM gate closed?');
  process.exit(1);
}
process.exit(run('node', ['--test', entry]));
