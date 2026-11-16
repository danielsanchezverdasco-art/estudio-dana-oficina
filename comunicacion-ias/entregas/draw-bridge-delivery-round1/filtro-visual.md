# Filtro visual — Draw Bridge Delivery (round 1)

Estado: **SIN VERIFICAR EN NAVEGADOR.** Chromium muerto (exit 133) en las
3 ventanas finisher; las capturas del harness están pendientes. Lo que sigue
es la auditoría del código + la biblia de arte, no de capturas reales.

## Lo que el código garantiza (verificado por lectura + tsc)

- [x] Todo el arte es procedural a 2x (`city.ts`, 26 texturas): nada de
  bitmaps escalados, nada pixelado por construcción.
- [x] Contorno oscuro de 3 px en todo el arte generado (casas, sol, monedas,
  acantilados, scooter).
- [x] HUD con sombra en todo el texto (título, monedas, INK, pistas).
- [x] Las plataformas visuales y las físicas son el MISMO rectángulo
  (`drawCliff` dibuja sobre el rect de física; el fondo ya no pinta
  acantilados que no coincidan).
- [x] Títulos con auto-fit (el título largo se encoge, nunca se desborda).
- [x] Tarjetas de resultado/pausa con altura calculada desde el contenido
  (heredado de la r2: ningún botón cuelga fuera de la tarjeta).

## Pendiente de captura (harness)

- [ ] Menú en vertical y horizontal: ¿el título «DIBUJA EL PUENTE» cabe sin
  tapar los toggles? ¿la pizza no tapa al repartidor?
- [ ] L1: ¿se lee el puente de madera sobre el río? ¿la pista no tapa el hueco?
- [ ] L6/L8/L12/L18: ¿el viento / trampolín / puente móvil / segunda moto se
  leen a primera vista?
- [ ] ES: ¿«¡ENTREGADO!» y las pistas en español caben en sus bandas?
- [ ] Pausa, mapa, tienda: ¿nada se solapa a 390×844 ni a 844×390?
- [ ] Comparación lado a lado con Metro Nightmare (la regla: nada se enseña
  sin compararlo con Metro).

## Hallazgos conocidos (del código, antes de capturar)

1. **El jinete pasa POR DELANTE del muro en L5/L17** (el puente baja por
   debajo del muro y el casco se solapa con el gráfico del muro unos 20 px).
   Se lee como «pasar por debajo de un arco», pero hay que verlo en captura.
2. **El muro de L14 (pilar + muro)** es el único elemento flotante del juego
   (el pilar sube desde el río). En captura debe leerse como pilar, no como
   bloque flotante.
3. **La casa del acantilado de salida** (0,85×) puede tapar la pista de
   enseñanza en niveles con la plataforma alta (L10/L22, y=640–650). La pista
   está en y=96, la casa en y≈600: no se solapan. Verificar en captura.

## Veredicto visual

**SIN VEREDICTO.** El diseño está fijado y el código lo respeta; la
verificación visual real espera al harness (capturas) + la prueba de Daniel.
