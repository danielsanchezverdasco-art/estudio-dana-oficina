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
- **Registro:** las cinco ideas pasan de aptas a noAptas en `ideas-acumuladas.json` con su motivo (aptas 22→17, noAptas 15→20; `actualizadoEn` 18:41). `data.json` queda intacto (precedente PR #9 de KO; los recuentos ya divergen entre ambos ficheros). Rama `niky/descartes-1511` + PR.
- **Skills:** ninguna de creación de juegos — trabajo de registro y datos (JSON + GitHub API) según GUIA-OFICINA §3; solo las 66 skills de Grok, sin instalar nada nuevo.

## LECCIÓN DURA DE DANIEL · 15/11/2026 ~18:40, hora de Madrid
- **«Aprender de los errores para no hacer lo mismo».** Los cinco descartes comparten lo mismo: muy simples, feos, mecánicas que no enganchan; nivel patético. Listón reafirmado por Daniel 18:41: juegos que parezcan que valen 20.000 $ hacerlos, juegos de calidad.
- **REGLA NUEVA, DURA: NINGÚN juego se fabrica sin que Daniel apruebe antes el concepto y el mockup del diseño acabado. Arte premium primero y mecánicas que enganchen, comparadas con los top; si el mockup no le gusta, no se construye.**
- **Dirección nueva de Daniel (~18:40):** quiere juegos para YouTube Jugables; analizar la competencia, no ser inferiores a ellos, y usar toda la potencia de las skills ya instaladas (66 de Grok). Nada se fabrica hasta que él apruebe concepto + diseño acabado. (El análisis de la competencia va por otra vía; aquí solo queda registrado.)

## Lista de ideas puntuadas · 15/11/2026, 19:00, hora de Madrid
- **Encargo de Daniel (18:53):** «Dame una lista de ideas primero, género, jugabilidad, diseño con foto, todo».
- **Entrega:** `comunicacion-ias/lista-ideas-puntuadas-2026-11-15.md` — ranking completo de 23 ideas (16 existentes puntuadas + 7 nuevas mías), cada una con género, jugabilidad, gancho en 10 s, por qué puede ser premium, puntuación sobre 35 y veredicto. Con las 3 fotos de mockup ya verificadas en el análisis de competencia (Traffic Chaos, ¿Quién es el Robot?, Agujero Tragón). **Ningún juego fabricado.**
- **Resultado:** 10 FUERTES, 9 DUDOSAS, 4 DÉBILES. Nº 1: **Traffic Chaos: New York Rush, 31/35** (idea del propio Daniel). Nuevas mías en el top 10: Apila la Pizza (29), Limonada Exprés (29), Carrito Loco del Súper (28), Peluquería Loca (27), El Gran Escape del Museo (27).
- **`ideas-acumuladas.json`:** aptas 17→24, noAptas 20→21. Cambios: (a) puntuación + veredicto en las 15 ideas del pool; (b) **Traffic Chaos añadida como apta** — no estaba en el JSON pese a ser la idea de Daniel (su GDD, PR #8); (c) **KO Relámpago de aptas a noAptas** — Daniel lo canceló el 15/11 a las 11:49 y se borró por completo, aún figuraba como apta; (d) mis 7 ideas nuevas con puntuación. Mudanza Extrema sin puntuar (en producción, fuera de alcance por orden de Daniel). `actualizadoEn` 19:05.
- **Rama:** `niky/fabrica-ideas-1511` (desde `origin/main`) + PR. Incluye el commit de descartes (`7611dd6`, cherry-pick de `niky/descartes-1511`, PR #15) para que el JSON parta de las 17 aptas reales, y los 3 mockups `.webp` del análisis de competencia (misma ruta que en `niky/analisis-competencia-yt`, para que las fotos del documento resuelvan).
- **Skills / fuentes:** criterios de `ideas-acumuladas.json` + `kit/brief-juego-comun.md` (listón 10.000 $ / 20.000 $) + `kit/teardowns-competencia.md` + `comunicacion-ias/analisis-competencia/analisis-competencia-youtube-playables-2026-11-15.md` (11 top, géneros por plays, mecánicas que escalan). Solo las 66 skills de Grok; nada instalado, nada fabricado, ninguna cifra sin fuente.
- **Pendiente de Daniel:** elegir 2–3 de las 10 FUERTES para hacerles concepto + mockup. Las demás ideas aún no tienen mockup: se genera cuando él elija el concepto, según el proceso.
