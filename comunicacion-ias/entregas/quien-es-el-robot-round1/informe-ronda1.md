# Informe ronda 1 — Who Is the Robot? / ¿Quién es el Robot?

**Fecha:** 16/11/2026. **Rama:** `anita/quien-es-el-robot` (desde main `b2fdfc02`).
**Concepto + mockup aprobados por Daniel 16/11 ~06:36** («Quiero todos para hoy»,
«Perfectamente diseñados»). **Estado: COMPLETO EN CÓDIGO + ZIP VERIFICADO —
verificación en navegador PENDIENTE (Chromium muerto, exit 133).**

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
| Diagnóstico prod en memoria | Bundle 1.616.865 B; **Bridge primero en `<head>`**; sin `window.__`; sin test handle; **zip 633.716 B ≤ 5 MB** |
| **Zip prod v2** | **633.716 B, sha256 `de6aa2bc977f55685c33d4de0a495244e318e6c54cacadd042920d99265df116`, 14 entradas, testzip sin corrupción**; Bridge primero; sin `__test`/`__game`/`window.__` en el JS (v1 tenía strings `__test*` de los hooks — corregido guardando el bloque con `__TEST_BUILD__`, re-verificado) |
| **Covers (4)** | **Verificadas a la vista:** 800×800 + 1080×1920 con badge oficial (esquina superior), 1080×1920 + 1920×1080 `-youtube` sin badge; 2x de tamaño en píxeles, ratios exactos; la vertical-youtube y la landscape-youtube revisadas; el robot de la cover lleva 2 antenas en la landscape (arte de marketing, no del juego) |
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

1. **Verificación en navegador** (Chromium vivo): servidor 8931 +
   `test-game.mjs` (30/30 a 3★) + `anti-trivial.mjs` (no-scan, spray-tap,
   idle) + `probe-level.mjs` en L10/L20/L30. **Sin esto, el juego NO está
   verificado como jugable — el zip lleva código sin probar en navegador.**
2. Capturas reales 390×844 (L1/L15/L30) + comparativa lado a lado con Metro
   Nightmare + touch test (centro + 4 esquinas + fuera por botón).
3. GIF (8–10 s, termina en victoria) + Short (vídeo 1080×1920, guion listo)
   con gameplay REAL del build de test.
4. Cover `cover-800x800-youtube.webp` (misma arte sin badge) para completar
   el set de 6 — edición trivial de la square.
5. Actualizar este informe + filtros con los números reales de navegador.

**Nota EPERM (cómo se entregó sin escrituras locales):** la oleada EPERM
bloquea las escrituras por exec en esta VM (copias a 0 bytes, spinner de
reintentos 600 s sin un solo byte). El trabajo se entregó por vías que no
escriben en disco: código y docs por las herramientas de fichero; `public/`
por reuso de blobs Git por SHA desde la rama Ramp r2; zip construido
enteramente en memoria (vite + `public/` por API de GitHub) y subido por
stdin a la API; covers por la herramienta de medios. El zip v2 está
verificado por API (contenidos, tamaños, Bridge primero, sin leftovers).

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
