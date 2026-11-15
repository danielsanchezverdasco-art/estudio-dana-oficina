/* Probe 10: replicate the map -> game -> pause -> quit flow with diagnostics. */
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:8931/index.html';
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(BASE);
await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await page.waitForFunction(() => window.__game.state().activeScenes.includes('Menu'), null, { timeout: 15000 });
await sleep(800);
// Open the map.
await page.touchscreen.tap(195, 753); // LEVELS
await sleep(700);
console.log('after LEVELS:', JSON.stringify(await page.evaluate(() => window.__game.state().activeScenes)));
// Tap the level-1 node.
await page.touchscreen.tap(195, 624);
await sleep(700);
console.log('after node tap:', JSON.stringify(await page.evaluate(() => window.__game.state().activeScenes)));
await sleep(1200);
// Log scene-level input events for the pause tap.
await page.evaluate(() => {
  window.__taplog = [];
  const gs = window.__game.game.scene.getScene('Game');
  gs.input.on('pointerdown', (p, over) => window.__taplog.push(['down', Math.round(p.x), Math.round(p.y), over.map((o) => o.type + ':' + (o.text || o.name || ''))]));
  gs.input.on('pointerup', (p, over) => window.__taplog.push(['up', Math.round(p.x), Math.round(p.y), over.map((o) => o.type + ':' + (o.text || o.name || ''))]));
});
await page.touchscreen.tap(350, 30); // pause button
await sleep(500);
console.log('taplog pause:', JSON.stringify(await page.evaluate(() => window.__taplog)));
console.log('game after pause tap:', JSON.stringify(await page.evaluate(() => {
  const gs = window.__game.game.scene.getScene('Game');
  return { state: gs.state, pausePanel: !!gs.pausePanel };
})));
await page.screenshot({ path: '/tmp/shots/probe10-pause.png' });
// Quit tap.
await page.evaluate(() => { window.__taplog = []; });
await page.touchscreen.tap(195, 551); // quit button
await sleep(600);
console.log('taplog quit:', JSON.stringify(await page.evaluate(() => window.__taplog)));
console.log('scenes after quit tap:', JSON.stringify(await page.evaluate(() => window.__game.state().activeScenes)));
await browser.close();
