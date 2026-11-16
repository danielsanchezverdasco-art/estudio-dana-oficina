// validate-levels.mjs — headless level validation for Draw Bridge Delivery.
// Imports src/levels.ts directly (Node 24 type-stripping, no build step).
// Checks, per level: par/ink arithmetic, solution endpoints, slope bounds,
// wall clearance, coin reachability, moving-platform meets, trampoline
// meets, dual structure, and the anti-trivial rule (from L6 on, the
// straight line start->goal must NOT win — except documented teaching
// levels where the straight bridge IS the lesson).
// DYNAMICS (drive force, bounce height, moving timing, the 5 px goal step)
// are NOT checkable here — the browser harness measures those.
import {
  LEVELS, LEVEL_COUNT, getLevel, parOf, inkOf, solutionLen, round5,
} from '../src/levels.ts';

// Climb bounds — MUST match SCOOTER.maxClimbWoodDeg / maxClimbTurboDeg in
// src/vehicle.ts (vehicle.ts imports Phaser, so it cannot be imported here).
const MAX_CLIMB_WOOD = 25;
const MAX_CLIMB_TURBO = 40;

const failures = [];
const notes = [];
let checks = 0;
function check(ok, msg) {
  checks++;
  if (!ok) failures.push(msg);
}
function note(msg) {
  notes.push(msg);
}

const segAngleDeg = (a, b) => Math.atan2(a.y - b.y, Math.abs(b.x - a.x)) * 180 / Math.PI; // + = uphill (b higher than a)
const distToSeg = (p, a, b) => {
  const dx = b.x - a.x, dy = b.y - a.y;
  const l2 = dx * dx + dy * dy;
  const t = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
};
const distToPoly = (p, pts) => {
  let best = Infinity;
  for (let i = 1; i < pts.length; i++) best = Math.min(best, distToSeg(p, pts[i - 1], pts[i]));
  return best;
};
const segHitsRect = (a, b, r, inset = 0) => {
  // Sampled intersection: true if the segment passes through the rect.
  const steps = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 4);
  for (let i = 0; i <= steps; i++) {
    const x = a.x + (b.x - a.x) * (i / steps);
    const y = a.y + (b.y - a.y) * (i / steps);
    if (x > r.x + inset && x < r.x + r.w - inset && y > r.y + inset && y < r.y + r.h - inset) return true;
  }
  return false;
};
const pointInRect = (p, r, pad = 0) => p.x >= r.x - pad && p.x <= r.x + r.w + pad && p.y >= r.y - pad && p.y <= r.y + r.h + pad;

// Levels where the straight bridge IS the lesson (anti-trivial waived).
const ANTITRIVIAL_WAIVED = {
  1: 'tutorial: first bridge',
  2: 'tutorial: downhill',
  3: 'tutorial: uphill',
  4: 'tutorial: wide gap',
  6: 'wind teach: straight bridge, wind is the lesson',
  7: 'headwind flavor: straight bridge, wind is the lesson',
  10: 'turbo teach: the straight steep climb IS the lesson',
  11: 'turbo + wind teach',
  18: 'dual teach: two straight bridges',
  19: 'dual + wind teach',
  22: 'turbo ridge: the straight steep climb IS the lesson',
  24: 'long haul: straight bridge, ink economy is the lesson',
  28: 'ink saver: precision straight line IS the lesson',
};

check(LEVELS.length === LEVEL_COUNT, `LEVEL_COUNT mismatch: ${LEVELS.length} levels, LEVEL_COUNT=${LEVEL_COUNT}`);

for (const L of LEVELS) {
  const tag = `L${L.n}`;
  check(L.n >= 1 && L.n <= 30, `${tag}: n out of range`);
  check(getLevel(L.n) === L, `${tag}: getLevel mismatch`);
  const len = solutionLen(L);
  const par = parOf(L);
  const ink = inkOf(L);
  check(par === round5(len * 1.1), `${tag}: par ${par} != round5(${len.toFixed(1)}*1.1)`);
  check(ink === round5(par * L.inkFactor), `${tag}: ink ${ink} != round5(${par}*${L.inkFactor})`);
  check(len >= par * 0.85 && len <= par, `${tag}: solution ${len.toFixed(1)} outside 85-100% of par ${par}`);
  check(L.inkFactor >= 1.1 && L.inkFactor <= 2.0, `${tag}: inkFactor ${L.inkFactor} out of [1.1, 2.0]`);
  check(L.coins.length >= 1 && L.coins.length <= 3, `${tag}: ${L.coins.length} coins (want 1..3)`);
  check(L.startPlat.x === 0 && L.startPlat.w === 90, `${tag}: start plat must be x=0 w=90`);
  check(L.goalPlat.x + L.goalPlat.w <= 390, `${tag}: goal plat overflows 390`);
  check(L.goalPlat.x - (L.startPlat.x + L.startPlat.w) >= 60, `${tag}: gap < 60px`);

  const maxClimb = L.inkType === 'turbo' ? MAX_CLIMB_TURBO : MAX_CLIMB_WOOD;
  // Slope bounds + wall clearance on every solution segment.
  for (const poly of L.solution) {
    for (let i = 1; i < poly.length; i++) {
      const a = poly[i - 1], b = poly[i];
      const ang = segAngleDeg(a, b);
      check(ang <= maxClimb + 0.01, `${tag}: uphill ${ang.toFixed(1)}deg > ${maxClimb}deg (${L.inkType}) on (${a.x},${a.y})->(${b.x},${b.y})`);
      check(Math.hypot(b.x - a.x, b.y - a.y) <= 400, `${tag}: segment > 400px`);
      for (const wl of L.walls) {
        // Endpoints may rest on a ledge (trampoline levels): ignore samples
        // within 16px of either polyline end.
        const steps = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 4);
        let hit = false;
        for (let s = 0; s <= steps; s++) {
          const x = a.x + (b.x - a.x) * (s / steps);
          const y = a.y + (b.y - a.y) * (s / steps);
          const nearEnd = Math.hypot(x - poly[0].x, y - poly[0].y) < 16 || Math.hypot(x - poly[poly.length - 1].x, y - poly[poly.length - 1].y) < 16;
          if (!nearEnd && pointInRect({ x, y }, wl, -2)) { hit = true; break; }
        }
        check(!hit, `${tag}: solution crosses wall (${wl.x},${wl.y},${wl.w}x${wl.h})`);
      }
    }
  }

  // Endpoints: first polyline starts at the start cliff edge. Every route
  // must end somewhere real: a goal platform, a trampoline, or a moving
  // platform edge. Dual levels need one route per goal.
  const first = L.solution[0][0];
  const lastPoly = L.solution[L.solution.length - 1];
  const last = lastPoly[lastPoly.length - 1];
  check(Math.abs(first.x - (L.startPlat.x + L.startPlat.w - 2)) <= 16, `${tag}: solution starts x=${first.x}, want ~${L.startPlat.x + L.startPlat.w - 2}`);
  check(Math.abs(first.y - L.startPlat.y) <= 16, `${tag}: solution starts y=${first.y}, want ~${L.startPlat.y}`);
  const endsAt = (poly, plat) => {
    const e = poly[poly.length - 1];
    return e.x >= plat.x - 8 && e.x <= plat.x + plat.w + 8 && Math.abs(e.y - plat.y) <= 16;
  };
  const endsOnTrampoline = (poly) => {
    if (!L.trampolines[0]) return false;
    const tp = L.trampolines[0];
    const e = poly[poly.length - 1];
    return e.x >= tp.x - 8 && e.x <= tp.x + tp.w + 8 && Math.abs(e.y - tp.y) <= 16;
  };
  if (L.solutionEndsAt === 'trampoline') {
    check(!!L.trampolines[0], `${tag}: solutionEndsAt=trampoline but no trampoline defined`);
    check(endsOnTrampoline(lastPoly), `${tag}: last solution ends (${last.x},${last.y}), want on trampoline`);
  } else if (L.start2Plat) {
    check(L.solution.some((poly) => endsAt(poly, L.goalPlat)), `${tag}: no solution ends at goal 1`);
    check(L.solution.some((poly) => endsAt(poly, L.goal2Plat)), `${tag}: no solution ends at goal 2`);
  } else {
    check(endsAt(lastPoly, L.goalPlat), `${tag}: solution ends (${last.x},${last.y}), want on goal plat ${L.goalPlat.x}..${L.goalPlat.x + L.goalPlat.w}, y~${L.goalPlat.y}`);
  }

  // Dual structure.
  const isDual = !!L.start2Plat;
  if (isDual) {
    check(!!L.goal2Plat, `${tag}: dual needs goal2Plat`);
    check(L.solution.length >= 2, `${tag}: dual needs >= 2 solution polylines`);
    const s2 = L.solution[L.solution.length - 1][0];
    check(Math.abs(s2.x - (L.start2Plat.x + L.start2Plat.w - 2)) <= 16, `${tag}: 2nd solution starts x=${s2.x}, want ~${L.start2Plat.x + L.start2Plat.w - 2}`);
  } else {
    check(!L.goal2Plat, `${tag}: goal2Plat without start2Plat`);
  }

  // Moving platforms: solution segments must meet the platform at rest.
  for (const m of L.moving) {
    const left = m.cx - m.w / 2, right = m.cx + m.w / 2;
    const meets = L.solution.some((poly) => {
      const s = poly[0], e = poly[poly.length - 1];
      return (Math.abs(e.x - left) <= 10 && Math.abs(e.y - m.y) <= 4) || (Math.abs(s.x - right) <= 10 && Math.abs(s.y - m.y) <= 4);
    });
    check(meets, `${tag}: no solution segment meets moving platform (cx ${m.cx}, span ${left}..${right}, y ${m.y})`);
    check(m.range >= 30 && m.range <= 50, `${tag}: moving range ${m.range} outside 30..50`);
    check(m.periodMs >= 2500 && m.periodMs <= 4000, `${tag}: moving period ${m.periodMs}ms outside 2500..4000`);
  }

  // Coins: near the solution (or in the bounce arc for trampoline levels —
  // the arc rises ~130 px above the straight trampoline->goal line).
  for (const c of L.coins) {
    let d = Math.min(...L.solution.map((poly) => distToPoly(c, poly)));
    let allow = 50;
    if (L.solutionEndsAt === 'trampoline' && L.trampolines[0]) {
      const tp = L.trampolines[0];
      const arc = distToSeg(c, { x: tp.x + tp.w / 2, y: tp.y }, { x: L.goalPlat.x + 20, y: L.goalPlat.y - 10 });
      if (arc < d) { d = arc; allow = 120; }
    }
    check(d <= allow, `${tag}: coin (${c.x},${c.y}) is ${d.toFixed(0)}px from the solution/arc (want <= ${allow})`);
    for (const wl of L.walls) check(!pointInRect(c, wl, -4), `${tag}: coin (${c.x},${c.y}) inside a wall`);
  }

  // Anti-trivial: the straight line start-edge -> goal-edge must NOT win.
  // The bridge body is 10 px thick, so the wall test expands every wall by
  // 5 px — a centreline grazing a wall edge still collides in Matter.
  const startEdge = { x: L.startPlat.x + L.startPlat.w - 2, y: L.startPlat.y };
  const goalEdge = { x: L.goalPlat.x + 2, y: L.goalPlat.y };
  const straightLen = Math.hypot(goalEdge.x - startEdge.x, goalEdge.y - startEdge.y);
  const straightAng = segAngleDeg(startEdge, goalEdge);
  const straightHitsWall = L.walls.some((wl) => segHitsRect(startEdge, goalEdge, wl, -5));
  const straightWins = straightLen <= ink && straightAng <= maxClimb && !straightHitsWall && L.solutionEndsAt !== 'trampoline' && L.moving.length === 0 && !isDual;
  if (ANTITRIVIAL_WAIVED[L.n]) {
    note(`${tag}: anti-trivial WAIVED — ${ANTITRIVIAL_WAIVED[L.n]} (straight len ${straightLen.toFixed(0)}, ink ${ink})`);
  } else {
    check(!straightWins, `${tag}: TRIVIAL — straight bridge wins (len ${straightLen.toFixed(0)} <= ink ${ink}, angle ${straightAng.toFixed(1)}deg, wall ${straightHitsWall})`);
  }
}

console.log(`validate-levels: ${checks} checks, ${failures.length} failures, ${notes.length} notes`);
for (const f of failures) console.log(`  FAIL ${f}`);
for (const n of notes) console.log(`  note ${n}`);
if (failures.length > 0) {
  console.log('RESULT: FAIL');
  process.exit(1);
}
console.log('RESULT: PASS — all 30 levels geometrically valid');
