// Write a bundle JSON (from bundle.mjs) to disk. Plain node:fs only —
// this process must NEVER load vite (see bundle.mjs: loading vite
// poisons the process's writes with EPERM).
// Usage: node tools-local/bundle.mjs <outDir> [test|prod] | node tools-local/write-bundle.mjs <outDir> [timeoutMs]
// Reads ONE JSON line from stdin: [{fileName, base64}].
// timeoutMs (default 600000): give up after this long — the caller
// should retry with a FRESH process, because a process whose writes
// fail never recovers even when the gate reopens (diagnosed 16/11:
// fresh short-lived processes write fine while long spinners write
// 0 bytes for 10 minutes).
import { mkdirSync, openSync, writeSync, closeSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const outDir = process.argv[2];
const DEADLINE_MS = Number(process.argv[3] || 600000);
if (!outDir) { console.error('usage: node tools-local/write-bundle.mjs <outDir> [timeoutMs]'); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let input = '';
for await (const chunk of process.stdin) input += chunk;
const files = JSON.parse(input);

async function writeFileRetry(path, data) {
  const t0 = Date.now();
  try { const fd0 = openSync(path, 'w'); closeSync(fd0); } catch { /* retry below */ }
  let off = 0;
  while (off < data.length) {
    const len = Math.min(65536, data.length - off);
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

for (const f of files) {
  const target = join(outDir, f.fileName);
  mkdirSync(dirname(target), { recursive: true });
  const buf = Buffer.from(f.base64, 'base64');
  await writeFileRetry(target, buf);
  console.log('wrote', target, buf.length, 'bytes');
}
console.log('WRITE_BUNDLE_OK', files.length, 'files');
