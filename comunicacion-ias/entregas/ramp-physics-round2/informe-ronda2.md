# Informe — Ramp Physics: Ragdoll Crash Test, RONDA 2 (opción C, CÓMIC)

**Fecha:** 15/11/2026 · **Rama:** `anita/ramp-physics-r2` · **PR contra `main`.**
**Constructor:** Anita · **Revisión cruzada:** Niky (pendiente) · **APROBADO:** Daniel (pendiente — él prueba la versión final antes de que nada se publique).

## 1. Qué es la r2

La r1 (PR #14) tenía el concepto genial pero, según Daniel (15/11 ~19:04),
visual pobre/pixelado y niveles muy fáciles. La fase de mockups (PR #37)
entregó 3 opciones y Daniel eligió la **C — CÓMIC**. Esta r2 reconstruye el
juego fiel a la opción C: mismo concepto, arte nuevo, dificultad nueva.

**Dirección de arte (paso 1, en esta misma PR):** biblia en
`biblia-arte-opcion-c.md`, menú, muñeco, rampa, guía de estilo y comparativas
con Metro Nightmare en `assets/`. Ver `informe-paso1.md` para el detalle del
paso 1.

## 2. El juego

- **Motor:** Phaser 3.90 + TypeScript + Vite, física Matter, ragdoll de 10
  cuerpos, Bridge 2.4.2 (primer script en `<head>`), guardado persistente
  por Bridge storage (`ramp_physics_save_v1`).
- **Contenido:** 30 niveles, mapa, estrellas (3★/2★/1★), racha, nivel diario,
  cofre cada 3 niveles, tienda (6 skins + Extra Ink), ES/EN, pausa, UNDO/CLEAR.
- **Tintas:** STEEL (acero, rápida), BOUNCY (elástica, restitución 0.9),
  BOOST (impulso, fricción 0.02 — desliza en pendientes de 2–3° donde el
  acero se atasca).
- **Peligros:** ventilador desde L6 (con nivel de enseñanza), dinamita desde
  L12 (enseñanza), portal desde L18 (enseñanza).
- **Juice (banda media-alta):** trazo con punta luminosa, whoosh + polvo +
  shake 80 ms al lanzar, squash + anillo en rebote elástico, estelas de aire
  en ventilador, hit-stop 80 ms + «BOOM!» en dinamita, destello +
  estiramiento en portal, victoria con confeti + slow-mo 0,3 s + bandera
  ondeando + estrellas una a una; derrota con fundido a gris en < 2 s.

## 3. Niveles y dificultad (plan vinculante)

- Par = solución óptima × 1,10, redondeado a múltiplos de 5. La óptima usa
  85–100 % del par en los 30 niveles (verificado por cómputo y por test).
- 3★ = tinta ≤ par; 2★ = ≤ par × 1,25; 1★ = llegar a la bandera.
- 9 niveles nuevos (10, 13, 14, 19, 20, 22, 25, 29, 30): 5 de boost
  (pendientes suaves 2,2–3,2°), 4 de elástico (muros que solo se superan
  rebotando). 21 niveles reutilizados de la r1 con pares recalculados.
- Monedas fuera de la línea óptima: 8 monedas movidas respecto a la r1
  (auditoría de distancia ≥28 px a la línea de solución).
- Ninguna tinta domina: cada tinta es óptima en ≥1 nivel por bloque de 5,
  salvo el bloque 1 (tutorial de acero por diseño). Verificado por cómputo;
  la verificación por test anti-trivial + prueba de intercambio a acero está
  pendiente de la re-corrida (ver §4).
- Niveles r1 descartados (9, 10, 14, 16, 22, 24, 27): la rampa perezosa los
  ganaba o no tenían solución con las tintas.
- **Corrección tras la corrida 1 del harness (15/11 ~21:30 UTC):** las 5
  rampas de solución BOOST terminaban 8 px antes de la plataforma de meta y
  el muñeco se acuñaba contra su canto (L10 perdía por quietud en ~3 s).
  Extendidas hasta pisar la plataforma: L10 →(288,358), L13 →(288,397),
  L19 →(298,317), L25 →(298,437), L29 →(288,355). Ratios tinta/par
  resultantes 0,982–0,983 (en banda 85–100 %).
- **Corrección del timeout:** `LAUNCH_TIMEOUT` 20 s → 60 s. El Runner de
  Matter difiere pasos fijos de 16,66 ms con FPS bajo (SwiftShader), así que
  la física corre más lenta que el reloj de pared y el timeout disparaba a
  mitad de nivel (L5/L7/L9). En un móvil real a 60 fps los intentos terminan
  igual de rápido por victoria/derrota/quietud.

## 4. Verificación

### Corrida 1 del harness (15/11 ~21:09 UTC, `dist-test`, DSF 2, Chromium SwiftShader)

**21/26 checks.** Detalle completo en `test-results-r2-run1.md`.

| Prueba | Herramienta | Resultado |
|---|---|---|
| Type-check | `tsc --noEmit` | **PASA** (0 errores; la emisión `tsc -b` no es necesaria para la build de Vite) |
| Build producción | `vite build` | **PASA** (15/11 ~21:00 UTC, `dist/` 1,9 MB; aviso esperado de chunk Phaser > 600 kB) |
| Build de pruebas | `VITE_TEST_BUILD=1 vite build --outDir dist-test` | **PASA** (15/11 ~21:00 UTC, `dist-test/` 1,9 MB). La re-build con las correcciones está pendiente (ola EPERM) |
| Smoke 390×844, ES/EN | `tools-local/test-game.mjs` | **21/26.** Menú, consola, peticiones, esquinas de PLAY, arrastre, tinta, deshacer y presupuesto: todos PASAN. Niveles ganados a 3★: L1 (119/135), L2 (146/165), L3 (164/185), L4 (199/220), L8 (173/195), L11 (102/115), L12 (58/65) — ratios 0,881–0,905, en banda. Fallan: L5/L7/L9 por timeout de 20 s (física lenta), L6/L10 a 0★ en ~3 s. L13–30 sin probar: el renderer se estrelló en la captura del L12. 0 peticiones fallidas. La pantalla 844×390 (horizontal) está pendiente de la re-corrida |
| Anti-trivial (solución 30/30, rampa perezosa, par 85–100 %, dominancia, 0 px) | `tools-local/anti-trivial.mjs` | **PENDIENTE** (sin correr — Chromium con SIGTRAP en la ventana de endurecimiento del sandbox) |
| Sondas niveles nuevos + enseñanza | `tools-local/probe-level.mjs` (10, 13, 14, 19, 20, 22, 25, 29, 30, 6, 12, 18) | **PENDIENTE** (mismo bloqueo) |
| Zip producción ≤ 5 MB, sin `window.__`, Bridge primero | `tools-local/zip-smoke.mjs` (puerto 8932) | **PENDIENTE** (mismo bloqueo) |
| Revisión visual vs mockup C y Metro | Capturas de Playwright | **PENDIENTE** (mismo bloqueo; la comparativa del paso 1 ya está en la PR) |

### Re-corrida (tras las correcciones)

Pendiente de que Chromium vuelva a arrancar. Cambios respecto a la corrida 1:
timeout 60 s, 5 rampas BOOST extendidas, harness a DSF 1 (el rasterizado a
DSF 2 estrelló el renderer) y escritura del JSON en `try/catch` (EPERM).

## 5. Playtest propio (skill `playtest-report`)

- **Harness (políticas oracle/precise, no human-limited):** los 7 niveles
  ganados en la corrida 1 lo hicieron al primer intento de replay con 3★
  (ratios 0,881–0,905). Los 5 fallidos no son un problema de primer intento
  humano sino de timeout/entorno (ver §4).
- **Juego manual propio:** arrastres táctiles reales durante el filmado
  (menú, L1, L6, L12, L18) — pendiente de que Chromium vuelva a arrancar.
- **% de 3★ en primer intento (objetivo ≤ 40 %):** NO MEDIDO todavía — sin
  corrida human-limited no se afirma ningún veredicto de dificultad (skill
  `evaluating-gameplay-balance`).
- **GAP HONESTO:** el protocolo pide 3 testers humanos como puerta antes de
  que Daniel pruebe nada. En esta sesión no hay 3 testers disponibles; el
  sustituto es harness + juego manual propio + **la prueba de Daniel** (él
  prueba la versión final antes de que nada se publique — puerta humana final
  vigente).

## 6. Pack de entrega

| Archivo | Qué es |
|---|---|
| `ramp-physics-round2.zip` | Producción (≤ 5 MB) — **enlace jugable**: descomprimir y abrir `index.html` en el navegador (Bridge en modo mock fuera de Playgama) |
| `covers/` (6) | Portadas de capturas reales de gameplay en los 3 tamaños del protocolo: 800×800, 1080×1920, 1920×1080 |
| `ramp-physics-gameplay.gif` | GIF 8–10 s terminando en victoria |
| `ramp-physics-short.mp4` | Short 1080×1920 con gameplay real |
| `screenshots/` | Menú, tutorial, L6 (ventilador), L12 (dinamita), L18 (portal), resultado, mapa, tienda, horizontal |
| `listing.txt` | EN primero |
| `teardown.md` / `filtro-visual.md` / `filtro-jugabilidad.md` / `skills-usadas.md` / `short-guion.md` | Documentos de la entrega |
| `informe-ronda2.md` | Este informe |

## 7. Pendientes (preguntas abiertas para Daniel, sin cambios desde la r1)

- Título EN: «Ramp Physics» propuesto («Ragdoll Crash-Test» casi existe en Playgama).
- Short mudo o con música original.
- Anuncios colocados pero sin servir en pruebas.

## 8. Skills usadas

Ver `skills-usadas.md`: checklist completa de las 66 skills de la lista de
Grok — cada aplicable con dónde se aplicó, cada no aplicable con su porqué.
Ninguna exige pago ni clave.
