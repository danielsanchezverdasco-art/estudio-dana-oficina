# Obligaciones paso a paso para generar videojuegos jugables para YouTube

**Orden de Daniel (15/11/2026, 19:22): decirle a Anita PASO A PASO las obligaciones SIN EXCEPCIÓN para generar videojuegos jugables para YouTube. No saltarse nada, sí o sí.**

Este documento es la norma obligatoria para TODOS los juegos del estudio, también los de Anita. Ningún paso se salta. Si un paso no se puede cumplir, el juego se para y se avisa, nunca se sigue adelante sin él.

## Paso 1 — Revisar las 147 skills UNA A UNA antes de cada juego

Antes de construir cada juego, revisar las 147 skills del kit (`comunicacion-ias/kit/skills/`: las 66 de Grok + 81 nuevas, PR #27, informe en `comunicacion-ias/informe-skills-calidad-2026-11-15.md`) una por una, y elegir las que más convengan a ESE proyecto. Documentar la selección por escrito: qué skill, para qué parte del juego, por qué esa y no otra. Sin esa revisión no se empieza a construir.

## Paso 2 — Teardown del género

Estudiar qué hace el top de su género y qué vamos a superar: mínimo 3 puntos para superar al mejor, con datos reales y fuente. Nada se construye sin saber a quién hay que ganar.

## Paso 3 — Concepto + mockup del diseño acabado

Concepto del juego y mockup del diseño acabado (pantalla principal + partida), fiel a lo que el juego será. Arte premium desde el principio: el arte es la mecánica.

## Paso 4 — Daniel aprueba concepto + mockup

SIN la aprobación de Daniel no se fabrica nada. Si el mockup no le gusta, no se construye: se rehace el mockup.

## Paso 5 — Preview EXACTA desde dentro jugando

Antes de producir, entregar la preview exacta de cómo se vería el juego internamente jugando un player normal: la partida en marcha tal como la ve un jugador normal (HUD real, puntuación, controles, estado de la partida a mitad de juego, el dedo donde toca). No arte promocional ni portada: tiene que poder ponerse al lado del juego terminado y compararse — misma composición, mismos elementos, mismo HUD. Es la guía visual de cómo queremos que el juego acabe llegando al consumidor; durante todo el desarrollo, cada pantalla se compara con su preview y no se sale de ella. Luego se puede ir cambiando según lo demande el juego, pero es el objetivo al que se construye.

## Paso 6 — Prototipo desechable

La mecánica en crudo, sin arte, para probar si engancha antes de invertir en arte. Si el prototipo no engancha, se cambia la mecánica, no se sigue adelante.

## Paso 7 — Arte premium primero, fiel a la preview aprobada

Generación de assets COMPLETA sin saltarse nada — sprites, personajes, fondos, efectos, UI, audio — con mucha calidad, comparada con el top de su género y con la preview aprobada. Skills de assets: sprite-forge, spine, pixel-animation, sprite-atlas, character-rig, vfx-generate, blender ×9, create-game-assets, art-bible, sprite-gen (revisar una a una, paso 1).

## Paso 8 — Código con la plantilla

Construir sobre la mejor plantilla del mundo (Phaser 3 + TypeScript + Vite, Bridge Playgama + SDK ytgame):

- Game feel / juice en cada acción (un momento de satisfacción por acción).
- Guardado SOLO con `bridge.storage` (prohibidos localStorage, IndexedDB, cookies).
- Intersticial en pausa natural (nunca en nivel 1 ni a mitad de ronda).
- Rewarded opt-in (recompensa solo si se ve entero).
- Audio en pausa durante anuncios y al perder foco.
- Botones principales ≥ 88 px.
- Zonas táctiles con hitArea y test centro + 4 esquinas + toque fuera.
- Sin `window.__*` ni parámetros de prueba en producción. Dos builds separadas (producción y pruebas).

## Paso 9 — Playtest humano

3 de 3 playtesters tienen que decir que es divertido. Si no, se vuelve al paso 6 (prototipo), no se maquilla con arte.

## Paso 10 — QA técnica

- 0 defectos táctiles.
- Carga < 5 s.
- Bundle < 15 MiB.
- 60 FPS en móvil real.
- 0 errores de consola.
- Zip ≤ 5 MB.
- Portadas 800×800 / 1080×1920 / 1920×1080 con el sello Dana Games (las de YouTube sin sello, con sufijo `-youtube`).
- `listing.txt` (EN primero, ES segundo).
- Capturas 390×844.
- GIF 8–10 s que acaba en victoria.

## Paso 11 — Daniel prueba la versión final

SIN su prueba y visto bueno NO se publica nada en Playgama ni en YouTube. Él decide qué se publica y qué no.

## Paso 12 — Publicar en Playgama / YouTube Jugables

Con la ficha completa. Inglés primero, español segundo. PEGI 3. YouTube NO es contenido para niños. Nunca copias de juegos conocidos. Solo marketing orgánico.

## Paso 13 — Short de YouTube + marketing de cada juego

Short de YouTube y marketing orgánico de cada juego publicado.

## Paso 14 — Métricas del juego y siguiente juego

Medir el juego publicado y pasar al siguiente. Un juego bien hecho por ciclo.

## Reglas de trabajo (siempre)

- Rama propia + PR por juego.
- Constancia en `anita.md` con fecha y hora de Madrid: qué hizo, skills usadas y entrega.
- Nada de publicar sin el APROBADO de Daniel.
- Si un paso no se cumple, el juego se para y se avisa. Nunca se salta un paso en silencio.

## Historial

- 15/11/2026, 19:22 — Orden de Daniel: paso a paso obligatorio, sin excepción. Issue [ORDEN] en el estudio + este documento. Rama `niky/anita-obligaciones-1511`.
