SHARED STANDARDS (Dana Games, owner Daniel; same quality bar as our first game "Metro Nightmare"):
- Phaser 3 + TypeScript + Vite + Vitest. HTML5 game for Playgama -> YouTube Playables. Mobile-first: PORTRAIT 390x844 primary (also works landscape/desktop), touch, big buttons (>=88px main actions), fast load (build zip < 5 MB, no external URLs, no data: fetches, fonts as TTF via @font-face, CSP connect-src 'self' safe).
- English default language, Spanish second (ES/EN chip on menu, saved). All text via i18n tables.
- Art: polished colorful 2D CARTOON art (generated sprites/backgrounds, consistent style, thick outlines), juicy animation (squash/stretch tweens, particles, screen shake, confetti), NOT simple flat shapes. Characters always with UNIFORM scale, never deformed. No letterboxing/black bands: fill the screen.
- All UI screens (menu, results, pause) must be in-game cartoon UI drawn in Phaser, never plain HTML cards.
- No intro / no splash video. Only the "Dana Games" logo badge in a corner of the covers.
- First level is an interactive tutorial with an animated hand showing exactly what to tap/drag; super intuitive, readable by a child.
- Long sessions (target >=5:00 average): many levels (procedural or hand-made 30+), level strip, stars, streak, daily challenge, NEXT button that auto-advances after 8 s.
- Playgama Bridge SDK (playgama-bridge, script from their CDN is injected by Playgama; guard for absence): game ready / loading progress calls, save via bridge storage with localStorage fallback, interstitial placement 'level_completed' every 2nd completion (never on first level nor first retry, never mid-round), rewarded placement for a helpful boost (e.g. extra time / extra life / undo) shown when player struggles and on fail screen. Pause audio during ads.
- Sound: short generated SFX optional (if added, make sure audio unlock doesn't use data: URLs).
- Deliverables into /cursor/stores/self/uploads/: 
  * <slug>-playgama.zip (index.html at root, relative paths)
  * covers: cover_800x800.png, cover_1080x1920.png, cover_1920x1080.png (key art + game title + small Dana Games badge corner)
  * listing.txt: EN + ES title, short & long description, controls, tags, genre
  * 6 phone screenshots 390x844 (tutorial, gameplay x3, win, fail) + a short gameplay GIF
- Tests pass, build passes, zero console errors. Report: what the game is, how it plays, level count, ad placements, sizes, file paths.

MAIN MENU (Daniel's explicit request, 15/11/2026: the first game's menu was "horrible"): the main menu must be a beautiful, INTERACTIVE, animated cartoon scene, not a static title + buttons. Requirements:
- Full-screen illustrated themed scene (the game's world) with living animation: characters idling/reacting, parallax background, floating particles, title logo that bounces in and wobbles when tapped.
- Big juicy PLAY button (pulsing, squash on press, sparkle), secondary round icon buttons (levels map, daily challenge, settings, ES/EN) with icons, press animations and sounds-ready hooks.
- Tapping characters/objects in the menu triggers fun micro-reactions (easter eggs) so the menu itself feels like a toy.
- Smooth animated transitions between menu, level map and gameplay (wipe/zoom, no hard cuts).
- A level-select map screen (path with nodes, stars per node, current node highlighted with the player avatar).
- Show streak/coins/stars counters in the top bar as cartoon pills.
- Must look premium, like top Poki/YouTube Playables games. Screenshot the menu and level map for review.

PLAYABILITY & COMFORT (Daniel's verdict on Metro Nightmare: "not playable, not comfortable" - these games MUST be better):
- One-thumb play in portrait: all interactive targets >= 64px (main actions 88px+), everything reachable in the lower 2/3 of the screen; nothing tiny or fiddly.
- One core verb, instantly understood in 3 seconds without reading text. Prefer TAP over precise drag; if dragging is needed, use generous snapping and forgiving hitboxes, drag offset so the finger doesn't hide the item, and undo.
- No precision rotation puzzles with tiny pieces; never shapes that change appearance between queue and board.
- Instant, clear feedback on every touch (highlight, sound hook, haptic-like bounce); clear win/lose reasons.
- Smooth difficulty curve: first 5 levels nearly impossible to fail; no frustration spikes; no tight timers early.
- 60 fps on mid phones, no input lag.
- Before reporting, PLAYTEST like a real player on a 390x844 touch emulation: play the first 10 levels start to finish, note any discomfort and fix it; report this playtest honestly (what felt bad, what you changed).

INTUITIVE & ADDICTIVE (Daniel played Metro: "not attractive, not addictive", wants MORE INTUITIVE):
- Zero-text onboarding: the screen itself shows what to do (glowing tappable item + hand). The player is playing within 2 seconds of PLAY. No instruction screens.
- Every tap gives a reward: pop sound hook, particles, satisfying animation, counters that tick up. Make the core action feel GOOD on its own (juice > content).
- Very short levels (20-60 s) chained instantly: "just one more" loop. Show progress to next reward on the results screen (e.g. 2/3 levels to open a chest).
- Near-miss tension: levels often end with the last 1-2 moves deciding the win; celebrate big on win (combo, confetti, slow-mo).
- Meta progression: coins -> unlock cosmetics/new characters/new themed areas every ~5 levels; a reward chest every 3 levels; daily streak gift.
- Visible goals: level map with next unlock teaser, stars to collect.
- Surprise & variety every few levels: a new obstacle/twist introduced with a 1-tap demo.
- Fail fast and retry instantly (1 tap), no punishment screens.

## NORMA FIJA DE DANIEL (15/11/2026): SIMPLE, INTUITIVO, ADICTIVO
- Cada juego tiene UNA mecánica sencilla que se entiende con el primer toque, sin leer nada (como Bus Jam: tocas y pasa lo obvio).
- Nada tosco: nada de piezas que giran, casillas que hay que entender ni reglas ocultas. Si hay que explicarlo, se simplifica.
- La jugabilidad es adictiva: niveles cortos, premio en cada toque, siempre las ganas de jugar uno más.
- El aspecto visual cartoon se mantiene. Lo que más importa es la jugabilidad.
- OJO (Daniel, 15/11/2026): SIMPLE NO SIGNIFICA FEO. Diseño visual al máximo nivel posible: arte cartoon pulido y detallado, personajes con animaciones vivas, fondos ricos, partículas, brillos, transiciones suaves, menús y pantallas de victoria espectaculares. Debe atraer a primera vista en la miniatura y en el primer segundo de juego.
- VARIEDAD (Daniel, 15/11/2026): no siempre juegos de encajar piezas tipo Tetris. Cada juego nuevo debe ser de un género distinto al anterior (acción, reflejos, gestión, cartas, carreras, física, runner, etc.).
- ACTUALIDAD Y VIRAL (Daniel, 15/11/2026): mucho enganche visual y temas de actualidad y virales del momento. Estudia los juegos de la competencia que ya funcionan (diseño de niveles, ritmo, feedback, menús, monetización) y haz una versión MEJOR y original. Nunca copies su código, sus dibujos ni su marca: YouTube rechaza clones.

## LECCIONES DE LA COMPETENCIA (teardowns)

Fecha: 15/11/2026 (Europe/Madrid). Análisis de tres éxitos públicos de géneros distintos: *Piece of Cake: Merge & Bake* (n.º 1 trending en Playgama, noviembre 2026), *Arrow Puzzle* (n.º 2 trending, vertical) y *Coin Run* (22 M de plays en YouTube Playables según TubeGames, 14/11/2026). Se estudiaron fichas, portadas oficiales y guías públicas. No se copió código ni arte. No se jugó partida en vivo en esta pasada: no inventes duraciones, curvas ni cadencias de anuncios que no estén aquí. El teardown completo está en `teardowns-competencia.md`.

Checklist para cada juego nuestro (usar antes de darlo por bueno):

- [ ] **La miniatura enseña el verbo.** En un vistazo se entiende qué tocar, sin leer (como el dedo y la flecha que sale, o el rollo de dinero eligiendo la puerta verde +200 / roja −50). Si la portada necesita un párrafo, se rehace.
- [ ] **Un dedo, una acción, a jugar en menos de 10 segundos.** Del loading al gameplay en un toque (o cero). Sin muro de tutorial, sin menús delante del primer nivel. Se enseña jugando: objetivo brillante + mano. Guía oficial de Playgama y listón público de Playables en 2026: «one-finger, ten-second onboarding».
- [ ] **Mecánica familiar con un giro, no un género nuevo incomprensible.** Combinar dos ideas que el jugador ya entiende (merge + restaurar un local; runner + imperio; vaciar un tablero + reto diario). No hace falta inventar una regla rara.
- [ ] **Cada partida alimenta un meta que se ve.** El resultado se convierte en algo tangible: un local que se repara, un negocio que mejora, un tablero que se vacía, una racha o una clasificación. El progreso no vive solo en un número pequeño del HUD.
- [ ] **Niveles o runs cortos, victoria fácil al principio, reintento en un toque.** Playgama pide victorias tempranas y que la dificultad suba después. Los hits de Playables fallan rápido y dan ganas de repetir. Nada de atascos ni timers estrictos en los primeros niveles.
- [ ] **El feedback es el gancho visual.** Cada toque se lee al instante (contraste de color, número enorme, objeto que sale disparado, brillo, squash). Arte saturado y pulido, un solo foco en portada y en el primer fotograma. Simple de jugar no significa plano ni feo.
- [ ] **Anuncios solo en pausas naturales.** Interstitial al ganar, al fallar o en el resultado de una run, nunca a mitad de la acción. El Bridge retrasa el primero: no pongas un interstitial propio en el nivel 1 ni en el primer reintento. Rewarded opcional y claro (pista, revivir una vez por intento, doblar premio); se puede rechazar y no es obligatorio para avanzar.
- [ ] **Género distinto al anterior, apuntando a lo que ahora engancha.** No repetir siempre encajar piezas. En el análisis público de altas de Playables (jul–sept 2026) tiraron con fuerza: puzzles de dibujar/escapar, física y choques, tycoon, belleza/moda, ragdoll/acción y carreras arcade. Mejorar lo que ya funciona, con tema actual y visual de primer nivel, sin clonar código, arte ni marca.

## SELLO DANA GAMES: LO QUE NOS HACE ÚNICOS (Daniel, 15/11/2026)
Objetivo: que cualquier jugador reconozca un juego de Dana Games a primera vista y que visualmente seamos los más potentes del catálogo.

1. IDENTIDAD DE MARCA COMÚN
   - SIN INTRO: Daniel ha pedido quitar la intro de la mascota. El juego arranca directo a jugar.
   - La mascota de Dana Games (el pulpo morado del logo) aparece como cameo escondido en cada juego (en un cartel, en la tienda, como aspecto desbloqueable).
   - Estilo propio: cartoon con contorno grueso, colores saturados, sombras suaves e iluminación cálida, con la misma tipografía de títulos en todos los juegos (Lilita One o similar libre).
   - Los botones, ventanas de resultados y cofres son del mismo «kit Dana» en todos los juegos (mismas formas y animación de rebote), adaptados al color del tema.
   - Firma de victoria: confeti, estrellas que vuelan al contador y la mascota que celebra.

2. INGENIERÍA INVERSA OBLIGATORIA ANTES DE PROGRAMAR
   - Elegir los 2 o 3 mejores juegos del mismo género (Playgama, YouTube Playables, top de las tiendas) y analizarlos con las herramientas de /workspace/tools (source-map-explorer, phaser-juice-scan.py, Lighthouse) y las skills phaser-analyze y review-game.
   - Anotar en teardown.md:
     - qué hacen en los primeros 10 segundos;
     - el ritmo de recompensas;
     - el jugo (tiempos de tween, partículas, sonido);
     - la curva de dificultad;
     - los anuncios;
     - qué falla y cómo lo hacemos mejor.
   - Copiar la técnica, nunca el código ni el arte.
   - El juego debe superar al mejor de ellos en al menos 3 puntos concretos, apuntados en teardown.md.

3. SONIDO Y SENSACIÓN
   - Música en bucle alegre y sin derechos (o generada), efectos para cada toque, acierto, fallo, combo y cofre.
   - Botón de silencio visible.
   - El audio arranca tras el primer toque.
   - Vibración ligera (navigator.vibrate) al acertar y al fallar, si el dispositivo lo permite.

4. MOMENTOS PARA COMPARTIR (Shorts)
   - Cada juego tiene al menos un momento espectacular grabable: combo enorme, casi derrota salvada o caos gracioso. Sirve para el Short y es el gancho de la portada.

5. REQUISITOS DE YOUTUBE PLAYABLES Y PLAYGAMA
   - Sin enlaces externos.
   - Pausa y silencio automáticos al perder el foco (visibilitychange y eventos del SDK).
   - Guardado mediante el SDK cuando exista y localStorage como respaldo.
   - Carga inicial de menos de 3 s en 4G y un zip de menos de 15 MB.
   - Sin errores en consola.
   - Funciona en vertical y en horizontal sin romperse.

6. RETENCIÓN
   - Reto diario y recompensa por volver al día siguiente.
   - Colección de aspectos.
   - Mundo o mapa que cambia al avanzar.
   - Pequeño anuncio dentro del juego de otro juego de Dana Games (promoción cruzada interna, sin enlaces externos si la plataforma no lo permite).

7. ACCESIBILIDAD Y CLARIDAD
   - Los colores se distinguen también por forma o icono (daltonismo).
   - Contraste alto.
   - Nada esencial depende de leer texto.

8. ENTREGA EXTRA
   - teardown.md con lo que se aprendió de la competencia y los 3 puntos en que la superamos.
   - audits.md.
   - Medición del tiempo hasta el primer toque y del peso del zip.

## MARKETING ORGÁNICO Y SEO (Daniel, 15/11/2026)
Solo marketing orgánico: nunca se compra promoción, visitas, seguidores ni interacciones.

SHORTS DE CALIDAD (estudiando antes a la competencia)
- Antes de grabar, analiza 5 a 10 Shorts y TikToks con más vistas de juegos parecidos: el gancho de los primeros 1-2 segundos, la duración, el ritmo de cortes, el texto en pantalla, la música y el sonido, el final en bucle y la llamada a jugar. Apunta todo en shorts-teardown.md.
- El Short dura 15-30 s y es vertical a 1080x1920 y 60 fps si se puede.
  - Gancho visual en el primer segundo, con un fallo gracioso, un «¿puedes hacerlo?» o un casi imposible.
  - Un corte o cambio cada 1-2 s, y texto grande corto y legible en móvil.
  - Sonido potente de efectos y música libre de derechos.
  - El final enlaza con el inicio, en bucle.
  - Una llamada a jugar al final.
- Graba 2 o 3 versiones con ganchos distintos para ver cuál funciona mejor.

SEO PARA YOUTUBE Y PLAYGAMA
- Investiga las palabras clave reales del género, con las sugerencias de búsqueda de YouTube, Google Trends y los títulos de la competencia que más funcionan, en inglés y español.
- Título del juego y de los Shorts: palabra clave principal al principio, con gancho y corto (menos de 60 caracteres).
- Descripción: las 2 primeras líneas con palabras clave y el enlace para jugar; después, qué es el juego, por qué engancha y las palabras clave secundarias de forma natural, sin repetirlas en exceso.
- Entre 3 y 5 hashtags relevantes (#shorts #playables más los del género y el tema) y etiquetas completas en Playgama (género, mecánica, tema, «casual», «puzzle», etc.).
- Ficha de Playgama optimizada: título con la palabra clave, una descripción corta que venda en una frase, la larga con estructura, la categoría correcta y portadas con buen contraste.
- Entrega seo.md con las palabras clave elegidas, su fuente y los textos finales.

## SKILLS DE MARKETING Y VÍDEO
Antes de grabar el Short y de escribir los textos SEO, el equipo lee el playbook y las skills instaladas:

- Playbook: `/cursor/stores/bot/juegos/playbook-marketing-video.md` (en este store, `juegos/playbook-marketing-video.md`).
- Skills: `/cursor/stores/bot/juegos/skills-marketing/` (en este store, `juegos/skills-marketing/`).

Usa, como mínimo:
- `viral-reverse-engineering` para el análisis de 5 a 10 Shorts/Reels de la competencia (`shorts-teardown.md`).
- `hook-writer` y `virality` para los ganchos de los primeros 3 segundos (2 o 3 versiones).
- `youtube-shorts` para el guion, el ritmo, el bucle y el CTA.
- `youtube-publishing-and-metadata` e `instagram-seo` para título, descripción, caption y hashtags (EN y ES), con palabras clave reales y su fuente en `seo.md`.
- `thumbnail-design` y `ab-testing` para las portadas y para elegir el gancho o la cover ganadora, sin inventar resultados.

Solo marketing orgánico. Nunca promoción pagada, visitas ni seguidores falsos. No copies arte, música con copyright ni el contenido literal de la competencia.

## ESTILO VISUAL OBLIGATORIO: REALISTA DE VIDEOJUEGO (Daniel, 15/11/2026; manda sobre cualquier mención anterior a "cartoon plano")
- Daniel no quiere dibujos planos ni clip-art. Quiere todos los juegos en un estilo REALISTA DE VIDEOJUEGO: personajes detallados con volumen, ropa con pliegues y proporciones creíbles, y sombras y luces reales; escenarios con texturas (madera, metal, baldosas, tela), profundidad, iluminación ambiental y sombras proyectadas.
- REFERENCIA APROBADA: el estilo de los personajes de Metro Nightmare, en juegos/referencia-estilo-metro.png y referencia-estilo-metro-menu.png. Todos los juegos se miden contra esa referencia o mejor. Escenario y UI al mismo nivel que esos personajes, nunca una caja o un bloque de color liso.
- ANIMACIONES VIVAS en todos los personajes: caminar, idle con respiración o parpadeo, reacciones de alegría o enfado y celebración. Objetos con física creíble: peso, rebote y polvo.
- Portadas pintadas en ese mismo estilo realista, con personajes, título y una escena con gancho.
- El cuadrado plano, el fondo vacío y los iconos genéricos sin volumen son motivo de rechazo automático en la revisión.

## FILTRO OBLIGATORIO ANTES DE ENTREGAR (Daniel, 15/11/2026: "siempre es siempre")
El diseño visual y la jugabilidad son lo MÁS importante. Ningún juego se entrega a revisión sin superar este filtro. Si falla un punto, no se entrega: se corrige y se vuelve a pasar.
1. skills-usadas.md: lista de TODAS las skills usadas (las de /cursor/stores/bot/juegos/skills-marketing/, las del agente instaladas desde GitHub, las de juice/polish/game-feel, Remotion, ingeniería inversa, estándares de Daniel), con qué se hizo con cada una y la prueba (archivo o captura). Si una skill aplicable no se usó, se explica por qué.
2. filtro-visual.md: comparación lado a lado de las capturas del juego con juegos/referencia-estilo-metro.png. Cada pantalla (menú, nivel 1, nivel avanzado, victoria, derrota, tienda, mapa) se puntúa: personajes realistas con volumen y animación, texturas, luz y sombras, fondo lleno sin franjas vacías, UI al mismo nivel, nada cortado ni solapado. Cualquier pantalla por debajo de Metro = FALLO.
3. filtro-jugabilidad.md: niveles 1-10 jugados como un jugador nuevo (toques por nivel, se entiende en el primer toque sin texto, curva de dificultad, decisión real en cada nivel, ningún bloqueo ni pantalla vacía), comparado con el competidor principal del teardown.
4. Las tres comprobaciones se suben con los entregables. Sin ellas, el director rechaza el juego sin mirarlo.

## PIPELINE DE ARTE OBLIGATORIO: CÓMO SE HIZO METRO (repetir exactamente en cada juego)
1. Una IMAGEN DE REFERENCIA de estilo (la foto de Daniel, o juegos/referencia-estilo-metro.png) se usa como entrada de estilo en CADA generación del generador de imágenes. Nunca se genera arte sin referencia.
2. Paquete de arte completo ANTES de programar: fondo vertical y horizontal (1080x1920 / 1920x1080), TODOS los personajes con 3 expresiones (normal, contento, enfadado o agobiado), objetos, efectos, UI (botones, paneles, barras, bocadillos), logo y portadas. Para Metro fueron 34 personajes.
3. Sprites sobre fondo magenta, recortados con chroma key + despill, y canal alfa revisado. Los fondos se generan a 1280x720 y se escalan con Lanczos + unsharp.
4. Atlas de Phaser (JSON Hash) para personajes y UI, y textos NO incrustados en el arte (los pinta el juego).
5. MANIFEST.md con cada archivo, su tamaño, su uso y la cuadrícula. Ejemplo: juegos/skills-arte/MANIFEST-metro-ejemplo.md.
6. Skills de GitHub OBLIGATORIAS para el arte y la jugabilidad, en /cursor/stores/bot/juegos/skills-arte/: art-bible (estilo bloqueado), create-game-assets, sprite-gen, game-feel, game-ui-ux, audio-design, phaser-core, mobile-games, performance-optimization, evaluating-gameplay-balance y playtest-report.

## ESTRATEGIA DE MARKETING PROPIA (OBLIGATORIA, 15/11/2026)
Cada juego entrega `estrategia-marketing.md` con SU estrategia, basada en las skills de juegos/skills-marketing/ y datos reales de la competencia:
- Público objetivo y ángulo viral del juego (qué emoción engancha: rabia, satisfacción, "¿puedes?", humor).
- Palabras clave SEO en inglés y español (YouTube y Playgama), título < 60 caracteres por Short.
- Calendario de 7 días: un Short/Reel por día con gancho distinto (fallo épico, "solo el 1% lo pasa", satisfacción, antes/después, reto), guion de 15-30 s, primer segundo con movimiento y texto grande, final en bucle.
- Pruebas A/B: 2-3 portadas y 2-3 ganchos, con qué métrica decide la ganadora (CTR, % visto, visitas a Playgama).
- Promoción cruzada con otros juegos Dana Games.
Solo orgánico: nunca promoción pagada ni cifras inventadas.

## SKILLS PROFESIONALES (skills-pro) (Daniel, 15/11/2026)
Además de `skills-arte/`, `skills-competencia/` y `skills-marketing/`, el equipo lee y aplica las skills de `/cursor/stores/bot/juegos/skills-pro/` (en este store, `juegos/skills-pro/`). Van en `skills-usadas.md` igual que las demás.

Úsalas por fase:

- Idea y documento de diseño: `designing-mini-games`, `game-design-fundamentals` y `game-docs` (GDD de una página, alineado con el código).
- Tutorial y primera partida (FTUE): `onboarding-and-teaching` — enseñar haciendo, una mecánica cada vez, sin muros de texto.
- Niveles y dificultad: `level-design`, `difficulty-and-balancing` y `pacing-and-the-player-journey` (curva, ritmo de sesión, retención).
- Programación Phaser: `phaser-arcade-physics` (cuerpos, grupos, pools), `input-systems` (toques con buffer), `save-systems` (en Playgama el progreso va SOLO por Bridge Storage, requisito 3.2.1; `localStorage` solo fuera de Playgama), `playgama-bridge` (initialize antes de cargar el juego, `game_ready`, pausa/audio, anuncios), `web-game-performance` (medir frame time y draw calls, 60 fps en móvil), `physics-tuning` y `camera-systems` cuando el juego lo pida, `shader-programming` para efectos de luz o contorno.
- Arte y claridad en pantalla: `art-direction-and-readability` y `directing-game-visuals` (el estado de juego se lee sin texto), `styling-web-game-typography` (fuentes con licencia, HUD legible), `localize` para las tablas i18n ES/EN (aplicar el flujo de extracción y validación, sin los hooks de Claude del repo original).
- QA antes de entregar: `smoke-testing-web-games` (Playwright: carga, errores, crashes), `probing-web-game-mechanics` y `auditing-game-screen-readability` (capturas del menú, nivel, victoria y derrota).
- Publicación y analítica en Playgama (añadido 15/11/2026): `playgama-publish` (checklist de requisitos en vivo, `scripts/precheck.mjs` y `scripts/pack.mjs` antes de cada subida) y, tras publicar, `playgama-metrics-snapshot` (cifras reales con periodo y fuente) y `game-engagement-ideas` (dónde abandonan y qué cambio probar). Vídeo: `skills-marketing/playgama-game-video` para grabar tráiler o Short con el propio juego.

Estas skills no sustituyen el filtro obligatorio ni las de arte, competencia o marketing: se suman a ellas. Si un hueco no tiene skill fiable (SDK de YouTube Playables, analítica fuera de Playgama, Spine), se sigue la documentación oficial de la plataforma y las normas del brief, sin inventar una skill.
