/* Probe 4: the EXACT touchDrag from test-game.mjs, with the exact arc points,
   in a clean run. Also with a 50ms pause after touchStart (variant B). */
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:8931/index.html';
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(BASE);
await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await sleep(800);
await page.touchscreen.tap(195, 675);
await sleep(800);

async function attachLog() {
  await page.evaluate(() => {
    window.__taplog = [];
    const g = window.__game.game;
    const gs = g.scene.getScene('Game');
    gs.input.on('pointerdown', (p) => window.__taplog.push(['down', Math.round(p.x), Math.round(p.y)]));
    gs.input.on('pointermove', (p) => window.__taplog.push(['move', Math.round(p.x), Math.round(p.y)]));
    gs.input.on('pointerup', (p) => window.__taplog.push(['up', Math.round(p.x), Math.round(p.y)]));
  });
}

// Variant A: exact main-test drag (arc, no sleep after touchStart)
await attachLog();
await touchDrag(page, arcPoints(195, 430, 110, Math.PI * 1.15, Math.PI * 1.85));
await sleep(300);
console.log('A events:', (await page.evaluate(() => window.__taplog)).length, 'segments:', (await page.evaluate(() => window.__game.state().game)).segments);

// Variant B: same drag but with 50ms after touchStart
await page.evaluate(() => window.__game.startLevel(1));
await sleep(800);
await attachLog();
{
  const pts = arcPoints(195, 430, 110, Math.PI * 1.15, Math.PI * 1.85);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: pts[0].x, y: pts[0].y, id: 1 }] });
  await sleep(50);
  for (const p of pts.slice(1)) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: p.x, y: p.y, id: 1 }] });
    await sleep(16);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
}
await sleep(300);
console.log('B events:', (await page.evaluate(() => window.__taplog)).length, 'segments:', (await page.evaluate(() => window.__game.state().game)).segments);
await browser.close();
