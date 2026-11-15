# Doubloon Rush — Skills usadas (solo kit/skills/, ronda 1)

Leídas y aplicadas de `comunicacion-ias/kit/skills/` (lista de Grok). Ninguna skill fuera de la lista.

| Skill | Dónde se aplicó |
|---|---|
| skills-pro/playgama-bridge | Wrapper `src/bridge/bridge.ts`: `initialize()` antes del motor, `platform.language` leído una vez, `game_ready` al primer frame jugable, `storage` solo vía Bridge, anuncios por estados, pausa/audio por eventos |
| skills-pro/save-systems | Guardado versionado `src/save.ts` (`doubloon-rush-save-v1`), fallback localStorage solo fuera de Playgama |
| skills-arte/art-bible | Dirección de arte y paleta (`art-bible.md`); arte premium primero |
| skills-arte/sprite-gen | Hojas de sprites sobre magenta + chroma key + atlas (`scripts/process-art.py`) |
| skills-arte/create-game-assets | Fondos 780×1688, portada clave, mapa pergamino, mascota |
| skills-pro/phaser-core | Escenas, Scale.RESIZE, contenedores, tweens, `getBounds()` |
| skills-pro/input-systems | Zonas táctiles en coordenadas locales (rectángulos top-left relativos; ver `audits.md` — el primer intento usaba coordenadas de origen y fallaba) |
| skills-pro/playgama-publish | Portadas 800×800 / 1080×1920 / 1920×1080 (≤ 10 MB), zip ≤ 5 MB, `playgama-bridge-config.json`, checklist de borrador |
| skills-pro/onboarding-and-teaching | Tutorial nivel 1 en 3 pasos con la mano oficial |
| skills-pro/difficulty-and-balancing | Curva en `src/rules/rules.ts` (rampa con √nivel, estrellas al 45/75/110 %) |
| skills-pro/smoke-testing-web-games | `scripts/smoke-test.py` (20 comprobaciones: escenas, zonas táctiles, partida real, guardado, EN/ES, horizontal, 0 errores) |
| skills-pro/game-design-fundamentals | GDD: una frase, un gesto, bucle 45–60 s |
| skills-pro/designing-mini-games | Estructura de minijuego: parrilla 3×4, oleadas, combo |
| skills-pro/pacing-and-the-player-journey | Rampa de velocidad, intersticial solo en pausas naturales |
| skills-pro/localize | i18n EN/ES (`src/i18n.ts`), EN por defecto, español solo con es/es-MX |
| skills-pro/level-design | 30 niveles + mapa serpenteante + reto diario |
| skills-pro/game-docs | GDD.md, teardown.md, art-bible.md, este archivo |
| skills-competencia/auditing-game-screen-readability | Textos con contorno + sombra; título del menú medido (56 px, sin recortes) |
| skills-competencia/game-quality-gates | Precheck del zip (ver `audits.md`): index.html en raíz, nombres latinos, tamaño, Bridge ≥ 2.2.0, sin `window.__*` en producción |
| skills-competencia/game-polish-audit | Juicio y partículas (explosión de monedas, textos flotantes, vibración) |
| skills-competencia/juice-audit | Coin burst, confetti del doblón, shake de cámara en bomba |
| skills-competencia/review-game | Auto-revisión round 1 (`informe-ronda1.md`) |
| skills-competencia/game-juice | Tween de aparición (Back.easeOut), rebote de botones |
| skills-competencia/game-feel-and-juice | Sonido sintetizado + vibración en acierto/fallo |
| skills-competencia/game-ui-ux | Botones ≥ 88 px, mínimo 48 px; HUD legible; pausa |
| skills-competencia/mobile-games | Vertical 390×844 primero; horizontal adaptativo sin bandas negras |
| skills-competencia/game-feel | Un solo gesto (tocar); respuesta inmediata |
| skills-competencia/performance-optimization | Atlas WebP (2048×1024 máx.), dist 3,4 MB, zip < 5 MB |
| skills-competencia/audio-design | SFX sintetizados WebAudio (sin archivos de audio); silencio; mute por plataforma |
| skills-competencia/evaluating-gameplay-balance | Umbrales de estrellas calibrados con la puntuación esperada por ronda |
| skills-competencia/playtest-report | Smoke test + informe de ronda (resultados medidos, no afirmados) |
| skills-arte/art-direction-and-readability | Comparación lado a lado con Metro (`filtro-visual.md`) |
| skills-arte/directing-game-visuals | Composición de portadas (título + sello + arte clave) |
| skills-arte/styling-web-game-typography | Lilita One con contorno; título medido a 390 px |
| skills-pro/phaser-arcade-physics | No usada (sin físicas; juego de tocar por turnos) |
| skills-pro/web-game-performance | Bundle 1,5 MB (Phaser); sin peticiones externas; sin GA4 |
| skills-marketing/thumbnail-design | Portadas (6) con título legible + sello |
| skills-marketing/hook-writer | Gancho del Short: «1 in 500… can YOU find the Golden Doubloon?» |
| skills-marketing/youtube-shorts | Short 1080×1920, 21,1 s, gameplay real + tarjeta final |
| skills-marketing/playgama-game-video | GIF 9 s, 12 fps, 390 px, termina en victoria |
| skills-marketing/viral-reverse-engineering | Teardown de Shorts/TikTok del token pirata |
| skills-marketing/virality | Contador de probabilidad visible como espectáculo |
| skills-marketing/youtube-publishing-and-metadata | `listing.txt`, `seo.md` (títulos, descripción, etiquetas) |
| skills-marketing/instagram-seo | No aplicada en esta ronda (sin cuenta de Instagram del estudio en uso) |
| skills-marketing/ab-testing | No aplicada en esta ronda (sin tráfico aún para probar) |

Nota: la orden habla de «66 skills»; en `kit/skills/` hay 54 carpetas (12 arte + 6 competencia + 11 marketing + 25 pro) y `skills.json` de la oficina dice 56. Se usaron solo skills de esa lista; la discrepancia de conteo queda anotada como pregunta en el informe final.
