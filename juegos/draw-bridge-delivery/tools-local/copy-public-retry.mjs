// Copy public/ -> <outDir>/ with the retry loop that survives the sandbox
// EPERM wave (copyFileSync fails persistently; read + writeSync retries work).
// Usage: node copy-public-retry.mjs <srcDir> <dstDir>
import { readdirSync, statSync, mkdirSync, readFileSync, openSync, writeSync, closeSync } from 'node:fs';
import { join, dirname } from 'node:path';

const [src, dst] = process.argv.slice(2);
if (!src || !dst) { console.error('usage: node copy-public-retry.mjs <src> <dst>'); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DEADLINE_MS = 600000; // same EPERM-wave spinning as build-retry.mjs

async function writeFileRetry(path, data) {
  const t0 = Date.now();
  const fd = openSync(path, 'w');
  try {
    let off = 0;
    while (off < data.length) {
      const len = Math.min(65536, data.length - off);
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
