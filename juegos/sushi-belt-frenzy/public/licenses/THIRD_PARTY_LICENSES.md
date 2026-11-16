# Third-party licenses — Seagull Attack: Save the Sandwich (Dana Games)

This game ships the following third-party components. Their full license
texts are in this same folder (`licenses/`).

## Runtime libraries (shipped in the zip)

- **@playgama/bridge 2.4.2** — the Playgama Bridge SDK. License:
  **GNU Lesser General Public License v3.0 or later** (`LGPL-3.0.txt`;
  the GPL v3 text it incorporates is `GPL-3.0.txt`). The Bridge is shipped
  UNMODIFIED as its own file, `playgama-bridge.js`, loaded by `index.html`
  as the first script in `<head>`; it is not merged into the game bundle,
  so it can be replaced by an interface-compatible version. Source:
  https://www.npmjs.com/package/@playgama/bridge
- **Phaser 3.90.0** — the game engine. License: **MIT** (`Phaser-MIT.txt`).
  Copyright (c) 2024 Richard Davey, Phaser Studio Inc. Source:
  https://phaser.io

## Fonts (shipped in the zip, `assets/fonts/`)

- **Lilita One 400** — display font. Copyright (c) 2011 Juan Montoreano.
  License: **SIL Open Font License 1.1** (`Lilita-One-OFL.txt`).
  Reserved Font Name: Lilita. Source: Google Fonts.
- **Nunito Variable** (weights 400/700/800) — body font. Copyright 2014
  The Nunito Project Authors. License: **SIL Open Font License 1.1**
  (`Nunito-OFL.txt`). Source: Google Fonts.

## Art

- All in-game art (beach backgrounds, gull, sandwich, pelican, crab, coin,
  chest) was created for this game; no third-party images are used.
- The Dana Games seal (`badge.png`) and the official tutorial hand
  (`hand.png`) come from the studio kit (`comunicacion-ias/kit/`) and are
  Dana Games property, not third-party.

## Build tools (NOT shipped in the zip)

- TypeScript, Vite and Playwright are development tools only; they are not
  part of the distributed game.
