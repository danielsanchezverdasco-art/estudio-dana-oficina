/* Anti-trivial tests — plan-dificultad-r2.md §5 (r2 invariants, measured
 * by simulation, not intuition).
 * (a) Solution wins in all 30 levels (also covered by test-game.mjs).
 * (b) Lazy ramp: ONE straight steel ramp from spawn to flag must NOT win
 *     any level from 6 on (a level winnable with one straight line is not
 *     a puzzle).
 * (c) Par band: the reference solution must use 85-100% of par in every
 *     level (par = optimal x 1.10, rounded to multiples of 5).
 * (d) Ink dominance: in every block of 5 levels (except block 1, which is
 *     steel-only by design), each ink (standard, elastic, boost) is the
 *     reference solution's ink in >= 1 level. Plus the swap proof: for
 *     every level whose solution uses elastic/boost, replaying the SAME
 *     strokes in steel must NOT win (the ink is doing real work).
 * (e) 0 px: no level is winnable without a functional ramp (micro-stroke
 *     in a corner, far from the dummy, just to enable LAUNCH).
 * Runs against the TEST build on http://localhost:8931. Writes
 * /tmp/ramp-antitrivial.json. Exit 1 on any failure. */
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const BASE = 'http://localhost:8931/index.html';
const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const results = { checks: {}, levels: {} };
function check(name, ok, detail = '') {
  results.checks[name] = { ok: !!ok, detail: String(detail) };
  console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? ' — ' + detail : ''));
}

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US' });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR', String(e).slice(0, 200)));

async function playStrokes(strokes) {
  for (const stroke of strokes) {
    const pts = stroke.pts.map(([x, y]) => ({ x, y }));
    await page.evaluate(([p, ink]) => window.__game.draw(p, ink), [pts, stroke.ink]);
    await sleep(120);
  }
  await page.evaluate(() => window.__game.launch());
}

/** Wait for a terminal outcome: 'won', 'lost', or 'timeout'. */
async function awaitOutcome(maxPolls = 120) {
  for (let i = 0; i < maxPolls; i++) {
    await sleep(400);
    const st = await page.evaluate(() => window.__game.state());
    const g = st?.game;
    if (!st) return { outcome: 'no-state', game: null };
    if (!st.activeScenes.includes('Game')) {
      const save = await page.evaluate(() => window.__game.save());
      return { outcome: 'result', game: g, save };
    }
    if (g && g.state === 'won') return { outcome: 'won', game: g };
    if (g && g.state === 'lost') return { outcome: 'lost', game: g };
  }
  return { outcome: 'timeout', game: await page.evaluate(() => window.__game.state().game) };
}

try {
  await page.goto(BASE);
  await page.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  await page.evaluate(() => window.__game.resetSave());
  await sleep(500);

  const solutionInks = {};
  let wins = 0;

  for (let n = 1; n <= 30; n++) {
    // (a) solution playback.
    await page.evaluate((lv) => window.__game.startLevel(lv), n);
    await sleep(700);
    await page.evaluate(() => window.__game.setTimeScale(2));
    const sol = await page.evaluate(() => window.__game.solution());
    solutionInks[n] = [...new Set(sol.map((s) => s.ink))];
    await playStrokes(sol);
    const a = await awaitOutcome();
    const inkUsed = a.game?.inkUsed ?? null;
    const par = a.game?.par ?? null;
    const okA = a.outcome === 'won' || a.outcome === 'result';
    if (okA) wins++;
    results.levels[n] = { solution: a.outcome, inkUsed, par };
    check(`L${n}_solution_wins`, okA, `outcome=${a.outcome} inkUsed=${inkUsed} par=${par}`);
    // (c) par band, only meaningful when the solution won.
    if (okA && inkUsed != null && par) {
      const ratio = inkUsed / par;
      const okC = ratio >= 0.85 && ratio <= 1.0;
      check(`L${n}_par_band`, okC, `optimal/par=${ratio.toFixed(3)} (inkUsed=${inkUsed}, par=${par})`);
      results.levels[n].parRatio = +ratio.toFixed(3);
    } else {
      check(`L${n}_par_band`, false, 'no winning solution to measure');
    }

    // (b) lazy ramp (levels 6+): one straight steel stroke spawn -> flag.
    if (n >= 6) {
      await page.evaluate((lv) => window.__game.startLevel(lv), n);
      await sleep(700);
      await page.evaluate(() => window.__game.setTimeScale(2));
      const solB = await page.evaluate(() => window.__game.solution());
      const stB = await page.evaluate(() => window.__game.state());
      const start = solB[0].pts[0];
      const goal = stB.game.goal;
      await playStrokes([{ pts: [[start[0], start[1]], [goal.x, goal.y]], ink: 'standard' }]);
      const b = await awaitOutcome(90);
      const okB = b.outcome !== 'won' && b.outcome !== 'result';
      check(`L${n}_lazy_ramp_loses`, okB, `lazy outcome=${b.outcome}`);
      results.levels[n].lazy = b.outcome;
    }

    // (e) 0 px: micro-stroke in a corner, far from the dummy, then launch.
    await page.evaluate((lv) => window.__game.startLevel(lv), n);
    await sleep(700);
    await page.evaluate(() => window.__game.setTimeScale(2));
    await playStrokes([{ pts: [[20, 150], [30, 150]], ink: 'standard' }]);
    const e = await awaitOutcome(60);
    const okE = e.outcome !== 'won' && e.outcome !== 'result';
    check(`L${n}_zero_px_loses`, okE, `0px outcome=${e.outcome}`);
    results.levels[n].zeroPx = e.outcome;
  }
  check('all_30_solutions_win', wins === 30, `${wins}/30 won`);

  // (d) dominance per block of 5 (block 1 exempt: steel-only tutorial).
  for (let block = 1; block < 6; block++) {
    const levels = [block * 5 + 1, block * 5 + 2, block * 5 + 3, block * 5 + 4, block * 5 + 5];
    const inks = new Set(levels.flatMap((n) => solutionInks[n]));
    const okD = ['standard', 'elastic', 'boost'].every((i) => inks.has(i));
    check(`block_${block + 1}_ink_dominance`, okD, `levels ${levels[0]}-${levels[4]} inks=[${[...inks].join(',')}]`);
  }

  // (d2) swap proof: non-standard solutions replayed in steel must lose.
  const swapLevels = Object.entries(solutionInks)
    .filter(([, inks]) => inks.some((i) => i !== 'standard'))
    .map(([n]) => Number(n));
  for (const n of swapLevels) {
    await page.evaluate((lv) => window.__game.startLevel(lv), n);
    await sleep(700);
    await page.evaluate(() => window.__game.setTimeScale(2));
    const sol = await page.evaluate(() => window.__game.solution());
    const steelSol = sol.map((s) => ({ ...s, ink: 'standard' }));
    await playStrokes(steelSol);
    const sw = await awaitOutcome();
    const okSw = sw.outcome !== 'won' && sw.outcome !== 'result';
    check(`L${n}_steel_swap_loses`, okSw, `steel-swap outcome=${sw.outcome} (solution inks: ${solutionInks[n].join(',')})`);
    results.levels[n].steelSwap = sw.outcome;
  }
} catch (e) {
  console.log('HARNESS ERROR', e);
  results.checks.harness = { ok: false, detail: String(e) };
} finally {
  await browser.close();
}

const failed = Object.values(results.checks).filter((c) => !c.ok);
console.log('\n=== ANTI-TRIVIAL SUMMARY ===');
console.log(`checks: ${Object.keys(results.checks).length}, failed: ${failed.length}`);
console.log(JSON.stringify(results, null, 2));
fs.writeFileSync('/tmp/ramp-antitrivial.json', JSON.stringify(results, null, 2));
process.exit(failed.length > 0 ? 1 : 0);
