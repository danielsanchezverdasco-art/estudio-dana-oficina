import { chromium } from 'playwright-core';
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const p = await ctx.newPage();
const errors = [];
p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
p.on('pageerror', (e) => errors.push(String(e)));
const failed = [];
p.on('requestfailed', (r) => failed.push(r.url()));
await p.goto('http://localhost:8932/index.html');
await p.waitForTimeout(5000);
const state = await p.evaluate(() => ({
  hasGameHandle: typeof window.__game !== 'undefined',
  canvas: !!document.querySelector('canvas'),
  title: document.title,
}));
console.log(JSON.stringify({ ...state, errors, failed }));
await p.screenshot({ path: '/tmp/zip-smoke-menu.png' });
await browser.close();
