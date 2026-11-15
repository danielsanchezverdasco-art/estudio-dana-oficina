/* Probe 12: when does the favicon (badge-*.png) request abort? */
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:8931/index.html';
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const page = await ctx.newPage();
page.on('requestfailed', (r) => console.log('[failed]', r.url().split('/').pop(), r.failure()?.errorText));
page.on('request', (r) => { if (r.url().includes('badge')) console.log('[req]', r.url().split('/').pop()); });
page.on('response', (r) => { if (r.url().includes('badge')) console.log('[resp]', r.url().split('/').pop(), r.status()); });
console.log('--- load 1 ---');
await page.goto(BASE);
await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await sleep(2000);
console.log('--- reload ---');
await page.reload();
await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await sleep(2000);
console.log('--- done ---');
await browser.close();
