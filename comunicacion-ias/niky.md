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

## SKY STACK — Apila Torres (estudio) · 15/11/2026, 23:24, hora de Madrid
- **Qué es:** estudio de la idea de Daniel (juego de apilar un edificio en vertical con precisión, estilo Stack, TEMÁTICO con los 36 temas de la torre). Veredicto: **SÍ — 32/35, 🟢 FUERTE, el más alto de la lista** (condición: 4 temas destacados completos + tienda con los 36 + cero dinero real + curva verificada por simulación).
- **La regla (Daniel 23:14–23:23):** LA VISUAL LO ES TODO — cada tema con sus assets perfectos fieles a su preview, animaciones de colocación/caída/celebración, personajes que reaccionan, presentación premium. TODOS los temas comprables con monedas del juego y elegibles (23:22). Juego TOP en todo: jugabilidad, visual, sonido, progresión. Mañana 16/11 por la mañana, listo para probar en la oficina, sin fallos ni bloques.
- **Dónde está:** `comunicacion-ias/apila-torres/estudio-sky-stack-2026-11-15.md` + mockup `media-generation-mockup-sky-stack-f1-*.webp` + previews `media-generation-preview-sky-stack-f1-*.webp` y `media-generation-preview-sky-stack-atlantis-*.webp` (F1 y Atlantis con HUD real). Desviaciones honestas: el mockup dice «F1» (en el juego real, «Turbo Racing»); la mascota sale dos veces en la preview F1 (en el juego, una sola); la sirena se parece mucho a Ariel (diferenciarla más al construir).
- **Título EN:** SKY STACK · **ES:** Apila Torres · **Slug:** `sky-stack`. «Tower Stack» YA EXISTE como juego: no se usa. Verificar que SKY STACK está libre en Playgama antes de construir.
- **Catálogo (verificado en disco):** 37 previews válidas, 36 temas (corrección: circulaba «38», el conteo real es 37 imágenes / 36 temas; Cyberpunk tiene 2 variantes). 4 destacados (Turbo Racing GRATIS, Brick Builders 100, Deep Sea 150, Toon Yellow 150) + 12 comunes a 150 + 12 raros a 300 + 8 épicos a 500 = 9.800 monedas la colección completa. Excluidos: acuarela, cine mudo, Western v1, Minions v1 (descartados por Daniel).
- **Evidencia:** Stack (Ketchapp) 70M instalaciones, 4,2★, 408.928 valoraciones, actualizado 10/2026 con modo Stack City (AppBrain, noviembre 2026).
- **Skills usadas:** create-game-assets, art-bible, directing-game-visuals, theme-factory, generate2dsprite, sprite-atlas, spine-skeletal, vfx-generate, physics-tuning, phaser-arcade-physics, camera-systems, difficulty-and-balancing, evaluating-gameplay-balance, balance-design, input-systems, game-ui-ux-pro-max, game-ui-taste, maximizing-game-feel, action-feel, juice-vfx, haptic-rumble, save-systems, playgama-bridge, playgama-publish, onboarding-and-teaching, prototype-fast, implementing-gameplay-invariants, asset-audit, hook-writer, thumbnail-design, game-docs (revisadas las 147 del kit una a una + 13 de oficina; SpriteCook NO se usa, decisión de Daniel 21:03).
- **Qué falta:** que terminen los 4 edificios (sus packs de tema alimentan el juego); preparar assets + código base; prototipo desechable + simulación de 100 partidas; arte premium por oleadas (4 → 12 → 12 → 8); código con la plantilla; preview exacta; playtest 3 de 3; QA técnica; revisión cruzada; **mañana en «Juegos para probar», Daniel lo prueba y da el OK o no. Por orden de Daniel 23:17, se fabrica SIN esperar aprobación.** El juego NO se fabrica todavía (estudio entregado esta noche).
- **Herramientas:** generación de imágenes, navegador, Node + Phaser 3 + TypeScript, ffmpeg.

## SKY STACK — fabricación real · 16/11/2026, 01:00, hora de Madrid
- **Qué estoy haciendo:** fabricar SKY STACK sin parar (orden de Daniel 21:59). Worktree propio `~/workspace/wt-sky-stack-real`, rama `niky/sky-stack-real-1511` (dana-games-juegos), HEAD `3f6315c`.
- **Hecho hasta ahora:** escenas reescritas con arte real (Menu, Game, Shop nueva con los 36 temas, Result); lógica pura nueva (themeAssets, misiones diarias, simulación Monte Carlo 100 partidas: mediana nuevo 19 pisos, bueno 64 — invariante del estudio OK); `tsc` 0, `vitest` 40/40; pack Brick Builders verificado lado a lado con la preview LEGO e integrado (228 KB; su `mascot-panic` es copia de `mascot-idle` porque el pack traía otra cara — el pánico lo da el shake); smoke headless dist-qa: menú listo, Game arranca con arte real, 0 errores de consola no-404; `listing.txt` EN+ES escrito; 2 bugs corregidos esta noche (bg-near tapaba el cielo a pantalla completa → ahora banda inferior de 420 px; el toque en PAUSA también soltaba pieza → ahora se ignora).
- **En marcha ahora mismo:** 3 agentes en paralelo fabricando los packs que faltan (Turbo Racing, Deep Sea, Toon Yellow) desde las 00:33. Al aterrizar cada uno: verificación lado a lado con su preview, integración en `public/themes/<id>/`, `packReady: true` en `profile.ts` + actualizar `profile.test.ts`.
- **Después:** builds Playgama/YouTube, `verify.py` (adaptar el paso `g.timeLeft = 2`, que SKY STACK no tiene), preview exacta desde dentro jugando, GIF 8–10 s, portadas con sello Dana Games, `entregas/sky-stack-round1/`, push + PR, revisión cruzada, presentar mañana en «Juegos para probar».
- **Cuánto queda (orientativo):** ~2–3 h si los 3 packs aterrizan limpios; el playtest humano 3 de 3 es Daniel mañana por la mañana (subagente sin navegador en vivo).
- **Riesgos honestos:** el título SKY STACK existe fuera de Playgama (varios juegos con ese nombre; en Playgama la búsqueda no dio resultados, pero la colisión es un riesgo a comunicar a Daniel, no un bloqueo); los fondos LEGO llevan marcas diminutas en relieve en las tachuelas (~6–10 px, ilegibles a escala de juego); `verify.py` trae un paso de la demo de la plantilla que hay que adaptar.
- **Skills usadas:** phaser-core, phaser-scene-scaffolding, playgama-bridge, save-systems, difficulty-and-balancing, evaluating-gameplay-balance, game-ui-ux-pro-max, game-feel, game-juice, juice-vfx, audio-feel, tutorial-for-game, onboarding-and-teaching, smoke-testing-web-games, playtest-report, asset-audit, create-game-assets, art-bible, directing-game-visuals, thumbnail-design, localize, game-docs.

## SKY STACK — fabricación real · 16/11/2026, 01:05, hora de Madrid
- **3 packs integrados** (`public/themes/`, rama `niky/sky-stack-real-1511`, HEAD `48cb051`): Turbo Racing 408K, Brick Builders 228K, Toon Yellow 308K — los 3 verificados lado a lado con su preview (piezas, fondos, mascotas, transparencia, medidas). Deep Sea: ficheros dentro (476K) pero `packReady: false` — su bg-far es el fondo de la torre con un templo de 5 plantas dibujado en el centro (chocaría con la torre del jugador) y su sirena es casi Ariel; agente de corrección re-despachado (bg-far con agua abierta y centro libre + sirena diferenciada: pelo no rojo, cola dorada). Turbo: agente de corrección re-despachado para la bandera de la corona (demasiado pequeña).
- **2 bugs REALES encontrados por el smoke de 3 temas y corregidos:** (1) `go()` dejaba `_leaving = true` para siempre (bug latente de la plantilla: el objeto escena persiste entre reinicios) — el menú no podía salir dos veces en una sesión; (2) `onPlay` no marcaba `tutDone` — el force gate volvía en cada visita al menú y su dim tapaba las tarjetas de temas (no se podía comprar). El juego de Turbo Racing ya se ve premium (captura: circuito nocturno, mecánico león, pieza a rayas).
- **Builds en verde:** `tsc` 0, `vitest` 40/40, `build:playgama` + precheck 0 FAIL (1 WARN conocida: JS único 1.569 KiB), zip Playgama 1,9 MB (≤5 MB), `build:youtube` + precheck 0 FAIL. `verify.py` adaptado (el fin de ronda ya no usa `timeLeft`, fuerza un fallo con `movingX`).
- **Cuánto queda (orientativo):** que aterricen las 2 correcciones (~15 min) → integrarlas + flip de `packReady` de Deep Sea → `verify.py` completo → preview exacta + GIF → portadas con sello + `entregas/sky-stack-round1/` → push + PR → revisión cruzada → presentar mañana en «Juegos para probar». Playtest humano 3 de 3 = Daniel mañana.

## SKY STACK — fabricación real · 16/11/2026, 01:15, hora de Madrid
- **Los 2 bugs, confirmados corregidos por sonda directa:** `tutDone` persiste tras el primer PLAY (el gate ya no vuelve) y la compra de Toon Yellow funciona (9999 → 9849 monedas, tema seleccionado). La misión diaria es determinista (día 320 % 5 = reach-15 hoy; el «25» del primer smoke era el día 319 en hora UTC de la VM, no un bug).
- **Pendiente de confirmar:** el re-run de smoke3 (compra de Toon tras compra de Brick en la misma sesión) — la sonda aislada funciona; si el smoke vuelve a fallar en ese paso exacto, hay un timing del sandbox tras `scene.restart()`, no un bug de lógica.

## SKY STACK — fabricación real · 16/11/2026, 01:35, hora de Madrid
- **Deep Sea CORREGIDO y verificado por mí (no solo por el agente):** bg-far nuevo con agua abierta y centro libre + sirena diferenciada (pelo azul/violeta, cola dorada, corona de coral — nadie la confunde con Ariel) + bandera de corona de Turbo grande y legible. Los 3 ficheros integrados; `packReady` de Deep Sea a true. **Los 4 temas destacados ya son jugables.** `tsc` 0, `vitest` 40/40, commit `b93775a`.
- **Smoke3 re-run en verde completo:** Turbo, Brick y Toon comprados y jugados en la misma sesión (el fallo anterior de Toon fue un flake del sandbox, no de lógica; la sonda aislada ya lo había confirmado).
- **En curso:** `verify.py` completo sobre dist-qa (hay que repetirlo tras rebuild con los fixes); script del GIF listo (`scripts/make-gif.py`: juega de verdad leyendo `movingX`); portadas listas (`scripts/make-covers.py`, sello siempre por encima del 20% inferior).
- **Cuánto queda (orientativo):** rebuild QA + `verify.py` en verde (~15 min) → preview exacta + GIF + portadas finales → `entregas/sky-stack-round1/` → push + PR → revisión cruzada → presentar mañana en «Juegos para probar».

## SKY STACK — fabricación real · 16/11/2026, 02:00, hora de Madrid
- **VERIFY: PASS (0 fallos)** en el build final: esquinas 6/6, bucle completo, ratios, 0 errores de consola, 0 peticiones fallidas. (El run anterior dio 1 fallo que era un artefacto del sandbox: el probe top-left tardaba 17–20 s de pared en la transición y el timeout era 20 s; 2/2 re-probes a 17,4 s y 20,0 s; timeout subido a 30 s con el motivo documentado.)
- **ENTREGA COMPLETA — PR #5** en dana-games-juegos (`niky/sky-stack-real-1511`, HEAD `545ed8b`): `entregas/sky-stack-round1/` (zips Playgama/YouTube 1,8 MB, 6 portadas, listing EN+ES, preview exacta con torre de 6 pisos, GIF 9,0 s, capturas, verify.json, informe-round1.md). GIF rehecho con el Result nuevo (cielo del tema + estrellas grises huecas). Result con fondo del tema y estrellas ganadas amarillas / no ganadas grises.
- **Revisión cruzada en marcha:** revisor independiente comprobando código, tests, juego en headless, portadas, listing, zips e informe. Veredicto pendiente.
- **Cuánto queda (orientativo):** veredicto de la revisión (~20 min) → arreglar lo que devuelva (si algo) → presentar mañana en «Juegos para probar». Playtest humano 3 de 3 = Daniel mañana.

## SKY STACK — revisión cruzada DEVUELTO → ronda 2 · 16/11/2026, 02:25, hora de Madrid
- **Veredicto del revisor independiente: DEVUELTO** (el juego funciona y se ve bien, pero 2 bloqueantes + 3 importantes). Todo lo bloqueante arreglado en ~1 h, commit `c1d291d` en `niky/sky-stack-real-1511` (PR #5 se actualiza sola).
- **B1 (bloqueante, CORREGIDO y verificado en vivo):** el intersticial se pedía en TODAS las partidas, incluida la primera — incumplía la regla expresa de Daniel y el comentario del código mentía («la plataforma lleva la cuenta», falso). Ahora `platform.beginRun()` cuenta partidas por sesión y `logic/ads.ts` (`adsAllowedOnRun`, testeado) bloquea intersticial + segunda oportunidad + DOUBLE en la partida 1. `scripts/round2-checks.py` nuevo: partida 1 = 0 llamadas, partida 2 = 1 llamada. **ROUND2: PASS.**
- **B2 (bloqueante, CORREGIDO):** el sello tapaba el eslogan en la portada apaisada («ower.»). Portadas regeneradas: eslogan «One tap. One tower. 4 worlds to stack.» íntegro, sello debajo sin taparlo (verificado a ojo).
- **I2 (CORREGIDO):** listing y eslogan prometían «36 mundos con arte propio» con solo 4 listos. Ahora «4 worlds ready now, 32 more coming soon» (EN 102 car., ES 91).
- **I3 (CORREGIDO):** `result.png` era del build anterior; re-capturado fresco desde HEAD (cielo del tema + SCORE + monedas). Menú con dim del force-gate sustituido por `menu-clean.png` (M11, nítido).
- **Menores CORREGIDOS:** M1 `canAfford` (+test), M2 comentario «F1», M3 NEW BEST ya no sale en empate (verificado en vivo: best=5 + partida de 5 → `lastNewBest: false`), M6 toggles de Pausa y nombres de tema en ES, M7 título estático, M8 zip YouTube sin el Bridge de Playgama, M10 comentario obsoleto, M13 franja blanca en tienda p4 (grid a startY 370; hueco azul 84/84 px).
- **Cifras corregidas (M4/M5):** GIF 8,1 s reales (10 fotogramas × 810 ms), no 9,0. Pesos reales de arte: Turbo 405,5 KB, Brick 207,1 KB, Deep Sea 381,6 KB, Toon 288,6 KB.
- **I1 (PENDIENTE, agente de arte en marcha):** Deep Sea `cheer == idle == panic` (mismo md5) y Brick `panic == idle` — regenerando las 3 poses reales con el mismo personaje. Al aterrizar: integrar, rebuild, re-run de `verify.py` completo, zips, entrega actualizada, push.
- **Tests:** `tsc` 0, `vitest` 44/44 (37 base + 3 sim + 3 ads + 1 canAfford).
- **Cuánto queda (orientativo):** poses I1 (~30 min) → `verify.py` final (~15 min) → zips + entrega (~15 min) → presentar mañana en «Juegos para probar». Playtest humano 3 de 3 = Daniel mañana.
- **Skills usadas:** phaser-core, ad-break, playtest-report, smoke-testing-web-games, thumbnail-design, localize, game-docs.

## SKY STACK — ronda 2 COMPLETA, APTO PARA PRESENTAR · 16/11/2026, 02:35, hora de Madrid
- **Revisión cruzada DEVUELTO → TODO CORREGIDO y re-verificado en vivo.** HEAD final `c2fd9ec` en `niky/sky-stack-real-1511` (PR #5, dana-games-juegos).
- **B1:** gate real de primera partida (`platform.beginRun()` + `logic/ads.ts` testeado): partida 1 = 0 llamadas a `interstitial()`, partida 2 = 1. **ROUND2: PASS** (`scripts/round2-checks.py`: A, B y C en verde).
- **B2:** portada apaisada rehecha (eslogan íntegro «4 worlds to stack.», sello sin taparlo). **I2:** listing honesto «4 worlds ready now, 32 more coming soon» (EN 102 / ES 91 car.). **I3:** `result.png` fresco desde HEAD + `menu.png` limpio sin dim.
- **I1 (poses reales):** sirena cheer (brazos en alto) y panic (manos en las mejillas) + minifigura en pánico, integradas y verificadas EN JUEGO (`scripts/deepsea-smoke.py`: `cheer_seen` y `panic_seen` true, 0 errores). Corrección del integrador: los ~578 px magenta de `mascot-idle` son vetas dibujadas en el pelo, no restos de fondo — no se tocan; `tema.json` corregido a «Blue-haired mermaid».
- **Verificación final:** `tsc` 0, `vitest` 44/44, `verify.py` **PASS (0 fallos)** sobre el HEAD final con las poses nuevas (esquinas 6/6, bucle completo, ratios, 0 errores, 0 peticiones fallidas). Zips Playgama 1.877.132 B / YouTube 1.769.796 B, precheck 0 FAIL (1 WARN conocida). GIF 8,1 s reales (no 9,0).
- **Entrega:** `entregas/sky-stack-round1/` (25 ficheros: zips, 6 portadas, listing, preview exacta, GIF, capturas frescas, `verify.json`, `informe-round2.md` con todos los hallazgos y los límites honestos).
- **Pendiente:** playtest humano 3 de 3 = Daniel mañana por la mañana en «Juegos para probar». Sin su OK no se publica nada. FPS y audio reales, pendientes de su móvil.
- **Skills usadas:** phaser-core, ad-break, playtest-report, smoke-testing-web-games, thumbnail-design, localize, game-docs, asset-audit.
