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
