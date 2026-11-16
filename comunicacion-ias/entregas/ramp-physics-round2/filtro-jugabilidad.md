# Filtro jugabilidad — Ramp Physics r2

**Regla:** un nivel no se da por bueno hasta pasar este filtro por test o por
juego real. Nada de «parece difícil» sin medirlo.

## Controles (verificados por `tools-local/anti-trivial.mjs` y `test-game.mjs` — estado real en `informe-ronda2.md`)

| Control | Método | Resultado |
|---|---|---|
| La solución óptima gana en los 30 niveles | Replay de solución por Playwright | **PARCIAL (corrida 1):** 7/12 niveles probados ganan a 3★ (L1–4, L8, L11, L12); L5/L7/L9 por timeout, L6/L10 a 0★; L13–30 sin probar. Re-corrida pendiente |
| La rampa perezosa (1 recta spawn→bandera, acero) NO gana ningún nivel del 6 en adelante | Anti-trivial (b) | **PENDIENTE** (anti-trivial sin correr) |
| Par: la óptima usa 85–100 % del par en los 30 niveles | Anti-trivial (c), `inkUsed/par` | **PARCIAL:** por cómputo 30/30 en banda; por test, 7/7 niveles ganados en banda (0,881–0,905). Test completo pendiente |
| Dominancia de tinta por bloque (salvo bloque 1, tutorial de acero) | Anti-trivial (d) + prueba de intercambio a acero | **PENDIENTE** (anti-trivial sin correr) |
| 0 px no gana ningún nivel | Anti-trivial (e), micro-trazo en esquina | **PENDIENTE** (anti-trivial sin correr) |
| 3★ = tinta ≤ par; 2★ = ≤ par × 1,25; 1★ = llegar | `finishWin` en GameScene + replay | **PARCIAL:** los 7 niveles ganados en la corrida 1 dieron 3★ con tinta ≤ par; la regla 2★ (×1,25) está en el código y sin probar en juego |
| Peligros con enseñanza | L6 ventilador, L12 dinamita, L18 portal (pista en primera visita) | En el código; **verificación por sonda pendiente** |
| Monedas fuera de la línea óptima | Auditoría de distancia moneda–solución (≥28 px) | 8 monedas movidas en la r2 (por cómputo) |
| Niveles nuevos verificados por sonda | `probe-level.mjs`: boost gana donde acero pierde; elástico gana donde acero pierde | **PENDIENTE** (sondas sin correr) — niveles 10, 13, 14, 19, 20, 22, 25, 29, 30 |

## Curva de dificultad (objetivo, skill `difficulty-and-balancing`)

- Bloques de 5 con tasas de éxito en primer intento (test competente):
  80 % → 65 % → 50 % → 30 % → 15 % → 10 %.
- 3★ en primer intento ≤ 40 % en total.
- **NO MEDIDO todavía:** sin corrida human-limited no se afirma ningún
  veredicto de dificultad (skill `evaluating-gameplay-balance`). Se mide en
  el playtest propio (`informe-ronda2.md`); la puerta humana final es la
  prueba de Daniel.

## Controles de juego (no de niveles)

- [x] UNDO/CLEAR funcionan y no rompen la tinta restante — **verificado en la corrida 1** (`undo_refunds_ink`, `drag_spends_ink`, `ink_budget_enforced` PASAN).
- [ ] Pausa funciona (botón 356,26; menú de pausa) — **PENDIENTE**: el harness se estrelló antes de la sección 6 (ES/pausa).
- [ ] Guardado persistente (Bridge storage, clave `ramp_physics_save_v1`) — **PENDIENTE**: el harness se estrelló antes de la sección 5 (persistencia tras recarga).
- [ ] ES/EN: todos los textos en los dos idiomas — **PENDIENTE**: el harness se estrelló antes de la sección 6.
- [ ] Tienda: 6 skins + Extra Ink; comprar no toca los pares — **PENDIENTE**: el harness se estrelló antes de la sección 8.
- [ ] Cofre cada 3 niveles — **PENDIENTE** (sin probar en juego).
- [ ] 0 errores de consola, 0 peticiones fallidas (390×844 y 844×390) — **PARCIAL**: 0 peticiones fallidas en la corrida 1; `no_console_errors_after_load` PASA; el chequeo total no llegó a correr (crash del harness); la vista horizontal 844×390 no se probó.
- [ ] Derrota en < 2 s (fundido a gris + «¡Inténtalo de nuevo!») — **PENDIENTE** (sin medir; las derrotas rápidas de L6/L10 en ~3 s son el primer indicio, no una medida).

## Lo que NO pasó el filtro (descartado)

- Niveles r1 9, 10, 14, 16, 22, 24, 27 (geometría no reutilizada: la rampa
  perezosa los ganaba o la solución no existía con las tintas).
- Nivel «Sky High» (r1 24): un solo rebote no llega a una repisa de techo.
