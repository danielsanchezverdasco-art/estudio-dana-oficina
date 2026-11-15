# Niky · registro

Daniky = Niky.

(Escribe aquí cada entrega con fecha y hora de Madrid, skills usadas y ruta.)

## Entregas

### Teardown Traffic Chaos: New York Rush · 15/11/2026, 19:16, hora de Madrid
- **Dónde está:** repo público `danielsanchezverdasco-art/estudio-dana-oficina`, rama `niky/teardown-traffic-chaos`, `comunicacion-ias/analisis-competencia/teardown-traffic-chaos-2026-11-15.md` (+ mockup aprobado `mockup-traffic-chaos-ny.webp` en la misma carpeta). Paso 1 del proceso de 10 pasos. PR por crear.
- **Skills usadas (orden de Daniel 19:10, «úsalas»):**
  - `game-polish-audit` → estructura completa, pilares/core loop (§1), hallazgos por tiers con etiquetas `[SEEN]`/`[INFERRED]`/`[PLAYTEST]` (§5).
  - `juice-audit` → §3: 4 pilares (input, visual, audio, animación) en los 5 momentos clave (tap, swipe/BOOST, paciencia 8 s, choque en cadena, ambulancia).
  - `game-quality-gates` → §6: 12 reglas traducidas a checklist de construcción del prototipo (reglas 10 y 12 marcadas como no aplicables al prototipo local).
  - `review-game` → §7: **no aplicable aún (no existe código)**; sin puntuación inventada; sus 5 dimensiones quedan como gates del futuro build.
  - `probing-web-game-mechanics` → §8: **no aplicable aún (no hay build ni debug handle)**; lista exacta de 8 probes (P1–P8) con valores esperados del GDD para el prototipo.
  - `playgama-metrics-snapshot` → §0–§2 y §9: **sin MCP de Playgama conectado y sin juego publicado, no hay snapshot**; método aplicado a cifras públicas (cada número con unidad, periodo y fuente).
- **Veredicto (orden de Daniel 19:11, «ganar a los rivales»):** el concepto gana en 2 dimensiones (decisiones, identidad), empata en 3 (arte, gancho 10 s, onboarding, sonido — en papel), **pierde en 3 (primer fotograma, feel/juice, rejugabilidad)** y no es verificable en 2 (monetización, rendimiento). 3 puntos clave a superar: decisiones con coste en tiempo real, choque como espectáculo, Nueva York como personaje.
- **Pendiente:** afinar con los hallazgos de la investigación de demanda en paralelo cuando lleguen.

## Herramientas

(Qué tengo y qué me falta: generación de imágenes, navegador para Playgama y YouTube, Node + Phaser 3 + TypeScript, ffmpeg.)

## Autorrevisiones

(APROBADO o DEVUELTO de los juegos de Anita, con fecha, slug, ronda y lo comprobado.)

## Encargo prioritario: Scribble Striker (fútbol de papel) · 15/11/2026, 11:05, hora de Madrid
- **Dónde está:** repo privado `danielsanchezverdasco-art/dana-games-juegos`, carpeta `scribble-striker/` (código Phaser 3 + TypeScript + Vite completo, pruebas, capturas y zip).
- **Léete primero** `scribble-striker/ESTADO.md` (cómo compilar, qué está hecho y qué falta, en orden).
- **Por dónde seguir:** 1) repetir `pruebas/corners.py` tras mover el botón x2 de la pantalla de victoria; 2) escribir `listing.txt` (primero EN, luego ES); 3) comparar lado a lado con Metro (`referencia-metro/`) y aplicar la lección del campo en `manual/CONTROL-CALIDAD.md` (cada equipo en su color, líneas del campo neutras, línea del centro que cuenta y dibujada, nivel «10.000 dólares»); 4) APROBADO de Anita; 5) subir a Playgama según `manual/PUBLICAR-Y-MARKETING.md`.
- **No empieces hasta que Daniel te lo diga.**
