// Full 30-level browser playback (finisher window).
// Serves dist-test, plays every level with its planned route (solution3
// on golden levels L11+, plain solution before), records win/stars/coins.
// Prints a JSON report to stdout (the runner captures it — do not rely
// on file writes under the EPERM wave).
// Usage: node tools-local/probe-all.mjs [port] [fromLevel] [toLevel]
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join, extname } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('/home/hatch/workspace/dana-games/ramp-physics-r2/work/node_modules/playwright-core');

const WORK = '/home/hatch/workspace/dana-games/agujero-tragon-cocina';
const DIST = join(WORK, 'dist-test');
const PORT = Number(process.argv[2] ?? 8934);
const FROM = Number(process.argv[3] ?? 1);
const TO = Number(process.argv[4] ?? 30);

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain', '.md': 'text/plain' };

const server = createServer((req, res) => {
  const p = join(DIST, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html');
  try {
    const data = readFileSync(p);
    res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function playLevel(page, n) {
  const timeLimit = 60 + Math.floor((n - 1) / 2);
  const use3 = n >= 11; // golden levels: 3-star route
  await page.evaluate((lv) => window.__game.startLevel(lv), n);
  await sleep(1000);
  await page.evaluate(() => window.__game.setTimeScale(2));
  const wps = await page.evaluate((g3) => (g3 ? window.__game.solution3() : window.__game.solution()), use3);
  const t0 = Date.now();
  let state = await page.evaluate(() => window.__game.state());
  while (Date.now() - t0 < 90000) {
    state = await page.evaluate(() => window.__game.state());
    if (!state.game || state.game.state !== 'playing') break;
    const elapsed = Math.max(0, timeLimit - (state.game.timeLeft ?? timeLimit));
    const idx = Math.min(wps.length - 1, Math.floor(elapsed / 0.25));
    const wp = wps[idx];
    if (wp) await page.evaluate((w) => window.__game.dragTo(w.x, w.y), wp);
    await sleep(80);
  }
  return state.game ?? { state: 'unknown' };
}

async function main() {
  await new Promise((r) => server.listen(PORT, r));
  const browser = await chromium.launch({
    executablePath: '/home/hatch/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-gpu', '--autoplay-policy=no-user-gesture-required'],
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('requestfailed', (r) => errors.push(`REQFAIL ${r.url()}`));
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__game, null, { timeout: 30000 });
  await sleep(1000);
  const rows = [];
  for (let n = FROM; n <= TO; n++) {
    try {
      const g = await playLevel(page, n);
      rows.push({ level: n, state: g.state, stars: g.stars ?? 0, coins: g.coins ?? 0, eaten: g.eaten ?? 0, total: g.total ?? 0, timeLeft: g.timeLeft ?? null });
      console.log(`L${n} ${g.state} stars=${g.stars} coins=${g.coins} ${g.eaten}/${g.total} timeLeft=${g.timeLeft}`);
    } catch (e) {
      rows.push({ level: n, state: 'ERROR', error: String(e).slice(0, 120) });
      console.log(`L${n} ERROR ${String(e).slice(0, 120)}`);
    }
    await sleep(500);
  }
  const wins = rows.filter((r) => r.state === 'won').length;
  const stars3 = rows.filter((r) => r.stars === 3).length;
  console.log(JSON.stringify({ wins, total: rows.length, stars3, errors: errors.slice(0, 10), rows }));
  await browser.close();
  server.close();
  process.exit(wins === rows.length && errors.length === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('PROBE_ALL CRASH', e);
  server.close();
  process.exit(1);
});
