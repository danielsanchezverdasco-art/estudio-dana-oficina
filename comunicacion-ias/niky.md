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

## EN CURSO — Traffic Chaos: New York Rush · jugabilidad · 15/11/2026, 22:19, hora de Madrid
- **Estado ahora mismo:** estoy diseñando la jugabilidad (10 niveles + modo caos + meta). Base leída: prototipo pulido (BRIEF.md + BALANCE.md), reglas y políticas. Skills del kit revisadas: difficulty-and-balancing, evaluating-gameplay-balance, level-design (+ designing-mini-games, game-engagement-ideas, save-systems para la meta).
- **Hecho hasta ahora:** motor de la sim vendorizado y ampliado en `traffic-chaos/scripts/sim/` (patinete: rápido/impaciente/errático; camión: largo/lento/paciente; mezcla por nivel; gridlock y gap de ambulancia por nivel; stall de camión para el caos). Tabla borrador v1 de los 10 niveles escrita (`scripts/sim/levels-draft.ts`): L1 Times Square fácil del prototipo (paciencia 12, cuota 15) → L10 Coney Island (paciencia 7, spawn 1,0→0,55, cuota 34); patinetes entran en L4, camiones en L6.
- **Siguiente paso:** harness de balance (`scripts/balance.ts`): 5 políticas × 10 niveles × 8 seeds + modo caos; retunes si un nivel lo gana una política monótona o el greedy no lo pasa.
- **Después:** `design/LEVELS.md`, `design/levels.ts` (congelada al entregar), `design/CHAOS-MODE.md`, `design/META.md`, `design/BALANCE-REAL.md` con números reales de la sim.
- **Cuánto queda (orientativo):** ~45–60 min para la entrega completa (sim + 5 documentos + verificación final). Sin commit ni push en el repo del juego; solo diseño + datos + sim (el código es del agente de código, el arte del agente de arte).
- **Dónde está el trabajo:** repo privado `danielsanchezverdasco-art/dana-games-juegos`, worktree `~/workspace/wt-traffic-real`, rama `niky/traffic-chaos-real`, carpeta `traffic-chaos/design/` y `traffic-chaos/scripts/`.
- **Regla de Daniel (22:17):** actualizo este estado en GitHub cada vez que cambio de paso; si no está en GitHub, no existe para la oficina.

## Actualización 22:21 — Traffic Chaos jugabilidad: colisión resuelta, PR abierta, sigo con la sim
- **PR:** [#57](https://github.com/danielsanchezverdasco-art/estudio-dana-oficina/pull/57) — rama `niky/traffic-chaos-jugabilidad-1511` → main (solo `niky.md`, estado en vivo).
- **FALLO (regla 22:18, arreglado lo primero):** mi primer commit de estado (22:19) cayó en la rama del agente de arte (`niky/arte-traffic-estado-1511`) porque el clon compartido `~/workspace/estudio-dana-oficina` lo usan varios agentes a la vez y otro cambió de rama entre mi `checkout -b` y mi `commit`. La rama remota mía quedó sin el commit y mi commit viajó en la rama de arte (ya pusheada por él).
- **SOLUCIÓN:** worktree propio `~/workspace/wt-niky-traffic-jugabilidad` con mi rama; cherry-pick del commit a mi rama (`e1eb653`, verificado en remoto) + PR #57. El clon compartido NO se vuelve a usar para `niky.md`. La rama de arte no se toca (su push ya llevaba mi commit; es solo una sección de `niky.md`, sin daño).
- **Estado ahora mismo:** estoy en el balance — escribo el harness de simulación (`traffic-chaos/scripts/balance.ts`, 5 políticas × 10 niveles × 8 seeds + modo caos) y corro la primera pasada de la tabla v1.
- **Cuánto queda (orientativo):** ~40–55 min para la entrega completa (sim + retunes + 5 documentos + verificación final).

## Actualización 22:47 — Traffic Chaos jugabilidad: SIM EN VERDE 10/10 + caos, paso a documentos
- **Estado ahora mismo:** la simulación da VERDE en los 10 niveles y en el modo caos (5 políticas × 16 seeds por nivel). Estoy escribiendo los documentos finales: `design/LEVELS.md`, `design/levels.ts` (tabla congelada para el agente de código), `design/CHAOS-MODE.md`, `design/META.md` + verificación final contra la tabla congelada.
- **Retunes verificados (cada uno con re-sim):** (1) gridlock 5→6 en L5–L10; (2) spawn final +0,1 s en L7–L10 (sin efecto medible, descartado como palanca); (3) spawn +0,3 s en L7–L10 (greedy 9–10/16 → 13–15/16); (4) paciencia L10 7→8 s (cierra el agujero hold-only 1/16 y sube greedy a 15/16). Arreglos del harness: H1 boosts listos (no alimentar colas en rojo), H2 precise con el mismo verde mínimo que greedy.
- **Apertura:** taxi inicial con 3 s de paciencia salvado 16/16 en los 10 niveles (retune del prototipo confirmado).
- **Cuánto queda (orientativo):** ~25–30 min (5 documentos + verificación final + informe).

## ENTREGADO 23:05 — Traffic Chaos jugabilidad: diseño + sim en verde
- **Entrega completa** en `dana-games-juegos`, rama `niky/traffic-chaos-real`, `traffic-chaos/design/` + `traffic-chaos/scripts/` (sin commit ni push ahí; el diseño no se toca más).
- **Veredicto final:** 10/10 niveles VERDE + modo caos VERDE (5 políticas × 16 seeds; `levels.ts` typecheck estricto OK; apertura del taxi 3 s salvada 16/16 en los 10 niveles).
- **Archivos:** `design/LEVELS.md`, `design/levels.ts` (CONGELADA — si hay que cambiar un número, avisar, no editar), `design/CHAOS-MODE.md`, `design/META.md`, `design/BALANCE-REAL.md` (con historial de retunes R1–R5 + colas conocidas), `design/SKILLS.md`, `scripts/balance.ts`, `scripts/sim/` (motor vendorizado + patinete/camión + probes de cada retune).
- **Siguiente:** agente de código importa `design/levels.ts`; agente de arte no depende de mí. Quedo a disposición para retunes con re-sim si el playtest humano contradice la sim.
- **PR de estado:** #57 (solo `niky.md`).
