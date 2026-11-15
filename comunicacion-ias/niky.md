# Niky · registro

Daniky = Niky.

(Escribe aquí cada entrega con fecha y hora de Madrid, skills usadas y ruta.)

## Dirección de arte: Traffic Chaos: New York Rush · 15/11/2026, 19:15, hora de Madrid — actualizada 19:2x
- **Qué:** paso 3 del proceso de 10 pasos. Documento completo (14 secciones, 60 KB) + 2 pantallas clave, fieles al mockup aprobado por Daniel 15/11 19:08. Listón: ganar al mejor juego de tráfico (comparativa vs Mini Motorways, Intersection Controller, Traffic Escape!/Jam Escape, Car Jam Escape, State Connect en el documento, §8).
- **Dónde:** repo público `danielsanchezverdasco-art/estudio-dana-oficina`, rama `niky/arte-traffic-chaos`, carpeta `comunicacion-ias/arte/traffic-chaos/` — `direccion-arte-traffic-chaos-2026-11-15.md`, `traffic-chaos-menu-390x844.webp` (1072×2320), `traffic-chaos-gameplay-390x844.webp` (1184×2096, v3).
- **Corrección de demanda (PR #30, §14 del documento):** la portada y el primer fotograma son **el choque en cadena a cámara lenta con el anillo a cero** — menú v2 (taxi volando, rueda suelta, anillo rojo vacío, «BEEP!») + tira de barrios desbloqueables (TIMES SQUARE ★ / BROOKLYN BRIDGE 🔒 / CENTRAL PARK 🔒) + reto diario. La preview exacta muestra el tráfico fluyendo sin choque como primer fotograma: esta dirección lo corrige y lo documenta (§7); **pendiente de confirmación expresa de Daniel en la revisión de enganche visual** (si prefiere la portada en calma, se revierte la v2 a la v1). Partida v3 reconciliada con la preview: temporizador 00:28, % como micro-etiqueta sobre el anillo, sin dedo (es overlay de FTUE), asfalto mojado. Artefacto residual honesto: en la v3 las carcasas inferiores de semáforo aún muestran rojo+verde (límite del generador; en motor es imposible por construcción, un sprite por estado).
- **Skills usadas (órdenes de Daniel 15/11 19:10, 19:15, 19:16):** las 8 originales (art-bible, art-direction-and-readability, create-game-assets, directing-game-visuals, sprite-gen, auditing-game-screen-readability, game-ui-ux, styling-web-game-typography) + 10 leídas enteras (game-ui-taste, taste-skill, game-ui-ux-pro-max, generate2dsprite, generate2dmap, maximizing-game-feel, gating-intent-legibility, tutorial-for-game, blender-lighting-lookdev, emil-design-eng). **Revisión completa de las 147 skills una a una (§13 del documento): USE 93 · CONSULTED 8 · CONDITIONAL 3 (GSAP, solo si hay overlay DOM) · FUTURE 8 (marketing post-lanzamiento) · NO 35** — con motivo por skill: blender-* (9) no ejecutables (Blender no instalado; solo conocimiento, p. ej. lighting-lookdev), sprite-forge por API sin keys (la ruta es la herramienta de imagen propia), threejs-* (13) descartados (motor Phaser 2D), game-playtest-squad-skill y game-audio bloqueados sin licencia. Sin esa revisión no se empieza a construir: §13 es la revisión.
- **Hueco:** las 8 skills originales están como SKILL.md pero sin sus ficheros de referencia (GUIDE.md, CHECKLIST.md, check-screen-frames.mjs, etc.); métodos aplicados desde el cuerpo del SKILL.md. La auditoría mecánica y el gate de legibilidad de intención quedan para la primera build jugable.
- **Pendiente:** revisión de enganche visual (lector externo) sobre las dos pantallas + confirmación de Daniel del cambio de portada al choque; después, fabricación (pasos 4–10). Nada publicado fuera del repo; nada enseñado a Daniel sin comparar lado a lado con Metro.

## Herramientas

(Qué tengo y qué me falta: generación de imágenes, navegador para Playgama y YouTube, Node + Phaser 3 + TypeScript, ffmpeg.)

## Autorrevisiones

(APROBADO o DEVUELTO de los juegos de Anita, con fecha, slug, ronda y lo comprobado.)

## Encargo prioritario: Scribble Striker (fútbol de papel) · 15/11/2026, 11:05, hora de Madrid
- **Dónde está:** repo privado `danielsanchezverdasco-art/dana-games-juegos`, carpeta `scribble-striker/` (código Phaser 3 + TypeScript + Vite completo, pruebas, capturas y zip).
- **Léete primero** `scribble-striker/ESTADO.md` (cómo compilar, qué está hecho y qué falta, en orden).
- **Por dónde seguir:** 1) repetir `pruebas/corners.py` tras mover el botón x2 de la pantalla de victoria; 2) escribir `listing.txt` (primero EN, luego ES); 3) comparar lado a lado con Metro (`referencia-metro/`) y aplicar la lección del campo en `manual/CONTROL-CALIDAD.md` (cada equipo en su color, líneas del campo neutras, línea del centro que cuenta y dibujada, nivel «10.000 dólares»); 4) APROBADO de Anita; 5) subir a Playgama según `manual/PUBLICAR-Y-MARKETING.md`.
- **No empieces hasta que Daniel te lo diga.**
