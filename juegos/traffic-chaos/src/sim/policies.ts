// Balance policies for Traffic Chaos (evaluating-gameplay-balance).
// Ported verbatim from Niky's prototype (dana-games-juegos, branch
// niky/traffic-chaos-prototipo, src/sim/policies.ts).
// Each policy is a pure function over the sim: it reads the run, may call named
// actions (toggleLights / boostCar / boostAll), and keeps its own reaction state.
// The harness (scripts/balance.ts) runs each policy n>=5 times per seed and reports
// min-max bands; the tests use the same policies so the invariants are executable.
// Policies (balance policy `traffic-chaos-proto-v1`):
//   idle          — never touches anything (INV-1: must be weak)
//   hold-only     — flips to NS once, then never (INV-2: must gridlock/crash)
//   mash-0.3s     — toggles every 0.3 s (INV-3: cooldown must keep it weak)
//   greedy-human  — 0.4 s reaction, flips to the longest queue / most urgent patience
//   precise       — 0.05 s reaction + boosts; the ceiling the game must reward

import { boostAll, boostCar, createRun, phaseGreenFor, queueCount, stepRun, toggleLights, type Run } from '../rules/traffic';
import type { Difficulty } from '../config';

export type PolicyName = 'idle' | 'hold-only' | 'mash-0.3s' | 'greedy-human' | 'precise';

export type Policy = (run: Run, dt: number) => void;

const DT = 1 / 60;

/** Longest-queue + most-urgent-patience flip, with a reaction delay and a
 * minimum green time (hysteresis): a skilled player does not flip-flop — every
 * flip costs 0.6 s of all-red clearance, so short greens waste the level.
 * A desperate car (patience <= 1.5 s) bypasses the minimum green. */
function greedyPolicy(reaction: number, useBoosts: boolean, minGreen: number): Policy {
  let conditionSince: number | null = null;
  let lastFlipAt = -10;
  let mashTimer = 0;
  return (run: Run, dt: number) => {
    if (run.status !== 'playing') return;
    mashTimer += dt;
    const qNS = queueCount(run, 'N') + queueCount(run, 'S');
    const qEW = queueCount(run, 'E') + queueCount(run, 'W');
    const nsGreen = phaseGreenFor(run, 'N');
    const urgent = run.cars.some(
      (c) => c.state === 'stopped' && c.patience <= 2.5 && c.travel < 400,
    );
    const desperate = run.cars.some((c) => c.state === 'stopped' && c.patience <= 1.5);
    const wantsNS = qNS > qEW + 1 || (urgent && !nsGreen && qNS > 0);
    const wantsEW = qEW > qNS + 1 || (urgent && nsGreen && qEW > 0);
    const wantsFlip = (wantsNS && !nsGreen) || (wantsEW && nsGreen);
    const canFlip = run.time - lastFlipAt >= minGreen || desperate;
    if (wantsFlip && canFlip) {
      if (conditionSince === null) conditionSince = run.time;
      if (run.time - conditionSince >= reaction) {
        if (toggleLights(run)?.type === 'toggle') lastFlipAt = run.time;
        conditionSince = null;
      }
    } else {
      conditionSince = null;
    }
    if (useBoosts && mashTimer >= 0.5) {
      mashTimer = 0;
      // Boost the most urgent stopped car that is about to move, else boost all
      // when three or more cars are driving through the box.
      const driving = run.cars.filter((c) => c.state === 'driving').length;
      if (driving >= 3) boostAll(run);
      const urgentCar = run.cars
        .filter((c) => c.state === 'driving' && c.patience <= 3)
        .sort((a, b) => a.patience - b.patience)[0];
      if (urgentCar) boostCar(run, urgentCar.id);
    }
  };
}

export function makePolicy(name: PolicyName): Policy {
  switch (name) {
    case 'idle':
      return () => {};
    case 'hold-only': {
      let flipped = false;
      return (run: Run) => {
        if (!flipped && run.status === 'playing') {
          toggleLights(run);
          flipped = true;
        }
      };
    }
    case 'mash-0.3s': {
      let timer = 0;
      return (run: Run, dt: number) => {
        timer += dt;
        if (timer >= 0.3) {
          timer = 0;
          toggleLights(run);
        }
      };
    }
    case 'greedy-human':
      return greedyPolicy(0.4, false, 2.0);
    case 'precise':
      return greedyPolicy(0.05, true, 2.5);
  }
}

export interface PlayResult {
  run: Run;
  score: number;
  clears: number;
  time: number;
  status: Run['status'];
  overReason: Run['overReason'];
  events: number;
}

/** Play one full level (60 s max) headless with a policy. */
export function playPolicy(
  seed: number,
  policyName: PolicyName,
  opening: 'level' | 'empty' = 'level',
  seconds = 60,
  difficulty?: Partial<Difficulty>,
): PlayResult {
  const run = createRun({ seed, opening, difficulty });
  const policy = makePolicy(policyName);
  let events = 0;
  // 60.5 s of steps: the 1/60 float accumulation can land at 59.9999… after
  // exactly 3600 steps, so give the level-end check slack to resolve.
  const steps = Math.round((seconds + 0.5) / DT);
  for (let i = 0; i < steps; i++) {
    policy(run, DT);
    events += stepRun(run, DT).length;
    if (run.status !== 'playing') break;
  }
  return {
    run,
    score: run.score,
    clears: run.clears,
    time: run.time,
    status: run.status,
    overReason: run.overReason,
    events,
  };
}

export const POLICY_NAMES: PolicyName[] = ['idle', 'hold-only', 'mash-0.3s', 'greedy-human', 'precise'];
