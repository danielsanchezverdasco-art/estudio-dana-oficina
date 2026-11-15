# Doubloon Rush — Informe ronda 1 (Anita, 15/11/2026)

## Entregado
- **Juego completo** (Phaser 3.90 + TypeScript + Vite): menú, mapa de 30 niveles, reto diario, rondas 45–60 s, tutorial con la mano oficial, guardado versionado, EN/ES, anuncios por estados del Bridge.
- **Título EN propuesto: «Doubloon Rush»** — verificado libre en Playgama el 15/11/2026 (sin coincidencia exacta; no es limpieza de marca). Alternativa descartada: «Gold Doubloon Chest Rush» (largo). Daniel decide.
- **Zip de producción:** `doubloon-rush-round1.zip` — 1,94 MB, 17 ficheros, precheck 16/16 OK (index.html en raíz, nombres latinos, Bridge 2.4.2 primero en `<head>` sin async, sin `window.__*`, sin peticiones externas).
- **Pack de marketing:** 6 portadas (3 Playgama con sello + 3 `-youtube` sin sello), Short 1080×1920 de 21,1 s con gameplay real + tarjeta final, GIF 9 s a 12 fps y 390 px que termina en victoria.
- **Documentos:** GDD, teardown (datos reales), art-bible, skills-usadas, listing.txt, seo.md, estrategia-marketing.md, shorts-teardown.md, filtro-visual, filtro-jugabilidad, audits.md, MANIFEST.md.
- **Código:** `juegos/cofre-del-doblon/` (rama `anita/cofre-del-doblon`).

## Pruebas (medidas, no afirmadas)
- Tests unitarios de reglas: **11/11** (`npm test` — Vitest). Incluye test estadístico del doblón: 200.000 sorteos → 1 entre 425–575 (esperado 500).
- Smoke test Playwright 390×844: **20/20** (`scripts/smoke-test.py`): escenas, zonas táctiles (centro + esquinas 8 px dentro; fuera no hace nada), partida real (0 → 85 puntos en 5 toques), tutorial con mano, guardado en el Bridge (nivel 2 desbloqueado, 3 estrellas), 0 errores de consola, 0 peticiones fallidas, horizontal sin bandas negras, ES muestra español.
- TypeScript estricto: `tsc -b` exit 0.

## Fallos encontrados y corregidos en la ronda
1. Zonas táctiles de los cofres en coordenadas de origen → no puntuaban (ver `audits.md`).
2. Atlas recortado a 1024 px: cofres abiertos, montículo y destello invisibles.
3. Título del menú recortado (una línea → dos líneas → 56 px).
4. `tsc -b` emitía `.js` junto a los `.ts` (14 ficheros) → `noEmit: true` y limpieza.
5. El sello en `public/assets/` metía un `@` en el zip → fuera del bundle (solo para componer portadas desde el kit).
6. Builds que no recogían la última edición (el sistema de ficheros tarda ~2–3 min en ser visible para los procesos): lección — verificar siempre el marcador en el bundle antes de probar.

## Pendiente (no es de esta ronda)
- Revisión cruzada de Niky + APROBADO firmado (CONTROL-CALIDAD).
- Prueba de Daniel de la versión final + su APROBADO para Playgama/YouTube.
- Publicación en Playgama y del Short (sin acceso aún).
- Limpieza de marca de «Doubloon Rush» fuera de Playgama («sin datos aún»).
- Niveles 2–30 jugados a mano (solo el 1 a fondo); doblón visto en partida real (probabilidad 1/500); anuncios reales (sin acceso); rendimiento en móvil real (en sandbox sin GPU: 6–14 FPS).

## Preguntas para Daniel / la oficina
1. ¿Título EN «Doubloon Rush» o «Gold Doubloon Chest Rush»?
2. La orden habla de 66 skills y en `kit/skills/` hay 54 carpetas (56 según `skills.json`): ¿cuál es la lista correcta?
3. PEGI 3 (issue) frente a audiencia 13+ de YouTube Playables: ¿se mantiene PEGI 3 en la ficha de Playgama?
