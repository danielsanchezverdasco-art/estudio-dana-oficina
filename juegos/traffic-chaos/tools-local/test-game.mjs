/* Traffic Chaos: New York Rush — ROUND 1 — smoke + probing tests (test build, dist-test).
   Runs against http://localhost:8931 (python http.server on dist-test).
   Screenshots -> /tmp/shots-tc/. Prints a JSON summary.
   Main event: a full level played in the browser by a greedy auto-player
   (the same longest-queue / most-urgent-patience rule as the headless
   greedy-human policy) — the level must end won or over, never hang.
   Usage: LEVEL=1 node tools-local/test-game.mjs   (smoke + level 1 full play)
          LEVEL=5 node tools-local/test-game.mjs   (same, level 5)
   Env: BASE (default http://localhost:8931/index.html) */
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:8931/index.html';
const LEVEL = Number(process.env.LEVEL || '1');
const SHOTS = '/tmp/shots-tc';
fs.mkdirSync(SHOTS, { recursive: true });
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';

const results = { errors: [], failed_requests: [], checks: {}, level: {} };
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
async function gameState(page) {
  const s = await state(page);
  return s?.game ?? null;
}

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
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
  // 1. Load: menu appears, 0 console errors, 0 failed requests.
  await page.goto(BASE);
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  let s = await waitScene(page, 'Menu');
  check('menu_loads', s && s.activeScenes.includes('Menu'), JSON.stringify(s?.activeScenes));
  await sleep(800);
  await page.screenshot({ path: `${SHOTS}/01-menu-en.png` });
  check('no_console_errors_after_load', results.errors.length === 0, results.errors.slice(0, 3).join(' | '));
  check('no_failed_requests_after_load', results.failed_requests.length === 0, results.failed_requests.slice(0, 3).join(' | '));

  // 2. Button touch test: PLAY center + 4 corners + outside.
  // PLAY is at (195,560), 260x88 -> corners (75,525) (315,525) (75,595) (315,595).
  const corners = [[195, 560], [75, 525], [315, 525], [75, 595], [315, 595]];
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
  await page.touchscreen.tap(60, 700); // empty night sky below the buttons
  await sleep(500);
  s = await state(page);
  check('play_outside_noop', s && s.activeScenes.includes('Menu') && !s.activeScenes.includes('Game'), s?.activeScenes);

  // 3. Attract: PLAY -> Game in attract mode; the first-frame crash plays
  // (~1 s), then the play button appears.
  await page.touchscreen.tap(195, 560);
  s = await waitScene(page, 'Game');
  check('game_starts', s && s.activeScenes.includes('Game'), JSON.stringify(s?.activeScenes));
  await sleep(2500);
  let g = await gameState(page);
  check('attract_crash_happened', g && g.run && g.run.status === 'over' && g.run.overReason === 'crash', JSON.stringify(g?.run));
  await page.screenshot({ path: `${SHOTS}/02-attract-crash.png` });

  // 4. Tap anywhere -> the level starts with the tutorial (mission beat).
  await page.touchscreen.tap(195, 422);
  await sleep(600);
  g = await gameState(page);
  check('level_starts', g && g.mode === 'level' && g.run.status === 'playing', JSON.stringify(g?.run));
  check('tutorial_visible', g && g.tutorialStep !== 'done', `step=${g?.tutorialStep}`);
  await sleep(2200); // mission beat (2.5 s) auto-advances to 'light'
  g = await gameState(page);
  check('tutorial_mission_to_light', g && g.tutorialStep === 'light', `step=${g?.tutorialStep}`);
  await page.screenshot({ path: `${SHOTS}/03-tutorial-light.png` });

  // 5. Tutorial: tap the N light (262,348) -> 'swipe'; swipe a stopped car
  // up -> 'boost'; tap BOOST (95,780) -> 'done'.
  await page.touchscreen.tap(262, 348);
  await sleep(400);
  g = await gameState(page);
  check('tutorial_light_to_swipe', g && g.tutorialStep === 'swipe', `step=${g?.tutorialStep}`);
  // Find a stopped car and swipe it up (CDP touch drag).
  const carPos = await page.evaluate(() => {
    const st = window.__game?.state()?.game;
    const cars = st?.cars ?? [];
    const c = cars.find((x) => x.state === 'stopped') ?? cars[0];
    return c ? { x: c.x, y: c.y } : null;
  });
  if (carPos) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: carPos.x, y: carPos.y, id: 1 }] });
    for (let i = 1; i <= 5; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: carPos.x, y: carPos.y - i * 12, id: 1 }] });
      await sleep(16);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await cdp.detach();
  }
  await sleep(400);
  g = await gameState(page);
  check('tutorial_swipe_to_boost', g && g.tutorialStep === 'boost', `step=${g?.tutorialStep} car=${JSON.stringify(carPos)}`);
  await page.touchscreen.tap(95, 780); // BOOST button centre
  await sleep(400);
  g = await gameState(page);
  check('tutorial_boost_to_done', g && g.tutorialStep === 'done', `step=${g?.tutorialStep}`);
  await page.screenshot({ path: `${SHOTS}/04-tutorial-done.png` });

  // 6. Auto-play the level with the greedy rule (longest queue / most urgent
  // patience), at 3x time scale, until it ends. The level must end (win or
  // over) — never hang.
  await page.evaluate(() => window.__game.setTimeScale(3));
  const t0 = Date.now();
  let endState = null;
  while (Date.now() - t0 < 45000) {
    const st = await page.evaluate(() => {
      const g = window.__game?.state()?.game;
      if (!g || !g.run) return null;
      const cars = g.cars ?? [];
      const q = (dirs) => cars.filter((c) => dirs.includes(c.dir) && c.state === 'stopped').length;
      const qNS = q(['N', 'S']);
      const qEW = q(['E', 'W']);
      const urgent = cars.some((c) => c.state === 'stopped' && c.patience <= 2.5);
      const nsGreen = g.phase === 'NS';
      const wantsFlip = (qNS > qEW + 1 && !nsGreen) || (qEW > qNS + 1 && nsGreen) || (urgent && ((qNS > 0 && !nsGreen) || (qEW > 0 && nsGreen)));
      return { status: g.run.status, overReason: g.run.overReason, score: g.run.score, clears: g.run.clears, time: g.run.time, wantsFlip };
    });
    if (!st) break;
    if (st.status !== 'playing') { endState = st; break; }
    if (st.wantsFlip) await page.evaluate(() => window.__game.toggle());
    await sleep(300);
  }
  check('level_ends', endState !== null, JSON.stringify(endState));
  if (endState) {
    results.level = { ...endState, level: LEVEL };
    console.log('LEVEL RESULT:', JSON.stringify(results.level));
  }
  await sleep(1500); // Result scene transition (900 ms win / 400 ms fail + buffer)
  s = await waitScene(page, 'Result', 8000);
  check('result_scene', s && s.activeScenes.includes('Result'), JSON.stringify(s?.activeScenes));
  await page.screenshot({ path: `${SHOTS}/05-result.png` });
  // Save: a win must persist stars + unlock the next level.
  const save = await page.evaluate(() => window.__game.save());
  check('save_after_level', !!save && (endState?.status === 'won' ? (save.stars?.[LEVEL] ?? 0) >= 1 : true), JSON.stringify(save?.stars));

  // 7. Map: nodes render, locked nodes do nothing, level 1 node opens Game.
  await page.goto(BASE);
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  await waitScene(page, 'Menu');
  await page.touchscreen.tap(65, 660); // LEVELS button (195-130, 660)
  await sleep(600);
  s = await state(page);
  check('map_loads', s && s.activeScenes.includes('Map'), JSON.stringify(s?.activeScenes));
  await page.screenshot({ path: `${SHOTS}/06-map.png` });
  await page.touchscreen.tap(48, 208); // level 1 node (first node, row 1)
  await sleep(700);
  s = await state(page);
  check('map_node_opens_game', s && s.activeScenes.includes('Game'), JSON.stringify(s?.activeScenes));

  // 8. Shop: loads, 3 skins, back works.
  await page.goto(BASE);
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  await waitScene(page, 'Menu');
  await page.touchscreen.tap(325, 660); // SHOP button (195+130, 660)
  await sleep(600);
  s = await state(page);
  check('shop_loads', s && s.activeScenes.includes('Shop'), JSON.stringify(s?.activeScenes));
  await page.screenshot({ path: `${SHOTS}/07-shop.png` });
  await page.touchscreen.tap(195, 800); // BACK
  await sleep(600);
  s = await state(page);
  check('shop_back_to_menu', s && s.activeScenes.includes('Menu'), JSON.stringify(s?.activeScenes));

  // 9. Pause: in a level, the pause button freezes the sim and shows the overlay.
  await page.touchscreen.tap(195, 560); // PLAY
  await waitScene(page, 'Game');
  await sleep(500);
  await page.touchscreen.tap(195, 422); // start level
  await sleep(800);
  await page.touchscreen.tap(345, 780); // pause button centre (320+25, 756+26)
  await sleep(400);
  g = await gameState(page);
  check('pause_freezes', g && g.paused === true, `paused=${g?.paused}`);
  await page.screenshot({ path: `${SHOTS}/08-pause.png` });

  check('no_console_errors_total', results.errors.length === 0, results.errors.slice(0, 5).join(' | '));
  check('no_failed_requests_total', results.failed_requests.length === 0, results.failed_requests.slice(0, 5).join(' | '));
} catch (e) {
  results.errors.push(`harness: ${e}`);
  console.error('HARNESS ERROR', e);
} finally {
  await browser.close();
}

const failed = Object.values(results.checks).filter((c) => !c.ok).length;
console.log(JSON.stringify({ failed, checks: results.checks, errors: results.errors, failed_requests: results.failed_requests, level: results.level }, null, 2));
process.exit(failed > 0 ? 1 : 0);
