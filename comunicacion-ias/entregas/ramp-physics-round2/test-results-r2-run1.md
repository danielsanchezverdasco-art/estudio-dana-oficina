# Ramp Physics r2 — resultados del harness, corrida 1

**Fecha:** 15/11/2026 ~21:09 UTC · **Build:** `dist-test` (VITE_TEST_BUILD=1) · **Servidor:** http://localhost:8931 · **Harness:** `tools-local/test-game.mjs` (DSF 2, Chromium SwiftShader, `setTimeScale(2)`)

## Resumen

- **26 checks, 5 fallos.** Errores de consola: 1 (el propio crash del harness). Peticiones fallidas: 0.
- **Pasan (21):** `menu_loads`, `no_console_errors_after_load`, `no_failed_requests_after_load`, `play_corner_0..4`, `play_outside_noop`, `game_starts`, `drag_draws_ramp` (strokes=1, inkUsed=107), `drag_spends_ink` (220→113), `undo_refunds_ink`, `ink_budget_enforced`, y los niveles 1, 2, 3, 4, 8, 11, 12 (todos a 3★).
- **Fallan (5):** L5, L6, L7, L9, L10 (detalle abajo).
- **Sin probar:** L13–30 — el harness murió en la captura de pantalla del L12 (`page.screenshot: Target crashed`, el renderer se quedó sin memoria).
- El JSON final NO se guardó: la escritura a `/tmp/ramp-test-results.json` falló con EPERM y dejó el fichero en 0 bytes. Estos datos se reconstruyen del stdout del harness.

## Niveles ganados (3★, banda de par 85–100 %)

| Nivel | Resultado | Tinta usada | Par | Ratio | Tiempo |
|---|---|---|---|---|---|
| L1 First Drop | won, 3★ | 119 | 135 | 0,881 | 16,2 s |
| L2 Wider Gap | won, 3★ | 146 | 165 | 0,885 | 10,9 s |
| L3 Long Fall | won, 3★ | 164 | 185 | 0,886 | 7,9 s |
| L4 Coin Arc | won, 3★ | 199 | 220 | 0,905 | 23,5 s |
| L8 Bounce Up | won, 3★ | 173 | 195 | 0,887 | 24,0 s |
| L11 Crosswind | won, 3★ | 102 | 115 | 0,887 | 21,1 s |
| L12 First Blast | won, 3★ | 58 | 65 | 0,892 | 14,4 s |

## Niveles fallidos — diagnóstico

- **L5 Double Pit — `lost`, 0★, tinta 248/275, 23,5 s.** El muñeco se queda oscilando en la rampa poco inclinada (16°) sin bajar. Terminó por `LAUNCH_TIMEOUT` (20 s). Geometría y física idénticas a la r1 (que lo ganaba): la causa es el entorno — con SwiftShader el FPS es bajo, el Runner de Matter difiere updates y la física corre varias veces más lenta que el reloj de pared, así que el timeout de 20 s dispara a mitad de nivel.
- **L7 Higher Ground — `lost`, 0★, tinta 116/130, 23,9 s.** Misma causa: el muñeco queda oscilando en el chorro del ventilador y el timeout dispara antes de llegar a la meta. Geometría idéntica a la r1 L12.
- **L9 Wall of Wind — `lost`, 0★, tinta 109/120, 23,6 s.** Igual que L7. Geometría idéntica a la r1 L13.
- **L6 First Fan — `result`, 0★, 3,8 s.** El nivel terminó en ~3 s con 0 estrellas: el muñeco llegó rápido a una condición de derrota (caída fuera del mundo o detección de quietud). Pendiente de probe para ver la trayectoria exacta.
- **L10 Gentle Glide (BOOST, nuevo) — `result`, 0★, 3,0 s.** Trampa de labio real: la rampa de la solución terminaba en x=272, 8 px antes de la plataforma de meta (x=280) y 6 px por encima de su borde; el muñeco se acuñaba contra el canto y perdía por quietud. **Corregido:** rampa extendida hasta (288,358), sobre la plataforma. Nueva tinta ~196,5 / par 200 = 0,982 (en banda).

## Correcciones aplicadas tras esta corrida (commit siguiente)

1. `LAUNCH_TIMEOUT` 20 s → 60 s en `GameScene.ts` (el timeout es de reloj de pared; en dispositivos lentos la física va por detrás. En un móvil real a 60 fps los intentos terminan igual de rápido por victoria/derrota/quietud).
2. Rampas de solución de los 5 niveles BOOST extendidas hasta pisar la plataforma de meta (misma trampa de labio en L10, L13, L19, L25, L29): L10 →(288,358), L13 →(288,397), L19 →(298,317), L25 →(298,437), L29 →(288,355). Ratios tinta/par resultantes: 0,982–0,983 (banda 85–100 %).
3. `test-game.mjs`: DSF 2 → 1 (el rasterizado SwiftShader a DSF 2 cuadruplica el coste, mata el FPS y estrelló el renderer en la captura del L12; la física no depende del DSF, así que la verificación de niveles no cambia; el film sigue a DSF 2 para las capturas bonitas).
4. `test-game.mjs`: la escritura final del JSON ahora está en `try/catch` (un EPERM al escribir el log no debe tumbar el harness ni ocultar el veredicto).

## Pendiente de verificar (bloqueado: Chromium no arranca, SIGTRAP)

- Re-correr el harness completo tras las correcciones (30/30 niveles).
- Probe de L6 para confirmar la causa de su derrota rápida.
- `anti-trivial.mjs` (rampa perezosa, banda de par, dominancia de tinta, 0 px).
- Probe de los 9 niveles nuevos + enseñanza (L6, L12, L18).
