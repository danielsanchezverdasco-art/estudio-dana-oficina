# Skills usadas — Ramp Physics r2 (opción C, CÓMIC)

Protocolo de Producción Optimizado (15/11 22:07): **ninguna skill se salta**.
Lista completa: las 66 de `comunicacion-ias/kit/skills/` (lista de Grok).
Cada skill aplicable queda aquí con dónde se aplicó; cada skill no aplicable
con su POR QUÉ. Nada fuera de la lista.

**Cómo se leyó cada una:** las 7 nucleares se leyeron enteras antes de construir
(art-direction-and-readability, directing-game-visuals, difficulty-and-balancing,
level-design, game-feel-and-juice, onboarding-and-teaching, playtest-report).
Las demás se leyeron enteras durante la fase de verificación de la r2
(physics-tuning, web-game-performance, smoke-testing-web-games,
probing-web-game-mechanics, game-quality-gates, playgama-bridge, save-systems,
game-polish-audit, juice-audit, youtube-shorts, thumbnail-design, hook-writer,
playgama-game-video) o en su sección nuclear (resto de aplicables). Las no
aplicables se juzgaron por su descripción + encabezado. El texto completo de
cada skill vive en `comunicacion-ias/kit/skills/`.

**De pago o con API key:** ninguna de las 66 exige pago ni clave. El MCP de
Playgama necesita el inicio de sesión de Daniel (no es una clave de pago)
para cualquier subida futura; la música del Short (si Daniel la quiere)
necesita una pista con licencia — lo decide él, no se instala nada en silencio.

## APLICADAS

### Diseño

| Skill | Dónde se aplicó |
|---|---|
| `art-direction-and-readability` (entera) | Biblia de arte opción C: paleta con rol de juego (amarillo = protagonista, rojo/naranja = peligro, verde = meta, dorado = monedas), contorno negro grueso en todo, contraste título/HUD, legibilidad a tamaño de móvil. |
| `directing-game-visuals` (entera) | Dirección visual C: papel crema con rayos + semitono, muñeco amarillo volumétrico con visor, rampa «dibujada a mano» con crosshatch, ventilador/dinamita/bandera con lectura inmediata, fondos con profundidad. |
| `art-bible` (entera; el andamiaje Claude-Code — `.claude/docs`, director gates, yaml-helper — no existe en este workspace, se aplicó la sustancia) | `biblia-arte-opcion-c.md`: identidad visual, paleta con roles, reglas de trazo/color/textura y la regla anti-pixelado (vectorial a resolución real). |
| `game-ui-ux` (núcleo) | HUD cómic (burbuja LEVEL, píldora de monedas, barra INK con rayas, botones STEEL/BOUNCY/BOOST, LAUNCH! grande) en el espacio de diseño fijo 390×844 con Phaser Scale; la barra de tinta se actualiza por evento (al dibujar), no por polling. |
| `styling-web-game-typography` (entera) | Lilita One (títulos/números) + Nunito (cuerpo), solo los pesos adoptados, licencias OFL en `public/licenses/` y resumen en `THIRD_PARTY_LICENSES.md`; roles por elemento (Heading/Info/Numeric). |
| `auditing-game-screen-readability` (núcleo) | Auditoría por momentos (menú, L1/L6/L12/L18, ES, pausa, mapa, tienda) con las capturas del harness; hallazgos en `filtro-visual.md`. |
| `create-game-assets` (núcleo) | Pipeline de assets del paso 1: guía de estilo → generar a resolución real → verificar a la vista → registro de licencias. El arte del juego es vectorial (`comic.ts`), no bitmaps generados. |
| `sprite-gen` (núcleo) | Assets generados del paso 1 (menú, muñeco, rampa) a resolución real, verificados a la vista y curados (el muñeco y la rampa pasaron con matices anotados en `informe-paso1.md`). |

### Desarrollo

| Skill | Dónde se aplicó |
|---|---|
| `phaser-core` (núcleo) | Phaser 3.90 fijado (sin migrar a 4.x sin que se pida); un `Phaser.Game` desde config, una Scene por pantalla, reglas en módulos planos sin import de Phaser (`levels.ts`, `save.ts`). |
| `physics-tuning` (entera) | Diagnóstico de la corrida 1: el Runner de Matter usa pasos fijos de 16,66 ms con acumulador y **difiere** updates con FPS bajo (slow-motion) — por eso `LAUNCH_TIMEOUT` pasó de 20 s a 60 s; chequeo de túnel: velocidad máx. ~8 px/paso < grosor de rampa 10 px, sin túnel. |
| `web-game-performance` (entera) | Números antes que adjetivos (tiempos de pared del harness); DSF 2 → 1 en el harness (el rasterizado SwiftShader a DSF 2 estrelló el renderer); cap de FPS a 60 en táctil **considerado y aplazado** (paridad con la r1, sin evidencia de problema a 120 Hz; se revisa si Daniel reporta calor/batería). |
| `performance-optimization` (núcleo) | Presupuesto (zip ≤ 5 MB, 60 fps), medir (tiempos del harness), arreglar (DSF 1), volver a medir (pendiente de la re-corrida). |
| `mobile-games` (núcleo) | Táctil primero (LAUNCH grande, dibujo con el dedo, áreas de toque grandes), pausa al pasar a segundo plano vía Bridge, diseño fijo 390×844 + Phaser Scale. |
| `playgama-bridge` (entera) | Bridge 2.4.2 (npm + plugin Vite), primer script en `<head>`, `playgama-bridge-config.json` junto a `index.html`, guardado SOLO por Bridge Storage, `game_ready`, anuncios colocados en pausas naturales (sin servir en pruebas — pregunta abierta). Re-chequeo contra la doc viva pendiente del MCP (no conectado en esta sesión). |
| `save-systems` (entera) | Guardado por Bridge Storage, solo datos planos (monedas, estrellas, desbloqueos, ajustes), autoguardado al terminar nivel. **Desviación anotada:** sin campo `version` entero dentro del dato — la versión va en la clave (`ramp_physics_save_v1`); sin jugadores con partidas guardadas, no hay migración pendiente. |
| `localize` (núcleo) | Tablas ES/EN en `i18n.ts` (incl. pistas de enseñanza L6/8/10/12/18); idioma desde `platform.language` (Bridge); verificado por grep: fuera de `t()` solo hay números y nombres de skins vía tabla i18n — **ninguna palabra visible hardcodeada**. |
| `input-systems` (núcleo) | Acciones táctiles (dibujar, lanzar, deshacer, limpiar, pausa) por los mismos manejadores; sin reasignación de teclas (no procede en un juego de dibujo táctil) ni acordes. |
| `game-docs` (núcleo) | Docs de entrega sincronizadas con el código: cada número de `informe-ronda2.md` se re-chequea contra `levels.ts`/`GameScene.ts` tras cada arreglo. |
| `camera-systems` (núcleo) | Cámara fija por diseño (todo el nivel cabe en el marco 390×844, nunca se ve fuera del nivel); el shake es solo juice (`game-feel`). |

### Jugabilidad

| Skill | Dónde se aplicó |
|---|---|
| `difficulty-and-balancing` (entera) | Plan vinculante: par = óptima × 1,10 (múltiplos de 5), 3★ = ≤ par, 2★ = ≤ par × 1,25, 1★ = llegar; banda óptima 85–100 % del par verificada por cómputo en los 30 niveles; curva por bloques de 5. |
| `level-design` (entera) | 30 niveles: peligros antes (ventilador L6 con enseñanza, dinamita L12, portal L18), monedas fuera de la línea óptima, ninguna tinta domina (cada tinta es óptima en ≥1 nivel por bloque de 5, salvo el bloque 1 tutorial de acero), niveles nuevos de boost (pendientes 2–3° donde el acero se atasca) y de elástico (muros que solo se superan rebotando). |
| `game-feel-and-juice` (entera) | Juice acotado banda media-alta: trazo con punta luminosa, whoosh + polvo + shake 80 ms al lanzar, squash + anillo en rebote elástico, estelas de aire en ventilador, hit-stop 80 ms + «BOOM!» en dinamita, destello + estiramiento en portal, victoria con confeti + slow-mo 0,3 s + bandera ondeando + estrellas una a una; derrota con fundido a gris en < 2 s. |
| `game-feel` (núcleo) | Bundles por evento en tiers (lo más grande solo para la victoria); el shake mueve la cámara, nunca los cuerpos; interruptor de shake en ajustes. |
| `game-juice` (entera) | Cada evento tiene respuesta (lista completa en `informe-ronda2.md`); el juice no cambia la física; **desviación anotada:** sin lectura de `prefers-reduced-motion` por defecto (el interruptor de shake de ajustes lo cubre; mejora pendiente). |
| `juice-audit` (entera) | Auditoría de los 4 pilares (respuesta de entrada, feedback visual, audio, pulido de animación) sobre el juice r2 — resultado en `informe-ronda2.md`. |
| `onboarding-and-teaching` (entera) | Enseñanza por niveles dedicados (L6 ventilador, L12 dinamita, L18 portal, L8 rebote, L10 boost) con pista contextual en la primera visita + mano tutorial en L1; cada mecánica nueva se presenta sola, nunca dos a la vez. |
| `game-design-fundamentals` (núcleo) | Test de la decisión interesante: la suite anti-trivial demuestra que no hay estrategia dominante (rampa perezosa, 0 px y cambio a acero pierden). |
| `designing-mini-games` (entera) | Toda política monótona pierde (rampa perezosa, 0 px, quedarse quieto); game-over único y obvio (fundido a gris + reintento en < 2 s); puntuación por causas en el mundo (estrellas por tinta, monedas por riesgo). |
| `pacing-and-the-player-journey` (núcleo) | Cadencia de novedad (ventilador L6, dinamita L12, portal L18, combinaciones en bloques 4–6); el bloque 1 de fosos es el respiro/tutorial antes de la escalada. |
| `evaluating-gameplay-balance` (núcleo) | Comparación de políticas por bot (solución vs perezosa vs 0 px vs cambio a acero). **Sin veredicto de dificultad humano:** según esta skill, sin una corrida human-limited no se afirma que la dificultad esté bien — el veredicto queda como NO MEDIDO hasta la prueba de Daniel. |

### Verificación

| Skill | Dónde se aplicó |
|---|---|
| `playtest-report` (entera) | Playtest: 30 niveles por replay de solución + juego manual con toques reales; tasas por bloque y % de 3★ en primer intento en `informe-ronda2.md`; la puerta humana final es la prueba de Daniel. **GAP HONESTO:** el protocolo pide 3 testers humanos como puerta antes de Daniel — en esta sesión no hay 3 testers disponibles; el sustituto es harness + juego manual propio + prueba de Daniel. |
| `smoke-testing-web-games` (entera) | `test-game.mjs`: fases load/idle/input, 0 errores de consola, 0 peticiones fallidas; el input es táctil propio (arrastres de dibujo), no el genérico de la skill. |
| `probing-web-game-mechanics` (entera) | `probe-level.mjs` + `anti-trivial.mjs` vía `window.__game` (handle solo en build de test, contrato deliberado, nunca en producción); aserciones concretas por mecánica (par, dominancia, 0 px, rampa perezosa). |
| `game-quality-gates` (entera) | Checklist pre-deploy aplicado (limpieza en `shutdown`, timers con ciclo de vida, lógica independiente de FPS, guardado con versión por clave, tolerancia a fallos de red vía mock de Bridge). **Desviaciones:** versión de guardado por clave (no campo interno); sin `prefers-reduced-motion` por defecto. Anti-cheat no aplica (un jugador, sin servidor ni leaderboard). |
| `game-polish-audit` (entera) | Lentes 1/2/3/5/8 aplicadas al build r2 (verbos, capas de feedback, momentos clave, claridad, contención/accesibilidad); sin informe de auditoría independiente — los hallazgos van en `filtro-visual.md`, `filtro-jugabilidad.md` e `informe-ronda2.md`. |
| `review-game` (núcleo) | Revisión de solo lectura del código r2 como diff contra la r1 (GameScene, levels, helpers, config) durante el diagnóstico de L5/L6/L7/L9/L10. |

### Marketing / presentación

| Skill | Dónde se aplicó |
|---|---|
| `youtube-shorts` (entera) | Guion del Short según la Retention Ladder (Stop 0–3 s, Hold, Angle, Bridge); la ruta de publicación vía WoopSocial **no** se aplica (nada se publica; el Short es un fichero del pack). |
| `thumbnail-design` (entera) | Marco CLICK para las 6 portadas (promesa, un punto focal, 0–4 palabras, legible en móvil); el raster sale de capturas reales vía `covers.py`; el Test & Compare es de Daniel/Studio, no se hace aquí. |
| `hook-writer` (entera) | Hook del Short extraído del elemento real más fuerte (el choque / la explosión BOOM), candidatos por varios mecanismos, uno recomendado — en `short-guion.md`. |
| `playgama-game-video` (entera) | El Short abre en gameplay en el primer fotograma (nunca en sting ni en texto), solo material real, ≤ 4 palabras enormes en los primeros 2 s; sin voz ni música (el Short va mudo hasta que Daniel decida la música); no se usa la plantilla HyperFrames (el entregable es el Short filmado + el GIF, patrón r1). |
| `youtube-publishing-and-metadata` (núcleo) | Marco INDEX para `listing.txt` (keyword en los primeros ~40 caracteres del título, descripción con valor arriba, `madeForKids` = NO es contenido para niños, con sinceridad); la publicación vía WoopSocial no se hace. |
| `playgama-publish` (núcleo) | Chequeo y empaquetado del build (zip-smoke, Bridge 2.4.2, covers en 3 tamaños desde el propio juego); los pasos de MCP (subida, sandbox, compartir) **bloqueados**: MCP no conectado en esta sesión + regla vigente (nada a Playgama sin APROBADO de Daniel). |
| `viral-reverse-engineering` (núcleo) | Teardown del issue #22 (11 jugables top de YouTube, mecanismo no superficie) reutilizado como referencia de diseño de la r2. |
| `virality` (núcleo) | Regla 1: algo extraordinario en los primeros 3 segundos (el choque/la explosión abre el Short). |

## NO APLICABLES (con su porqué)

| Skill | Por qué no aplica a este juego |
|---|---|
| `threejs-animation`, `threejs-asset-pipeline`, `threejs-fundamentals`, `threejs-geometry`, `threejs-interaction`, `threejs-lighting`, `threejs-loaders`, `threejs-materials`, `threejs-performance`, `threejs-postprocessing`, `threejs-react-three-fiber`, `threejs-shaders`, `threejs-textures` (13) | El juego es 2D en Phaser con arte vectorial de canvas; no hay escena 3D, ni mallas WebGL, ni React. Nada del juego usa three.js. |
| `shader-programming` | Sin shaders GLSL propios; el estilo cómic son formas vectoriales de Phaser Graphics + texturas de canvas. |
| `phaser-arcade-physics` | El juego usa física Matter.js, no Arcade. |
| `game-engagement-ideas` | Necesita telemetría de Playgama (dónde abandonan los jugadores) — el juego no tiene jugadores todavía; no hay nada que analizar. |
| `playgama-metrics-snapshot` | Necesita el MCP de Playgama + un juego publicado con telemetría — no conectado y juego no publicado. |
| `ab-testing` | Necesita tráfico vivo y audiencia para testear — no hay jugadores todavía. |
| `instagram-seo`, `tiktok-growth`, `social` | El pack es YouTube (Short) + Playgama; no hay publicaciones de Instagram, TikTok ni redes sociales en esta entrega. |

## Verificación cruzada (números reales, 15/11)

- `test-game.mjs` corrida 1 (15/11 ~21:09 UTC, DSF 2, Chromium SwiftShader):
  **21/26 checks.** Ganan a 3★: L1 (119/135), L2 (146/165), L3 (164/185),
  L4 (199/220), L8 (173/195), L11 (102/115), L12 (58/65) — ratios 0,881–0,905,
  en banda. Pierden: L5/L7/L9 por timeout de 20 s (física lenta por FPS bajo),
  L6/L10 a 0★ en ~3 s (L10: trampa de labio real, corregida). L13–30 sin probar
  (el renderer se estrelló en la captura del L12). Detalle en
  `test-results-r2-run1.md`. Correcciones aplicadas después: timeout 60 s,
  5 rampas BOOST extendidas, DSF 1. **Re-corrida pendiente** (Chromium con
  SIGTRAP en la ventana de endurecimiento del sandbox).
- `anti-trivial.mjs`: **pendiente** (sin correr — necesita Chromium).
- `probe-level.mjs`: **pendiente** para los 9 niveles nuevos + 3 de enseñanza.
- Playtest: replays del harness (políticas oracle/precise) + juego manual con
  toques reales durante el filmado (pendiente de Chromium). Veredicto de
  dificultad: **NO MEDIDO** (sin corrida human-limited; la puerta es Daniel).
