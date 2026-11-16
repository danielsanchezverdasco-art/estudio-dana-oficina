/* Ramp Physics: Ragdoll Crash Test — ROUND 2 — smoke + probing tests (test build, dist-test).
   Runs against http://localhost:8931 (python http.server on dist-test).
   Screenshots -> /tmp/shots/. Prints a JSON summary.
   Main event: solution playback for ALL 30 levels (each level's own solution
   must win — Tetris-GDD rule: no unwinnable level ships). */
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = 'http://localhost:8931/index.html';
const SHOTS = '/tmp/shots';
fs.mkdirSync(SHOTS, { recursive: true });
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';

const results = { errors: [], failed_requests: [], checks: {}, levels: {} };
function check(name, ok, detail = '') {
  results.checks[name] = { ok: !!ok, detail: String(detail) };
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ' — ' + detail : ''));
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function state(page) {
  return page.evaluate(() => (window.__game ? window.__game.state() : null));
}
async function waitScene(page, key, timeout = 12000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const s = await state(page);
    if (s && (s.activeScenes || []).includes(key)) return s;
    await sleep(200);
  }
  return state(page);
}
async function touchDrag(page, pts, stepMs = 16) {
  const cdp = await page.context().newCDPSession(page);
  const first = pts[0];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: first.x, y: first.y, id: 1 }] });
  for (const p of pts.slice(1)) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: p.x, y: p.y, id: 1 }] });
    await sleep(stepMs);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
}

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  // DSF 1 for the logic run (r2 fix): DSF 2 quadrupled the SwiftShader
  // raster cost, starved the fixed-step physics (Runner defers updates
  // when frames are slow) and crashed the renderer on screenshots.
  // The physics is DSF-independent, so level verification is unaffected;
  // the film script keeps DSF 2 for the beauty shots.
  deviceScaleFactor: 1,
  hasTouch: true,
  isMobile: true,
  locale: 'en-US',
});
const page = await ctx.newPage();
page.on('console', (m) => {
  if (m.type() === 'error') results.errors.push(`console.error: ${m.text()}`);
});
page.on('pageerror', (e) => results.errors.push(`pageerror: ${e}`));
page.on('requestfailed', (r) => {
  const isFaviconAbort = r.failure()?.errorText === 'net::ERR_ABORTED' && /badge-[A-Za-z0-9_-]+\.png$/.test(r.url());
  if (!isFaviconAbort) results.failed_requests.push(`${r.url()} :: ${r.failure()?.errorText}`);
});

try {
  // 1. Load: menu appears, 0 console errors, 0 failed requests
  await page.goto(BASE);
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  let s = await waitScene(page, 'Menu');
  check('menu_loads', s && s.activeScenes.includes('Menu'), JSON.stringify(s?.activeScenes));
  await sleep(800);
  await page.screenshot({ path: `${SHOTS}/01-menu-en.png` });
  check('no_console_errors_after_load', results.errors.length === 0, results.errors.slice(0, 3).join(' | '));
  check('no_failed_requests_after_load', results.failed_requests.length === 0, results.failed_requests.slice(0, 3).join(' | '));

  // 2. Button touch test: PLAY center + 4 corners + outside (menu PLAY at
  // (195, 675); corners inside the 280x88 button, outside below it).
  const corners = [[195, 675], [70, 643], [320, 643], [70, 707], [320, 707]];
  for (let i = 0; i < corners.length; i++) {
    const [x, y] = corners[i];
    await page.goto(BASE);
    await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
    await waitScene(page, 'Menu');
    await page.touchscreen.tap(x, y);
    await sleep(700);
    s = await state(page);
    check(`play_corner_${i}`, s && s.activeScenes.includes('Game'), `tap (${x},${y}) -> ${s?.activeScenes}`);
  }
  await page.goto(BASE);
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  await waitScene(page, 'Menu');
  await page.touchscreen.tap(60, 480); // empty comic paper: nothing interactive there
  await sleep(500);
  s = await state(page);
  check('play_outside_noop', s && s.activeScenes.includes('Menu') && !s.activeScenes.includes('Game'), s?.activeScenes);

  // 3. Gameplay: real touch drag draws a ramp, ink is spent, undo refunds.
  await page.goto(BASE);
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  await waitScene(page, 'Menu');
  await page.touchscreen.tap(195, 675); // PLAY
  s = await waitScene(page, 'Game');
  check('game_starts', s && s.activeScenes.includes('Game'), JSON.stringify(s?.activeScenes));
  await sleep(1800);
  const before = await page.evaluate(() => window.__game.state().game);
  const dragPts = [];
  for (let x = 100; x <= 200; x += 8) dragPts.push({ x, y: 344 + ((x - 100) * 50) / 100 });
  await touchDrag(page, dragPts);
  await sleep(400);
  const after = await page.evaluate(() => window.__game.state().game);
  check('drag_draws_ramp', after.strokes === 1 && after.inkUsed > 0, `strokes=${after.strokes} inkUsed=${after.inkUsed}`);
  check('drag_spends_ink', after.inkLeft < before.inkLeft, `${before.inkLeft} -> ${after.inkLeft}`);
  await page.screenshot({ path: `${SHOTS}/02-gameplay-draw.png` });
  // UNDO button (52, 796) refunds the ink.
  await page.touchscreen.tap(52, 796);
  await sleep(400);
  const undone = await page.evaluate(() => window.__game.state().game);
  check('undo_refunds_ink', undone.strokes === 0 && undone.inkLeft === before.inkLeft, `strokes=${undone.strokes} inkLeft=${undone.inkLeft} (was ${before.inkLeft})`);
  // Ink budget enforcement: draw a huge line; ink must hit 0 and stop.
  const bigPts = [];
  for (let i = 0; i < 120; i++) bigPts.push({ x: 20 + (i % 2) * 340, y: 150 + Math.floor(i / 2) * 8 });
  await page.evaluate((pts) => window.__game.draw(pts), bigPts);
  await sleep(300);
  const capped = await page.evaluate(() => window.__game.state().game);
  check('ink_budget_enforced', capped.inkLeft === 0 && capped.inkUsed <= capped.inkBudget, `inkLeft=${capped.inkLeft} used=${capped.inkUsed} budget=${capped.inkBudget}`);

  // 4. SOLUTION PLAYBACK — all 30 levels must win with their own solution.
  // Physics time scale 2x: SwiftShader runs game time slower than wall time.
  await page.evaluate(() => window.__game.resetSave());
  let wins = 0;
  for (let n = 1; n <= 30; n++) {
    const t0 = Date.now();
    await page.evaluate((lv) => window.__game.startLevel(lv), n);
    await sleep(700);
    await page.evaluate(() => window.__game.setTimeScale(2));
    const sol = await page.evaluate(() => window.__game.solution());
    for (const stroke of sol) {
      const pts = stroke.pts.map(([x, y]) => ({ x, y }));
      await page.evaluate(([p, ink]) => window.__game.draw(p, ink), [pts, stroke.ink]);
      await sleep(150);
    }
    await page.evaluate(() => window.__game.launch());
    let outcome = 'timeout';
    let final = null;
    for (let i = 0; i < 150; i++) {
      await sleep(400);
      const st = await page.evaluate(() => window.__game.state());
      final = st?.game;
      if (!st || !st.activeScenes.includes('Game')) {
        // Scene left Game: won -> Result, or lost -> Result.
        const res = st && st.activeScenes.includes('Result');
        outcome = res ? 'result' : 'left-game';
        break;
      }
      if (final && final.state === 'won') { outcome = 'won'; break; }
      if (final && final.state === 'lost') { outcome = 'lost'; break; }
    }
    const wall = ((Date.now() - t0) / 1000).toFixed(1);
    // The save is written in finishWin, 900 ms after state 'won' — wait
    // for the Result scene before reading stars.
    if (outcome === 'won') {
      for (let i = 0; i < 25; i++) {
        await sleep(200);
        const st2 = await page.evaluate(() => window.__game.state());
        if (st2 && st2.activeScenes.includes('Result')) break;
      }
    }
    const save = await page.evaluate(() => window.__game.save());
    const stars = save.stars[String(n)] ?? 0;
    const ok = outcome === 'won' || (outcome === 'result' && stars > 0);
    if (ok) wins++;
    results.levels[n] = { outcome, stars, inkUsed: final?.inkUsed ?? null, wall_s: +wall, dummy: final?.dummy ?? null };
    console.log(`${ok ? 'PASS ' : 'FAIL '}level_${n}_solution_wins — outcome=${outcome} stars=${stars} inkUsed=${final?.inkUsed} wall=${wall}s`);
    results.checks[`level_${n}_solution_wins`] = { ok, detail: `outcome=${outcome} stars=${stars} inkUsed=${final?.inkUsed} wall=${wall}s` };
    if (n === 1 || n === 6 || n === 12 || n === 18) {
      await page.screenshot({ path: `${SHOTS}/level-${String(n).padStart(2, '0')}.png` });
    }
  }
  check('all_30_solutions_win', wins === 30, `${wins}/30 won`);

  // 5. Win -> Result -> save persists after reload.
  const saveBefore = await page.evaluate(() => window.__game.save());
  check('save_stars_recorded', Object.keys(saveBefore.stars).length >= 1, JSON.stringify(saveBefore.stars));
  check('save_unlocked_progress', saveBefore.unlocked >= 2, `unlocked=${saveBefore.unlocked}`);
  await page.reload();
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  await waitScene(page, 'Menu');
  const saveAfter = await page.evaluate(() => window.__game.save());
  check('save_persists_after_reload', saveAfter.unlocked === saveBefore.unlocked, `unlocked ${saveBefore.unlocked} -> ${saveAfter.unlocked}`);
  await page.evaluate(() => window.__game.resetSave());

  // 6. Spanish run: toggle language, start level, pause -> quit.
  await page.touchscreen.tap(346, 108); // EN/ES toggle
  await sleep(600);
  const langAfter = await page.evaluate(() => window.__game.state().lang);
  check('lang_toggle_to_es', langAfter === 'es', `lang=${langAfter}`);
  await page.screenshot({ path: `${SHOTS}/05-menu-es.png` });
  await page.touchscreen.tap(195, 675); // JUGAR
  s = await waitScene(page, 'Game');
  check('game_starts_es', s && s.activeScenes.includes('Game'), JSON.stringify(s?.activeScenes));
  await sleep(400);
  await page.screenshot({ path: `${SHOTS}/06-gameplay-es.png` });
  await page.touchscreen.tap(356, 26); // pause button
  await sleep(500);
  const paused = await page.evaluate(() => window.__game.state().game);
  check('pause_opens', paused && paused.state === 'paused', JSON.stringify(paused?.state));
  await page.screenshot({ path: `${SHOTS}/07-pause-es.png` });
  await page.touchscreen.tap(195, 572); // MENU (third button)
  await sleep(800);
  s = await state(page);
  check('pause_quit_to_menu', s && s.activeScenes.includes('Menu'), JSON.stringify(s?.activeScenes));

  // 7. Map scene: LEVELS button -> Map -> tap level 1 node -> Game.
  await page.touchscreen.tap(119, 753); // LEVELS (btnX-76, subY)
  await sleep(700);
  s = await state(page);
  check('map_opens', s && s.activeScenes.includes('Map'), JSON.stringify(s?.activeScenes));
  await page.screenshot({ path: `${SHOTS}/08-map.png` });

  // 8. Shop scene: SHOP button -> Shop.
  await page.goto(BASE);
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  await waitScene(page, 'Menu');
  await page.touchscreen.tap(271, 753); // SHOP (btnX+76, subY)
  await sleep(700);
  s = await state(page);
  check('shop_opens', s && s.activeScenes.includes('Shop'), JSON.stringify(s?.activeScenes));
  await page.screenshot({ path: `${SHOTS}/09-shop.png` });

  check('no_console_errors_total', results.errors.length === 0, results.errors.slice(0, 5).join(' | '));
  check('no_failed_requests_total', results.failed_requests.length === 0, results.failed_requests.slice(0, 5).join(' | '));
} catch (e) {
  results.errors.push(`harness: ${e}`);
  console.log('HARNESS ERROR', e);
} finally {
  await browser.close();
}

const failed = Object.values(results.checks).filter((c) => !c.ok);
console.log('\n=== SUMMARY ===');
console.log(`checks: ${Object.keys(results.checks).length}, failed: ${failed.length}`);
console.log(`console errors: ${results.errors.length}, failed requests: ${results.failed_requests.length}`);
console.log(JSON.stringify(results, null, 2));
try {
  fs.writeFileSync('/tmp/ramp-test-results.json', JSON.stringify(results, null, 2));
} catch (e) {
  // The results are already on stdout; a failed log write (EPERM wave)
  // must not crash the harness or mask the test verdict.
  console.log(`(no se pudo escribir /tmp/ramp-test-results.json: ${e.code ?? e})`);
}
process.exit(failed.length > 0 || results.errors.length > 0 ? 1 : 0);
