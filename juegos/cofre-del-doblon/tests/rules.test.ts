import { describe, expect, it } from 'vitest';
import {
  bombPenalty,
  comboMultiplier,
  doubloonOddsText,
  levelConfig,
  pickSpawn,
  pointsFor,
  spawnWeights,
  starsFor,
} from '../src/rules/rules';

describe('levelConfig', () => {
  it('level 1 is friendly: 45 s, slow spawns, rare doubloon', () => {
    const c = levelConfig(1);
    expect(c.durationSec).toBe(45);
    expect(c.spawnIntervalMs).toBe(950);
    expect(c.upTimeMs).toBe(1500);
    expect(c.doubloonOneIn).toBe(500);
    expect(c.maxConcurrent).toBe(2);
    expect(c.bombChance).toBeCloseTo(0.08);
  });

  it('difficulty ramps and clamps', () => {
    const c10 = levelConfig(10);
    const c60 = levelConfig(60);
    expect(c10.spawnIntervalMs).toBeLessThan(950);
    expect(c10.upTimeMs).toBeLessThan(1500);
    expect(c10.doubloonOneIn).toBeLessThan(500);
    expect(c60.spawnIntervalMs).toBe(340);
    expect(c60.upTimeMs).toBeGreaterThanOrEqual(750);
    expect(c60.doubloonOneIn).toBeGreaterThanOrEqual(120);
    expect(c60.durationSec).toBe(60);
    expect(c60.maxConcurrent).toBe(5);
  });

  it('gold always sinks faster than a normal chest', () => {
    for (const l of [1, 5, 15, 30, 60]) {
      const c = levelConfig(l);
      expect(c.goldUpTimeMs).toBeLessThan(c.upTimeMs);
    }
  });
});

describe('comboMultiplier', () => {
  it('starts at 1x, grows 10% per hit, caps at 3x', () => {
    expect(comboMultiplier(0)).toBe(1);
    expect(comboMultiplier(5)).toBeCloseTo(1.5);
    expect(comboMultiplier(20)).toBeCloseTo(3);
    expect(comboMultiplier(99)).toBeCloseTo(3);
  });
});

describe('pointsFor', () => {
  it('chest values with combo and luck', () => {
    expect(pointsFor('wood', 0, 1)).toBe(10);
    expect(pointsFor('silver', 0, 1)).toBe(25);
    expect(pointsFor('gold', 0, 1)).toBe(50);
    expect(pointsFor('wood', 10, 1)).toBe(20); // 2x combo
    expect(pointsFor('wood', 0, 2)).toBe(20); // luck x2
    expect(pointsFor('crab', 0, 1)).toBe(5);
    expect(pointsFor('doubloon', 0, 1)).toBe(500);
    expect(pointsFor('bomb', 5, 2)).toBe(0);
  });
});

describe('starsFor', () => {
  it('thresholds map to 0-3 stars', () => {
    const t: [number, number, number] = [100, 200, 300];
    expect(starsFor(0, t)).toBe(0);
    expect(starsFor(99, t)).toBe(0);
    expect(starsFor(100, t)).toBe(1);
    expect(starsFor(199, t)).toBe(1);
    expect(starsFor(200, t)).toBe(2);
    expect(starsFor(300, t)).toBe(3);
    expect(starsFor(9999, t)).toBe(3);
  });
});

describe('spawnWeights / pickSpawn', () => {
  it('weights sum to ~1', () => {
    for (const l of [1, 10, 30]) {
      const w = spawnWeights(levelConfig(l));
      const sum = w.wood + w.silver + w.gold + w.bomb + w.crab + w.doubloon;
      expect(sum).toBeCloseTo(1, 6);
      expect(w.doubloon).toBeCloseTo(1 / levelConfig(l).doubloonOneIn, 6);
    }
  });

  it('pickSpawn is deterministic for a given rng', () => {
    const w = spawnWeights(levelConfig(1));
    expect(pickSpawn(0, w)).toBe('wood');
    expect(pickSpawn(0.999, w)).toBe('doubloon');
    expect(pickSpawn(0.5, w)).toBe(pickSpawn(0.5, w));
  });

  it('doubloon rate matches the visible counter over many draws', () => {
    const w = spawnWeights(levelConfig(1));
    let doubloons = 0;
    const N = 200000;
    // deterministic pseudo-random sequence (mulberry32)
    let seed = 12345;
    const rnd = () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = 0; i < N; i++) {
      if (pickSpawn(rnd(), w) === 'doubloon') doubloons++;
    }
    const observed = N / doubloons;
    // expected 1 in 500, allow +-15% sampling noise
    expect(observed).toBeGreaterThan(425);
    expect(observed).toBeLessThan(575);
  });
});

describe('bombPenalty / doubloonOddsText', () => {
  it('bomb costs one life and resets the combo', () => {
    expect(bombPenalty()).toEqual({ livesLost: 1, comboReset: true });
  });
  it('odds text is honest', () => {
    expect(doubloonOddsText(500)).toBe('1 in 500');
  });
});
