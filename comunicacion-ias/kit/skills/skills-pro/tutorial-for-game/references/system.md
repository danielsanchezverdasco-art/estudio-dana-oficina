# FTUE architecture — state, hooks, migration, analytics

The onboarding layers share one persistent state object and a handful of engine/UI hooks. This is the
ground truth to wire; the runtime (`coach-marks.reference.js`) is just the visual mechanism the hooks
drive.

## The persistent `ftue` state

Keep all onboarding state under one key on the save (so it migrates and resets as a unit):

```js
ftue: {
  welcomed:  false,   // saw the welcome card (gates the rookie checklist + first-battle coaching)
  coached:   false,   // finished the first-battle hand-holding (never coach in-battle again)
  done:    {},        // { [taskId]: true }  — rookie task completed (marked in-context)
  claimed: {},        // { [taskId]: true }  — rookie task reward taken (on home)
  upgradeTut: null,   // forced contextual tutorial:  null → 'go' → 'done'
  boxTut:     null,   // another one, independent:      null → 'go' → 'done'
}
```

`isNewPlayer()` is just `matchesPlayed() === 0`. Everything keys off that + the flags above.

## The state-machine pattern (`null → 'go' → 'done'`)

Every *forced contextual* tutorial is one flag with three states:

- **`null`** — not yet relevant. The trigger hasn't happened.
- **`'go'`** — active. The engine set it the moment the thing first became relevant; the UI spotlights
  the next step every render while it's `'go'`.
- **`'done'`** — finished (or migrated past). Never shows again.

The engine flips `null→'go'` at the **first relevant moment**, and `'go'→'done'` when the player does
the **real action**:

```js
// engine: first chest ever granted → start the open-box tutorial
addBox(box) {
  ...
  const f = this._ftue();
  if (f.boxTut == null && !f.done.box && !f.claimed.box) f.boxTut = 'go';
}
// engine: a box was opened → tutorial complete
openBox(i) {
  ...
  const f = this._ftue(); if (f.boxTut === 'go') f.boxTut = 'done';
}
// engine: first loss → unlock the power-up screen + start the upgrade tutorial
onLoss() {
  if (firstLossEver) { this.s.upgradeUnlocked = true; this._ftue().upgradeTut = 'go'; }
}
```

The **UI re-checks the flag every render** and spotlights the *next* element to tap, branching on the
current screen — so the same flag walks the player across screens:

```js
runUpgradeTut() {
  if (Meta.s.ftue.upgradeTut !== 'go') { Coach.clearSpotIfKey('upgradetut'); return; }
  if (screen === 'result')      Coach.spotlight(resultUpgradeBtn, "Just lost? Tap to get STRONGER!", {place:'above', key:'upgradetut'});
  else if (screen === 'upgrade') Coach.spotlight(atkStatBtn,     "Tap to raise ATTACK!",            {place:'below', key:'upgradetut'});
  else if (screen === 'home')    Coach.spotlight(upgradeNavBtn,  "Go to UPGRADE!",                  {place:'above', key:'upgradetut'});
  else Coach.clearSpotIfKey('upgradetut');
}
// completed from the feature itself, on the real action:
afterStatUpgrade(stat) {
  if (Meta.s.ftue.upgradeTut !== 'go') return;
  if (stat !== 'atk') { toast("Nice! Now raise ATK too."); return; }   // nudge, don't complete on the wrong stat
  Meta.s.ftue.upgradeTut = 'done'; Meta.save(); Coach.spotClear();
}
```

Call `runXTut()` from every screen-render and from the feature actions, so the spotlight always tracks
the next step. Because it's persistent, closing the app mid-tutorial resumes exactly where it left off.

## The forced first session (welcome → play-gate → in-battle coaching)

- **Welcome card** on first launch (only if `isNewPlayer() && !ftue.welcomed`): a `_popCard(data)`
  popup, 2–3 bolded verb lines + one CTA; set `ftue.welcomed = true` on dismiss. Wrap it in
  `tutorial_start` / `tutorial_end` analytics.
- **Play-gate** right after, on home: `maybePlayGate()` — only for `isNewPlayer()` who hasn't been
  `coached`. **Wait for every popup to close** (`.ftue-pop.show, .login-pop.show, .reveal-pop.show…`)
  before dimming, retrying on a timer; then `forceTap(playBtn, "Tap PLAY!")` and call `onPlay()` only
  on a `true`. If the gate is torn down by a re-render (`false`), rebuild it — don't proceed.
- **In-battle coaching** (`coaching = mode==='ranked' && isNewPlayer() && !ftue.coached`): a
  `battleIntro` popup on entry, then force each new verb **exactly once** — `forceMove(id)` for the
  first attack, a frozen-needle `forceTap` for the first perfect-timing, a coach banner for the first
  defend — guarded by per-step `_forceXDone` flags, then drop all coaching and let the player finish
  free. Set `ftue.coached = true` after the first battle.

`Coach.coach(html)` is the lightweight in-loop banner (a tip strip above the action area, auto-replaces
the previous one); `Coach.coachClear()` removes it. Use it for the one-liners; use the popup card for
the up-front explanation.

## The rookie-quest checklist (data-driven)

Onboarding tasks are pure data — the engine just marks/claims them:

```js
const FTUE_TASKS = [
  { id:'win',     icon:'🏆', label:'Win your first match', reward:{ coin:200 } },
  { id:'perfect', icon:'💥', label:'Land a PERFECT',        reward:{ gem:12 } },
  { id:'dodge',   icon:'🤸', label:'Dodge an attack',       reward:{ coin:150 } },
  { id:'box',     icon:'🎁', label:'Open your first chest', reward:{ gem:12 } },
  { id:'skipbox', icon:'⚡', label:'Use a gem to rush a chest', reward:{ gem:18 } },
];
ftueTaskDone(id) { /* idempotent; set ftue.done[id]; save; return true if newly done */ }
ftueClaim(id)    { /* if done && !claimed: grant reward, mark claimed, save, emit rookie_quest event */ }
ftueActive()     { return ftue.welcomed && FTUE_TASKS.some(t => !ftue.claimed[t.id]); }  // show/hide the checklist
ftueState()      { return FTUE_TASKS.map(t => ({...t, done:!!ftue.done[t.id], claimed:!!ftue.claimed[t.id] })); }
```

- **Mark `done` in-context** (the win handler calls `ftueTaskDone('win')`, the perfect-timing calls
  `ftueTaskDone('perfect')`, etc.), **claim on home** (the checklist's claim button).
- **Hide the whole checklist once everything is claimed** (`ftueActive()` false) and **only show it to
  players who passed welcome** so veterans never see it.
- Tilt early rewards toward your **spend currency** (a task for "use a gem to rush a chest" seeds the
  earn→spend habit). Tasks fund the first session without breaking late economy.
- This is onboarding-only; the recurring daily-quest/streak/feature-unlock machinery is
  `liveops-retention`.

## Migration (veterans never get re-onboarded)

On load, before any tutorial can fire, retro-mark players who already did the thing:

```js
const f = this._ftue();
if (this.matchesPlayed() > 0)              f.welcomed = f.coached = true;   // already played
if (this.s.upgradedBefore)                 f.upgradeTut = 'done';
if (f.boxTut == null && (f.done.box || f.claimed.box || this.s.boxes?.length))
                                           f.boxTut = 'done';               // already had/opened a box
```

Without this, shipping a new tutorial re-triggers it for your entire existing player base. Always add
the migration in the same change as the tutorial.

## Analytics taxonomy

Emit enough to measure step drop-off (`web-game-foundation` tracking layer):

- `tutorial_start` / `tutorial_end` around the welcome card and each forced segment, with a step name
  + index (`'welcome'`, `'battle'`, step `0,1,2…`).
- `rookie_quest` on each task claim, with the task id + its index in the list (the funnel position).
- Resource-earn events for the coin/gem the task grants (source `rookie_quest`).

The drop-off between consecutive `tutorial_*` steps is the single most actionable onboarding metric —
wire it before you tune copy.
