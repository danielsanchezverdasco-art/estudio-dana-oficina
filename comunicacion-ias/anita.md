# Anita · registro

(Escribe aquí cada entrega con fecha y hora de Madrid, skills usadas y ruta.)

## Herramientas

- Tengo: generación de imágenes; navegador (vivo + capturas 390×844, Playwright/Chromium); Node.js 24 + npm; Python 3.12; git; ffmpeg (GIF y Shorts 1080×1920).
- Me falta: acceso a Playgama (miembro del equipo Dana Games); acceso de Editor en YouTube Studio (canal Dana Games); colaboradora de GitHub en estudio-dana-oficina; el kit completo del estudio con las carpetas de entregas que no estén ya en comunicacion-ias/kit. Todo esto se lo pido a Daniel por el canal privado, nunca en el repo.

## Registro

### 15/11/2026 10:16 (Madrid) — Lectura del manual y traspaso recibido

- Leído entero: GUIA-OFICINA.md, manual/DATOS-DEL-PROYECTO.md, manual/CONTROL-CALIDAD.md, manual/CREAR-JUEGOS.md, manual/PUBLICAR-Y-MARKETING.md, README.md y ORDEN-VIGENTE.md. Kit revisado (normas, brief, sello, mano, skills).
- Orden de Daniel reenviada a Anita y Niky como issue #2 ([ORDEN] Traspaso Dana Games) en estudio-dana-oficina.
- Primera tarea (prueba de traspaso, ORDEN-VIGENTE.md): fabricar un juego completo; la otra lo revisa. En marcha: elección de idea apta y fabricación.

### 15/11/2026 12:39 (Madrid) — Prueba de traspaso ENTREGADA: Seagull Attack: Save the Sandwich (round 1)

- Idea: «¡Que no me roben el bocata!» (ideas-acumuladas.json, viral 5, la más alta). Draw-to-protect: dibujar una línea para proteger un bocata en la toalla de las gaviotas, sobrevivir 10 s. No es ninguno de los 6 en curso ni de los 3 juegos extra del cambio de plan.
- Rama: `anita/prueba-traspaso-seagull-attack` · PR #11 (abierta) en estudio-dana-oficina: https://github.com/danielsanchezverdasco-art/estudio-dana-oficina/pull/11
- Entrega: código completo Phaser 3.90 + TypeScript + Vite, Bridge 2.4.2, EN primero / ES segundo, 30 niveles, mapa, tienda solo con monedas. Zip `seagull-attack-round1.zip`, 1.646.669 B (1,57 MB). Pack en `entregas/seagull-attack-round1/` (6 portadas, 11 capturas, GIF 9 s, listing, teardown, filtros, skills-usadas, guion del Short).
- Pruebas: 35/35 PASS, 0 errores de consola, 0 peticiones fallidas. 8 defectos reales encontrados y corregidos en 10 runs (el mayor: el botón de pausa moría tras salir desde pausa).
- Skills: solo las 66 del kit (49 aplicadas, cero fuera; auditadas: 66 SKILL.md, 13 anidadas de threejs).
- Reglas 11:32 aplicadas: nada subido a Playgama ni a YouTube; YouTube no es contenido para niños; PEGI 3; inglés primero.
- Estado: **DESCARTADO por Daniel 15/11 18:36** — «No me gusta nada, no es un juego que enganche. Es muy simple, con mecánica fea, descartado». Nada se publica de él (ver entrada 19:00).

### 15/11/2026 12:54 (Madrid) — El Barista del Caos r7 ENTREGADA

- Orden: issue #5 ([ORDEN] El Barista del Caos r7 — terminar y dejar lista para subir). Cierra la auditoría r6: los 7 arreglos (zonas táctiles desplazadas 44 px, Volver, mancha crema en la fachada, cortes superiores, nivel actual, barra cruzando el número, flecha de scroll) + Bridge 2.4.2 como primer script del `<head>`. Método: parche del build r6 (no hay fuente TS de r6; el manual lo manda).
- Rama: `anita/barista-r7` · PR #1 (abierta) en el repo privado dana-games-juegos: https://github.com/danielsanchezverdasco-art/dana-games-juegos/pull/1
- Entrega: `barista/build-playgama-r7/` + `entregas/el-barista-del-caos-round7/` (zip 4.888.023 B, 4,66 MB; 6 portadas, 9 capturas 390×844, GIF 8,33 s que termina en PERFECT!, listing, teardown, filtros, skills-usadas).
- Pruebas: run 4 limpia, 18 PASS, 0 FAIL. Nivel 13 jugado entero y ganado (6 clientes, 0 errores, 3★, guardado persistido, ES persistente; producción sin `__BARISTA`, con `window.bridge`, 0 errores, 0 peticiones fallidas).
- Skills: solo las 66 del kit (22 aplicadas, resto listado honestamente como no leído). Arte premium primero, comparado con Metro.
- Estado: **DESCARTADO por Daniel 15/11 ~18:40** (junto con Cofre: «De hartos, todos no me gusta nada», «me parece patético el nivel que me estáis dando»). Nada se publica de él (ver entrada 19:00).

### 15/11/2026 13:19 (Madrid) — Cofre del Doblón ronda 1 ENTREGADA (fabricado desde cero)

- Orden: issue #6 ([ORDEN] Cofre del Doblón — fabricar desde cero). Idea `cofre-del-doblon` de ideas-acumuladas.json (apta, 32/35): arcade de reflejos — los cofres asoman de la arena, tócalos antes de que se hundan, evita las bombas, y en uno entre muchos… el Doblón Dorado. Título EN propuesto: «Doubloon Rush» (verificado libre en Playgama; la idea proponía «Gold Doubloon Chest Rush», 4 palabras, demasiado largo).
- Rama: `anita/cofre-del-doblon` · PR #12 (abierta) en estudio-dana-oficina: https://github.com/danielsanchezverdasco-art/estudio-dana-oficina/pull/12
- Entrega: código completo Phaser 3.90 + TypeScript + Vite, Bridge 2.4.2, EN primero / ES segundo, PEGI 3, 30 niveles, mapa, reto diario, tutorial con la mano oficial, combo ×3, cangrejo ladrón, Doblón Dorado 1 entre 500. Zip `doubloon-rush-round1.zip`, 1,94 MB. Pack de marketing con Short 1080×1920 de 21,1 s (gameplay real) + GIF 9 s a 12 fps, 6 portadas, 8 capturas, listing, teardown, filtros, skills-usadas. Oficina (Paso D): data.json, ideas-acumuladas.json, equipo-hoy.json actualizados.
- Pruebas: unitarios 11/11, smoke test Playwright 20/20 (390×844 + 844×390 + es-ES, 0 errores de consola, 0 peticiones fallidas), TypeScript estricto exit 0.
- Skills: solo las del kit (la orden dice 66; se contaron 54 carpetas en `kit/skills/` y skills.json dice 56 — ver Preguntas abiertas).
- Estado: **DESCARTADO por Daniel 15/11 ~18:40** (junto con Barista: «De hartos, todos no me gusta nada», «me parece patético el nivel que me estáis dando»). Nada se publica de él (ver entrada 19:00).

### 15/11/2026 13:32 (Madrid) — Estampida en las Rebajas r13 ENTREGADA

- Orden: issue #4 ([ORDEN] Estampida en las Rebajas r13 — terminar y dejar lista para subir). Corrige los 12 arreglos de la auditoría r12 punto por punto (zonas táctiles en coordenadas locales, mano oficial del kit, título de portada, composición, insignias, clientes ≥90 px, mapa, fallo, tienda, horizontal, fondo a nivel Metro). Además: defecto de arranque encontrado y corregido (la fuente 404 hacía fallar el juego antes de crear el canvas; ahora se sirve `fonts/Fredoka-Bold.woff2`).
- Rama: `anita/estampida-r13` · PR #2 (abierta) en el repo privado dana-games-juegos: https://github.com/danielsanchezverdasco-art/dana-games-juegos/pull/2
- Entrega: `estampida/build-playgama/` actualizado + `entregas/estampida-round13/` (informe punto por punto con 30 parches, filtros, teardown, listing EN+ES, 6 portadas, GIF 10 s/12 fps que termina en victoria, Short 28 s de gameplay real, 9 capturas, zip de Playgama 1.473.437 B, 1,47 MB).
- Pruebas: niveles 1, 2 y 3 jugados de principio a fin en ES y en EN (victoria y fallo), 0 errores de consola, 0 errores de página, 0 peticiones fallidas. Filtro visual 8,5/10 contra Metro (ninguna pantalla por debajo de 7). Filtro de jugabilidad: APTO.
- Skills: solo las 66 del kit. Arte premium primero, comparado lado a lado con Metro.
- Estado: **DESCARTADO por Daniel 15/11 18:38** — «Muy simple y feo». Nada se publica de él (ver entrada 19:00).

### 15/11/2026 19:00 (Madrid) — Los 5 juegos DESCARTADOS por Daniel: lección, reglas nuevas y briefing de skills

Fuente: issue #20 «[INFORME] Todo lo de hoy para Anita: los 5 juegos descartados, la lección y las reglas nuevas» (Niky, 18:45, por orden de Daniel «Habla con Anita y explícale todo», 18:43) + comentario con el briefing completo de skills (Niky, 18:51) + PR #23 (niky.md: briefing completo de skills para Anita, rama `niky/anita-skills-1511`).

**1. Los 5 juegos descartados** — Daniel probó las versiones jugables de los cinco juegos entregados hoy y descartó los cinco. Nada se publica de ellos:
- Seagull Attack: Save the Sandwich (prueba de traspaso, PR #11): «No me gusta nada, no es un juego que enganche. Es muy simple, con mecánica fea, descartado» (18:36).
- Gummy Worm Clash / Gusano Glotón (r1, de Niky): «No me gusta, descartado» (18:37).
- Estampida en las Rebajas r13 (PR #2 repo privado): «Muy simple y feo» (18:38).
- El Barista del Caos r7 (PR #1 repo privado) y Cofre del Doblón / Doubloon Rush (PR #12): «De hartos, todos no me gusta nada», «me parece patético el nivel que me estáis dando» (~18:40).

**2. La lección** — Aprender de los errores para no hacer lo mismo. Diagnóstico de Daniel: buenas ideas pero malas ejecuciones; los Jugables de la competencia en YouTube alucinan y los nuestros no llegan. Los cinco descartes comparten lo mismo: muy simples, feos, mecánicas que no enganchan. No es un problema de ideas, es de ejecución.

**3. REGLAS NUEVAS (valen para Anita y Niky)**
- NINGÚN juego se fabrica sin que Daniel apruebe antes el concepto y el mockup del diseño acabado. Antes del diseño gráfico, enseñarle varias opciones en imagen; cuando elige una, construir siendo fiel a la elegida. Si el mockup no le gusta, no se construye.
- Arte premium primero, antes de programar; nada se enseña sin compararlo lado a lado con Metro Nightmare.
- Mecánicas que enganchen, comparadas con los top.
- Listón: juegos que parezcan que valen 20.000 $ hacerlos. Solo calidad de primer nivel, nada por debajo.

**4. Briefing de skills recibido (issue #20, comentario 18:51 + PR #23)**
- Meta: ser los mejores en videojuegos jugables para YouTube. Que la competencia diga «wow, qué locura». Juegos que parezcan que valen 20.000 $ hacerlos. Solo calidad de primer nivel: nada más de juegos simples ni feos.
- Misión: buscar en INTERNET (no solo en GitHub) las mejores skills para programar y diseñar videojuegos de Android/móvil, como profesionales. Alcance: (a) Diseño — 2D, 3D, 4K, arte premium, UI/UX móvil, portadas, personajes, fondos; (b) Desarrollo — Phaser / Three.js, rendimiento móvil, arquitectura, testing; (c) Jugabilidad — game feel, juice, balanceo, dificultad, onboarding, retención; (d) Ingenio — diseño de juegos, mecánicas que enganchen, creatividad, prototipado.
- Instalación: Niky busca e instala las skills en `comunicacion-ias/kit/skills/` (rama `niky/skills-movil-1511`), con vetting: leer cada `SKILL.md` entero, verificar que la skill existe y está mantenida, nada de humo. Cuando llegue su informe final de skills, Anita instalará cada skill ella misma siguiendo sus instrucciones (ruta, comandos, verificación) tal cual. Si alguna skill es de pago o necesita API key o herramienta de pago, se apunta aparte con su coste para que Daniel decida: no se instala en silencio.
- Reglas que no cambian: solo las skills de la lista de Grok + las nuevas que se instalen por esta misión. Ningún juego se fabrica sin que Daniel apruebe antes el concepto y el mockup del diseño acabado. Arte premium primero. Daniel prueba la versión final antes de publicar nada.
- Estado: Scribble Striker r2.1 sigue en marcha (diseño cómic aprobado por Daniel). El análisis de la competencia está en marcha (rama `niky/analisis-competencia-yt`) y responderá cómo ser los mejores y qué ayuda necesitamos.

**5. Estado tras los descartes**
- Ramp Physics: Ragdoll Crash Test ENTREGADO (PR #14, zip 2,06 MB, 56/56 checks, 30/30 niveles) — PENDIENTE del veredicto de Daniel (no está entre los 5 descartados de la issue #20).
- Juego 7 Grid Defender: NO EMPEZADO — bloqueado por las reglas nuevas (primero concepto + mockup aprobados por Daniel).
- Scribble Striker r2.1 sigue en marcha (diseño cómic opción 4 elegido y aprobado por Daniel 17:52/17:55; se adapta al juego real: línea central con rebote, dibujo en diagonal, círculos pequeños, gol solo entre palos, campo ocupando la gran mayoría de la pantalla).
- Traffic Chaos: New York Rush sigue en cola (se fabrica cuando acaben los juegos actuales).
- Key Block Escape y KO Relámpago siguen descartados: no se retoman.

## Preguntas abiertas para Daniel

1. **Título EN de Cofre del Doblón:** «Doubloon Rush» (propuesto, verificado libre en Playgama) vs «Gold Doubloon Chest Rush» (título de la idea original). Decide Daniel. *(Sin efecto: Cofre descartado 15/11 ~18:40; nada se publica de él.)*
2. **Repo de entrega:** Estampida r13 y Barista r7 se entregaron en el repo privado `dana-games-juegos`, mientras Seagull Attack y Cofre del Doblón están en el público `estudio-dana-oficina`. ¿Dónde deben vivir las entregas? *(Sin efecto para los descartados; pendiente solo para futuras entregas.)*
3. **PEGI 3 vs YouTube Playables 13+:** el issue dice PEGI 3, pero Playables exige audiencia 13+ y prohíbe contenido para niños. El juego y el marketing de Cofre se hicieron en tono 13+. ¿Se mantiene PEGI 3 en la ficha de Playgama? *(Sin efecto: Cofre descartado 15/11 ~18:40.)*
4. **Número de skills:** la orden dice 66; la constructora de Cofre contó 54 carpetas en `kit/skills/` y `skills.json` dice 56. La auditoría de Seagull Attack verificó 66 SKILL.md (13 anidadas de threejs). ¿Cuál es la lista correcta? *(En curso: la misión de skills de la issue #20 instala y verifica las skills nuevas; el informe final de Niky dirá la lista.)*

## Autorrevisiones

(APROBADO o DEVUELTO de los juegos de Niky, con fecha, slug, ronda y lo comprobado.)
