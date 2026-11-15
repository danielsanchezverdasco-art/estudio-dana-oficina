/* Film real gameplay for the Short + GIF (playgama-game-video skill).
 * Filmed from the TEST build (dist-test, port 8931) so the script can
 * wait on real GAME state (win) instead of wall time — the headless
 * loop is slow (SwiftShader) and game time runs far slower than real
 * time. The test build differs from production ONLY by the invisible
 * window.__game debug handle (no visual difference, never on screen);
 * the production zip is what gets published. The footage is real
 * gameplay of the actual game code; the only staging is choosing the
 * levels (1 for the win, 11 for the fan, 21 for the dynamite).
 * Playwright records video (webm); ffmpeg cuts the GIF (8-10 s,
 * >=12 fps, >=360 px, ending in victory) and the Short (1080x1920).
 */
import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';

const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = '/tmp/film-ramp';
const BASE = 'http://localhost:8931/index.html';

execSync(`mkdir -p ${OUT}/part1 ${OUT}/part2 ${OUT}/shots`, { stdio: 'inherit' });

async function touchDrag(page, points, stepMs = 40) {
  const cdp = await page.context().newCDPSession(page);
  const first = points[0];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: first.x, y: first.y, id: 1 }] });
  for (let i = 1; i < points.length; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: points[i].x, y: points[i].y, id: 1 }] });
    await sleep(stepMs);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

function linePoints(p0, p1, steps = 20) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    pts.push({ x: Math.round(p0.x + ((p1.x - p0.x) * i) / steps), y: Math.round(p0.y + ((p1.y - p0.y) * i) / steps) });
  }
  return pts;
}

async function waitFor(page, fn, timeoutMs, label) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    if (await page.evaluate(fn)) return true;
    await sleep(1000);
  }
  console.log('TIMEOUT waiting for:', label);
  return false;
}

/** Draw the level's solution strokes with real touch drags. */
async function drawSolution(page) {
  const strokes = await page.evaluate(() => window.__game.solution());
  for (const s of strokes) {
    // solution() returns { pts: [x, y][], ink } per stroke.
    const raw = s.pts ?? s.points ?? s;
    if (!Array.isArray(raw) || raw.length < 2) continue;
    const pts = raw.map((p) => (Array.isArray(p) ? { x: p[0], y: p[1] } : p));
    const drag = [];
    for (let i = 0; i < pts.length - 1; i++) drag.push(...linePoints(pts[i], pts[i + 1], 12).slice(0, -1));
    drag.push(pts[pts.length - 1]);
    await touchDrag(page, drag, 30);
    await sleep(400);
  }
}

async function playLevel(page, n, shotName) {
  await page.evaluate((n) => window.__game.startLevel(n), n);
  await page.waitForFunction(() => window.__game.state().activeScenes.includes('Game'), null, { timeout: 15000 });
  await sleep(1500);
  await drawSolution(page);
  await page.screenshot({ path: `${OUT}/shots/${shotName}-drawn.png` });
  // Tap LAUNCH (bottom centre, 195, 796 in design coords).
  await page.touchscreen.tap(195, 796);
  const won = await waitFor(page, () => window.__game.state().activeScenes.includes('Result'), 90000, `level ${n} win`);
  await sleep(1200);
  await page.screenshot({ path: `${OUT}/shots/${shotName}-result.png` });
  return won;
}

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

// ---- Part 1: menu + level 1 win (the GIF + Short core) ----
const ctx1 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US', recordVideo: { dir: `${OUT}/part1`, size: { width: 390, height: 844 } } });
const p1 = await ctx1.newPage();
await p1.goto(BASE);
await p1.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await p1.waitForFunction(() => window.__game.state().activeScenes.includes('Menu'), null, { timeout: 15000 });
await sleep(3000); // menu: dummy bobs
await p1.screenshot({ path: `${OUT}/shots/menu-en.png` });
await p1.touchscreen.tap(195, 675); // PLAY
await p1.waitForFunction(() => window.__game.state().activeScenes.includes('Game'), null, { timeout: 15000 });
await sleep(2500); // tutorial hand + hint visible
await p1.screenshot({ path: `${OUT}/shots/level1-tutorial.png` });
await drawSolution(p1);
await p1.screenshot({ path: `${OUT}/shots/level1-drawn.png` });
await p1.touchscreen.tap(195, 796); // LAUNCH
await waitFor(p1, () => window.__game.state().activeScenes.includes('Result'), 90000, 'level 1 win');
await sleep(1500); // result card: stars pop, +25 coins
await p1.screenshot({ path: `${OUT}/shots/level1-result.png` });
await ctx1.close();

// ---- Part 2: level 11 (fan) + level 21 (dynamite) inserts ----
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US', recordVideo: { dir: `${OUT}/part2`, size: { width: 390, height: 844 } } });
const p2 = await ctx2.newPage();
await p2.goto(BASE);
await p2.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await sleep(1000);
console.log('L11 fan win:', await playLevel(p2, 11, 'level11-fan'));
console.log('L21 dynamite win:', await playLevel(p2, 21, 'level21-dynamite'));
await ctx2.close();

await browser.close();
console.log('FILM DONE — videos in', OUT);
