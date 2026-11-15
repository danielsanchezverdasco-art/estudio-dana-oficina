# Doubloon Rush (Cofre del Doblón)

Arcade de reflejos: toca los cofres que salen de la arena antes de que se hundan, esquiva las bombas, asusta al cangrejo y persigue el Doblón Dorado (1 entre 500, probabilidad real y visible).

- **Motor:** Phaser 3.90 + TypeScript + Vite
- **Idioma:** inglés primero, español segundo
- **Plataforma:** Playgama (Bridge 2.4.2) / YouTube Playables vía Playgama
- **Entrega ronda 1:** `../../comunicacion-ias/entregas/cofre-del-doblon-round1/`

## Comandos

```bash
npm install
npm test          # tests unitarios de reglas (Vitest, 11)
npm run build     # build de producción -> dist/
npm run build:test  # build de test (expone window.__game) -> dist-test/
npx tsc -b        # solo comprobación de tipos (noEmit)
```

## Pruebas

```bash
python3 scripts/smoke-test.py   # Playwright, 390x844: 20 comprobaciones
python3 scripts/precheck-zip.py # precheck del zip de producción
```

## Arte

`art-raw/` guarda las imágenes generadas; `scripts/process-art.py` hace el chroma key (magenta), recorta los sprites y genera los atlas Phaser (`public/assets/atlas-*.webp` + `.json`). Los fondos se reescalan a 780×1688.

## Estructura

- `src/rules/` — reglas puras (sin Phaser), con tests
- `src/bridge/` — wrapper del Bridge de Playgama
- `src/scenes/` — Boot, Menu, Map, Game, Results (+ `ui.ts`)
- `src/i18n.ts`, `src/audio.ts` (SFX sintetizados), `src/save.ts`
- `scripts/` — process-art, smoke-test, record-short, make-short, make-covers, precheck-zip, update-office-json
- `tests/` — tests unitarios + capturas del smoke test
