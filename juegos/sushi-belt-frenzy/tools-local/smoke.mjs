// Sushi Belt Frenzy — Playwright smoke probe (dist-test, __game handle).
// Serves dist-test on localhost, loads the game, asserts the core loop
// (tap-serve +30, wrong cat -1 heart, win L1 by perfect taps, wasabi stun),
// screenshots menu / gameplay / result. Chromium lives only ~minutes after
// a VM restart — this probe must run fast and log everything to stdout.
//
// LESSON (run 1, 16/11): headless Chromium throttles rAF/timers on a
// backgrounded page, so the game clock ran ~8x slower than wall time and
// the L1-win check timed out. Fixed with disable-backgrounding flags +
// an IN-PAGE driver (setInterval on the page itself) instead of
// Node-side polling. Checks poll until the event actually registers —
// a check that passes on the initial state is vacuous (the first run's
// "wasabi stun" passed without the wasabi ever being served).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist-test');
const SHOTS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'entregas', 'assets', 'shots');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.txt': 'text/plain', '.md': 'text/markdown' };

const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html');
  const f = fs.existsSync(p) && fs.statSync(p).isDirectory() ? path.join(p, 'index.html') : p;
  if (!fs.existsSync(f)) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
console.log('SERVER port', port);

const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log((ok ? 'PASS' : 'FAIL') + ' ' + name + (detail ? ' — ' + detail : '')); };

let browser;
try {
  browser = await chromium.launch({
    executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--run-all-compositor-stages-before-draw'],
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.bringToFront();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForFunction(() => window.__game && window.__game.version === 'sushi-belt-test-1', null, { timeout: 30000 });
  check('handle alive', true, 'sushi-belt-test-1');
  await page.waitForTimeout(1500);
  const st0 = await page.evaluate(() => window.__game.state());
  check('menu active', (st0.activeScenes || []).includes('Menu'), JSON.stringify(st0.activeScenes));
  fs.mkdirSync(SHOTS, { recursive: true });
  await page.screenshot({ path: path.join(SHOTS, '01-menu.png') });

  // ---- L1: wrong-cat first (poll until the heart actually drops). ----
  await page.evaluate(() => window.__game.startLevel(1));
  await page.waitForTimeout(500);
  const sched = await page.evaluate(() => window.__game.schedule());
  check('L1 schedule', Array.isArray(sched) && sched.length > 0, 'plates=' + (sched?.length ?? 0));
  const first = sched.find((p) => p.kind !== 'wasabi');
  const wrongCat = (first.color + 1) % 3;
  let stW = null;
  for (let i = 0; i < 60; i++) {
    stW = await page.evaluate(([id, cat]) => { window.__game.serve(id, cat); return window.__game.state().game; }, [first.id, wrongCat]);
    if (stW.hearts === 2) break;
    await page.waitForTimeout(300);
  }
  check('wrong cat -1 heart', stW.hearts === 2 && stW.combo === 0, JSON.stringify({ hearts: stW.hearts, combo: stW.combo, score: stW.score }));

  // ---- Tap-serve: poll until a correct tap actually scores. ----
  const second = sched.find((p) => p.kind !== 'wasabi' && p.id !== first.id);
  let stT = null;
  for (let i = 0; i < 60; i++) {
    stT = await page.evaluate((id) => { window.__game.tap(id); return window.__game.state().game; }, second.id);
    if (stT.served >= 1) break;
    await page.waitForTimeout(300);
  }
  check('tap-serve +30', stT.score === 30 && stT.served === 1, JSON.stringify({ score: stT.score, served: stT.served }));
  await page.screenshot({ path: path.join(SHOTS, '02-game-l1.png') });

  // ---- Win L1 with the in-page driver (taps every plate, 100 ms). ----
  await page.evaluate(() => {
    window.__driver = setInterval(() => {
      const sch = window.__game.schedule();
      for (const p of sch) window.__game.tap(p.id);
    }, 100);
  });
  let st3 = null;
  for (let i = 0; i < 120; i++) {
    st3 = await page.evaluate(() => window.__game.state().game);
    if (st3.outcome !== 'playing') break;
    await page.waitForTimeout(500);
  }
  await page.evaluate(() => clearInterval(window.__driver));
  check('L1 won by perfect taps', st3.outcome === 'won', JSON.stringify({ outcome: st3.outcome, score: st3.score, served: st3.served, hearts: st3.hearts }));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SHOTS, '03-result-l1.png') });

  // ---- L6 wasabi, with DETERMINISTIC stepping (no rAF dependence). ----
  // Headless Chromium throttles rAF and the update loop caps dt at 50 ms,
  // so wall-time polling could not verify L6 (smoke run 2: plates spawned
  // but taps never landed in 45 s). __game.step(dt) advances the sim
  // directly; the wasabi stun is asserted on the exposed stun timers.
  await page.evaluate(() => window.__game.startLevel(6));
  await page.waitForTimeout(500);
  const sched6 = await page.evaluate(() => window.__game.schedule());
  const wasabi = sched6.find((p) => p.kind === 'wasabi');
  check('L6 has wasabi', !!wasabi, 'wasabi=' + JSON.stringify(wasabi));
  if (wasabi) {
    const normal6 = sched6.find((p) => p.kind !== 'wasabi');
    // Step until the first normal plate is on the belt, then tap it.
    let st6 = null;
    for (let i = 0; i < 40; i++) {
      st6 = await page.evaluate((id) => { window.__game.step(0.25); window.__game.tap(id); return window.__game.state().game; }, normal6.id);
      if (st6.served >= 1) break;
    }
    check('L6 normal serve first', st6.score === 30 && st6.combo === 1, JSON.stringify({ score: st6.score, combo: st6.combo, simTime: st6.simTime }));
    // Step until the wasabi plate is on the belt, then serve it to cat 0.
    let st6w = null;
    let wasabiLanded = false;
    for (let i = 0; i < 40; i++) {
      st6w = await page.evaluate((id) => { window.__game.step(0.25); window.__game.serve(id, 0); return window.__game.state().game; }, wasabi.id);
      if (Array.isArray(st6w.stunned) && st6w.stunned[0] > 0) { wasabiLanded = true; break; }
    }
    check('wasabi serve = stun (cat 0 stunned, no heart, no points)', wasabiLanded && st6w.hearts === 3 && st6w.score === 30, JSON.stringify({ hearts: st6w.hearts, score: st6w.score, stunned: st6w.stunned }));
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SHOTS, '04-game-l6-wasabi.png') });
  }
  check('no console/page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
  const failed = results.filter((r) => !r.ok);
  console.log('SMOKE ' + (failed.length === 0 ? 'PASS' : 'FAIL') + ' ' + (results.length - failed.length) + '/' + results.length);
  if (failed.length) process.exitCode = 1;
} catch (e) {
  console.log('SMOKE ERROR ' + (e && e.message));
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.close();
}
