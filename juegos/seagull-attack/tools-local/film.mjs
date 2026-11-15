/* Film real gameplay for the Short + GIF (playgama-game-video skill).
 * Filmed from the TEST build (dist-test, port 8931) so the script can
 * wait on real GAME state (win, bounce, pelican) instead of wall time —
 * the headless loop is slow (SwiftShader) and game time runs far slower
 * than real time. The test build differs from production ONLY by the
 * invisible window.__game debug handle (no visual difference, never on
 * screen); the production zip is what gets published. The footage is
 * real gameplay of the actual game code, no staging beyond choosing
 * the level (6/10) for the wind/pelican inserts.
 * Playwright records video (webm); ffmpeg cuts the GIF (8-10 s, >=12 fps,
 * >=360 px, ending in victory) and the Short.
 */
import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';

const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = '/tmp/film';
const BASE = 'http://localhost:8931/index.html';

execSync(`mkdir -p ${OUT}/part1 ${OUT}/part2`, { stdio: 'inherit' });

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

function arcPoints(cx, cy, r, a0, a1, steps = 24) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const a = a0 + ((a1 - a0) * i) / steps;
    pts.push({ x: Math.round(cx + Math.cos(a) * r), y: Math.round(cy + Math.sin(a) * r) });
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

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

// ---- Part 1: menu + level 1 win (the GIF + Short core) ----
const ctx1 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US', recordVideo: { dir: `${OUT}/part1`, size: { width: 390, height: 844 } } });
const p1 = await ctx1.newPage();
await p1.goto(BASE);
await p1.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await p1.waitForFunction(() => window.__game.state().activeScenes.includes('Menu'), null, { timeout: 15000 });
await sleep(3000); // menu: gull flies, sandwich bobs
await p1.touchscreen.tap(195, 675); // PLAY
await p1.waitForFunction(() => window.__game.state().activeScenes.includes('Game'), null, { timeout: 15000 });
await sleep(2500); // tutorial hand + hints visible
await touchDrag(p1, arcPoints(195, 430, 110, Math.PI * 1.15, Math.PI * 1.85));
await waitFor(p1, () => { const g = window.__game.state().game; return g && Array.isArray(g.gulls) && g.gulls.includes('fleeing'); }, 40000, 'a gull bounces off the line');
await waitFor(p1, () => window.__game.state().activeScenes.includes('Result'), 90000, 'level 1 win');
await sleep(1500); // result card: stars pop, +25 coins
await p1.screenshot({ path: `${OUT}/part1-end.png` });
await ctx1.close();

// ---- Part 2: level 6 (wind) + level 10 (pelican) inserts ----
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US', recordVideo: { dir: `${OUT}/part2`, size: { width: 390, height: 844 } } });
const p2 = await ctx2.newPage();
await p2.goto(BASE);
await p2.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await sleep(1000);
await p2.evaluate(() => window.__game.startLevel(6));
await sleep(2000);
await touchDrag(p2, arcPoints(195, 430, 110, Math.PI * 1.15, Math.PI * 1.85));
await sleep(12000); // wind bends the dives
await p2.screenshot({ path: `${OUT}/part2-wind.png` });
await p2.evaluate(() => window.__game.startLevel(10));
await sleep(2000);
await touchDrag(p2, arcPoints(195, 430, 110, Math.PI * 1.15, Math.PI * 1.85));
// Pelican spawns at 2 s game time; wait until 2 gulls exist, then let it dive.
await waitFor(p2, () => { const g = window.__game.state().game; return g && g.gullsTotal >= 2; }, 60000, 'pelican spawns');
await sleep(15000);
await p2.screenshot({ path: `${OUT}/part2-pelican.png` });
await ctx2.close();

await browser.close();
console.log('FILM DONE — videos in', OUT);
