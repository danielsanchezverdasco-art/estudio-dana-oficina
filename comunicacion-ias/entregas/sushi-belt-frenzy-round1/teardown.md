# Teardown — Sushi Belt Frenzy (ronda 1)

**Fecha:** 16/11/2026. **Autor:** Anita. **Concepto:** issue #24 §4
(`niky/fabrica-conceptos-1511`), mockup `mockup-sushi-belt-frenzy.webp`
aprobados por Daniel 16/11 ~06:36 («Quiero todos para hoy»).

## Veredicto del ranking (issue #26) — honesto

**#14 Cinta de Sushi Glotona — 25/35 · 🟡 DUDOSA.**
Tendencia 5 · competencia 3 · viabilidad 3 · viral 3 · 3 s 3 · adicción 4 ·
monetización 4. Condición: «es la idea con más viento a favor y más riesgo
de ejecución a la vez. Prototipo desechable antes que mockup: si el flow no
se siente perfecto, no se construye.»

Daniel anuló la condición al aprobar los 6 («Quiero todos para hoy»,
«Perfectamente diseñados»). Esta ronda 1 es la respuesta a la condición:
el flow se verifica con números (harness) antes de enseñar el juego, y el
teardown deja constancia de dónde sigue el riesgo.

## Comparación: el género flow/cinta

- **Pixel Flow!** — n.º 1 de los puzles hybridcasual, 31,3 M$; 6 de los 10
  primeros son de tipo flow o cinta (AppMagic, Hybridcasual Puzzles Q3 2026).
- Los flow/cinta son lo que más factura en hybridcasual; ningún «flow»
  estaba en el top 50 de Playables — hueco abierto, no saturación.
- **Lo que Sushi añade donde el flow puro solo tiene piezas:** personajes
  con hambre visible (los gatos). El feedback es un gato que come, no un
  número. El color lo explica todo en un vistazo, sin tutorial. El combo
  con fuego y el chef que avisa dan tensión y ternura a la vez — filmable
  en Short (el gato tosiendo wasabi).

## 3 puntos en los que supera al top

1. **El gato que come ES el feedback** (no un número): cada servicio tiene
   su momento de satisfacción (salto, +30, chispas, maullido).
2. **El color lo explica todo en un vistazo, sin tutorial**: plato y gato
   del mismo color + mismo símbolo (●/▲/◆). Cero lectura en 10 segundos.
3. **Combo con fuego + chef que avisa**: tensión (la cinta acelera, el
   wasabi acecha) y ternura (el chef señala, el gato ronronea) a la vez.

## Dónde sigue el riesgo (DUDOSA, sin esconderlo)

1. **El flow debe sentirse perfecto o no hay juego.** El harness prueba
   las reglas, no la sensación: la velocidad de la cinta, el tamaño del
   plato (56 px), el arco al servir (320 ms) y el tiempo de reacción
   (0,5 s en el modelo humano) son decisiones de diseño sin prueba humana
   todavía. Si Daniel juega y el flow no se siente perfecto, la r2 ajusta
   velocidades y tamaños — no se discute, se mide.
2. **El tap automático perdona demasiado en niveles lentos.** El aleatorio
   gana 3★ en 1 de 3 corridas en L8/L12/L13 (lentos). El juego se pone
   exigente por velocidad, no por decisión: en L1–L10 casi cualquier toque
   sirve. Es el diseño del concepto (un verbo, 10 segundos), pero el
   techo de habilidad llega tarde (bloques 4–6).
3. **El wasabi es un distractor, no una decisión.** No servirlo nunca es
   la jugada correcta siempre; solo castiga al que lo sirve por error o
   por impaciencia. En la r2 se puede convertir en decisión (p. ej. wasabi
   que hay que apartar con un gesto para que no tape la cinta).
4. **Sin música.** El audio es SFX sintetizado; la pregunta de la música
   ambiental de restaurante queda abierta para Daniel.

## Lo que esta ronda 1 entrega contra el riesgo

- Harness PASS 30/30 (perfecto 3★, ocioso pierde, servir-todo pierde,
  aleatorio no gana de forma fiable, humano ≥ 2★ en 28/30 a 3/3 y L6/L17
  a 2/3) — las reglas son sólidas; falta la prueba de sensación (Daniel).
- Arte fiel al mockup aprobado (visto a la vista 16/11 ~06:59): chef,
  cinta, tres gatos por colores, HUD completo, BOOST.
- Zip ≤ 5 MB, Bridge, guardado, 30 niveles, tienda, reto diario.
