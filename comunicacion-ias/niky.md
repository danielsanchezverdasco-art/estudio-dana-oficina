# Niky · registro

Daniky = Niky.

(Escribe aquí cada entrega con fecha y hora de Madrid, skills usadas y ruta.)

## Herramientas

(Qué tengo y qué me falta: generación de imágenes, navegador para Playgama y YouTube, Node + Phaser 3 + TypeScript, ffmpeg.)

## Autorrevisiones

(APROBADO o DEVUELTO de los juegos de Anita, con fecha, slug, ronda y lo comprobado.)

## 🔴 EN VIVO — Traffic Chaos: New York Rush · CÓDIGO del juego real · 15/11/2026, 22:20, hora de Madrid

**Estado ahora mismo:** estoy programando el juego real (portando la simulación del prototipo a la plantilla Phaser 3 + TS + Vite, con niveles, modo caos, meta tycoon, tutorial y plataforma). Daniel lo FORZÓ: todo el poder en este juego.

**Avance (actualizado 22:20):**
- ✅ Leída la base: plantilla (`README`, `config`, `platform`, `audio`, `juice`, `ui`, escenas), prototipo pulido (reglas, tutorial, balance, políticas), dirección de arte, teardown (PR #32) y kit de skills.
- ✅ `npm install` en `traffic-chaos/` (80 paquetes).
- ✅ Reglas del prototipo portadas a `src/rules/` + `src/sim/policies.ts` (sin `localStorage`: la persistencia del tutorial pasa a `bridge.storage`).
- ✅ 7 WAV del prototipo copiados a `public/sfx/` (el agente de audio entrega los definitivos).
- 🔄 AHORA: constantes de caos en `traffic-config.ts` (patinetes erráticos, camiones que bloquean, ambulancias seguidas) — siguiente: extender `traffic.ts` con el modo caos.
- ⏳ Pendiente: `design/levels.ts` (10 barrios), escenas `Game`/`Menu`/`Levels`/`Result`, meta tycoon + reto diario, i18n EN/ES, tests nuevos (niveles y caos), `tsc`, `build:playgama` + `build:youtube`, `precheck.mjs` 0 FAIL.

**Cuánto queda (orientativo, no promesa):** ~2 h más para el juego completo verificado (hacia ~00:30). Quedan fuera de mi parte: arte PNG real (agente de arte), números finales de niveles (agente de jugabilidad — yo pongo una tabla v1 jugable y la marco para su revisión), QA en móvil de Daniel.

**Dónde está el código:** repo privado `danielsanchezverdasco-art/dana-games-juegos`, worktree `~/workspace/wt-traffic-real`, rama `niky/traffic-chaos-real`, carpeta `traffic-chaos/`. Sin commit ni push allí por orden (la entrega es el informe al coordinador).
**Ruta de entrega de este estado:** esta constancia en rama `niky/traffic-codigo-1511` + PR. Actualizo aquí cada vez que cambio de paso.

## Encargo prioritario: Scribble Striker (fútbol de papel) · 15/11/2026, 11:05, hora de Madrid
- **Dónde está:** repo privado `danielsanchezverdasco-art/dana-games-juegos`, carpeta `scribble-striker/` (código Phaser 3 + TypeScript + Vite completo, pruebas, capturas y zip).
- **Léete primero** `scribble-striker/ESTADO.md` (cómo compilar, qué está hecho y qué falta, en orden).
- **Por dónde seguir:** 1) repetir `pruebas/corners.py` tras mover el botón x2 de la pantalla de victoria; 2) escribir `listing.txt` (primero EN, luego ES); 3) comparar lado a lado con Metro (`referencia-metro/`) y aplicar la lección del campo en `manual/CONTROL-CALIDAD.md` (cada equipo en su color, líneas del campo neutras, línea del centro que cuenta y dibujada, nivel «10.000 dólares»); 4) APROBADO de Anita; 5) subir a Playgama según `manual/PUBLICAR-Y-MARKETING.md`.
- **No empieces hasta que Daniel te lo diga.**

## Regla: actualizaciones en vivo en GitHub · 15/11/2026, 22:17
- **Regla nueva de Daniel (15/11 22:17):** los agentes de Anita y los de Dani tienen que dar actualizaciones EN GITHUB de cómo van y qué hacen en cada momento. Cada agente actualiza en vivo en GitHub (en su archivo anita.md/niky.md y en su issue) lo que está haciendo ahora mismo: «estoy diseñando los assets», «estoy diseñando la jugabilidad», «estoy en la QA», y así con cada parte. Y que más o menos se CALCULE CUÁNTO QUEDA (estimación orientativa, nunca promesa exacta). La oficina/torre lee GitHub en vivo, así que si no está en GitHub, Daniel no lo ve avanzar. Sin actualización en GitHub, el trabajo no existe para la oficina.
- **Entrega:** comentario en la issue [ORDEN] #40, ID 6901517666, creado 15/11/2026 22:18:29 hora de Madrid, verificado por API (GET 200, autor danielsanchezverdasco-art, cuerpo íntegro).

## EN CURSO — Traffic Chaos: New York Rush · jugabilidad · 15/11/2026, 22:19, hora de Madrid
- **Estado ahora mismo:** estoy diseñando la jugabilidad (10 niveles + modo caos + meta). Base leída: prototipo pulido (BRIEF.md + BALANCE.md), reglas y políticas. Skills del kit revisadas: difficulty-and-balancing, evaluating-gameplay-balance, level-design (+ designing-mini-games, game-engagement-ideas, save-systems para la meta).
- **Hecho hasta ahora:** motor de la sim vendorizado y ampliado en `traffic-chaos/scripts/sim/` (patinete: rápido/impaciente/errático; camión: largo/lento/paciente; mezcla por nivel; gridlock y gap de ambulancia por nivel; stall de camión para el caos). Tabla borrador v1 de los 10 niveles escrita (`scripts/sim/levels-draft.ts`): L1 Times Square fácil del prototipo (paciencia 12, cuota 15) → L10 Coney Island (paciencia 7, spawn 1,0→0,55, cuota 34); patinetes entran en L4, camiones en L6.
- **Siguiente paso:** harness de balance (`scripts/balance.ts`): 5 políticas × 10 niveles × 8 seeds + modo caos; retunes si un nivel lo gana una política monótona o el greedy no lo pasa.
- **Después:** `design/LEVELS.md`, `design/levels.ts` (congelada al entregar), `design/CHAOS-MODE.md`, `design/META.md`, `design/BALANCE-REAL.md` con números reales de la sim.
- **Cuánto queda (orientativo):** ~45–60 min para la entrega completa (sim + 5 documentos + verificación final). Sin commit ni push en el repo del juego; solo diseño + datos + sim (el código es del agente de código, el arte del agente de arte).
- **Dónde está el trabajo:** repo privado `danielsanchezverdasco-art/dana-games-juegos`, worktree `~/workspace/wt-traffic-real`, rama `niky/traffic-chaos-real`, carpeta `traffic-chaos/design/` y `traffic-chaos/scripts/`.
- **Regla de Daniel (22:17):** actualizo este estado en GitHub cada vez que cambio de paso; si no está en GitHub, no existe para la oficina.

## ESTADO EN VIVO — AGENTE DE ARTE · Traffic Chaos: New York Rush · 15/11/2026, 22:19, hora de Madrid
- **Encargo:** Daniel lo ha FORZADO: set completo de arte del juego real en `dana-games-juegos`, worktree `wt-traffic-real`, rama `niky/traffic-chaos-real`, carpetas `traffic-chaos/art-src/` y `traffic-chaos/public/assets/`. Solo arte + documentación; sin código, sin commit/push en ese repo.
- **Ahora mismo:** estoy en el postproceso — recorte a transparente + normalizado a tamaños de juego. Generación 100% verificada.
- **Hecho (12/12 raws):** taxi, car-pink v2 (3/4, ya en familia), car-blue, car-green, bus-mta, ambulance-fdny, scooter v2 (cenital, con conductor visto desde arriba), truck, intersection-night, menu-crash. Los 2 fondos, a nivel de preview: `intersection-night` (asfalto mojado, reflejos neón rosa/cian, pasos de cebra, centro limpio, aceras vivas, sin texto legible) y `menu-crash` (taxi volando con rueda suelta, bus MTA arrugado, ambulancia FDNY con estrobo, anillo rojo vacío, bocadillo «BEEP!» correcto). Las 2 regens han corregido las desviaciones: rosa v2 ya es 3/4 como el taxi, scooter v2 ya es cenital.
- **Siguiente (en este orden):** 1) recorte a transparente (chroma magenta) + rotación a frente-arriba + normalizado a tamaños §10; 2) copiar semáforos y mano del prototipo (reutilizados); 3) `ART-BIBLE.md` con comparación lado a lado; 4) QA a 390 px.
- **Cuánto queda (orientativo):** ~25% — postproceso + biblia + QA, unos 30–40 min.
- **Skills:** `art-bible`, `create-game-assets`, `sprite-gen` (existen en el kit); `generate2dsprite`, `video2dsprite`, `generate2dmap`, `sprite-atlas`, `spine-skeletal`, `pixel-animation`, `character-rig`, `vfx-generate`, `blender-stylized-npr`, `asset-audit` NO existen como SKILL.md en este checkout del kit (revisadas una a una; solo constan en el informe PR #27) — la generación va por la herramienta de imagen propia, como dice la dirección de arte §13.4. SpriteCook NO se usa (decisión de Daniel 15/11 21:03).
- **Regla 22:18 (NADA SE ATASCA):** revisar el procedimiento, si está en vivo o no, SIEMPRE CONTINUANDO. Si algo se atasca en Traffic Chaos, se revisa, se arregla LO PRIMERO y se sigue — la fábrica no se para nunca. Cuando este juego esté listo para probar, se continúa con el siguiente juego en el acto, sin esperar.
- **Actualización 22:20:** los 5 agentes siguen en marcha (arte, código, jugabilidad, audio, portadas/listing). Nada atascado. Siguiente paso: integración + QA + versión jugable para Daniel.
- **COLISIÓN 22:21 (resuelta sin parar la fábrica):** el commit `b1e2a81` (regla 22:18 + estado 22:20, del coordinador) cayó en MI rama `niky/arte-traffic-estado-1511` por trabajar varios agentes en el clon compartido. No lo borro (no existe en ninguna otra rama; un reset lo perdería) — queda en el historial de mi PR #52 y se documenta aquí. Desde ahora actualizo `niky.md` SOLO desde mi worktree propio `~/workspace/wt-tc-arte-estado`, nunca desde el clon compartido. Mi rama y mi trabajo de arte no se tocan.
- **Actualización 22:21 (arte):** fondos verificados a nivel de preview, regens corregidas, paso a postproceso. Nada atascado.
