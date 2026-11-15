# Plan de dificultad — Ramp Physics r2

**Juego:** Ramp Physics (slug `ramp-physics`). **Fase:** r2, mockups + plan (sin reconstruir).
**Fecha:** 2026-11-15. Autora: Anita (Dana Games).
**Origen:** veredicto de Daniel sobre la r1 (15/11 ~19:04): «el concepto está genial,
pero el visual es muy pobre, se ve feo como pixelado sin calidad, los niveles son muy
fáciles». Este plan ataca la segunda mitad del veredicto; la primera la atacan los
3 mockups de `informe-r2-mockups.md`.
**Skills aplicadas (solo lista de Grok + análisis de competencia):**
`difficulty-and-balancing`, `level-design`, `game-feel-and-juice`,
`onboarding-and-teaching`, `playtest-report`, `art-direction-and-readability`,
`directing-game-visuals`.

## 1. Diagnóstico de la r1 (hechos, no opiniones)

Datos de `informe-ronda1.md` (PR #14, 56/56 checks, 30/30 niveles ganados):

- **29/30 niveles a 3 estrellas en la primera pasada de soluciones.** Solo L8 quedó
  a 2 estrellas, y se «arregló» subiendo su par de 165 a 180 (la solución usa 173 px).
  Si la solución de referencia consigue 3 estrellas en 29 de 30 niveles, los pares
  son generosos: la estrella no exige precisión, solo ganar.
- **Peligros secuestrados en los arcos tardíos:** hoyos 1–10, ventiladores 11–20,
  dinamita + portales 21–30. Un jugador que abandona en el nivel 8 no ha visto
  jamás un ventilador ni una dinamita: el juego se vende como fácil porque sus
  dos mecánicas con carácter llegan tarde.
- **Sin test de trivialidad:** el harness reproduce la solución de cada nivel y
  gana, pero nada comprueba que una rampa recta ingenua NO gane, ni que el par
  esté ajustado a la solución óptima. Un nivel que se gana con una línea recta
  es un nivel que no existe como puzzle.
- **L8 es el modelo, no la excepción:** tras el ajuste, la solución óptima usa
  173/180 px del par = **96 %**. Ese es el listón: la solución óptima debe rozar
  el par, no flotar por debajo de él.

## 2. Reglas nuevas (invariantes, medibles)

De `difficulty-and-balancing`: ninguna opción domina; el equilibrio se codifica
como invariantes y se verifica por simulación, no por intuición.

1. **Par = solución óptima × 1,10**, redondeado a múltiplos de 5 px. El 10 % de
   holgura es el margen de error humano, no un regalo.
2. **3 estrellas exige precisión real:** 3★ = tinta usada ≤ par; 2★ = ≤ par × 1,25;
   1★ = llegar a la bandera. Con la regla 1, 3★ significa resolver a menos del
   10 % de la solución óptima.
3. **Banda de ajuste:** la solución óptima debe usar entre el **85 % y el 100 %**
   del par en todos los niveles. Por debajo del 85 %, el par se aprieta
   (el nivel es trivial); por encima del 100 %, el par está mal medido.
4. **Ninguna tinta domina:** en cada bloque de 5 niveles, cada tinta (steel,
   bouncy, boost) es la opción óptima en al menos 1 nivel. Si una tinta gana en
   los 5, el bloque está roto.
5. **Ningún nivel se gana con 0 px dibujados ni con una sola rampa recta** desde
   el nivel 6 en adelante (test de la rampa perezosa, §5).
6. **Peligros desde pronto:** ventilador desde el nivel 6, dinamita desde el 12,
   portal desde el 18 — cada uno con su nivel de enseñanza propio antes de
   combinarse (r1: ventilador 11, dinamita y portal 21).

## 3. Curva de dificultad por bloques de 5 niveles

| Bloque | Contenido | Qué se aprende / se exige | Par (regla 1) |
|---|---|---|---|
| 1–5 | Hoyos. Solo steel. | Dibujar, lanzar, caer con gracia. Tutorial con la mano oficial en L1. | Generoso pero con techo: 3★ = ≤ par |
| 6–10 | Hoyo + bounce. **Ventilador desde L6** (enseñanza) y L9 (peligro real). | El rebote como herramienta; el viento desvía, no solo empuja. | Óptima × 1,10 |
| 11–15 | Ventiladores como mecánica central: deriva, paredes, corrientes cruzadas. | Planear la trayectoria en el aire; el viento es aliado o enemigo según el ángulo. | Óptima × 1,10 |
| 16–20 | Ventilador + **dinamita desde L12** (enseñanza) y L17 (cadena de 2). | La explosión como impulso: lanzar al muñeco con la onda, no solo evitarla. | Óptima × 1,10 |
| 21–25 | Dinamita + **portal desde L18** (enseñanza) y L21 (gravedad invertida). | Caídas por el techo, portales en cadena, timing con el ventilador. | Óptima × 1,10 |
| 26–30 | Todo combinado. Techo de precisión. | Soluciones de 2+ tramos, tinta contada al px, sin margen para el despiste. | Óptima × 1,10, banda 85–100 % estricta |

**Objetivos de tasa de éxito (primer intento, tester competente, medido en playtest):**
bloque 1–5 ≥ 80 %; 6–10 60–80 %; 11–15 40–60 %; 16–20 30–50 %; 21–25 20–40 %;
26–30 10–30 %. **3 estrellas en primer intento ≤ 40 % del total.** Si un bloque
supera su banda por arriba, se aprietan los pares; si la supera por abajo, se
revisa la enseñanza (el nivel debe ser difícil, no confuso).

## 4. Umbrales de 3 estrellas (cómo se fijan, nivel a nivel)

1. El diseñador juega su solución óptima y el harness la reproduce y mide la
   tinta exacta (px).
2. Par = óptima × 1,10, redondeado a múltiplo de 5.
3. Se verifica la banda (§2 regla 3). L8 de la r1 (173/180 = 96 %) ya cumple.
4. Las monedas se colocan FUERA de la línea recta óptima: coger las 3 monedas
   debe costar tinta o riesgo. Una moneda en la trayectoria gratis no es una
   decisión, es decoración.
5. El cofre cada 3 niveles y la tienda (Extra Ink) no tocan los pares: comprar
   tinta es una ayuda, no un atajo al 3★.

## 5. Cómo se verifica que un nivel no sea trivial

**Automático (harness existente, `tools-local/probe-level`, antes de cada entrega):**

- **(a) Solución óptima gana** en todos los niveles (ya existe en r1).
- **(b) Test de la rampa perezosa:** una sola rampa recta desde el spawn hasta la
  bandera NO debe ganar ningún nivel del 6 en adelante. Si gana, el nivel se
  rediseña (mover la bandera, añadir un muro, un ventilador o un hueco).
- **(c) Test de par:** la solución óptima usa 85–100 % del par en todos los
  niveles. Fuera de banda = par mal puesto.
- **(d) Test de dominancia de tinta:** en cada bloque de 5, cada tinta es óptima
  en ≥ 1 nivel. Si una tinta no es óptima en ningún nivel del bloque, sobra o
  falta un nivel para ella.
- **(e) Test de 0 px:** ningún nivel se gana sin dibujar.

**Humano (skill `playtest-report`, puerta antes de que Daniel pruebe nada):**

- 3 testers, primera sesión, sin leer nada (onboarding = 0 segundos de lectura,
  análisis de competencia §2.3). Se mide: tasa de victoria en primer intento por
  bloque (§3), % de 3★ en primer intento (≤ 40 %), reintento < 2 s tras perder,
  y la pregunta «¿quieres reintentarlo?» — debe ser sí en 3/3 tras un fallo
  justo, no tras un fallo confuso.
- Un nivel que 3/3 resuelven a la primera con 3★ es trivial: se aprieta el par
  o se rediseña. Un nivel que 0/3 resuelven en 5 intentos es confuso o injusto:
  se revisa la enseñanza, no se baja el listón.

## 6. Game feel: el momento de satisfacción por acción

De `game-feel-and-juice` (análisis §2.3: «el juice es un gran momento por
acción») y del análisis de competencia §4: en la r1 el juice no estaba diseñado.
Presupuesto de feedback por acción (banda media-alta; lo más grande solo para
la victoria, nunca para lo rutinario):

| Acción | Feedback (acotado) |
|---|---|
| Dibujar | Trazo con punta luminosa + sonido de lápiz suave; nada más. |
| Lanzar | Whoosh + polvo en el spawn + leve sacudida de cámara (80 ms). |
| Rebote (bouncy) | Squash del muñeco + anillo expansivo + «boing» corto. |
| Ventilador | Estelas de aire visibles + el muñeco se inclina con el viento. |
| Dinamita | Hit-stop 80 ms + sacudida + partículas + «boom» grave. |
| Portal | Destello + estiramiento del muñeco al cruzar (sin mareo). |
| Victoria | Confeti + slow-mo 0,3 s + bandera ondeando + estrellas que caen una a una. |
| Derrota (softlock) | El muñeco se queda quieto, fundido a gris, «¡Inténtalo de nuevo!» en < 2 s. |

Regla: primero el feel (latencia, física consistente), después el juice. Sin
efectos, el lanzamiento debe sentirse bien; con efectos, debe sentirse genial.

## 7. Qué cambia respecto a la r1 (resumen)

- Pares: de generosos (29/30 a 3★) a **óptima × 1,10 con banda 85–100 %**.
- Peligros: ventilador del 11 → **6**; dinamita del 21 → **12**; portal del 21 → **18**.
- 3★: de «ganar» a **«resolver a menos del 10 % de la solución óptima»**.
- Verificación: se añaden el test de la rampa perezosa, el test de par, el test
  de dominancia de tinta y el playtest humano con tasas objetivo por bloque.
- Juice: de no diseñado a **un momento de satisfacción por acción, acotado**.
- El arte (mockups) y la dificultad (este plan) se construyen juntos en la r2:
  el fondo denso no es decoración, es el tablero donde se lee el puzzle.
