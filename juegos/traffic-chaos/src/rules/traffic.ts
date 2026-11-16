// Traffic Chaos: New York Rush — rules module.
// Ported verbatim from Niky's prototype (dana-games-juegos, branch
// niky/traffic-chaos-prototipo, src/rules/traffic.ts).
// Engine-free, deterministic, seeded (phaser-core workflow step 2: rules out of scenes).
// The Phaser scene renders this state and sends named actions back; the sim never
// imports Phaser, so the balance harness runs it headless under node.
// Fixed timestep: the scene steps at dt = 1/60 (physics-tuning). All movement is
// velocity-driven with accel/decel caps; crash detection is AABB overlap
// (phaser-arcade-physics model, implemented kinematically for determinism).

import {
  AMBULANCE_MIN_GAP,
  AMBULANCE_WARN,
  BOOST_ALL,
  BOOST_ALL_COOLDOWN,
  BOOST_ALL_DURATION,
  BOOST_CAR,
  BOOST_CAR_COOLDOWN,
  BOOST_CAR_DURATION,
  CAR_GAP,
  CHAIN_RADIUS,
  CLEARANCE,
  CLOSE_CALL_BONUS,
  CONFLICT,
  EXIT,
  GRIDLOCK_QUEUE,
  LANES,
  PATIENCE_WARN,
  POINTS,
  RECKLESS_SPEED,
  SPAWN,
  SPEEDS,
  SIZES,
  STOP,
  TAXI_NOSTOP_BONUS,
  TOGGLE_COOLDOWN,
  NORMAL_DIFFICULTY,
  type Difficulty,
} from '../config';

export type Dir = 'N' | 'S' | 'E' | 'W';
export type CarType = 'car' | 'taxi' | 'bus' | 'ambulance';
export type Phase = 'NS' | 'EW';
export type CarState = 'driving' | 'stopped' | 'reckless' | 'crashed' | 'done';
export type RunStatus = 'playing' | 'won' | 'over';
export type OverReason = 'crash' | 'gridlock' | 'time' | null;

export interface Car {
  id: number;
  type: CarType;
  dir: Dir;
  travel: number; // px travelled from the spawn edge (authoritative coordinate)
  x: number;
  y: number; // center, derived from travel
  w: number;
  h: number; // axis-aligned footprint
  len: number;
  angle: number; // facing: N=90 (down), S=270 (up), W=0 (right), E=180 (left)
  baseSpeed: number;
  speed: number;
  state: CarState;
  patience: number;
  minPatience: number;
  patienceDrained: boolean;
  neverStopped: boolean;
  boostedUntil: number;
  boostCooldownUntil: number;
  honked: boolean;
  color: number;
}

export type RunEvent =
  | { type: 'spawn'; car: Car }
  | { type: 'cleared'; car: Car; points: number; reason: string }
  | { type: 'crash'; cars: Car[]; x: number; y: number }
  | { type: 'gridlock'; dir: Dir; count: number }
  | { type: 'level-end'; won: boolean; score: number; clears: number }
  | { type: 'ran-red'; car: Car }
  | { type: 'close-call'; car: Car; points: number }
  | { type: 'ambulance-warning'; dir: Dir }
  | { type: 'honk'; car: Car }
  | { type: 'toggle'; phase: Phase }
  | { type: 'toggle-denied'; at: number }
  | { type: 'boost-car'; car: Car }
  | { type: 'boost-all' };

export interface Run {
  seed: number;
  time: number;
  phase: Phase;
  status: RunStatus;
  overReason: OverReason;
  score: number;
  clears: number;
  cars: Car[];
  nextId: number;
  spawnTimer: number;
  lastToggleAt: number;
  clearanceUntil: number; // both axes red while time < clearanceUntil (amber)
  globalBoostUntil: number;
  globalBoostCooldownUntil: number;
  lastAmbulanceAt: number;
  pendingAmbulance: { dir: Dir; at: number } | null;
  rng: () => number;
  stats: { toggles: number; boosts: number; ranRed: number; honks: number };
  difficulty: Difficulty; // level-1 (easy) vs normal: patience, spawn rate, quota
  practice: boolean; // tutorial sandbox: patience frozen, the level cannot end
}

const ACCEL = 600; // px/s^2
const DECEL = 500; // px/s^2

const ANGLE: Record<Dir, number> = { N: 90, S: 270, W: 0, E: 180 };

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Daily seed: same level for everyone, every day (demand report: daily RUSH HOUR). */
export function seedFromDate(d = new Date()): number {
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function stopTravel(dir: Dir): number {
  switch (dir) {
    case 'N':
      return STOP.N - SPAWN.N;
    case 'S':
      return SPAWN.S - STOP.S;
    case 'W':
      return STOP.W - SPAWN.W;
    case 'E':
      return SPAWN.E - STOP.E;
  }
}

export function exitTravel(dir: Dir): number {
  switch (dir) {
    case 'N':
      return EXIT.N - SPAWN.N;
    case 'S':
      return SPAWN.S - EXIT.S;
    case 'W':
      return EXIT.W - SPAWN.W;
    case 'E':
      return SPAWN.E - EXIT.E;
  }
}

function carXY(dir: Dir, travel: number, len: number, wid: number): { x: number; y: number; w: number; h: number } {
  if (dir === 'N' || dir === 'S') {
    const front = dir === 'N' ? SPAWN.N + travel : SPAWN.S - travel;
    const cy = dir === 'N' ? front - len / 2 : front + len / 2;
    return { x: LANES[dir].x, y: cy, w: wid, h: len };
  }
  const front = dir === 'W' ? SPAWN.W + travel : SPAWN.E - travel;
  const cx = dir === 'W' ? front - len / 2 : front + len / 2;
  const laneY = dir === 'W' ? LANES.S.y : LANES.N.y;
  return { x: cx, y: laneY, w: len, h: wid };
}

function makeCar(run: Run, type: CarType, dir: Dir, travel: number, opts: Partial<Car> = {}): Car {
  const size = SIZES[type];
  const pos = carXY(dir, travel, size.len, size.wid);
  const color =
    type === 'taxi'
      ? 0xfacc15
      : type === 'bus'
        ? 0xdc2626
        : type === 'ambulance'
          ? 0xf8fafc
          : [0xf87171, 0x60a5fa, 0xa78bfa, 0x34d399, 0xfb923c][run.nextId % 5];
  return {
    id: run.nextId++,
    type,
    dir,
    travel,
    ...pos,
    len: size.len,
    angle: ANGLE[dir],
    baseSpeed: SPEEDS[type],
    speed: 0,
    state: 'driving',
    patience: run.difficulty.patienceMax,
    minPatience: run.difficulty.patienceMax,
    patienceDrained: false,
    neverStopped: true,
    boostedUntil: -1,
    boostCooldownUntil: -1,
    honked: false,
    color,
    ...opts,
  };
}

function axisOf(dir: Dir): Phase {
  return dir === 'N' || dir === 'S' ? 'NS' : 'EW';
}

function isRed(run: Run, dir: Dir): boolean {
  // During the all-red clearance after a flip, BOTH axes are red (amber).
  if (run.time < run.clearanceUntil) return true;
  return run.phase !== axisOf(dir);
}

function spawnInterval(run: Run): number {
  // Spawn pressure scales with sqrt(difficulty) (designing-mini-games default).
  const d = Math.min(1, Math.max(0, run.time / run.difficulty.duration));
  const base = run.difficulty.spawnT0 + (run.difficulty.spawnT1 - run.difficulty.spawnT0) * Math.sqrt(d);
  return base * (0.85 + run.rng() * 0.3);
}

export function createRun(opts: {
  seed: number;
  opening?: 'attract' | 'level' | 'empty';
  difficulty?: Partial<Difficulty>;
}): Run {
  const difficulty: Difficulty = { ...NORMAL_DIFFICULTY, ...(opts.difficulty ?? {}) };
  const run: Run = {
    seed: opts.seed,
    time: 0,
    phase: 'EW', // NS red, EW green at boot (the opening beat needs EW flowing)
    status: 'playing',
    overReason: null,
    score: 0,
    clears: 0,
    cars: [],
    nextId: 1,
    spawnTimer: 0.8,
    lastToggleAt: -10,
    clearanceUntil: -1,
    globalBoostUntil: -1,
    globalBoostCooldownUntil: -1,
    lastAmbulanceAt: -100,
    pendingAmbulance: null,
    rng: mulberry32(opts.seed),
    stats: { toggles: 0, boosts: 0, ranRed: 0, honks: 0 },
    difficulty,
    practice: false,
  };

  if (opts.opening === 'attract') {
    // First frame = the crash (demand report §6): a taxi with patience at 0 runs
    // the red into crossing traffic at ~t=1 s. Zero input needed — the sim does
    // it for real. Timings: taxi crosses y=458 at ~t=1.0 s; ew1 (W) reaches x=222
    // at ~t=1.0 s; e1 (E) reaches x=222 at ~t=1.0 s and joins the chain.
    const taxi = makeCar(run, 'taxi', 'N', stopTravel('N'), { patience: 0.01, minPatience: 0.01 });
    const ew1 = makeCar(run, 'car', 'W', 219, { speed: SPEEDS.car });
    const e1 = makeCar(run, 'car', 'E', 165, { speed: SPEEDS.car });
    run.cars.push(taxi, ew1, e1);
  } else if (opts.opening === 'level') {
    // Live save-or-crash decision at ~2 s (normal) / ~6 s (level 1 easy): a taxi
    // sits on red with openingPatience of patience. ew1 (W) is committed
    // mid-crossing and clears by ~t=0.5 s. e1 (E) approaches its stop line: it
    // stops if the player flips before ~t=1.7 s, it crosses and crashes the taxi
    // at ~t=2.5 s if they don't. s1 (S) shows the NS queue forming.
    const taxi = makeCar(run, 'taxi', 'N', stopTravel('N'), {
      patience: difficulty.openingPatience,
      minPatience: difficulty.openingPatience,
      state: 'stopped',
    });
    const behind = makeCar(run, 'car', 'N', stopTravel('N') - 44 - CAR_GAP, { state: 'stopped' });
    const ew1 = makeCar(run, 'car', 'W', 294, { speed: SPEEDS.car });
    const e1 = makeCar(run, 'car', 'E', 53, { speed: SPEEDS.car });
    const s1 = makeCar(run, 'car', 'S', 120, { speed: SPEEDS.car });
    run.cars.push(taxi, behind, ew1, e1, s1);
  }
  return run;
}

// --- Named actions (input-systems) ---

export function toggleLights(run: Run): RunEvent | null {
  if (run.status !== 'playing') return null;
  if (run.time - run.lastToggleAt < TOGGLE_COOLDOWN) {
    return { type: 'toggle-denied', at: run.time };
  }
  run.phase = run.phase === 'NS' ? 'EW' : 'NS';
  run.lastToggleAt = run.time;
  run.clearanceUntil = run.time + CLEARANCE; // all-red: the box empties first
  run.stats.toggles++;
  return { type: 'toggle', phase: run.phase };
}

export function boostCar(run: Run, id: number): RunEvent | null {
  const car = run.cars.find((c) => c.id === id);
  if (!car || run.status !== 'playing') return null;
  if (car.state === 'crashed' || car.state === 'done') return null;
  if (run.time < car.boostCooldownUntil) return null;
  car.boostedUntil = run.time + BOOST_CAR_DURATION;
  car.boostCooldownUntil = run.time + BOOST_CAR_DURATION + BOOST_CAR_COOLDOWN;
  run.stats.boosts++;
  return { type: 'boost-car', car };
}

export function boostAll(run: Run): RunEvent | null {
  if (run.status !== 'playing') return null;
  if (run.time < run.globalBoostCooldownUntil) return null;
  run.globalBoostUntil = run.time + BOOST_ALL_DURATION;
  run.globalBoostCooldownUntil = run.time + BOOST_ALL_DURATION + BOOST_ALL_COOLDOWN;
  run.stats.boosts++;
  return { type: 'boost-all' };
}

// --- Simulation step (fixed dt = 1/60) ---

export function stepRun(run: Run, dt: number): RunEvent[] {
  const events: RunEvent[] = [];
  if (run.status !== 'playing') return events;

  run.time += dt;
  const t = run.time;

  // Pending ambulance warning -> spawn (attack-tell: 2 s warning before entry).
  if (run.pendingAmbulance && t >= run.pendingAmbulance.at) {
    const dir = run.pendingAmbulance.dir;
    run.pendingAmbulance = null;
    run.lastAmbulanceAt = t;
    if (laneClearForSpawn(run, dir)) {
      const car = makeCar(run, 'ambulance', dir, 0, { speed: SPEEDS.ambulance });
      run.cars.push(car);
      events.push({ type: 'spawn', car });
    }
  }

  // Spawner.
  run.spawnTimer -= dt;
  if (run.spawnTimer <= 0) {
    run.spawnTimer = spawnInterval(run);
    spawnOne(run, events);
  }

  // Movement (front-to-back per lane: leaders move first).
  const actives = run.cars.filter((c) => c.state !== 'crashed' && c.state !== 'done');
  const byDir = new Map<Dir, Car[]>();
  for (const c of actives) {
    const list = byDir.get(c.dir) ?? [];
    list.push(c);
    byDir.set(c.dir, list);
  }
  for (const list of byDir.values()) list.sort((a, b) => b.travel - a.travel);

  for (const car of actives) {
    moveCar(run, car, byDir.get(car.dir) ?? [], dt, events);
  }

  // Practice sandbox (tutorial active): the level cannot end — no crash,
  // no gridlock, no timer. Cars still move, spawn and clear; the player
  // learns the first tap without the level killing them for dawdling.
  // The real level starts the moment the tutorial completes.
  if (!run.practice) {
    // Crash detection: AABB overlap with at least one car inside the conflict box.
    const crash = detectCrash(actives);
    if (crash) {
      events.push(crash);
      run.status = 'over';
      run.overReason = 'crash';
      return events;
    }

    // Gridlock: a queue of >= 5 stopped cars on one approach.
    for (const dir of ['N', 'S', 'E', 'W'] as Dir[]) {
      const queued = (byDir.get(dir) ?? []).filter(
        (c) => c.state === 'stopped' && c.travel <= stopTravel(dir),
      ).length;
      if (queued >= GRIDLOCK_QUEUE) {
        events.push({ type: 'gridlock', dir, count: queued });
        run.status = 'over';
        run.overReason = 'gridlock';
        return events;
      }
    }

    // Timer / quota.
    if (t >= run.difficulty.duration) {
      const won = run.clears >= run.difficulty.quota;
      run.status = won ? 'won' : 'over';
      run.overReason = won ? null : 'time';
      events.push({ type: 'level-end', won, score: run.score, clears: run.clears });
      return events;
    }
  }

  // Remove finished cars.
  run.cars = run.cars.filter((c) => c.state !== 'done');
  return events;
}

function laneClearForSpawn(run: Run, dir: Dir): boolean {
  const rearmost = run.cars
    .filter((c) => c.dir === dir && c.state !== 'done' && c.state !== 'crashed')
    .sort((a, b) => a.travel - b.travel)[0];
  return !rearmost || rearmost.travel > SIZES[rearmost.type].len + CAR_GAP + 10;
}

function spawnOne(run: Run, events: RunEvent[]): void {
  const dirs: Dir[] = ['N', 'S', 'E', 'W'];
  const dir = dirs[Math.floor(run.rng() * 4)];
  if (!laneClearForSpawn(run, dir)) return;

  const roll = run.rng();
  let type: CarType = 'car';
  if (roll < 0.55) type = 'car';
  else if (roll < 0.75) type = 'taxi';
  else if (roll < 0.85) type = 'bus';
  else type = 'ambulance';

  if (type === 'ambulance') {
    if (run.time - run.lastAmbulanceAt < AMBULANCE_MIN_GAP || run.pendingAmbulance) {
      type = 'car';
    } else {
      // Warning first (attack-tell), entry 2 s later.
      run.pendingAmbulance = { dir, at: run.time + AMBULANCE_WARN };
      events.push({ type: 'ambulance-warning', dir });
      return;
    }
  }
  const car = makeCar(run, type, dir, 0, { speed: SPEEDS[type] * 0.5 });
  run.cars.push(car);
  events.push({ type: 'spawn', car });
}

function moveCar(run: Run, car: Car, lane: Car[], dt: number, events: RunEvent[]): void {
  const t = run.time;
  const stop = stopTravel(car.dir);
  const exit = exitTravel(car.dir);
  const red = isRed(run, car.dir);
  // A car AT the stop line (travel == stop) has NOT crossed it yet: its front
  // bumper is on the line. Only strictly past the line counts as past.
  const pastLine = car.travel > stop;

  // Box-block (fairness, real-driver rule): a car that has not crossed its stop
  // line waits there while a CROSS-axis car is inside the conflict box — even
  // on green. The skill is WHEN to flip, not box bookkeeping: a flip is never
  // an instant death sentence. Reckless cars are exempt (they already ran the
  // red — that is the designed failure mode).
  // Siren yield: cross-axis cars also stop at their line while an ambulance
  // approaches or crosses the box, whatever the light says.
  const crossOccupied =
    car.state !== 'reckless' &&
    run.cars.some(
      (c) =>
        c !== car &&
        c.state !== 'done' &&
        c.state !== 'crashed' &&
        axisOf(c.dir) !== axisOf(car.dir) &&
        c.x - c.w / 2 < CONFLICT.x1 &&
        c.x + c.w / 2 > CONFLICT.x0 &&
        c.y - c.h / 2 < CONFLICT.y1 &&
        c.y + c.h / 2 > CONFLICT.y0,
    );
  const ambulanceNear =
    car.state !== 'reckless' &&
    run.cars.some(
      (c) =>
        c !== car &&
        c.type === 'ambulance' &&
        (c.state === 'driving' || c.state === 'reckless') &&
        axisOf(c.dir) !== axisOf(car.dir) &&
        c.travel > stopTravel(c.dir) - 150 &&
        c.travel < exitTravel(c.dir) + 50,
    );

  // Stop limit: the nearest of (leader's rear bumper, red stop line). The exit is
  // NOT a limit — cars cross it freely and score (a car must never brake for it).
  let stopLimit = Infinity;
  // Nearest leader: the car ahead with the SMALLEST travel above ours.
  // (The lane list is sorted descending, so the nearest leader is the LAST
  // entry still ahead of us — `find` would return the FARTHEST one.)
  const ahead = lane.filter((c) => c !== car && c.travel > car.travel);
  const leader = ahead.length > 0 ? ahead[ahead.length - 1] : undefined;
  if (leader) stopLimit = Math.min(stopLimit, leader.travel - leader.len - CAR_GAP);
  if (red && !pastLine && car.state !== 'reckless') {
    stopLimit = Math.min(stopLimit, stop);
  }
  if (!pastLine && (crossOccupied || ambulanceNear)) {
    stopLimit = Math.min(stopLimit, stop);
  }

  // Desired speed.
  let mult = 1;
  if (t < car.boostedUntil) mult *= BOOST_CAR;
  if (t < run.globalBoostUntil) mult *= BOOST_ALL;
  if (car.state === 'reckless') mult *= RECKLESS_SPEED;
  const desired = car.baseSpeed * mult;

  // Accel / decel toward the target (0 when a stop limit blocks us).
  const blocked = car.travel + car.speed * dt >= stopLimit;
  const target = blocked ? 0 : desired;
  if (car.speed < target) car.speed = Math.min(target, car.speed + ACCEL * dt);
  else if (car.speed > target) car.speed = Math.max(target, car.speed - DECEL * dt);

  car.travel += car.speed * dt;
  if (car.travel >= stopLimit) {
    car.travel = stopLimit;
    car.speed = 0;
  }
  if (car.speed === 0 && target === 0 && stopLimit !== Infinity) {
    car.state = 'stopped';
  } else if (car.speed > 0) {
    car.state = car.state === 'reckless' ? 'reckless' : 'driving';
  }
  // A reckless driver is just driving once fully past the stop line.
  if (car.travel > stop + car.len && car.state === 'reckless') car.state = 'driving';

  // Patience: drains while stopped at red (in the queue); recovers while driving.
  // It does NOT drain during the all-red clearance (amber grace period): the
  // player flipped to save this car, and the clearance must not kill it.
  // It does NOT drain in practice mode (tutorial sandbox): the player is
  // learning the first tap, not being punished for dawdling on it.
  const inClearance = run.time < run.clearanceUntil;
  if (car.state === 'stopped' && red && !inClearance && car.travel <= stop && !run.practice) {
    car.patience -= dt;
    car.patienceDrained = true;
    car.minPatience = Math.min(car.minPatience, car.patience);
    if (!car.honked && car.patience <= PATIENCE_WARN) {
      car.honked = true;
      run.stats.honks++;
      events.push({ type: 'honk', car });
    }
    if (car.patience <= 0) {
      car.state = 'reckless';
      car.patience = 0;
      run.stats.ranRed++;
      events.push({ type: 'ran-red', car });
    }
  } else if (car.state === 'driving') {
    car.patience = Math.min(run.difficulty.patienceMax, car.patience + 2 * dt);
    car.honked = false;
  }
  if (car.state === 'stopped') car.neverStopped = false;

  // Sync derived position.
  const xy = carXY(car.dir, car.travel, car.len, SIZES[car.type].wid);
  car.x = xy.x;
  car.y = xy.y;
  car.w = xy.w;
  car.h = xy.h;

  // Cleared the intersection: score the causal event (INV-4).
  if (car.travel >= exit) {
    car.state = 'done';
    let points = POINTS[car.type];
    let reason = 'clear';
    if (car.type === 'taxi' && car.neverStopped) {
      points += TAXI_NOSTOP_BONUS;
      reason = 'taxi-no-stop';
    }
    if (car.patienceDrained && car.minPatience <= 2) {
      points += CLOSE_CALL_BONUS;
      reason = 'close-call';
      events.push({ type: 'close-call', car, points: CLOSE_CALL_BONUS });
    }
    run.score += points;
    run.clears++;
    events.push({ type: 'cleared', car, points, reason });
  }
}

function detectCrash(actives: Car[]): Extract<RunEvent, { type: 'crash' }> | null {
  const inBox = (c: Car) =>
    c.x > CONFLICT.x0 && c.x < CONFLICT.x1 && c.y > CONFLICT.y0 && c.y < CONFLICT.y1;
  for (let i = 0; i < actives.length; i++) {
    for (let j = i + 1; j < actives.length; j++) {
      const a = actives[i];
      const b = actives[j];
      if (a.state === 'crashed' || b.state === 'crashed') continue;
      if (!(inBox(a) || inBox(b))) continue;
      const overlap =
        Math.abs(a.x - b.x) * 2 < a.w + b.w && Math.abs(a.y - b.y) * 2 < a.h + b.h;
      if (!overlap) continue;
      // Chain: nearby active cars join the crash.
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const involved = [a, b];
      for (const c of actives) {
        if (c === a || c === b || c.state === 'crashed') continue;
        if (Math.hypot(c.x - mx, c.y - my) <= CHAIN_RADIUS) involved.push(c);
      }
      for (const c of involved) {
        c.state = 'crashed';
        c.speed = 0;
      }
      return { type: 'crash', cars: involved, x: mx, y: my };
    }
  }
  return null;
}

// --- Readouts for the scene / probes ---

export function queueCount(run: Run, dir: Dir): number {
  return run.cars.filter(
    (c) => c.dir === dir && c.state === 'stopped' && c.travel <= stopTravel(dir),
  ).length;
}

export function phaseGreenFor(run: Run, dir: Dir): boolean {
  return !isRed(run, dir);
}

export function timeLeft(run: Run): number {
  return Math.max(0, run.difficulty.duration - run.time);
}

export function debugState(run: Run) {
  return {
    time: +run.time.toFixed(2),
    phase: run.phase,
    status: run.status,
    overReason: run.overReason,
    score: run.score,
    clears: run.clears,
    cars: run.cars.length,
    globalBoostUntil: run.globalBoostUntil,
  };
}
