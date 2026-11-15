# Normas del equipo Dana Games (de Daniel, obligatorias)
- Siempre en español. Reportáis al Director (agente «Dana Games · Director · Director del estudio»).
- Todo se hace con las skills de GitHub instaladas (carpetas skills-* de este kit y /workspace/dana-games-kit/skills-oficina.json). Cada encargo deja su lista de skills usadas; no se aprueba nada sin ellas. Si encontráis una skill mejor, avisad al Director.
- Calidad: simple, intuitivo, adictivo y visualmente espectacular; arte realista de videojuego al nivel de referencia-estilo-metro.png. Nada de textos cortados, solapes ni botones rotos. Verificar siempre el resultado real (página publicada, juego cargando) antes de decir «hecho». Daniel: «No quiero errores».
- Nunca inventar datos, cifras ni métricas. Si no hay dato: «sin datos todavía».
- Dinero, pagos, recargas, datos bancarios o fiscales: solo con el sí de Daniel (pedidlo al Director).
- Nunca cerrar sesión de Google/YouTube/GitHub en el navegador. Nunca borrar vídeos de YouTube (solo ocultar). No comprar promoción. No tocar nada de recurretumulta ni de Tienda España.
- Contraseñas nunca en el chat. Si un sitio pide verificación o código, parad y avisad al Director.
- Ahorro de créditos: sin rutinas nuevas salvo que el Director lo pida.

## Normas fijas del Director (15/11/2026)
- SELLO OFICIAL ÚNICO para todos los juegos: `marca/dana-games_badge_360w@2x.png` (mascota morada con cascos + DANA GAMES), del store del bot (/cursor/stores/bot/marca/). Nada de tarjetas moradas ni píldoras blancas propias. En portadas de Playgama: arriba o en una esquina superior, nunca en el 20 % inferior; la mascota debe medir ≥60 px en 800x800. Las portadas -youtube van SIN sello, pero con el título del juego.
- PESO DEL ZIP: máximo 5 MB (imágenes de interfaz en WebP de calidad ~82, fuentes en WOFF2, sin duplicados ni archivos de pruebas, y la carga diferida de lo que no hace falta al arrancar). Esto sustituye a cualquier otra cifra del brief (15 MB, etc.).
- Ningún resto de pruebas en producción (window.__*__), ni etiquetas con nombres de juegos de otras empresas.

## Norma Bridge (15/11/2026)
- Todos los juegos llevan playgama-bridge.js DENTRO del zip y lo cargan en index.html como primer script (junto a playgama-bridge-config.json). No se confía en que Playgama lo inyecte.
- Comprobación obligatoria: window.bridge existe, initialize() resuelve, se envía game_ready y el progreso sobrevive a recargar (bridge.storage).
- Zonas táctiles: probar las 4 esquinas de cada botón, no solo el centro.

## Norma zonas táctiles (15/11/2026)
- En Phaser, el hitArea va en coordenadas locales con la esquina en 0: `new Phaser.Geom.Rectangle(0, 0, w, h)` para objetos con origen 0,5 (Phaser ya suma displayOrigin). En contenedores: `container.setSize(w,h); container.setInteractive(new Phaser.Geom.Rectangle(0,0,w,h), Phaser.Geom.Rectangle.Contains)`. Nunca `Rectangle(-w/2,-h/2,w,h)`.
- Test obligatorio: centro + 4 esquinas interiores de cada botón responden, y un punto fuera no. No encoger la zona al pulsar.
- Mano de tutorial: índice señalando, nunca un puño con un dedo central levantado.
