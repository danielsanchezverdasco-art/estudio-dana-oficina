/* Probe 2: what does Phaser's input manager actually see on each tap?
   Attaches pointerdown/up listeners that log the objects under the pointer. */
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:8931/index.html';
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(BASE);
await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await sleep(1000); // let any resize rebuild settle

await page.evaluate(() => {
  window.__taplog = [];
  const g = window.__game.game;
  const menu = g.scene.getScene('Menu');
  const desc = (o) => o.map((x) => `${x.type}@${Math.round(x.x)},${Math.round(x.y)}`).join(' | ');
  menu.input.on('pointerdown', (p, o) => window.__taplog.push(['menu down', Math.round(p.x), Math.round(p.y), desc(o)]));
  menu.input.on('pointerup', (p, o) => window.__taplog.push(['menu up', Math.round(p.x), Math.round(p.y), desc(o)]));
  menu.input.on('pointerover', (p, o) => window.__taplog.push(['menu over', Math.round(p.x), Math.round(p.y), desc(o)]));
});

console.log('--- tap lang toggle (346,108) ---');
await page.touchscreen.tap(346, 108);
await sleep(400);
console.log(JSON.stringify(await page.evaluate(() => window.__taplog), null, 1));
console.log('lang now:', await page.evaluate(() => window.__game.state().lang));

await page.evaluate(() => { window.__taplog = []; });
console.log('--- tap PLAY top-right corner (320,643) ---');
await page.touchscreen.tap(320, 643);
await sleep(500);
console.log(JSON.stringify(await page.evaluate(() => window.__taplog), null, 1));
console.log('scenes:', JSON.stringify((await page.evaluate(() => window.__game.state())).activeScenes));

// Back to menu, start game via handle, then probe pause.
await page.evaluate(() => window.__game.startLevel(1));
await sleep(800);
await page.evaluate(() => {
  window.__taplog = [];
  const g = window.__game.game;
  const gs = g.scene.getScene('Game');
  const desc = (o) => o.map((x) => `${x.type}@${Math.round(x.x)},${Math.round(x.y)}`).join(' | ');
  gs.input.on('pointerdown', (p, o) => window.__taplog.push(['game down', Math.round(p.x), Math.round(p.y), desc(o)]));
  gs.input.on('pointerup', (p, o) => window.__taplog.push(['game up', Math.round(p.x), Math.round(p.y), desc(o)]));
});
console.log('--- tap pause (350,30) ---');
await page.touchscreen.tap(350, 30);
await sleep(500);
console.log(JSON.stringify(await page.evaluate(() => window.__taplog), null, 1));
console.log('game state:', JSON.stringify((await page.evaluate(() => window.__game.state().game))?.state));
await browser.close();
