/* Film real gameplay for the Short + GIF (playgama-game-video skill).
 * Filmed from the TEST build (dist-test, port 8931) so the script can
 * wait on real GAME state instead of wall time — the headless loop is
 * slow (SwiftShader) and game time runs far slower than real time.
 * The test build differs from production ONLY by the invisible
 * window.__game debug handle (no visual difference, never on screen);
 * the production zip is what gets published. The footage is real
 * gameplay of the actual game code; the only staging is choosing the
 * levels (1 for the first win, 11 for Brooklyn Bridge, 21 for Central
 * Park) and the greedy auto-player (the same longest-queue /
 * most-urgent-patience rule as the headless greedy-human policy).
 * Playwright records video (webm); ffmpeg cuts the GIF (8-10 s,
 * >=12 fps, >=360 px, ending in victory) and the Short (1080x1920).
 * ffmpeg commands are printed at the end — run them after the film.
 */
import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';

const CHROME = process.env.HOME + '/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = '/tmp/film-tc';
const BASE = 'http://localhost:8931/index.html';

execSync(`mkdir -p ${OUT}/part1 ${OUT}/part2 ${OUT}/shots`, { stdio: 'inherit' });

async function waitFor(page, fn, timeoutMs, label) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    if (await page.evaluate(fn)) return true;
    await sleep(1000);
  }
  console.log('TIMEOUT waiting for:', label);
  return false;
}

/** Greedy auto-player: flip the light when the other axis has the longer
 *  queue or an urgent car, boost when the cooldown is ready and >=3 drive. */
async function autoPlay(page, timeoutMs = 90000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const st = await page.evaluate(() => {
      const g = window.__game?.state()?.game;
      if (!g || !g.run) return null;
      const cars = g.cars ?? [];
      const q = (dirs) => cars.filter((c) => dirs.includes(c.dir) && c.state === 'stopped').length;
      const qNS = q(['N', 'S']);
      const qEW = q(['E', 'W']);
      const urgent = cars.some((c) => c.state === 'stopped' && c.patience <= 2.5);
      const nsGreen = g.phase === 'NS';
      const wantsFlip = (qNS > qEW + 1 && !nsGreen) || (qEW > qNS + 1 && nsGreen) || (urgent && ((qNS > 0 && !nsGreen) || (qEW > 0 && nsGreen)));
      return { status: g.run.status, wantsFlip };
    });
    if (!st) return 'no-state';
    if (st.status !== 'playing') return st.status;
    if (st.wantsFlip) await page.evaluate(() => window.__game.toggle());
    await sleep(300);
  }
  return 'timeout';
}

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--disable-dev-shm-usage'] });

// ---- Part 1: menu + attract crash + level 1 win (the GIF + Short core) ----
const ctx1 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US', recordVideo: { dir: `${OUT}/part1`, size: { width: 390, height: 844 } } });
const p1 = await ctx1.newPage();
await p1.goto(BASE);
await p1.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
await p1.waitForFunction(() => window.__game.state().activeScenes.includes('Menu'), null, { timeout: 15000 });
await sleep(3000); // menu: taxis circulate, logo bounces
await p1.screenshot({ path: `${OUT}/shots/menu-en.png` });
await p1.touchscreen.tap(195, 560); // PLAY
await p1.waitForFunction(() => window.__game.state().activeScenes.includes('Game'), null, { timeout: 15000 });
await sleep(2600); // attract: the chain crash plays, then the play button
await p1.screenshot({ path: `${OUT}/shots/attract-crash.png` });
await p1.touchscreen.tap(195, 422); // start level 1
await sleep(3000); // tutorial: mission beat + light step
await p1.screenshot({ path: `${OUT}/shots/level1-tutorial.png` });
// Skip the tutorial (tap SKIP) so the film shows pure play.
await p1.touchscreen.tap(345, 60);
await sleep(500);
await p1.evaluate(() => window.__game.setTimeScale(2));
console.log('level 1 result:', await autoPlay(p1, 90000));
await p1.evaluate(() => window.__game.setTimeScale(1));
await sleep(1500); // result card: stars pop, coins
await p1.screenshot({ path: `${OUT}/shots/level1-result.png` });
await ctx1.close();

// ---- Part 2: neighbourhood openers — L11 Brooklyn Bridge, L21 Central Park ----
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, locale: 'en-US', recordVideo: { dir: `${OUT}/part2`, size: { width: 390, height: 844 } } });
const p2 = await ctx2.newPage();
for (const [n, name] of [[11, 'level11-brooklyn'], [21, 'level21-centralpark']]) {
  await p2.goto(BASE);
  await p2.waitForFunction(() => window.__game !== undefined, null, { timeout: 15000 });
  await p2.waitForFunction(() => window.__game.state().activeScenes.includes('Menu'), null, { timeout: 15000 });
  await p2.evaluate((n) => window.__game.startLevel(n), n);
  await p2.waitForFunction(() => window.__game.state().activeScenes.includes('Game'), null, { timeout: 15000 });
  await sleep(2500);
  await p2.screenshot({ path: `${OUT}/shots/${name}-start.png` });
  await p2.touchscreen.tap(195, 422); // start the level
  await sleep(1500);
  await p2.touchscreen.tap(345, 60); // skip tutorial
  await p2.evaluate(() => window.__game.setTimeScale(2));
  console.log(`${name} result:`, await autoPlay(p2, 90000));
  await p2.evaluate(() => window.__game.setTimeScale(1));
  await sleep(1200);
  await p2.screenshot({ path: `${OUT}/shots/${name}-result.png` });
}
await ctx2.close();

await browser.close();
console.log('FILM DONE — videos in', OUT);
console.log('--- ffmpeg (run after the film) ---');
console.log('# GIF 8-10 s, >=12 fps, >=360 px, ending in victory (from part1 webm):');
console.log(`ffmpeg -y -i ${OUT}/part1/*.webm -vf "fps=12,scale=390:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=256[p];[s1][p]paletteuse" -t 9 ${OUT}/traffic-chaos.gif`);
console.log('# Short 1080x1920, 26 s, silent (from part1 webm, menu+crash+win):');
console.log(`ffmpeg -y -i ${OUT}/part1/*.webm -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -t 26 -an ${OUT}/traffic-chaos-short.mp4`);
