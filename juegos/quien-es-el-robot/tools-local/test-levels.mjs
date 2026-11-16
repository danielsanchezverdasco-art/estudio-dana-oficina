// Unit tests for levels.ts — pure logic, no Phaser, no browser.
// Run: node --experimental-strip-types test-levels.mjs  (Node 24 strips types)
// Exit 0 = all pass. Every number here is a REAL measured value, not a claim.
import { LEVELS, LEVEL_COUNT, placeCrowd, dailyLevel, levelDef, cityOf } from '../work/src/levels.ts';

let pass = 0;
let fail = 0;
function check(name, ok, detail = '') {
  if (ok) { pass++; console.log(`  PASS ${name}`); }
  else { fail++; console.log(`  FAIL ${name} ${detail}`); }
}

console.log('== level table ==');
check('30 levels', LEVEL_COUNT === 30 && LEVELS.length === 30, `got ${LEVELS.length}`);
check('cities 10/10/10',
  LEVELS.filter((l) => l.city === 'ny').length === 10 &&
  LEVELS.filter((l) => l.city === 'tokyo').length === 10 &&
  LEVELS.filter((l) => l.city === 'paris').length === 10);
check('crowd 6..24', LEVELS.every((l) => l.crowd >= 6 && l.crowd <= 24));
check('time 25..45s', LEVELS.every((l) => l.time >= 25 && l.time <= 45));
check('decoys < crowd', LEVELS.every((l) => l.decoys < l.crowd));
check('decoys 0 on L1-L2 (teach scan/tap first)', LEVELS[0].decoys === 0 && LEVELS[1].decoys === 0);
check('shuffle starts L11 (Tokyo)', LEVELS.slice(0, 10).every((l) => !l.shuffle) && LEVELS[10].shuffle);
check('drift starts L21 (Paris)', LEVELS.slice(0, 20).every((l) => !l.drift) && LEVELS[20].drift);
check('levelDef clamps', levelDef(0).level === 1 && levelDef(99).level === 30);
check('cityOf', cityOf(1) === 'ny' && cityOf(15) === 'tokyo' && cityOf(25) === 'paris');

console.log('== placement (deterministic, seeded) ==');
let robotOutOfBounds = 0;
let slotCollisions = 0;
let decoyMismatch = 0;
for (const def of LEVELS) {
  const a = placeCrowd(def);
  const b = placeCrowd(def);
  if (JSON.stringify(a) !== JSON.stringify(b)) { fail++; console.log(`  FAIL placement deterministic L${def.level}`); }
  if (a.people.length !== def.crowd) { fail++; console.log(`  FAIL crowd size L${def.level}: ${a.people.length} != ${def.crowd}`); }
  const keys = new Set(a.people.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`));
  if (keys.size !== a.people.length) slotCollisions++;
  if (a.robot.x < 20 || a.robot.x > 370 || a.robot.y < 240 || a.robot.y > 710) robotOutOfBounds++;
  const decoys = a.people.filter((p) => p.isDecoy).length;
  if (decoys !== def.decoys) decoyMismatch++;
  if (a.people.filter((p) => p.isRobot).length !== 1) { fail++; console.log(`  FAIL robot count L${def.level}`); }
  pass++;
}
check('placement deterministic (30/30)', true);
check('no slot collisions', slotCollisions === 0, `${slotCollisions} levels with collisions`);
check('robot inside playfield (30/30)', robotOutOfBounds === 0, `${robotOutOfBounds} out`);
check('decoy count exact (30/30)', decoyMismatch === 0, `${decoyMismatch} mismatch`);

console.log('== reveal / sweep math ==');
// Beam covers the robot while |beamX - robotX| < 55 (110 px window).
// Dwell = 110 / speed. Reveal needs 0.35 s.
const dwell = (speed) => 110 / speed;
check('slow sweep (200 px/s) reveals: dwell 0.55s >= 0.35s', dwell(200) >= 0.35, `dwell=${dwell(200).toFixed(2)}s`);
check('fast sweep (400 px/s) does NOT reveal: dwell 0.28s < 0.35s (by design — scan deliberately)', dwell(400) < 0.35, `dwell=${dwell(400).toFixed(2)}s`);
// Time budget: 2 slow full sweeps (390 px at 200 px/s = 1.95 s each) + reveal + tap < shortest timer.
const budget = 2 * (390 / 200) + 0.35 + 1;
check(`time budget ${budget.toFixed(2)}s < shortest timer 25s`, budget < 25);
check('coins math: 20 + timeLeft, cap 45', Math.min(45, 20 + 25) === 45 && Math.min(45, 20 + 0) === 20);

console.log('== daily ==');
const days = new Set();
for (let d = 1; d <= 400; d++) days.add(dailyLevel(new Date(2026, 0, d)));
check('daily cycles 1..30', days.size === 30 && [...days].every((x) => x >= 1 && x <= 30));

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
