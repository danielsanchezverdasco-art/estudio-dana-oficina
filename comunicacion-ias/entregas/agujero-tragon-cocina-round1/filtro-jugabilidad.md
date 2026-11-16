# Filtro jugabilidad — Kitchen Hole round 1

## The verb

One finger, one verb: **drag the hole**. Everything that fits gets
swallowed; the hole grows; the kitchen gets clean. No reading to start:
level 1 shows a hand following the planned route and the first swallow
happens on contact.

## Mechanics (all in src/rules.ts, pure logic, unit-tested)

| Mechanic | Rule | Why it matters |
|---|---|---|
| Fit | `obj.r <= hole.r * 1.1`, else wobble + throttled tooBig | The player reads size at a glance; "too big" is a visible wall, not a hidden fail |
| Growth | Each object adds its `grow` to the hole radius | Growth IS the progress; the fridge (r52) needs r ≥ 47.3 — the level's ladder |
| Swallow | Centre distance < `hole.r * 0.85` | Generous: the hole eats what overlaps it, no pixel-perfect aiming |
| Timer | 60 + floor((n−1)/2) s (L1 60 → L30 74) | Pressure without panic; the precise route clears in 1.4–5 s, humans take far longer |
| Win | Eat EVERYTHING (CLEANUP) | The mockup's level name; no quota to read, no hidden objective |
| Stars | 3 = 15+ s left AND all goldens · 2 = 5+ s · 1 = win | 3★ needs the goldens — the risk/reward loop |
| Pet | Patrols; on touch steals `steal` coins, 5 s cooldown, dashes away | Score threat only — it can never cost the win (fairness rule) |
| Golden | Spawns mid-level, ×3 value, 8 s TTL, then expires | Urgency + routing decision; spawns near the pet's patrol |
| Movers | Mouse flees ×1.8 within 90 px; apple rolls its patrol | Cornering skill; the mouse is the only object that runs |

## Difficulty plan (evaluating-gameplay-balance)

- **New toy per block:** L1 verb only · L5 first furniture (size ladder)
  · L6 dog (steal 10) · L11 golden (×3, 8 s) · L16 movers (mouse flees,
  apple rolls) · L21 fridge (eat small first) · L26–30 everything combined.
- **Growth ladder enforced by construction:** every level's non-fridge
  growth sum exceeds the fridge threshold (34.3) with margin — the
  harness PROVED it: L5/L7/L21 were short in early drafts and were fixed
  by adding ladder objects (see informe-ronda1.md § fixes).
- **Anti-trivial policies (harness `tools-local/sim.ts`):**
  - idle (never touches the hole): **0/30 wins** — doing nothing loses.
  - sweeper (lawnmower rows): **0/30 wins** — mashing a pattern loses.
  - greedy (nearest eatable): 30/30 — the core verb works; the game is
    won by PLAYING, not by a trick.
  - solution (planned route): **30/30 wins** — every level is winnable.
  - solution3 (golden-aware): **30/30 wins, 30 at 3★** — 3★ is
    achievable on every level (holds the last object for the goldens).
- **Exploratory ratio** (solution coins / best monotonous coins): 1.4×–
  9.1× on L1–L7, large from L8 (the sweeper earns ≤1 coin there) —
  exploring the kitchen pays, mowing it does not.
- **Precise clear times:** 1.4–5.0 s (solution) vs 60–74 s timers. The
  levels are generous for a perfect player by design (casual game, PEGI
  3); the human challenge is routing, pet avoidance and golden timing.

## Difficulty verdict: NOT YET MEASURED

Precise policies are not humans. The verdict needs the 3-tester human
playtest (playtest-report template): 3 fresh players, levels 1/6/11/16/
21/30, record time-to-first-swallow, time-to-win, stars, deaths by
timer, and whether the fridge levels feel fair. Until then the honest
status is: winnable and non-trivial by construction, difficulty
unmeasured.
