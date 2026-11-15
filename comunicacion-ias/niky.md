# Niky · registro

Daniky = Niky.

(Escribe aquí cada entrega con fecha y hora de Madrid, skills usadas y ruta.)

## Torre F1 · progreso · 15/11/2026, 23:18, hora de Madrid
- **Qué es:** artefacto NUEVO e independiente `torre-dana-games-f1` (no se toca `torre-dana-games`, que lleva el Simpson). Fiel a la preview F1 (`torre-nuevos-disenos/media-generation-preview-edificio-f1-0-581dbeb5-dfef-46d1-8ecb-d5b4f28d0206.webp`): pit lane nocturno, 5 plantas, una oficina por planta (5ª DIRECCIÓN, 4ª REUNIONES, 3ª KPIs, 2ª IDEAS, 1ª DISEÑO). Funcionalidad exactamente igual que la v14. Todo en una pantalla a 390 px, sin scroll.
- **AHORA (23:18):** generando los personajes como arte real. 20/20 sprites ya en disco (`~/workspace/torre-personajes-f1/`): león Daniel, búho Anita, zorro Grok, blob Dani, Moteo, rana KPIs, ardilla Ideas, camaleón Diseño y 2 mecánicos genéricos, cada uno con pose de caminar y de trabajo. Falta: hoja de contacto + manifiesto del agente de assets.
- **Qué queda (orientativo):** hoja de contacto + manifiesto (~minutos) → construir el artefacto → verificar a 390 px → entregar para probar. Sin ETA exacta: orden de calidad de Daniel (23:05) — mejor acabada que rápida.
- **No estoy atascado:** el agente de assets sigue activo. La revisión de atascos de Daniel (23:17) era por falta de actividad visible, no por bloqueo.
- **CAMBIO DE PLAN (Daniel 23:19):** NO artefacto independiente. El tema F1 se entrega como PACK DE TEMA en `~/workspace/torre-temas/f1/` (arte + fondos, sprites, `tema.json`, README) para instalarlo en el selector de 4 temas del edificio principal. El trabajo sigue igual: assets F1 fieles a la preview, personajes animados, orden de calidad vigente.

## Torre F1 · PACK COMPLETO Y VERIFICADO POR MÍ · 15/11/2026, 23:59, hora de Madrid
- **Estado: LISTO para instalar.** Pack en `~/workspace/torre-temas/f1/` (44 ficheros, ~24 MB): 32 sprites PNG (8 personajes × 4 frames: f1 idle, f2/f3 CARRERA, f4 trabajo), 6 fondos WebP (pit lane nocturno + 5 plantas), `tema.json` con `estado: "listo"`, README, manifiesto + manifiesto JSON, hoja de contacto, copia de la preview.
- **Verificación MÍA (no solo del agente — lección Atlantis):** programática con script propio (tema.json válido, 39 refs y NINGUNA rota, 32/32 PNG RGBA con alfa real 0–255, mismo lienzo por personaje, 1024 px) + visual lado a lado con la preview aprobada: he mirado la preview, la hoja de contacto con los 32 sprites, los 6 fondos y grok-f3 a plena resolución.
- **Lo que vi:** león Daniel saltando con el megáfono como en la preview; búho Anita, zorro Grok, blob Dani, Moteo con neumático, rana KPIs, ardilla Ideas, camaleón Diseño — todos F1, distintos, calidad 3D, nada reutilizado de otros temas (órdenes 23:41/23:42). Los f2/f3 son zancadas de carrera de verdad (órden 23:46: piernas extendidas, cuerpo inclinado, herramientas en mano). Fondos fieles a cada planta de la preview (Dirección con trofeos y coche modelo, Reuniones con el F1 sobre la mesa, KPIs con gráfico de barras rojo, Ideas con bocetos y bombillas, Diseño con el F1 a cuadros).
- **Desviaciones honestas (en el manifiesto, 14):** fondos Dirección y KPIs salieron VERTICALES (1184×2096) — el instalador debe recortar al centro (contenido centrado, anotado en README); ideas-f4 con la bombilla apagada (menor, se deja); líneas de velocidad blancas son parte del arte. **Una diferencia estructural con la preview:** en la imagen las plantas bajas las atienden mecánicos humanos; el pack usa el reparto animal de la oficina con mono de carreras (es el casting de la torre y la orden de personajes distintos por tema; el león sí es el de la preview).
- **Órdenes de Daniel aplicadas (23:37–23:46):** fidelidad 100% a la preview + comparación lado a lado, todo animado e interactivo con la salsa F1, personajes distintos y de calidad, mecánicos corriendo, impresionante o no se enseña.
- **Qué queda (NO es mío):** la instalación en el selector y que el edificio F1 se vea y se mueva en la torre es del agente Simpson. El pack está listo; si su integración no se parece a la preview, eso ya no está en este pack. Pack 24 MB: al integrar conviene bajar a WebP/512 px (~5 MB).
- **Skills:** revisadas una a una las 4 carpetas del kit + dana_games_production_gate + gpt_image/nano_banana. Usadas: create-game-assets, art-bible, directing-game-visuals, art-direction-and-readability, auditing-game-screen-readability, game-polish-audit/game-quality-gates, game-feel, mobile-games, performance-optimization, phaser-core. Sprite-gen NO usado (decisión de Daniel 21:03). Detalle en `PERSONAJES-F1-manifiesto.json`.

## Herramientas

(Qué tengo y qué me falta: generación de imágenes, navegador para Playgama y YouTube, Node + Phaser 3 + TypeScript, ffmpeg.)

## Autorrevisiones

(APROBADO o DEVUELTO de los juegos de Anita, con fecha, slug, ronda y lo comprobado.)

## Encargo prioritario: Scribble Striker (fútbol de papel) · 15/11/2026, 11:05, hora de Madrid
- **Dónde está:** repo privado `danielsanchezverdasco-art/dana-games-juegos`, carpeta `scribble-striker/` (código Phaser 3 + TypeScript + Vite completo, pruebas, capturas y zip).
- **Léete primero** `scribble-striker/ESTADO.md` (cómo compilar, qué está hecho y qué falta, en orden).
- **Por dónde seguir:** 1) repetir `pruebas/corners.py` tras mover el botón x2 de la pantalla de victoria; 2) escribir `listing.txt` (primero EN, luego ES); 3) comparar lado a lado con Metro (`referencia-metro/`) y aplicar la lección del campo en `manual/CONTROL-CALIDAD.md` (cada equipo en su color, líneas del campo neutras, línea del centro que cuenta y dibujada, nivel «10.000 dólares»); 4) APROBADO de Anita; 5) subir a Playgama según `manual/PUBLICAR-Y-MARKETING.md`.
- **No empieces hasta que Daniel te lo diga.**
