# game-engagement-ideas

An agent skill that reads your game's saved analytics next to its code and writes down where players drop off and
what to try about it: ranked, testable hypotheses in `docs/ideas.md`, each with the observation and its numbers, a
possible cause and the main alternative, one small change, and how the next build will show whether it worked.

Ask your agent "why do players leave?", "where does the funnel break?" or "what should I improve next?".

## What the agent does

1. Reads the project, its existing ideas and decisions, the game's core loop, its events and the game's telemetry
   (a saved snapshot, or the numbers read in the same conversation).
2. Measures one short loop of play (entry, first action, outcome, next choice) with every rate's numerator,
   denominator, unit, period and build.
3. Holds the drop-offs against the code and a playthrough, and looks for what stops players acting, understanding,
   being rewarded or coming back.
4. Writes the ideas worth testing into the project's ideas file, ranked, keeping earlier ideas and decisions.

It keeps observation, explanation and change apart, and it doesn't change the game: building an idea is a separate
request, one idea per build so the next look at the telemetry can tell whether it worked.

## The improvement loop

```
playgama-metrics-snapshot  ->  game-engagement-ideas  ->  you build the top idea  ->  playgama-publish
 the numbers, with sources      where players drop,         into a new version,         the new build in the
 (analytics-data/, if saved)    ranked ideas (ideas.md)     one idea per build          sandbox (Playgama plugin)
        ^---------------------- the next look at the numbers measures the new build ----------------'
```

Each step writes a file the next one reads, so a different agent or a later session can pick the loop up.

## What you need

The game's telemetry, read with `playgama-metrics-snapshot` (saved to files or not, as you choose), and the game's
source.

## Install

These skills live in [Playgama/gamedev-skills](https://github.com/Playgama/gamedev-skills), each in its own folder
under `skills/`.

- **Claude Code, as a plugin** (all the skills at once):
  ```
  /plugin marketplace add Playgama/gamedev-skills
  /plugin install gamedev-skills@playgama
  ```
- **Any agent that reads skills:** copy the folder into its skills folder and keep the folder's name. The
  [repository's README](https://github.com/Playgama/gamedev-skills#install) has the folder for each agent and the
  commands for macOS, Linux and Windows.

The two analytics skills (`playgama-metrics-snapshot` and `game-engagement-ideas`) are made to work together:
install them together.

## Licence

The code and texts are licensed under the
[Apache License 2.0](https://github.com/Playgama/gamedev-skills/blob/main/LICENSE).
