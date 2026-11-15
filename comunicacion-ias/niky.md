# Niky · registro

Daniky = Niky.

(Escribe aquí cada entrega con fecha y hora de Madrid, skills usadas y ruta.)

## Herramientas

(Qué tengo y qué me falta: generación de imágenes, navegador para Playgama y YouTube, Node + Phaser 3 + TypeScript, ffmpeg.)

## Autorrevisiones

(APROBADO o DEVUELTO de los juegos de Anita, con fecha, slug, ronda y lo comprobado.)

## Encargo prioritario: Scribble Striker (fútbol de papel) · 15/11/2026, 11:05, hora de Madrid
- **Dónde está:** repo privado `danielsanchezverdasco-art/dana-games-juegos`, carpeta `scribble-striker/` (código Phaser 3 + TypeScript + Vite completo, pruebas, capturas y zip).
- **Léete primero** `scribble-striker/ESTADO.md` (cómo compilar, qué está hecho y qué falta, en orden).
- **Por dónde seguir:** 1) repetir `pruebas/corners.py` tras mover el botón x2 de la pantalla de victoria; 2) escribir `listing.txt` (primero EN, luego ES); 3) comparar lado a lado con Metro (`referencia-metro/`) y aplicar la lección del campo en `manual/CONTROL-CALIDAD.md` (cada equipo en su color, líneas del campo neutras, línea del centro que cuenta y dibujada, nivel «10.000 dólares»); 4) APROBADO de Anita; 5) subir a Playgama según `manual/PUBLICAR-Y-MARKETING.md`.
- **No empieces hasta que Daniel te lo diga.**

## Traffic Chaos: New York Rush — CABLEADO de la tabla congelada · 15/11/2026, 23:19 (EN MARCHA)

**Dónde:** repo `dana-games-juegos`, worktree `~/workspace/wt-traffic-real`, rama `niky/traffic-chaos-real`, carpeta `traffic-chaos/`. Sin commit ni push en ese repo (por orden: la entrega es el informe al coordinador).

**Qué estoy haciendo:** cablear en el motor los campos de la tabla congelada (`design/levels.ts`, sim-verificada n=16, 10/10 VERDE) que el motor no consumía: `speedMult`, `mix` (patinetes L4, camiones L6), `ambulanceMinGap`, `gridlockQueue` (5 en L1–L4, 6 en L5–L10), multiplicadores de paciencia patinete/camión, `stall*` (camión atascado) y la rampa del caos congelada `chaosDifficultyAt()` en lugar de `CHAOS_BASE` + `chaosLevelAt`.

**Hecho (23:19):**
- `src/rules/traffic-config.ts`: `Difficulty` ampliada a los 15 campos de la tabla; SPEEDS/SIZES/POINTS alineados con la sim (patinete 115 px/s, 30 px, 15 pts; camión 84 px, 20 pts); `CHAOS_BASE` y constantes viejas del caos eliminadas.
- `src/design/levels.ts`: los 10 niveles llevan ya los 15 campos, verificados iguales a la tabla congelada; re-exporta `chaosDifficultyAt()`.
- `src/rules/traffic.ts`: motor portado desde la sim vendorizada — mix por nivel, velocidad ×`speedMult`, gap de ambulancia por nivel, gridlock por nivel, paciencia ×0,6 patinete / ×1,5 camión, weave del patinete por RNG (0,6–1,4×), camión atascado, rampa del caos re-evaluada en cada paso.
- `src/sim/policies.ts`: H1+H2 de la sim (boosts solo cuando ayudan, precise con verde mínimo 2,0 s) — son las políticas con las que se verificó la tabla.
- Tests nuevos `src/rules/wiring.test.ts`: 16 tests, uno por campo cableado (paridad con la tabla, gridlock 6 en L5, patinete en L4, camión en L6, gap de ambulancia, stall, rampa del caos).
- **Verificación: `npm test` 77/77 en verde (61 anteriores intactos, 0 relajados), `npx tsc --noEmit` exit 0.**

**Falta (orientativo ~15–20 min):** builds Playgama + YouTube y `precheck` en ambos (corriendo ahora mismo, ~23:19) → sección CABLEADO en `traffic-chaos/GAME.md` (qué se cableó, qué tests lo demuestran, qué queda sin cablear) → informe final al coordinador.

## Traffic Chaos: New York Rush — CABLEADO TERMINADO · 15/11/2026, 23:26

**TERMINADO.** Todo cableado y verificado en verde, sin commit ni push en `dana-games-juegos` (por orden: la entrega es el informe al coordinador).

**Verificación final:** `npm test` **77/77** (61 anteriores intactos, 0 relajados + 16 nuevos de cableado) · `npx tsc --noEmit` exit 0 · `build:playgama` exit 0 (dist 4,07 MiB) · `build:youtube` exit 0 · `precheck` playgama y youtube **0 FAIL, 1 WARN** (el heredado del template).

**Qué quedó cableado:** velocidad ×`speedMult` (L1 ×1 → L10 ×1,2, caos ×1,3), mezcla por nivel (patinetes L4, camiones L6), gap de ambulancia por nivel (8→6→5→4 s), gridlock 5 en L1–L4 y 6 en L5–L10, paciencia patinete ×0,6 / camión ×1,5, camión atascado en caos desde 90 s (35%, 6 s), y rampa del caos congelada `chaosDifficultyAt()` en lugar de `CHAOS_BASE`. Documentado en `traffic-chaos/GAME.md`, sección CABLEADO.

**Pendiente (honesto):** sin señal visual del camión atascado (humo/triángulo — toca arte/UI) y sin re-simulación n=16 del motor de runtime (la validación completa se corrió contra la sim; decisión del agente de jugabilidad).
