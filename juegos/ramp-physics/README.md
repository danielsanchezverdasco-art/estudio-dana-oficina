# Seagull Attack: Save the Sandwich

Draw-to-protect puzzle for Dana Games (Playgama). Hungry gulls dive at
your sandwich on a beach towel — draw a line in the sand to shield it
and survive 10 seconds. 30 levels, map, stars, coins, chest every 3
levels, daily challenge, streak, cosmetics shop (coins only).

- **Stack:** Phaser 3.90.0 + TypeScript + Vite. Playgama Bridge 2.4.2
  (Vite plugin, mode 'local').
- **Languages:** English first, Spanish second (toggle in the menu).
- **First:** mobile 390×844, also landscape + desktop.

## Run it

```bash
npm install
npm run dev        # dev server
npm run build      # production build -> dist/ (this is what ships)
npm run build:test # test build -> dist-test/ (adds the window.__game
                   # debug handle; NEVER ship this one)
```

## Test it

```bash
# serves dist-test on http://localhost:8931, then runs the suite
python3 -m http.server 8931 --directory dist-test
node tools-local/test-game.mjs   # 35 checks, real touch via CDP
```

The suite covers: menu buttons (centre + 4 corners + outside tap),
drag/ink/bounce, the anti-square box probe, idle loss, win + save +
reload, EN + ES, pause/quit, map, shop, landscape + desktop, update
cost, 0 console errors, 0 failed requests. See `entregas/` for the
round report.

## Layout

- `src/` — game code (scenes, i18n, levels, save, audio, ui, layout).
- `public/` — images, fonts, Bridge config, third-party licenses.
- `assets/` — raw art + processed sprites (magenta chroma-key sources).
- `tools-local/` — `test-game.mjs` (the suite), `covers.py` (covers
  from real screenshots), `film.mjs` (gameplay filming).
- `entregas/seagull-attack-round1/` — the round pack (zip, covers,
  screenshots, GIF, listing, filters, teardown, report).

## Rules that matter

- Bridge is the first script in `<head>`; save ONLY via
  `bridge.storage`; `game_ready` only when the first frame is playable.
- The production zip has no `window.__*` handle and no test parameters
  (the handle exists only in the test build, tree-shaken from prod).
- Covers come from real gameplay screenshots, never generated art.
- Nothing is published to Playgama/YouTube without Daniel's APROBADO
  and without Daniel testing the final version first. YouTube is not
  kids' content. PEGI 3.

## Licenses

Third-party components (Bridge LGPL-3.0, Phaser MIT, Lilita One +
Nunito OFL 1.1): see `THIRD_PARTY_LICENSES.md` and `public/licenses/`.
