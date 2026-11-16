# Smoke en navegador — Sushi Belt Frenzy (ronda 1)

**Herramienta:** `tools-local/smoke.mjs` (Playwright + `dist-test`,
`__game` = `sushi-belt-test-1`). **Chromium:** solo vivo ~7 min tras
cada reinicio de la VM; muerto el resto del tiempo (exit 133).

## Corrida 2 — 16/11 ~07:05 UTC (tras los arreglos visuales) — 8/10 PASS

| Check | Resultado |
|---|---|
| handle alive (`sushi-belt-test-1`) | PASS |
| menu active | PASS |
| L1 schedule (20 plates) | PASS |
| wrong cat −1 heart | PASS (hearts 2, combo 0, score 0) |
| tap-serve +30 | PASS (score 30, served 1) |
| L1 won by perfect taps | PASS (won, score 230 = 6×30 + 50 combo, served 6, hearts 2) |
| L6 has wasabi | PASS (id 0, spawnAt 1) |
| L6 normal serve first | **FAIL** (score 0, combo 0 tras 18 s) |
| wasabi serve = stun | **FAIL** (hearts 1, score 0, combo 0 — 2 platos salieron sin servir) |
| no console/page errors | PASS |

**Causa de los 2 fallos (artefacto de sonda, no del juego):** Chromium
headless estrangula rAF en página en segundo plano y el bucle `update`
limita dt a 50 ms → el reloj del juego avanza a ~1/6 de la velocidad
real; en 45 s de pared solo avanzaron ~7 s de juego. Los platos de L6
no llegaron a generarse a tiempo para los toques. La lógica de L6 ya
está probada por el harness (perfecto 3★, humano ≥ 2★). **Arreglo:**
`__game.step(dt)` determinista en el handle de pruebas (ver
`testStep` en GameScene) + aserción del wasabi sobre los temporizadores
de aturdimiento expuestos (`stunned[cat] > 0`). La corrida 3 (ventana
finisher) usa `step()` y debe dar 10/10.

## Corrida 1 — 16/11 ~06:57 UTC — 6/9 PASS

Mismos PASS de base (handle, menú, schedule, wasabi presente, sin
errores). Fallaron: tap-serve (el plato aún no había generado a los
800 ms), wrong-cat (mismo motivo) y L1 won (el reloj estrangulado).
El wasabi «PASS» de la corrida 1 era VACUO (la condición se cumplía
con el estado inicial) — no contar como verificado. La sonda se
reescribió con sondeo hasta que el evento registra de verdad.

## Defectos visuales encontrados por las capturas (corridas 1–2) y su arreglo

1. **Título del menú a 2 líneas** tapado por la píldora de monedas +
   subtítulo/tagline sobre la cabeza del chef → título forzado a UNA
   línea, tagline eliminado del menú (el tutorial de L1 enseña el
   verbo), botones EN/sonido a la esquina superior.
2. **Botón diario con texto en manchas negras** (texto oscuro + borde
   negro) → `makeButton` usa borde crema para texto oscuro.
3. **Título como barra negra sólida** (letra encogida a 22 px con borde
   de 8 px) → título en amarillo sol + el borde escala con el tamaño.
4. **Texto del tutorial y hints sobre la cara/cabeza del chef** →
   movidos a y=430 (bajo la cinta, sobre los gatos) con burbuja crema.
5. **«SERVED: 0/6» y combo sobre el sombrero del chef** → servidos a
   la izquierda (bajo LEVEL), combo a la derecha (bajo corazones),
   pausa bajada a y=132.
6. **Platos GIGANTES (~2,5x) solapando la cinta y el chef** — el
   pop-in animaba `scale` a 1 (= tamaño natural 4x, 224 px) en vez de
   al tamaño de pantalla (56 px) → el tween vuelve a la escala base.
7. Píldora de puntos: el «0»/«30» se ve como un anillo gris en las
   capturas — sin resolver del todo (los dígitos sí se ven bien en la
   pantalla de resultado, «+29»); la ventana finisher lo revisa en
   alta resolución.

## Capturas

`entregas/assets/shots/`: `01-menu.png`, `02-game-l1.png`,
`03-result-l1.png` (CATS ARE FULL! +29 monedas, NEXT/REPLAY/MENU),
`04-game-l6-wasabi.png` (los platos gigantes de antes del arreglo).
Las capturas de la corrida 3 (tras los arreglos 1–6) quedan para la
ventana finisher.
