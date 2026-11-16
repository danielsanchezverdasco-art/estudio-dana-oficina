# Filtro de jugabilidad — Who Is the Robot? (ronda 1)

**Método:** tests unitarios reales sobre `levels.ts` (`tools-local/test-levels.mjs`,
Node 24 con type-stripping, sin navegador) + revisión del código de `GameScene.ts`.
La verificación en navegador (harness 30/30) está PENDIENTE — Chromium muerto
(exit 133). Los números de abajo son REALES y medidos, no estimados.

## Números reales (test-levels.mjs — 49/49 PASS, 16/11 ~06:10 UTC)

| Check | Medido |
|---|---|
| Niveles | 30 (NY 10 / Tokio 10 / París 10) |
| Multitud | 6 → 24 personas por nivel |
| Temporizador | 45 s → 25 s |
| Colocación determinista | 30/30 — mismo nivel, misma semilla, misma colocación |
| Sin colisiones de hueco | 30/30 — cada persona tiene su hueco único |
| Robot dentro del campo | 30/30 — x 24..366, y 240..700 (siempre alcanzable por el haz) |
| Señuelos exactos | 30/30 — el nº de señuelos con brillo es el del diseño |
| Enseñanza por orden | L1–L2 sin señuelos; barajar empieza L11; deriva empieza L21 |
| Dwell de revelado | Barrido lento (200 px/s): 0,55 s ≥ 0,35 s → REVELA ✓ |
| Barrido rápido no revela | Barrido rápido (400 px/s): 0,28 s < 0,35 s → NO revela (por diseño: hay que escanear con calma) |
| Presupuesto de tiempo | 2 barridos lentos + revelado + toque = 5,25 s < 25 s (temporizador más corto) |
| Monedas | 20 + segundos restantes, tope 45 |
| Reto diario | Cicla 1..30 en 400 días probados |
| `tsc --noEmit` | 0 errores |

## Anti-trivial (por código + tests; el harness de navegador lo confirmará)

1. **Ganar sin escanear es imposible** — tocar al robot sin revelar: esquiva
   (`handleTap` → `dodge` + toast «Scan it first!»), sin victoria y sin perder
   corazón. El verbo es obligatorio.
2. **Machacar pierde** — cada toque a una persona = −1 corazón; 3 fallos = derrota.
3. **Estar quieto pierde** — el temporizador corre siempre; 25–45 s por nivel.
4. **El barrido rápido no sirve** — 0,28 s de dwell < 0,35 s de revelado (medido).
5. **El robot siempre es alcanzable** — dentro del campo 30/30 (medido).

## Dificultad (veredicto provisional)

- **L1–L5:** enseñanza (6–12 personas, 35–45 s) — primer intento esperado ~90 %.
- **L6–L10:** rampa NY (12–16 personas, 30–35 s, 3–4 señuelos).
- **L11–L20:** giro Tokio — la multitud baraja sitios cada ~4 s.
- **L21–L30:** giro París — el robot se mueve (±30 px, seno lento) + barajar.
- **Estrellas:** por corazones restantes (3/2/1). Sin par de tinta: el recurso es
  el tiempo, no la tinta.

## PENDIENTE de navegador (ventana finisher)

- Harness `test-game.mjs`: 30/30 niveles ganados a 3★ por replay de la solución.
- Spray-tap: 3 toques aleatorios a personas → derrota (sin ganar por suerte).
- No-scan: tocar al robot sin escanear → esquiva, sin victoria.
- Probar L10/L20/L30 a mano (3 testers, puerta sin cumplir — el test de Daniel
  es la puerta humana).
- Veredicto de dificultad medido (primer intento por bloque de 5).
