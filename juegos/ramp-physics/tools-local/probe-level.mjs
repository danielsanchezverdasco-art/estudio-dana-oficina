/* Focused probe: run one level's solution and trace the dummy's centre
   every 500 ms + screenshots, to see WHY a level fails. */
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = 'http://localhost:8931/index.html';
const SHOTS = '/tmp/shots';
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const levels = process.argv.slice(2).map(Number);
console.log('probing levels:', levels);

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 200)));

await page.goto(BASE);
await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await sleep(500);

for (const n of levels) {
  await page.evaluate((lv) => window.__game.startLevel(lv), n);
  await sleep(700);
  await page.evaluate(() => window.__game.setTimeScale(2));
  const sol = await page.evaluate(() => window.__game.solution());
  for (const stroke of sol) {
    const pts = stroke.pts.map(([x, y]) => ({ x, y }));
    await page.evaluate(([p, ink]) => window.__game.draw(p, ink), [pts, stroke.ink]);
    await sleep(150);
  }
  await page.evaluate(() => window.__game.launch());
  console.log(`\n=== LEVEL ${n} ===`);
  for (let i = 0; i < 40; i++) {
    await sleep(500);
    const st = await page.evaluate(() => window.__game.state());
    const g = st?.game;
    if (!g) { console.log('  no game state'); break; }
    const cx = g.dummy ? Math.round(g.dummy.reduce((a, p) => a + p.x, 0) / g.dummy.length) : -1;
    const cy = g.dummy ? Math.round(g.dummy.reduce((a, p) => a + p.y, 0) / g.dummy.length) : -1;
    const vmax = g.dummy ? Math.max(...g.dummy.map((p) => p.v)) : -1;
    console.log(`  t=${((i + 1) * 0.5).toFixed(1)}s state=${g.state} centre=(${cx},${cy}) vmax=${vmax} gravFlip=${g.gravityFlipped} dyn=${g.dynamiteUsed} portals=${g.portalsUsed}`);
    if (i === 6 || i === 14) await page.screenshot({ path: `${SHOTS}/probe-L${n}-t${(i + 1) * 0.5}s.png` });
    if (g.state === 'won' || g.state === 'lost') break;
    if (!st.activeScenes.includes('Game')) { console.log('  left Game scene'); break; }
  }
  await page.screenshot({ path: `${SHOTS}/probe-L${n}-end.png` });
}
await browser.close();
console.log('done');
