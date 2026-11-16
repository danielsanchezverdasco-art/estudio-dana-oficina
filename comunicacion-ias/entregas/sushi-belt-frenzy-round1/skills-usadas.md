# Skills usadas — Sushi Belt Frenzy (ronda 1)

Protocolo de Producción Optimizado (15/11 22:07): **ninguna skill se salta**.

Lista completa: las 66 de `comunicacion-ias/kit/skills/` (lista de Grok).

Cada skill aplicable queda aquí con dónde se aplicó; cada skill no aplicable
con su POR QUÉ. Nada fuera de la lista.

**Cómo se leyó cada una:** las 7 nucleares se leyeron enteras antes de construir
(art-direction-and-readability, directing-game-visuals, difficulty-and-balancing,
level-design, game-feel-and-juice, onboarding-and-teaching, playtest-report).
Las demás se leyeron en su sección nuclear (aplicables) o se juzgaron por su
descripción + encabezado (no aplicables). El texto completo de cada skill vive
en `comunicacion-ias/kit/skills/`.

**De pago o con API key:** ninguna de las 66 exige pago ni clave. La música del
Short (si Daniel la quiere) necesita una pista con licencia — lo decide él, no
se instala nada en silencio.

## APLICADAS

### Diseño

| Skill | Dónde se aplicó |
|---|---|
| `art-direction-and-readability` (entera) | `biblia-arte-sushi.md`: paleta con rol de juego (naranja/gris/blanco-negro = gatos y platos, verde = wasabi/peligro, dorado = recompensa), contorno negro grueso en todo, símbolo además del color en cada gato y plato (●/▲/◆), contraste HUD. |
| `directing-game-visuals` (entera) | Dirección visual: restaurante cálido 3D-juguete, gatos con volumen (sombra real + brillo), cinta de madera con textura, chef que avisa con gestos; un protagonista (el plato que se mueve), un peligro (wasabi/salida), una recompensa (el gato comiendo). |
| `art-bible` (entera; el andamiaje Claude-Code — `.claude/docs`, director gates, yaml-helper — no existe en este workspace, se aplicó la sustancia) | `biblia-arte-sushi.md`: identidad visual, paleta con roles, reglas de trazo/color/textura y la regla anti-pixelado (vectorial a resolución real, canvas 4x). |
| `game-ui-ux` (núcleo) | HUD (burbuja LEVEL, píldora SCORE, corazones, barra de progreso SERVED, botón BOOST) en el espacio de diseño fijo 390×844; el HUD se actualiza por evento (al servir), no por polling. |
| `styling-web-game-typography` (entera) | Lilita One (títulos/números) + Nunito (cuerpo), solo los pesos adoptados, licencias OFL en `public/licenses/` y resumen en `THIRD_PARTY_LICENSES.md`; roles por elemento. |
| `auditing-game-screen-readability` (núcleo) | Auditoría por momentos contra el mockup aprobado + la biblia (menú, L1/L6/L8, pausa, mapa, tienda); hallazgos en `filtro-visual.md`. **Límite honesto:** sin capturas de navegador (Chromium muerto en la VM) — la auditoría visual con capturas reales queda para la ventana finisher. |
| `create-game-assets` (núcleo) | Pipeline de assets: biblia → generar a resolución real (canvas 4x) → verificar (mockup visto a la vista) → registro de licencias. Todo el arte es vectorial (`sushi.ts`), no bitmaps generados. |
| `sprite-gen` (núcleo) | Sprites procedurales del juego (3 gatos × 4 estados, chef × 2 poses, 12 platos de sushi + wasabi + dorado, cinta, moneda, cofre) a resolución real, verificados contra el mockup. |

### Desarrollo

| Skill | Dónde se aplicó |
|---|---|
| `phaser-core` (núcleo) | Phaser 3.90 fijado (sin migrar a 4.x sin que se pida); un `Phaser.Game` desde config, una Scene por pantalla, reglas en un módulo plano sin import de Phaser (`logic.ts`, `levels.ts`). |
| `web-game-performance` (entera) | Números antes que adjetivos (tiempos del harness, tamaño del zip); presupuesto (zip ≤ 5 MB, 60 fps); sin motor de físicas (la simulación es lógica determinista, sin coste de física). |
| `performance-optimization` (núcleo) | Presupuesto (zip ≤ 5 MB, 60 fps), medir (harness + build), arreglar, volver a medir (pendiente de la re-corrida en navegador). |
| `mobile-games` (núcleo) | Táctil primero (tap/drag con el dedo, botón BOOST grande, áreas de toque ≥ 48 px), pausa al pasar a segundo plano vía Bridge, diseño fijo 390×844 + Phaser Scale. |
| `playgama-bridge` (entera) | Bridge 2.4.2 (npm + plugin Vite), primer script en `<head>`, `playgama-bridge-config.json` junto a `index.html`, guardado SOLO por Bridge Storage, `game_ready`, anuncios colocados en pausas naturales (sin servir en pruebas — pregunta abierta). |
| `save-systems` (entera) | Guardado por Bridge Storage, solo datos planos (monedas, estrellas, desbloqueos, ajustes, skins, temas), autoguardado al terminar nivel. **Desviación anotada:** sin campo `version` entero dentro del dato — la versión va en la clave (`sushi_belt_save_v1`); sin jugadores con partidas guardadas, no hay migración pendiente. |
| `localize` (núcleo) | Tablas ES/EN en `i18n.ts` (incl. pistas de enseñanza L2/L6/L8/L14); idioma desde `platform.language` (Bridge); verificado por grep: fuera de `t()` solo hay números y nombres de skins/temas vía tabla i18n — **ninguna palabra visible hardcodeada**. |
| `input-systems` (núcleo) | Un solo gesto con dos formas (tap = servir automático, drag = servir a un gato) por los mismos manejadores de escena; sin reasignación de teclas (no procede en un juego táctil de un dedo). |
| `game-docs` (núcleo) | Docs de entrega sincronizadas con el código: cada número de `informe-ronda1.md` se re-chequea contra `levels.ts`/`logic.ts` tras cada arreglo. |
| `camera-systems` (núcleo) | Cámara fija por diseño (toda la partida cabe en el marco 390×844, nunca se ve fuera del nivel); el shake es solo juice (`game-feel`). |

### Jugabilidad

| Skill | Dónde se aplicó |
|---|---|
| `difficulty-and-balancing` (entera) | Plan vinculante (`plan-dificultad-sushi.md`): 3★ = ganar con 3 corazones, 2★ = 2, 1★ = 1; curva por bloques de 5 con diente de sierra; invariantes codificados en el harness (perfecto 3★, ocioso pierde, aleatorio no 3★, servir-todo no 3★, humano ≥ 2★). |
| `level-design` (entera) | 30 niveles: enseñar primero (L1 un color, L2 dos, L3 tres), wasabi L6 con enseñanza, dorado L8 con enseñanza, chef que avisa L14; cada bloque combina lo anterior; ningún nivel ganable sin tocar nada. |
| `game-feel-and-juice` (entera) | Juice acotado banda media-alta: plato que vuela al gato + maullido + «+30», combo con fuego cada 5, tos de wasabi con nube verde, «BOOM» no — «COF COF», victoria con confeti + gatos felices + estrellas una a una; derrota con fundido a gris en < 2 s. |
| `game-feel` (núcleo) | Bundles por evento en tiers (lo más grande solo para la victoria); el shake mueve la cámara, nunca el HUD; interruptor de shake en ajustes. |
| `game-juice` (entera) | Cada evento tiene respuesta (lista completa en `informe-ronda1.md`); el juice no cambia las reglas; **desviación anotada:** sin lectura de `prefers-reduced-motion` por defecto (el interruptor de shake de ajustes lo cubre; mejora pendiente). |
| `juice-audit` (entera) | Auditoría de los 4 pilares (respuesta de entrada, feedback visual, audio, pulido de animación) sobre el juice r1 — resultado en `informe-ronda1.md`. |
| `onboarding-and-teaching` (entera) | Enseñanza por niveles dedicados (L1 tap, L2 drag, L6 wasabi, L8 dorado, L14 chef) con pista contextual en la primera visita + mano tutorial en L1; cada mecánica nueva se presenta sola, nunca dos a la vez; el color lo explica todo sin leer. |
| `game-design-fundamentals` (núcleo) | Test de la decisión interesante: la suite anti-trivial demuestra que no hay estrategia dominante (quedarse quieto, servirlo todo y tocar al azar pierden). |
| `designing-mini-games` (entera) | Toda política monótona pierde (ocioso, servir-todo, aleatorio); game-over único y obvio (fundido a gris + reintento en < 2 s); puntuación por causas en el mundo (el gato que come, no un número). |
| `pacing-and-the-player-journey` (núcleo) | Cadencia de novedad (wasabi L6, dorado L8, avisos del chef L14, combinaciones en bloques 4–6); el bloque 1 es el respiro/tutorial antes de la escalada. |
| `evaluating-gameplay-balance` (núcleo) | Comparación de políticas por bot (perfecto vs ocioso vs aleatorio vs servir-todo vs humano). **Veredicto de dificultad humano:** medido por el modelo humano del harness (0,5 s reacción, 1 % fallos, prudencia tras fallar) — 28/30 niveles a 3/3 y L6/L17 a 2/3; **sin veredicto de 3 testers humanos:** la puerta de testers queda como NO CUMPLIDA hasta la prueba de Daniel. |

### Verificación

| Skill | Dónde se aplicó |
|---|---|
| `playtest-report` (entera) | Playtest: 30 niveles por 5 políticas en el harness + juego manual con toques reales (no posible sin navegador — pendiente); tasas por bloque y % de 3★ en `informe-ronda1.md`; la puerta humana final es la prueba de Daniel. **GAP HONESTO:** el protocolo pide 3 testers humanos como puerta antes de Daniel — en esta sesión no hay 3 testers disponibles; el sustituto es harness + prueba de Daniel. |
| `smoke-testing-web-games` (entera) | `tools-local/harness-run.mts` (fases por política, 0 errores de lógica); **el smoke de navegador (390×844 y 844×390, ES/EN, 0 errores de consola) NO se pudo correr: Chromium muerto en la VM (exit 133) — queda para la ventana finisher.** El input es táctil propio (tap/drag), no el genérico de la skill. |
| `probing-web-game-mechanics` (entera) | `window.__game` (handle solo en build de test, contrato deliberado, nunca en producción) con `tap`/`serve`/`boost`/`schedule`/`state`; aserciones concretas por mecánica (servir, wasabi, dorado, combo, corazones, 30 victorias). **Las sondas en navegador quedan pendientes del Chromium.** |
| `game-quality-gates` (entera) | Checklist pre-deploy aplicado (limpieza en `shutdown`, timers con ciclo de vida, lógica independiente de FPS — `dt` con tope de 50 ms, guardado con versión por clave, tolerancia a fallos de red vía mock de Bridge). **Desviaciones:** versión de guardado por clave (no campo interno); sin `prefers-reduced-motion` por defecto. Anti-cheat no aplica (un jugador, sin servidor ni leaderboard). |
| `game-polish-audit` (entera) | Lentes 1/2/3/5/8 aplicadas al build r1 (verbos, capas de feedback, momentos clave, claridad, contención/accesibilidad); sin informe de auditoría independiente — los hallazgos van en `filtro-visual.md`, `filtro-jugabilidad.md` e `informe-ronda1.md`. |
| `review-game` (núcleo) | Revisión de solo lectura del código r1 como diff contra la plantilla Ramp Physics r2 (GameScene, levels, helpers, config) durante la adaptación. |

### Marketing / presentación

| Skill | Dónde se aplicó |
|---|---|
| `youtube-shorts` (entera) | Guion del Short según la Retention Ladder (Stop 0–3 s, Hold, Angle, Bridge); la ruta de publicación vía WoopSocial **no** se aplica (nada se publica; el Short es un fichero del pack). |
| `thumbnail-design` (entera) | Marco CLICK para las 3 portadas (promesa, un punto focal, 0–4 palabras, legible en móvil); las portadas se generan con la herramienta de medios desde el arte del juego. |
| `hook-writer` (entera) | Hook del Short extraído del elemento real más fuerte (el gato tosiendo wasabi / el combo x5), candidatos por varios mecanismos, uno recomendado — en `short-guion.md`. |
| `playgama-game-video` (entera) | El Short abre en gameplay en el primer fotograma (nunca en sting ni en texto), solo material real, ≤ 4 palabras enormes en los primeros 2 s; sin voz ni música (el Short va mudo hasta que Daniel decida la música). |
| `youtube-publishing-and-metadata` (núcleo) | Marco INDEX para `listing.txt` (keyword en los primeros ~40 caracteres del título, descripción con valor arriba, `madeForKids` = NO es contenido para niños, con sinceridad); la publicación vía WoopSocial no se hace. |
| `playgama-publish` (núcleo) | Chequeo y empaquetado del build (zip-smoke, Bridge 2.4.2, covers en 3 tamaños desde el propio juego); los pasos de MCP (subida, sandbox, compartir) **bloqueados**: MCP no conectado en esta sesión + regla vigente (nada a Playgama sin APROBADO de Daniel). |
| `viral-reverse-engineering` (núcleo) | Teardown del issue #22 (11 jugables top de YouTube, mecanismo no superficie) reutilizado como referencia de diseño de la r1; teardown propio en `teardown.md`. |
| `virality` (núcleo) | Regla 1: algo extraordinario en los primeros 3 segundos (el gato que se traga el sushi con +30 abre el Short). |

## NO APLICABLES (con su porqué)

| Skill | Por qué no aplica a este juego |
|---|---|
| `threejs-animation`, `threejs-asset-pipeline`, `threejs-fundamentals`, `threejs-geometry`, `threejs-interaction`, `threejs-lighting`, `threejs-loaders`, `threejs-materials`, `threejs-performance`, `threejs-postprocessing`, `threejs-react-three-fiber`, `threejs-shaders`, `threejs-textures` (13) | El juego es 2D en Phaser con arte vectorial de canvas; no hay escena 3D, ni mallas WebGL, ni React. Nada del juego usa three.js. |
| `shader-programming` | Sin shaders GLSL propios; el estilo son formas vectoriales de canvas + Phaser Graphics. |
| `phaser-arcade-physics` | El juego no usa ningún motor de físicas: la cinta es una simulación lógica determinista (`logic.ts`). |
| `physics-tuning` | Sin motor de físicas no hay nada que afinar (pasos fijos, túneles, rebotes): la sim avanza en pasos de 1/60 s con `dt` acotado. |
| `game-engagement-ideas` | Necesita telemetría de Playgama (dónde abandonan los jugadores) — el juego no tiene jugadores todavía; no hay nada que analizar. |
| `playgama-metrics-snapshot` | Necesita el MCP de Playgama + un juego publicado con telemetría — no conectado y juego no publicado. |
| `ab-testing` | Necesita tráfico vivo y audiencia para testear — no hay jugadores todavía. |
| `instagram-seo`, `tiktok-growth`, `social` | El pack es YouTube (Short) + Playgama; no hay publicaciones de Instagram, TikTok ni redes sociales en esta entrega. |
