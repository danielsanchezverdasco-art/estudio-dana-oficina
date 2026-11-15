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

## EN VIVO — Traffic Chaos: portadas y listing · 15/11/2026, 22:19, hora de Madrid
- **Soy:** agente de PORTADAS Y LISTING de Traffic Chaos: New York Rush (Dana Games). Daniel lo ha FORZADO: todo el poder en este juego.
- **Dónde trabajo:** repo privado `dana-games-juegos`, worktree `~/workspace/wt-traffic-real`, rama `niky/traffic-chaos-real`. Carpeta: `traffic-chaos/store-assets/` (portadas + ficha) y `traffic-chaos/entregas/traffic-chaos-real-round1/listing.txt`. NO hago commit ni push allí; no toco `src/` ni `public/assets/` (son de otros agentes).
- **ESTADO AHORA (22:19): estoy con las portadas.** Verificadas las 3 existentes (rama `niky/portadas-juegos-1511`) contra la dirección de arte §14: las 3 enseñan EL CHOQUE en Times Square de noche (dos taxis amarillos, semáforo en verde, anillo de paciencia, autobús MTA rojo, ambulancia FDNY) — pasan el listón. Sello oficial Dana Games arriba en 800×800 y 1080×1920, nunca en el 20% inferior; la 1920×1080-youtube va sin sello, como toca.
- **Qué falta:** crear las 3 variantes que no existen — 1920×1080 Playgama CON sello, 800×800-youtube y 1080×1920-youtube SIN sello — y luego el `listing.txt` (EN primero, ES segundo) + `store-assets/FICHA.md`.
- **CUÁNTO QUEDA (orientativo): ~30–40 min** para tener las 6 portadas + listing + FICHA verificados (dimensiones y pesos reales en disco, sello verificado visualmente). Después lo revisa el coordinador; nada se publica sin el visto bueno de Daniel.
- **Skills revisadas:** `thumbnail-design`, `hook-writer`, `playgama-publish` (leídas); `asset-pipeline`, `taste-skill`, `game-ui-taste` NO están como carpetas en el kit en disco (solo se citan en la plantilla / informe de skills) — documentado en la entrega.

## ESTADO EN VIVO: Traffic Chaos real (FORZADO por Daniel 15/11 22:11) · actualizado 15/11/2026, 22:19, hora de Madrid
- **Ahora mismo:** coordinando la fabricación del juego real. 5 agentes desplegados en paralelo (regla de reparto 22:13): arte, código, jugabilidad, audio, portadas/listing. Cada uno actualiza su estado aquí en GitHub en cada paso (regla 22:17).
- **Qué hace cada uno ahora:** arte — generando el set completo (vehículos, semáforos, fondo nocturno, key art); código — juego real sobre la plantilla con niveles + modo caos; jugabilidad — 10 niveles + balance con simulación; audio — 11 SFX + música; portadas/listing — 18/18 + listing EN+ES.
- **Cuánto queda (orientativo):** las 5 entregas parciales en ~1–2 h; integración + QA + versión jugable para Daniel después, en esta misma noche. La estimación es orientativa, no una promesa.
- **Repo:** privado `dana-games-juegos`, rama `niky/traffic-chaos-real`, carpeta `traffic-chaos/` (copia de la plantilla). Prototipo pulido en `niky/traffic-chaos-prototipo` (commit 87368b4) como base.
- **Puerta:** Daniel prueba la versión final antes de publicar (su única decisión: publicar o no).
- **Regla 22:18 (NADA SE ATASCA):** revisar el procedimiento, si está en vivo o no, SIEMPRE CONTINUANDO. Si algo se atasca en Traffic Chaos, se revisa, se arregla LO PRIMERO y se sigue — la fábrica no se para nunca. Cuando este juego esté listo para probar, se continúa con el siguiente juego en el acto, sin esperar.
- **Actualización 22:20:** los 5 agentes siguen en marcha (arte, código, jugabilidad, audio, portadas/listing). Nada atascado. Siguiente paso: integración + QA + versión jugable para Daniel.
- **Nota 22:21:** el clon compartido de la oficina lo usan varios agentes a la vez y se pisan las ramas — cada agente actualiza niky.md desde SU PROPIO worktree (este es el mío: wt-tc-estado). No usar el clon compartido para niky.md.
- **Actualización 22:24:** AUDIO ENTREGADO (1/5). 11 WAV procedurales verificados (292 KiB) + design/AUDIO.md con mapa sonido→momento y loops para setMusicNotes(). Quedan en marcha: arte, código, jugabilidad, portadas/listing. Nada atascado.
- **Actualización 22:30:** PORTADAS Y LISTING ENTREGADOS (2/5). 6/6 portadas en store-assets/ (3 Playgama con sello verificado por píxeles + 3 YouTube sin sello) + listing.txt EN+ES + FICHA.md. PR #54. Quedan en marcha: arte, código, jugabilidad. Nada atascado.
- **Actualización 22:40:** CÓDIGO ENTREGADO (3/5). Juego real completo: 10 niveles, modo caos, meta tycoon, reto diario, tutorial, juice, Bridge+ytgame. Tests 61/61, tsc 0, builds playgama+youtube OK, precheck 0 FAIL. PR #55. Quedan en marcha: arte y jugabilidad (la tabla de niveles v1 del código la revisa jugabilidad). Nada atascado.
