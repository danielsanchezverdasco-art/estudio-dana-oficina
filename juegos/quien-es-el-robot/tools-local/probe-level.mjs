// Probe one level — Who Is the Robot?
// Usage: node probe-level.mjs <level> [workDir]
// Loads dist-test, starts the level, scans to the robot, reports the reveal
// + tap outcome and the full test-handle state. For diagnosing one level.
import { chromium } from 'playwright-core';

const LEVEL = Number(process.argv[2] ?? 1);
const URL = 'http://127.0.0.1:8931/index.html';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  } catch (e) {
    console.log(`BLOCKED: Chromium dead (${e.message})`);
    process.exit(2);
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', (e) => console.log('pageerror:', e.message));
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(1200);
  await page.evaluate((n) => window.__game.startLevel(n), LEVEL);
  await sleep(700);
  const sol = await page.evaluate((n) => window.__game.solution(n), LEVEL);
  console.log('solution (seeded robot slot):', JSON.stringify(sol));
  const pos0 = await page.evaluate(() => window.__game.robotPos());
  console.log('robotPos before scan:', JSON.stringify(pos0));
  await page.evaluate((x, y) => window.__game.scan(x, y), sol.x, sol.y);
  await sleep(600);
  console.log('revealed:', await page.evaluate(() => window.__game.revealed()));
  const pos1 = await page.evaluate(() => window.__game.robotPos());
  await page.evaluate((x, y) => window.__game.tap(x, y), pos1.x, pos1.y);
  await sleep(900);
  console.log('state after tap:', JSON.stringify(await page.evaluate(() => window.__game.state())));
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(2); });
