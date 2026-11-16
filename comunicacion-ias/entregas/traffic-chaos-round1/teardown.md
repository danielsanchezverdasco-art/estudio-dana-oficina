# Teardown — Traffic Chaos: New York Rush (Round 1)

Condensed from Niky's full teardown (branch `niky/teardown-traffic-chaos`,
`comunicacion-ias/analisis-competencia/teardown-traffic-chaos-2026-11-15.md`,
91.801 B, 15/11/2026) + the answers this round 1 build gives to its three defeats.
All figures below are Niky's, sourced in the full teardown; nothing here is invented.

## The bar (what «winning» means)

Winning is beating the best in each dimension on what YouTube Playables users actually
consume. The liston: first frame decides in ~8 s whether the user taps Play; one
decision with a cost every 5–8 s; one big visible satisfaction moment per action;
fail fast, retry in <2 s; levels 45–60 s; onboarding ≤10 s, one finger, zero reading;
session target 3–8 min (4–8 levels). Simulation is 24 % of Playables plays (1,4B,
TubeGames 15/11/2026).

## The six games torn down

| Game | Scale (sourced) | Verbo | What to copy | What NOT to copy |
|---|---|---|---|---|
| **Traffic Escape!** (FOMO GAMES) | ~44M installs est. (AndroidRank 31/10/2026); 10M+ Google Play | Tap cars in the right order to empty the crossing; roof arrows are the rule | Arrow on the roof = rule without text; visible punishment (cars return); integrated hint | Turn-based, no real-time pressure; levels repeat (review: «all the stages are the same», lvl 320) |
| **Traffic Jam 3D** (Playgama, Rush Hour puzzle) | In the most-popular lists; no public play figures | Slide cars on a grid to free the trapped car | — | Another turn-based puzzle; no time pressure |
| **Traffic Jam Escape 3D** (Playgama) | Playgama Traffic Games collection (180+ traffic games) | Tap cars out of the jam, gems, boosters (rockets, helicopter) | Boosters as a frustration valve | Turn-based puzzle + gem economy |
| **Draw Crash Race** (Andrey Melnikov, Playgama) | **2,5M plays Playables; 968K in 7 days** (Playgama column 11/09/2026); #13 Top 20 Car Games | Draw your car, connect the wheels, race 5 bots | The player creates something before playing; 3 legible upgrades; physics IS the feedback | Not traffic, not management — an execution lesson, not a genre one |
| **Crazy Flying Car** | **365K plays/day** (Mediacube 01/07–04/09/2026); **11M all-time, #15 Playgama on Playables** | Fly a winged car over the abyss | The crash as reward, not punishment; slow-mo as a designed moment | Sandbox without management decisions |
| **Car Crash Sandbox** | **236K plays/day**; **7,1M all-time**; with Crash Engine (6,4M) + Car Crash Physics 3D (4,4M) + Crazy Flying Car + Racing Limits = **13,6M plays in their first weeks** | Crash sandbox | Deformation/destruction as visible feedback | Free chaos, no curve |
| **Crime and Vice City Police** (KreizLand) | **4,9M plays; 2M in 7 days**; 4,7/1.566 | Crash and watch it in slow motion | Slow-mo + deformation IS the reward | Sandbox, no management |
| **MR RACER / Traffic Racer** | **12M plays, #14 Playgama on Playables** | Dodge traffic at speed | — | Traffic as background, not as a system |

## Verdict by dimension (Niky's, §4 — «if the concept doesn't beat the best in a dimension, say so»)

| Dimension | Best in genre | Our concept | Verdict |
|---|---|---|---|
| Art / visual quality | Draw Crash Race (your drawing IS the car); Crime (deformation); Traffic Escape! (clean legible 3D) | 2.5D Times Square diorama, vehicles recognisable by colour/shape without reading | **TIES on paper, does NOT win yet** — the mockup is a generated image, not directed art with an art bible |
| First frame / visual hook | Arrow Puzzle (cover teaches the rule); Coin Run (one object, one choice, two colours) | Mockup: recognisable city + «TAP THE LIGHT!» + patience rings; the verb is intuited but depends on reading | **LOSES today** — the best needs no text; we do, and we show the empty city instead of the crash |
| Feel / juice | Crime (slow-mo + deformation); Epic Sword (ragdoll); Crazy Flying Car (breaking physics) | Chain crash in slow-mo + hit-stop + flying parts (designed, not built) | **LOSES today** — the best has the moment built and tested; we have it written |
| 10-second hook | Traffic Escape! (first car shoots out); Slope 3D (ball already rolling) | First green light + first car pulling away + first ring dropping | **TIES on paper** — designed, not proven: does the user tap the light in the first 3 s without reading? |
| Decisions (depth) | Traffic Escape! (exit order, puzzle); Bridge Race (greed vs speed) | 8 s patience + ambulance/bus priority + gridlock + roundabout diversion. One decision with a cost every 5–8 s, in real time | **WINS on paper** — the only dimension where the concept beats the best: no traffic competitor combines real time + visible patience + emergency priority |
| Replayability | Draw Crash Race (every race a new drawing + 3 upgrades); Traffic Escape! (stars + Race mode) | 5 chapters with new spatial mechanics + quota + BOOST. No visible meta, no daily/leaderboard defined | **LOSES today, WITH THE COMEBACK DEFINED** — neighbourhood tycoon meta + daily «rush hour» challenge + login reward |
| Onboarding (10 s, one finger, zero reading) | All tops: the first screen IS the game | One verb (tap) + swipe + roundabout drag + BOOST | **TIES on paper** — tap passes; the risk is BOOST 2x (what does it do?) and the drag (is it discovered alone?) |
| Monetisation | Traffic Escape! (ads + hints + remove-ads); Playgama: interstitial at pauses, optional rewarded | Not defined in the GDD | **NOT VERIFIABLE / LOSES by absence** |
| Performance | Epic Sword claims 60 FPS on cheap phones (portal claim, not our measurement) | No build. Official: initial bundle <15 MiB (SHOULD), <5 s to interactive, heap <512 MB | **NOT VERIFIABLE** |
| Sound | Draw Crash Race is the only one whose listing mentions sound design | GDD: adaptive city hum, clicks, horns, two-tone sirens, comic springs. Sound as a tactical tool | **TIES on paper, LOSES on evidence** — the sound design is better than most, but no sound exists or has been heard by a human |
| Identity / city | No traffic competitor has a real city with identity; their cars are generic | Real Times Square: TKTS, Broadway, MTA, FDNY, yellow taxis. The city is the character | **WINS on paper** — the second real advantage |

**One-line verdict (Niky): the concept wins in 2 dimensions (decisions, identity),
ties in 3 (art, 10 s hook, onboarding, sound — on paper), loses in 3 (first frame,
feel/juice, replayability) and is not verifiable in 2 (monetisation, performance).**
It is not delivered as a «winner»: it is a concept with two real advantages and three
defeats the prototype has to come back from.

## The 3 points to beat (and what round 1 does about each)

1. **The slow-motion chain crash as the first frame, the cover and the Short — the
   failure anchor.** No top traffic game combines management + crash as a hook: Crime
   and Crazy Flying Car have the crash but not the management; Traffic Escape! has the
   management but not the crash.
   **Round 1 answer:** the game OPENS with the crash — attract mode plays a real
   simulated chain crash in the first frame (before the player touches anything), and
   the play button appears over it. The covers and the Short are filmed from that
   crash, not from the empty city. The failure anchor is the first thing the player
   sees, exactly as the demand doc (§6) requires.
2. **Decisions with a cost in real time — the advantage no rival has.** 8 s visible
   patience + ambulance/bus priority + gridlock. Traffic Escape! decides without time
   pressure; Crime decides nothing.
   **Round 1 answer:** the patience ring is big (28 px radius, green→amber→red), the
   horn is audible, and at 0 s the car REALLY goes (it ignores the light and drives
   into the crossing — the cause of the crash). The ambulance is absolute priority
   (never stops at red, 2 s warning, double points). The gridlock rule ends the level
   when a queue reaches the spawn edge. Protecting this advantage is the balance
   harness's job (see `filtro-jugabilidad.md`).
3. **Neighbourhood tycoon meta + daily challenge + login — the crack that holds D30.**
   Times Square → Brooklyn Bridge → Central Park as visible progression from day 1
   (the tycoon pattern, 286K/day) + daily «rush hour» challenge + login reward.
   **Round 1 answer:** the map IS the meta — three neighbourhoods of 10 levels each,
   unlocked by stars, with the daily challenge node (gold ring, 50 coins) and a login
   streak shown on the menu. The shop (3 garage skins) spends the coins the levels
   earn. Nothing is «coming soon»: the daily, the streak and the shop all exist in
   round 1.

## Sources (Niky's teardown)

- GDD: Daniel's «Traffic Chaos — Madrid Rush» (4 pp.) + mockup `mockup-traffic-chaos-ny.webp`.
- Internal: `analisis-competencia-youtube-playables-2026-11-15.md` (PR #22) and
  `kit/teardowns-competencia.md`.
- Playgama: https://playgama.com/game/draw-crash-race · https://playgama.com/EN/tag/traffic-games
- TubeGames (counts 14–15/11/2026): https://playables.games/publishers/playgama/ · https://playables.games/games/
- Mediacube: https://mediacube.io/en/blog/youtube-playables-game-mechanics (08/09/2026, data 01/07–04/09/2026)
- Playgama column 11/09/2026: https://playgama.com/blog/main/5-5m-plays-in-7-days-five-playgama-games-that-took-off-on-youtube-playables/
- Traffic Escape!: https://androidrank.org/application/traffic_escape_/com.bonnie.trafficescape
