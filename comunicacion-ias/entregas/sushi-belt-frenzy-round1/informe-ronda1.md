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
| 3 portadas (800×800, 1080×1920, 1920×1080) | HECHAS — generadas a 2x (1600×1600, 1120×2240, 2240×1120); el redimensionado exacto está pendiente de que se abra la puerta EPERM (los originales 2x son el entregable mientras tanto) |
| Build de producción (`dist/`) | ⏳ BLOQUEADA por EPERM — 5 intentos de build con reintentos fallaron (0 bytes escritos en 5–10 min cada uno); diagnóstico completo en `tools-local/` (`diag-write.mjs`, `diag-vite.mjs`): un proceso cuyas escrituras fallan NO se recupera nunca — hay que reintentar con procesos nuevos. Nuevo método: `bundle.mjs` (vite → JSON por stdout) + `write-bundle.mjs` (proceso plano que escribe) + `build-driver.sh` (sondea la puerta y reconstruye hasta que sale; CORRIENDO en segundo plano, PID 13102, desde 07:32 UTC). El zip anterior (635.052 B, sha 00fe58d7…) es de ANTES de los arreglos visuales — NO usar. |
| Build de pruebas (`dist-test`, `__TEST_BUILD__`) | ⏳ Pendiente del build (misma puerta) |
| Zip ≤ 5 MB | ⏳ Pendiente del build (tamaño + sha por rellenar en `listing.txt`) |
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

## Preguntas para Daniel

1. ¿El flow se siente perfecto (velocidad, tamaño de plato, arco)?
2. ¿Música ambiental de restaurante o solo SFX?
3. ¿El wasabi debe ser una decisión (apartarlo) o seguir como distractor?
