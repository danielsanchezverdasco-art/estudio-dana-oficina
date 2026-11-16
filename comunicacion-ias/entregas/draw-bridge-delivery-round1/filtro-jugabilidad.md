# Filtro jugabilidad — Draw Bridge Delivery (round 1)

Estado: **GEOMETRÍA VALIDADA, DINÁMICA SIN MEDIR.** Chromium muerto
(exit 133) en las 3 ventanas finisher; la corrida del harness está pendiente.

## Validado por cómputo (16/11, números reales)

`tools-local/validate-levels.mjs`: **658 checks, 0 fallos.**

- 30/30 niveles con par = round5(óptima × 1,10) y tinta = round5(par × factor).
- 30/30 soluciones dentro de la banda 85–100 % del par.
- 30/30 segmentos dentro del límite de subida (madera 25°, turbo 40°).
- 30/30 monedas a ≤ 50 px de la solución (o ≤ 120 px del arco de rebote).
- 17/17 niveles no-exentos pasan el anti-trivial (el puente recto pierde);
  13 niveles exentos documentados (tutorial + enseñanza).
- 0 soluciones cruzan un muro; 0 monedas dentro de un muro.
- 6/6 niveles móviles: los segmentos se encuentran con la plataforma en
  reposo. 5/5 niveles duales: una ruta por meta. 4/4 niveles de trampolín:
  la solución termina en el trampolín.

Primera corrida: 23 fallos → corregidos (L5/L14/L15/L16/L17 rediseñados,
L24 dentro del marco, monedas móviles a y=575, cheques duales y de arco).

## Sin medir (el harness debe medirlo)

| Nº | Qué | Por qué importa | Cómo se mide |
|---|---|---|---|
| 1 | **Escalón de 5 px en la meta** | Si la moto se atasca al subir del puente a la plataforma, el juego está roto en los 30 niveles | Replay de la solución en L1: ¿llega a la bandera? |
| 2 | **Límite real de subida (madera)** | La teoría dice ~25°; la fricción y los baches pueden bajarlo | Replay en L3 (17,7°) y L14 (21,3°): ¿sube sin atascarse? |
| 3 | **Rebote del trampolín** | Restitución 1,3, impacto ~4,6 px/paso → ápice ~130 px, alcance ~200 px | Replay en L8/L9/L25: ¿supera el muro y cae en la meta? |
| 4 | **Timing del puente móvil** | El jugador pulsa PLAY y la plataforma debe estar alineada | Replay en L12 con PLAY en t=0, t=900 ms, t=1800 ms |
| 5 | **Turbo en pendiente** | 35,5° (L10) y 30,3° (L22) con empuje ×2,2 | Replay en L10/L22: ¿sube? ¿a qué velocidad? |
| 6 | **Viento** | Cola +0,0006 / cara −0,0005: ¿se nota sin romper el nivel? | Replay en L6/L7: tiempo de cruce con y sin viento |
| 7 | **Dual (0,7 s de retardo)** | ¿La segunda moto no choca con la primera ni se queda atrás? | Replay en L18: ¿llegan las dos? |
| 8 | **Atasco (STUCK 2,5 s)** | ¿El detector no dispara mientras la moto espera en el puente móvil? | Replay en L12: la moto en la plataforma no debe fallar |
| 9 | **Monedas** | ¿El radio de 32 px las recoge al cruzar por la solución? | Replay con monedas en L1/L8/L12 |
| 10 | **Timeout 60 s** | ¿Ningún nivel legítimo supera los 60 s de física lenta? | Tiempos de pared por nivel en la corrida |

## Veredicto de jugabilidad

**NO MEDIDO.** La geometría es correcta por cómputo; la dinámica (los 10
puntos de arriba) solo la prueba el harness en navegador + los 3 testers +
Daniel. Nada de lo anterior se presenta como verificado.
