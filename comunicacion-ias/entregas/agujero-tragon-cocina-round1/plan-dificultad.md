# Plan de dificultad — Kitchen Hole round 1

## Reglas (difficulty-and-balancing)

1. **Un juguete nuevo por bloque** (level-design): L1 verbo · L5
   muebles (escalera de tamaño) · L6 perro (robo 10) · L11 dorados
   (×3, 8 s) · L16 móviles (ratón huye, manzana rueda) · L21 nevera
   (come primero lo pequeño) · L26–30 todo combinado.
2. **La escalera de crecimiento es estructural:** en cada nivel, la suma
   del crecimiento de todos los objetos salvo la nevera supera el
   umbral de la nevera (34,3 de radio) con margen. Sin escalera, el
   nivel es imposible por construcción — el harness lo demostró en
   L5/L7/L21 y se corrigió añadiendo objetos-escalera.
3. **El temporizador aprieta, no ahoga:** 60 + floor((n−1)/2) s
   (L1 60 s → L30 74 s). La ruta precisa limpia en 1,4–5,0 s; un humano
   tarda mucho más (medir en el playtest).
4. **La mascota nunca cuesta la victoria:** roba monedas (economía de
   tienda), no estrellas ni tiempo. Es una amenaza de puntuación, no de
   derrota — regla de equidad.
5. **3★ exige los dorados:** 3 estrellas = 15+ s restantes Y todos los
   dorados comidos. Los dorados nunca bloquean la victoria (un jugador
   rápido no espera a que aparezcan).

## Anti-trivial (harness tools-local/sim.ts, 5 políticas)

| Política | Resultado | Lectura |
|---|---|---|
| idle (no toca el agujero) | 0/30 | No hacer nada pierde |
| sweeper (barrido en filas) | 0/30 | Machacar un patrón pierde |
| greedy (comestible más cercano) | 30/30 | El verbo central funciona |
| solution (ruta planificada) | 30/30 | Todos los niveles son ganables |
| solution3 (ruta dorada, 3★) | 30/30, 30 a 3★ | 3★ es alcanzable en todos |

Ratio exploratorio (monedas solution / mejor monótona): 1,4×–9,1× en
L1–L7; grande desde L8 (el sweeper gana ≤1 moneda). Explorar paga.

## Veredicto: NO MEDIDO

Las políticas precisas no son humanas. Falta el playtest humano con
3 testers (plantilla playtest-report): niveles 1/6/11/16/21/30,
tiempo hasta la primera tragada, tiempo hasta ganar, estrellas,
derrotas por tiempo, y si las neveras se sienten justas. Hasta entonces:
ganable y no trivial por construcción, dificultad sin medir.
