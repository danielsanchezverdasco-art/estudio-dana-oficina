# Doubloon Rush — Auditorías (ronda 1)

## Precheck del zip — 16/16 OK
`juegos/cofre-del-doblon/scripts/precheck-zip.py` sobre `doubloon-rush-round1.zip` (1,94 MB, 17 ficheros): index.html en raíz; nombres latinos; Bridge 2.4.2 primero en `<head>` sin async; `playgama-bridge-config.json` presente; sin `window.__*` ni `__game`; sin peticiones externas en index.html; `game_ready`, `storage` y anuncios presentes; sin localhost; sin archivos de test ni sourcemaps.

## Smoke test — 20/20 OK
`juegos/cofre-del-doblon/scripts/smoke-test.py` (Playwright, 390×844 + 844×390 + locale es-ES). Última ejecución: 15/11/2026 ~12:07, todo en verde, 0 errores de consola, 0 peticiones fallidas.

## Tests unitarios — 11/11 OK
`juegos/cofre-del-doblon/tests/rules.test.ts` (Vitest): dificultad, combo, puntos, estrellas, pesos de aparición, tasa del doblón (estadístico), penalización de bomba, texto de probabilidad.

## Hallazgos de la ronda (todos corregidos)

### 1. Zonas táctiles en coordenadas de origen (GRAVE, corregido)
- **Síntoma:** los toques en los cofres no puntuaban (0 puntos tras 6 toques en el centro exacto del cofre).
- **Causa:** Phaser suma `displayOriginX/Y` (en píxeles de fotograma) al punto probado; el rectángulo estaba definido en coordenadas relativas al origen (0.5,1) y con `displayWidth/displayHeight` (escalados). El área efectiva quedaba desplazada fuera del sprite.
- **Corrección:** rectángulo en espacio de fotograma (`sprite.width/height`), centrado: `((w-hitW)/2, (h-hitH)/2, hitW, hitH)`. Verificado: `hitTestPointer` devuelve el sprite y dos toques seguidos dan 11 y 12 puntos (combo ×1.1, ×1.2).
- **Alcance:** también se corrigieron la zona del cofre del menú, la del pulpo (ahora área por defecto) y el overlay de inicio (rectángulos top-left relativos). Los botones (contenedores, `displayOrigin` 0) ya funcionaban.

### 2. Atlas recortado a 1024 px de alto (GRAVE, corregido)
- **Síntoma:** montículos invisibles en las capturas; los cofres abiertos no se veían al tocarlos.
- **Causa:** `process-art.py` creaba el atlas de 1024 px de alto y pegaba frames hasta y=2544 (recortados en silencio por PIL); el `crop` final rellenaba con transparente.
- **Corrección:** empaquetado en dos pasadas con límite de textura 2048 px + verificación de que ningún frame quede vacío (falla en voz alta). Atlas de cofres ahora 2048×1024; 0 frames vacíos en los 3 atlas.

### 3. Título del menú recortado (corregido)
- Una línea a 62 px: «OUBLOON RUS». Dos líneas a 64 px: la «N» final rozaba el borde. Dos líneas a 56 px: 346 px de ancho, con márgenes. Verificado en captura.

### 4. `tsc -b` emitía JavaScript (corregido)
- 14 ficheros `.js` junto a los `.ts` en `src/` y `tests/`. `tsconfig.json` ahora tiene `noEmit: true` (solo comprobación de tipos; Vite empaqueta). Ficheros eliminados.

### 5. Sello con `@` en el zip (corregido)
- `dana-games_badge_360w@2x.png` en `public/assets/` rompía la regla de nombres latinos y no lo usa el juego (solo compone portadas). Fuera de `public/`; `make-covers.py` lo lee del kit.

### 6. Builds que no recogen la última edición (lección de entorno)
- Tres veces, un build hecho ~1 minuto después de una edición produjo un bundle con el código anterior (verificado por grep del marcador). La causa es el retardo de visibilidad del sistema de ficheros entre las herramientas de ficheros y los procesos (~2–3 min).
- **Lección:** tras cada edición, verificar el marcador en el bundle antes de probar; si falta, reconstruir. No fiarse de la velocidad del build (los builds «rápidos» de 12 s eran los obsoletos).

## No auditado en esta ronda
- QA Tool de Playgama (sin acceso). Moderación (sin envío). Anuncios reales (sin acceso). Rendimiento en móvil real. Niveles 2–30 jugados a mano. Dobón visto en partida real.
