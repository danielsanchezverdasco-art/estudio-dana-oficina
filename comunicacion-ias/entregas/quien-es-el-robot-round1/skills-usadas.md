# Skills usadas — Who Is the Robot? (ronda 1)

**Regla:** solo las 66 skills de la lista de Grok en `comunicacion-ias/kit/skills/`
(+ skills de la misión de skills, cuando llegue el informe final de Niky).
Cada skill aplicada se leyó ENTERA antes de usarla. Las no aplicables se
justifican por su descripción + cabecera. Ninguna skill de pago ni con API key
entre las 66 (verificado en el informe de r2).

## Leídas enteras y aplicadas

| Skill | Dónde se aplicó |
|---|---|
| art-direction-and-readability | Biblia de arte: cada elemento nombra la pregunta de juego que responde; un protagonista / un peligro / una recompensa por plano; la multitud nunca tapa al robot |
| directing-game-visuals | Paleta por rol (cian = interactivo, rojo = peligro, dorado = recompensa); el robot gris entre grises; volumen y luz en cada personaje |
| difficulty-and-balancing | Plan de dificultad en `levels.ts`: bloques de 5, diente de sierra, sin estrategia dominante (quieto pierde, machacar pierde, barrido rápido no revela) |
| level-design | 30 niveles con colocación determinista por semilla; enseñar primero donde fallar es barato (L1 escaneo, L2 toque, L3 señuelos, L11 barajar, L21 deriva); sin soft-lock (el robot siempre dentro del campo y alcanzable por el haz) |
| game-feel-and-juice | Un momento de satisfacción por acción: revelar (chime + anillo dorado + juice medio), pillar (fanfarria + juice grande), fallar (juice pequeño); techo de juice medio-alto |
| onboarding-and-teaching | El mejor tutorial es un nivel: L1 enseña a escanear (mano oficial + texto), L2 a tocar, L3 los señuelos; una cosa nueva cada vez |
| designing-mini-games | Frase nuclear: «Desliza el escáner por la multitud para revelar al robot escondido y tócalo antes de que se acabe el tiempo»; game over único y obvio (tiempo o corazones); escalar por defecto con la raíz de la dificultad |
| playtest-report | Plantilla de informe: sesión, primeras impresiones, flujo, tabla de fallos, datos cuantitativos, top 3 prioridades (ver `informe-ronda1.md`) |
| phaser-core | Estructura de escenas, contenedor con escala uniforme, hit areas en coordenadas locales |
| playgama-bridge | Bridge primero en `<head>`, `initialize()` antes del motor, `game_ready` a los 200 ms del primer frame, storage solo por Bridge, interstitial cada 3 victorias, rewarded para +1 pista |
| save-systems | `save.ts`: solo Bridge storage, fallback en memoria si no hay Bridge, racha diaria, colección por ciudades |
| localize | EN primero, ES segundo; el idioma de plataforma elige, el menú lo cambia en vivo |
| smoke-testing-web-games | Harness `test-game.mjs`: 30/30 niveles por replay de la solución + 14 checks de UI/interacción |
| probing-web-game-mechanics | `probe-level.mjs`: un nivel, mecanismo aislado (revelar → tocar) |
| auditing-game-screen-readability | Filtro visual: un protagonista / un peligro / una recompensa; textos sin cortes a 390×844 |
| game-ui-ux | HUD: temporizador grande + 3 corazones + HINT + pausa; botones ≥88 px principales / ≥48 px mínimo |
| input-systems | Un dedo, un verbo: arrastrar mueve el haz; tocar pilla; hit areas locales verificadas por sondeo |
| game-design-fundamentals | Bucle: escanear → revelar → pillar; meta: colección por ciudades + reto diario |
| pacing-and-the-player-journey | Diente de sierra por bloques de 5; giro en L11 (barajar) y L21 (deriva) |
| evaluating-gameplay-balance | Números reales en `filtro-jugabilidad.md`: dwell 0,55 s vs 0,35 s de revelado; presupuesto de tiempo 5,25 s < 25 s |
| mobile-games | 390×844 vertical primero; sin lectura para jugar; sin zoom ni scroll |
| performance-optimization | Arte procedural (sin bitmaps escalados); audio sintetizado (sin ficheros); zip ≤5 MB |
| audio-design | SFX sintetizados por buses (scanTick, reveal, caught, dodge); silencio durante anuncios |
| create-game-assets | `crowd.ts`: 18 variantes de persona + 4 trajes de robot + 3 fondos de ciudad, generados a resolución real |
| game-docs | Este pack: teardown, filtros, informe, listing, biblia de arte |
| camera-systems | Sin cámara móvil: el andén entero cabe en pantalla; el haz es el foco |
| physics-tuning | No aplica física (hidden object) — justificado: el juego no tiene cuerpos ni colisiones |
| phaser-arcade-physics | NO APLICABLE — sin física en este juego (ver arriba) |
| shader-programming | NO APLICABLE — el haz es un degradado de Graphics; sin shaders custom |
| threejs-* (13 anidadas) | NO APLICABLE — juego 2D con Phaser; Three.js no se usa |
| skills-marketing (11) | NO APLICABLE en ronda 1 — el marketing (covers, GIF, Short) se hace en la entrega, no en el código; la lista y el guion del Short están en el pack |
| skills-competencia (6, salvo game-feel-and-juice) | NO APLICABLE en ronda 1 — auditorías de pulido para rondas posteriores |

## No leídas enteras (justificación)

Las 66 se verificaron por descripción + cabecera en el informe de r2; las 7
nucleares + `designing-mini-games` se leyeron enteras aquí (arriba). El resto
de skills no listadas arriba se juzgaron no aplicables por su descripción
(motor 3D, shaders, marketing, publicación) y no se usaron.
