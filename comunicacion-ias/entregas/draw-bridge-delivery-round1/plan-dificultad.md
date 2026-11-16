# Plan de dificultad — Draw Bridge Delivery (round 1)

Vinculante (difficulty-and-balancing + level-design). Todos los números de
esta tabla se COMPUTAN desde `src/levels.ts` (`parOf`, `inkOf`); el validador
`tools-local/validate-levels.mjs` los re-chequea en cada corrida.

## Reglas

- **par = round5(longitud óptima × 1,10)**. 3★ = tinta usada ≤ par;
  2★ = ≤ par × 1,25; 1★ = llegar a la bandera.
- **tinta = round5(par × factor)**. El factor se estrecha de 2,0 (enseñanza)
  a 1,15 (L28, precisión).
- **Pendiente máxima en subida: madera 25°, turbo 40°.** La bajada no tiene
  límite. El validador impone el límite en cada segmento de la solución.
- **Enseñar antes que exigir:** cada mecánica aparece primero sola y barata,
  y solo después combinada: viento L6, trampolín L8, turbo L10, puente móvil
  L12, entrega dual L18, tinta saltarina L23.
- **Diente de sierra:** un nivel duro va seguido de un respiro.
- **Anti-trivial:** del L5 en adelante, el puente recto de acantilado a
  acantilado NO gana (muro en medio, pendiente sobre el límite, o más largo
  que la tinta). Excepciones documentadas: los niveles de enseñanza donde el
  puente recto ES la lección (L6 viento, L7, L10/L11 turbo, L18/L19 dual,
  L22 turbo, L24 trayecto, L28 precisión) y el bloque tutorial L1–L4.
- **Monedas fuera de la línea óptima** (25–40 px): recogerlas cuesta tinta o
  riesgo; nunca están sobre la solución.
- **Mecánicas por nivel:** viento = fuerza horizontal en zona (cola +0,0006,
  cara −0,0005); trampolín = restitución 1,3 (el salto sube ~130 px y vuela
  ~200 px); puente móvil = plataforma cinemática 70 px, ±35–45 px, periodo
  2,8–3,6 s (hay que calcular el momento de pulsar PLAY); dual = dos motos
  con 0,7 s de retardo entre ellas, tinta compartida.

## Tabla (computada 16/11)

| N | Nivel | Tinta | Óptima | Par | Tinta disp. | Factor | Mecánica |
|---|---|---|---|---|---|---|---|
| 1 | First Bridge | madera | 74 | 80 | 160 | 2,00 | tutorial |
| 2 | Downhill | madera | 102 | 110 | 220 | 2,00 | tutorial |
| 3 | Uphill Climb | madera | 99 | 110 | 220 | 2,00 | subida 17,7° |
| 4 | Wide Gap | madera | 124 | 135 | 245 | 1,80 | hueco 120 |
| 5 | The Dip | madera | 136 | 150 | 270 | 1,80 | hoyo + muro |
| 6 | Tailwind | madera | 154 | 170 | 305 | 1,80 | **viento (enseña)** |
| 7 | Headwind | madera | 124 | 135 | 245 | 1,80 | viento en contra |
| 8 | Bounce Over | madera | 59 | 65 | 115 | 1,80 | **trampolín (enseña)** |
| 9 | Bounce Across | madera | 68 | 75 | 135 | 1,80 | trampolín + hueco |
| 10 | Turbo Climb | turbo | 139 | 155 | 280 | 1,80 | **turbo (enseña)** 35,5° |
| 11 | Turbo Rush | turbo | 151 | 165 | 280 | 1,70 | turbo + viento |
| 12 | Moving Bridge | madera | 124 | 135 | 245 | 1,80 | **móvil (enseña)** |
| 13 | Moving Wide | madera | 144 | 160 | 270 | 1,70 | móvil + ancho |
| 14 | The Hill | madera | 152 | 170 | 290 | 1,70 | colina + muro |
| 15 | High Road | madera | 184 | 200 | 340 | 1,70 | por encima del muro |
| 16 | Low Road | madera | 175 | 190 | 325 | 1,70 | por debajo del muro |
| 17 | Double Dip | madera | 202 | 220 | 350 | 1,60 | doble hoyo + 2 muros |
| 18 | Two Pizzas | madera | 308 | 340 | 680 | 2,00 | **dual (enseña)** |
| 19 | Two Pizzas in the Wind | madera | 348 | 385 | 730 | 1,90 | dual + viento |
| 20 | Bounce Duo | madera | 227 | 250 | 450 | 1,80 | dual + trampolín |
| 21 | Windy Bridge | madera | 144 | 160 | 255 | 1,60 | móvil + viento |
| 22 | Turbo Ridge | turbo | 178 | 195 | 310 | 1,60 | turbo 30,3° |
| 23 | Bouncy Road | saltarina | 144 | 160 | 270 | 1,70 | **saltarina (enseña)** |
| 24 | The Long Haul | madera | 214 | 235 | 355 | 1,50 | hueco 210 |
| 25 | Turbo Bounce | turbo | 68 | 75 | 120 | 1,60 | turbo + trampolín |
| 26 | Duo on the Move | madera | 278 | 305 | 520 | 1,70 | dual + móvil |
| 27 | Moving Uphill | madera | 147 | 160 | 255 | 1,60 | móvil + subida 24° |
| 28 | Ink Saver | madera | 154 | 170 | 195 | 1,15 | precisión |
| 29 | The Gauntlet | madera | 144 | 160 | 240 | 1,50 | móvil + viento en contra |
| 30 | Grand Delivery | madera | 318 | 350 | 560 | 1,60 | dual + móvil + viento |

## Física (derivada, NO medida — la mide el harness)

Matter, gravedad 0,001 → ~0,278 px/paso² por paso. Empuje madera 0,0011 →
0,306 px/paso² (sube en teoría cualquier pendiente; fricción y baches la
limitan en la práctica a ~25°). Turbo 0,0024 → 0,667 px/paso² (~40°).
Velocidad máxima 4,6 px/paso (madera) / 6,5 (turbo): un nivel de 390 px se
cruza en ~1,5 s. El escalón de 5 px en la meta (la parte superior del puente
queda 5 px por debajo de la plataforma) lo monta el cuerpo con chaflán de
6 px — **a medir en el harness** (es el equivalente al labio de 1 px de la
r2 L10). El rebote del trampolín (restitución 1,3, impacto ~4,6 px/paso →
salida ~−6 px/paso, ápice ~130 px, alcance ~200 px) es **a medir**.

## Veredicto de dificultad

**NO MEDIDO.** La geometría está validada por cómputo (658 checks, 0 fallos),
pero sin corrida de harness ni testers humanos no se afirma que la dificultad
esté bien. La puerta humana (3 testers + prueba de Daniel) sigue pendiente.
