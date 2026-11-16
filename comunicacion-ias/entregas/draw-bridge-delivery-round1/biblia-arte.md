# Biblia de arte — Draw Bridge Delivery (round 1)

Fuente: el mockup aprobado por Daniel (LEVEL 7, `mockup-draw-bridge-delivery.webp`,
rama `niky/fabrica-conceptos-1511`). El mockup muestra: ciudad soleada junto a
un río, acantilados de roca con hierba, casas de colores, un puente dibujado
que brilla en naranja con la moto encima, botón PLAY verde pulsante, INK,
250 monedas, UNDO y ERASER. Este documento fija ese diseño como ley.

## Identidad visual

**Ciudad soleada junto al río, estilo cómic plano.** Nada realista, nada
plano/cutre: producción, volumen, luz, sombra, textura y game feel (regla de
estilo de Daniel, issue #10). El arte es 100 % procedural (canvas 2D a 2x,
`src/city.ts`): cero bitmaps, nada que pueda verse pixelado.

## Paleta (con rol de juego)

| Color | Hex | Rol |
|---|---|---|
| Cielo (arriba) | `#5fb6f2` | Mundo — fondo, calma |
| Cielo (medio) | `#a8dcf7` | Mundo |
| Horizonte | `#fff2b8` | Mundo — calor de mañana |
| Sol | `#ffd93b` | Alegría, marca de la mañana |
| Hierba | `#58b368` | Plataformas — «suelo seguro» |
| Roca | `#b07a4a` | Acantilados — el obstáculo |
| Roca oscura | `#8a5a33` | Estratos, sombra de roca |
| Río | `#2f9be8` → `#1f7fd0` | Peligro — «al agua = pierde» |
| Madera | `#c68b4e` | El puente que dibujas |
| Borde madera | `#7a4f24` | Contorno del puente |
| Brillo de trazo | `#ff9f1c` | El lápiz mientras dibujas |
| Coral | `#ff6b5e` | Casas, casco del repartidor, ERASER |
| Verde hoja | `#58b368` | PLAY, victoria, 3★ |
| Amarillo | `#ffc53d` | Monedas, sol, TURBO |
| Rosa | `#ff6b9d` | Tinta saltarina (BOUNCY) |
| Tinta (contorno) | `#141414` | Contorno de 3 px en TODO |
| Crema | `#fff6d8` | Tarjetas (resultado, pausa) |

## Reglas de trazo y textura

1. **Contorno oscuro de 3 px en todo** (casas, acantilados, sol, monedas,
   scooter, botones). Sin contorno no hay lectura en móvil.
2. **Rellenos planos** en objetos pequeños; degradado solo en cielo y río.
3. **El puente dibujado** es una viga de madera: borde oscuro de 12 px +
   relleno de madera de 8 px. Mientras se traza, brillo naranja (`#ff9f1c`,
   alfa 0,85) por encima — el mockup lo muestra brillando.
4. **Acantilados**: roca `#b07a4a` + 3 líneas de estrato + hierba en la parte
   superior (rectángulo redondeado verde con contorno). Las plataformas de
   física y las visuales son el MISMO rectángulo (nunca un acantilado pintado
   que no coincida con la física — lección del fondo compartido).
5. **Casas**: cuerpo plano de color + tejado triangular + puerta + 2 ventanas
   con contraventanas. Tres variantes (coral, teal, amarilla) que rotan por
   nivel. La casa de la meta lleva la bandera a cuadros al lado.
6. **Río**: degradado azul + 3 filas de ondas blancas + destellos. El río es
   el game-over: caer al agua = «¡AL AGUA!».
7. **El scooter**: cuerpo grueso con contorno, 2 ruedas grandes que giran con
   la distancia, repartidor con casco rojo, caja de pizza blanca/roja en el
   portaequipajes. La pizza es el personaje: en el menú, tocarla la hace girar.
8. **Sol con cara** (ojos cerrados + sonrisa) — PEGI 3, amable, nunca
   amenazante.

## Tipografía

- **Lilita One** (títulos, números, botones) + **Nunito** (cuerpo). Bundled
  woff2, nunca de CDN. Licencias OFL en `public/licenses/`.

## HUD

- Arriba: `LEVEL N · Nombre` (izquierda), píldora de monedas (centro),
  pausa `II` (derecha).
- Barra INK debajo, con marcador blanco en el par (la línea del 3★) y cambio
  de color verde → ámbar → rojo.
- Abajo: UNDO (azul) | PLAY (verde, grande, pulsante) | ERASE (coral).
- Pista de enseñanza de una línea, 5 s, luego se desvanece.

## Comparación lado a lado con Metro Nightmare

Metro Nightmare es el listón de calidad (atmósfera, volumen, pulido). Este
juego no compite en oscuridad — compite en **claridad soleada**: la misma
exigencia de producción (textura, luz, sombra, animación, game feel) aplicada
a un mundo luminoso. La comparación visual lado a lado (capturas del harness
vs Metro) es parte del `filtro-visual.md` y queda pendiente de las capturas.

## Lo que NO se hace

- Nada de bitmaps generados o escalados (regla anti-pixelado).
- Nada de texto sobre el arte sin sombra (todo el texto del HUD lleva sombra).
- Nada de «oficial» ni marcas reales. La pizza no lleva marca.
- Nada de sangre, sustos o violencia: caer al agua es un chapuzón con la
  pizza volando, no un accidente.
