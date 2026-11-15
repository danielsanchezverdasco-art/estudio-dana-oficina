# playgama-metrics-snapshot

An agent skill that reads your game's telemetry from Playgama and reports every number with its unit, period and
source. If you want it saved, it keeps a snapshot you can check: the answers of the Playgama MCP byte for byte in
`analytics-data/`, a manifest with the tool, arguments, period, freshness and hash of each one, and a README that says
what the snapshot covers and what it leaves out. It asks before writing any file.

Ask your agent "how is my game doing on Playgama?" or "pull last week's analytics", and every number it then quotes
can be traced to the answer it came from, its period and its unit.

## What the agent does

1. Finds your game's id in the project and confirms it with Playgama.
2. Settles the question, the dates (UTC) and the build.
3. Asks whether to save the answers to files or only answer in the chat.
4. Drills down through Playgama's telemetry tools, smallest view first, without trying to download everything.
5. If you said to save: keeps each answer as it comes with `scripts/snapshot.mjs`, fills in the snapshot's README and
   runs `snapshot.mjs verify`. Either way, it notes answers processed before their period ended.

Your players' pseudonymized refs stay on your machine: a saved snapshot is kept out of git.

## The improvement loop

```
playgama-metrics-snapshot  ->  game-engagement-ideas  ->  you build the top idea  ->  playgama-publish
 the numbers, with sources      where players drop,         into a new version,         the new build in the
 (analytics-data/, if saved)    ranked ideas (ideas.md)     one idea per build          sandbox (Playgama plugin)
        ^---------------------- the next look at the numbers measures the new build ----------------'
```

Each step writes a file the next one reads, so a different agent or a later session can pick the loop up.

## What you need

- The Playgama MCP connected (Playgama's Developer Console plugin, or the server
  `https://developer.playgama.com/api/mcp`), signed in to the organization that owns the game.
- Node 18 or newer, on macOS, Linux or Windows.

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

## What's inside

| Path | What it is |
|---|---|
| `SKILL.md` | The instructions the agent follows |
| `scripts/snapshot.mjs` | `init` a snapshot folder, `add` each answer with its hash, `verify` the whole snapshot |

## Licence

The code and texts are licensed under the
[Apache License 2.0](https://github.com/Playgama/gamedev-skills/blob/main/LICENSE).
