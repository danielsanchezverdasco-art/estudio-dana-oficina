# Doubloon Rush — MANIFEST (entrega ronda 1, 15/11/2026)

**Juego:** Cofre del Doblón / Doubloon Rush (título EN propuesto; decide Daniel)
**Rama:** `anita/cofre-del-doblon` (desde main `f2084efda8650bec374f99a9493a024c11f019ca`)
**Código:** `juegos/cofre-del-doblon/` (Phaser 3.90 + TypeScript + Vite)
**Zip de producción:** `doubloon-rush-round1.zip` — 2.029.029 bytes (1,94 MB), 17 ficheros, precheck 16/16 OK

## Contenido del pack (29 ficheros, 18 MB)

| Fichero | Tamaño | Descripción |
|---|---|---|
| `doubloon-rush-round1.zip` | 1,94 MB | Zip de producción para Playgama (index.html en raíz, Bridge 2.4.2) |
| `GDD.md` | 6,3 KB | Documento de diseño del juego |
| `teardown.md` | 9,0 KB | Ingeniería inversa con datos reales + verificación del título |
| `art-bible.md` | 3,4 KB | Dirección de arte y proceso |
| `informe-ronda1.md` | 3,3 KB | Informe de la ronda + preguntas |
| `audits.md` | 3,9 KB | Precheck, smoke test, hallazgos y correcciones |
| `filtro-visual.md` | 3,1 KB | Comparación lado a lado con Metro Nightmare |
| `filtro-jugabilidad.md` | 3,5 KB | Filtro de jugabilidad (probado en marcha) |
| `skills-usadas.md` | 5,3 KB | Skills del kit aplicadas (solo lista de Grok) |
| `listing.txt` | 2,0 KB | Ficha EN/ES para Playgama |
| `seo.md` | 1,4 KB | Términos y títulos propuestos |
| `estrategia-marketing.md` | 2,0 KB | Plan de lanzamiento y contenido |
| `shorts-teardown.md` | 2,3 KB | Teardown de 10 Shorts/TikTok |
| `covers/cover-800x800.jpg` | 212 KB | Portada Playgama 800×800 (con sello) |
| `covers/cover-800x800-youtube.jpg` | 208 KB | Portada YouTube 800×800 (sin sello) |
| `covers/cover-1080x1920.jpg` | 466 KB | Portada Playgama 1080×1920 (con sello) |
| `covers/cover-1080x1920-youtube.jpg` | 464 KB | Portada YouTube 1080×1920 (sin sello) |
| `covers/cover-1920x1080.jpg` | 456 KB | Portada Playgama 1920×1080 (con sello) |
| `covers/cover-1920x1080-youtube.jpg` | 443 KB | Portada YouTube 1920×1080 (sin sello) |
| `shorts/doubloon-rush-short.mp4` | 2,1 MB | Short 1080×1920, 21,1 s, gameplay real + tarjeta final |
| `shorts/doubloon-rush-short.gif` | 6,8 MB | GIF 390 px, 12 fps, 9 s, termina en victoria |
| `shorts/short-music.wav` | 1,9 MB | Música original sintetizada del Short |
| `shots/01-menu-390x844.png` | 572 KB | Menú (EN) |
| `shots/02-map-390x844.png` | 576 KB | Mapa de niveles |
| `shots/04-tutorial-390x844.png` | 523 KB | Tutorial con la mano oficial |
| `shots/05-gameplay-mid-390x844.png` | 532 KB | Gameplay (montículos + cofres) |
| `shots/06-results-390x844.png` | 520 KB | Resultados (3 estrellas) |
| `shots/07-menu-landscape-844x390.png` | 527 KB | Menú horizontal |
| `shots/08-menu-es-390x844.png` | 572 KB | Menú en español |

## Pruebas
- Tests unitarios de reglas: 11/11 (Vitest).
- Smoke test Playwright (390×844 + 844×390 + es-ES): 20/20, 0 errores de consola, 0 peticiones fallidas.
- TypeScript estricto: exit 0. Precheck del zip: 16/16.

## Pendiente
- Revisión cruzada de Niky + APROBADO firmado.
- Prueba de Daniel de la versión final + su APROBADO para Playgama/YouTube.
- Publicación en Playgama y del Short (sin acceso aún).
- Limpieza de marca fuera de Playgama («sin datos aún»).
