/* Seagull Attack — smoke + probing tests (test build, dist-test).
   Runs against http://localhost:8931 (python http.server on dist-test).
   Screenshots -> /tmp/shots/. Prints a JSON summary. */
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = 'http://localhost:8931/index.html';
const SHOTS = '/tmp/shots';
fs.mkdirSync(SHOTS, { recursive: true });
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';

const results = { errors: [], failed_requests: [], checks: {}, fps: null };
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
function arcPoints(cx, cy, r, a0, a1, n = 24) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }
  return pts;
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
  deviceScaleFactor: 2,
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
  // Ignore the favicon aborted by a navigation: the test reloads the page
  // several times; when a reload fires while the favicon is still in
  // flight, Chrome aborts it (net::ERR_ABORTED). probe12 verified the
  // file serves 200 on every load and reload — it is not a missing asset.
  const isFaviconAbort = r.failure()?.errorText === 'net::ERR_ABORTED' && /badge-[A-Za-z0-9_-]+\.png$/.test(r.url());
  if (!isFaviconAbort) results.failed_requests.push(`${r.url()} :: ${r.failure()?.errorText}`);
});

try {
  // 1. Load: menu appears, 0 console errors
  await page.goto(BASE);
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  let s = await waitScene(page, 'Menu');
  check('menu_loads', s && s.activeScenes.includes('Menu'), JSON.stringify(s?.activeScenes));
  await sleep(800);
  await page.screenshot({ path: `${SHOTS}/01-menu-en.png` });
  check('no_console_errors_after_load', results.errors.length === 0, results.errors.slice(0, 3).join(' | '));

  // 2. Button touch test: PLAY center + 4 corners + outside
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
  await page.touchscreen.tap(60, 500); // empty sand: nothing interactive there
  await sleep(500);
  s = await state(page);
  check('play_outside_noop', s && s.activeScenes.includes('Menu') && !s.activeScenes.includes('Game'), s?.activeScenes);

  // 3. Gameplay: draw an arc, check segments + ink
  await page.goto(BASE);
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  await waitScene(page, 'Menu');
  await page.touchscreen.tap(195, 675); // PLAY
  s = await waitScene(page, 'Game');
  check('game_starts', s && s.activeScenes.includes('Game'), JSON.stringify(s?.activeScenes));
  // The headless loop is slow right after boot (SwiftShader compiles the
  // first frames); let the scene settle before touching it, or the drag
  // can land while the transition is still being processed (flaky race).
  await sleep(1800);
  const before = await page.evaluate(() => window.__game.state().game);
  // Log what the Game scene input manager sees during the drag.
  await page.evaluate(() => {
    window.__taplog = [];
    const g = window.__game.game;
    const gs = g.scene.getScene('Game');
    gs.input.on('pointerdown', (p) => window.__taplog.push(['down', Math.round(p.x), Math.round(p.y)]));
    gs.input.on('pointermove', (p) => window.__taplog.push(['move', Math.round(p.x), Math.round(p.y)]));
    gs.input.on('pointerup', (p) => window.__taplog.push(['up', Math.round(p.x), Math.round(p.y)]));
  });
  // Diagnostic tap: if the scene is not taking input yet, wait and retry.
  await page.touchscreen.tap(200, 300);
  await sleep(300);
  let taplog = await page.evaluate(() => window.__taplog);
  if (!taplog.some((e) => e[0] === 'down')) {
    await sleep(1200);
    await page.evaluate(() => { window.__taplog = []; });
    await page.touchscreen.tap(200, 300);
    await sleep(300);
    taplog = await page.evaluate(() => window.__taplog);
  }
  check('scene_takes_input', taplog.some((e) => e[0] === 'down'), `events=${taplog.length}`);
  await page.evaluate(() => { window.__taplog = []; });
  await touchDrag(page, arcPoints(195, 430, 110, Math.PI * 1.15, Math.PI * 1.85));
  await sleep(300);
  taplog = await page.evaluate(() => window.__taplog);
  const after = await page.evaluate(() => window.__game.state().game);
  check('drag_events_reach_game', taplog.some((e) => e[0] === 'down') && taplog.filter((e) => e[0] === 'move').length > 5, `events=${taplog.length} downs=${taplog.filter((e) => e[0] === 'down').length} moves=${taplog.filter((e) => e[0] === 'move').length}`);
  check('draw_creates_segments', after.segments > 0, `segments=${after.segments}`);
  check('draw_spends_ink', after.inkLeft < before.inkLeft, `${before.inkLeft} -> ${after.inkLeft}`);
  check('sandwich_anchor', after.sandwich.x === 195 && after.sandwich.y === 464, JSON.stringify(after.sandwich));
  await page.screenshot({ path: `${SHOTS}/02-gameplay-line.png` });

  // 4. Bounce probe: a gull that hits the drawn line flees, crumbs stay 3.
  // Fresh level 1; spawn one gull, draw a horizontal line across its dive
  // path at y=200 (every dive crosses y=200 at x 116..274, so the line
  // 60..330 always intersects; the gull reaches it after ~2 s of GAME
  // time). Poll on game time (timeLeft), not wall time: the headless loop
  // runs game time far slower than real time.
  // (The old check required gullsActive===0 after 2.5 s — impossible: the
  // gull needs ~3.2 s just to reach a line at y=350.)
  await page.evaluate(() => window.__game.startLevel(1));
  await sleep(600);
  await page.evaluate(() => window.__game.spawnGull());
  const bounceLine = [];
  for (let x = 60; x <= 330; x += 10) bounceLine.push({ x, y: 200 });
  await page.evaluate((pts) => window.__game.draw(pts), bounceLine);
  let bounced = false;
  let crumbsOk = true;
  for (let i = 0; i < 60; i++) {
    await sleep(500);
    s = await page.evaluate(() => window.__game.state().game);
    if (!s) break;
    if (s.crumbs !== 3) { crumbsOk = false; break; }
    if (Array.isArray(s.gulls) && s.gulls.some((st) => st === 'fleeing' || st === 'stunned')) { bounced = true; break; }
    if (s.state !== 'playing' || s.timeLeft <= 6) break;
  }
  check('gull_bounces_off_line', bounced && crumbsOk, JSON.stringify(s));
  await page.screenshot({ path: `${SHOTS}/03-gameplay-bounce.png` });

  // 4b. Anti-square probe: a box around the sandwich needs ~700 px of
  // line; level-1 ink is 420 px. Drawing the box must stop at ink 0 with
  // the box left open (the trivial shape can never win).
  await page.evaluate(() => window.__game.startLevel(1));
  await sleep(600);
  const boxPts = [];
  const box = [[95, 364], [295, 364], [295, 564], [95, 564], [95, 364]];
  for (let s = 0; s < box.length - 1; s++) {
    const [x1, y1] = box[s];
    const [x2, y2] = box[s + 1];
    const steps = Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 10);
    for (let i = 0; i < steps; i++) boxPts.push({ x: x1 + ((x2 - x1) * i) / steps, y: y1 + ((y2 - y1) * i) / steps });
  }
  await page.evaluate((pts) => window.__game.draw(pts), boxPts);
  await sleep(300);
  s = await page.evaluate(() => window.__game.state().game);
  const segs = await page.evaluate(() => window.__game.segments());
  const drawnLen = Array.isArray(segs)
    ? segs.reduce((acc, sg) => acc + Math.hypot(sg.x2 - sg.x1, sg.y2 - sg.y1), 0)
    : -1;
  check('box_never_closes', s.inkLeft === 0 && drawnLen > 0 && drawnLen < 500, `inkLeft=${s.inkLeft} drawn=${Math.round(drawnLen)}px of a 800px box`);
  // slow (SwiftShader; dt capped at 0.05 s/frame), so game time runs far
  // slower than real time — poll on GAME time, not wall time: pass when
  // crumbs drop to 2, give up after 60 s real.
  await page.evaluate(() => window.__game.startLevel(1));
  await sleep(600);
  await page.evaluate(() => window.__game.spawnGull());
  let idleOk = false;
  for (let i = 0; i < 60; i++) {
    await sleep(1000);
    s = await page.evaluate(() => window.__game.state().game);
    if (!s) break;
    // Any crumb lost proves the idle policy; several gulls can steal
    // crumbs between two 1 s polls, so accept crumbs < 3, not exactly 2.
    if (s.crumbs < 3) { idleOk = true; break; }
    if (s.state !== 'playing') break;
  }
  check('idle_loses_crumb', idleOk, JSON.stringify(s));

  // 6. Win: fresh level 1 (the idle test lost a crumb), set timer low.
  await page.evaluate(() => window.__game.startLevel(1));
  await sleep(600);
  await page.evaluate(() => window.__game.setTimer(0.3));
  s = await waitScene(page, 'Result', 8000);
  check('win_reaches_result', s && s.activeScenes.includes('Result'), JSON.stringify(s?.activeScenes));
  await sleep(1200);
  await page.screenshot({ path: `${SHOTS}/04-result-win.png` });
  const saveBefore = await page.evaluate(() => window.__game.save());
  check('save_stars_level1', saveBefore.stars['1'] === 3, JSON.stringify(saveBefore.stars));
  check('save_unlocked_2', saveBefore.unlocked === 2, `unlocked=${saveBefore.unlocked}`);
  await page.reload();
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  await waitScene(page, 'Menu');
  const saveAfter = await page.evaluate(() => window.__game.save());
  check('save_persists_after_reload', saveAfter.stars['1'] === 3 && saveAfter.unlocked === 2, JSON.stringify(saveAfter.stars));
  await page.evaluate(() => window.__game.resetSave());

  // 7. Spanish run: toggle language (must switch to ES), start level, pause -> quit
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
  await page.touchscreen.tap(350, 30); // pause button
  await sleep(500);
  let paused = await page.evaluate(() => window.__game.state().game);
  check('pause_opens', paused && paused.state === 'paused', JSON.stringify(paused?.state));
  await page.screenshot({ path: `${SHOTS}/07-pause-es.png` });
  await page.touchscreen.tap(195, 551); // QUIT (third button, h/2+128)
  await sleep(1000);
  s = await state(page);
  if (!s || !s.activeScenes.includes('Menu')) {
    // Retry ONLY while the pause panel is still open: a retry fired after
    // the transition completes would land on the menu's daily button
    // (195,574) and restart a game.
    const gs2 = await page.evaluate(() => window.__game.state().game);
    if (gs2 && gs2.state === 'paused') {
      await page.touchscreen.tap(195, 551);
      await sleep(1000);
      s = await state(page);
    }
  }
  check('pause_quit_to_menu', s && s.activeScenes.includes('Menu'), JSON.stringify(s?.activeScenes));
  await page.touchscreen.tap(346, 108); // back to EN
  await sleep(400);
  const langBack = await page.evaluate(() => window.__game.state().lang);
  check('lang_toggle_back_en', langBack === 'en', `lang=${langBack}`);

  // 8. Map opens + tapping level 1 node starts the game
  await page.touchscreen.tap(119, 753); // LEVELS
  await sleep(700);
  s = await state(page);
  check('map_opens', s && s.activeScenes.includes('Map'), JSON.stringify(s?.activeScenes));
  await page.screenshot({ path: `${SHOTS}/08-map.png` });
  await page.touchscreen.tap(195, 624); // level 1 node (scrolled to current level)
  await sleep(700);
  s = await state(page);
  check('map_node_starts_level', s && s.activeScenes.includes('Game'), JSON.stringify(s?.activeScenes));
  // Quit back to menu via pause (verify each step; retry a tap ONLY while
  // its precondition still holds — a retry fired after the transition
  // completes would land on the menu's daily button at (195,574) and
  // restart a game; that was the run-3 failure).
  await sleep(1200);
  await page.evaluate(() => {
    window.__taplog = [];
    const gs = window.__game.game.scene.getScene('Game');
    gs.input.on('pointerdown', (p, over) => window.__taplog.push(['down', Math.round(p.x), Math.round(p.y), over.map((o) => o.type)]));
    gs.input.on('pointerup', (p, over) => window.__taplog.push(['up', Math.round(p.x), Math.round(p.y), over.map((o) => o.type)]));
  });
  await page.touchscreen.tap(350, 30);
  await sleep(800);
  const pauseTaplog = await page.evaluate(() => window.__taplog);
  let gstate = await page.evaluate(() => window.__game.state().game);
  if (!gstate || gstate.state !== 'paused') {
    await page.touchscreen.tap(350, 30);
    await sleep(800);
    gstate = await page.evaluate(() => window.__game.state().game);
  }
  check('map_pause_opens', gstate && gstate.state === 'paused', `state=${JSON.stringify(gstate?.state)} taplog=${JSON.stringify(pauseTaplog)}`);
  await page.touchscreen.tap(195, 551);
  await sleep(1200);
  s = await state(page);
  if (!s || !s.activeScenes.includes('Menu')) {
    gstate = await page.evaluate(() => window.__game.state().game);
    if (gstate && gstate.state === 'paused') {
      await page.touchscreen.tap(195, 551);
      await sleep(1200);
      s = await state(page);
    }
  }
  check('map_game_quit_to_menu', s && s.activeScenes.includes('Menu'), JSON.stringify(s?.activeScenes));
  // Shop opens
  await page.touchscreen.tap(271, 753); // SHOP
  await sleep(700);
  s = await state(page);
  check('shop_opens', s && s.activeScenes.includes('Shop'), JSON.stringify(s?.activeScenes));
  await page.screenshot({ path: `${SHOTS}/09-shop.png` });
  await page.touchscreen.tap(44, 44);
  await sleep(500);

  // 9. Landscape 844x390
  await page.setViewportSize({ width: 844, height: 390 });
  await page.reload();
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  s = await waitScene(page, 'Menu');
  check('landscape_menu', s && s.activeScenes.includes('Menu'), JSON.stringify(s?.activeScenes));
  await sleep(600);
  await page.screenshot({ path: `${SHOTS}/10-menu-landscape.png` });
  await page.touchscreen.tap(608, 195); // PLAY in landscape (button column x=w*0.72, y=195)
  s = await waitScene(page, 'Game');
  check('landscape_game', s && s.activeScenes.includes('Game'), JSON.stringify(s?.activeScenes));
  await sleep(600);
  await page.screenshot({ path: `${SHOTS}/11-gameplay-landscape.png` });

  // 10. Desktop 1280x720
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.reload();
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  s = await waitScene(page, 'Menu');
  check('desktop_menu', s && s.activeScenes.includes('Menu'), JSON.stringify(s?.activeScenes));
  await sleep(600);
  await page.screenshot({ path: `${SHOTS}/12-menu-desktop.png` });

  // 11. FPS: busy level 30 with several gulls. This headless Chromium uses
  // SwiftShader (software rasterization), so the visible-canvas rate mostly
  // measures the environment. The decisive number is the JS hot-loop cost
  // (manual update() calls): if that is well under the 16.7 ms frame
  // budget, the game logic is not the bottleneck.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.__game.startLevel(30));
  await sleep(500);
  for (let i = 0; i < 5; i++) await page.evaluate(() => window.__game.spawnGull());
  const fpsMeasure = () =>
    page.evaluate(
      () =>
        new Promise((res) => {
          let n = 0;
          const t0 = performance.now();
          const tick = () => {
            n++;
            if (performance.now() - t0 < 3000) requestAnimationFrame(tick);
            else res((n / (performance.now() - t0)) * 1000);
          };
          requestAnimationFrame(tick);
        }),
    );
  const fps = await fpsMeasure();
  results.fps = fps;
  // Report only: the absolute number measures SwiftShader (software
  // rasterization on 1.5 shared CPUs), not the game. The real gate is
  // update_cost_ms below; a live loop is the only assertion here.
  check('fps_busy_level_dsf2', fps > 0, `${fps.toFixed(1)} fps (SwiftShader, report only)`);
  const renderer = await page.evaluate(() => {
    const g = window.__game.game;
    return { type: g.renderer.type, webgl: !!g.renderer.gl };
  });
  results.renderer = renderer;
  // Decisive logic-cost number: time 60 manual update() calls on a busy
  // level (5 gulls + a 200-point line). 60 x 16 ms = ~1 s of game time,
  // so no gull can reach the sandwich mid-measurement. If the JS hot loop
  // is cheap, the low visible FPS is the software rasterizer, not the game.
  const updateCost = await page.evaluate(() => {
    const g = window.__game.game;
    const gs = g.scene.getScene('Game');
    const pts = [];
    for (let i = 0; i < 200; i++) pts.push({ x: 20 + i * 1.7, y: 300 + Math.sin(i * 0.25) * 30 });
    gs.testDrawLine(pts);
    const t0 = performance.now();
    for (let i = 0; i < 60; i++) gs.update(0, 16);
    return (performance.now() - t0) / 60;
  });
  results.update_cost_ms = updateCost;
  check('update_cost_ms', updateCost < 5, `${updateCost.toFixed(2)} ms/frame for the hot loop (5 gulls, 199 segments)`);

  check('no_console_errors_total', results.errors.length === 0, results.errors.slice(0, 5).join(' | '));
  check('no_failed_requests', results.failed_requests.length === 0, results.failed_requests.slice(0, 5).join(' | '));
} catch (e) {
  results.errors.push(`harness: ${e.stack || e}`);
  console.log('HARNESS ERROR', e);
}
await browser.close();
console.log('\n==== SUMMARY ====');
console.log(JSON.stringify(results, null, 2));
const failed = Object.entries(results.checks).filter(([, v]) => !v.ok).map(([k]) => k);
console.log('FAILED:', failed.length ? failed : 'none');
process.exit(failed.length ? 1 : 0);
