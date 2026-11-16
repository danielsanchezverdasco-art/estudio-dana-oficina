// Diagnostic: does a long-lived node process lose write ability over time?
// Mimics build-retry.mjs's write loop (fresh fd per chunk) WITHOUT vite.
// Logs every attempt with timestamp + error code for 60 s.
import { openSync, writeSync, closeSync, statSync } from 'node:fs';

const TARGET = '/home/hatch/workspace/dana-games/sushi-belt-frenzy/dist/assets/diag.bin';
const data = Buffer.alloc(1254858, 65);
const CHUNK = 65536;
const t0 = Date.now();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try { const fd0 = openSync(TARGET, 'w'); closeSync(fd0); } catch (e) { console.log('truncate fail', e.code); }
let off = 0;
let attempts = 0;
while (off < data.length && Date.now() - t0 < 60000) {
  attempts++;
  const len = Math.min(CHUNK, data.length - off);
  try {
    const fd = openSync(TARGET, 'a');
    try {
      const n = writeSync(fd, data, off, len);
      if (n !== len) throw new Error(`short ${n}/${len}`);
    } finally { closeSync(fd); }
    off += len;
    console.log(`+${((Date.now() - t0) / 1000).toFixed(1)}s chunk OK off=${off}`);
  } catch (e) {
    console.log(`+${((Date.now() - t0) / 1000).toFixed(1)}s chunk FAIL code=${e.code} msg=${e.message} off=${off}`);
    try { off = statSync(TARGET).size; } catch { off = 0; }
    await sleep(2000);
  }
}
console.log(`DIAG DONE attempts=${attempts} off=${off} total=${data.length} size=${(() => { try { return statSync(TARGET).size; } catch { return -1; } })()}`);
