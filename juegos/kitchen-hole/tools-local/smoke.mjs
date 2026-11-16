// Browser smoke for Kitchen Hole (test build, dist-test).
// Serves dist-test on :8932, loads it in Chromium, checks the menu,
// plays level 1 via the planned route, spot-checks the pet (L6),
// golden (L11) and fridge (L21) levels, takes screenshots.
// Usage: node tools-local/smoke.mjs [port]
// Screenshots: tools-local/shots/ (falls back to /tmp on EPERM).
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('/home/hatch/workspace/dana-games/ramp-physics-r2/work/node_modules/playwright-core');

const WORK = '/home/hatch/workspace/dana-games/agujero-tragon-cocina';
const DIST = join(WORK, 'dist-test');
const PORT = Number(process.argv[2] ?? 8932);
const SHOTS = join(WORK, 'tools-local', 'shots');

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

async function shot(page, name) {
  try {
    mkdirSync(SHOTS, { recursive: true });
    await page.screenshot({ path: join(SHOTS, name) });
    console.log('shot', name);
  } catch (e) {
    console.log('shot FAILED', name, String(e).slice(0, 80));
  }
}

async function playLevel(page, n, opts = {}) {
  const { timeScale = 2, maxMs = 90000 } = opts;
  const timeLimit = 60 + Math.floor((n - 1) / 2);
  await page.evaluate((lv) => window.__game.startLevel(lv), n);
  await sleep(1200);
  await page.evaluate((s) => window.__game.setTimeScale(s), timeScale);
  const wps = await page.evaluate(() => window.__game.solution());
  const t0 = Date.now();
  let state = await page.evaluate(() => window.__game.state());
  // Replay indexed by SIM time: the waypoint for sim-second s is
  // wps[floor(s / 0.25)]. Robust to slow evaluates under SwiftShader —
  // the target always matches where the sim is, not the wall clock.
  while (Date.now() - t0 < maxMs) {
    state = await page.evaluate(() => window.__game.state());
    if (!state.game || state.game.state !== 'playing') break;
    const elapsed = Math.max(0, timeLimit - (state.game.timeLeft ?? timeLimit));
    const idx = Math.min(wps.length - 1, Math.floor(elapsed / 0.25));
    const wp = wps[idx];
    if (wp) await page.evaluate((w) => window.__game.dragTo(w.x, w.y), wp);
    await sleep(80);
  }
  return state;
}

async function main() {
  await new Promise((r) => server.listen(PORT, r));
  console.log('serving', DIST, 'on', PORT);
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
  try {
    await page.waitForFunction(() => window.__game, null, { timeout: 30000 });
  } catch {
    console.log('SMOKE FAIL: window.__game never appeared');
    console.log('errors:', errors.slice(0, 10));
    await browser.close();
    server.close();
    process.exit(1);
  }
  console.log('handle alive');
  await sleep(1500);
  const menuState = await page.evaluate(() => window.__game.state());
  console.log('menu scenes:', JSON.stringify(menuState.activeScenes), 'lang:', menuState.lang);
  await shot(page, 'menu.png');

  // Map scene check (via menu navigation is slower; use direct start).
  const results = {};
  for (const n of [1, 6, 11, 21]) {
    const st = await playLevel(page, n);
    const g = st.game ?? {};
    results[n] = { state: g.state, stars: g.stars, coins: g.coins, eaten: g.eaten, total: g.total, timeLeft: g.timeLeft };
    console.log(`L${n}:`, JSON.stringify(results[n]));
    if (n === 1) await shot(page, 'game-l1.png');
    if (n === 21) await shot(page, 'game-l21.png');
    await sleep(800);
    // Result scene should be active after a win/lose.
    const after = await page.evaluate(() => window.__game.state());
    console.log(`  after L${n}:`, JSON.stringify(after.activeScenes));
    if (n === 1) await shot(page, 'result-l1.png');
  }

  const won = Object.values(results).filter((r) => r.state === 'won').length;
  console.log(`SMOKE: ${won}/4 levels won in-browser`);
  console.log('console errors:', errors.length ? errors.slice(0, 10) : 'none');
  await browser.close();
  server.close();
  process.exit(won === 4 && errors.length === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('SMOKE CRASH', e);
  server.close();
  process.exit(1);
});
