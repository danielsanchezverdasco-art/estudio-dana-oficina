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

## EN CURSO — Traffic Chaos · audio · actualización 22:22, hora de Madrid
- **Estado ahora mismo:** worktree propio creado (`~/workspace/wt-tc-audio-estado`, rama `niky/audio-traffic-chaos-1511`) — ya NO toco el clon compartido (colisión de ramas, regla 22:20). El clon compartido queda en `main`. Estoy escribiendo `design/AUDIO.md`.
- **Verificación cerrada:** true peak de `crash.wav` −1,1 dBFS (ebur128, dentro del objetivo ≤ −1 dBTP); los −70 LUFS de los WAV < 0,4 s son el suelo de puerta del medidor ebur128 (ventana 400 ms), no silencio: pico/RMS verificados audibles en todos. Nada atascado.
- **Cuánto queda (orientativo):** ~15–20 min: `AUDIO.md` + verificación final + entrega.

## ENTREGADO — Traffic Chaos: New York Rush · audio · 15/11/2026, 22:26, hora de Madrid
- **Estado ahora mismo:** ENTREGADO. 11 WAV + `design/AUDIO.md` + generador `design/generate-sfx.py` en el repo del juego (rama `niky/traffic-chaos-real`, sin commit ni push ahí). Nada atascado en ningún paso (el único fallo, la medida ebur128, se arregló LO PRIMERO).
- **Entrega:** `traffic-chaos/public/assets/sfx/` — flip 5.336 B, clear 7.982 B, near-miss 6.218 B, crash 44.144 B, siren 88.244 B (2,00 s), boost 24.298 B, win 44.144 B, lose 44.144 B, honk 17.684 B, coin 13.274 B, ui-tap 3.572 B. Total 299.040 B (292,0 KiB; 250.881 B comprimido en zip). Todos 22050 Hz mono PCM 16 bit, pico 0,45–0,88, 0 clipping, 0 DC, true peak ≤ −1,1 dBFS.
- **Documento:** `traffic-chaos/design/AUDIO.md` — mapa sonido→momento, 5 loops de música con arrays exactos para `sfx.setMusicNotes()` (menú/flujo/urgencia/victoria/derrota), duck, volúmenes por bus, snippet de integración WAV→bus SFX para el agente de código, reglas de disparo anti-repetición, verificación medida y skills.
- **Decisiones:** los 7 WAV del prototipo se sustituyen todos (crash con clipping a 1,000; resto con pico 0,09–0,13). Skills: solo `audio-design` existe en el kit; `game-audio`/`audio-feel`/`audio-buses` no están instaladas (reglas aplicadas desde la plantilla); SpriteCook no se usa; 0 € (procedural propio).
- **Pendiente (honesto, no es mío):** escucha humana en el móvil (Daniel o código) + zip total ≤ 5 MB conjunto con código y arte (mi parte deja ~4,7 MB). Cama ambiental marcada EN PROCESO, no entregada falsa.
- **Canal:** PR #53 (https://github.com/danielsanchezverdasco-art/estudio-dana-oficina/pull/53), rama `niky/audio-traffic-chaos-1511`, worktree propio `~/workspace/wt-tc-audio-estado`. El clon compartido queda en `main` y no lo vuelvo a tocar.
