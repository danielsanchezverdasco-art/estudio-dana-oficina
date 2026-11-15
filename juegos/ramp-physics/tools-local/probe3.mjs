/* Debug: (a) does a raw CDP touch reach the game? (b) pause/quit from map.
   (c) rAF baseline on a blank page + FPS at DSF1. */
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:8931/index.html';
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

// --- blank page rAF baseline ---
const bctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const bpage = await bctx.newPage();
await bpage.goto('about:blank');
const blankFps = await bpage.evaluate(
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
console.log('BLANK page rAF:', blankFps.toFixed(1), 'fps');
await bctx.close();

// --- game context ---
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e)));
await page.goto(BASE);
await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await sleep(800);
await page.touchscreen.tap(195, 675); // PLAY
await sleep(800);

// attach input log
await page.evaluate(() => {
  window.__taplog = [];
  const g = window.__game.game;
  const gs = g.scene.getScene('Game');
  gs.input.on('pointerdown', (p) => window.__taplog.push(['down', Math.round(p.x), Math.round(p.y)]));
  gs.input.on('pointermove', (p) => window.__taplog.push(['move', Math.round(p.x), Math.round(p.y)]));
  gs.input.on('pointerup', (p) => window.__taplog.push(['up', Math.round(p.x), Math.round(p.y)]));
});

// (a1) raw CDP touch drag
console.log('--- CDP touch drag ---');
{
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 150, y: 350, id: 1 }] });
  await sleep(50);
  for (let i = 1; i <= 10; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 150 + i * 8, y: 350, id: 1 }] });
    await sleep(16);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach();
}
await sleep(300);
console.log('taplog after CDP drag:', JSON.stringify(await page.evaluate(() => window.__taplog)));
console.log('segments:', JSON.stringify((await page.evaluate(() => window.__game.state().game))?.segments));

// (a2) mouse drag for comparison
await page.evaluate(() => { window.__taplog = []; });
console.log('--- mouse drag ---');
await page.mouse.move(150, 350);
await page.mouse.down();
for (let i = 1; i <= 10; i++) {
  await page.mouse.move(150 + i * 8, 350);
  await sleep(16);
}
await page.mouse.up();
await sleep(300);
console.log('taplog after mouse drag:', JSON.stringify((await page.evaluate(() => window.__taplog)).slice(0, 5)), '... total', (await page.evaluate(() => window.__taplog)).length);
console.log('segments:', JSON.stringify((await page.evaluate(() => window.__game.state().game))?.segments));

// (a3) synthetic TouchEvent via evaluate
await page.evaluate(() => { window.__taplog = []; });
console.log('--- synthetic TouchEvent ---');
await page.evaluate(() => {
  const canvas = document.querySelector('canvas');
  const touch = new Touch({ identifier: 1, target: canvas, clientX: 150, clientY: 350 });
  canvas.dispatchEvent(new TouchEvent('touchstart', { touches: [touch], changedTouches: [touch], bubbles: true, cancelable: true }));
  const touch2 = new Touch({ identifier: 1, target: canvas, clientX: 230, clientY: 350 });
  canvas.dispatchEvent(new TouchEvent('touchmove', { touches: [touch2], changedTouches: [touch2], bubbles: true, cancelable: true }));
  canvas.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [touch2], bubbles: true, cancelable: true }));
});
await sleep(300);
console.log('taplog after synthetic touch:', JSON.stringify(await page.evaluate(() => window.__taplog)));
console.log('segments:', JSON.stringify((await page.evaluate(() => window.__game.state().game))?.segments));

// (b) pause/quit from a map-started game, with state after each tap
await page.evaluate(() => window.__game.startLevel(1));
await sleep(800);
await page.touchscreen.tap(350, 30);
await sleep(500);
console.log('state after pause tap:', JSON.stringify((await page.evaluate(() => window.__game.state().game))?.state));
await page.touchscreen.tap(195, 551);
await sleep(500);
console.log('scenes after quit tap:', JSON.stringify((await page.evaluate(() => window.__game.state())).activeScenes));

// (c) FPS at DSF1
const ctx1 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const page1 = await ctx1.newPage();
await page1.goto(BASE);
await page1.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await sleep(800);
await page1.evaluate(() => window.__game.startLevel(30));
await sleep(500);
for (let i = 0; i < 5; i++) await page1.evaluate(() => window.__game.spawnGull());
const fps1 = await page1.evaluate(
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
console.log('FPS busy level DSF1:', fps1.toFixed(1));
await browser.close();
