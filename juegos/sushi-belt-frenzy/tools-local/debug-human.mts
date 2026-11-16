// Debug: trace human-like play on one level to see why hearts are lost.
import { getLevel, levelSeed } from '../src/levels.ts';
import { BeltSim, mulberry32 } from '../src/logic.ts';

const n = Number(process.argv[2] ?? 6);
const fumbleRate = Number(process.argv[3] ?? 0.01);
const level = getLevel(n);
const sim = new BeltSim(level, levelSeed(n));
const rng = mulberry32(levelSeed(n) * 13 + 11);
const dt = 1 / 60;
let nextAct = 0.5;
let carefulLeft = 0;
let step = 0;
let attempts = 0;
while (sim.outcome === 'playing' && step < 180 * 60) {
  if (sim.time >= nextAct) {
    const actionable = sim.onBelt
      .filter((p) => p.def.kind === 'sushi' && sim.time >= sim.stunnedUntil[p.def.color])
      .sort((a, b) => b.x - a.x);
    if (actionable.length === 0) {
      nextAct = sim.time + 0.1;
    } else {
      const careful = carefulLeft > 0;
      nextAct = sim.time + (careful ? 0.8 : 0.5);
      const p = actionable[0];
      attempts++;
      if (!careful && rng() < fumbleRate) {
        const wrong = ([0, 1, 2].filter((c) => c !== p.def.color))[Math.floor(rng() * 2)];
        const r = sim.serve(p.def.id, wrong);
        carefulLeft = 3;
        console.log(`t=${sim.time.toFixed(1)} FUMBLE plate ${p.def.id} -> cat ${wrong} (${r}) hearts ${sim.hearts + 1}->${sim.hearts}`);
      } else {
        if (careful) carefulLeft -= 1;
        sim.tap(p.def.id);
      }
    }
  }
  const heartsBefore = sim.hearts;
  sim.step(dt);
  if (sim.hearts < heartsBefore) {
    console.log(`t=${sim.time.toFixed(1)} HEART LOST by exit: hearts ${heartsBefore}->${sim.hearts} missed=${sim.missed} served=${sim.served}`);
  }
  step++;
}
console.log(`FINAL L${n} fumble=${fumbleRate}: ${sim.outcome} stars=${sim.stars()} score=${sim.score} served=${sim.served} missed=${sim.missed} hearts=${sim.hearts} attempts=${attempts} time=${sim.time.toFixed(1)}`);
