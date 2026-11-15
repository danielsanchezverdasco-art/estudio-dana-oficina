/* Extra screenshots for the delivery pack: map, shop, result, landscape.
 * Uses the TEST build (dist-test, port 8931). */
import { chromium } from 'playwright-core';

const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = '/tmp/film-ramp/shots';
const BASE = 'http://localhost:8931/index.html';

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

// Portrait: map + shop
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const p = await ctx.newPage();
await p.goto(BASE);
await p.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await p.waitForFunction(() => window.__game.state().activeScenes.includes('Menu'), null, { timeout: 15000 });
await sleep(1500);
await p.touchscreen.tap(119, 753); // LEVELS (map)
await sleep(1500);
await p.screenshot({ path: `${OUT}/map.png` });
await p.goto(BASE);
await p.waitForFunction(() => window.__game.state().activeScenes.includes('Menu'), null, { timeout: 15000 });
await sleep(1000);
await p.touchscreen.tap(271, 753); // SHOP
await sleep(1500);
await p.screenshot({ path: `${OUT}/shop.png` });
await ctx.close();

// Landscape: level 1 gameplay rotated
const ctxL = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const pl = await ctxL.newPage();
await pl.goto(BASE);
await pl.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await sleep(2000);
await pl.screenshot({ path: `${OUT}/landscape-menu.png` });
await ctxL.close();

await browser.close();
console.log('SHOTS DONE');
