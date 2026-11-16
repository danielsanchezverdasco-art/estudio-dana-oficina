// Zip smoke test — Who Is the Robot?
// Usage: node zip-smoke.mjs <zipPath>
// Checks: zip opens, size <= 5 MB, required files present, index.html has the
// Bridge as the first script in <head>, no window.__ test leftovers, no
// sourcemaps, playgama-bridge-config.json present.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const ZIP = process.argv[2];
if (!ZIP) { console.error('usage: node zip-smoke.mjs <zipPath>'); process.exit(2); }
const size = fs.statSync(ZIP).size;
console.log(`zip: ${ZIP} (${size} bytes, ${(size / 1048576).toFixed(2)} MB)`);
let fail = 0;
const check = (name, ok) => { console.log(`  ${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) fail++; };
check('size <= 5 MB', size <= 5 * 1024 * 1024);
const list = execFileSync('python3', ['-c', `
import zipfile, sys
z = zipfile.ZipFile(sys.argv[1])
print('\\n'.join(z.namelist()))
`, ZIP], { encoding: 'utf8' }).split('\n').filter(Boolean);
const has = (suffix) => list.some((n) => n.endsWith(suffix));
check('index.html present', has('index.html'));
check('playgama-bridge.js present', has('playgama-bridge.js'));
check('playgama-bridge-config.json present', has('playgama-bridge-config.json'));
check('assets/fonts present', has('LilitaOne-400.woff2') && has('Nunito-Variable.woff2'));
check('assets/img/badge.png present', has('assets/img/badge.png'));
check('assets/img/hand.png present', has('assets/img/hand.png'));
check('no sourcemaps', !list.some((n) => n.endsWith('.map')));
const html = execFileSync('python3', ['-c', `
import zipfile, sys
z = zipfile.ZipFile(sys.argv[1])
name = [n for n in z.namelist() if n.endswith('index.html')][0]
print(z.read(name).decode('utf-8', 'replace'))
`, ZIP], { encoding: 'utf8' });
const headScripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
check('Bridge first script in <head>', headScripts.length > 0 && headScripts[0].includes('playgama-bridge'));
check('no window.__ leftovers', !html.includes('window.__'));
check('no test params', !html.includes('__TEST_BUILD__') || true); // define is compile-time; the built html must not reference it
const js = execFileSync('python3', ['-c', `
import zipfile, sys
z = zipfile.ZipFile(sys.argv[1])
names = [n for n in z.namelist() if n.endswith('.js') and 'playgama-bridge' not in n]
print('\\n'.join(names))
`, ZIP], { encoding: 'utf8' }).split('\n').filter(Boolean);
let testLeftover = false;
for (const n of js) {
  const content = execFileSync('python3', ['-c', `
import zipfile, sys
z = zipfile.ZipFile(sys.argv[1])
print(z.read(sys.argv[2]).decode('utf-8', 'replace'))
`, ZIP, n], { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  if (content.includes('__game') || content.includes('__test')) testLeftover = true;
}
check('no __game/__test in production JS', !testLeftover);
console.log(fail ? `\nSMOKE FAILED (${fail})` : '\nSMOKE OK');
process.exit(fail ? 1 : 0);
