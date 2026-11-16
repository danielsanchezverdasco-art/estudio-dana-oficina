# Biblia de arte — Who Is the Robot? / ¿Quién es el Robot?

**Juego:** hidden object / puzzle de observación (Brain & Puzzle). **Mockup aprobado por
Daniel 16/11 ~06:36** («Quiero todos para hoy», «Perfectamente diseñados»): partida,
«FIND THE ROBOT!», 0:45, 3 corazones, haz de escáner sobre el robot de la sudadera gris,
botón HINT. Concepto en `comunicacion-ias/lista-ideas-2026-11-15.md` §2 (rama
`niky/fabrica-conceptos-1511`); ranking #4, 28/35 FUERTE (issue #26).

> Nota honesta: el mockup `.webp` no se pudo descargar en esta VM (oleada EPERM: todas
> las escrituras por exec truncan a 0 bytes). Esta biblia sigue la descripción escrita
> del mockup + la ficha del concepto + la guía de estilo común de la lista, verificadas
> en el repo. Cuando la EPERM pase, se re-compara el build contra el mockup a la vista.

## Frase visual

**Andén de metro, multitud juguete 3D, haz de escáner.** El arte ES la mecánica: el
estado del juego se lee en la escena, no en un texto. Un dedo, un verbo, a jugar en
menos de 10 segundos.

## Protagonista, peligro, recompensa (una sola lectura por plano)

- **Protagonista:** el haz del escáner (cian brillante, centro luminoso) + el robot
  (sudadera gris, antena diminuta, ojo brillante). El haz es lo que el jugador mueve;
  el robot es lo que busca.
- **Peligro:** el temporizador (ámbar → rojo) y los corazones (rojo). Un toque a una
  persona = un corazón menos. El peligro se lee por color + forma, nunca solo por color.
- **Recompensa:** el robot revelado (anillo dorado pulsante + «!») y la colección por
  ciudades (Nueva York / Tokio / París). Dorado = recompensa, siempre.

## Paleta (cada color tiene un rol de juego)

| Color | Hex | Rol |
|---|---|---|
| Papel crema | #F7E8C3 | mundo, fondo de UI |
| Tinta | #141414 | contornos gruesos, texto |
| Cian escáner | #22D3EE | el haz, lo interactivo, lo seguro |
| Amarillo sol | #FACC15 | robot protagonista (acento), monedas, estrellas |
| Rojo coral | #E23B2E | peligro (corazones, temporizador bajo, fallo) |
| Verde hoja | #22C55E | victoria, ir, desbloqueado |
| Azul marino | #1E3A5F | andén NY (línea), ropa neutra |
| Rosa Tokio | #F9A8D4 | andén Tokio (acentos) |
| Azul París | #60A5FA | andén París (acentos) |
| Gris robot | #9AA5AD | la sudadera del robot (camuflaje: el gris se pierde entre grises) |

Regla de camuflaje: el robot viste gris medio entre grises — nunca destaca por color
en reposo. Solo el haz lo delata (antena + ojo). Los señuelos brillan bajo el haz
(gafas, móvil, pendiente) pero NUNCA tienen antena ni ojo.

## Personajes (multitud con volumen, no sprites repetidos)

- Cada persona es un personaje: 3 siluetas (alta / media / ancha) × 6 paletas de ropa ×
  pelo/sombrero/gorra/bufanda/bolso/móvil. Nadie se repite en un mismo nivel.
- Estilo juguete 3D: contorno negro grueso, luz cálida desde arriba, sombra suave real
  bajo los pies, textura de tela en la ropa. Volumen, no plano.
- El robot: sudadera gris con capucha, cremallera, bolsillo canguro; antena diminuta
  (2 px, solo brilla bajo el haz); ojo brillante (punto cian, solo bajo el haz);
  articulación metálica en la muñeca (destello bajo el haz). En reposo es «una persona
  más con sudadera gris».
- La multitud murmura y se mueve: balanceo suave, algún cambio de sitio lento. El
  movimiento es periférico; el centro (la zona de juego) siempre legible.

## Escenarios (3 ciudades, 10 niveles cada una)

- **Nueva York (L1–L10):** andén gris + franja amarilla de seguridad, azulejos blancos,
  cartel «NYC — 42 ST», banco verde oscuro. Luz cálida de estación.
- **Tokio (L11–L20):** andén blanco + rosa, línea rosa, carteles verticales, suelo
  brillante. Más gente, más prisa (la multitud se mueve más).
- **París (L21–L30):** andén crema + azul, molduras, cartel «PARIS — MÉTRO», lámparas
  cálidas. El robot se mueve despacio entre la multitud (el giro final).

## HUD (legible a tamaño de móvil, sin leer nada para jugar)

- Arriba: temporizador grande (Lilita One, 34 px) + 3 corazones (rojo, con contorno).
- Título de nivel: «FIND THE ROBOT!» (EN) / «¡ENCUENTRA AL ROBOT!» (ES), una línea.
- Botón HINT (derecha, 56 px, icono «?» + lupa), pausa (izquierda).
- El haz del escáner es el tutorial: en L1 la mano oficial señala «Drag to scan».

## Tipografía

Lilita One (títulos/números) + Nunito (cuerpo), empaquetadas (woff2, sin CDN).
Licencias OFL en `public/licenses/`.

## Regla anti-pixelado

Todo el arte del juego es vectorial generado a resolución real (`crowd.ts`), nunca
bitmaps escalados. Las dos únicas fotos (badge, mano tutorial) se sirven tal cual,
sin reescalar. Nada puede verse pixelado.

## Comparativa lado a lado con Metro Nightmare

Barra: Metro Nightmare (mínimo de calidad Dana Games). Este juego la iguala en:
lectura inmediata (una mirada = qué hay que hacer), volumen y luz en cada personaje,
menú ilustrado e interactivo (el andén con la multitud moviéndose, el robot asomando
la antena, el escáner barriendo de fondo; tocar a un viajero lo hace girarse).
La comparativa medida va en `filtro-visual.md` (sin Metro a mano en esta VM, se
compara contra su listón documentado: 390×844 vertical primero, botones ≥88 px,
textos sin cortes, un protagonista / un peligro / una recompensa por plano).
