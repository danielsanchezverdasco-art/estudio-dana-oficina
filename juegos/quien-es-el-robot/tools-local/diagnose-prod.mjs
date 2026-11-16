// In-memory production build check (no disk writes): verifies the prod bundle
// that will go into the zip — Bridge first script in <head>, no window.__,
// total size. Prints diagnostics only.
// Adapted from the Ramp Physics r2 helper (same pattern, Robot WORK path).
import { createRequire } from 'node:module';
import { join } from 'node:path';

const WORK = '/home/hatch/workspace/dana-games/quien-es-el-robot/work';
const require = createRequire(join(WORK, 'package.json'));
const { build } = require('vite');
const playgamaBridge = require('@playgama/bridge/vite').default;

const result = await build({
  configFile: false,
  root: WORK,
  logLevel: 'silent',
  base: './',
  define: { __TEST_BUILD__: JSON.stringify(false) },
  plugins: [playgamaBridge({ mode: 'local' })],
  build: {
    outDir: 'dist-prod-check',
    emptyOutDir: false,
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    copyPublicDir: false,
    write: false,
  },
});

const outputs = Array.isArray(result) ? result.flatMap((r) => r.output) : result.output;
let total = 0;
for (const o of outputs) {
  const data = o.type === 'chunk' ? o.code : o.source;
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  total += buf.length;
  console.log('output:', o.fileName, buf.length, 'bytes');
}
console.log('TOTAL_BUNDLE_BYTES:', total, '(limite zip 5 MB = 5242880)');
const html = outputs.find((o) => o.fileName === 'index.html');
const htmlText = html ? (Buffer.isBuffer(html.source) ? html.source.toString() : html.source) : '';
const headMatch = htmlText.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
const head = headMatch ? headMatch[1] : '';
const scripts = [...head.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/g)].map((m) => m[1]);
console.log('HEAD_SCRIPTS_ORDER:', JSON.stringify(scripts));
console.log('BRIDGE_FIRST:', scripts[0] && scripts[0].includes('playgama-bridge') ? 'SI' : 'NO');
const js = outputs.find((o) => o.fileName.endsWith('.js') && o.type === 'chunk');
const jsText = js ? js.code : '';
console.log('JS_HAS_window.__:', /window\.__/.test(jsText) ? 'SI (MAL)' : 'NO (bien)');
console.log('JS_HAS___TEST_BUILD__:', /__TEST_BUILD__/.test(jsText) ? 'SI' : 'NO');
console.log('JS_HAS_testhandle:', /testhandle|__game/.test(jsText) ? 'SI (MAL)' : 'NO (bien)');
console.log('HTML_HAS_window.__:', /window\.__/.test(htmlText) ? 'SI (MAL)' : 'NO (bien)');
console.log('DIAG_PROD_OK');
