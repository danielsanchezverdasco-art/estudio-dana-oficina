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

## Remate Scribble Striker ronda 1 — CERRADO · 15/11/2026, 11:45, hora de Madrid (Niky)
- **Orden de Daniel 15/11 11:11:** empezar ya. 11:17: la versión FINAL la prueba ÉL antes de publicar nada (nada a Playgama ni a YouTube sin su visto bueno). 11:22: usar SIEMPRE Y SOLO las 66 skills del kit. APROBADO de Daniel sustituye al de Anita.
- **Medido:** vitest 11/11 PASS (peor turno IA 61,5 ms); build producción OK (dist/ 44 ficheros, 2,5 MB, 0 `window.__`); build QA OK; precheck real 14 OK, 4 FAIL, 2 WARN — los 4 FAIL y 2 WARN verificados como falsos positivos (ver `entrega/audits.md` §3); 20 capturas 390×844; GIF 360×779, 8,74 s, 15 fps, 131 fotogramas, 2,6 MB, acaba en «GOAL!»; portadas regeneradas (11 ficheros, sello arriba, mascota ~130 px en 800×800); **zip final `scribble-striker-playgama.zip`: 1.166.223 bytes (1,11 MB), index.html en la raíz, Bridge 2.4.2 primer script sin async, 0 `window.__`**.
- **Pasos del Director:** 1) corners.py TERMINADA 15/11 11:44 (34 botones, 0 errores de consola; 29/34 en verde, 5 con solo tl/tr en falso: 150/300/600 artefacto de temporización verificado con LIST fresco, PLAY mismo caso, **RETRY defecto real menor** — franja superior de las esquinas no responde, centro sí — arreglar antes de publicar; **el x2 de victoria, 6/6**); 2) listing.txt HECHO (EN primero, ES segundo); 3) lado a lado con Metro HECHO (lección del campo aplicada); 4) APROBADO de Anita SUSTITUIDO por el de Daniel; 5) subir a Playgama: NO hasta que Daniel lo diga y pruebe la versión final.
- **Listón de Daniel 15/11 (20.000 €, tras cancelar KO Relámpago):** arte, mecánicas y diseño SÍ llegan; dinamismo/adicción tiene techo de género (por turnos, tranquilo y táctico; no es loop arcade). No es «para salir del paso», pero si Daniel quiere ese loop, el cambio es de concepto (p. ej. modo blitz), no de pulido. La curva de dificultad (playtest10) sigue sin verificar. Detalle en `entrega/informe-ronda1.md`.
- **Pendiente antes de publicar:** completar corners.py; re-ejecutar bridge.py, persist.py, shots_all.py, goal_gif.py y playtest10.py con la máquina libre (bloqueados por corners.py + orden de cierre 11:38); confirmar anuncios reales, guardado en la nube y `game_ready` en el QA Tool de Playgama; revisión de Arte y Calidad.
- **Huecos del kit (reportados):** playgama-publish no trae `scripts/` (precheck/pack); la skill `estandares-calidad-daniel` no existía pese a que el manual la exige — **instalada en este remate** (`kit/skills/skills-pro/estandares-calidad-daniel/SKILL.md`; el kit pasa de 66 a 67 skills). La ruta `revision-pendiente/paper-soccer-round1/` NO existe en la oficina: el pack queda en `scribble-striker/entrega/` + el zip.
- **Skills usadas:** 40 del kit (ver `entrega/skills-usadas.md`).
- **Ruta de entrega:** rama `niky/scribble-striker-r1` en `danielsanchezverdasco-art/dana-games-juegos` (`scribble-striker/ESTADO.md`, `scribble-striker/entrega/`, `scribble-striker/covers/out/`, `scribble-striker/shots/final/`, `scribble-striker/scribble-striker-playgama.zip`). Versión jugable para Daniel: el zip + instrucciones (descomprimir + servidor local; file:// no sirve para módulos ES).
- **No se sube nada a Playgama ni a YouTube.**
