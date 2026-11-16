// Rules tests for Traffic Chaos (node:test — no test runner install needed;
// the bundle is built with esbuild from vite's tree and run under plain node).
// Ported from Niky's prototype vitest suite (traffic.test.ts + tutorial.test.ts).
// They encode the design invariants INV-1..5 as executable checks:
//   INV-1 idle weak (score <= 10, ends <= 20 s)
//   INV-2 hold-only weak (gridlock or crash, score < skilled band)
//   INV-3 mashing weak (0.5 s cooldown, score below the skilled band)
//   INV-4 score is causal only (score == sum of 'cleared' event points)
//   INV-5 no permanent safety (holding one phase green forever gridlocks/crashes)
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  boostAll,
  boostCar,
  createRun,
  phaseGreenFor,
  seedFromDate,
  stepRun,
  timeLeft,
  toggleLights,
  type Run,
} from '../src/rules/traffic';
import { Tutorial, type TutorialStore } from '../src/rules/tutorial';
import { EASY_DIFFICULTY, NORMAL_DIFFICULTY } from '../src/config';
import { makePolicy, playPolicy } from '../src/sim/policies';

const DT = 1 / 60;

function runTo(run: Run, seconds: number): void {
  const steps = Math.round(seconds / DT);
  for (let i = 0; i < steps; i++) {
    stepRun(run, DT);
    if (run.status !== 'playing') return;
  }
}

describe('patience', () => {
  it('drains while stopped at red and runs the red at 0', () => {
    const run = createRun({ seed: 1, opening: 'level' });
    const taxi = run.cars.find((c) => c.type === 'taxi')!;
    assert.equal(taxi.patience, 2.0);
    runTo(run, 1.0);
    assert.ok(taxi.patience < 2.0);
    assert.equal(taxi.state, 'stopped');
    // At t=2.0 s the taxi runs the red; check just after, before it crashes
    // into the crossing EW car at ~t=2.5 s.
    runTo(run, 1.05);
    assert.ok(run.stats.ranRed >= 1);
    assert.equal(taxi.state, 'reckless');
  });

  it('a car driving freely keeps full patience', () => {
    const run = createRun({ seed: 1, opening: 'empty' });
    runTo(run, 5);
    const driven = run.cars.find((c) => c.state === 'driving');
    assert.ok(driven !== undefined);
    assert.equal(driven!.patience, 8);
  });
});

describe('crash', () => {
  it('the attract opening crashes at ~1 s with zero input (first frame = the crash)', () => {
    const run = createRun({ seed: 1, opening: 'attract' });
    let crashAt: number | null = null;
    let crashCars = 0;
    for (let i = 0; i < Math.round(3 / DT); i++) {
      const events = stepRun(run, DT);
      const crash = events.find((e) => e.type === 'crash');
      if (crash) {
        crashAt = run.time;
        crashCars = crash.cars.length;
        break;
      }
    }
    assert.equal(run.status, 'over');
    assert.equal(run.overReason, 'crash');
    assert.ok(crashAt !== null);
    assert.ok(crashAt! > 0.3);
    assert.ok(crashAt! < 2.0);
    assert.ok(crashCars >= 2);
  });

  it('the level opening crashes with zero input (the taxi runs the red into EW traffic)', () => {
    const run = createRun({ seed: 1, opening: 'level' });
    runTo(run, 10);
    assert.equal(run.status, 'over');
    assert.equal(run.overReason, 'crash');
  });

  it('flipping the light in time saves the taxi', () => {
    const run = createRun({ seed: 1, opening: 'level' });
    runTo(run, 0.4);
    const ev = toggleLights(run);
    assert.equal(ev?.type, 'toggle');
    // The phase flips at once, but the light is amber (all-red clearance 0.6 s):
    // N is not green yet during the clearance.
    assert.equal(run.phase, 'NS');
    assert.equal(phaseGreenFor(run, 'N'), false);
    runTo(run, 0.7);
    assert.equal(phaseGreenFor(run, 'N'), true);
    runTo(run, 5.3);
    assert.equal(run.status, 'playing');
    assert.ok(run.clears >= 1);
  });
});

describe('gridlock', () => {
  it('holding one phase green forever gridlocks or crashes the other axis (INV-5)', () => {
    const run = createRun({ seed: 7, opening: 'level' });
    runTo(run, 60);
    assert.equal(run.status, 'over');
    assert.ok(['gridlock', 'crash'].includes(run.overReason as string));
  });
});

describe('practice (tutorial sandbox)', () => {
  it('patience does not drain while practice is on (the player is learning, not being punished)', () => {
    const run = createRun({ seed: 1, opening: 'level' });
    run.practice = true;
    const taxi = run.cars.find((c) => c.type === 'taxi')!;
    assert.equal(taxi.patience, 2.0);
    runTo(run, 5);
    assert.equal(taxi.patience, 2.0);
    assert.equal(taxi.state, 'stopped');
    assert.equal(run.stats.ranRed, 0);
    assert.equal(run.status, 'playing');
  });

  it('the level cannot end while practice is on — no crash, no gridlock, no timer', () => {
    const run = createRun({ seed: 1, opening: 'level' });
    run.practice = true;
    runTo(run, 10);
    assert.equal(run.status, 'playing');
    assert.equal(run.overReason, null);
    // Past the 60 s duration: still playing, the timer is frozen in practice.
    runTo(run, 55);
    assert.ok(run.time >= 60);
    assert.equal(run.status, 'playing');
    assert.equal(run.overReason, null);
  });

  it('turning practice off resumes the real level (the same run can end)', () => {
    const run = createRun({ seed: 1, opening: 'level' });
    run.practice = true;
    runTo(run, 5);
    assert.equal(run.status, 'playing');
    run.practice = false;
    runTo(run, 10);
    assert.equal(run.status, 'over');
    assert.equal(run.overReason, 'crash');
  });
});

describe('timer and quota', () => {
  it('the level ends at 60 s (timer), not before', () => {
    const run = createRun({ seed: 1, opening: 'empty' });
    assert.equal(timeLeft(run), 60);
    // Fast-forward the clock to just before the deadline: the timer logic
    // (not the traffic) must end the level at 60 s.
    run.time = 59.9;
    const events = stepRun(run, 0.2);
    assert.notEqual(run.status, 'playing');
    assert.ok(events.some((e) => e.type === 'level-end'));
  });

  it('clearing a car scores points', () => {
    const r = createRun({ seed: 1, opening: 'level' });
    const policy = makePolicy('greedy-human');
    for (let i = 0; i < Math.round(30 / DT); i++) {
      policy(r, DT);
      stepRun(r, DT);
      if (r.status !== 'playing') break;
    }
    assert.ok(r.clears > 0);
    assert.ok(r.score > 0);
  });

  it('score is causal only: score == sum of cleared-event points (INV-4)', () => {
    const run = createRun({ seed: 3, opening: 'level' });
    let clearedPoints = 0;
    for (let i = 0; i < Math.round(60 / DT); i++) {
      toggleLights(run);
      const events = stepRun(run, DT);
      for (const e of events) {
        if (e.type === 'cleared') clearedPoints += e.points;
      }
      if (run.status !== 'playing') break;
    }
    assert.equal(run.score, clearedPoints);
  });
});

describe('cooldowns', () => {
  it('toggle cooldown 0.5 s denies mashing (INV-3)', () => {
    const run = createRun({ seed: 1, opening: 'level' });
    const first = toggleLights(run);
    assert.equal(first?.type, 'toggle');
    const denied = toggleLights(run);
    assert.equal(denied?.type, 'toggle-denied');
    runTo(run, 0.6);
    const ok = toggleLights(run);
    assert.equal(ok?.type, 'toggle');
  });

  it('boost-all has a 16 s cycle (4 s boost + 12 s cooldown)', () => {
    const run = createRun({ seed: 1, opening: 'level' });
    assert.equal(boostAll(run)?.type, 'boost-all');
    assert.equal(boostAll(run), null);
    run.time = 15.9;
    assert.equal(boostAll(run), null);
    run.time = 16.1;
    assert.equal(boostAll(run)?.type, 'boost-all');
  });

  it('boost-car has an 8 s cycle (3 s boost + 5 s cooldown)', () => {
    const run = createRun({ seed: 1, opening: 'level' });
    const car = run.cars[0];
    assert.equal(boostCar(run, car.id)?.type, 'boost-car');
    assert.equal(boostCar(run, car.id), null);
    run.time = 7.9;
    assert.equal(boostCar(run, car.id), null);
    run.time = 8.1;
    assert.equal(boostCar(run, car.id)?.type, 'boost-car');
  });
});

describe('determinism', () => {
  it('same seed + same policy -> same score; different seed -> different play', () => {
    assert.equal(playPolicy(42, 'greedy-human').score, playPolicy(42, 'greedy-human').score);
    assert.notEqual(playPolicy(42, 'greedy-human').score, playPolicy(43, 'greedy-human').score);
  });

  it('daily seed is stable for a date', () => {
    assert.equal(seedFromDate(new Date(2026, 10, 15)), 20261115);
    assert.equal(seedFromDate(new Date(2026, 10, 15)), seedFromDate(new Date(2026, 10, 15)));
  });
});

describe('difficulty (level 1 easy vs normal)', () => {
  it('defaults are the normal values (existing tests + balance bands unchanged)', () => {
    const run = createRun({ seed: 1, opening: 'level' });
    assert.deepEqual(run.difficulty, NORMAL_DIFFICULTY);
    assert.equal(run.cars[0].patience, 2.0); // opening taxi, normal
    assert.equal(timeLeft(run), 60);
  });

  it('easy level 1: patience 12, quota 15, opening taxi 6 s', () => {
    const run = createRun({ seed: 1, opening: 'level', difficulty: EASY_DIFFICULTY });
    assert.equal(run.difficulty.patienceMax, 12);
    assert.equal(run.difficulty.quota, 15);
    assert.equal(run.cars[0].patience, 6.0); // opening taxi: 6 s to learn the first tap
    assert.equal(run.cars[1].patience, 12); // queued car: full easy patience
  });

  it('easy spawns fewer cars in the first 10 s than normal (one decision at a time)', () => {
    const countSpawns = (difficulty: typeof EASY_DIFFICULTY) => {
      const run = createRun({ seed: 7, opening: 'empty', difficulty });
      let spawns = 0;
      for (let i = 0; i < 600; i++) {
        const evs = stepRun(run, DT);
        spawns += evs.filter((e) => e.type === 'spawn').length;
        if (run.status !== 'playing') break;
      }
      return spawns;
    };
    assert.ok(countSpawns(EASY_DIFFICULTY) < countSpawns(NORMAL_DIFFICULTY));
  });

  it('easy: a precise player still wins, idle still cannot (tutorial level, not a free win)', () => {
    const precise = playPolicy(1, 'precise', 'level', 60, EASY_DIFFICULTY);
    assert.equal(precise.status, 'won');
    const idle = playPolicy(1, 'idle', 'level', 60, EASY_DIFFICULTY);
    assert.notEqual(idle.status, 'won');
  });
});

describe('invariants (INV-1..3, headless)', () => {
  it('INV-1: idle is weak — score <= 10, ends <= 20 s', () => {
    const r = playPolicy(1, 'idle');
    assert.ok(r.score <= 10);
    assert.ok(r.time <= 20);
  });

  it('INV-2: hold-only is weak — ends in gridlock/crash with a low score', () => {
    const r = playPolicy(1, 'hold-only');
    assert.equal(r.status, 'over');
    assert.ok(['gridlock', 'crash'].includes(r.overReason as string));
  });

  it('INV-3: mashing is weak — scores below the skilled band', () => {
    const mash = playPolicy(1, 'mash-0.3s');
    const skilled = playPolicy(1, 'greedy-human');
    assert.ok(mash.score < skilled.score);
  });
});

function fakeStore(done = false): TutorialStore & { value: boolean } {
  const s = {
    value: done,
    get() {
      return s.value;
    },
    set(v: boolean) {
      s.value = v;
    },
  };
  return s;
}

describe('tutorial state machine', () => {
  it('starts at mission, auto-advances to light after 2.5 s', () => {
    const store = fakeStore();
    const t = new Tutorial(store);
    assert.equal(t.start(1000), 'mission');
    assert.equal(t.tick(1000 + 2499), 'mission');
    assert.equal(t.tick(1000 + 2500), 'light');
  });

  it('walks light -> swipe -> boost -> done in order', () => {
    const store = fakeStore();
    const t = new Tutorial(store);
    t.start(0);
    t.tick(3000);
    assert.equal(t.onLightTapped(), 'swipe');
    assert.equal(t.onCarBoosted(), 'boost');
    assert.equal(t.onBoostAll(), 'done');
    assert.equal(t.done, true);
    assert.equal(store.value, true);
  });

  it('a light tap during the mission beat only ends the beat', () => {
    const store = fakeStore();
    const t = new Tutorial(store);
    t.start(0);
    assert.equal(t.onLightTapped(), 'light');
    assert.equal(t.done, false);
  });

  it('events in the wrong step are ignored', () => {
    const store = fakeStore();
    const t = new Tutorial(store);
    t.start(0);
    t.tick(3000);
    assert.equal(t.onCarBoosted(), 'light'); // swiping before tapping the light does nothing
    assert.equal(t.onBoostAll(), 'light'); // BOOST before its step does nothing
    assert.equal(store.value, false);
  });

  it('SKIP finishes the tutorial and persists it', () => {
    const store = fakeStore();
    const t = new Tutorial(store);
    t.start(0);
    assert.equal(t.onSkip(), 'done');
    assert.equal(store.value, true);
  });

  it('never shows again once completed (even across instances)', () => {
    const store = fakeStore(true);
    const t = new Tutorial(store);
    assert.equal(t.start(0), 'done');
    assert.equal(t.done, true);
  });

  it('events after done are no-ops', () => {
    const store = fakeStore();
    const t = new Tutorial(store);
    t.start(0);
    t.onSkip();
    assert.equal(t.onLightTapped(), 'done');
    assert.equal(t.onCarBoosted(), 'done');
    assert.equal(t.onBoostAll(), 'done');
  });
});
