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

## QA final: Traffic Chaos: New York Rush · 16/11/2026, 01:52, hora de Madrid

- **Veredicto: APTO PARA QUE DANIEL PRUEBE.** Daniel lo forzó; la puerta final está cerrada.
- **Dónde está:** repo privado `danielsanchezverdasco-art/dana-games-juegos`, rama `niky/traffic-chaos-real`, carpeta `traffic-chaos/`, entrega en `entregas/traffic-chaos-real-round1/` (sin commit ni push en ese repo).
- **Verificado:** `npm test` 77/77, `tsc` 0, builds playgama/youtube/qa 0, precheck 0 FAIL en los 3; driver propio 0 fallos (Menú→Game→Pausa→Reanudar→Resultado→Reiniciar, caos, camión atascado, victoria ★★★); capturas 390×844 vistas una a una; portadas 6/6; GIF 9,6 s que acaba en LEVEL CLEAR!; **vídeo de preview `video-preview-1280x720.mp4` (1280×720, 25 fps, 6 s): choque de 3 coches con slow-mo, sin texto explicativo**; zips 2,68 MB (≤5 MB); ruta jugable `dist-playgama` (`python3 -m http.server --directory dist-playgama`).
- **Arreglado por QA:** listing — "Ambulances ignore red lights" era FALSO (la mecánica real es la *siren yield*: el tráfico se para ante la sirena, la ambulancia obedece su semáforo) y "buses and taxis each score differently" impreciso (taxi = coche = 10, bus = 15); solape título/strip en el menú 1:1 (título 44 px, strip H*0,235, píldora H*0,315; rebuild completo tras el arreglo).
- **Salvedades honestas:** verify.py da FAIL (6) en este sandbox por artefactos de tiempo (rAF ~10× lento, 2 FPS) — el driver propio pasa el mismo flujo con 0 fallos; 5 defectos menores conocidos, ninguno bloqueante (11 WAV muertos de 308 KB en `public/assets/sfx/`, señal del camión atascado pequeña, `win-final.png` a mitad de pop-in, ficheros Bridge inertes en el zip de YouTube, WARN JS 1.595 KiB > 512 KiB SHOULD).
- **Lecciones del vídeo (7 tomas):** el modo practice bloquea el choque; el tap en PLAY a 16:9 va al centro de pantalla (mundo lógico 2311×1300); el forcing "reckless" no choca en el sandbox (colas detrás de líderes); el choque se fuerza teletransportando 2 coches solapados en la caja de conflicto con `baseSpeed = 0`; el tutorial solo se apaga con `s.tutorial.onSkip()` (tocar `tutorialStep` lo recrea `tick()`); el banner de intro tarda ~2 min de pared en irse (esperar a que no queden objetos a profundidad 9000). Detalle en `informe-ronda1.md` §6.
- **Skills usadas:** `localize`, `game-ui-ux`, `smoke-testing-web-games`, `certification-checklist`.
- **Por dónde seguir:** Daniel prueba el juego (dist-playgama o zip de Playgama); si pide cambios, van a la rama `niky/traffic-chaos-real` y se re-verifican con el driver `qa/qa-final-driver.py`.

## Scribble Striker r2.2 · 16/11/2026, 06:30, hora de Madrid (EN MARCHA)
- **Pedido de Daniel (06:09, tras probar la r2.1):** «el de fútbol está bien, lo único necesitamos que la línea central cuente como rebote y sea mucho más grande el campo de fútbol, está muy pequeño».
- **Qué estoy haciendo ahora mismo:** (1) la línea central rebota SIEMPRE y SE VE (trayectoria reflejada, flash dorado de toda la línea, etiqueta «¡REBOTE! LÍNEA CENTRAL», sonido nuevo, movimientos a la central en dorado antes de tocar); (2) campo 8×14 que domina la pantalla (~71% de alto, ~88% de ancho) con cromo fino arriba/abajo.
- **Assets nuevos desde cero (regla de Daniel 06:14, nada reutilizado ni estirado):** hierba 1024×1792 para el campo 8×14, balón cómic nuevo, tira de chevrones dorados para la central, burst de impacto. Porterías/stands/menú/personajes se conservan (escala uniforme, no están en el pedido).
- **Estado 06:30:** lógica + tests (vitest 18/18, tsc 0) + assets procesados (0,61 MB) + builds prod/QA OK. Queda: sonda en vivo del rebote en los 8 ángulos, playtest10 + sonda nivel 1/6 (curva), corners, capturas 390×844, GIF con gol, zip ≤5 MB, push + PR.
- **Rama:** `niky/scribble-striker-r2.2-1611` (repo privado dana-games-juegos). Queda orientativo: ~1,5-2 h hasta la versión jugable para Daniel.

## Scribble Striker r2.2 · 16/11/2026, 07:00, hora de Madrid (EN MARCHA)
- **Sonda del rebote central EN VIVO: APROBADA.** 26 pasos en 2 jugadores, 0 fallos: el balón rebota en la línea central en 7 direcciones distintas, el turno NO cambia en el rebote y SÍ cambia en paso normal, los anillos a la central son dorados (goldRings == centreMoves siempre). La etiqueta «¡REBOTE! / ¡LÍNEA CENTRAL!» + «WOW!» + combo se ve en captura. (vitest 18/18 cubre los 8 ángulos en lógica.)
- **Fallo encontrado y arreglado en la revisión visual (06:50):** la portería superior quedaba tapada por el burst blanco del marcador (el campo 8×14 la subió hasta ahí). Arreglo: burst aplastado verticalmente (scaleY 0.4) + etiqueta de rebote con clamp más ancho (no se cortaba en los bordes). Verificado en captura: portería superior visible, campo ~73% de alto, tira de chevrones dorada visible.
- **Batería QA en marcha (07:00):** playtest10 → sonda niveles 1/6 → corners → capturas → GIF → precheck. Queda orientativo: ~1,5 h hasta la versión jugable para Daniel.

## 16/11 ~07:15 — Scribble r2.2: CAMPO EL DOBLE HECHO Y VERIFICADO EN JUEGO
- Rediseño v2 (Daniel 07:03): tablero 8x16, hierba A SANGRE en toda la pantalla, HUD flotante en esquinas (píldora de puntos arriba-izquierda, pausa/deshacer arriba-derecha, abandonar abajo-izquierda, aviso de turno breve que se desvanece). Sin personajes en la pantalla de juego.
- Medido en vivo 390x844: hierba jugable 364x728 CSS (86% alto, 93% ancho), 1,62x el área de la r2.1; el verde llena el 100% de la pantalla. El 2,0x literal no cabe en un móvil con porterías: esto es el máximo con celdas tocables (45 CSS). Lo digo con los números, no prometo lo imposible.
- Tutorial con la mano oficial señalando ¡A JUGAR! (3 pasos claros, se puede saltar) y SIN líneas amarillas en diagonal — verificado en capturas frescas.
- Rebote central: turno NO cambia y combo x1 tras tocar la central (verificado en vivo); tsc 0, vitest 18/18.
- Queda: batería completa (playtest10, niveles 1/6, corners, capturas, GIF, precheck) + sonda de rebote en los 8 ángulos + probes de tutorial, luego zip, push y PR. ETA ~1,5-2 h.

## Scribble Striker ONLINE (multijugador por turnos) · 16/11/2026, 07:10, hora de Madrid (EN MARCHA)
- **Pedido de Daniel (07:03, aprobado; 07:09: «Pon todo en ese juego, lo necesitamos hoy funcionando y perfecto»):** modo multijugador online por turnos. El juego es por turnos (uno dibuja, luego el otro): el servidor empareja a dos jugadores y les pasa las jugadas.
- **Qué estoy haciendo ahora mismo:** (1) servidor pequeño (Node + WebSocket) que empareja, valida cada jugada con la lógica del tablero (la misma `Board` del juego, sin duplicar reglas), gestiona desconexiones/reconexiones (30 s de gracia) y tiempos (aviso a los 45 s, pierde por tiempo a los 60 s); (2) modo online en el juego: botón ONLINE en el menú, búsqueda de rival con cancelación, partida en vivo (la jugada del rival se dibuja en tu campo), revancha al acabar, turno siempre claro, vista girada 180° para el jugador de arriba (cada uno ve su mitad abajo); (3) reglas intactas (gol solo entre los palos, línea central con rebote, diagonal libre).
- **Despliegue:** `render.yaml` (Blueprint de Render, plan gratis) + pasos en `server/README.md`. El despliegue en Render lo hace Daniel con un clic (hace falta su cuenta); el cliente reintenta el arranque en frío y avisa si el servidor no responde. En local: `npm run dev` en `server/` + `?online=ws://127.0.0.1:8890`.
- **Rama:** `niky/scribble-striker-online-1611` (repo privado dana-games-juegos), worktree `~/workspace/wt-scribble-online`. NO toco las ramas de la r2.2 ni de skins; la fusión de las 3 ramas de Scribble queda pendiente al final. Queda orientativo: ~2-3 h hasta la versión jugable para Daniel.

## Scribble Striker ONLINE · 16/11/2026, 07:45, hora de Madrid (EN MARCHA)
- **Servidor TERMINADO y verde:** `server/` (Node + WebSocket, `ws`), empareja, valida cada jugada con la misma `Board` del juego (sin duplicar reglas), reloj de 60 s (aviso a los 45 s), gracia de reconexión 30 s, revancha con asientos intercambiados, límite 10 jugadas/s, `render.yaml` (Blueprint Render gratis, región Frankfurt) + `server/README.md` con el despliegue paso a paso. Tests 5/5 (partida completa entre 2 clientes simulados, jugada ilegal + resync, reconexión, tiempo, revancha). Dos fallos reales encontrados y arreglados por los tests: el servidor se caía con una jugada ilegal (el `step` tira más que el `canMove`) y el límite de velocidad tragaba jugadas en silencio.
- **Modo online EN EL JUEGO:** botón ONLINE en el menú (junto a JUGAR) + lobby (buscando rival, cancelación, error claro si el servidor no responde con reintento y salida a jugar sin conexión). En partida: el tablero local es un espejo del servidor (ninguna jugada se aplica en local: se anima solo lo que el servidor confirma), turno siempre claro, aviso a los 15 s, aviso si el rival se va/vuelve, reconexión automática, revancha al acabar (asientos intercambiados), victoria online +15 monedas. Reglas intactas (r2.1: gol entre palos, rebote en la central, diagonal libre).
- **Verificado hasta ahora:** tsc 0, vitest 22/23 (el test de rendimiento de la IA dura falló una vez por carga de la VM, 433 ms frente a 400 ms; aislado pasa 2/2, no lo toco). Pendiente: builds playgama/youtube/qa, partida online real de punta a punta entre 2 clientes en el navegador (sonda en marcha), capturas 390x844, GIF, zip ≤5 MB, QA APTO, push + PR. ETA ~1-1,5 h hasta la versión jugable.
- **OJO para la fusión:** mi rama sale de la r2.1 (tablero 8x10); la r2.2 cambió el tablero a 8x16 — al fusionar, el servidor (`BOARD_W/H` en `server/src/index.ts`) y el espejo tienen que pasar a 8x16. Lo dejo anotado en la PR.

## 16/11 ~08:23 — Scribble r2.2: PR #6 ABIERTA + assets revisados (todo vector)
- **PR #6**: https://github.com/danielsanchezverdasco-art/dana-games-juegos/pull/6 — rama `niky/scribble-striker-r2.2-1611`, commit `6d389a8`. Zip jugable 3,52 MB dentro de la rama. Daniel prueba la versión final (puerta de producción).
- **Verificado para la PR**: tsc -b 0, vitest 18/18, sonda central v2 0 fallos (7 direcciones), campo medido 364x728 CSS (1,62x la r2.1), tutorial con mano + salto, sin diagonales amarillas, precheck 0 FAIL, zip 3,52 MB, 0 `window.__` en el bundle.
- **Revisión de assets (Daniel 08:20, los 7 uno a uno)**: hierba, balón, tira central, burst, tut-draw/goal/bounce — TODO cómic vectorial (colores planos, bordes negros gruesos, semitono, cel-shading), cero foto, cero realismo, cada uno hecho para este juego y su jugada. NADA que rehacer.
- **Batería**: el playtest10 de 10 niveles se paró a los 56 min (muro de velocidad de SwiftShader, 4-10 s por interacción — NO es un fallo del juego; el tutorial se descarta bien, medido en diagnosis). Sigue en marcha la sonda de curva niveles 1/6 + corners + capturas + GIF; resultados al terminar.
- **Límite honesto**: el 2,0x literal no cabe en 390x844 con porterías; 1,62x + hierba a sangre es el máximo con celdas tocables.

## 16/11 ~08:26 — Scribble r2.2: Daniel 08:25 confirma el estilo (torre = referencia)
- Daniel aprobó la hoja de assets de la torre: ASÍ quiere los diseños en todos los juegos — cada juego con su estilo diferente, nunca realismo ni fotos. La r2.2 ya va en esa línea (cómic vectorial propio del fútbol): se sigue así, sin cambios. Dejado por escrito en el informe r2.2 §6 y ESTADO.md (commit `2dac23b` en la PR #6).
- **Batería: la primera murió con el runtime (~08:21)** — la sonda 1/6 quedó sin EXIT ni JSON y los servidores QA cayeron. Servidores re-levantados (200/200) y **batería reanudada (r22b) en marcha desde las 08:26 CET**: sonda 1/6 → corners → capturas → GIF → precheck. El playtest10 NO se repite (parado a los 56 min por el muro SwiftShader, no por fallo del juego).

## 16/11 ~08:27 — Scribble r2.2: aclaración de estilo de Daniel (08:26)
- Valen muchos estilos (LEGO, Simpson, Minecraft…) siempre que sean vector; hay que elegir el que mejor quede con cada juego. Para Scribble el elegido es el cómic vectorial: se sigue así, sin cambios. Registrado en el informe r2.2 §6 y ESTADO.md (PR #6).

## 16/11 ~09:05 — ¡Trato Hecho! Trueque de Blanditos: CONCEPTO + MOCKUP listos para Daniel
- **Qué es:** concepto + mockup (preview exacta) de la idea nueva de hoy (32/35, PR #75): trade-up ladder con squishies — empiezas con un blandito pequeño y vas cambiando hasta el más raro. Ritual ✓/✕/+ de TikTok, bots con manías, trato del día, colección de 46.
- **Veredicto: APTO para presentar** (con una condición: el título en inglés). **⚠️ «Squishy Swap» ESTÁ PILLADO** — lo usan una app de iPhone (emmyfreed.com), «Dumpling Trade: Squishy Swap» en Google Play (SinoJoy, nov 2026, 17k installs) y «Slime & Squishy Swap». Opciones para Daniel: 1) **Squishy Trade-Up!** (propuesta principal), 2) Squishy Deals, 3) The Great Squishy Trade. El ES «¡Trato Hecho! Trueque de Blanditos» no tiene colisión.
- **Dónde está:** `comunicacion-ias/trueque-blanditos/concepto-squishy-swap-2026-11-16.md` + preview `media-generation-preview-squishy-swap-trade-up.webp` (pantalla exacta: «TRADE UP!», escalera Common → Mythic, HUD 1.250 monedas / nivel 7 / colección 12/46, esterillas YOU y MAYA, botones ✓ DEAL! / ✕ NO / + ADD MORE, banner DAILY DEAL). Estilo 100% Videojuego Animado (directiva 16/11 08:15): vector, cero fotos, cero realismo.
- **Evidencia:** #tradingfidgets 72,2 M vistas TikTok; Mrs. Bench × World Tech Toys 4/11; Fidget Trading: Dumpling Party 4,1 M installs (#2 nuevos casuales US/ES/CA/AU/PT); mercado fidget 9.010 M$ → 17.650 M$ en 2034. Hueco en Playgama: con «trade» solo Squishy Resale (fabrica por encargo, no trueque); nadie hace la escalera de trueque.
- **⚠️ Conflicto en el manual:** `kit/brief-juego-comun.md` todavía dice «ESTILO VISUAL OBLIGATORIO: REALISTA DE VIDEOJUEGO (15/11)». Quedó derogado por la directiva del 16/11 08:15 (vector animado, cero realismo). El brief hay que actualizarlo; este concepto ya sigue la norma nueva.
- **Skills que encajan (kit revisado):** diseño (game-design-fundamentals, designing-mini-games, game-docs, onboarding-and-teaching, difficulty-and-balancing, pacing-and-the-player-journey); arte (art-bible, create-game-assets, directing-game-visuals, game-ui-ux, game-feel, mobile-games, styling-web-game-typography, art-direction-and-readability, auditing-game-screen-readability); calidad (review-game, game-quality-gates, game-polish-audit, juice-audit, game-juice, evaluating-gameplay-balance, playtest-report); marketing (hook-writer, thumbnail-design, viral-reverse-engineering, youtube-shorts, playgama-game-video). No aplica: threejs-*, phaser-arcade-physics, shader-programming, physics-tuning. SpriteCook NO se usa.
- **Qué falta:** que Daniel apruebe el concepto y el mockup y elija el título en inglés; verificar el título en Playgama; teardown; preview final; prototipo (10 trueques por bot). **El juego NO se fabrica todavía.**
- **Herramientas:** generación de imágenes, navegador, Node + Phaser 3 + TypeScript, ffmpeg.
