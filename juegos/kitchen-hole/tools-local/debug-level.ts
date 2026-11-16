// Debug: trace planRoute for one level, print every eat + the stall point.
// Usage: node tools-local/run-sim.mjs tools-local/debug-level.ts debugLevel
import { createSim, stepSim, KIND_STATS, FIT } from '../src/rules';
import { getLevel, toRules } from '../src/levels';

export function debugLevel(): number {
  const n = Number(process.argv[4] ?? 21);
  const level = getLevel(n);
  const sim = createSim(toRules(level), level.start);
  const dt = 1 / 60;
  let guard = 0;
  console.log(`L${n} ${level.name}: ${sim.total} objects, timeLimit ${level.timeLimit}s, pet ${level.pet ? level.pet.kind : 'none'}`);
  while (!sim.over && guard < 60 * 120) {
    guard += 1;
    let target: { x: number; y: number } | null = null;
    const live = sim.objects.filter((o) => !o.eaten);
    let best: { x: number; y: number; score: number; kind: string } | null = null;
    for (const o of live) {
      const stats = KIND_STATS[o.def.kind];
      if (stats.r > sim.hole.r * FIT) continue;
      const d = Math.hypot(o.x - sim.hole.x, o.y - sim.hole.y);
      const score = d + stats.r * 2;
      if (!best || score < best.score) best = { x: o.x, y: o.y, score, kind: o.def.kind };
    }
    if (best) target = { x: best.x, y: best.y };
    if (!target) {
      console.log(`STALL at t=${sim.elapsed.toFixed(2)}s hole r=${sim.hole.r.toFixed(1)} at (${sim.hole.x.toFixed(0)},${sim.hole.y.toFixed(0)}) eaten=${sim.eaten}/${sim.total}`);
      for (const o of live) {
        const s = KIND_STATS[o.def.kind];
        console.log(`  left: ${o.def.kind} r=${s.r} at (${o.x.toFixed(0)},${o.y.toFixed(0)}) needs hole r>=${(s.r / FIT).toFixed(1)}`);
      }
      return 1;
    }
    const events = stepSim(sim, target, dt);
    for (const e of events) {
      if (e.type === 'eat') console.log(`  t=${sim.elapsed.toFixed(2)} eat ${e.kind} +${e.coins} hole r=${sim.hole.r.toFixed(1)}`);
      if (e.type === 'steal') console.log(`  t=${sim.elapsed.toFixed(2)} STEAL -${e.amount}`);
      if (e.type === 'goldenSpawn') console.log(`  t=${sim.elapsed.toFixed(2)} golden spawned ${e.kind}`);
      if (e.type === 'goldenExpire') console.log(`  t=${sim.elapsed.toFixed(2)} golden EXPIRED`);
    }
  }
  console.log(`END won=${sim.won} stars=${sim.stars} timeUsed=${sim.elapsed.toFixed(1)} coins=${sim.coins} eaten=${sim.eaten}/${sim.total}`);
  return sim.won ? 0 : 1;
}
