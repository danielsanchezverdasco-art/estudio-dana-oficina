/* Probe 11: map -> node -> pause tap, with input over-list + state dumps. */
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
await page.touchscreen.tap(119, 753); // LEVELS
await sleep(700);
console.log('after LEVELS:', JSON.stringify(await page.evaluate(() => window.__game.state().activeScenes)));
await page.touchscreen.tap(195, 624); // level 1 node
await sleep(700);
console.log('after node:', JSON.stringify(await page.evaluate(() => window.__game.state().activeScenes)));
await sleep(1200);
const before = await page.evaluate(() => {
  const gs = window.__game.game.scene.getScene('Game');
  return { state: gs.state, tutorialDone: gs.tutorialDone, hand: !!gs.hand, pausePanel: !!gs.pausePanel, level: gs.level };
});
console.log('game before pause tap:', JSON.stringify(before));
await page.evaluate(() => {
  window.__taplog = [];
  const gs = window.__game.game.scene.getScene('Game');
  gs.input.on('pointerdown', (p, over) => window.__taplog.push(['down', Math.round(p.x), Math.round(p.y), over.map((o) => o.type + ':' + (o.text || '').slice(0, 12))]));
  gs.input.on('pointerup', (p, over) => window.__taplog.push(['up', Math.round(p.x), Math.round(p.y), over.map((o) => o.type + ':' + (o.text || '').slice(0, 12))]));
});
await page.touchscreen.tap(350, 30);
await sleep(600);
console.log('taplog:', JSON.stringify(await page.evaluate(() => window.__taplog)));
console.log('game after pause tap:', JSON.stringify(await page.evaluate(() => {
  const gs = window.__game.game.scene.getScene('Game');
  return { state: gs.state, pausePanel: !!gs.pausePanel };
})));
await page.screenshot({ path: '/tmp/shots/probe11-pause.png' });
await browser.close();
