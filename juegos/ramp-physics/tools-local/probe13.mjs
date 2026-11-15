/* Probe 13: capture the FAIL screen (Result scene, lost) for entregas/.
 * Start level 1, spawn 3 gulls, draw nothing, wait until the Result
 * scene appears (3 crumbs stolen), screenshot it. */
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:8931/index.html';
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(BASE);
await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await page.waitForFunction(() => window.__game.state().activeScenes.includes('Menu'), null, { timeout: 15000 });
await sleep(500);
await page.evaluate(() => window.__game.startLevel(1));
await sleep(1000);
await page.evaluate(() => { window.__game.spawnGull(); window.__game.spawnGull(); window.__game.spawnGull(); });
let lost = false;
for (let i = 0; i < 120; i++) {
  await sleep(1000);
  const s = await page.evaluate(() => window.__game.state());
  if (s.activeScenes.includes('Result')) { lost = true; break; }
  if (!s.activeScenes.includes('Game')) break;
}
console.log('lost:', lost);
await sleep(1200);
await page.screenshot({ path: '/tmp/shots/13-fail.png' });
await browser.close();
