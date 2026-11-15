/* Probe 8: round-2 input state dump + pause button test. */
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:8931/index.html';
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const page = await ctx.newPage();

for (let round = 1; round <= 2; round++) {
  await page.goto(BASE);
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  await sleep(600);
  await page.touchscreen.tap(195, 675);
  await sleep(800);
  const info = await page.evaluate(() => {
    const g = window.__game.game;
    const gs = g.scene.getScene('Game');
    return {
      status: gs.sys.settings.status,
      inputEnabled: gs.input.enabled,
      listeners: gs.input.listenerCount ? gs.input.listenerCount('pointerdown') : 'n/a',
    };
  });
  console.log(`round ${round} input info:`, JSON.stringify(info));
  await page.evaluate(() => {
    window.__taplog = [];
    const gs = window.__game.game.scene.getScene('Game');
    gs.input.on('pointerdown', (p) => window.__taplog.push(['down', Math.round(p.x), Math.round(p.y)]));
    console.log('[eval] listeners now:', gs.input.listenerCount('pointerdown'));
  });
  await page.touchscreen.tap(200, 300);
  await sleep(400);
  console.log(`round ${round} taplog:`, JSON.stringify(await page.evaluate(() => window.__taplog)));
  // Does the pause BUTTON (interactive object) work?
  await page.touchscreen.tap(350, 30);
  await sleep(400);
  console.log(`round ${round} state after pause tap:`, JSON.stringify((await page.evaluate(() => window.__game.state().game))?.state));
}
await browser.close();
