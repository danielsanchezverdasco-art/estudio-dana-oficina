// Build the PRODUCTION zip entirely in memory (no disk writes): vite.build
// with write:false, read public/ from disk, zip with zlib, emit raw zip
// bytes on stdout (binary). Diagnostics (file list, sizes) go to stderr.
// Usage: node build-zip-memory.mjs | python3 upload-zip-stdin.py <branch> "<msg>" <repo_path>
import { createRequire } from 'node:module';
import { join, relative } from 'node:path';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { deflateRawSync } from 'node:zlib';

const WORK = '/home/hatch/workspace/dana-games/draw-bridge-delivery/work';
const require = createRequire(join(WORK, 'package.json'));
const { build } = require('vite');
const playgamaBridge = require('@playgama/bridge/vite').default;

// ---- CRC32 (table-based) ----
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// ---- minimal ZIP writer (deflate for text/code, store for png/woff2) ----
function buildZip(files) {
  // files: [{name, data: Buffer}]
  const chunks = [];
  const central = [];
  let offset = 0;
  const now = new Date();
  const dosTime = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff;
  const dosDate = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;
  for (const f of files) {
    const nameBuf = Buffer.from(f.name, 'utf8');
    const alreadyCompressed = /\.(png|woff2|jpg|jpeg|webp)$/i.test(f.name);
    const method = alreadyCompressed ? 0 : 8;
    const comp = method === 8 ? deflateRawSync(f.data, { level: 6 }) : f.data;
    const crc = crc32(f.data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 filenames
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(comp.length, 18);
    local.writeUInt32LE(f.data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    chunks.push(local, nameBuf, comp);
    const cent = Buffer.alloc(46);
    cent.writeUInt32LE(0x02014b50, 0);
    cent.writeUInt16LE(20, 4); // version made by
    cent.writeUInt16LE(20, 6); // version needed
    cent.writeUInt16LE(0x0800, 8);
    cent.writeUInt16LE(method, 10);
    cent.writeUInt16LE(dosTime, 12);
    cent.writeUInt16LE(dosDate, 14);
    cent.writeUInt32LE(crc, 16);
    cent.writeUInt32LE(comp.length, 20);
    cent.writeUInt32LE(f.data.length, 24);
    cent.writeUInt16LE(nameBuf.length, 28);
    cent.writeUInt16LE(0, 30); // extra len
    cent.writeUInt16LE(0, 32); // comment len
    cent.writeUInt16LE(0, 34); // disk
    cent.writeUInt16LE(0, 36); // internal attrs
    cent.writeUInt32LE(0, 38); // external attrs
    cent.writeUInt32LE(offset, 42);
    central.push(cent, nameBuf);
    offset += local.length + nameBuf.length + comp.length;
    console.error(`zip entry: ${f.name} ${f.data.length} -> ${comp.length} bytes (method ${method})`);
  }
  const centralStart = offset;
  let centralSize = 0;
  for (const c of central) centralSize += c.length;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralSize, 12);
  eocd.writeUInt32LE(centralStart, 16);
  eocd.writeUInt16LE(0, 20);
  return Buffer.concat([...chunks, ...central, eocd]);
}

function readDirRecursive(dir, base) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...readDirRecursive(p, base));
    else out.push({ name: relative(base, p).split('/').join('/'), data: readFileSync(p) });
  }
  return out;
}

const result = await build({
  configFile: false,
  root: WORK,
  logLevel: 'silent',
  base: './',
  define: { __TEST_BUILD__: JSON.stringify(false) },
  plugins: [playgamaBridge({ mode: 'local' })],
  build: {
    outDir: 'dist-zip-mem',
    emptyOutDir: false,
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    copyPublicDir: false,
    write: false,
  },
});

const outputs = Array.isArray(result) ? result.flatMap((r) => r.output) : result.output;
const files = [];
for (const o of outputs) {
  const data = o.type === 'chunk' ? o.code : o.source;
  files.push({ name: o.fileName, data: Buffer.isBuffer(data) ? data : Buffer.from(data) });
}
// public/ at its relative paths (fonts, img, licenses, bridge config)
files.push(...readDirRecursive(join(WORK, 'public'), join(WORK, 'public')));

const zip = buildZip(files);
console.error(`ZIP_TOTAL: ${zip.length} bytes, ${files.length} files`);
process.stdout.write(zip);
