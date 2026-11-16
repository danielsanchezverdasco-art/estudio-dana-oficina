# Filtro visual — Sushi Belt Frenzy (ronda 1)

**Fecha:** 16/11/2026. **Método:** comparación lado a lado contra Metro
Nightmare (mínimo de calidad) y contra el mockup aprobado.
**Límite honesto:** sin capturas de navegador (Chromium muerto en la VM,
exit 133) — esta auditoría se hace contra el mockup visto a la vista
(16/11 ~06:59, 1152×2048) + la biblia de arte + el código de `sushi.ts`.
Las capturas reales del juego quedan para la ventana finisher; si un frame
real no iguala al mockup, la r2 lo corrige.

## Metro Nightmare (el listón) vs Sushi Belt Frenzy

| Metro Nightmare | Sushi Belt Frenzy r1 |
|---|---|
| Arte premium: volumen, luz, sombra, textura, animación, game feel | Gatos con volumen (sombra real + brillo + barriga clara), cinta de madera con veta, chef con gorro y pañuelo, animación viva (respiración, masticar, toser, señalar) |
| Nada básico / plano / cutre | Todo el arte es vectorial a 4x, contorno negro grueso, franja de volumen; nada de bitmap escalado |
| El arte ES la mecánica | El color + símbolo del plato y del gato es la regla; el chef que señala es el aviso; el combo con fuego es la tensión |
| Personajes con expresiones vivas | 4 estados por gato (idle/happy/angry/cough) + chef que saluda y señala |

## Contra el mockup aprobado (verificado a la vista)

- HUD superior: LEVEL 4, SCORE 840, COMBO x5, 3 corazones, PAUSE ✓
  (la r1 pone LEVEL/SCORE/corazones/PAUSE en la misma banda).
- Chef gato blanco con gorro detrás de la barra ✓ (textura `chef-cat`,
  poses idle + pointing).
- Cinta con platos de sushi, mano señalando el plato de salmón ✓ (la
  mano tutorial de L1 señala el primer plato).
- Tres gatos abajo sobre alfombras de color (naranja, gris, blanco y
  negro) ✓ (mats + símbolos ●/▲/◆).
- Burbuja +30, COMBO x5 con llamas, botón BOOST ✓.
- Sin barra de estado, sin relojes falsos, sin elementos cortados ✓.

## Defectos encontrados en las capturas reales (corridas 1–2) y su arreglo

La corrida 1 (16/11 ~06:57) y la corrida 2 (~07:06) del smoke
(`tools-local/smoke.mjs`, Chromium vivo tras el reinicio) revelaron 6
defectos reales — todos ARREGLADOS en el código (ver
`tools-local/smoke-results-r1.md`):

1. **Título del menú a 2 líneas** tapado por la píldora de monedas, con
   el subtítulo y el tagline cayendo sobre la cabeza del chef → título
   forzado a UNA línea, tagline eliminado del menú, botones EN/sonido
   a la esquina superior (40 px).
2. **Botón diario con el texto en manchas negras** (texto oscuro +
   borde negro) → `makeButton` usa borde crema para texto oscuro.
3. **Título como barra negra sólida** (letra encogida a 22 px con un
   borde de 8 px que la rellenaba) → título en amarillo sol + el borde
   escala con el tamaño de letra.
4. **Texto del tutorial y los hints sobre la cara/cabeza del chef** →
   movidos a y=430 (bajo la cinta, sobre los gatos) con burbuja crema.
5. **«SERVED: 0/6» y combo sobre el sombrero del chef** → servidos a
   la izquierda (bajo LEVEL), combo a la derecha (bajo los corazones),
   pausa bajada a y=132.
6. **Platos GIGANTES (~2,5x) solapando la cinta y el chef** — el
   pop-in animaba `scale` a 1 (= tamaño natural 4x, 224 px) en vez de
   al tamaño de pantalla (56 px) → el tween vuelve a la escala base.

**Pendiente de verificar con capturas nuevas (ventana finisher):** que
los 6 arreglos se ven bien en el menú y en L1/L6, y el anillo gris en
la píldora de puntos (el «0»/«30» se ve como un anillo gris; los
dígitos sí se ven bien en la pantalla de resultado «+29», por lo que
podría ser un artefacto de la captura).

## Hallazgos (lo que se revisó y qué se hizo)

1. **Color nunca solo:** cada gato y cada plato llevan además su símbolo
   (● naranja, ▲ gris, ◆ blanco y negro); el wasabi lleva llamas + «!»;
   el dorado lleva «★». (Seguridad daltónica, art-direction.)
2. **Platos legibles a 56 px:** el sushi tiene arroz + pescado con
   brillo + rayas; el color del borde es el del gato. A tamaño de móvil
   el plato se distingue por color, por símbolo y por forma del sushi.
3. **El HUD no se mueve:** el juice sacude la cámara, nunca el HUD.
4. **Contraste:** platos y gatos sobre fondo crema/madera con contorno
   negro; texto Lilita One con borde negro y sombra dura.
5. **Cameo Dana Games:** el pulpo morado asoma tras la lámpara (sello
   del estudio, en el fondo de cada partida).

## Pendiente (ventana finisher, con capturas reales)

- [ ] Captura 390×844 ES/EN: menú, L1, L6, L8, pausa, mapa, tienda.
- [ ] Captura 844×390 (paisaje): menú y partida.
- [ ] Verificar a la vista que ningún texto se corta ni se solapa, que
      los gatos no tapan el HUD y que la cinta no se sale del marco.
- [ ] Comparativa lado a lado con Metro Nightmare con imágenes reales.
