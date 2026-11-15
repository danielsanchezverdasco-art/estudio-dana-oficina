# Doubloon Rush — Game Design Document (round 1)

| Campo | Valor |
|---|---|
| Título ES | Cofre del Doblón |
| Título EN (propuesto) | **Doubloon Rush** |
| Título EN alternativo (idea) | Gold Doubloon Chest Rush (descartado: 4 palabras, largo) |
| Slug | `cofre-del-doblon` |
| Género | Arcade de reflejos y suerte (toca cofres) |
| Motor | Phaser 3.90 + TypeScript + Vite |
| Plataforma | Playgama (YouTube Playables vía Playgama) |
| Orientación | Vertical 390×844 primero; horizontal adaptativo |
| Idioma | Inglés primero, español segundo (EN por defecto) |
| Clasificación | PEGI 3 (issue #6); audiencia YouTube Playables 13+ (regla de la plataforma) |
| Ronda | 1 (Anita, 15/11/2026) |

## 1. La frase

> **Tap the chests that pop out of the sand before they sink; dodge the bombs; chase the rare golden doubloon.**

Un solo gesto: tocar. Una sola pantalla. Se entiende en 3 segundos.

## 2. El bucle (45–60 s por ronda)

1. Los cofres asoman de los montículos de arena (parrilla 3×4).
2. El jugador toca el cofre antes de que se hunda → monedas + combo.
3. La bomba cuesta 1 vida y rompe el combo. El cangrejo roba cofres: tócalo para asustarlo (+5).
4. El doblón dorado aparece rara vez, con su probabilidad REAL visible en el HUD.
5. Al acabar el tiempo: estrellas (1–3) según la puntuación, mejor marca, desbloqueo del siguiente nivel.

## 3. Economía y valores

| Elemento | Puntos | Notas |
|---|---|---|
| Cofre de madera | 10 | El más frecuente (55 % de los cofres) |
| Cofre de plata | 25 | 30 % de los cofres |
| Cofre de oro | 50 | 15 %; se hunde más rápido |
| Bomba | −1 vida | Rompe el combo; nunca da puntos |
| Cangrejo (asustado) | 5 | Si llega a un cofre, lo roba (se pierde la oportunidad) |
| Doblón dorado | 500 | Raro; probabilidad real visible |
| Combo | +10 % por acierto seguido | Máximo ×3 (combo 20) |
| Suerte ×2 (recompensado) | ×2 monedas 30 s | Solo con anuncio recompensado opt-in |

**Probabilidad del doblón (real e implementada):** 1 entre 500 en el nivel 1, mejorando 12 por nivel hasta un mínimo de 1 entre 120. El contador del HUD muestra exactamente esa cifra. El doblón NUNCA es dinero real, ni apuestas, ni compras: solo puntos y skins de barco (meta futura). Sin IAP.

## 4. Dificultad

- Duración: 45 s (nivel 1) → 60 s (a partir del nivel 21, +5 s cada 5 niveles).
- Intervalo de aparición: 950 ms → 340 ms (mínimo).
- Tiempo en pie: 1500 ms → 750 ms; oro: 1050 ms → 550 ms.
- Bombas: 8 % → 22 %. Cangrejos: 5 % → 18 %.
- Máximo simultáneo: 2 → 5.
- Estrellas (nivel 1): 1★ 459 · 2★ 765 · 3★ 1122 (45 %, 75 %, 110 % de la puntuación esperada de una ronda buena).

## 5. Meta y progresión

- 30 niveles + mapa (pergamino, camino serpenteante, estrellas por nivel).
- Reto diario: misma dificultad que el nivel desbloqueado, doblón con el doble de probabilidad; racha de días consecutivos.
- Guardado versionado (`doubloon-rush-save-v1`) vía `bridge.storage`, con fallback a localStorage fuera de Playgama: nivel desbloqueado, mejores marcas, estrellas, monedas totales, doblones encontrados, racha diaria, sonido, tutorial visto.

## 6. Tutorial (nivel 1, primera vez)

1. La mano oficial señala el primer cofre: «Tap the chest!».
2. Cuando aparece la primera bomba: «Never tap a bomb!».
3. Cuando aparece el primer cangrejo: «Scare the crab!».
Después, el tutorial queda marcado como visto y no vuelve a aparecer.

## 7. Anuncios (reglas Playgama / YouTube Playables)

- Intersticial SOLO al completar un nivel par (2, 4, 6…), nunca en el nivel 1, nunca en un reintento, nunca a mitad de ronda.
- Recompensado SOLO opt-in: «Luck ×2 30 s» para la siguiente ronda, y «continuar tras la última bomba». La recompensa se concede SOLO cuando la plataforma informa el estado `rewarded`, nunca al cerrar el anuncio.
- Si los anuncios no están soportados, los botones no se muestran.
- Sin anuncios durante el juego. Sin redes externas de anuncios ni pagos.

## 8. Arte (premium primero, comparado con Metro Nightmare)

- Estilo: cartoon volumétrico pulido, luz cálida, colores saturados (referencia: portada de Metro Nightmare).
- Fondos: playa cenital (vertical + horizontal), escena de menú al atardecer (loro, barco, cofre dorado), mapa pergamino.
- Sprites: 3 cofres cerrados + 3 abiertos (madera/plata/oro), montículo de arena, bomba, cangrejo, doblón, pila de monedas, destello, pulpo mascota Dana (cameo en el menú).
- Tipografía: Lilita One (incluida en el juego, sin descargas externas).
- Audio: efectos sintetizados con WebAudio (sin archivos de audio); botón de silencio; vibración en aciertos y fallos.
- Mano oficial del kit (`mano-tutorial.png`) en el tutorial; sello Dana Games solo en las portadas de Playgama (nunca en la portada de YouTube).

## 9. Pantallas

Boot → Menú (título, PLAY, HOW TO, sonido, mascota) → Mapa (30 niveles + reto diario) → Juego (HUD: puntos, tiempo, vidas, combo, probabilidad del doblón, pausa, silencio) → Resultados (estrellas animadas, mejor marca, NEXT/RETRY/MENU, Luck ×2 opt-in).

## 10. Controles

- Tocar: un solo dedo. Botones principales ≥ 88 px; mínimo absoluto 48 px.
- Zonas táctiles en coordenadas locales, verificadas: centro + 4 esquinas (8 px dentro del borde) funcionan; un toque fuera no hace nada.
- Pausa: botón y eventos de la plataforma (pausa/visibilidad → pausa automática).

## 11. Datos reales (teardown)

Ver `teardown.md`: Fortnite Treasure Hunters (1/11–5/12/2026; token 1 entre 137.500 cofres según Epic, 7/11/2026); Whack a Mole - Pixel Version (Playgama 4,1/5, 104 valoraciones); Whack Strike (Playgama 4,5/5); «anuncios cada 2 s» = reseñas de 1 estrella (lección: nunca anuncios durante la partida); Fast Cash Farkle = anti-modelo (dinero real, prohibido en Playables). El juego funciona sin el gancho #piratetoken después del 5/12/2026.

## 12. Pendiente (fuera de esta ronda)

- Revisión cruzada de Niky (CONTROL-CALIDAD) + APROBADO firmado.
- Prueba de Daniel de la versión final + su APROBADO para Playgama/YouTube.
- Publicación en Playgama (sin acceso aún) y Short en YouTube (sin acceso aún).
- Limpieza de marca («Doubloon Rush») fuera de Playgama — sin datos aún.
- Skins de barco (meta de monedas) — diseño, no implementado.
