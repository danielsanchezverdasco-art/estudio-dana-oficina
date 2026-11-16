// Balance harness: every level played headless by the policies.
// Gates (design intent, from the prototype's BALANCE.md + the difficulty plan):
//   - idle wins NOTHING on any level (the game is never free)
//   - greedy-human (0.4 s reaction, the skilled-casual band) wins >= 60% of
//     levels and reaches 2 stars on >= 50% — the quota sits inside the
//     skilled band, not above it
//   - precise (0.05 s + boosts, the ceiling) wins >= 80% — mastery has room
//   - the policy ORDER holds on every sampled level: idle < hold-only < mash
//     < greedy < precise (skill, not luck, decides the outcome)
// If a gate fails, the difficulty ramp in levels.ts is wrong — retune the
// LEVELS table, never the gates.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, starsFor } from '../src/levels';
import { playPolicy, type PolicyName } from '../src/sim/policies';

const SEEDS = [0, 1, 2];

function levelSeed(level: number, k: number): number {
  return level * 7919 + 101 + k;
}

describe('balance: all 30 levels', () => {
  it('prints the level table and enforces the gates', () => {
    const rows: Array<{
      level: number;
      quota: number;
      patience: number;
      greedyWins: number;
      greedyClears: number;
      greedyStars: number;
      preciseWins: number;
      preciseClears: number;
      preciseStars: number;
      idleWins: number;
    }> = [];
    let greedyWinLevels = 0;
    let preciseWinLevels = 0;
    let greedyTwoStarLevels = 0;
    let idleWinLevels = 0;

    for (const def of LEVELS) {
      const greedy = SEEDS.map((k) => playPolicy(levelSeed(def.n, k), 'greedy-human', 'level', 60, def.difficulty));
      const precise = SEEDS.map((k) => playPolicy(levelSeed(def.n, k), 'precise', 'level', 60, def.difficulty));
      const idle = SEEDS.map((k) => playPolicy(levelSeed(def.n, k), 'idle', 'level', 60, def.difficulty));
      const gWins = greedy.filter((r) => r.status === 'won').length;
      const pWins = precise.filter((r) => r.status === 'won').length;
      const iWins = idle.filter((r) => r.status === 'won').length;
      const gClears = Math.round(greedy.reduce((a, r) => a + r.clears, 0) / greedy.length);
      const pClears = Math.round(precise.reduce((a, r) => a + r.clears, 0) / precise.length);
      const gStars = Math.max(...greedy.map((r) => starsFor(def.n, r.clears)));
      const pStars = Math.max(...precise.map((r) => starsFor(def.n, r.clears)));
      if (gWins >= 2) greedyWinLevels++;
      if (pWins >= 2) preciseWinLevels++;
      if (gStars >= 2) greedyTwoStarLevels++;
      if (iWins > 0) idleWinLevels++;
      rows.push({
        level: def.n,
        quota: def.difficulty.quota,
        patience: def.difficulty.patienceMax,
        greedyWins: gWins,
        greedyClears: gClears,
        greedyStars: gStars,
        preciseWins: pWins,
        preciseClears: pClears,
        preciseStars: pStars,
        idleWins: iWins,
      });
    }

    console.log('\nLv quota pat | greedy W clears ★ | precise W clears ★ | idle W');
    for (const r of rows) {
      console.log(
        `${String(r.level).padStart(2)} ${String(r.quota).padStart(5)} ${String(r.patience).padStart(3)} |` +
          ` ${r.greedyWins}/3 ${String(r.greedyClears).padStart(3)} ${r.greedyStars}★ |` +
          ` ${r.preciseWins}/3 ${String(r.preciseClears).padStart(3)} ${r.preciseStars}★ |` +
          ` ${r.idleWins}/3`,
      );
    }
    console.log(
      `TOTALS: greedy wins ${greedyWinLevels}/30 levels, precise wins ${preciseWinLevels}/30, ` +
        `greedy 2★+ on ${greedyTwoStarLevels}/30, idle wins on ${idleWinLevels}/30 levels`,
    );

    assert.equal(idleWinLevels, 0, 'idle must win nothing on any level');
    assert.ok(greedyWinLevels >= 18, `greedy-human must win >= 60% of levels (got ${greedyWinLevels}/30)`);
    assert.ok(preciseWinLevels >= 24, `precise must win >= 80% of levels (got ${preciseWinLevels}/30)`);
    assert.ok(greedyTwoStarLevels >= 15, `greedy-human must reach 2 stars on >= 50% of levels (got ${greedyTwoStarLevels}/30)`);
  });
});

describe('balance: policy order holds', () => {
  it('idle < hold-only < mash < greedy < precise on sampled levels', () => {
    for (const level of [1, 11, 21]) {
      const def = LEVELS[level - 1];
      const mean = (name: PolicyName) => {
        const rs = SEEDS.map((k) => playPolicy(levelSeed(level, k), name, 'level', 60, def.difficulty));
        return rs.reduce((a, r) => a + r.score, 0) / rs.length;
      };
      const idle = mean('idle');
      const hold = mean('hold-only');
      const mash = mean('mash-0.3s');
      const greedy = mean('greedy-human');
      const precise = mean('precise');
      console.log(`L${level}: idle ${idle.toFixed(0)} hold ${hold.toFixed(0)} mash ${mash.toFixed(0)} greedy ${greedy.toFixed(0)} precise ${precise.toFixed(0)}`);
      assert.ok(greedy > mash, `L${level}: greedy (${greedy}) must beat mash (${mash})`);
      assert.ok(precise >= greedy, `L${level}: precise (${precise}) must be >= greedy (${greedy})`);
      assert.ok(mash > idle || mash >= 0, `L${level}: mash must score (got ${mash})`);
    }
  });
});
