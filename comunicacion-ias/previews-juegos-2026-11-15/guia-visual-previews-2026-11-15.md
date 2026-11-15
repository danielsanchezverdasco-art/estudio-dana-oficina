# Guía visual: previews de trabajo (guía visual para fabricar) — 6 juegos aprobados (15/11/2026)

**Para:** Daniel, Anita, Niky y quien fabrique cada juego.
**Fecha:** 15/11/2026. **Orden de Daniel:** 15/11 19:13 («Enséñame cómo verías tú cada juego de interno jugando») y 19:14 (previews EXACTAS, como las vería un player normal) y 19:15 (entregar las previews de todos los juegos pensados, por lotes).

> **REGLA 15/11 19:57 (orden de Daniel):** las previews de los juegos en la oficina tienen que ser LAS REALES solo cuando el juego esté COMPLETO, ya con sus portadas y todos sus datos en OK. Mientras tanto, estas 6 imágenes son **«preview de trabajo — guía visual para fabricar»**, no la preview del juego terminado. Ningún juego está completo hoy (Traffic Chaos en teardown + arte + prototipo en marcha; los otros 5 esperan su turno), así que **ninguna preview es aún «preview real»**.

## Estado por juego (15/11/2026)

| Juego | Preview | Portada | Juego completo | Preview real |
|---|---|---|---|---|
| Traffic Chaos: New York Rush | De trabajo | Lista | NO | Pendiente |
| Who Is the Robot? | De trabajo | Lista | NO | Pendiente |
| Kitchen Hole Muncher | De trabajo | Lista | NO | Pendiente |
| Draw Bridge Delivery | De trabajo | Lista | NO | Pendiente |
| Sushi Belt Frenzy | De trabajo | Lista | NO | Pendiente |
| Laundry Chaos Sort | De trabajo | Lista | NO | Pendiente |

## Regla de la guía

Cada preview de trabajo es LA GUÍA VISUAL de su juego: la vista real de la partida en marcha tal como la ve un jugador normal (HUD real, puntuación, controles, estado a mitad de juego, el dedo donde toca). **Durante todo el desarrollo, cada pantalla se compara con su preview de trabajo y no se sale de ella.** Las previews de trabajo se pueden cambiar solo cuando el juego lo demande y Daniel diga cuál cambiar. Cada preview de trabajo tiene que poder ponerse al lado del juego terminado y compararse: misma composición, mismos elementos, mismo HUD. Si una preview de trabajo no se parece a una captura real del juego, no vale.

## Revisión de skills (norma obligatoria de Daniel, 15/11 19:16)

Antes de hacer estas previews se revisaron las **147 skills del kit una por una** a través del informe `comunicacion-ias/informe-skills-calidad-2026-11-15.md` (PR #27: 66 de Grok + 81 nuevas, por pilares y con el núcleo de la plantilla en su §3). La selección por preview está abajo: qué skill, para qué parte, por qué esa y no otra.

**Skills usadas en las 6 previews (base común):**

| Skill | Para qué parte | Por qué esa y no otra |
|---|---|---|
| `directing-game-visuals` (ya) + `art-bible` (ya) | Dirección de arte de cada preview: una frase visual, paleta con roles de gameplay | Son las de dirección del núcleo de la plantilla (§3, fase 2); ninguna otra skill define la dirección |
| `game-ui-taste` (nueva) | Dirección de arte de UI: arquetipo de cada pantalla, color scripting, qué NO hacer | Es la única con 12 arquetipos de UI y banned defaults anti-slop; `game-ui-ux` (ya) da las reglas, esta da el gusto |
| `taste-skill` (nueva) | Finish gate: la preview se verifica a tamaño real (390 px) como captura, no como cartel | Es la única con checks en navegador real a 390 px; su hook `Stop` es de Claude Code y se ignora (gate manual) |
| `game-ui-ux-pro-max` (nueva) | HUD y controles: touch ≥48dp, FTUE, checklist pre-ship | Es la única con los 7 pilares de Hodent y el FTUE móvil <60 s; `game-ui-ux` (ya) complementa, no sustituye |
| `auditing-game-screen-readability` (ya) | Legibilidad: puntuación, temporizador, anillos y botones legibles en un still sin explicación | Es la skill de legibilidad de pantalla; ninguna otra audita legibilidad |
| `styling-web-game-typography` (ya) | Tipografía del HUD | Es la skill de tipografía de juego |
| `mobile-native` (nueva) | Que la preview se sienta nativa en el móvil: safe areas, tap, notch | Es la única de sensación nativa; `scale-and-responsive` es de motor, no de sensación |
| `emil-design-eng` (nueva) | Lenguaje de movimiento visible en la imagen (haz del escáner, remolino del agujero, chispas del puente) | Es la única con el «por qué se siente bien» (easing, springs, press states) |

**Skills revisadas y NO usadas para las previews (y por qué):**

| Skill | Por qué no |
|---|---|
| `blender-*` (9 skills) | Blender 5.2+ NO está instalado en este entorno (verificado en el informe); su conocimiento sirve para decidir, los scripts no corren aquí |
| `generate2dsprite` / `video2dsprite` / `generate2dmap` / `sprite-atlas` | Son producción de sprites y mapas desde un master still, no capturas de partida a pantalla completa |
| `platformer` / `puzzle` | Afinan números de juego (salto, solver); no pintan la imagen |
| `game-audio` / `audio-feel` / `audio-buses` / `audio-and-sound` | No hay audio en una imagen fija |
| `playables-sdk-integration` / `certification-checklist` | Son de plataforma y publicación, no de la imagen |
| `game-playtest-squad-skill` | BLOQUEADA por falta de licencia (§6 del informe); el playtest es de juego, no de preview |

## Las 6 previews de trabajo (lote 1 — juegos aprobados con mockup)

### 1. Traffic Chaos: New York Rush — `preview-traffic-chaos-ny.webp`
- **Género:** arcade cenital de gestión de tráfico. **Ranking:** nº 1, 31/35, FUERTE. Idea del propio Daniel.
- **Qué se ve:** intersección de Times Square de noche en diorama 2.5D; taxis amarillos, autobús MTA rojo, ambulancia FDNY; semáforos en verde; anillos de paciencia (60%, 63%); SCORE 1250, LEVEL RUSH HOUR 3, temporizador 00:28, botón BOOST 2x, PAUSE; cartel «TAP THE LIGHT!»; el dedo del jugador tocando un semáforo.
- **Qué guía:** composición cenital, paleta nocturna con neones, cada vehículo con su color propio y constante, los anillos de paciencia como parte del arte, HUD arriba y controles abajo.
- **Qué NO se puede cambiar:** Times Square de noche, amarillo taxi / rojo MTA / blanco FDNY, anillos de paciencia visibles sobre cada coche, BOOST abajo a la izquierda, PAUSE abajo a la derecha.

### 2. Who Is the Robot? — `preview-quien-es-el-robot.webp`
- **Género:** hidden object / puzzle de observación. **Ranking:** nº 4, 28/35, FUERTE.
- **Qué se ve:** andén de metro lleno de gente; el haz del escáner cruza la pantalla y revela al robot (antena y ojo brillante); 3 corazones, «FIND THE ROBOT!», temporizador 0:45, SCORE 1320, pausa, botón HINT; el dedo en HINT.
- **Qué guía:** el escáner como verbo visual, el robot escondido entre la multitud, HUD superior limpio, el destello como momento de satisfacción.
- **Qué NO se puede cambiar:** el andén lleno, el robot con antena y ojo brillante, el haz del escáner como acción principal, 3 corazones y temporizador arriba.
- **Nota honesta:** el texto del HINT queda parcialmente tapado por el dedo en esta preview; en el juego real el texto no debe quedar tapado por el dedo.

### 3. Kitchen Hole Muncher — `preview-agujero-tragon-cocina.webp`
- **Género:** arcade de comer y crecer. **Ranking:** nº 5, 28/35, FUERTE.
- **Qué se ve:** cocina cenital; un agujero negro enorme tragándose monedas, migas y croissants; temporizador 00:22, 128 COINS, +50, barra SIZE 12, LEVEL 3 · CLEANUP; la nevera azul con cara al fondo; el dedo arrastrando el agujero.
- **Qué guía:** el agujero como protagonista, el crecimiento visible en el mundo (barra SIZE), la escala cómica de migas a nevera, HUD con monedas y tamaño.
- **Qué NO se puede cambiar:** cocina cenital cálida, agujero negro con remolino violeta, la nevera como objetivo final visible, barra de SIZE abajo.
- **Nota honesta:** en la preview el agujero se lee en dos círculos (el grande y el pequeño bajo el dedo); en el juego tiene que leerse como UN solo agujero que el dedo arrastra.

### 4. Draw Bridge Delivery — `preview-draw-bridge-delivery.webp`
- **Género:** dibujar con física. **Ranking:** nº 6, 28/35, FUERTE.
- **Qué se ve:** repartidor en scooter con la pizza cruzando un puente de madera sobre el río; HUD con LEVEL 7, estrellas, barra INK, 250 monedas, UNDO y ERASER; el dedo dibujando el puente con chispas.
- **Qué guía:** el puente dibujado como línea del jugador, la tinta como recurso visible, el repartidor y la pizza como objetivo, el pueblo al otro lado.
- **Qué NO se puede cambiar:** el puente de madera dibujado por el dedo, la barra INK arriba, UNDO y ERASER, la pizza visible en todo momento.
- **Nota honesta:** esta preview trae un botón PLAY grande abajo, propio de pre-partida; la captura real a mitad de partida NO debe llevar PLAY. Daniel dirá si se cambia.

### 5. Sushi Belt Frenzy — `preview-sushi-belt-frenzy.webp`
- **Género:** puzzle de cinta / flow. **Ranking:** 25/35, DUDOSA con condición.
- **Qué se ve:** cinta de sushi con platos; gato chef en el centro; tres gatos esperando abajo (naranja comiendo, gris y blanco/negro); SCORE 840, LEVEL 4, COMBO x5, 3 corazones, +30; el dedo tocando un plato de salmón; PAUSE y BOOST.
- **Qué guía:** la cinta como protagonista, el gato que come como feedback (no un número), cada gato sobre un plato de su color, el combo como fuego.
- **Qué NO se puede cambiar:** la cinta curva con platos, los tres gatos con su color, el +30 al servir, el combo x5 visible.

### 6. Laundry Chaos Sort — `preview-laundry-chaos-sort.webp`
- **Género:** sort puzzle. **Ranking:** 26/35, DUDOSA con condición.
- **Qué se ve:** lavadora girando llena de calcetines de colores; cuatro cestos (rojo, azul, verde, amarillo); LEVEL 5, SCORE 1,120, temporizador 00:38, COMBO x3, 3 corazones, +50, cesto verde COMPLETED saliendo con espuma; una mano arrastrando un calcetín rojo con su rastro; «Drag socks to the matching basket!».
- **Qué guía:** la lavadora como personaje (el tambor que gira es el caos visible), cada calcetín a su cesto por color, el cesto completado que sale volando con espuma.
- **Qué NO se puede cambiar:** la lavadora al centro con el tambor visible, los cuatro cestos de colores con su calcetín, el COMPLETED con espuma.
- **Nota honesta:** la mano de esta preview es un guante de dibujos en vez de un dedo real como en las otras cinco; en el juego la interacción es con el dedo del jugador.

## Lote 2 (pendiente)

Las otras 6 ideas FUERTES (Apila la Pizza, Limonada Exprés, Cuchillo Saltarín, Carrito Loco del Súper, Peluquería Loca, El Gran Escape del Museo) aún no tienen mockup aprobado: sus previews de trabajo se hacen cuando tengan su mockup, con la misma norma (revisión de skills por juego + preview de trabajo de partida). No se fabrica ningún juego sin su preview de trabajo como guía.
