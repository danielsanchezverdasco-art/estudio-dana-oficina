---
name: playgama-metrics-snapshot
description: Read a game's Playgama telemetry through the Playgama MCP (the Developer Console tools), smallest view first, and report every number with its unit, period and source - and, when the developer wants it saved, keep it as a verifiable local snapshot: the raw answers in analytics-data/ with a manifest of tools, arguments, periods, freshness and hashes, and a README another agent can repeat. It asks before writing any file. Use it whenever the developer asks for their game's statistics, players, sessions, events, retention, FPS or how a build did on Playgama, before analyzing engagement or comparing two builds, and whenever numbers about a Playgama game are about to be quoted, even if they only say "how is my game doing" or "pull the analytics". It collects evidence; it does not interpret it (game-engagement-ideas) or change the game.
license: Apache-2.0
---

# A snapshot of a game's telemetry

The result is the numbers the question needs, each with its unit, its period and the call it came from. **Ask the
developer whether to save them to files** (section 3). Saved, they become a folder in `analytics-data/`: the Playgama
MCP's answers byte for byte, a `manifest.json` that says which tool and arguments made each one, and a `README.md` that
lets another agent repeat the analysis, so every number quoted later can be traced to one file. Not saved, they live in
the conversation only.

The answers are preaggregated views, not every player's events. Never describe a snapshot as a complete export.

When it is saved, `scripts/snapshot.mjs` does the bookkeeping (Node 18+, macOS, Linux and Windows):

| Command | What it does |
|---|---|
| `node scripts/snapshot.mjs init --app <id> --from <date> --to <date> --question "..."` | A new folder `analytics-data/<from>_<to>`, never over an earlier one, with the manifest and a README to fill in. Keeps the folder out of git |
| `node scripts/snapshot.mjs add <snapshot> <answer.json> --tool <name> --args '<json>'` | Files one answer under a numbered name and records it; prints its period, when it was processed, its warnings and any page left |
| `node scripts/snapshot.mjs verify <snapshot>` | Checks every hash, lists unrecorded files, secrets in arguments, pages not fetched and a README still to fill in |

`scripts/` is this skill's folder. Run the script from the game's project, so `analytics-data/` lands there.

## 1. The game and the period

1. Read `AGENTS.md` or `CLAUDE.md` and the project's analytics and release notes. Find the game's application id in
   the repository and confirm it with `list_applications` or `get_application`. Titles are not unique: never pick a
   game because its name looks right. If two could match, ask.
2. Settle the question, the UTC dates and the build before calling anything.
   - With no dates given, take the latest period with enough traffic for the question.
   - Dates are inclusive calendar days; the overview takes at most 31 of them.
   - To compare builds, note when each went live (`get_sandbox_state`) and whether the answers split by `build` or
     `game_version`.
3. **Ask whether to save the answers to files**, in the same message as any other question about the game or the
   period: "Save them as a snapshot in `analytics-data/`, so the numbers can be checked and compared later, or only
   answer here?" Skip the question when the developer already said ("pull the analytics into files", "just tell me").
   Until they answer, write no files.
4. If the Playgama tools are not connected, the developer signs in once (`/mcp` in Claude Code, then the Playgama
   server). Until then, an earlier snapshot is the only data: say that no fresh export was made. Never fill the gap
   with numbers from memory or from another game.

## 2. A bounded set of answers

Read `get_game_telemetry_guide` first: it is live and it defines the events and how to read them. Then drill down,
smallest view first:

- **`get_game_telemetry_analytics`**: volume, event types, sessions, users, durations and freshness. Follow
  `events_page.next_cursor` (as `eventCursor`) only while the event types you need have not appeared yet.
- **`get_game_telemetry_event_analytics`** for each event that matters: first without `fieldName` to see its fields,
  then with one `fieldName` for a distribution you need. `performance_sample` is read here: its FPS and frame-time
  summaries describe samples, not sessions.
- **`get_game_telemetry_timeseries`** for a trend or a release boundary: `1d` as a rule, `30m` around a real release.
  Follow `page.next_cursor` only while more points are needed.
- **`get_game_telemetry_session_facts`** for the order of events, in a small filtered sample (an event, a field, a
  session or a user is required). Start with the default page; ask for the next only when it could change the
  conclusion. It leaves out `core_ping` and `performance_sample`: never filter it by them.
- To tie the numbers to a release: `get_sandbox_state` and `get_archive_status`.

Don't walk every event, field and session to look complete. A set of answers that answers its question is finished.

## 3. Saved or not

**Not saved.** Answer in the conversation, with the same rules: every number with its unit, its period in UTC, its
build, and the tool and arguments it came from; the warnings, the hours not yet processed and the pages not fetched.
Say that nothing was saved, so these numbers can't be re-checked or compared with a later build from files. If the
developer then wants them kept, save them as below.

**Saved: as you go.**

1. Make the folder once: `node scripts/snapshot.mjs init --app <id> --from 2026-10-01 --to 2026-10-14 --question "..."`.
   If the project already keeps snapshots under another scheme, follow that scheme instead (`--root`).
2. After each call, write the tool's answer to a file exactly as it came, with nothing added or reformatted, and
   record it right away:
   ```bash
   node scripts/snapshot.mjs add analytics-data/2026-10-01_2026-10-14 answer.json \
     --tool get_game_telemetry_event_analytics --name level-failed \
     --args '{"applicationId":"<id>","dateFrom":"2026-10-01","dateTo":"2026-10-14","eventKind":"custom","eventName":"level_failed"}'
   ```
   `--args` is the call's arguments as JSON (`@args.json` reads them from a file, easier in PowerShell). The script
   refuses an argument that looks like a token or a key, and an answer about another game.
3. Read what `add` prints. "Processed at …, before the period ends" means the last hours or days are not in the
   answer: say so wherever its numbers are used. A warning in an answer is part of its meaning.
4. Fill in the folder's `README.md`: the game, the period, the build that was live, the questions, one line per file
   with its unit (events, sessions or players), the pages not fetched and why they can't change the conclusion, and
   the limits (traffic mix, small samples, unknown builds).
5. Run `node scripts/snapshot.mjs verify <snapshot>` and fix every NO. Every warn ends up in the README.

## Rules

- **Units are part of the number.** `event_count` is not sessions or players. Every figure you report names its unit,
  its period in UTC, its build, and its file, or the tool call it came from when nothing was saved.
- **Missing or `null` means unavailable, never zero.** An answer with no field for something did not measure it.
- **Fewer than 30 sessions with performance samples** is not enough for a conclusion about FPS: say so.
- **No files without a yes.** Nothing goes into `analytics-data/` or anywhere else in the project until the developer
  has said to save it.
- **Player data stays on the machine.** The answers can hold pseudonymized `userRef` and `sessionRef`. `init` adds
  `analytics-data/` to `.gitignore` unless the project already tracks it; keep it that way unless the owner decided
  otherwise, and leave the refs out of any table you derive.
- **This step only collects.** Don't change the game or the ideas file here unless the request includes that work.
  The next step is `game-engagement-ideas`.

Done means: every number you report has its unit, its period and its source. Saved: `verify` passes, and the
manifest leads from each number to the answer it came from.
