# Teardown — Ramp Physics: Ragdoll Crash Test r2

**Fecha:** 15/11/2026 · **Opción C — CÓMIC** (elegida por Daniel) ·
**Listón:** Metro Nightmare + los jugables top de YouTube.

## 1. Qué es el juego en una frase

Dibuja la rampa, lanza el muñeco, llega a la bandera con la tinta que tienes.
El verbo (dibujar) es el juego; la física hace el resto.

## 2. Referencias (lo que se copió y lo que no)

| Referencia | Qué se copia | Qué NO se copia |
|---|---|---|
| **Metro Nightmare** (mínimo de calidad) | Acabado premium: contorno grueso, color plano, personajes expresivos, HUD con peso, escenas densas. Nada de aspecto prototipo. | El tema (metro/gestión) y la densidad de personajes. Nuestro juego es un puzzle de física, no un gestor. |
| **Bridge Race** (71M visitas, YouTube Jugables) | El arte ES la mecánica: el puente que construyes se ve y se siente. Un momento de satisfacción por acción. | La recolección repetitiva sin decisión. Aquí cada trazo es una decisión. |
| **Cup Heroes** (6,7M) | Satisfacción inmediata y legible: ves el resultado de tu acción en menos de 1 s. | La simplicidad sin progresión. Aquí hay 30 niveles con curva real. |
| **Drawn puzzle games** (género) | Dibujar como verbo principal; tinta limitada como recurso. | Niveles que se resuelven con una recta. Ver tests anti-trivial. |

## 3. El loop (30 segundos)

1. **Miras** el nivel (3 s): spawn, bandera, peligros, monedas. Todo se lee
   sin texto — el color dice qué es qué (amarillo = tú, rojo = peligro,
   verde = meta, dorado = moneda).
2. **Dibujas** la rampa (5–10 s): eliges tinta (acero/elástica/impulso) y
   trazas. La tinta se gasta: cada milímetro es una decisión.
3. **Lanzas** (2 s): whoosh + polvo + shake. El muñeco rueda, rebota,
   se estrella. Espectáculo físico en cada intento.
4. **Ganas o aprendes** (2 s): bandera + confeti + slow-mo, o fundido a gris
   y «¡Inténtalo de nuevo!» en menos de 2 s. Sin pantallas de espera.
5. **Repites** para las 3 estrellas: el par te reta a dibujar menos.

El loop cabe en un Short de YouTube: dibujar → lanzar → victoria en 8–10 s.
Esa es la prueba del jugable.

## 4. Mecánicas que enganchan (comparadas con los top)

- **La tinta es el recurso y el marcador.** No hay vidas ni energía con
  temporizador: la tensión está en gastar menos que el par. Cada nivel es
  un problema de optimización, no un trámite.
- **Tres tintas, ninguna domina.** Acero (rápida), elástica (rebota 0.9),
  impulso (desliza en pendientes de 2–3° donde el acero se atasca). Cada
  tinta es la óptima en ≥1 nivel por bloque de 5 (verificado por cómputo;
  verificación por test pendiente — ver `informe-ronda2.md`). El
  jugador tiene que pensar qué tinta, no solo dónde dibujar.
- **Peligros que son herramientas.** El ventilador (L6) empuja hacia arriba,
  la dinamita (L12) lanza, el portal (L18) teletransporta. No son obstáculos
  que evitar: son parte de la solución. Eso es lo que hacen los top: el
  peligro se usa, no se esquiva.
- **Monedas fuera de la línea óptima.** Cogerlas cuesta tinta o riesgo. El
  jugador elige: 3 estrellas o monedas. Decisión real en cada nivel.
- **Cero lectura en 10 s.** Sin tutoriales de texto largos: L1 enseña con
  una mano, L6/L12/L18 enseñan su peligro con una pista de una línea en la
  primera visita. Un niño de 8 años entiende el juego sin leer.

## 5. Dificultad (plan vinculante, verificado)

- Par = solución óptima × 1,10 (múltiplos de 5); la óptima usa 85–100 % del
  par en los 30 niveles (verificado por cómputo).
- 3★ = tinta ≤ par; 2★ = ≤ par × 1,25; 1★ = llegar a la bandera.
- Curva por bloques de 5 con tasas de éxito objetivo decrecientes (80 % →
  10 % en primer intento, test competente); 3★ en primer intento ≤ 40 %.
- Anti-trivial (por diseño y cómputo; **verificación por test pendiente**):
  la rampa perezosa (una recta spawn→bandera) no gana ningún nivel del 6 en
  adelante; 0 px no gana ningún nivel; la solución óptima gana 30/30.
  Corrida 1 del harness: 7 de los 12 niveles probados ganan a 3★; la
  verificación completa llega con la re-corrida (ver `informe-ronda2.md`).

## 6. Lo que la r1 hacía mal y la r2 corrige

| r1 (descartada en lo visual/dificultad) | r2 |
|---|---|
| Visual pobre/pixelado, fondos vacíos | Opción C: contorno grueso, semitono, rayos, papel crema; todo a resolución real |
| Niveles muy fáciles (29/30 a 3★ en el primer intento de la solución) | Pares recalculados (óptima × 1,10), niveles nuevos de boost/elástico que exigen la tinta correcta, monedas fuera de la línea |
| Tintas sin identidad (casi todo se resolvía con acero) | Dominancia por bloque + prueba de intercambio a acero (por cómputo; test pendiente) |
| Sin momentos de satisfacción claros | Juice acotado: un momento por acción (ver biblia §6 / skills-usadas) |

## 7. Riesgos que quedan

- **La puerta humana final es Daniel.** Los tests verifican que los niveles
  se ganan y que los pares son justos; no verifican que el juego enganche.
  Daniel prueba la versión final antes de que nada se publique.
- **El arte procedural debe igualar al mockup.** La dirección está aprobada;
  la ejecución en Phaser (formas vectoriales) se verifica contra el mockup C
  lado a lado antes de la entrega.
- **Título EN pendiente:** «Ramp Physics» propuesto («Ragdoll Crash-Test»
  casi existe en Playgama). Short mudo o con música original, pendiente.
  Anuncios colocados pero sin servir en pruebas.
