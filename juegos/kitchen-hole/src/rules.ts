// Pure game rules — Kitchen Hole Muncher. NO Phaser import, NO DOM:
// the whole simulation runs under plain node (phaser-core: rules in a
// plain module so they run without a browser; the scene only draws and
// sends input). Every number the docs quote lives here, once.
//
// Core loop (designing-mini-games): ONE verb — drag the hole. The hole
// swallows anything that FITS inside it (obj.r <= hole.r * FIT). Eating
// grows the hole, so the player climbs the comic scale crumbs -> fridge.
// Win = eat EVERYTHING in the kitchen before the timer ends ("CLEANUP").
// Lose = timer hits 0 with objects left. Idle loses; sweeping loses on
// later levels (pet steals, goldens expire, movers flee); the solution
// route wins with margin (evaluating-gameplay-balance harness contract).

export interface Vec {
  x: number;
  y: number;
}

export type ObjKind =
  | 'crumb' | 'cookie' | 'apple' | 'donut' | 'croissant' | 'cup'
  | 'toaster' | 'cake' | 'pizza' | 'sushi' | 'plant' | 'chair'
  | 'table' | 'stove' | 'fridge' | 'mouse';

export type PetKind = 'cat' | 'dog';

/** Gameplay truth per kind: drawn radius IS the fit radius. */
export interface KindStats {
  r: number;
  value: number;
  grow: number;
}

export const KIND_STATS: Record<ObjKind, KindStats> = {
  crumb: { r: 6, value: 5, grow: 0.4 },
  cookie: { r: 9, value: 10, grow: 0.7 },
  apple: { r: 12, value: 15, grow: 1.0 },
  donut: { r: 13, value: 20, grow: 1.2 },
  croissant: { r: 14, value: 25, grow: 1.4 },
  cup: { r: 16, value: 30, grow: 1.8 },
  sushi: { r: 12, value: 20, grow: 1.0 },
  toaster: { r: 20, value: 40, grow: 2.2 },
  cake: { r: 22, value: 50, grow: 2.6 },
  pizza: { r: 24, value: 60, grow: 3.0 },
  plant: { r: 26, value: 50, grow: 3.0 },
  chair: { r: 30, value: 80, grow: 4.0 },
  stove: { r: 34, value: 100, grow: 5.0 },
  table: { r: 38, value: 120, grow: 6.0 },
  fridge: { r: 52, value: 300, grow: 8.0 },
  mouse: { r: 10, value: 40, grow: 1.5 },
};

export interface ObjDef {
  id: number;
  kind: ObjKind;
  x: number;
  y: number;
  /** Golden: x3 value, expires GOLDEN_TTL_s after spawn. */
  golden?: boolean;
  /** Mover: patrols waypoints at speed px/s (rolling apple / fleeing mouse). */
  mover?: { path: Vec[]; speed: number; flee?: boolean };
}

export interface PetDef {
  kind: PetKind;
  x: number;
  y: number;
  /** Patrol waypoints (loops). */
  patrol: Vec[];
  speed: number; // px/s — sqrt(difficulty) scaling, set per level
  steal: number; // coins stolen per touch
  cooldown: number; // seconds between steals
}

export interface LevelRules {
  timeLimit: number; // seconds
  startRadius: number;
  objects: ObjDef[];
  pet: PetDef | null;
  /** Golden spawns: {at: seconds, x, y, kind} — appears mid-level. */
  goldenSpawns: { at: number; x: number; y: number; kind: ObjKind }[];
}

export interface ObjState {
  def: ObjDef;
  x: number;
  y: number;
  eaten: boolean;
  /** Seconds left before a golden expires (Infinity for normal). */
  ttl: number;
  moverIdx: number;
  moverT: number; // 0..1 along the current patrol leg
}

export interface PetState {
  def: PetDef;
  x: number;
  y: number;
  patrolIdx: number;
  cooldownLeft: number;
  fleeingUntil: number; // sim time until which the pet dashes away
}

export type RuleEvent =
  | { type: 'eat'; id: number; kind: ObjKind; coins: number; golden: boolean; x: number; y: number }
  | { type: 'tooBig'; id: number; kind: ObjKind; x: number; y: number }
  | { type: 'steal'; amount: number; x: number; y: number }
  | { type: 'goldenSpawn'; x: number; y: number; kind: ObjKind }
  | { type: 'goldenExpire'; x: number; y: number }
  | { type: 'grow'; size: number }
  | { type: 'win'; stars: number; timeLeft: number; coins: number }
  | { type: 'lose'; coins: number };

export interface HoleSim {
  level: LevelRules;
  hole: { x: number; y: number; r: number };
  coins: number;
  eaten: number;
  total: number;
  goldensEaten: number;
  goldensTotal: number;
  timeLeft: number;
  elapsed: number;
  objects: ObjState[];
  pet: PetState | null;
  spawnedGoldens: number;
  over: boolean;
  won: boolean;
  stars: number;
  /** Last tooBig ping per object id (sim time) — throttles the wobble. */
  lastTooBig: Record<number, number>;
}

export const HOLE_SPEED = 420; // px/s — faster than any pet, slower than a flick
export const FIT = 1.1; // an object fits when obj.r <= hole.r * FIT
export const SWALLOW_DIST = 0.85; // centre distance < hole.r * 0.85
export const GOLDEN_TTL = 8; // seconds a golden stays on the table
export const MAX_RADIUS = 95;
export const PET_RADIUS = 26;
export const PLAY_W = 390;
export const PLAY_H = 844;
export const PLAY_TOP = 110;
export const PLAY_BOTTOM = 768;

export function sizeOf(r: number): number {
  return Math.round(r);
}

/** Stars at win: 3 = fast AND all goldens; 2 = comfortable; 1 = just made it. */
export function starsFor(timeLeft: number, goldensEaten: number, goldensTotal: number): number {
  if (timeLeft >= 15 && goldensEaten >= goldensTotal) return 3;
  if (timeLeft >= 5) return 2;
  return 1;
}

export function createSim(level: LevelRules, start: Vec): HoleSim {
  return {
    level,
    hole: { x: start.x, y: start.y, r: level.startRadius },
    coins: 0,
    eaten: 0,
    total: level.objects.length + level.goldenSpawns.length,
    goldensEaten: 0,
    goldensTotal: level.goldenSpawns.length,
    timeLeft: level.timeLimit,
    elapsed: 0,
    objects: level.objects.map((def) => ({
      def,
      x: def.x,
      y: def.y,
      eaten: false,
      ttl: def.golden ? GOLDEN_TTL : Infinity,
      moverIdx: 0,
      moverT: 0,
    })),
    pet: level.pet
      ? { def: level.pet, x: level.pet.x, y: level.pet.y, patrolIdx: 0, cooldownLeft: 0, fleeingUntil: 0 }
      : null,
    spawnedGoldens: 0,
    over: false,
    won: false,
    stars: 0,
    lastTooBig: {},
  };
}

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(bx - ax, by - ay);
}

function clampHole(sim: HoleSim): void {
  const h = sim.hole;
  h.x = Math.max(h.r * 0.4, Math.min(PLAY_W - h.r * 0.4, h.x));
  h.y = Math.max(PLAY_TOP + h.r * 0.4, Math.min(PLAY_BOTTOM - h.r * 0.4, h.y));
}

/**
 * One fixed step. `target` is the finger position (or null = no input).
 * Returns the events that fired this step (the scene turns them into
 * juice/audio; the sim never draws or plays sound).
 */
export function stepSim(sim: HoleSim, target: Vec | null, dt: number): RuleEvent[] {
  const events: RuleEvent[] = [];
  if (sim.over || dt <= 0) return events;
  const dts = Math.min(dt, 0.05); // clamp: a hitch never eats the timer
  sim.elapsed += dts;
  sim.timeLeft -= dts;

  // --- hole movement: towards the finger, capped speed, slight lag ---
  if (target) {
    const h = sim.hole;
    const d = dist(h.x, h.y, target.x, target.y);
    if (d > 1) {
      const stepLen = Math.min(d, HOLE_SPEED * dts);
      h.x += ((target.x - h.x) / d) * stepLen;
      h.y += ((target.y - h.y) / d) * stepLen;
    }
  }
  clampHole(sim);

  // --- golden spawns (mid-level bonuses), in list order ---
  for (let i = 0; i < sim.level.goldenSpawns.length; i++) {
    if (i < sim.spawnedGoldens) continue;
    if (i > sim.spawnedGoldens) break; // spawn strictly in order
    const g = sim.level.goldenSpawns[i];
    if (sim.elapsed < g.at) break;
    const id = 1000 + i;
    sim.objects.push({
      def: { id, kind: g.kind, x: g.x, y: g.y, golden: true },
      x: g.x, y: g.y, eaten: false, ttl: GOLDEN_TTL, moverIdx: 0, moverT: 0,
    });
    sim.spawnedGoldens += 1;
    events.push({ type: 'goldenSpawn', x: g.x, y: g.y, kind: g.kind });
  }

  // --- movers: patrol, or flee from the hole ---
  for (const o of sim.objects) {
    if (o.eaten || !o.def.mover) continue;
    const path = o.def.mover.path;
    if (path.length < 2) continue;
    const a = path[o.moverIdx];
    const b = path[(o.moverIdx + 1) % path.length];
    const legLen = dist(a.x, a.y, b.x, b.y) || 1;
    let speed = o.def.mover.speed;
    if (o.def.mover.flee) {
      const dh = dist(o.x, o.y, sim.hole.x, sim.hole.y);
      if (dh < 90) speed *= 1.8; // the mouse runs when the hole closes in
    }
    o.moverT += (speed * dts) / legLen;
    if (o.moverT >= 1) {
      o.moverT = 0;
      o.moverIdx = (o.moverIdx + 1) % path.length;
    }
    const na = path[o.moverIdx];
    const nb = path[(o.moverIdx + 1) % path.length];
    o.x = na.x + (nb.x - na.x) * o.moverT;
    o.y = na.y + (nb.y - na.y) * o.moverT;
  }

  // --- golden expiry ---
  for (const o of sim.objects) {
    if (o.eaten || !o.def.golden) continue;
    o.ttl -= dts;
    if (o.ttl <= 0) {
      o.eaten = true; // expired: gone, counts as uneaten for the win
      sim.total -= 1;
      events.push({ type: 'goldenExpire', x: o.x, y: o.y });
    }
  }

  // --- swallowing ---
  for (const o of sim.objects) {
    if (o.eaten) continue;
    const stats = KIND_STATS[o.def.kind];
    const d = dist(sim.hole.x, sim.hole.y, o.x, o.y);
    if (d < sim.hole.r * SWALLOW_DIST) {
      if (stats.r <= sim.hole.r * FIT) {
        o.eaten = true;
        sim.eaten += 1;
        const coins = o.def.golden ? stats.value * 3 : stats.value;
        sim.coins += coins;
        if (o.def.golden) sim.goldensEaten += 1;
        sim.hole.r = Math.min(MAX_RADIUS, sim.hole.r + stats.grow);
        events.push({ type: 'eat', id: o.def.id, kind: o.def.kind, coins, golden: !!o.def.golden, x: o.x, y: o.y });
        events.push({ type: 'grow', size: sizeOf(sim.hole.r) });
      } else if (sim.elapsed - (sim.lastTooBig[o.def.id] ?? -99) > 0.8) {
        sim.lastTooBig[o.def.id] = sim.elapsed;
        events.push({ type: 'tooBig', id: o.def.id, kind: o.def.kind, x: o.x, y: o.y });
      }
    }
  }

  // --- pet: patrol, steal on touch, dash away ---
  const pet = sim.pet;
  if (pet) {
    pet.cooldownLeft = Math.max(0, pet.cooldownLeft - dts);
    const def = pet.def;
    if (sim.elapsed < pet.fleeingUntil) {
      // Dashing away from the hole after a steal.
      const d = dist(pet.x, pet.y, sim.hole.x, sim.hole.y) || 1;
      const fleeSpeed = def.speed * 2.2;
      pet.x += ((pet.x - sim.hole.x) / d) * fleeSpeed * dts;
      pet.y += ((pet.y - sim.hole.y) / d) * fleeSpeed * dts;
      pet.x = Math.max(20, Math.min(PLAY_W - 20, pet.x));
      pet.y = Math.max(PLAY_TOP + 20, Math.min(PLAY_BOTTOM - 20, pet.y));
    } else {
      const targetP = def.patrol[pet.patrolIdx];
      const d = dist(pet.x, pet.y, targetP.x, targetP.y);
      if (d < 4) {
        pet.patrolIdx = (pet.patrolIdx + 1) % def.patrol.length;
      } else {
        const stepLen = Math.min(d, def.speed * dts);
        pet.x += ((targetP.x - pet.x) / d) * stepLen;
        pet.y += ((targetP.y - pet.y) / d) * stepLen;
      }
    }
    const pd = dist(pet.x, pet.y, sim.hole.x, sim.hole.y);
    if (pd < PET_RADIUS + sim.hole.r * 0.7 && pet.cooldownLeft <= 0 && sim.coins > 0) {
      const stolen = Math.min(sim.coins, def.steal);
      sim.coins -= stolen;
      pet.cooldownLeft = def.cooldown;
      pet.fleeingUntil = sim.elapsed + 2;
      events.push({ type: 'steal', amount: stolen, x: pet.x, y: pet.y });
    }
  }

  // --- win / lose ---
  // Goldens are a side objective: they never block the win (a fast clear
  // must not wait for a golden to spawn), but 3 stars need every golden.
  const remainingBase = sim.objects.filter((o) => !o.eaten && !o.def.golden).length;
  if (remainingBase === 0) {
    sim.over = true;
    sim.won = true;
    sim.stars = starsFor(sim.timeLeft, sim.goldensEaten, sim.goldensTotal);
    events.push({ type: 'win', stars: sim.stars, timeLeft: sim.timeLeft, coins: sim.coins });
  } else if (sim.timeLeft <= 0) {
    sim.over = true;
    sim.won = false;
    sim.stars = 0;
    events.push({ type: 'lose', coins: sim.coins });
  }
  return events;
}

/** Objects still on the table (for the HUD "left" counter). */
export function remainingCount(sim: HoleSim): number {
  return sim.objects.filter((o) => !o.eaten).length;
}
