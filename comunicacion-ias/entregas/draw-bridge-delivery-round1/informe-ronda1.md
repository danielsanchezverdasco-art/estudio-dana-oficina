# Informe ronda 1 — Draw Bridge Delivery

**Estado: CÓDIGO COMPLETO, VERIFICACIÓN PARCIAL.** El juego está construido
de principio a fin (30 niveles, arte, HUD, guardado, tienda, reto diario).
La verificación en navegador está BLOQUEADA por Chromium muerto (exit 133) —
la misma pared que bloqueó las 3 ventanas finisher de Ramp r2. Nada de lo
que sigue se presenta como verificado en navegador.

## 1. Qué se entregó

- **Juego completo**: Phaser 3.90 + TypeScript + Vite, Matter.js. 30 niveles
  (mapa, estrellas, monedas, guardado por Bridge, pausa, tienda de 6 motos,
  reto diario, ES/EN, PEGI 3).
- **Mecánicas**: dibujar puentes con tinta limitada (madera/turbo/saltarina),
  UNDO + ERASER, PLAY, viento, trampolines, puentes móviles, entrega dual.
- **Arte**: 100 % procedural (`city.ts`, 26 texturas a 2x) — ciudad soleada,
  río, casas, scooter con pizza. Cero bitmaps.
- **Rama**: `anita/draw-bridge-delivery` (desde main `56de7692`).
- **Zip**: `draw-bridge-delivery-round1.zip` — **641.068 bytes**, sha256
  `0a788851a79d9d68dbf70e53ba1d09d8480e5119b4d1fccd80a32685a17c8de5`
  (blob `c39c9445aae0115bb8145e2b7e2c2acc3da98f5b`). Construido en memoria
  (el build de vite tarda 1,23 s; la ola EPERM bloquea la escritura a disco
  y deja el bundle en 0 bytes — la copia local no existe, el zip vive solo
  en la rama). Límite 5 MB: OK.

## 2. Verificación (números reales, 16/11)

| Check | Resultado |
|---|---|
| `tsc --noEmit` | **0 errores** |
| `validate-levels.mjs` | **658 checks, 0 fallos** (30/30 niveles geométricamente válidos) |
| Build de test (`dist-test`) | **BLOQUEADO por EPERM** — vite construye en 1,23 s pero la escritura a disco se trunca a 0 bytes (retry 10 min, EPERM). `dist-test` NO usable; el finisher debe reconstruirlo |
| Build de producción + zip | **HECHO en memoria** — zip 641.068 B, sha256 `0a788851…c8de5`, 14 ficheros |
| Zip-smoke | Pendiente (necesita Chromium vivo) |
| Harness en navegador (UI, 30 replays, sondas) | **BLOQUEADO — Chromium muerto (exit 133)** |
| GIF / Short filmado | **Pendiente del harness** |
| Portadas (3 tamaños) | Generadas con la herramienta de medios (arte del juego) |
| Playtest humano (3 testers + Daniel) | **Pendiente** |

## 3. Decisiones de diseño (con su porqué)

- **La tinta es por nivel, no por trazo.** El mockup muestra una sola barra
  INK; elegir el tipo por trazo añadiría un segundo verbo y rompería el
  «un dedo, un verbo». Cada nivel declara su tinta (madera 24, turbo 4,
  saltarina 1).
- **El scooter conduce solo.** Tras pulsar PLAY, el jugador mira. El juego
  es dibujar, no conducir — el mockup lo dice: «draw a bridge, the scooter
  drives over it».
- **El puente móvil es timing, no construcción.** La plataforma pasa por
  debajo de los extremos del puente; el jugador pulsa PLAY cuando se alinea.
  Periodo generoso (2,8–3,6 s) a propósito.
- **La entrega dual usa dos alturas, no dos caminos.** Cada moto tiene su
  propio carril (arriba/abajo) para que nunca haya que elegir ruta: el
  problema es dibujar dos puentes con una sola tinta, no adivinar.
- **El río es el game-over.** Caer al agua = «¡AL AGUA!». El fondo del
  mundo queda ABIERTO (sin muro inferior) para que la caída sea posible.
- **Sin interstitials en r1.** Solo el Extra Ink recompensado. La cadencia
  de interstitials es decisión de monetización de Daniel.

## 4. Desviaciones de la plantilla (anotadas)

- Sin botón CLEAR (UNDO + ERASER bastan; el mockup no lo muestra).
- Sin shake de cámara (el juice es de objetos).
- Sin `prefers-reduced-motion` por defecto (el interruptor de shake de
  ajustes lo cubre).
- La cámara usa zoom de ajuste (como la plantilla); GameScene no se
  reconstruye en resize (caso borde en escritorio).

## 5. Riesgos abiertos (para el harness)

1. **Escalón de 5 px en la meta** — el nº 1. Si la moto se atasca al subir
   del puente a la plataforma, los 30 niveles fallan.
2. **Subida real en madera** — la teoría dice 25°, la práctica puede bajar.
3. **Rebote del trampolín** — ápice y alcance teóricos (~130 px / ~200 px).
4. **Timing del puente móvil** — ¿el periodo es generoso o frustrante?
5. **El jinete pasa por delante del muro en L5/L17** (cosmético, ver
   `filtro-visual.md`).

## 6. Lo que queda (finisher)

- [ ] Build de test OK + build de producción + zip ≤ 5 MB + zip-smoke.
- [ ] Harness: UI 14/14, replay de los 30 niveles con la solución, sondas
  (viento, trampolín, móvil, dual, monedas), capturas para el filtro visual.
- [ ] GIF + Short filmados con el harness.
- [ ] Portadas verificadas contra capturas reales.
- [ ] PR con el pack completo + enlace jugable.
- [ ] 3 testers humanos + prueba de Daniel.

## 7. Juice (por evento)

| Evento | Respuesta |
|---|---|
| Trazar | Brillo naranja + sonido de dibujo |
| Terminar trazo | Pop |
| PLAY | Whoosh + polvo + pulso del botón |
| Moneda | Sonido + destello pequeño |
| Llegada a la meta (una moto) | Pop + destello mediano |
| Victoria | Sonido de victoria + confeti + estrellas una a una |
| Derrota | Sonido de fallo + fundido rápido a resultado |
| Tocar la pizza (menú) | Gira 360° + pop |
