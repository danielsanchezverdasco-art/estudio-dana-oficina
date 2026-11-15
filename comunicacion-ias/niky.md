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

## Cinco descartes de Daniel · 15/11/2026, 18:36–18:40, hora de Madrid
- **Los cinco juegos entregados hoy, descartados por Daniel tras probarlos. No se sigue con ninguno, no se publica ninguno.**
- 1. **Seagull Attack: Save the Sandwich** (idea `salva-el-bocata`, prueba de traspaso de Anita, PR #11) — descartado 18:36. Motivo literal de Daniel: «No me gusta nada, no es un juego que enganche. Es muy simple, con mecánica fea, descartado». PR #11 cerrada con [RECHAZAR] #11.
- 2. **Gummy Worm Clash / Gusano Glotón** (idea `gusano-gloton`, r1; sin PR: rama `niky/gusano-gloton-r1` sin push) — descartado 18:37. Motivo literal: «No me gusta, descartado».
- 3. **Estampida en las Rebajas r13** (idea `estampida-en-las-rebajas`, PR dana-games-juegos #2) — descartada 18:38. Motivo literal: «Muy simple y feo». PR cerrada con [RECHAZAR].
- 4. **El Barista del Caos r7** (idea `el-barista-del-caos`, PR dana-games-juegos #1) — descartado ~18:40. Motivo literal: «De hartos, todos no me gusta nada» / «me parece patético el nivel que me estáis dando». PR cerrada con [RECHAZAR].
- 5. **Cofre del Doblón r1 / Doubloon Rush** (idea `cofre-del-doblon`, PR #12) — descartado ~18:40. Mismo motivo literal. PR #12 cerrada con [RECHAZAR] #12.
- **Registro:** las cinco ideas pasan de aptas a noAptas en `ideas-acumuladas.json` con su motivo (aptas 22→17, noAptas 15→20; `actualizadoEn` 18:41). `data.json` queda intacto (precedente PR #9 de KO; los recuentos ya divergen entre ambos ficheros). Rama `niky/descartes-1511` + PR #15.
- **Cierres verificados 15/11 ~18:44:** issues [RECHAZAR] #16 (Seagull), #17 (Cofre), #18 (Estampida), #19 (Barista), con etiqueta `decision`. PR cerradas sin fusionar: oficina #11 (Seagull) y #12 (Cofre), dana-games-juegos #1 (Barista) y #2 (Estampida). Gummy sin PR.
- **Skills:** ninguna de creación de juegos — trabajo de registro y datos (JSON + GitHub API) según GUIA-OFICINA §3; solo las 66 skills de Grok, sin instalar nada nuevo.

## LECCIÓN DURA DE DANIEL · 15/11/2026 ~18:40, hora de Madrid
- **«Aprender de los errores para no hacer lo mismo».** Los cinco descartes comparten lo mismo: muy simples, feos, mecánicas que no enganchan; nivel patético. Listón reafirmado por Daniel 18:41: juegos que parezcan que valen 20.000 $ hacerlos, juegos de calidad.
- **REGLA NUEVA, DURA: NINGÚN juego se fabrica sin que Daniel apruebe antes el concepto y el mockup del diseño acabado. Arte premium primero y mecánicas que enganchen, comparadas con los top; si el mockup no le gusta, no se construye.**
- **Dirección nueva de Daniel (~18:40):** quiere juegos para YouTube Jugables; analizar la competencia, no ser inferiores a ellos, y usar toda la potencia de las skills ya instaladas (66 de Grok). Nada se fabrica hasta que él apruebe concepto + diseño acabado. (El análisis de la competencia va por otra vía; aquí solo queda registrado.)
