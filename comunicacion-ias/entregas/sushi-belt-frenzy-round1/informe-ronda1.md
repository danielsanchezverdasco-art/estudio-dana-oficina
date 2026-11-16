# Informe ronda 1 — Sushi Belt Frenzy

**Fecha:** 16/11/2026. **Autora:** Anita. **Rama:**
`anita/sushi-belt-frenzy`. **Concepto + mockup:** issue #24, aprobados por
Daniel 16/11 ~06:36 («Quiero todos para hoy», «Perfectamente diseñados»).

## Estado de la entrega

| Pieza | Estado |
|---|---|
| Código (Phaser 3 + TS + Vite, sin motor de físicas) | HECHO, `tsc --noEmit` 0 errores |
| Harness de lógica (30 niveles, 5 puertas) | **PASS 30/30** (ver `tools-local/test-results-r1.md`) |
| Biblia de arte (`biblia-arte-sushi.md`) | HECHA, fiel al mockup visto a la vista |
| 3 portadas (800×800, 1080×1920, 1920×1080) | HECHAS — redimensionadas a tamaño exacto 16/11 06:55–06:56 (163.066 / 378.762 / 343.230 B), fieles al mockup |
| Build de producción (`dist/`) | ✅ HECHO SIN DISCO — la puerta EPERM bloqueó TODAS las escrituras a disco (driver v2: 30 min, 0 bytes; cadena por pipe: 25 min, ~65 intentos, 0 bytes). Solución: `tools-local/build-zip-memory.mjs` (vite → zip en memoria → stdout por pipe) + `upload-zip-stdin.py` (Git Data API, sin disco). Zip subido y VERIFICADO descargándolo de GitHub (ver fila Zip). `dist/` local sigue sin existir; el driver v3 (`build-driver.sh`, forma por pipe) queda para la ventana finisher (dist-test + smoke). El zip anterior (635.052 B, sha 00fe58d7…) era de ANTES de los arreglos visuales — NO usar; el fichero local sigue siendo ese viejo, el canónico es el de GitHub. |
| Build de pruebas (`dist-test`, `__TEST_BUILD__`) | ⏳ Pendiente — la ventana finisher lo construye con el driver v3 (forma por pipe) cuando se abra la puerta, o con una variante en memoria si hace falta |
| Zip ≤ 5 MB | ✅ **639.410 bytes, sha256 `9681438914c21bf5e24fedf2251622af5f2bed313889019372d28d24423b2714`** — commit `eeefb86d`, blob `8591f8f3`. Verificado: descargado de GitHub, testzip limpio, 14 ficheros, `index.html` en raíz, `assets/index-CQVC1jsT.js`, `playgama-bridge.js`. Jugable: enlace raw en `listing.txt` y en la PR #77. Nota: el zip NO es reproducible byte a byte entre corridas (el bundle lleva algo dependiente de la corrida); los valores canónicos son los de ESTA subida. |
| Teardown / filtro visual / filtro jugabilidad / plan de dificultad / guion del Short / skills-usadas | HECHOS |
| GIF (8–10 s) + metraje real del Short | ⏳ PENDIENTE — necesitan Chromium vivo (muerto, exit 133) |
| Verificación en navegador (smoke Playwright) | ⏳ PENDIENTE — Chromium muerto; ventana finisher |
| Puerta de 3 testers humanos | ❌ NO CUMPLIDA — la prueba de Daniel es la puerta final |
| Música ambiental | ❓ Abierta para Daniel (solo SFX sintetizados) |

## Qué se verifica sin navegador (honesto)

- **Reglas:** el harness corre la misma lógica pura (`BeltSim`) que la
  escena Phaser. Perfecto 3★ 30/30, ocioso pierde 30/30, servir-todo
  pierde 0★ 30/30, aleatorio ≤ 1/3, humano ≥ 2★ 28/30 a 3/3 (L6/L17 2/3).
- **Compilación:** `tsc --noEmit` 0 errores.
- **Navegador (Chromium vivo ~07:06 UTC, corrida 2 del smoke): 8/10
  PASS.** Verificado de verdad en el navegador: menú, handle, L1
  ganado con toques perfectos (230 puntos = 6×30 + 50 de combo,
  6 servicios, 2 corazones), servir +30, gato equivocado −1 corazón,
  wasabi presente en L6, cero errores de consola. **NO verificado:**
  el aturdimiento del wasabi en L6 (2 checks) — el reloj del juego se
  estrangula en headless y los toques no llegaron a tiempo; la sonda
  ahora usa `__game.step(dt)` determinista y la ventana finisher debe
  dar 10/10. Detalle en `tools-local/smoke-results-r1.md`.
- **Visual:** 6 defectos reales encontrados por las capturas y
  ARREGLADOS (título, botón diario, tutorial/hints, servidos/combo,
  platos gigantes) — ver `filtro-visual.md`. Las capturas nuevas tras
  los arreglos quedan para la ventana finisher.

## Ranking (issue #26) — honestidad

**#14 — 25/35 · DUDOSA.** Condición: «Prototipo desechable antes que
mockup: si el flow no se siente perfecto, no se construye.» Daniel anuló
la condición aprobando los 6. Esta r1 responde con números; el riesgo que
queda es la sensación del flow (velocidad, tamaño de plato, arco), que
solo se mide jugando. Ver `teardown.md`.

## Reglas de oro de diseño (Daniel 16/11 08:15–08:17, PR #74) — cumplimiento

Nueva ley del estudio: 100 % «Videojuego Animado», cero fotorealismo /
texturas realistas / fotos, 100 % arte vectorial original interno, calidad
AAA en vector. **Este juego cumple por construcción:** todo el arte del
juego es procedural en canvas (`src/sushi.ts`) — formas vectoriales
dibujadas por código (gatos, platos, cinta, chef), sin fotos, sin texturas
realistas, sin nada fotorealista. Las 3 portadas siguen el estilo de
ilustración del mockup aprobado por Daniel (no son fotos). Si Daniel quiere
las portadas rehechas en vector puro, es un cambio menor (solo assets, no
código).

## Preguntas para Daniel

1. ¿El flow se siente perfecto (velocidad, tamaño de plato, arco)?
2. ¿Música ambiental de restaurante o solo SFX?
3. ¿El wasabi debe ser una decisión (apartarlo) o seguir como distractor?
