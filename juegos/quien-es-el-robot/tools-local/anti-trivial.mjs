// Anti-trivial checks — Who Is the Robot? (ronda 1)
// Part A (pure, no browser): re-runs test-levels.mjs invariants.
// Part B (browser, needs dist-test + server 8931 + live Chromium):
//   1. No-scan win is impossible: tap the robot BEFORE scanning -> no win,
//      no heart lost (dodge + toast).
//   2. Spray-tap loses: 3 taps on random people -> fail, no win.
//   3. Idle loses: wait out the timer -> fail (checked on L30, 25 s).
// Usage: node anti-trivial.mjs [workDir]
// Exit 0 = all pass. Exit 2 = Chromium blocked (report, don't fake).
import { chromium } from 'playwright-core';
import { spawnSync } from 'node:child_process';

const URL = 'http://127.0.0.1:8931/index.html';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

console.log('== Part A: pure invariants ==');
const pure = spawnSync('node', ['--experimental-strip-types', 'test-levels.mjs'], { encoding: 'utf8' });
console.log(pure.stdout);
if (pure.status !== 0) { console.log('Part A FAILED'); process.exit(1); }

console.log('== Part B: browser anti-trivial ==');
let browser;
try {
  browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
} catch (e) {
  console.log(`BLOCKED: Chromium dead (${e.message}) — Part B not run, do not present as verified.`);
  process.exit(2);
}
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
await sleep(1200);

let pass = 0, fail = 0;
const check = (name, ok) => { console.log(`  ${ok ? 'PASS' : 'FAIL'} ${name}`); ok ? pass++ : fail++; };

// 1. No-scan tap on the robot must NOT win and must NOT cost a heart.
await page.evaluate(() => window.__game.startLevel(5));
await sleep(700);
const robot = await page.evaluate(() => window.__game.robotPos());
await page.evaluate((x, y) => window.__game.tap(x, y), robot.x, robot.y);
await sleep(500);
let st = await page.evaluate(() => window.__game.state());
check('no-scan tap: no win', st.over === false);
check('no-scan tap: hearts still 3', st.hearts === 3);
check('no-scan tap: not revealed', st.revealed === false);

// 2. Spray-tap: 3 taps on people (not the robot) -> fail.
await page.evaluate(() => window.__game.startLevel(5));
await sleep(700);
for (let i = 0; i < 3; i++) {
  // Tap far from the robot: corners of the crowd area.
  const spots = [{ x: 40, y: 300 }, { x: 350, y: 500 }, { x: 60, y: 650 }];
  await page.evaluate((s) => window.__game.tap(s.x, s.y), spots[i]);
  await sleep(400);
}
st = await page.evaluate(() => window.__game.state());
check('spray-tap: level over (fail)', st.over === true);
check('spray-tap: hearts 0', st.hearts === 0);

// 3. Idle loses on L30 (25 s timer) — wait it out.
await page.evaluate(() => window.__game.startLevel(30));
await sleep(700);
await sleep(26000);
st = await page.evaluate(() => window.__game.state());
check('idle: level over after timer', st.over === true);

console.log(`\nPart B RESULT: ${pass} passed, ${fail} failed`);
await browser.close();
process.exit(fail ? 1 : 0);
