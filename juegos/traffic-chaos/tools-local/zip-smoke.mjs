// Zip smoke check: the production zip must be shippable to Playgama.
// Usage: node tools-local/zip-smoke.mjs <zip-path>
// Checks: size <= 5 MB; contains index.html + playgama-bridge.js + the
// Bridge config; the bundle has NO window.__ handle and NO test params;
// the HTML loads the Bridge script first in <head>; no localhost URLs.
import fs from 'node:fs';

const zipPath = process.argv[2];
if (!zipPath || !fs.existsSync(zipPath)) {
  console.error('usage: node tools-local/zip-smoke.mjs <zip-path>');
  process.exit(2);
}
const buf = fs.readFileSync(zipPath);
const text = buf.toString('latin1');
let failed = 0;
function check(name, ok, detail = '') {
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ' — ' + detail : ''));
  if (!ok) failed++;
}

check('zip_size_le_5mb', buf.length <= 5 * 1024 * 1024, `${buf.length} bytes`);
check('zip_magic_pk', buf[0] === 0x50 && buf[1] === 0x4b, buf.subarray(0, 2).toString('hex'));
for (const name of ['index.html', 'playgama-bridge.js', 'playgama-bridge-config.json', 'assets/img/badge.png', 'assets/fonts/LilitaOne-400.woff2']) {
  check(`zip_contains_${name}`, text.includes(name), name);
}
check('no_window_dunder', !text.includes('window.__'), 'production bundle must not expose a test handle');
check('no_test_build_flag_true', !text.includes('__TEST_BUILD__') || !text.includes('true'), 'no test-build marker in prod');
check('no_localhost', !text.includes('localhost') && !text.includes('127.0.0.1'), 'no localhost URLs');
check('bridge_script_first_in_head', /<head>[\s\S]{0,2000}<script[^>]*playgama-bridge\.js/.test(text), 'Bridge script in <head>');
console.log(failed === 0 ? 'ZIP_SMOKE_OK' : `ZIP_SMOKE_FAIL ${failed} checks`);
process.exit(failed > 0 ? 1 : 0);
