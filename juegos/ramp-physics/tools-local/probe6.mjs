/* Probe 6: after reloads, is the Game scene's input plugin alive?
   Checks DOM touch delivery, the global InputManager, and scene status. */
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:8931/index.html';
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const page = await ctx.newPage();
await page.goto(BASE);
await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await sleep(500);
await page.touchscreen.tap(195, 675);
await sleep(800);

const info = await page.evaluate(() => {
  const g = window.__game.game;
  const gs = g.scene.getScene('Game');
  window.__domlog = [];
  const canvas = g.canvas;
  canvas.addEventListener('touchstart', (e) => window.__domlog.push(['dom touchstart', e.touches.length]), true);
  canvas.addEventListener('pointerdown', (e) => window.__domlog.push(['dom pointerdown', e.pointerType]), true);
  canvas.addEventListener('mousedown', () => window.__domlog.push(['dom mousedown']), true);
  window.__glog = [];
  return {
    sceneActive: gs.scene.isActive(),
    status: gs.sys.settings.status,
    hasInput: !!gs.input,
    inputEnabled: gs.input ? gs.input.enabled : null,
    managerQueue: g.input ? g.input.queue?.length : null,
    activeScenes: g.scene.getScenes(true).map((s) => s.scene.key),
    canvasRect: (() => { const r = canvas.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })(),
  };
});
console.log('SCENE INFO:', JSON.stringify(info, null, 1));

// Attach a scene-level listener too, then tap.
await page.evaluate(() => {
  window.__taplog = [];
  const gs = window.__game.game.scene.getScene('Game');
  gs.input.on('pointerdown', (p) => window.__taplog.push(['scene down', Math.round(p.x), Math.round(p.y)]));
});
await page.touchscreen.tap(200, 300);
await sleep(400);
console.log('domlog:', JSON.stringify(await page.evaluate(() => window.__domlog)));
console.log('scene taplog:', JSON.stringify(await page.evaluate(() => window.__taplog)));
console.log('game state:', JSON.stringify((await page.evaluate(() => window.__game.state().game))?.state));
await browser.close();
