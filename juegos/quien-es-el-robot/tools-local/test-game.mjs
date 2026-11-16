// Solver harness — Who Is the Robot? (ronda 1)
// Plays all 30 levels through the test handle: scan to the robot, wait for
// the reveal, tap it. Expects a win at 3 stars on every level.
// Usage: node test-game.mjs [workDir]   (workDir defaults to ../work)
// Requires: dist-test built (VITE_TEST_BUILD=1) + a static server on 8931
//   python3 -m http.server 8931 --directory work/dist-test
//   (run the server FIRST; this script does not start it)
// Output: test-results-r1-runN.md (full per-level detail, never piped to tail)
// Chromium: ~/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome
// If Chromium is dead (exit 133), the script reports BLOCKED and exits 2.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const WORK = process.argv[2] ?? path.resolve('..', 'work');
const URL = 'http://127.0.0.1:8931/index.html';
const RUN = process.argv[3] ?? '1';
const OUT = path.resolve('..', `test-results-r1-run${RUN}.md`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const lines = [];
  const log = (s) => { lines.push(s); console.log(s); };
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? undefined,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
  } catch (e) {
    log(`BLOCKED: Chromium failed to launch: ${e.message}`);
    fs.writeFileSync(OUT, `# Test results — Who Is the Robot? run ${RUN}\n\nBLOCKED: Chromium dead (${e.message}).\n`);
    process.exit(2);
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(1500);

  // UI checks (14, adapted from the r2 harness).
  const ui = [];
  const uiCheck = async (name, fn) => {
    try { const ok = await fn(); ui.push([name, ok]); log(`  UI ${ok ? 'PASS' : 'FAIL'} ${name}`); }
    catch (e) { ui.push([name, false]); log(`  UI FAIL ${name}: ${e.message}`); }
  };
  await uiCheck('game object exists', async () => await page.evaluate(() => !!window.__game));
  await uiCheck('menu visible', async () => await page.evaluate(() => document.querySelector('canvas') !== null));
  await uiCheck('startLevel(1) works', async () => {
    await page.evaluate(() => window.__game.startLevel(1));
    await sleep(800);
    const s = await page.evaluate(() => window.__game.state());
    return s.level === 1 && s.hearts === 3;
  });
  await uiCheck('robot position sane', async () => {
    const p = await page.evaluate(() => window.__game.robotPos());
    return p.x > 20 && p.x < 370 && p.y > 240 && p.y < 710;
  });
  await uiCheck('scan reveals the robot', async () => {
    const p = await page.evaluate(() => window.__game.robotPos());
    await page.evaluate((x, y) => window.__game.scan(x, y), p.x, p.y);
    await sleep(600);
    return await page.evaluate(() => window.__game.revealed());
  });

  // Level solver: 30 levels.
  const results = [];
  for (let level = 1; level <= 30; level++) {
    await page.evaluate((n) => window.__game.startLevel(n), level);
    await sleep(700);
    const t0 = Date.now();
    const sol = await page.evaluate((n) => window.__game.solution(n), level);
    await page.evaluate((x, y) => window.__game.scan(x, y), sol.x, sol.y);
    await sleep(600);
    const revealed = await page.evaluate(() => window.__game.revealed());
    let won = false;
    let stars = 0;
    if (revealed) {
      const p = await page.evaluate(() => window.__game.robotPos());
      await page.evaluate((x, y) => window.__game.tap(x, y), p.x, p.y);
      await sleep(900);
      const st = await page.evaluate(() => window.__game.state());
      won = st.over === true;
      stars = st.hearts ?? 0;
    }
    const secs = ((Date.now() - t0) / 1000).toFixed(1);
    results.push({ level, revealed, won, stars, secs });
    log(`  L${level}: revealed=${revealed} won=${won} stars=${stars} (${secs}s)`);
    // After a win the Result scene is up; the next startLevel() resets it.
  }

  const wonCount = results.filter((r) => r.won).length;
  const threeStar = results.filter((r) => r.won && r.stars === 3).length;
  log(`\nSUMMARY: ${wonCount}/30 won, ${threeStar}/30 at 3 stars, UI ${ui.filter((u) => u[1]).length}/${ui.length} pass, console errors: ${errors.length}`);

  const md = [
    `# Test results — Who Is the Robot? run ${RUN}`,
    ``,
    `Date: ${new Date().toISOString()}`,
    ``,
    `## UI checks (${ui.filter((u) => u[1]).length}/${ui.length} pass)`,
    ...ui.map(([n, ok]) => `- ${ok ? 'PASS' : 'FAIL'} ${n}`),
    ``,
    `## Levels (${wonCount}/30 won, ${threeStar}/30 at 3 stars)`,
    ...results.map((r) => `- L${r.level}: revealed=${r.revealed} won=${r.won} stars=${r.stars} (${r.secs}s)`),
    ``,
    `## Console errors (${errors.length})`,
    ...errors.map((e) => `- ${e}`),
    ``,
  ].join('\n');
  fs.writeFileSync(OUT, md);
  await browser.close();
  process.exit(wonCount === 30 && threeStar === 30 ? 0 : 1);
}

main().catch((e) => {
  console.error('HARNESS ERROR', e);
  process.exit(2);
});
