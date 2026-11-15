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

## EN CURSO — Traffic Chaos: New York Rush · audio · 15/11/2026, 22:20, hora de Madrid
- **Estado ahora mismo:** estoy en la QA de los 11 WAV (verificación objetiva hecha: formato, pico, RMS, clipping, DC, silencio) y escribiendo `design/AUDIO.md` (mapa sonido→momento + loop de música + integración para el agente de código).
- **Hecho hasta ahora:** 11 WAV propios 100 % procedurales (numpy/scipy, sin muestras de terceros) en `traffic-chaos/public/assets/sfx/`: flip, clear, near-miss, crash, siren (2,00 s), boost, win, lose, honk, coin, ui-tap. Total 299.040 B (292,0 KiB). Generador reproducible en `traffic-chaos/design/generate-sfx.py`. Decisión documentada: los 7 WAV del prototipo se SUSTITUYEN todos (crash con clipping a pico 1,000; click/honk/siren/win con pico 0,09–0,13, demasiado bajos).
- **Fallo detectado y arreglado LO PRIMERO (regla 22:18):** la medida de loudness ebur128 no imprimía valores — era el `grep` (los valores van en la línea siguiente al encabezado), no los WAV. Re-medido con `grep -A2`. Nada atascado.
- **Siguiente paso:** terminar `design/AUDIO.md` (loops por estado para `sfx.setMusicNotes()`, duck, volúmenes por bus, snippet de integración WAV→bus SFX) → verificación final (zip SFX ≤ 5 MB con todo el juego: mi parte 292 KiB) → entrega.
- **Cuánto queda (orientativo):** ~20–30 min para la entrega completa (AUDIO.md + verificación final + informe). Sin commit ni push en el repo del juego (rama `niky/traffic-chaos-real`); no toco `src/` (código) ni `assets/vehicles, lights, bg, ui` (arte).
- **Dónde está el trabajo:** repo privado `danielsanchezverdasco-art/dana-games-juegos`, worktree `~/workspace/wt-traffic-real`, rama `niky/traffic-chaos-real`, carpetas `traffic-chaos/public/assets/sfx/` y `traffic-chaos/design/`.
- **Skills del kit revisadas:** `audio-design` (única de audio presente en el kit; `game-audio`, `audio-feel`, `audio-buses` NO existen como carpetas — la plantilla las cita como reglas de diseño; `game-audio` sin LICENSE verificada: solo referencia, sin copiar código). SpriteCook NO se usa. Sin API key ni pago: procedural + WAVs propios.
- **Regla de Daniel (22:17):** actualizo este estado en GitHub cada vez que cambio de paso; si no está en GitHub, no existe para la oficina. Issue propia de audio: no tengo; el canal es este registro + PR.
