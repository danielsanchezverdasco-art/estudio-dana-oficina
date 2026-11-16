# Skills usadas — Draw Bridge Delivery (round 1)

Protocolo de Producción Optimizado (15/11 22:07): **ninguna skill se salta**.
Lista completa: las 66 de `comunicacion-ias/kit/skills/` (lista de Grok).
Cada skill aplicable queda aquí con dónde se aplicó; cada skill no aplicable
con su POR QUÉ. Nada fuera de la lista.

**Cómo se leyó cada una:** leídas ENTERAS para este juego antes de construir:
`difficulty-and-balancing` y `level-design` (las dos que cambian decisiones:
pares, curvas, anti-trivial y el plan de enseñanza). El resto del conjunto
aplicado se hereda de la plantilla Ramp Physics r2 — su builder las leyó
enteras y registró dónde se aplicó cada una en
`comunicacion-ias/entregas/ramp-physics-round2/skills-usadas.md` — y se
re-aplicó aquí con los cambios propios de este juego documentados abajo.
`physics-tuning` se aplicó a partir de su resumen + la aplicación de la
plantilla: las constantes de conducción (fuerza, velocidad máxima, pendiente
máxima) están DERIVADAS de la matemática de Matter y marcadas como
**pendientes de medición por el harness** (no se presentan como medidas).
El texto completo de cada skill vive en `comunicacion-ias/kit/skills/`.

**De pago o con API key:** ninguna de las 66 exige pago ni clave. El MCP de
Playgama necesita el inicio de sesión de Daniel (no es una clave de pago)
para cualquier subida futura; la música del Short (si Daniel la quiere)
necesita una pista con licencia — lo decide él, no se instala nada en silencio.

## APLICADAS

### Diseño

| Skill | Dónde se aplicó |
|---|---|
| `art-direction-and-readability` | Biblia de arte (`biblia-arte.md`): paleta con rol de juego (azul cielo = mundo, verde = meta/entrega, naranja = el puente que dibujas, dorado = monedas), contorno oscuro de 3 px en todo, contraste título/HUD sobre el cielo, legibilidad a tamaño de móvil. |
| `directing-game-visuals` | Dirección visual ciudad soleada: cielo con degradado + sol con cara, casas planas de colores con tejados, acantilados de roca con hierba, río con ondas, puente de madera con borde oscuro + brillo naranja al trazar, scooter con pizza. Fondos con profundidad (skyline lejano → acantilados → río). |
| `art-bible` (sustancia; el andamiaje Claude-Code no existe en este workspace) | `biblia-arte.md`: identidad visual, paleta con roles, reglas de trazo/color/textura y la regla anti-pixelado (todo vectorial a resolución real 2x, nada de bitmaps). |
| `game-ui-ux` (núcleo) | HUD en el espacio de diseño fijo 390×844 con Phaser Scale: burbuja LEVEL, píldora de monedas, barra INK con marcador de par (la línea blanca del 3★), botones UNDO / PLAY / ERASE grandes y táctiles; la barra de tinta se actualiza por evento (al dibujar), no por polling. |
| `styling-web-game-typography` (entera) | Lilita One (títulos/números) + Nunito (cuerpo), solo los pesos adoptados, licencias OFL en `public/licenses/`; roles por elemento (Heading/Info/Numeric). Heredado de la plantilla. |
| `auditing-game-screen-readability` (núcleo) | Auditoría por momentos pendiente de capturas del harness (menú, L1/L6/L8/L12/L18, ES, pausa, mapa, tienda); hallazgos en `filtro-visual.md`. SIN capturas reales todavía — Chromium muerto. |
| `create-game-assets` (núcleo) | Arte 100 % procedural en `city.ts` (canvas 2D a 2x): 26 texturas generadas en Boot, cero bitmaps. |
| `sprite-gen` (núcleo) | Assets del juego generados proceduralmente a resolución real; verificación visual pendiente del harness (capturas). |

### Desarrollo

| Skill | Dónde se aplicó |
|---|---|
| `phaser-core` (núcleo) | Phaser 3.90 fijado; un `Phaser.Game` desde config, una Scene por pantalla, reglas en módulos planos sin import de Phaser (`levels.ts`, `save.ts`). |
| `physics-tuning` | Constantes de conducción derivadas de la matemática de Matter (gravedad 0,001 → ~0,278 px/paso²; empuje WOOD 0,0011 → 0,306 px/paso²; TURBO 0,0024 → 0,667); chequeo de túnel: velocidad máx. 6,5 px/paso < grosor de puente 10 px, sin túnel. **Medición real pendiente del harness** (límite de subida, rebote, timing del puente móvil, escalón de 5 px en la meta). |
| `web-game-performance` (entera) | Presupuesto (zip ≤ 5 MB, 60 fps); el build corre en memoria (`build-retry-db.mjs`) por la ola EPERM; DSF 1 en el harness (lección r2). |
| `performance-optimization` (núcleo) | Presupuesto + medir (validador Node 658 checks) + volver a medir (harness pendiente). |
| `mobile-games` (núcleo) | Táctil primero (PLAY grande y pulsante, dibujo con el dedo, UNDO/ERASE grandes), pausa al pasar a segundo plano vía Bridge, diseño fijo 390×844 + cámara con zoom de ajuste. |
| `playgama-bridge` (entera) | Bridge 2.4.2 (npm + plugin Vite), primer script en `<head>`, guardado SOLO por Bridge Storage (`draw_bridge_delivery_save_v1`), `game_ready` desde el menú a los 200 ms, Extra Ink por anuncio recompensado (solo en estado `rewarded`). **Desviación r1:** sin interstitials — la cadencia de interstitials es decisión de monetización pendiente de Daniel. |
| `save-systems` (entera) | Guardado por Bridge Storage, solo datos planos (monedas, estrellas, desbloqueos, ajustes), autoguardado al terminar nivel. Versión por clave (`draw_bridge_delivery_save_v1`), sin migración pendiente (sin jugadores). |
| `localize` (núcleo) | Tablas ES/EN en `i18n.ts` (incl. pistas de enseñanza por nivel); idioma desde `platform.language`; nombres de nivel en ambos idiomas en `levels.ts`. |
| `input-systems` (núcleo) | Acciones táctiles (dibujar, borrar, deshacer, PLAY, pausa) por los mismos manejadores; zona de dibujo acotada (y 110–760) para no chocar con los botones del HUD; sin reasignación de teclas (no procede en un juego de dibujo táctil). |
| `game-docs` (núcleo) | Docs de entrega sincronizadas con el código: cada número de `informe-ronda1.md` y `plan-dificultad.md` se re-chequea contra `levels.ts` tras cada arreglo (par/tinta generados por cómputo, no a mano). |
| `camera-systems` (núcleo) | Cámara con zoom de ajuste al marco 390×844 (todo el nivel cabe, nunca se ve fuera del nivel); sin shake de cámara en r1 (el juice es de objetos, no de cámara). |

### Jugabilidad

| Skill | Dónde se aplicó |
|---|---|
| `difficulty-and-balancing` (entera) | Plan vinculante (`plan-dificultad.md`): par = óptima × 1,10 (múltiplos de 5), 3★ = ≤ par, 2★ = ≤ par × 1,25, 1★ = llegar; banda óptima 85–100 % del par verificada por cómputo en los 30 niveles (`validate-levels.mjs`: 658 checks, 0 fallos); curva por bloques de 5 con diente de sierra. |
| `level-design` (entera) | 30 niveles: cada mecánica se enseña sola y barata (viento L6, trampolín L8, turbo L10, puente móvil L12, entrega dual L18, tinta saltarina L23) y luego se combina bajo presión; monedas fuera de la línea óptima (a 25–40 px, nunca sobre ella); ninguna tinta domina (madera 24 niveles, turbo 4, saltarina 1 — el bloque tutorial es de madera por diseño); el validador anti-trivial demuestra que del L5 en adelante el puente recto pierde (salvo los niveles de enseñanza documentados). |
| `game-feel-and-juice` (entera) | Juice acotado banda media-alta: brillo naranja al trazar, whoosh + polvo al pulsar PLAY, moneda con sonido + destello, victoria con confeti + estrellas una a una; derrota con fundido rápido (< 1 s) a la pantalla de resultado. |
| `game-feel` (núcleo) | Bundles por evento en tiers (lo más grande solo para la victoria); sin shake de cámara en r1. |
| `game-juice` (entera) | Cada evento tiene respuesta (lista en `informe-ronda1.md`); el juice no cambia la física. |
| `juice-audit` (entera) | Auditoría de los 4 pilares pendiente de las capturas del harness — resultado en `filtro-jugabilidad.md` (sección abierta). |
| `onboarding-and-teaching` (entera) | Enseñanza por niveles dedicados (L6 viento, L8 trampolín, L10 turbo, L12 móvil, L18 dual, L23 saltarina) con pista contextual de una línea en la primera visita; cada mecánica nueva se presenta sola, nunca dos a la vez. |
| `game-design-fundamentals` (núcleo) | Test de la decisión interesante: el validador anti-trivial demuestra que no hay estrategia dominante (puente recto, 0 px y quedarse quieto pierden). |
| `designing-mini-games` (entera) | Toda política monótona pierde (puente recto, 0 px, esperar); game-over único y obvio (pantalla de resultado con reintento en un toque); puntuación por causas en el mundo (estrellas por tinta, monedas por riesgo). |
| `pacing-and-the-player-journey` (núcleo) | Cadencia de novedad (viento L6, trampolín L8, turbo L10, móvil L12, dual L18, saltarina L23, combinaciones en bloques 4–6); el bloque 1 es el respiro/tutorial antes de la escalada. |
| `evaluating-gameplay-balance` (núcleo) | Comparación de políticas por validador (solución vs recta vs 0 px). **Sin veredicto de dificultad humano:** sin una corrida con límite humano no se afirma que la dificultad esté bien — el veredicto queda como NO MEDIDO hasta la prueba de Daniel. |

### Verificación

| Skill | Dónde se aplicó |
|---|---|
| `playtest-report` (entera) | Playtest: validador geométrico de los 30 niveles + tsc 0 errores + build en curso. **GAP HONESTO:** sin corrida de harness (Chromium muerto, 3 ventanas bloqueadas) y sin 3 testers humanos como puerta antes de Daniel — el sustituto es validador + build + prueba de Daniel. |
| `smoke-testing-web-games` (entera) | `test-game.mjs` de la plantilla, pendiente de correr (Chromium muerto). El input es táctil propio (arrastres de dibujo), no el genérico de la skill. |
| `probing-web-game-mechanics` (entera) | `window.__game` (handle solo en build de test, contrato deliberado, nunca en producción): `testGetState / testDrawLine / testLaunch / testSolution / testSetTimeScale`. Aserciones concretas por mecánica pendientes de la corrida del harness. |
| `game-quality-gates` (entera) | Checklist pre-deploy aplicado (limpieza en `shutdown`, timers con ciclo de vida, lógica independiente de FPS, guardado con versión por clave, tolerancia a fallos de red vía mock de Bridge). **Desviaciones:** versión de guardado por clave (no campo interno); sin `prefers-reduced-motion` por defecto. Anti-cheat no aplica (un jugador, sin servidor ni leaderboard). |
| `game-polish-audit` (entera) | Lentes 1/2/3/5/8 aplicadas al código r1; sin informe de auditoría independiente — los hallazgos van en `filtro-visual.md`, `filtro-jugabilidad.md` e `informe-ronda1.md`. |
| `review-game` (núcleo) | Revisión del código como diff contra la plantilla (GameScene, levels, city, vehicle) durante el diagnóstico del validador (23 fallos → 0). |

### Marketing / presentación

| Skill | Dónde se aplicó |
|---|---|
| `youtube-shorts` (entera) | Guion del Short según la Retention Ladder (Stop 0–3 s, Hold, Angle, Bridge); la ruta de publicación vía WoopSocial **no** se aplica (nada se publica; el Short es un fichero del pack, pendiente de filmar — Chromium muerto). |
| `thumbnail-design` (entera) | Marco CLICK para las portadas (promesa, un punto focal, 0–4 palabras, legible en móvil); las portadas se generan con la herramienta de medios a partir del arte del juego (pendientes de verificación visual real). |
| `hook-writer` (entera) | Hook del Short extraído del elemento real más fuerte (el primer puente que se sostiene y la pizza que llega), candidatos por varios mecanismos, uno recomendado — en `short-guion.md`. |
| `playgama-game-video` (entera) | El Short abre en gameplay en el primer fotograma (nunca en sting ni en texto), solo material real, ≤ 4 palabras enormes en los primeros 2 s; sin voz ni música (el Short va mudo hasta que Daniel decida la música). |
| `youtube-publishing-and-metadata` (núcleo) | Marco INDEX para `listing.txt` (keyword en los primeros ~40 caracteres del título, descripción con valor arriba, `madeForKids` = NO es contenido para niños, con sinceridad); la publicación vía WoopSocial no se hace. |
| `playgama-publish` (núcleo) | Chequeo y empaquetado del build (zip-smoke, Bridge 2.4.2, covers en 3 tamaños); los pasos de MCP (subida, sandbox, compartir) **bloqueados**: MCP no conectado en esta sesión + regla vigente (nada a Playgama sin APROBADO de Daniel). |
| `viral-reverse-engineering` (núcleo) | Teardown del issue #22 + `teardown.md` propio (Draw Bridge — Brain Game 27M, Draw Crash Race 968K/7 días, Tricky Twist 394K/día) reutilizado como referencia de diseño. |
| `virality` (núcleo) | Regla 1: algo extraordinario en los primeros 3 segundos (el primer puente que se sostiene y la moto que cruza abre el Short). |

## NO APLICABLES (con su porqué)

| Skill | Por qué no aplica a este juego |
|---|---|
| `threejs-animation`, `threejs-asset-pipeline`, `threejs-fundamentals`, `threejs-geometry`, `threejs-interaction`, `threejs-lighting`, `threejs-loaders`, `threejs-materials`, `threejs-performance`, `threejs-postprocessing`, `threejs-react-three-fiber`, `threejs-shaders`, `threejs-textures` (13) | El juego es 2D en Phaser con arte vectorial de canvas; no hay escena 3D, ni mallas WebGL, ni React. Nada del juego usa three.js. |
| `shader-programming` | Sin shaders GLSL propios; el estilo ciudad soleada son formas vectoriales de Phaser Graphics + texturas de canvas. |
| `phaser-arcade-physics` | El juego usa física Matter.js, no Arcade. |
| `game-engagement-ideas` | Necesita telemetría de Playgama (dónde abandonan los jugadores) — el juego no tiene jugadores todavía; no hay nada que analizar. |
| `playgama-metrics-snapshot` | Necesita el MCP de Playgama + un juego publicado con telemetría — no conectado y juego no publicado. |
| `ab-testing` | Necesita tráfico vivo y audiencia para testear — no hay jugadores todavía. |
| `instagram-seo`, `tiktok-growth`, `social` | El pack es YouTube (Short) + Playgama; no hay publicaciones de Instagram, TikTok ni redes sociales en esta entrega. |

## Verificación cruzada (números reales, 16/11)

- `tsc --noEmit`: **0 errores** (16/11 ~07:00).
- `validate-levels.mjs`: **658 checks, 0 fallos** (16/11 ~07:05) — los 30 niveles
  son geométricamente válidos (pares, pendientes, monedas, anti-trivial).
  Primera corrida: 23 fallos; corregidos (L5/L14/L15/L16/L17 rediseñados,
  L24 dentro del marco, monedas de los niveles móviles bajadas a y=575,
  cheques duales y de arco de rebote corregidos).
- Build de test (`dist-test`, `__TEST_BUILD__=1`): en curso al redactar esto
  (16/11 ~07:15, VM lenta + ola EPERM).
- `test-game.mjs` / `probe-level.mjs`: **pendientes** (Chromium muerto —
  exit 133 en 1248/1255; 3 ventanas finisher bloqueadas; próxima 07:59 CET).
- Playtest humano: **pendiente** (puerta de 3 testers sin cumplir + prueba
  de Daniel).
