# Teardown — Ramp Physics: Ragdoll Crash Test

**Game:** Ramp Physics: Ragdoll Crash Test (Dana Games, round 1)
**Date:** 2026-11-15
**Sources:** AppBrain, Google Play, App Store, Sensor Tower summaries, Wikipedia, Playgama catalog (checked 2026-11-15). All figures are the latest public figures found on that date; where a figure is an estimate it is marked as such.

## 1. The genre: draw-to-build physics

The core loop — draw a line, watch physics play out — has two proven ancestors:

### Happy Glass (Lion Studios, 2018)
- **280M installs** (AppBrain, cumulative), **100M+ on Google Play**, 892,327 Google Play reviews.
- Rating: **3.47★ Google Play / 4.26★ App Store**.
- Mechanic: one line type, one goal (fill the glass). 100+ levels, stars, coins.
- **Top complaint in reviews: ads after every level** — "Too many ads makes the game insufferable". Retention killer, not a monetisation win.
- Weaknesses vs us: a single line type (no elastic, no accelerator), no ragdoll, no chained collisions, no daily challenge, no map with chests.

### Line Rider (Boštjan Čadež, Sept 2006)
- **34M downloads**, #7 Google Zeitgeist 2006, 15M YouTube views by Dec 2006, covered by Time and NYT, used in a McDonald's campaign.
- Mechanic: draw a track, watch the rider. Pure sandbox.
- Weaknesses vs us: **no goals, no score, no fail state, no progression** — a toy, not a game. Steep learning curve (no tutorial, no ghost line).

### Draw Line: Brain Collection (2026)
- **2.8M installs** (AppBrain, Feb 2026). Same draw-to-solve family, still growing — the mechanic is not exhausted.

## 2. Direct Playgama competitor

### Ragdoll Crash-Test: Throw and Break! (Ivan Popenya, Dec 2024, Unity)
- Found on Playgama: a ragdoll crash-test game where the player **throws** a stickman into traps.
- **Title collision risk:** our GDD title "Ragdoll Crash Test" is nearly identical. **Proposed main title: "Ramp Physics"** (no known game by that name on Playgama), full title "Ramp Physics: Ragdoll Crash Test". Decision pending with Daniel.
- Weaknesses vs us: throwing is a single gesture with no building; no ink economy; no stars-by-efficiency; no 30-level progression with fans, dynamite and gravity portals.

### Other ragdoll references
- **Body Drop 3D** (crash-test dummy, 0.9M+ plays on web portals): dummy + traps, no drawing.
- **Ragdrop** (Phaser 3 + Matter.js, open source): 10-body ragdoll — direct technical precedent for our physics (we use the same 10-body layout).
- **Human Playground Sandbox**: 3.1M installs, 2.8★ — sandbox without goals.
- **Dummy Ragdoll Dismount (BoomBit)**: review quote — "unplayable because of all the ads… uninstalled after 5 minutes". Same ad lesson as Happy Glass.

## 3. How Ramp Physics beats them (≥3 points)

1. **Draw-to-build + goals with 3 ink types vs 1 line type.** Standard steel, elastic (bouncy) and accelerator (boost) ramps; ink is a real economy (budget + par for stars), not an infinite pencil.
2. **Progression vs no progression.** 30 hand-tuned levels in 4 arcs (pits → fans → dynamite → gravity portals), map with stars, chests every 3rd level, streak, daily challenge, coins, shop with dummy skins.
3. **Fair ads vs ad complaints.** Interstitial only every 2nd win, never level 1, never on first retry; rewarded ad only for +150 ink on demand. Happy Glass and Dummy Ragdoll Dismount both lost players to ad spam — we do the opposite.
4. **Comic ragdoll dummy with reactions vs abstract water/glass or a stickman.** A 10-body Matter ragdoll (head, torso, 2 arms, 2 legs with constraints) that tumbles, bounces and flies — the crash IS the show.

## 4. Risks noted

- **Fan / portal / dynamite levels are physics-sensitive.** Every level ships with an explicit solution stroke list that the test harness plays back end-to-end; a level whose solution does not win does not ship.
- **Title near-collision** with "Ragdoll Crash-Test: Throw and Break!" on Playgama — mitigated by leading with "Ramp Physics".
- **Ragdoll stalling on gentle slopes** — mitigated by ramp friction 0.1 (smooth steel) and solution slopes ≥10°.
- **Ad fatigue** — mitigated by the interstitial cadence above (see §3.3).
