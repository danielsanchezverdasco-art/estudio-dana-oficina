# Biblia de arte — Ramp Physics r2, Opción C: CÓMIC

**Elegida por Daniel, 15/11/2026 ~20:01.** Dirección visual vinculante para la
r2 completa. Todo el arte es procedural (formas vectoriales de Phaser dibujadas
a escala real, texturas generadas en canvas 4x) — **nada de bitmaps pequeños
reescalados, nada pixelado**.

## 1. Idea

El juego es un cómic que se juega: el verbo (dibujar rampas) ES el estilo.
La rampa no es una línea — es un trazo de rotulador grueso dibujado a mano,
con sombreado de rayas cruzadas. El muñeco no es un muñeco — es un personaje
de cómic amarillo, expresivo y volumétrico. Cada pantalla parece una viñeta.

Referencia de listón: **Metro Nightmare** (comparativa lado a lado en
`comparativa-metro-opcion-c.webp`). El listón es «parece que costó 20.000 $
hacerlo», no «parece un prototipo».

## 2. Paleta (con rol de juego)

| Color | Hex | Rol |
|---|---|---|
| Papel crema | `#f7e8c3` | Fondo de todas las pantallas (papel, no vacío) |
| Crema claro | `#fff8e7` | Tarjetas, burbujas, superficies |
| Tinta negra | `#141414` | Contornos gruesos, texto, HUD |
| Amarillo sol | `#ffc93c` | **Protagonista** (muñeco, burbuja LEVEL, acentos) |
| Amarillo oscuro | `#e8a800` | Sombra del amarillo, profundidad |
| Azul marino | `#1e3a5f` | Rampas de acero, plataformas, HUD secundario |
| Azul claro | `#4a90d9` | Brillos, agua, acentos fríos |
| Rojo coral | `#ff4757` | **Peligro** (dinamita, avisos) |
| Naranja | `#ff7f2a` | Peligro secundario, mecha, explosión |
| Verde | `#2ed573` | **Meta** (bandera, botón LAUNCH, éxito) |
| Dorado | `#ffd700` | **Monedas** (siempre dorado, nunca amarillo pálido) |
| Blanco | `#ffffff` | Reflejos, destellos, texto sobre oscuro |

Regla: **amarillo = protagonista, rojo/naranja = peligro, verde = meta,
dorado = monedas**. Nunca se mezclan los roles (una moneda nunca es verde,
un peligro nunca es amarillo).

## 3. Trazo

- **Contorno negro grueso en TODO**: personajes, rampas, plataformas, HUD,
  botones, tarjetas. Grosor: 4–6 px a escala de diseño (390×844), 16 px el
  trazo de la rampa dibujada (sub-trazo negro) con núcleo de color de 10 px.
- Las rampas dibujadas por el jugador se renderizan igual que las del
  mockup: sub-trazo negro + núcleo de color + **rayas cruzadas** (crosshatch)
  en azul marino para el acero; **zig-zag de muelle** para el elástico;
  **cheurones** (>>) para el boost.
- Nada de líneas de 1 px, nada de bordes difuminados. El contorno es lo que
  hace que el juego lea a tamaño de móvil y a tamaño de portada.

## 4. Textura: semitono y líneas de velocidad

- **Semitono (puntos)**: el fondo de juego y de menú es papel crema con
  **rayos radiales** desde el centro superior + **puntos de semitono**
  (halftone) en las esquinas + **líneas de velocidad** diagonales en los
  bordes. Nunca un fondo plano.
- Los puntos de semitono también aparecen como textura de sombra en el
  muñeco y en las plataformas (nunca como ruido aleatorio).
- **Líneas de velocidad** en los momentos de acción: al lanzar, en el
  ventilador (estelas de aire), en la explosión.

## 5. El muñeco (protagonista)

- Cuerpo amarillo segmentado (cabeza, torso, brazos, piernas) con contorno
  negro grueso y sombra amarilla oscura en el lado opuesto a la luz.
- **Visor grande oscuro con reflejo blanco** (la cara es un visor, como en
  el mockup C) — expresivo sin necesidad de ojos dibujados. En el menú, el
  busto grande (292×512) muestra el visor con el reflejo y una sonrisa
  implícita en la postura.
- Volumen: cada segmento tiene una cara clara (arriba-izquierda) y una cara
  oscura (abajo-derecha). Nunca plano.
- Squash & stretch en rebotes (elástico) y al aterrizar: el muñeco se
  comprime y se estira — es la mitad del game feel.

## 6. Elementos de juego

- **Rampa (verbo)**: trazo a mano, azul marino, crosshatch. Es lo que el
  jugador dibuja; debe leerse como «lo dibujé yo» y como «es sólido».
- **Plataforma**: losa gris con cara superior clara, lateral con rayas y
  contorno negro grueso. Sólida, pesada, industrial.
- **Ventilador** (desde L6): industrial, grande, con aspas visibles y
  **remolinos** (espirales) que indican la dirección del aire. El aire se ve:
  estelas blancas animadas cada 450 ms mientras el muñeco está en su zona.
- **Dinamita** (desde L12): cilindro rojo con la etiqueta «TNT» en blanco,
  mecha con chispa animada (partículas naranja). Al explotar: hit-stop de
  80 ms + «BOOM!» en cómic + partículas.
- **Portal** (desde L18): anillo con remolino interior; al atravesarlo,
  destello + estiramiento del muñeco (150 ms).
- **Bandera**: a cuadros blancos y negros, con **destellos** (sparkles) y
  ondeo al ganar. La meta siempre es verde + bandera, nunca solo un círculo.
- **Moneda**: dorada, con contorno negro y brillo blanco, giro animado.
  Siempre fuera de la línea óptima (cogerla cuesta tinta o riesgo).

## 7. HUD

- **Burbuja amarilla LEVEL** (arriba-izquierda), con contorno negro grueso.
- **Contador de monedas** (píldora dorada, arriba-centro).
- **Botón de pausa** (arriba-derecha, cuadrado con contorno).
- **Barra INK** con **rayas diagonales** (el medidor es la tinta que queda;
  las rayas dicen «esto se gasta»).
- **Botones STEEL / BOUNCY / BOOST**: píldoras con contorno grueso; la
  activa, amarilla y elevada; las inactivas, crema.
- **Botón LAUNCH!**: verde, grande, con contorno negro grueso. Es el botón
  más grande de la pantalla — la acción principal siempre gana.
- UNDO / CLEAR se mantienen (r1) como iconos pequeños con contorno, arriba
  de la barra INK — el mockup C no los muestra, pero la construcción real
  los necesita.
- Tipografía: **Lilita One** para títulos y números (gruesa, cómic),
  **Nunito** para texto. Nada de fuentes de sistema.

## 8. Fondos (profundidad, no vacío)

- Juego: papel crema + rayos radiales + semitono en esquinas + marco negro
  fino (la viñeta). El suelo no es un color plano: es papel con textura.
- Menú: mismo papel, rayos más marcados, el busto del muñeco grande a la
  derecha, título con contorno negro y sombra amarilla.
- Mapa: nodos con contorno negro sobre papel; el camino es una línea de
  puntos gruesa.
- Nunca un fondo de un solo color sin textura. Si una pantalla se ve vacía,
  le falta semitono, rayos o un elemento.

## 9. Lo que NO es opción C

- Nada pixelado, nada de bitmaps reescalados, nada de arte generado por IA
  en el juego (las portadas usan capturas reales de gameplay).
- Nada plano/cutre: si un elemento no tiene contorno grueso + sombra +
  textura, no está terminado.
- Nada realista: el arte es cómic, no foto. El realismo no es el listón;
  la producción (volumen, luz, sombra, textura, animación, game feel) sí.
- Nada de texto pequeño sin contorno sobre fondos con textura.

## 10. Verificación visual

Cada pantalla clave se compara con el mockup C y con Metro Nightmare lado a
lado antes de darla por buena: menú, L1 (tutorial), L6 (ventilador), L12
(dinamita), L18 (portal), mapa, tienda, resultado, menú en horizontal.
Si una pantalla no se sostiene al lado de Metro, se rehace.
