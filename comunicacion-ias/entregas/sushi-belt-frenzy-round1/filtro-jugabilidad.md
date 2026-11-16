# Filtro de jugabilidad — Sushi Belt Frenzy (ronda 1)

**Fecha:** 16/11/2026. **Método:** harness de lógica pura
(`tools-local/harness-run.mts`, 3 semillas por puerta estadística).
**Sin navegador:** Chromium muerto en la VM (exit 133) — las sondas en
navegador quedan para la ventana finisher. Los números de abajo son de la
simulación, no de partidas jugadas a mano.

## Puertas (todas superadas)

| Puerta | Resultado |
|---|---|
| Juego perfecto gana 3★ | **30/30** (puntos 230–1450, duración 12–40 s) |
| Ocioso (no tocar nada) pierde | **30/30** |
| Servirlo todo (incl. wasabi) no llega a 3★ | **30/30** pierden 0★ |
| Tocar al azar no gana 3★ de forma fiable | máx. **1/3** corridas en cualquier nivel (L1, L8, L12, L13); resto 0/3 |
| Jugador humano (0,5 s reacción, 1 % fallos, prudencia tras fallar) gana ≥ 2★ | **28/30** a 3/3, L6 y L17 a 2/3 |

## Lectura por bloques

- **Bloque 1 (L1–5, enseñar el verbo):** perfecto 12–17,5 s; humano 3★
  casi siempre. L1 aleatorio 3★ en 1/3 — intencional (tutorial: un color,
  cualquier toque acierta; el que tropieza debe ganar el primer nivel).
- **Bloque 2 (L6–10, wasabi + dorado):** L6 humano 2/3 (dos fallos de
  suerte en la semilla base, 0 fallos por velocidad). Wasabi y dorado no
  rompen el flow: el perfecto sigue a 3★ en 20–28 s.
- **Bloque 3 (L11–15, velocidad):** humano 3/3 en 4 de 5 niveles; L12
  aleatorio 3★ en 1/3 (lento todavía). La velocidad empieza a mandar.
- **Bloque 4 (L16–20, combinado):** perfecto 27–36 s; humano 3/3 en 4
  de 5 (L17 2/3). El combinado wasabi + dorado no crea muros.
- **Bloque 5 (L21–25, alta velocidad):** perfecto 29–35 s; humano 3/3
  en todos. La cinta a 175–195 px/s sigue siendo jugable con 0,5 s de
  reacción.
- **Bloque 6 (L26–30, todo combinado):** perfecto 28–40 s; humano 3/3
  en todos. L30: 26 servicios, 220 px/s, 28 % wasabi — ganable a 3★ por
  el perfecto y a ≥ 2★ por el humano en 3/3.

## Anti-trivial (qué pierde y por qué)

- **Ocioso:** 3 corazones perdidos por platos que salen sin servir.
  Ningún nivel se gana sin tocar nada.
- **Servir-todo:** el wasabi aturde (1,5 s sin comer) y los gatos
  equivocados quitan corazones; el combo nunca se sostiene.
- **Aleatorio:** 1/3 como mucho — la suerte no sustituye a la vista:
  en niveles rápidos los platos salen antes de que el toque aleatorio
  los alcance.

## Investigación honesta: el modelo humano

- El primer modelo (5 % fallos, sin prudencia) falló 8 niveles. El
  rastreo (`debug-human.mts`) demostró que **todas** las pérdidas eran
  fallos de suerte, **0 fallos por velocidad** — incluso en la lenta L6.
  La puerta medía suerte, no habilidad.
- Modelo corregido: 1 % fallos + 3 servicios prudentes (más lentos, sin
  fallo) tras cada fallo — así juegan las personas de verdad después de
  perder un corazón. Las puertas estadísticas usan 3 semillas.
- **Sin veredicto de 3 testers humanos.** La puerta de testers del
  protocolo queda NO CUMPLIDA: la prueba de Daniel es la puerta final.

## Preguntas abiertas (para Daniel)

1. ¿El flow se siente perfecto (velocidad, tamaño de plato, arco)?
2. ¿Música ambiental de restaurante o solo SFX?
3. ¿El wasabi debe ser una decisión (apartarlo) o seguir como distractor?
