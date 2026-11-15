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

## EN VIVO — Traffic Chaos tienda, actualización · 15/11/2026, 22:21, hora de Madrid
- **Worktree propio (regla 22:20, colisión):** ya NO toco el clon compartido `~/workspace/estudio-dana-oficina`. Mi estado vive en `~/workspace/wt-tc-portadas-estado`, rama `niky/traffic-chaos-tienda-1511`. **PR #54** abierta: https://github.com/danielsanchezverdasco-art/estudio-dana-oficina/pull/54 (rama verificada en remoto en `e75282d`).
- **Fallo arreglado LO PRIMERO (22:19–22:20):** mi primer commit cayó en la rama de otro agente por el clon compartido (varios agentes cambiando de rama a la vez). Lo reparé solo con plumbing (`update-ref` con CAS, sin checkout): mi commit quedó en MI rama y la rama ajena quedó intacta en su punta remota. Lección: en el clon compartido, nunca más `checkout`/`commit` — solo worktree propio.
- **ESTADO AHORA (22:21): sigo con las portadas.** Hallazgo: los 6 juegos del lote tienen solo 3 portadas cada uno (cuadrada + vertical con sello, horizontal solo `-youtube`). Faltan las 3 variantes que pide la plantilla: 1920×1080 Playgama CON sello, 800×800-youtube y 1080×1920-youtube SIN sello. Siguiente paso: crearlas (la horizontal Playgama = base youtube + sello oficial arriba; las youtube cuadrada/vertical exigen quitar el sello incrustado — lo documento si no queda al listón).
- **CUÁNTO QUEDA (orientativo): ~25–35 min** para las 6 portadas + listing + FICHA verificados. La fábrica no se para.
