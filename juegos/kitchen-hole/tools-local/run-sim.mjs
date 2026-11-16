// Bundle-and-run helper: rolldown (from the r2 work dir's node_modules)
// bundles a .ts entry IN MEMORY (no output files) and imports it from a
// data: URL — no file is written, so it works during the sandbox EPERM
// wave. Usage: node tools-local/run-sim.mjs <entry.ts> [exportedFn]
//   node tools-local/run-sim.mjs tools-local/sim.ts main
//   node tools-local/run-sim.mjs tests/rules.test.ts runTests
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { rolldown } = require('/home/hatch/workspace/dana-games/ramp-physics-r2/work/node_modules/rolldown');

const entry = process.argv[2];
const fnName = process.argv[3] ?? 'main';
if (!entry) {
  console.error('usage: node run-sim.mjs <entry.ts> [exportedFn]');
  process.exit(2);
}
const bundle = await rolldown({ input: entry, logLevel: 'silent' });
const { output } = await bundle.generate({ format: 'esm' });
const code = output[0].code;
const mod = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const fn = mod[fnName];
if (typeof fn !== 'function') {
  console.error(`entry ${entry} exports no function ${fnName}`);
  process.exit(2);
}
const rc = await fn();
process.exit(typeof rc === 'number' ? rc : 0);
