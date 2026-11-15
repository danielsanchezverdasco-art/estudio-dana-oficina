# Guía para quien ayude a Dana Games (léela entera antes de tocar nada)

Estudio de videojuegos de Daniel: juegos móviles Phaser 3 + TypeScript para Playgama y YouTube Playables, dos al día. Siempre en español. Separado de recurretumulta y de la Tienda España: no los toques.

## Lectura obligatoria
1. NORMAS-EQUIPO.md: normas fijas (Bridge dentro del zip, zonas táctiles con esquina en 0 y test de centro y 4 esquinas, sello oficial arriba, mano oficial, zip ≤5 MB, sin window.__*, sin código de pruebas en producción, sin nombres de otros juegos).
2. brief-juego-comun.md: estilo visual obligatorio (nivel Metro, referencia-estilo-metro.png), filtros, pipeline de arte, marketing y sello.
3. playgama-proceso.md: requisitos de Playgama y YouTube Playables.
4. teardowns-competencia.md.
5. La skill est-ndares-de-calidad-de-daniel (simple, intuitivo, adictivo, espectacular; cambiar de género).

## Skills obligatorias (en esta carpeta; lee el SKILL.md de cada una que aplique)
- skills-pro/: art-direction-and-readability, auditing-game-screen-readability, directing-game-visuals, styling-web-game-typography, input-systems, save-systems, playgama-bridge, playgama-publish, smoke-testing-web-games, onboarding-and-teaching, localize, web-game-performance, designing-mini-games, game-design-fundamentals, difficulty-and-balancing y el resto según el caso.
- skills-arte/: game-ui-ux, mobile-games, create-game-assets, art-bible, playtest-report, phaser-core, game-feel, performance-optimization, audio-design.
- skills-competencia/: game-quality-gates, game-polish-audit, juice-audit, review-game, game-juice.
- skills-marketing/: solo si haces portadas o vídeos (thumbnail-design, hook-writer, youtube-shorts, playgama-game-video…).
Apunta en skills-usadas.md TODAS las que uses.

## Cómo se hace un arreglo (método actual, sin pagar)
- Todo en este ordenador; no se activa nada de pago (uso de Cursor bajo demanda, Fal, Krea). Dinero = sí de Daniel.
- Partes de la última ronda en revision-pendiente/<juego>-roundN/. Si no hay código fuente, se parchea el build y se guardan los parches y el código legible antes/después en pruebas/ (ejemplo: mudanza-round10/pruebas/).
- Dos builds: producción (en el zip, sin parámetros de URL ni globales de prueba) y pruebas aparte.
- Prueba con Playwright a 390x844 con toques reales: 0 errores de consola, centro + 4 esquinas de cada botón, guardado con bridge.storage tras recargar.
- Entregas en revision-pendiente/<juego>-round(N+1)/: zip, portadas (Playgama con sello, -youtube sin sello), capturas 390x844, GIF (8-10 s, ≥12 fps, ≥360 px, acaba en victoria), listing.txt, filtro-visual.md, filtro-jugabilidad.md, skills-usadas.md, informe-rondaN.md punto por punto.
- Nada se publica sin el APROBADO de Arte y Calidad. Nadie sube a Playgama ni a YouTube salvo los agentes de Publicación y de YouTube. Nunca borres vídeos ni cierres sesiones.
- Fallos de cada ronda: auditoria-calidad.md (secciones por juego y ronda) y auditoria-capturas/.
