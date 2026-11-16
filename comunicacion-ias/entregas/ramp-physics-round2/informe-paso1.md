# Informe — Paso 1: Dirección de arte opción C (CÓMIC)

**Fecha:** 15/11/2026 · **Rama:** `anita/ramp-physics-r2` · **PR contra `main`.**
**Orden:** ajuste de Daniel 15/11 21:05 — todo se sube paso a paso; cada entrega
pasa por GitHub para que Daniel la apruebe o la rechace antes de seguir.

## 1. Qué se entrega en este paso (y qué NO)

**Este paso es SOLO dirección de arte. No hay juego, ni prototipo jugable,
ni niveles, ni pack.** Lo que Daniel aprueba o rechaza aquí es el LOOK del
juego, antes de que se programe nada.

| Archivo | Qué es |
|---|---|
| `biblia-arte-opcion-c.md` | La biblia de arte vinculante: paleta con rol de juego, trazo, semitono, muñeco, elementos, HUD, fondos y lo que NO es opción C. |
| `assets/mockup-c-comic.webp` | El mockup C elegido por Daniel (nivel 12), referencia maestra. 1152×2048. |
| `assets/menu-390x844.png` | **Menú principal** en estilo C, 688×1489 (proporción exacta 390:844, 1,76x). Título, muñeco, PLAY, LEVELS, SHOP, contador de monedas. |
| `assets/muneco-ragdoll.png` | **El muñeco ragdoll** solo, cuerpo entero, 1184×2096. Amarillo, visor grande con reflejo, brazos en jarra. |
| `assets/rampa-dibujada.png` | **La rampa dibujada** sola, 1184×2096. Trazo grueso negro, núcleo azul marino, rayas cruzadas, monedas doradas. |
| `assets/guia-estilo-visual.png` | **Guía de estilo visual**: paleta con rol, las 3 tintas, tipografía, recortes de elementos (muñeco, rampa, ventilador, dinamita + bandera). |
| `assets/comparativa-metro-nivel.webp` | Metro Nightmare vs nivel opción C, lado a lado (la comparativa aprobada en la fase de mockups). |
| `assets/comparativa-metro-menu.png` | Metro Nightmare vs menú opción C, lado a lado, mismo lenguaje visual. |
| `informe-paso1.md` | Este informe. |

**No se incluye nada del juego** (el código r2 escrito antes del cambio de
plan queda fuera de la PR; no se sube, no se revisa aquí).

## 2. Por qué cada decisión cumple el listón de 20.000 $

El listón no es «se ve bonito». Es: **esto parece un juego que costó 20.000 $
hacerlo, al lado de Metro Nightmare, y se lee en 3 segundos en un móvil.**

- **Trazo grueso negro en todo.** Es lo que hace que Metro se lea a tamaño
  de móvil y lo que hacía que la r1 se viera «pobre y pixelada»: la r1 no
  tenía contorno. En opción C no hay ninguna línea de 1 px ni ningún borde
  difuminado. Si un elemento no tiene contorno grueso + sombra + textura,
  no está terminado (biblia §9).
- **Paleta con rol de juego, no decorativa.** Amarillo = protagonista,
  rojo/naranja = peligro, verde = meta, dorado = monedas. El jugador no
  tiene que aprender qué es qué: el color ya lo dice. Es la misma lógica que
  Metro (sus personajes y sus objetivos se distinguen por color antes que por
  forma).
- **El verbo hecho estilo.** La rampa —lo que el jugador dibuja— no es una
  línea: es un trazo de rotulador con rayas cruzadas. El jugador ve su propia
  acción convertida en arte. Eso es lo que hace que el juego se recuerde.
- **Fondos con profundidad.** Papel crema + rayos radiales + semitono en las
  esquinas + marco de viñeta. La r1 tenía fondos vacíos; aquí no hay ninguna
  pantalla de un solo color plano.
- **Muñeco expresivo y volumétrico.** Visor grande con reflejo blanco, cuerpo
  segmentado con cara clara y cara oscura. No es un icono: es un personaje
  que se puede querer, y el mismo muñeco sirve para el menú, el juego y la
  portada (coherencia = producción).
- **HUD que es parte del cómic.** Burbuja amarilla LEVEL, barra INK con
  rayas diagonales (dice «esto se gasta»), botón LAUNCH! verde y enorme. El
  HUD no está pegado encima del juego: es la misma viñeta.
- **Resolución real, nada pixelado.** Menú 1072×2320, muñeco y rampa
  1184×2096, mockup 1152×2048. Todo a resolución real; nada de bitmaps
  pequeños reescalados. En el paso 2 el arte del juego será vectorial
  procedural en Phaser (formas dibujadas a escala real, no bitmaps), siguiendo
  esta biblia al pie de la letra — ver §5.

## 3. Comparativa con Metro Nightmare (veredicto visual)

Las dos comparativas están en `assets/`. Lo que se ve en ellas:

- **Metro** gana en densidad de escena (muchos personajes, interior de metro
  con detalle). **Opción C** gana en claridad del verbo: en una mirada se
  entiende qué hay que hacer (dibujar una rampa del muñeco a la bandera).
- **Lectura a tamaño de móvil:** el título RAMP PHYSICS, el muñeco amarillo
  y el botón PLAY se leen igual de bien que los elementos principales de
  Metro. El HUD (LEVEL, monedas, INK, LAUNCH!) tiene el mismo peso visual
  que el HUD de Metro.
- **Coherencia:** menú y nivel usan el mismo muñeco, la misma paleta, el
  mismo papel y los mismos contornos. No hay dos juegos en uno.
- **Lo que falta para igualar a Metro en densidad:** el nivel 12 del mockup
  tiene ventilador + dinamita + bandera + 3 monedas; es una escena rica.
  Los niveles sencillos (L1–L5) tendrán menos elementos por diseño (tutorial),
  pero nunca fondos vacíos: siempre rayos + semitono + marco.

**Veredicto de la constructora:** la dirección sostiene la comparación con
Metro en claridad y en acabado. La densidad de escena se iguala en los
niveles con peligros (L6 en adelante).

## 4. Observaciones honestas (lo que vi al revisar las pantallas)

- **Menú:** perfecto en proporción (exacta 390:844) y estilo. El contador
  marca ×0 (partida nueva). Sin defectos.
- **Muñeco:** perfecto. El mismo personaje del mockup, reconocible al instante.
- **Rampa:** buena, con dos matices — el ángulo es muy empinado (65–70°,
  más que la rampa del mockup, ~50°) y las monedas llevan una estrella
  grabada (en el mockup son lisas con destello). Ninguno de los dos rompe el
  estilo: la rampa se lee como rampa y las monedas como monedas. Se deja
  como está para este paso; si Daniel prefiere monedas lisas y rampas menos
  empinadas, se ajusta en el paso 2 sin tocar la dirección.
- **Las pantallas del paso 1 son arte de dirección** (generadas a partir del
  mockup C aprobado como referencia). **No son capturas del juego** — el
  juego no existe todavía. Su función es fijar el look que Daniel aprueba.
  El arte dentro del juego (paso 2) se dibuja procedural en Phaser, vectorial,
  siguiendo esta biblia; las pantallas finales se verificarán contra estas
  imágenes lado a lado antes de enseñárselas a Daniel.

## 5. Qué queda para los pasos siguientes (NO está en esta PR)

- **Paso 2 — construcción del juego** (solo si Daniel aprueba este paso 1):
  prototipo desechable del verbo, 30 niveles según el plan de dificultad
  (par = óptima × 1,10; peligros desde L6/L12/L18; monedas fuera de la línea
  óptima), juice acotado, mapa, tienda, guardado, ES/EN, tests (56+ checks,
  anti-trivial, sondas de los niveles nuevos) y playtest. El arte procedural
  en Phaser seguirá esta biblia; las capturas reales del juego se compararán
  con estas pantallas antes de la siguiente entrega.
- **Paso 3 — pack de entrega:** zip ≤ 5 MB, 6 portadas de capturas reales,
  GIF, Short, listing, teardown, filtros, informe de ronda.
- **Preguntas abiertas para Daniel (sin cambios desde la r1):** título EN
  («Ramp Physics» propuesto); Short mudo o con música original; anuncios
  colocados pero sin servir en pruebas.

## 6. Qué se le pide a Daniel

Aprobar o rechazar **esta dirección de arte** en la PR. Si la aprueba, el
paso 2 construye el juego fiel a ella. Si la rechaza (o pide cambios), se
ajusta el arte aquí, antes de programar nada — que es exactamente para lo
que sirve este paso.

## 7. Skills usadas (solo lista de Grok)

`art-direction-and-readability` (paleta con rol, legibilidad),
`directing-game-visuals` (dirección C, fondos con profundidad),
`level-design` y `difficulty-and-balancing` (solo como referencia del plan de
dificultad, sin construir niveles), `playtest-report` (revisión visual a la
vista de cada pantalla). Nada fuera de la lista. No se tocó `anita.md` ni
`niky.md`. Nada publicado en Playgama/YouTube.
