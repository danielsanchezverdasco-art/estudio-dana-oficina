// Unit tests for the pure rules (node:assert, no test framework).
// Run: node tools-local/run-sim.mjs tests/rules.test.ts runTests
// (esbuild bundles in memory; nothing is written to disk.)
import assert from 'node:assert/strict';
import {
  createSim, stepSim, starsFor, sizeOf, KIND_STATS, FIT,
  type LevelRules, type ObjDef,
} from '../src/rules';
import { LEVELS, getLevel, planRoute } from '../src/levels';

const DT = 1 / 60;

function tinyLevel(objects: ObjDef[], timeLimit = 60): LevelRules {
  return { timeLimit, startRadius: 13, objects, pet: null, goldenSpawns: [] };
}

function stepUntil(sim: ReturnType<typeof createSim>, target: { x: number; y: number } | null, seconds: number): void {
  const steps = Math.round(seconds / DT);
  for (let i = 0; i < steps && !sim.over; i++) stepSim(sim, target, DT);
}

export function runTests(): number {
  let n = 0;
  const check = (name: string, fn: () => void): void => {
    n += 1;
    fn();
    console.log(`ok ${n} - ${name}`);
  };

  check('createSim starts clean', () => {
    const sim = createSim(tinyLevel([{ id: 1, kind: 'crumb', x: 100, y: 200 }]), { x: 195, y: 700 });
    assert.equal(sim.coins, 0);
    assert.equal(sim.timeLeft, 60);
    assert.equal(sim.total, 1);
    assert.equal(sim.over, false);
  });

  check('swallow: crumb under the hole is eaten, coins +5, hole grows', () => {
    const sim = createSim(tinyLevel([{ id: 1, kind: 'crumb', x: 195, y: 700 }]), { x: 195, y: 700 });
    const r0 = sim.hole.r;
    const events = stepSim(sim, { x: 195, y: 700 }, DT);
    assert.equal(sim.eaten, 1);
    assert.equal(sim.coins, 5);
    assert.ok(sim.hole.r > r0);
    assert.ok(events.some((e) => e.type === 'eat' && e.coins === 5));
    assert.ok(sim.over && sim.won);
  });

  check('fit rule: cup (r16) does not fit in a SIZE 13 hole', () => {
    const sim = createSim(tinyLevel([{ id: 1, kind: 'cup', x: 195, y: 700 }]), { x: 195, y: 700 });
    const events = stepSim(sim, { x: 195, y: 700 }, DT);
    assert.equal(sim.eaten, 0);
    assert.ok(events.some((e) => e.type === 'tooBig'));
    assert.equal(sim.over, false);
    // After eating 6 crumbs the hole grows past the cup's fit threshold.
    assert.ok(13 <= 16 / FIT); // sanity: cup needs r >= 14.55
  });

  check('growth unlocks bigger objects', () => {
    const objs: ObjDef[] = [
      { id: 1, kind: 'crumb', x: 195, y: 700 },
      { id: 2, kind: 'crumb', x: 195, y: 690 },
      { id: 3, kind: 'crumb', x: 195, y: 680 },
      { id: 4, kind: 'crumb', x: 195, y: 670 },
      { id: 5, kind: 'crumb', x: 195, y: 660 },
      { id: 6, kind: 'crumb', x: 195, y: 650 },
      { id: 7, kind: 'cup', x: 195, y: 620 },
    ];
    const sim = createSim(tinyLevel(objs), { x: 195, y: 700 });
    stepUntil(sim, { x: 195, y: 650 }, 2);
    assert.ok(sim.eaten >= 6, `ate ${sim.eaten}, expected >= 6`);
    assert.ok(sim.hole.r >= 16 / FIT, `hole r ${sim.hole.r} must fit the cup`);
    stepUntil(sim, { x: 195, y: 620 }, 2);
    assert.equal(sim.eaten, 7);
    assert.ok(sim.won);
  });

  check('idle loses on the timer', () => {
    const sim = createSim(tinyLevel([{ id: 1, kind: 'crumb', x: 100, y: 200 }], 5), { x: 195, y: 700 });
    stepUntil(sim, null, 6);
    assert.ok(sim.over && !sim.won);
    assert.equal(sim.stars, 0);
  });

  check('starsFor thresholds', () => {
    assert.equal(starsFor(20, 1, 1), 3);
    assert.equal(starsFor(15, 2, 2), 3);
    assert.equal(starsFor(20, 0, 1), 2); // golden missed: no 3 stars
    assert.equal(starsFor(10, 1, 1), 2);
    assert.equal(starsFor(5, 1, 1), 2);
    assert.equal(starsFor(4, 1, 1), 1);
    assert.equal(starsFor(0.5, 0, 0), 1);
  });

  check('sizeOf is the rounded radius', () => {
    assert.equal(sizeOf(13), 13);
    assert.equal(sizeOf(13.6), 14);
  });

  check('pet steals coins on touch, then cools down', () => {
    const level = tinyLevel([{ id: 1, kind: 'crumb', x: 195, y: 700 }]);
    level.pet = {
      kind: 'cat', x: 195, y: 700, patrol: [{ x: 195, y: 700 }], speed: 10, steal: 20, cooldown: 5,
    };
    const sim = createSim(level, { x: 195, y: 700 });
    // One step: the crumb is eaten (+5) and the pet, already touching the
    // hole, steals them in the same step (eat runs before steal).
    const events = stepSim(sim, { x: 195, y: 700 }, DT);
    assert.ok(events.some((e) => e.type === 'eat' && e.coins === 5), 'crumb eaten');
    assert.ok(events.some((e) => e.type === 'steal' && e.amount === 5), 'pet steals all 5 coins');
    assert.equal(sim.coins, 0);
    // Still overlapping, but on cooldown: no second steal.
    const events2 = stepSim(sim, { x: 195, y: 700 }, DT);
    assert.ok(!events2.some((e) => e.type === 'steal'));
  });

  check('golden spawns mid-level and expires after 8 s', () => {
    const level = tinyLevel([{ id: 1, kind: 'crumb', x: 100, y: 200 }], 60);
    level.goldenSpawns = [{ at: 2, x: 195, y: 500, kind: 'croissant' }];
    const sim = createSim(level, { x: 195, y: 700 });
    stepUntil(sim, null, 1.5);
    assert.equal(sim.objects.length, 1);
    stepUntil(sim, null, 1);
    assert.equal(sim.objects.length, 2, 'golden spawned');
    assert.ok(sim.objects[1].def.golden);
    stepUntil(sim, null, 8.5);
    assert.ok(sim.objects[1].eaten, 'golden expired');
    assert.equal(sim.eaten, 0, 'expired golden was not eaten');
  });

  check('golden eaten pays x3', () => {
    const level = tinyLevel([], 60);
    level.goldenSpawns = [{ at: 0, x: 195, y: 700, kind: 'croissant' }];
    const sim = createSim(level, { x: 195, y: 700 });
    // The golden spawns AND is swallowed in the same first step (the hole
    // is already on top of it).
    const events = stepSim(sim, { x: 195, y: 700 }, DT);
    assert.equal(sim.objects.length, 1);
    assert.ok(events.some((e) => e.type === 'goldenSpawn'), 'golden spawned');
    assert.ok(events.some((e) => e.type === 'eat' && e.coins === KIND_STATS.croissant.value * 3), 'golden pays x3');
    assert.equal(sim.coins, KIND_STATS.croissant.value * 3);
    assert.ok(sim.won);
  });

  check('mover patrols its path', () => {
    const level = tinyLevel([
      { id: 1, kind: 'apple', x: 100, y: 200, mover: { path: [{ x: 100, y: 200 }, { x: 300, y: 200 }], speed: 50 } },
    ]);
    const sim = createSim(level, { x: 195, y: 700 });
    const x0 = sim.objects[0].x;
    stepUntil(sim, null, 1);
    assert.ok(sim.objects[0].x > x0 + 20, `mover moved ${x0} -> ${sim.objects[0].x}`);
  });

  check('hole clamps inside the playfield', () => {
    const sim = createSim(tinyLevel([]), { x: 195, y: 700 });
    stepSim(sim, { x: -500, y: -500 }, 1);
    assert.ok(sim.hole.x >= 0 && sim.hole.y >= 110);
    stepSim(sim, { x: 9999, y: 9999 }, 1);
    assert.ok(sim.hole.x <= 390 && sim.hole.y <= 768);
  });

  check('planRoute wins L1', () => {
    const r = planRoute(getLevel(1));
    assert.ok(r.won, `L1 solution won=${r.won}`);
    assert.ok(r.timeUsed < 60);
  });

  check('planRoute wins L6 (first pet level)', () => {
    const r = planRoute(getLevel(6));
    assert.ok(r.won, `L6 solution won=${r.won}`);
  });

  check('planRoute wins L21 (first fridge level)', () => {
    const r = planRoute(getLevel(21));
    assert.ok(r.won, `L21 solution won=${r.won} timeUsed=${r.timeUsed.toFixed(1)}`);
  });

  check('planRoute wins L30 (finale)', () => {
    const r = planRoute(getLevel(30));
    assert.ok(r.won, `L30 solution won=${r.won} timeUsed=${r.timeUsed.toFixed(1)}`);
  });

  check('all 30 levels have a kitchen, a timer and objects', () => {
    assert.equal(LEVELS.length, 30);
    for (const lv of LEVELS) {
      assert.ok(lv.objects.length >= 8, `L${lv.n} has ${lv.objects.length} objects`);
      assert.ok(lv.timeLimit >= 60 && lv.timeLimit <= 75);
      assert.ok(lv.kitchen.length > 0);
    }
  });

  console.log(`\nALL ${n} UNIT TESTS PASSED`);
  return 0;
}
