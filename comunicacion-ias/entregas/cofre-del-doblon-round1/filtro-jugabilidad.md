# Doubloon Rush — Filtro de jugabilidad (ronda 1, 15/11/2026)

Probado con el smoke test automatizado (`juegos/cofre-del-doblon/scripts/smoke-test.py`, 20/20) + pruebas manuales de toques en el navegador (Playwright, 390×844, táctil).

## Lo verificado con el juego en marcha
- **La mecánica se entiende en 3 segundos:** tocar cofres que salen de la arena; la bomba se reconoce (negra, con mecha encendida); el cangrejo se reconoce (rojo, enfadado).
- **Un solo gesto:** tocar. Sin botones de acción durante la partida salvo pausa y silencio.
- **Ritmo:** nivel 1 con 950 ms entre apariciones y 1500 ms en pie — tranquilo para aprender; la rampa (√nivel) aprieta sin ahogar.
- **El doblón se siente especial:** moneda dorada grande girando sobre el cofre + celebración + 500 puntos. La probabilidad visible (1 entre 500) está en el HUD en todo momento.
- **El cangrejo crea tensión real:** camina hacia el cofre más cercano; si llega, lo roba (el cofre se hunde sin puntos). Tocar al cangrejo (+5) es una decisión rápida.
- **La bomba duele lo justo:** −1 vida + combo a cero + vibración + shake de cámara. Con 3 vidas y la oferta de continuar con anuncio recompensado solo al perder la última.
- **Tutorial:** la mano oficial señala el primer cofre; el texto es corto («Tap the chest!»). Verificado en captura.
- **Guardado:** completar el nivel 1 desbloquea el 2, guarda la mejor marca y las estrellas (verificado leyendo el almacenamiento del Bridge).
- **Idioma:** con locale es-ES el menú muestra «JUGAR» y «¡Toca los cofres antes de que se hundan!»; con locale en-US, inglés. Por defecto, inglés.
- **Horizontal:** a 844×390 el canvas llena la ventana (sin bandas negras); la parrilla se re-centra.

## Zonas táctiles (medido)
- Botón PLAY: centro + 4 esquinas (8 px dentro del borde) funcionan; un toque 5 px fuera no hace nada.
- Cofres: centro del cofre (medido con `getBounds()`) puntúa; clic de ratón y toque táctil, ambos.
- Fallo encontrado y corregido: el primer intento definía las áreas en coordenadas relativas al origen (0.5,1) y Phaser las esperaba relativas a la esquina superior en espacio de fotograma — los toques no puntuaban. Corregido con el tamaño del fotograma (`sprite.width/height`, no `displayWidth/displayHeight`) y verificado: 0 → 11 → 23 puntos con dos toques seguidos (combo ×1.1, ×1.2).

## Lo que NO se pudo probar en esta ronda (honesto)
- **Niveles 2–30 jugados a mano:** solo se probó el nivel 1 a fondo; la curva de niveles 2–30 está cubierta por tests unitarios (11/11) pero no por partidas completas jugadas.
- **El doblón en partida real:** su probabilidad (1/500) hace improbable verlo en una sesión de pruebas corta; el código de aparición y la celebración están probados por el camino del cofre dorado, no por un doblón real en vivo. La tasa está cubierta por test estadístico (200.000 sorteos: 1 entre 425–575, esperado 500).
- **Anuncios reales:** sin acceso a Playgama, los anuncios no se pueden probar de verdad; el código usa los estados del Bridge (`rewarded` solo concede la recompensa) y oculta los botones si no están soportados (verificado: en el entorno local sin anuncios, el botón Luck ×2 no aparece).
- **Rendimiento en móvil real:** en el sandbox sin GPU el juego corre a 6–14 FPS (SwiftShader); en hardware real debe ir a 60 FPS. No se ha medido en un teléfono.

## Fallos conocidos (sin tapar)
- Ninguno abierto en la jugabilidad del nivel 1. Ver `audits.md` para la lista completa de hallazgos de la ronda.
