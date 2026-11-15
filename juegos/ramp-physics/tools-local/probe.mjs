/* Focused probe: menu button geometry, lang toggle, pause, renderer/FPS.
   Usage: node tools-local/probe.mjs */
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:8931/index.html';
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e)));
await page.goto(BASE);
await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await sleep(600);

// 1. Dump interactive objects in the Menu with their bounds.
const objs = await page.evaluate(() => {
  const g = window.__game.game;
  const menu = g.scene.getScene('Menu');
  const out = [];
  const walk = (list, prefix) => {
    for (const o of list) {
      if (o.input) {
        let b = null;
        try { const r = o.getBounds(); b = { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; } catch { /* ignore */ }
        out.push({ name: prefix + (o.type || '?'), x: Math.round(o.x), y: Math.round(o.y), w: o.width, h: o.height, bounds: b, depth: o.depth });
      }
      if (o.list) walk(o.list, prefix + (o.type || '?') + '/');
    }
  };
  walk(menu.children.list, '');
  return out;
});
console.log('INTERACTIVE OBJECTS (menu):');
for (const o of objs) console.log(JSON.stringify(o));

// 2. Renderer type.
const renderer = await page.evaluate(() => {
  const g = window.__game.game;
  return { type: g.renderer.type, gl: !!g.renderer.gl, canvas: !!g.renderer.canvas };
});
console.log('RENDERER:', JSON.stringify(renderer));

// 3. FPS on the menu (static scene), DSF 2.
const fpsMenu = await page.evaluate(
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
console.log('FPS menu DSF2:', fpsMenu.toFixed(1));

// 4. Lang toggle: tap (346,108), read lang + button label.
await page.touchscreen.tap(346, 108);
await sleep(600);
const afterToggle = await page.evaluate(() => window.__game.state().lang);
console.log('LANG after toggle tap:', afterToggle);
await page.screenshot({ path: '/tmp/shots/probe-menu-after-toggle.png' });

// 5. Pause probe: start game, tap pause, read state.
await page.touchscreen.tap(195, 675);
await sleep(800);
let st = await page.evaluate(() => window.__game.state().game);
console.log('GAME state before pause tap:', JSON.stringify(st?.state));
await page.touchscreen.tap(350, 30);
await sleep(600);
st = await page.evaluate(() => window.__game.state().game);
console.log('GAME state after pause tap:', JSON.stringify(st?.state));
await page.screenshot({ path: '/tmp/shots/probe-pause.png' });
await browser.close();
