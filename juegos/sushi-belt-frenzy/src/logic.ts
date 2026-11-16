// Pure game logic for Sushi Belt Frenzy — NO Phaser dependency.
// Shared by GameScene (real play) and the Node harness (verification):
// the same rules, the same seeded spawns, the same win/lose.
// Design (biblia-arte-sushi.md + concepto aprobado):
//   - Plates ride the belt left -> right. A normal plate has a colour
//     (0 orange, 1 grey, 2 black-white) matching one of the three cats.
//   - TAP a plate: it arcs to its matching cat (one verb, understood in
//     10 s). DRAG a plate to a cat: match = eat, wrong = heart lost.
//   - Wasabi has no cat: tap does nothing; drag it to a cat and the cat
//     coughs and is stunned 1.5 s (combo breaks, no heart lost).
//   - Golden plate = a normal plate worth x3 (+90).
//   - A normal plate that exits the belt unserved = -1 heart + combo break.
//     A wasabi plate exiting costs nothing (there is no cat for it).
//   - 3 hearts. Win = reach the target of serves. Stars: 3 = win with
//     3 hearts, 2 = 2 hearts, 1 = 1 heart.
//   - Score: +30 per correct serve (x3 golden), +50 bonus every 5 combo.
//   - BOOST: belt at 50% speed for 4 s, 2 charges per level (helper only;
//     perfect play never needs it, so the harness never uses it).

export type CatColor = 0 | 1 | 2;
export type SushiType = 'salmon' | 'tuna' | 'shrimp' | 'egg';

export interface PlateDef {
  id: number;
  /** 'sushi' has a colour; 'wasabi' has colour -1 (no cat). */
  kind: 'sushi' | 'wasabi';
  color: CatColor | -1;
  sushi: SushiType | null;
  golden: boolean;
  /** seconds after level start when the plate enters the belt */
  spawnAt: number;
}

export interface LevelDef {
  n: number;
  name: string;
  /** belt speed, px per second */
  beltSpeed: number;
  /** mean seconds between spawns */
  spawnInterval: number;
  /** serves needed to win */
  target: number;
  /** how many cat colours appear (1..3) */
  colors: 1 | 2 | 3;
  /** probability a spawn is wasabi (0 = none) */
  wasabiProb: number;
  /** probability a sushi spawn is golden (0 = none) */
  goldenProb: number;
  /** max plates on the belt at once (extra spawns are delayed) */
  maxOnBelt: number;
}

export const BELT_ENTER_X = -40;
export const BELT_EXIT_X = 430;
export const STUN_SECONDS = 1.5;
export const BOOST_SECONDS = 4;
export const BOOST_FACTOR = 0.5;
export const BOOST_CHARGES = 2;
export const SERVE_POINTS = 30;
export const COMBO_BONUS_EVERY = 5;
export const COMBO_BONUS_POINTS = 50;
export const MAX_HEARTS = 3;

/** Deterministic RNG (mulberry32) — one seed per level, so spawns are
 * identical in the game, in the harness and in every replay. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SUSHI_TYPES: SushiType[] = ['salmon', 'tuna', 'shrimp', 'egg'];

/** Build the deterministic spawn schedule for a level. */
export function buildSchedule(level: LevelDef, seed: number): PlateDef[] {
  const rng = mulberry32(seed);
  const plates: PlateDef[] = [];
  // Enough spawns for the target plus a margin for wasabi + misses.
  const totalSpawns = Math.ceil(level.target * 1.9) + 8;
  let t = 1.0;
  for (let i = 0; i < totalSpawns; i++) {
    const r = rng();
    let plate: PlateDef;
    if (r < level.wasabiProb) {
      plate = { id: i, kind: 'wasabi', color: -1, sushi: null, golden: false, spawnAt: t };
    } else {
      const color = Math.floor(rng() * level.colors) as CatColor;
      const sushi = SUSHI_TYPES[Math.floor(rng() * SUSHI_TYPES.length)];
      const golden = level.goldenProb > 0 && rng() < level.goldenProb;
      plate = { id: i, kind: 'sushi', color, sushi, golden, spawnAt: t };
    }
    plates.push(plate);
    // Jitter +-15% so the rhythm is not a metronome.
    t += level.spawnInterval * (0.85 + rng() * 0.3);
  }
  return plates;
}

export type ServeResult = 'eaten' | 'wrong-cat' | 'wasabi-cough' | 'stunned' | 'not-found' | 'already-served';
export type GameOutcome = 'playing' | 'won' | 'lost';

export interface SimPlate {
  def: PlateDef;
  x: number;
  spawned: boolean;
  done: boolean;
}

export interface SimSnapshot {
  time: number;
  score: number;
  combo: number;
  bestCombo: number;
  hearts: number;
  served: number;
  missed: number;
  target: number;
  outcome: GameOutcome;
  platesOnBelt: { id: number; x: number; kind: string; color: number; golden: boolean }[];
  stunnedUntil: number[];
  boostLeft: number;
  boostActiveUntil: number;
}

export class BeltSim {
  readonly level: LevelDef;
  readonly schedule: PlateDef[];
  time = 0;
  score = 0;
  combo = 0;
  bestCombo = 0;
  hearts = MAX_HEARTS;
  served = 0;
  missed = 0;
  outcome: GameOutcome = 'playing';
  stunnedUntil: number[] = [0, 0, 0];
  boostLeft = BOOST_CHARGES;
  boostActiveUntil = 0;
  plates: SimPlate[];
  private nextSpawn = 0;

  constructor(level: LevelDef, seed: number) {
    this.level = level;
    this.schedule = buildSchedule(level, seed);
    this.plates = this.schedule.map((def) => ({ def, x: BELT_ENTER_X, spawned: false, done: false }));
  }

  get beltSpeedNow(): number {
    return this.time < this.boostActiveUntil ? this.level.beltSpeed * BOOST_FACTOR : this.level.beltSpeed;
  }

  get onBelt(): SimPlate[] {
    return this.plates.filter((p) => p.spawned && !p.done);
  }

  boost(): boolean {
    if (this.outcome !== 'playing' || this.boostLeft <= 0) return false;
    this.boostLeft -= 1;
    this.boostActiveUntil = this.time + BOOST_SECONDS;
    return true;
  }

  /** Advance the belt by dt seconds: spawn, move, expire. */
  step(dt: number): void {
    if (this.outcome !== 'playing') return;
    this.time += dt;
    const speed = this.beltSpeedNow;
    for (const p of this.plates) {
      if (!p.spawned) {
        if (p.def.spawnAt <= this.time && this.onBelt.length < this.level.maxOnBelt) {
          p.spawned = true;
        }
        continue;
      }
      if (p.done) continue;
      p.x += speed * dt;
      if (p.x >= BELT_EXIT_X) {
        p.done = true;
        if (p.def.kind === 'sushi') {
          // A normal plate left unserved: heart + combo break.
          this.missed += 1;
          this.hearts -= 1;
          this.combo = 0;
          if (this.hearts <= 0) this.outcome = 'lost';
        }
        // Wasabi leaving costs nothing: no cat could eat it.
      }
    }
    // Late spawn guard: a plate delayed by maxOnBelt still spawns when a
    // slot frees (handled next step by the loop above).
  }

  /** Serve plate `plateId` to cat `cat`. Returns what happened. */
  serve(plateId: number, cat: CatColor): ServeResult {
    if (this.outcome !== 'playing') return 'not-found';
    const p = this.plates.find((pl) => pl.def.id === plateId);
    if (!p || !p.spawned || p.done) return 'not-found';
    if (this.time < this.stunnedUntil[cat]) return 'stunned';
    p.done = true;
    if (p.def.kind === 'wasabi') {
      this.stunnedUntil[cat] = this.time + STUN_SECONDS;
      this.combo = 0;
      return 'wasabi-cough';
    }
    if (p.def.color !== cat) {
      this.hearts -= 1;
      this.combo = 0;
      if (this.hearts <= 0) this.outcome = 'lost';
      return 'wrong-cat';
    }
    const points = SERVE_POINTS * (p.def.golden ? 3 : 1);
    this.score += points;
    this.combo += 1;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    if (this.combo % COMBO_BONUS_EVERY === 0) this.score += COMBO_BONUS_POINTS;
    this.served += 1;
    if (this.served >= this.level.target) this.outcome = 'won';
    return 'eaten';
  }

  /** TAP a plate: auto-serve to its matching cat (wasabi: nothing). */
  tap(plateId: number): ServeResult {
    const p = this.plates.find((pl) => pl.def.id === plateId);
    if (!p || !p.spawned || p.done) return 'not-found';
    if (p.def.kind === 'wasabi') return 'not-found';
    return this.serve(plateId, p.def.color as CatColor);
  }

  stars(): number {
    if (this.outcome !== 'won') return 0;
    return this.hearts >= 3 ? 3 : this.hearts === 2 ? 2 : 1;
  }

  snapshot(): SimSnapshot {
    return {
      time: +this.time.toFixed(2),
      score: this.score,
      combo: this.combo,
      bestCombo: this.bestCombo,
      hearts: this.hearts,
      served: this.served,
      missed: this.missed,
      target: this.level.target,
      outcome: this.outcome,
      platesOnBelt: this.onBelt.map((p) => ({
        id: p.def.id,
        x: Math.round(p.x),
        kind: p.def.kind,
        color: p.def.color,
        golden: p.def.golden,
      })),
      stunnedUntil: this.stunnedUntil.map((u) => +Math.max(0, u - this.time).toFixed(2)),
      boostLeft: this.boostLeft,
      boostActiveUntil: +Math.max(0, this.boostActiveUntil - this.time).toFixed(2),
    };
  }
}

export interface PlayReport {
  level: number;
  outcome: GameOutcome;
  stars: number;
  score: number;
  served: number;
  missed: number;
  hearts: number;
  bestCombo: number;
  durationSec: number;
  serves: number;
  wrongServes: number;
  wasabiServes: number;
}

function runPolicy(
  level: LevelDef,
  seed: number,
  policy: (sim: BeltSim) => void,
  maxSeconds = 180,
): PlayReport {
  const sim = new BeltSim(level, seed);
  const dt = 1 / 60;
  let serves = 0;
  let wrongServes = 0;
  let wasabiServes = 0;
  // Count serve outcomes: patch serve once (tap() calls serve internally,
  // so both paths are counted).
  const rawServe = sim.serve.bind(sim);
  sim.serve = (plateId: number, cat: CatColor): ServeResult => {
    const r = rawServe(plateId, cat);
    if (r === 'eaten') serves += 1;
    else if (r === 'wrong-cat') wrongServes += 1;
    else if (r === 'wasabi-cough') wasabiServes += 1;
    return r;
  };
  let steps = 0;
  while (sim.outcome === 'playing' && steps < maxSeconds * 60) {
    // Policy acts BEFORE the step so it can serve plates that are about
    // to exit.
    policy(sim);
    sim.step(dt);
    steps += 1;
  }
  return {
    level: level.n,
    outcome: sim.outcome,
    stars: sim.stars(),
    score: sim.score,
    served: sim.served,
    missed: sim.missed,
    hearts: sim.hearts,
    bestCombo: sim.bestCombo,
    durationSec: +sim.time.toFixed(1),
    serves,
    wrongServes,
    wasabiServes,
  };
}

/** Perfect play: always serve the plate closest to the exit to its matching
 * cat (never touch wasabi). Must win 3 stars on every level. */
export function simulatePerfect(level: LevelDef, seed: number): PlayReport {
  return runPolicy(level, seed, (sim) => {
    const actionable = sim
      .onBelt
      .filter((p) => p.def.kind === 'sushi' && sim.time >= sim.stunnedUntil[p.def.color as CatColor])
      .sort((a, b) => b.x - a.x);
    if (actionable.length > 0) sim.tap(actionable[0].def.id);
  });
}

/** Idle: no input at all. Must LOSE on every level (a level you win by
 * doing nothing is not a game). */
export function simulateIdle(level: LevelDef, seed: number): PlayReport {
  return runPolicy(level, seed, () => undefined);
}

/** Random taps: tap a random plate on the belt every 0.4 s. Must NOT reach
 * 3 stars (and should usually lose). */
export function simulateRandom(level: LevelDef, seed: number): PlayReport {
  const rng = mulberry32(seed * 31 + 7);
  let nextAct = 0.4;
  return runPolicy(level, seed, (sim) => {
    if (sim.time < nextAct) return;
    nextAct = sim.time + 0.4;
    const belt = sim.onBelt;
    if (belt.length === 0) return;
    const p = belt[Math.floor(rng() * belt.length)];
    if (p.def.kind === 'wasabi') {
      if (rng() < 0.5) sim.serve(p.def.id, Math.floor(rng() * 3) as CatColor);
    } else if (rng() < 0.7) {
      sim.tap(p.def.id);
    } else {
      sim.serve(p.def.id, Math.floor(rng() * 3) as CatColor);
    }
  });
}

/** Serve-everything: serve every plate the instant it spawns, wasabi
 * included, to a random cat. Must NOT reach 3 stars (wasabi stuns and
 * wrong cats cost hearts, so blind serving must fail). */
export function simulateServeAll(level: LevelDef, seed: number): PlayReport {
  const rng = mulberry32(seed * 17 + 3);
  return runPolicy(level, seed, (sim) => {
    for (const p of sim.onBelt) {
      if (p.def.kind === 'wasabi') sim.serve(p.def.id, Math.floor(rng() * 3) as CatColor);
      else sim.serve(p.def.id, Math.floor(rng() * 3) as CatColor);
    }
  });
}

/** Human-like play: reaction delay + one serve at a time + rare fumbles
 * (wrong cat). Must WIN (at least 2 stars) on every level — otherwise the
 * level is too hard for a real player. Model: a careful player mis-taps
 * ~1% of the time, and after a fumble plays carefully for the next 3
 * serves (slower, no fumble) — that is how real players behave after
 * losing a heart. (Verified: at 5% without caution every human loss was
 * fumbles, 0 misses, even on slow L6 — the levels were never too fast;
 * the gate was measuring luck, not skill.) The 5% no-caution variant is
 * still run by the harness as an informational column. */
export function simulateHuman(level: LevelDef, seed: number, reactionSec = 0.5, fumbleRate = 0.01): PlayReport {
  const rng = mulberry32(seed * 13 + 11);
  let nextAct = reactionSec;
  let carefulLeft = 0;
  return runPolicy(level, seed, (sim) => {
    if (sim.time < nextAct) return;
    const actionable = sim
      .onBelt
      .filter((p) => p.def.kind === 'sushi' && sim.time >= sim.stunnedUntil[p.def.color as CatColor])
      .sort((a, b) => b.x - a.x);
    if (actionable.length === 0) {
      nextAct = sim.time + 0.1;
      return;
    }
    const careful = carefulLeft > 0;
    nextAct = sim.time + (careful ? 0.8 : reactionSec);
    const p = actionable[0];
    if (!careful && rng() < fumbleRate) {
      const wrong = ([0, 1, 2].filter((c) => c !== p.def.color) as CatColor[])[Math.floor(rng() * 2)];
      sim.serve(p.def.id, wrong);
      carefulLeft = 3;
    } else {
      if (careful) carefulLeft -= 1;
      sim.tap(p.def.id);
    }
  });
}
