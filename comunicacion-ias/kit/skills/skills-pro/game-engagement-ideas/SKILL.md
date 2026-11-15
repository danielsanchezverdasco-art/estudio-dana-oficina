---
name: game-engagement-ideas
description: Read a game's analytics and its player journey, find where players drop off or stop engaging, and write ranked, testable hypotheses into the project's ideas file (docs/ideas.md by default), each with its observation, numbers and denominators, a possible cause, one small change and how to validate it. Use it whenever the developer asks why players leave, where the funnel breaks, what to improve next, how to raise retention, session length or engagement, or what the numbers say about the game, once the game's telemetry has been read with playgama-metrics-snapshot, saved as a snapshot or in this conversation. It analyzes and proposes; it does not change the game.
license: Apache-2.0
---

# Engagement ideas from data

The result is an updated ideas file that keeps three things apart: what the data shows, what might cause it, and what
to change. Use `docs/ideas.md` by default. If the project already has a canonical list (`docs/IDEAS.md`, a root
`ideas.md`), update that one rather than starting a competing list, and name its path in your answer.

## 1. Rebuild the context

- Read `AGENTS.md` or `CLAUDE.md`, the existing ideas and decisions, the game's core loop in its code, its event
  catalog (what each event means and when it fires), and the telemetry: a saved snapshot's `README.md` and
  `manifest.json` in `analytics-data/`, or the answers `playgama-metrics-snapshot` read in this conversation. No
  telemetry yet, or only an old snapshot: read it first with `playgama-metrics-snapshot` (it asks whether to save it).
- Match the answers to the build, its commit and when it went live. Flag a dirty or unknown build, mixed traffic, an
  incomplete last day and the hours not yet processed (`verify` lists them).
- The code and a local build help explain an event, but they don't prove that players saw that exact interface in
  the measured build.

## 2. Measure the player journey

- **Pick a short loop that matters:** entry → first meaningful action → outcome or reward → next choice. For every
  rate, give the UTC period, the build, the source file, the numerator, the denominator and the unit (events, sessions
  or players).
- **Unique reach per event is not a funnel.** Ten thousand sessions saw event A and four thousand saw event B does not
  mean 40% went from A to B. Transitions and "what happened next" come only from ordered facts within one session
  (`get_game_telemetry_session_facts`) or an export built for it. Record how the sample was chosen, its size and its
  incomplete records; a chronological sample is not a random one.
- **Time is three different things:** active play, time with the tab open, and calendar retention. Keep them apart.
- **A last event is not a reason.** `app_hidden`, a death, an ad or no later event does not by itself say why a player
  left.
- **`performance_sample` describes measurements, not players.** Long sessions send more samples, so its distribution
  is not a typical player's FPS. Without matching samples to sessions, a link between FPS and leaving stays unknown;
  under 30 sessions with samples, there is no FPS conclusion at all.
- **Filtering out empty launches** (cheap paid traffic, bots, launches with no input): only when the developer or the
  project's docs adopted that rule for this game. Then base the engagement analysis on sessions that reached the
  game's first in-game action, report the size of the excluded group, and don't call every excluded launch a bot.

## 3. Choose hypotheses worth testing

Hold the drop-offs against the code. Look for what stops a player from acting, understanding the goal, getting a
reward, or wanting another round. Play the game through or take screenshots only when the developer asks for it;
otherwise, note which ideas a playthrough would confirm or rule out.
- Don't pad the list. Don't answer "add more telemetry" when a plausible change to the game is already visible.
- Keep the constraints the owner set, for example where ads appear or a mechanic they decided to keep.
- When several symptoms share one cause, the idea is about the cause.

Each idea worth doing gets this entry:

```markdown
### <short name>  (status: proposed)
- **Observation:** <the finding, numbers with numerators, denominators and units, the period, the build, and the
  snapshot file it came from, or the tool and arguments when nothing was saved>
- **Explanation:** <a possible mechanism, the main alternative cause, how confident and why>
- **Change:** <one small, testable change to the player's path>
- **Validation:** <the cohort, the primary metric, guardrails (reward, continuation, errors, ads, performance), the
  build to compare against, the minimum window or traffic before judging>
```

Statuses: proposed, in progress, released, evaluated. A released idea is not a proven one: only later telemetry of
its build can say that.

## 4. Rank and write

Rank by how many players it reaches, how badly the obstacle hurts, how strong the evidence is, and how cheap the test
is. Keep earlier ideas and decisions, merge duplicates, and update the status of ideas the data now speaks to.

If the data is thin, propose watching a few players or a narrow experiment, and say which conclusion isn't possible
yet. Don't change the game's mechanics in an analysis task: building an idea is a separate request. When one is
built, one idea per build, with a new version in its telemetry, so the next look at the telemetry can tell whether it
worked.
