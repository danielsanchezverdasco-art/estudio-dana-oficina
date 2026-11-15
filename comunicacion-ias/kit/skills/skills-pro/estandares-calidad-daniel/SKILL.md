---
name: estandares-calidad-daniel
description: "Daniel's quality standards for Dana Games: the 15 fixed standards, the premium-art-first rule, the field lesson and the zero-errors bar every game must meet before review. Use before showing anything to Daniel and before every delivery round; it is the checklist the Director applies. Installed 15/11/2026 because the manual (CREAR-JUEGOS.md, CONTROL-CALIDAD.md) mandates this skill and the kit did not have it."
---

# Estándares de calidad de Daniel

La lista que Daniel aplica a cada juego antes de enseñar nada y antes de cada entrega. Si un punto no se cumple, se arregla antes de enseñarlo. «No quiero errores.»

## Cuándo usarla

- Antes de enseñar cualquier avance a Daniel (también un avance: nada se enseña sin compararlo antes lado a lado con Metro).
- Antes de cerrar una ronda de entrega (`informe-rondaN.md`).
- Al revisar un juego (propio o de la otra IA) con `manual/CONTROL-CALIDAD.md`.

## Los 15 estándares

1. **Simple, intuitivo y adictivo.** Una sola mecánica que se entiende al primer toque, sin leer un muro de texto. Lección: Metro Nightmare no se entendía y se rehízo al estilo Bus Jam.
2. **Simple no significa feo.** Calidad visual máxima: animaciones, jugo, menú vistoso y portadas que atraen a primera vista.
3. **Cada juego nuevo es de un género distinto al anterior.**
4. **Ingeniería inversa de los mejores del género** y superarlos en al menos 3 puntos concretos, apuntados en `teardown.md`. Se copia la técnica, nunca el código ni el arte.
5. **Estilo realista de videojuego.** Nada de dibujos planos ni clip-art. Personajes con volumen, texturas, luces y sombras. Lo que quede por debajo de la referencia de Metro se rechaza.
6. **Personajes sin deformar:** escala uniforme. Nunca estirar un sprite para llenar un hueco.
7. **Optimizado para móvil:** vertical primero (390×844), táctil, botones grandes (acciones principales ≥ 88 px; mínimo absoluto 48 px), carga rápida.
8. **Nada flotando ni recortado ni solapado.** Sin zonas vacías. Sin textos cortados.
9. **Portadas reales,** nunca un marcador de posición.
10. **Menú principal:** escena ilustrada e interactiva, no un título estático con botones. El menú se siente como un juguete.
11. **El primer nivel es un tutorial con la mano oficial,** que señala exactamente qué tocar.
12. **Solo datos reales.** Lo que no tenga fuente: «sin datos aún».
13. **Español al hablar con Daniel. En el juego y en la ficha: inglés primero,** español segundo.
14. **Filtro antes de revisar:** no se revisa un juego sin `skills-usadas.md`, `filtro-visual.md` (comparado con Metro) y `filtro-jugabilidad.md`.
15. **Sin la entrega completa no hay revisión** (zip, portadas, ficha, capturas, GIF, auditorías y teardown). El Short puede ir en paralelo, pero no se publica el juego sin el APROBADO.

## Arte premium primero (15/11/2026)

- El arte premium va PRIMERO, antes de programar. La pantalla principal de juego (tablero o campo) se genera y aprueba al nivel de Metro, o de un juego móvil top de su género, ANTES de programar la lógica. Nunca se usa arte provisional de esquema.
- Nada se enseña a Daniel, ni como avance, sin compararlo antes lado a lado con Metro. Si no llega al nivel, no se enseña.
- El listón es «de 10.000 dólares»: luz, sombras, textura, profundidad y animación en todo.

## Lección del campo (15/11/2026, Scribble Striker)

Daniel vio un avance con el campo plano, de esquema, con todos los trazos grises y sin la línea de medio campo, y dijo: «¿por qué hacemos mierdas al principio?». Normas desde hoy:

- La lógica tiene que verse en pantalla: cada equipo o jugador con su color propio y constante, las líneas del campo en un tercer color neutro y todas las líneas que cuentan para el juego dibujadas (por ejemplo, el medio campo como línea de rebote).
- Nunca se usa arte provisional de esquema. Nunca se enseña un avance por debajo del nivel de Metro.

## Cero fallos

- «Cero fallos de nada»: cada filtro se pasa con su resultado medido (número o captura), no con un «revisado».
- Si un filtro falla, no se entrega: se corrige y se vuelve a pasar la lista completa, no solo el punto del informe anterior (los fallos nuevos aparecen mientras se arreglan los viejos).
- No se firma un APROBADO de oídas ni fiándose solo del informe de la otra: se abre el zip, se mide y se juega.

## Skills relacionadas

- `game-quality-gates` (puertas de calidad y checklist pre-despliegue), `game-polish-audit` (auditoría de pulido), `auditing-game-screen-readability` (legibilidad de pantallas), `art-direction-and-readability` y `directing-game-visuals` (dirección de arte), `playtest-report` y `evaluating-gameplay-balance` (pruebas de juego y balance).
