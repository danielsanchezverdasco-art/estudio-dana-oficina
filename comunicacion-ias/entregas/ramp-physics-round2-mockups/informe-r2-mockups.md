# Informe — Ramp Physics r2, fase 1: mockups + plan de dificultad

**Juego:** Ramp Physics (slug `ramp-physics`). **Fase 1 (esta entrega):** mockups de la
mejora visual + plan de dificultad. **NO se ha reconstruido el juego** (sin cambios
de código, sin tocar `anita.md` ni `niky.md`).
**Fecha:** 2026-11-15. Autora: Anita (Dana Games).
**Rama:** `anita/ramp-physics-r2-mockups`. **PR:** (ver enlace al crear la PR).
**Origen:** veredicto de Daniel sobre la r1 (PR #14, 15/11 ~19:04): «el concepto está
genial, pero el visual es muy pobre, se ve feo como pixelado sin calidad, los niveles
son muy fáciles». Invita a mejorarlo «con las nuevas indicaciones de diseño de Niky»
(análisis de competencia, issue #22; 6 mockups de referencia, issue #24; aclaración
de estilo, issue #10).
**Skills aplicadas (solo lista de Grok + análisis de competencia):**
`art-direction-and-readability`, `directing-game-visuals`, `difficulty-and-balancing`,
`level-design`, `game-feel-and-juice`, `onboarding-and-teaching`, `playtest-report`.

## 1. Qué se entrega

En `comunicacion-ias/entregas/ramp-physics-round2-mockups/`:

| Archivo | Qué es |
|---|---|
| `mockup-a-blueprint-pulido.webp` (1152×2048, 577 KB) | Opción A: blueprint pulido, nivel 12 |
| `mockup-b-neon-volumetrico.webp` (1152×2048, 465 KB) | Opción B: neón volumétrico, nivel 12 |
| `mockup-c-comic.webp` (1152×2048, 862 KB) | Opción C: cómic, nivel 12 |
| `comparativa-metro-opcion-a.webp` (650 KB) | A lado a lado con Metro Nightmare |
| `comparativa-metro-opcion-b.webp` (487 KB) | B lado a lado con Metro Nightmare |
| `comparativa-metro-opcion-c.webp` (623 KB) | C lado a lado con Metro Nightmare |
| `plan-dificultad-r2.md` | Plan de dificultad r2 (pares, peligros, curva, verificación) |
| `informe-r2-mockups.md` | Este informe |

Las 3 opciones muestran la misma pantalla (nivel 12: muñeco en plataforma,
rampa dibujada, ventilador + dinamita, bandera, monedas, HUD con INK y LAUNCH!)
para que Daniel compare estilo, no contenido. Todas verificadas una a una a la
vista. Referencia Metro: `referencia-estilo-metro.png` (menú de Metro Nightmare).

## 2. Qué cambia respecto a la r1 (en las 3 opciones)

La r1 (captura `03-gameplay-level1.png`): plataformas planas gris-azuladas,
rejilla fina, muñeco pequeño, mucho espacio vacío, HUD plano. El veredicto de
Daniel es exacto: feo, pixelado, sin calidad. Lo que cambia en la r2:

- **Muñeco detallado y volumétrico** (casco, visor con reflejo, chaleco,
  articulaciones, botas), grande en pantalla, con historia: es un muñeco de
  pruebas, no un monigote. En la r1 el muñeco era un sprite pequeño y plano.
- **Fondo con profundidad y densidad** (la nota de la r2 del propio informe-ronda1:
  «densificar los bordes del fondo»): ya no hay zonas vacías. Cada opción llena
  el tablero con su propio mundo (planos técnicos, ciudad neón, viñeta cómic).
- **Luz, sombra y volumen reales** en plataformas, rampas y peligros: biseles,
  sombras proyectadas, brillos, reflejos. La r1 no tenía ninguna de las tres.
- **Legibilidad de juego en un vistazo** (`art-direction-and-readability`:
  legibilidad primero, personalidad después): un protagonista (el muñeco),
  un peligro (ventilador + dinamita), una recompensa (la bandera). Cada color
  tiene un rol de juego (`directing-game-visuals`): amarillo = protagonista,
  rojo/naranja = peligro, verde = meta, dorado = monedas.
- **Sin pixelado:** trazo nítido, bordes limpios, alta densidad de detalle.
  Las 3 opciones son imágenes acabadas, no bocetos.

## 3. Las 3 opciones

### Opción A — Blueprint pulido (evolución de la r1)
Mantiene la identidad blueprint de la r1 (#f1f5f9, papel técnico) y la lleva a
premium: fondo denso de planos técnicos (cotas, engranajes, secciones, esquemas
de rampas y ventiladores), rampa de acero con gradiente metálico, tornillos y
textura cepillada, plataformas azul pizarra con bisel y sombra, muñeco
volumétrico grande, ventilador metálico con estelas de movimiento, dinamita
roja brillante, bandera a cuadros con anillo verde. HUD completo (LEVEL 12,
INK 120, STEEL / BOUNCY / BOOST, LAUNCH!, UNDO / CLEAR).
**Por qué cumple el listón de 20.000 $:** es la r1 hecha como un juego de
verdad: la identidad se conserva (el jugador de la r1 la reconoce) pero cada
píxel tiene producción — luz volumétrica desde arriba a la izquierda, sombras
suaves, materiales (acero, goma, papel). Es la opción más segura: mejora sin
romper nada. **Nota honesta:** las anotaciones manuscritas del fondo son
garabatos diminutos en algún caso («NAW SPEED», «TLT: EXPLOSIVE -OF»);
legibles como escritura técnica de fondo, pero en la construcción real se
sustituyen por anotaciones limpias y correctas.

### Opción B — Neón volumétrico (ruptura premium)
Cámara de pruebas oscura (#0f172a) con haces de luz volumétricos y una ciudad
neón al fondo; rampas de neón cian y magenta con bloom; muñeco 3D brillante
con luz de contorno; ventilador con estelas luminosas; dinamita con chispas
naranjas; bandera con halo verde; monedas con partículas; suelo reflectante.
**Por qué cumple el listón de 20.000 $:** es el look que más se parece a los
top de YouTube Playables del análisis (arte que ES la mecánica: la rampa
brilla porque es el verbo del juego; un momento de satisfacción por acción:
el ventilador deja estelas, la dinamita chispea). El contraste alto hace el
juego legible en miniatura (portada, Short, feed). **Nota honesta:** en el
mockup no aparecen los botones UNDO / CLEAR (solo LAUNCH!); en la construcción
real se mantienen, como en la r1. El estilo neón es el más caro de producir
bien (luces y bloom en cada asset), pero también el más espectacular.

### Opción C — Cómic (carácter y humor)
Trazo grueso, color plano premium, puntos de semitono, líneas de velocidad,
muñeco expresivo con visor grande y líneas de movimiento, rampa dibujada a
mano con sombreado, ventilador gigante con remolinos, dinamita con mecha
chispeante, bandera con destellos, HUD grueso con contorno cómic.
**Por qué cumple el listón de 20.000 $:** tiene personaje y tono — el muñeco
parece un héroe de viñeta, no un asset genérico — y el estilo cómic es el que
Daniel ya aprobó para Scribble Striker (opción 4, 15/11 17:52), así que hay
precedente de su gusto. La rampa «dibujada a mano» es el verbo del juego
hecho estilo: dibujar se ve y se siente. **Nota honesta:** como en B, el
mockup no muestra UNDO / CLEAR; se mantienen en la construcción real. El
cómic exige disciplina de trazo (un trazo flojo se ve cutre al instante), pero
es el estilo más barato de mantener coherente en 30 niveles.

## 4. Comparativas con Metro

Las 3 comparativas ponen cada mockup junto al menú de Metro Nightmare, la
referencia de calidad. Lectura honesta:

- **Densidad:** las 3 opciones cierran el hueco de la r1 (fondo vacío). A y B
  igualan a Metro en densidad; C lo iguala en carácter.
- **Personaje con historia:** Metro tiene personajes con oficio (conductora,
  abuela, obrero). Las 3 opciones le dan al muñeco presencia y oficio de
  «muñeco de pruebas»; B es el más espectacular, C el más simpático, A el
  más técnico.
- **Volumen y luz:** Metro tiene suelo de madera cálido, sombras y profundidad.
  Las 3 opciones tienen volumen real; B es la más luminosa, A la más
  construida, C la más gráfica.
- **Nota:** en la comparativa A, el lado de Metro queda levemente recortado
  por abajo (el mockup ocupa todo el alto); el contenido clave (personajes,
  tren, suelo) se ve completo. En B y C, ambos lados se ven enteros.

## 5. Plan de dificultad (resumen; detalle en `plan-dificultad-r2.md`)

- **Pares ajustados:** par = solución óptima × 1,10; la solución óptima debe
  usar el 85–100 % del par (L8 de la r1, 173/180 = 96 %, es el modelo).
  3★ = tinta ≤ par; 2★ = ≤ par × 1,25; 1★ = llegar a la bandera.
- **Peligros antes:** ventilador desde el nivel 6 (r1: 11), dinamita desde el
  12 (r1: 21), portal desde el 18 (r1: 21).
- **Curva por bloques de 5** con tasas de éxito objetivo en primer intento
  (80 % → 10 % del bloque 1 al 6) y 3★ en primer intento ≤ 40 % del total.
- **Verificación anti-trivial:** test de la rampa perezosa (una recta no gana
  desde el nivel 6), test de par, test de dominancia de tinta (cada tinta es
  óptima en ≥ 1 nivel por bloque), test de 0 px, y playtest humano con 3
  testers antes de que Daniel pruebe nada.
- **Juice:** un momento de satisfacción por acción, acotado (banda media-alta):
  lanzar, rebotar, explotar y ganar, cada uno con su feedback; lo más grande
  solo para la victoria.

## 6. Preguntas para Daniel

1. **¿Qué opción elige: A (blueprint pulido), B (neón volumétrico) o C (cómic)?**
   Solo entonces se construye la r2, fiel a la elegida.
2. Título EN: «Ramp Physics» (propuesto en r1; «Ragdoll Crash-Test» casi
   existe en Playgama). Pendiente desde la r1.
3. Short: mudo (sin música) o con música original. Pendiente desde la r1.
4. Anuncios: colocados pero sin servir en pruebas; se verifican en Playgama.

## 7. Siguiente paso

Cuando Daniel elija una opción: reconstrucción completa de la r2 fiel a la
elegida (arte premium primero, con biblia de arte de la opción; niveles
re-diseñados según `plan-dificultad-r2.md`; prototipo desechable del verbo
antes del juego completo, según el proceso del análisis §7; playtest humano
como puerta antes de que Daniel pruebe la versión final). Después: juego 7
(Grid Defender), bloqueado hasta tener concepto + mockup aprobados por Daniel.
