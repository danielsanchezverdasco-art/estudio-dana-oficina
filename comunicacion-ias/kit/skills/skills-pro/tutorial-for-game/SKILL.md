---
name: tutorial-for-game
description: >-
  The tutorial / FTUE (first-time-user-experience) / onboarding system for a web/mobile game —
  teach the core loop to a brand-new player without losing them, then get out of the way. A reusable,
  no-build vanilla-JS kit distilled from Slapstick: a welcome card that teaches the core verbs, a
  forced "play gate" (dim the screen, a hand points at the ONE required tap, all other input blocked),
  first-session hand-holding that forces each new action exactly once then releases to free play,
  keyed spotlight/coach-mark bubbles that point at a target element, persistent-state-machine forced
  tutorials that trigger at the first relevant moment (first loss → upgrade, first chest → open it)
  and survive reloads, a data-driven rookie-quest checklist with rewards, and the migration + analytics
  discipline so veterans never re-see onboarding. USE whenever adding a tutorial, FTUE, onboarding /
  first-run flow, coach-marks / tooltips / spotlight, a guided first session, a "teach the player how
  to play" sequence, a forced first-time action, rookie/starter quests, or a hand-pointer gate. Bundles
  the coach-mark + force-gate runtime (JS + CSS) and the FTUE architecture. Pairs with game-ui-ux (the
  coach-mark component styling + FTUE screen), liveops-retention (rookie quests vs daily quests),
  web-game-foundation (analytics tutorial events), and gamefeel-juice (reward feel on task claim). Do
  NOT use for the help/settings docs of an existing game, or for in-battle combat logic itself.
---

# Tutorial / FTUE / Onboarding system

The first session decides retention. This skill is the reusable **onboarding layer** — how to take a
player who has never seen your game, teach the core loop *by doing it*, guarantee they can't get
stuck, and then disappear so the game can breathe. Distilled from Slapstick's FTUE pass; it is
engine-agnostic (it drives DOM elements + a persistent state object), so it drops onto any web game.

It is **runtime + architecture**, not one file to copy whole: lift the coach-mark/force-gate runtime,
wire the state machine to your screens, and fill in your own copy.

## Interview first (AskUserQuestion)

Before building, ask with `AskUserQuestion` (skip what the GDD already fixes):
- **Onboarding intensity** (single) — `Forced (hand-hold the first session)` · `Guided (coach-marks,
  skippable)` · `Light (one welcome card)`
- **Core verbs to teach** (multiSelect) — the 2–3 actions the player MUST learn (e.g. `the main action`
  · `the timing/aim` · `the defend` · `open a reward`)
- **Rookie-quest checklist** (single) — `Yes (data-driven tasks + rewards)` · `No`

Use the answers to pick which layers to wire and how hard to force them.

## The layered model (apply top-to-bottom)

A complete FTUE is a few cooperating layers, each doing one job. Build only the ones the interview
selected, but build them in this order:

1. **Welcome card** — a first-launch popup that teaches the 2–3 core verbs in one screen (short,
   bolded keywords, one CTA). Fire `tutorial_start`/`tutorial_end` analytics around it.
2. **Force play-gate** — the cornerstone "can't get lost" move: dim the *whole* screen, punch one
   bright hole around the single required control (the PLAY button), float a bouncing hand at it,
   block every other tap, and proceed **only when the player actually taps it**. (See `forceTap`.)
3. **First-session hand-holding** — inside the core loop, force each *new* action exactly once (pick
   a move → time the tap → defend), with a one-line coach banner each, then **release to free play**.
   Teach by doing, never with a wall of text mid-action.
4. **Spotlight / coach-marks** — on meta screens, a keyed bubble + glow points at a target element.
   Re-target by `key` (no flicker on periodic re-renders), reposition on resize, auto-clear when the
   target is gone.
5. **Forced contextual tutorials (persistent state machine)** — `tut: null → 'go' → 'done'`,
   triggered by the engine at the **first relevant moment** (first loss → "go upgrade your power";
   first chest arrives → "open it"), each step spotlighting the next thing to tap across screens,
   completing on the **real action**, surviving reload. Key each so several can coexist.
6. **Rookie-quest checklist** — a data-driven task list (`{id, icon, label, reward}`): marked done
   in-context, claimed on the home screen, hidden once all claimed, shown only to players who passed
   welcome. (This is *onboarding* content; recurring daily quests live in `liveops-retention`.)
7. **Migration + analytics discipline** — on load, defensively mark veterans `done` so they never
   re-see onboarding; emit the tutorial/rookie-quest events so you can measure step drop-off.
8. **Depth coaching that fades (progressive disclosure)** — FTUE teaches the *controls*; this teaches
   the *depth* the controls unlock, then gets out of the way. If your game hides its skill ceiling
   behind emergent play (combo lines, "defend right before the big hit"), mass users never see it and
   call the game shallow. So surface it gently: after a player uses a setup move, **glow the optimal
   follow-up** with a tiny "COMBO →" tag; when the enemy is winding up a big hit, **pulse the defend
   skill** for one turn. Crucially, **show it only early and fade it by skill** — Slapstick shows
   these hints only in the bottom ranks / first ~15 matches and removes them at higher ranks. This
   **lowers the floor without lowering the ceiling**: newbies feel the depth immediately, experts read
   it themselves with a clean screen. Store the fade state on the FTUE flag; it's pure UI and must not
   touch balance.

## Two kinds of teaching: controls vs depth

FTUE (layers 1–6) is **one-shot, forced, front-loaded into the first session** — learn the verbs,
then it's gone forever. Depth coaching (layer 8) is **ongoing-but-fading, never forced, hint-only** —
it keeps surfacing the deep play for a while, then retires as the player's rank/match-count proves
they don't need it. Don't conflate them: forcing a combo lesson is annoying; one-shotting depth means
the player forgets it before it matters. Match the cadence to the lesson.

## Bundled references

- `references/system.md` — the architecture in depth: the persistent `ftue` state shape, the
  `null→go→done` state-machine pattern, the engine hooks (where each layer triggers/completes), the
  migration rules, and the analytics taxonomy. **Read this first.**
- `references/coach-marks.reference.js` — the copyable runtime: `Coach.spotlight()` (keyed bubble +
  glow + smart above/below placement) and `Coach.forceTap()` (the dim-everything force-gate returning
  `Promise<boolean>`), plus positioning/teardown. Vanilla DOM, no deps.
- `references/coach-marks.reference.css` — the styles for the glow, bubble + tail, force mask/hole,
  and the bouncing hand. Re-skins via CSS vars (matches `game-ui-ux` tokens).

## Rules (learned the hard way on Slapstick)

- **Advance only on the REAL action — never press for the player.** `forceTap` resolves
  `Promise<boolean>`: the caller runs the action **only on `true`** (an actual tap). A `false`
  (the gate was torn down by a re-render) must NOT trigger the action — otherwise a background sync
  "auto-plays" the tutorial. This single rule is what makes a forced flow trustworthy.
- **Trigger at the first relevant moment, not upfront.** The open-chest tutorial fires when the
  player's *first* chest actually arrives, the upgrade tutorial on the *first* loss — not at install.
  Onboarding that front-loads every lesson is forgotten before it's needed.
- **Key every spotlight.** Re-targeting the same `key` repositions the existing bubble (no flicker
  when a screen re-renders every second, e.g. a counting-down timer) and lets two tutorials run
  without trashing each other's bubble. `clearSpotIfKey(key)` only clears *its own*.
- **Wait for all popups to close before dimming.** Don't drop the force-mask over a welcome/login/
  reward popup — poll until `.popup.show` is gone, then gate.
- **One thing at a time, exactly once, then let go.** Force a step the first time, mark it done, and
  never force it again. Heavy explanation lives only in the intro card; in-action coaching is one
  short line.
- **Migrate veterans out.** On load, if the player already did the thing (has matches / owns a box /
  already upgraded), set the tutorial flags to `done` so existing saves never get re-onboarded.
- **Fail-safe: no target → skip the force, don't block.** If the element isn't rendered, resolve
  `false` and let the player act normally — a tutorial must never deadlock the game.
- **Add the reveal/`show` class directly, not via `requestAnimationFrame`** — rAF is throttled when
  backgrounded and the coach-mark won't appear.
- **Honor reduced-motion + mute** for the glow pulse / hand bounce and the task-claim juice.

## Pairs with

`game-ui-ux` (the coach-mark/FTUE component lives in its design system — this is the *logic* behind
it; `requirements.md` lists FTUE as a mandatory screen), `liveops-retention` (rookie quests are the
onboarding cousin of its daily quests + feature-unlock curve), `web-game-foundation` (the analytics
layer that records `tutorial_start/end` + rookie-quest events), `gamefeel-juice` (the reward feel when
a rookie task is claimed), `replayability-modes` (the emergent depth — combo lines, boons, mutators —
that layer-8 depth coaching surfaces to mass users). The combat/loop being taught is the host game's,
not this skill's.
