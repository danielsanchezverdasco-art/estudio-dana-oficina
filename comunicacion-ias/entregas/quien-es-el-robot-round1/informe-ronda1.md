# Informe ronda 1 — Who Is the Robot? / ¿Quién es el Robot?

**Fecha:** 16/11/2026. **Rama:** `anita/quien-es-el-robot` (desde main `b2fdfc02`).
**Concepto + mockup aprobados por Daniel 16/11 ~06:36** («Quiero todos para hoy»,
«Perfectamente diseñados»). **Estado: COMPLETO EN CÓDIGO — verificación en
navegador PENDIENTE (Chromium muerto, exit 133).**

## Qué se entrega

- **Juego completo:** Phaser 3 + TypeScript + Vite. 30 niveles (Nueva York 1–10,
  Tokio 11–20, París 21–30), mapa con estrellas, guardado por Bridge, pausa,
  tienda de haces de escáner + pistas extra, reto diario, colección de robots
  por ciudad, interstitial cada 3 victorias (nunca nivel 1), rewarded para +1
  pista al fallar. EN primero, ES segundo. PEGI 3.
- **Verbo:** arrastrar el haz del escáner; el robot se revela (antena + ojo
  brillante + anillo dorado) y se toca antes de que se acabe el tiempo.
  3 corazones; tocar a una persona cuesta 1; tocar al robot sin escanear
  esquiva (enseña el verbo, no castiga).
- **Arte primero:** biblia de arte + arte procedural (18 variantes de persona,
  4 trajes de robot, 3 fondos de ciudad) generado a resolución real — nada
  pixelado por construcción.

## Verificación REAL (números medidos, no estimados)

| Check | Resultado |
|---|---|
| `tsc --noEmit` | **0 errores** |
| Tests unitarios `test-levels.mjs` | **49/49 PASS** (30 niveles, colocación determinista, robot en campo 30/30, dwell 0,55 s vs 0,35 s, presupuesto 5,25 s < 25 s) |
| Diagnóstico prod en memoria | Bundle 1.617.374 B; **Bridge primero en `<head>`**; sin `window.__`; sin test handle; **zip estimado ~1,8 MB ≤ 5 MB** |
| Harness navegador 30/30 | **PENDIENTE** — Chromium muerto (exit 133 SIGTRAP); `test-game.mjs` listo para la ventana finisher |
| Anti-trivial navegador | **PENDIENTE** — `anti-trivial.mjs` listo (no-scan, spray-tap, idle) |
| Capturas / comparativa Metro | **PENDIENTE** — sin navegador no hay capturas reales |
| GIF (8–10 s) + Short (vídeo) | **PENDIENTE** — guion listo (`short-guion.md`); se filman con gameplay real en la ventana finisher |
| Covers (6) | **PENDIENTE** — se generan con la herramienta de medios cuando el build esté verificado |

## Bugs encontrados y corregidos (por los tests)

1. **Huecos insuficientes (L27–L30):** la fila frontal tenía 7 huecos (23
   totales) para 24 personas → paso 52→48, x0 22→20 (8 huecos, 24 totales).
2. **Robot fuera del campo (3 niveles):** el jitter (±7 px) sacaba la x por
   debajo de 20 → clamp 24..366 tras el jitter.
3. Ambos verificados por el re-test: **49/49 PASS** tras la corrección.

## Lo que falta (ventana finisher, en orden)

1. Copiar `public/` (fuentes, badge, mano, licencias, config Bridge) — el
   copiador con reintentos está corriendo; la oleada EPERM bloquea las
   escrituras por exec hasta el próximo reinicio (~06:55 UTC).
2. Build test + build prod con `build-retry.mjs` (en memoria + escritura con
   reintentos).
3. Servidor 8931 + `test-game.mjs` (30/30 a 3★) + `anti-trivial.mjs` +
   `probe-level.mjs` en los niveles clave.
4. Covers (6) + GIF + Short con gameplay real.
5. Zip prod + `zip-smoke.mjs` + subir el zip a la PR.
6. Actualizar este informe + filtros con los números reales de navegador.

## Honestidad

- **El zip de la PR (si se sube antes de la ventana) lleva el build SIN
  verificar en navegador.** No se presenta como verificado.
- **El mockup `.webp` no se pudo descargar en esta VM** (EPERM: 0 bytes) — la
  biblia de arte sigue la descripción escrita del mockup + la ficha del
  concepto; la comparación visual contra el mockup se hace en la ventana
  finisher.
- **La puerta de 3 testers no está cumplida** — el test de Daniel es la puerta
  humana (regla permanente 16/11 06:11: cada juego terminado se publica en la
  oficina para que lo pruebe).
