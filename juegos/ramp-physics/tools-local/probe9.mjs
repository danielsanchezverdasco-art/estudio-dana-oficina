/* Probe 9: after a failed diagnostic tap in round 2, re-attach and re-tap. */
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
  await page.evaluate(() => {
    window.__taplog = [];
    const gs = window.__game.game.scene.getScene('Game');
    gs.input.on('pointerdown', (p) => window.__taplog.push(['down1', Math.round(p.x), Math.round(p.y)]));
  });
  await page.touchscreen.tap(200, 300);
  await sleep(400);
  console.log(`round ${round} taplog after tap1:`, JSON.stringify(await page.evaluate(() => window.__taplog)));
  // Re-attach a second listener and tap again.
  const info = await page.evaluate(() => {
    const gs = window.__game.game.scene.getScene('Game');
    const before = gs.input.listenerCount('pointerdown');
    gs.input.on('pointerdown', (p) => window.__taplog.push(['down2', Math.round(p.x), Math.round(p.y)]));
    return { before, after: gs.input.listenerCount('pointerdown'), enabled: gs.input.enabled, active: gs.scene.isActive(), status: gs.sys.settings.status };
  });
  console.log(`round ${round} re-attach:`, JSON.stringify(info));
  await page.touchscreen.tap(200, 300);
  await sleep(400);
  console.log(`round ${round} taplog after tap2:`, JSON.stringify(await page.evaluate(() => window.__taplog)));
}
await browser.close();
