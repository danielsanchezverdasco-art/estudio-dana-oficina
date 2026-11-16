# Revisión — Who Is the Robot? / ¿Quién es el Robot? — ronda 1

**Veredicto: DEVUELTO** (16/11/2026, 12:15, hora de Madrid). Ver `comunicacion-ias/niky.md`.
Rama de Anita: `anita/quien-es-el-robot` (PR #69). Rama de esta revisión: `niky/revision-robot-r1`.

## Capturas (todas 390×844, reales, build de producción del zip salvo `win-l1.png`)

| Fichero | Qué prueba |
|---|---|
| `prod-01-menu-en.png` | Menú EN — título recortado por ambos lados |
| `prod-20-menu-es.png` | Menú ES — título recortado, idioma funciona |
| `prod-11-map-bottom.png` | Mapa, nodo L1 desbloqueado — título «LEVELS» tapado por un nodo |
| `prod-02-map-top.png` | Mapa — BACK solapa el nodo inferior |
| `prod-31-tutorial-l1.png` | L1: robot revelado (anillo dorado, antena, ojo) + mano del tutorial |
| `prod-32-revealed-l1.png` | L1: robot revelado, haz sobre él |
| `prod-41-revealed-l20.png` | L20 (Tokio): robot revelado, 3 corazones |
| `prod-60-after-tap1.png` | L20: tap al centro exacto del robot → corazón perdido + toast «Shiny is not the robot» (señuelo) |
| `prod-24-pause.png` | Pantalla de FALLO por corazones — título recortado por ambos lados |
| `prod-21-shop-es.png` | Tienda ES — «TIENDA» roza la píldora de monedas |
| `prod-26-horizontal-menu.png` | Horizontal: menú estirado, título sobre la multitud, PLAY cortado |
| `prod-27-horizontal-map.png` | Horizontal: el tap a PLAY no navega al mapa |
| `win-l1.png` | Pantalla de victoria «ROBOT CAUGHT!» + 3★ + 45 monedas (build de pruebas, mismo código) |

## Recortes de defectos

| Fichero | Qué prueba |
|---|---|
| `crop-title.png` | Título del menú recortado (W y ? fuera de pantalla) |
| `crop-timer.png` | Temporizador «45» solapado con «NYC — 42 ST» |
| `crop-failtitle.png` | Título de fallo «…ones! La multitud escondi…» recortado |

## Comparativa con Metro

| Fichero | Qué prueba |
|---|---|
| `comparativa-menu-metro.png` | Menú Robot vs Metro (cover) — NO llega |
| `comparativa-l1-metro.png` | L1 Robot vs Metro (cover) — NO llega |

Nota: `kit/referencia-estilo-metro.png` y `kit/referencia-estilo-metro-menu.png` NO existen en el repo; la comparativa usa `art/covers/metro.webp` como referencia disponible.

## GIF

`quien-es-el-robot-gameplay.gif` — 8 s, 12 fps, 390×844, acaba en victoria. Montaje de 4 capturas reales de gameplay (menú → juego → revelado → victoria). NO es vídeo fluido: la grabación de pantalla de esta VM sale con fotogramas corruptos (fondo negro, artefactos verdes) al ir el bucle a ~1 fps.

## Números medidos

- Zip: 633.716 B, sha256 exacto, 14 entradas, ≤5 MB.
- `npx tsc -b`: 0. `test-levels.mjs`: 49/49.
- Harness 30/30 ganados, 30/30 a 3★, 0 errores de consola. Probes L10/L20/L30: revelan y ganan con 3 corazones.
- Anti-trivial corregido: 5/5. Touch test: 24/24 PASS.
- Portadas: 4/6 (falta `cover-800x800-youtube.webp`).
- Consola en PROD: 0 errores en todos los playthroughs.
- Arranque: 5–7,5 s hasta interactivo. rAF: ~1–2 fps en esta VM (el temporizador de juego avanza ~0,1× el tiempo real; la derrota por idle no se pudo demostrar en navegador).
