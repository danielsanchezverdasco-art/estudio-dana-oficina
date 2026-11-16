// Copy public/ -> <outDir>/ with the retry loop that survives the sandbox
// EPERM wave (copyFileSync fails persistently; read + writeSync retries work).
// Usage: node tools-local/copy-public-retry.mjs <srcDir> <dstDir>
import { readdirSync, statSync, mkdirSync, readFileSync, openSync, writeSync, closeSync } from 'node:fs';
import { join } from 'node:path';

const [src, dst] = process.argv.slice(2);
if (!src || !dst) { console.error('usage: node tools-local/copy-public-retry.mjs <src> <dst>'); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DEADLINE_MS = 600000; // same EPERM-wave spinning as build-retry.mjs

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

async function copyDir(s, d) {
  mkdirSync(d, { recursive: true });
  for (const name of readdirSync(s)) {
    const sp = join(s, name), dp = join(d, name);
    if (statSync(sp).isDirectory()) await copyDir(sp, dp);
    else {
      const data = readFileSync(sp);
      await writeFileRetry(dp, data);
      console.log('copied', dp, data.length, 'bytes');
    }
  }
}

await copyDir(src, dst);
console.log('COPY_PUBLIC_OK');
