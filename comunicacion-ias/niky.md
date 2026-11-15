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
- **Veredicto (orden de Daniel 19:11, «ganar a los rivales»):** el concepto gana en 2 dimensiones (decisiones, identidad), empata en 3 (arte, gancho 10 s, onboarding, sonido — en papel), **pierde en 3 (primer fotograma, feel/juice, rejugabilidad)** y no es verificable en 2 (monetización, rendimiento). 3 puntos clave a superar: choque en cadena como primer fotograma/miniatura, decisiones con coste en tiempo real, tycoon por barrios + diario + login.
- **Demanda (PR #30, rama `origin/niky/demanda-usuario-1511`, integrada 15/11 ~19:20):** el choque ES el primer fotograma y la miniatura (ancla de fallo, thumb-stop ≥35 %); meta de tycoon por barrios; reto diario «hora punta» + login; sesión 3–8 min; listones D1 ~22 %, D7 <4 %, D30 0,68–0,79 % (con meta 5–10 %). §4.2 mide a los top contra los ajustes de demanda: donde el top no los cumple, ahí ganamos.
- **Selección 147 skills (norma de Daniel 15/11 19:16, «revisar TODAS una a una»):** informe PR #27 leído entero + las 147 `SKILL.md` revisadas por nombre y descripción (verificadas en disco: arte 66, competencia 13, pro 57, marketing 11). **108 USAR, 39 NO** — tabla completa en el teardown §12, con fase y motivo por skill. Nuevas aplicadas en §11: `stress-testing-game-concepts` (C1–C6, sin hard_reject), `maximizing-game-feel` (vocabulario por evento), `attack-tell` (contrato de aviso), `balance-design` + `evaluating-gameplay-balance` + `difficulty-and-balancing` + `implementing-gameplay-invariants` (contrato `traffic-chaos-v1` + 5 invariantes), `arcadifying-mini-games` (capas que faltan), `gating-intent-legibility` (clave congelada; el mockup es self-audit, no veredicto), `game-engagement-ideas` + `analytics-funnel` (funnel v1 + 4 hipótesis), `art-direction-and-readability` + `directing-game-visuals` (anillo blanco→naranja→rojo, nunca amarillo). 2 bloqueadas por licencia fuera del kit: `game-playtest-squad-skill` y `game-audio` (ingenium).
- **Pendiente:** nada. Demanda integrada; 147 revisadas.

## Herramientas

(Qué tengo y qué me falta: generación de imágenes, navegador para Playgama y YouTube, Node + Phaser 3 + TypeScript, ffmpeg.)

## Autorrevisiones

(APROBADO o DEVUELTO de los juegos de Anita, con fecha, slug, ronda y lo comprobado.)

## Encargo prioritario: Scribble Striker (fútbol de papel) · 15/11/2026, 11:05, hora de Madrid
- **Dónde está:** repo privado `danielsanchezverdasco-art/dana-games-juegos`, carpeta `scribble-striker/` (código Phaser 3 + TypeScript + Vite completo, pruebas, capturas y zip).
- **Léete primero** `scribble-striker/ESTADO.md` (cómo compilar, qué está hecho y qué falta, en orden).
- **Por dónde seguir:** 1) repetir `pruebas/corners.py` tras mover el botón x2 de la pantalla de victoria; 2) escribir `listing.txt` (primero EN, luego ES); 3) comparar lado a lado con Metro (`referencia-metro/`) y aplicar la lección del campo en `manual/CONTROL-CALIDAD.md` (cada equipo en su color, líneas del campo neutras, línea del centro que cuenta y dibujada, nivel «10.000 dólares»); 4) APROBADO de Anita; 5) subir a Playgama según `manual/PUBLICAR-Y-MARKETING.md`.
- **No empieces hasta que Daniel te lo diga.**
