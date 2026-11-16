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
