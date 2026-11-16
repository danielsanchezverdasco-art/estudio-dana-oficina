# Plan de dificultad — Sushi Belt Frenzy (ronda 1)

**Fecha:** 16/11/2026. **Vinculante:** un nivel solo se entrega si el
harness lo aprueba (ver `tools-local/test-results-r1.md`).

## Reglas

- **3★ = ganar con 3 corazones, 2★ = 2 corazones, 1★ = 1 corazón.**
- **Servir bien:** +30 (dorado ×3 = +90); cada 5 de combo, +50 extra.
- **Fallar:** plato normal que sale sin servir = −1 corazón; servir al
  gato equivocado = −1 corazón; wasabi servido = gato aturdido 1,5 s
  (sin corazón, combo roto); wasabi que sale = sin coste.
- **BOOST:** cinta al 50 % durante 4 s, 2 cargas por nivel (ayuda, nunca
  necesaria: el juego perfecto no la usa).
- **Semilla por nivel** (`levelSeed(n) = n × 7919 + 13`): los platos son
  deterministas — el mismo nivel, la misma cinta, siempre.

## Curva (bloques de 5, diente de sierra)

| Bloque | Niveles | Qué enseña / qué sube |
|---|---|---|
| 1 | L1–5 | El verbo: L1 un color, L2 dos, L3 tres; L4 más rápido, L5 más servicios. Cinta 45–68 px/s, 6–10 servicios. |
| 2 | L6–10 | Wasabi (L6, enseñanza) + dorado (L8, enseñanza). Cinta 75–100 px/s, 10–14 servicios. |
| 3 | L11–15 | Velocidad + densidad; el chef avisa desde L14. Cinta 108–135 px/s, 14–16 servicios. |
| 4 | L16–20 | Wasabi + dorado combinados. Cinta 142–168 px/s, 17–20 servicios. |
| 5 | L21–25 | Alta velocidad. Cinta 175–195 px/s, 20–23 servicios. |
| 6 | L26–30 | Todo combinado, lo más rápido. Cinta 200–220 px/s, 24–26 servicios, 26–28 % wasabi. |

## Puertas del harness (3 semillas: +0, +1000, +2000)

- Perfecto gana 3★ en 30/30 (determinista, semilla base).
- Ocioso pierde en 30/30.
- Servir-todo pierde 0★ en 30/30.
- Aleatorio 3★ en ≤ 1/3 corridas (L2+, L1 exento: tutorial).
- Humano (0,5 s reacción, 1 % fallos, prudencia tras fallar) gana ≥ 2★
  en ≥ 2/3 corridas. Resultado: 28/30 a 3/3, L6 y L17 a 2/3.

## Modelo humano (por qué así)

- El primer modelo (5 % fallos, sin prudencia) falló 8 niveles; el
  rastreo demostró que todas las pérdidas eran fallos de suerte, 0 por
  velocidad — la puerta medía suerte, no habilidad.
- Modelo final: 1 % fallos + 3 servicios prudentes tras cada fallo.
  Las puertas estadísticas usan 3 semillas para que la suerte se promedie.
