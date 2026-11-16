// Node harness (type-stripping, no build step) — Sushi Belt Frenzy.
// Runs the pure logic (src/logic.ts) for all 30 levels. Requires Node >= 22
// with type stripping (this VM runs Node 24: on by default).
//
// Deterministic gates (seed+0, no luck involved):
//   perfect  -> must WIN 3 stars | idle -> must LOSE
//   serveAll -> must NOT reach 3 stars (wasabi stuns + wrong cats punish)
// Statistical gates (3 seeds: +0, +1000, +2000 — luck averages out):
//   random   -> must 3-star in at most 1 of 3 runs (L2+; L1 is the
//               tutorial: one colour, every tap is correct by design, so a
//               fumbling first-timer SHOULD win it)
//   human    -> 0.5 s reaction + 1% fumbles + caution after a fumble, must
//               WIN >= 2 stars in at least 2 of 3 runs
// Exit 1 on any FAIL. Usage: node tools-local/harness-run.mts
import { LEVELS, levelSeed } from '../src/levels.ts';
import {
  simulatePerfect, simulateIdle, simulateRandom, simulateServeAll, simulateHuman,
} from '../src/logic.ts';

const SEEDS = [0, 1000, 2000];
let fails = 0;
console.log('Lv | perfect (outcome/stars/score/time) | idle | serveAll* | random 3* x/3 | human >=2* x/3');
for (const level of LEVELS) {
  const base = levelSeed(level.n);
  const p = simulatePerfect(level, base);
  const i = simulateIdle(level, base);
  const s = simulateServeAll(level, base);
  let random3 = 0;
  let humanWin = 0;
  for (const off of SEEDS) {
    const r = simulateRandom(level, base + off);
    if (r.stars === 3) random3++;
    const h = simulateHuman(level, base + off);
    if (h.outcome === 'won' && h.stars >= 2) humanWin++;
  }
  const marks: string[] = [];
  if (!(p.outcome === 'won' && p.stars === 3)) { marks.push('PERFECT-FAIL'); fails++; }
  if (i.outcome !== 'lost') { marks.push('IDLE-FAIL'); fails++; }
  if (s.stars === 3) { marks.push('SERVEALL-FAIL'); fails++; }
  if (level.n >= 2 && random3 >= 2) { marks.push('RANDOM-FAIL'); fails++; }
  if (humanWin < 2) { marks.push('HUMAN-FAIL'); fails++; }
  console.log(
    `L${String(level.n).padStart(2)} | ${p.outcome}/${p.stars}* ${p.score}pts ${p.durationSec}s ` +
    `| ${i.outcome} | ${s.outcome}/${s.stars}* | ${random3}/3 | ${humanWin}/3` +
    `${marks.length ? ' << ' + marks.join(',') : ''}`,
  );
}
console.log(fails === 0 ? 'HARNESS PASS: 30/30 levels' : `HARNESS FAIL: ${fails} failures`);
process.exit(fails === 0 ? 0 : 1);
