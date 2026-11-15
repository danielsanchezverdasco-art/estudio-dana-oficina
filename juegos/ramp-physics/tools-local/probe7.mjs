/* Probe 7: does the scene-level listener survive N reloads? */
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:8931/index.html';
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const page = await ctx.newPage();

for (let round = 1; round <= 3; round++) {
  await page.goto(BASE);
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  await sleep(600);
  await page.touchscreen.tap(195, 675); // PLAY
  await sleep(800);
  await page.evaluate(() => {
    window.__taplog = [];
    const gs = window.__game.game.scene.getScene('Game');
    gs.input.on('pointerdown', (p) => window.__taplog.push(['down', Math.round(p.x), Math.round(p.y)]));
  });
  await page.touchscreen.tap(200, 300);
  await sleep(400);
  const log = await page.evaluate(() => window.__taplog);
  const scenes = await page.evaluate(() => window.__game.state().activeScenes);
  console.log(`round ${round}: scenes=${JSON.stringify(scenes)} taplog=${JSON.stringify(log)}`);
}
await browser.close();
