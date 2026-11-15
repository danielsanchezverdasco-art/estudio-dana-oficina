# Lista de ideas — 6 juegos con concepto y mockup · Dana Games

**Fecha:** 15/11/2026, ~19:00 (hora de Madrid). **Autor:** Niky (fábrica de conceptos y mockups).
**Encargo de Daniel (15/11 18:53):** «Dame una lista de ideas primero, género, jugabilidad, diseño con foto, todo».
**Origen:** análisis de la competencia en YouTube Jugables (`comunicacion-ias/analisis-competencia/analisis-competencia-youtube-playables-2026-11-15.md`, rama `niky/analisis-competencia-yt`) + ideas aptas de `ideas-acumuladas.json`.

## Cómo se usa esta lista

1. **Daniel elige** una o varias ideas (o ninguna). **NADA se fabrica sin que él apruebe antes el concepto y el mockup** (regla de proceso 15/11 17:51).
2. Cada mockup muestra la **pantalla de partida del diseño acabado** (vertical 390×844, arte final, HUD del juego). El **menú principal** de cada juego se describe en su ficha: escena animada e interactiva del mundo del juego (según `kit/brief-juego-comun.md`), no un título estático con botones.
3. Textos del juego en **inglés primero**, español segundo. Sin cifras inventadas: los datos de mercado citados llevan su fuente.
4. **Excluidas** las 5 ideas descartadas por Daniel el 15/11 (salva-el-bocata, gusano-gloton, estampida-en-las-rebajas, el-barista-del-caos, cofre-del-doblon): no aparecen en esta lista.
5. Los 3 conceptos nuevos llegaron al listón premium al desarrollarlos: **no hizo falta sustituir ninguno por Churrería Idle** (queda en reserva).

**Estilo de arte común (art bible de la lista):** arte de videojuego pulido estilo juguete 3D — personajes con volumen y expresiones, contornos gruesos, colores saturados, luz cálida, sombras suaves reales, texturas (madera, metal, tela, baldosas), sin dibujo plano ni clip-art. El arte **es** la mecánica: el estado del juego se lee en la escena, no en un texto. Un dedo, un verbo, a jugar en menos de 10 segundos. Sello Dana Games: la mascota (pulpo morado) como cameo escondido en cada juego.

---

## A) Los 3 conceptos del análisis de la competencia

Verificados visualmente uno a uno contra el original de la rama `niky/analisis-competencia-yt`. Resultado de la verificación al final de cada ficha.

### 1. Traffic Chaos: New York Rush — «el tráfico es tuyo»

**Género:** Arcade cenital de gestión de tráfico (Simulation + física de coches).

**Jugabilidad (paso a paso):**
1. Cruce de Times Square visto desde arriba, con taxis amarillos, autobús MTA, ambulancia FDNY y peatones.
2. **Tocas un semáforo** para ponerlo en verde o en rojo. Cada coche lleva un **anillo de paciencia (8 s)** que se vacía a la vista.
3. Si la paciencia se agota, **choque en cadena a cámara lenta** — el momento de juice del juego.
4. Swipe para acelerar un coche que va con prisa; botón **BOOST 2x** para rachas. Cada coche que cruza suma puntos; las ambulancias valen doble y no pueden esperar.
5. Niveles = horas del día (Rush Hour, Night Shift…); cada nivel añade un cruce y un tipo de vehículo nuevo. Meta: desbloquear barrios (Times Square → Brooklyn Bridge → Central Park) y vehículos coleccionables.

**Gancho en 10 s:** el primer semáforo en verde + el primer choque en cadena a cámara lenta.

**Diseño:** diorama 2.5D de juguete de Nueva York. El color identifica cada vehículo sin leer nada. Menú principal: la plaza de Times Square de noche con los taxis circulando, el logo rebotando y el botón PLAY latiendo sobre el asfalto; tocar un taxi hace sonar su bocina.

![Mockup Traffic Chaos: New York Rush](mockups/mockup-traffic-chaos-ny.webp)

**Mockup:** `mockups/mockup-traffic-chaos-ny.webp` — partida, LEVEL RUSH HOUR 3, SCORE 1250, anillos de paciencia 60 % / 45 %, «TAP THE LIGHT!», BOOST 2x, PAUSE.

**Por qué puede ser de primer nivel:**
- **Comparación:** Draw Crash Race (968 K plays en 7 días) + Crime and Vice City Police (la deformación es la recompensa). Traffic Chaos añade **decisiones** (¿a quién dejo pasar?) donde los otros solo tienen caos.
- **Evidencia de género:** Simulation, 1,4B plays (~24 % de Playables); física de coches, 365 K plays/día (Mediacube, estrenos 1/7–4/9/2026). Fuentes en el informe del análisis, §1 y §9.1.
- **3 puntos en los que supera al top:** (1) el anillo de paciencia convierte el tráfico en tensión visible sin HUD; (2) el choque en cadena a cámara lenta es un momento de juice por error, no solo por acierto; (3) la ciudad es el progreso (desbloquear barrios), no un número.

**Verificación del mockup:** el original (v1) traía **barra de estado del teléfono (reloj «3:42», señal, wifi, batería)** — artefacto falso, no del juego — y una banda beige vacía arriba. **Regenerado (v2): sin barra de estado, sin reloj, a sangre completa.** Verificado a la vista: diorama, vehículos, semáforos y HUD legibles; textos correctos. APTO.

### 2. Who Is the Robot? / ¿Quién es el Robot? — «escanea el andén y pilla al infiltrado»

**Género:** Hidden object / puzzle de observación con verbo propio (Brain & Puzzle).

**Jugabilidad (paso a paso):**
1. Andén de metro lleno de gente. Entre ellos se esconde **un robot** (antena diminuta, ojo brillante, articulación metálica).
2. **Deslizas el dedo para mover el haz del escáner** por la multitud; el robot se delata con un destello cuando el haz lo roza.
3. **Tocas al robot** antes de que escape: temporizador **0:45** y **3 corazones** (un toque a una persona te quita uno).
4. Cada robot pillado revela el siguiente con más gente, más disfraces y menos tiempo. Pistas integradas («Look for the tiny antenna & glowing eye!»), botón HINT.
5. Meta: colección de robots (cada andén es una ciudad distinta: Nueva York, Tokio, París), reto diario y clasificación.

**Gancho en 10 s:** el primer escaneo revela un robot.

**Diseño:** andén de metro con multitud con volumen — cada persona es un personaje, no un sprite repetido. El color y el detalle son la mecánica (patrón Camo Sniper 3D). Menú principal: el andén con la multitud murmurando y moviéndose, el robot asomando la antena entre dos viajeros y el escáner barriendo de fondo; tocar a un viajero lo hace girarse.

![Mockup Who Is the Robot?](mockups/mockup-quien-es-el-robot.webp)

**Mockup:** `mockups/mockup-quien-es-el-robot.webp` — partida, «FIND THE ROBOT!», 0:45, 3 corazones, haz de escáner sobre el robot de la sudadera gris, botón HINT.

**Por qué puede ser de primer nivel:**
- **Comparación:** Camo Sniper 3D (2,5 M plays; el color es la mecánica). ¿Quién es el Robot? añade **el escáner como verbo** (no solo mirar) + reveal con juice + pistas integradas.
- **Evidencia de género:** Brain & Puzzle, 1,3B plays (~22 % de Playables). Fuente en el informe del análisis, §1 y §9.2.
- **3 puntos en los que supera al top:** (1) un solo gesto (deslizar el haz) en vez de buscar a ojo; (2) el robot tiene historia (colección por ciudades); (3) el fallo cuesta un corazón pero la pista evita el atasco — tensión sin frustración.

**Verificación del mockup:** el original (v1) traía un **«3» suelto junto a los corazones** y **dos iconos de pausa cortados por la mitad en las esquinas inferiores**. **Regenerado (v2): 3 corazones sin numeral, sin elementos cortados.** Verificado a la vista: multitud, robot, haz y HUD legibles; textos correctos. APTO.

### 3. Kitchen Hole Muncher / Agujero Tragón en la Cocina — «de las migas a la nevera»

**Género:** Arcade de comer y crecer (hole.io-like) — comer el mapa con decisiones.

**Jugabilidad (paso a paso):**
1. Arrastras un **agujero negro** por una cocina vista desde arriba. Todo lo que cabe en el agujero, se lo traga.
2. Empiezas tragando **migas y croissants**; al crecer (barra **SIZE 12**) ya caben la silla, la taza… y al final **la nevera**.
3. Cada objeto vale monedas (la tragada suelta un **+50** con monedas volando); el tiempo aprieta (**00:22** por cocina).
4. Niveles = cocinas distintas con historia (la cocina de la abuela, la food truck, la pastelería). Obstáculos: la mascota de la casa que te roba monedas si te distraes.
5. Meta: colección de cocinas y de agujeros (agujero de chocolate, agujero imán…).

**Gancho en 10 s:** la primera tragada + el crecimiento visible del agujero.

**Diseño:** cocina cenital de juguete 3D — nevera azul con cara, mesa, sillas, plantas. El crecimiento del agujero **es** el progreso: se ve sin mirar el HUD. Menú principal: la cocina con el agujero tragándose un croissant en bucle, la nevera sonriendo y el botón PLAY como una tapa de cazuela; tocar la nevera la hace reír.

![Mockup Kitchen Hole Muncher](mockups/mockup-agujero-tragon-cocina.webp)

**Mockup:** `mockups/mockup-agujero-tragon-cocina.webp` — partida, LEVEL 3 CLEANUP, SIZE 12, 128 COINS, 00:22, +50.

**Por qué puede ser de primer nivel:**
- **Comparación:** Bridge Race (71 M plays: comer el mapa con decisiones) + Snake Clash! (107 M plays: crecer es el juego). Agujero Tragón añade **escala cómica** (de las migas a la nevera) y una cocina con historia por nivel.
- **Evidencia de género:** patrón comer-y-crecer con los dos tops citados (TubeGames, 14–15/11/2026). Fuente en el informe del análisis, §2 y §9.3.
- **3 puntos en los que supera al top:** (1) la escala cómica es el chiste visual de cada nivel; (2) el crecimiento se ve en el mundo (el agujero), no en un número; (3) cada cocina es un escenario con historia, no un mapa genérico.

**Verificación del mockup:** el original (v1) traía la palabra **«TIMER» duplicada** bajo el 00:22. **Regenerado (v2): «TIMER» una sola vez.** Verificado a la vista: agujero, monedas, nevera y HUD legibles; textos correctos. APTO.

---

## B) 3 conceptos nuevos con mockup

Desarrollados desde `ideas-acumuladas.json` (aptas, sin las 5 descartadas). Mockups generados nuevos y verificados uno a uno a la vista.

### 4. Sushi Belt Frenzy / Cinta de Sushi Glotona — «los gatos piden por colores»

**Género:** Puzzle de cinta / flow (puzle de flujo).

**Jugabilidad (paso a paso):**
1. Una cinta transportadora lleva platos de sushi por el restaurante. Abajo esperan **tres gatos glotones**, cada uno sobre un plato de un color (naranja, gris, blanco y negro).
2. **Tocas un plato** (o lo arrastras) para servirlo al gato de su color. El gato se lo come con un **+30**, chispas y un maullido de alegría; el combo sube (**COMBO x5**).
3. Servir el plato al gato equivocado o dejar que un plato dé la vuelta entera sin servir **rompe el combo y quita un corazón** (3 corazones).
4. La cinta acelera por niveles; aparecen platos trampa (wasabi picante: si lo sirve el gato equivocado, tose y pierde tiempo; plato dorado: vale triple). El chef gato del centro avisa con gestos de qué plato viene.
5. Meta: desbloquear gatos (gato ninja, gato samurái, gato chef) y restaurantes (Tokio, Osaka, mercado de pescado), reto diario.

**Gancho en 10 s:** el primer gato se come su sushi con el +30 y el combo encendiéndose.

**Diseño:** restaurante japonés cálido, cinta de madera, sushi con volumen y brillo, gatos con expresiones vivas. El color es la regla: plato y gato del mismo color, sin leer nada. Menú principal: el chef gato saludando detrás de la barra con la cinta girando y los tres gatos pidiendo con la boca abierta; tocar un gato lo hace ronronear.

![Mockup Sushi Belt Frenzy](mockups/mockup-sushi-belt-frenzy.webp)

**Mockup:** `mockups/mockup-sushi-belt-frenzy.webp` — partida, LEVEL 4, SCORE 840, COMBO x5, 3 corazones, mano que señala el plato de salmón, +30, PAUSE y BOOST.

**Por qué puede ser de primer nivel:**
- **Comparación:** Pixel Flow! (n.º 1 de los puzles hybridcasual, 31,3 M$; 6 de los 10 primeros son de tipo flow o cinta — fuente en `ideas-acumuladas.json`: AppMagic, Hybridcasual Puzzles Q3 2026). Sushi Belt Frenzy añade **personajes con hambre visible** (los gatos) donde el flow puro solo tiene piezas.
- **Evidencia de género:** los flow/cinta son lo que más factura en hybridcasual; ningún «flow» estaba en el top 50 de Playables — hueco abierto, no saturación.
- **3 puntos en los que supera al top:** (1) el gato que come es el feedback (no un número); (2) el color lo explica todo en un vistazo, sin tutorial; (3) el combo con fuego y el chef que avisa dan tensión y ternura a la vez — el juego se puede grabar en Short (el gato tosiendo wasabi).

**Verificación del mockup:** generado nuevo (v1), verificado a la vista: chef gato, cinta con sushi, tres gatos por colores, HUD completo y legible, sin barra de estado ni relojes falsos ni elementos cortados. APTO.

### 5. Draw Bridge Delivery / Dibuja el Puente del Repartidor — «dibuja, cruza, entrega»

**Género:** Dibujar con física (draw & physics puzzle).

**Jugabilidad (paso a paso):**
1. El repartidor espera en su scooter con la pizza. Delante, un hueco: el puente está roto sobre el río.
2. **Dibujas el puente con el dedo** (la línea brilla naranja mientras la trazas; la mano con el lápiz marca el punto). La tinta es limitada (**barra INK**): un puente recto gasta poco; uno con curvas, mucho.
3. Pulsas **PLAY**: la scooter arranca por tu puente (línea roja discontinua = recorrido). Si el puente aguanta, entrega la pizza y el cliente celebra; si se cae, la pizza vuela y toca reintentar en un toque.
4. Estrellas por tinta usada: 3 estrellas si gastas poca tinta, 2 si vas justo, 1 si lo logras a duras penas. Botones **UNDO** y **ERASER** para corregir sin empezar de cero.
5. Niveles con giros: viento, puentes móviles, dos repartidores a la vez, rampas y trampolines. Meta: desbloquear repartidores (bici, moto, dron) y ciudades.

**Gancho en 10 s:** dibujas tu primer puente y la scooter lo cruza con la pizza intacta.

**Diseño:** ciudad soleada con río, acantilados con textura de roca, casas de colores. **Tu dibujo es el protagonista** (patrón Draw Crash Race): el puente dibujado brilla y tiene grosor de madera real. Menú principal: el repartidor en su scooter junto al río, el puente a medio dibujar brillando y el botón PLAY verde latiendo; tocar la pizza la hace girar.

![Mockup Draw Bridge Delivery](mockups/mockup-draw-bridge-delivery.webp)

**Mockup:** `mockups/mockup-draw-bridge-delivery.webp` — partida, LEVEL 7, DRAW BRIDGE DELIVERY, 2 de 3 estrellas, INK, 250 monedas, UNDO, ERASER, puente dibujado con la scooter encima, PLAY.

**Por qué puede ser de primer nivel:**
- **Comparación:** Draw Bridge — Brain Game (27 M de partidas, top 3 de Playgama) + Draw Crash Race (968 K plays en 7 días). Draw Bridge Delivery añade **la entrega con historia** (la pizza tiene que llegar entera) y **la tinta como recurso** (decisión real: puente corto y arriesgado, o largo y seguro).
- **Evidencia de género:** dibujar y escapar es la mecánica n.º 1 en estrenos de Playables 2026 (Tricky Twist, 394 K plays/día — Mediacube). Fuentes en `ideas-acumuladas.json` y en el informe del análisis, §1.
- **3 puntos en los que supera al top:** (1) la tinta convierte cada trazo en una decisión con coste (sin estrategia dominante: ni el puente más corto ni el más largo gana siempre); (2) el fallo es gracioso (la pizza vuela) y el reintento es de un toque; (3) el momento para el Short está diseñado: el puente que se rompe en el último metro.

**Verificación del mockup:** generado nuevo (v1), verificado a la vista: repartidor con pizza, puente brillante dibujado, río, cliente saludando, HUD completo y legible, sin barra de estado ni relojes falsos ni elementos cortados. APTO.

### 6. Laundry Chaos Sort / Colada Caótica — «cada calcetín a su cesto»

**Género:** Puzzle de ordenar / sort puzzle.

**Jugabilidad (paso a paso):**
1. La lavadora gira llena de **calcetines de colores** mezclados. Abajo, **cuatro cestos** (rojo, azul, verde, amarillo), cada uno con su icono de calcetín.
2. **Arrastras cada calcetín a su cesto** (la mano con guante marca el arrastre con estela de puntos). Acierto: **+50**, brillos y el cesto rebota de alegría; el combo sube (**COMBO x3**).
3. Fallo (cesto equivocado): el calcetín vuelve volando a la lavadora y pierdes un corazón (3 corazones). Temporizador **00:38** por nivel.
4. Cuando completas un cesto, **sale volando de la lavadora con espuma** y se suma el bonus. Niveles con giros: calcetines rayados de dos colores (van al cesto del color que más tiene), calcetín perdido (aparece solo al final), lavadora que gira más rápido, espuma que tapa la vista unos segundos.
5. Meta: desbloquear lavanderías (la de la abuela, la del hotel, la espacial) y mascotas que ayudan (el gato dormido se despierta y señala un calcetín).

**Gancho en 10 s:** el primer calcetín entra en su cesto con el +50 y la espuma volando.

**Diseño:** lavandería luminosa con azulejos, lavadora con tambor visible lleno de calcetines, espuma y burbujas, cestos de mimbre con textura. El color y la forma (el icono del calcetín en cada cesto) hacen el juego legible también sin distinguir colores. Menú principal: la lavadora girando con calcetines dentro, los cuatro cestos en fila y el gato durmiendo sobre las toallas; tocar la lavadora suelta una burbuja.

![Mockup Laundry Chaos Sort](mockups/mockup-laundry-chaos-sort.webp)

**Mockup:** `mockups/mockup-laundry-chaos-sort.webp` — partida, LAUNDRY CHAOS SORT, LEVEL 5, SCORE 1,120, 00:38, 3 corazones, COMBO x3, HINT, calcetín rojo arrastrado al cesto rojo, +50, «Drag socks to the matching basket!».

**Por qué puede ser de primer nivel:**
- **Comparación:** Goods Puzzle: Sort Challenge (25 M de partidas en Playables) y Nuts Puzzle: Sort By Color (en tendencias de Playgama). Colada Caótica añade **la lavadora como personaje** (el tambor que gira es el caos visible) y **el cesto que sale volando** como recompensa física.
- **Evidencia de género:** los sort puzzle triplicaron ingresos frente a 2025 (AppMagic, Casual Report H1 2026 — fuente en `ideas-acumuladas.json`). El tema colada está poco visto frente a los clones de tornillos y tuercas.
- **3 puntos en los que supera al top:** (1) la lavadora girando da movimiento y caos al tablero, no es una parrilla estática; (2) la recompensa se ve en el mundo (el cesto vuela), no solo en puntos; (3) el calcetín de dos colores y la espuma que tapa la vista añaden decisiones reales a un género que suele ser mecánico.

**Verificación del mockup:** generado nuevo (v1), verificado a la vista: lavadora con calcetines, cuatro cestos por colores con su icono, arrastre con estela, HUD completo y legible, sin barra de estado ni relojes falsos ni elementos cortados. APTO.

---

## Resumen para elegir (una línea por juego)

| # | Juego | Género | Verbo (un dedo) | Gancho 10 s |
|---|---|---|---|---|
| 1 | Traffic Chaos: New York Rush | Gestión de tráfico | Tocar semáforos | Primer choque en cadena a cámara lenta |
| 2 | Who Is the Robot? | Hidden object | Deslizar el escáner | Primer robot revelado |
| 3 | Kitchen Hole Muncher | Comer y crecer | Arrastrar el agujero | Primera tragada + crecimiento |
| 4 | Sushi Belt Frenzy | Puzzle de cinta / flow | Tocar el plato | Primer gato comiendo (+30, combo) |
| 5 | Draw Bridge Delivery | Dibujar con física | Dibujar el puente | La scooter cruza tu puente |
| 6 | Laundry Chaos Sort | Sort puzzle | Arrastrar el calcetín | Primer cesto completado (+50) |

**Diversidad de género:** 6 géneros distintos, ninguno repite el de otro ni el de los 5 descartados. Todos verticales 390×844, un dedo, niveles cortos, reintento en un toque.

## Qué falta tras la elección de Daniel

Por juego elegido, en este orden (proceso del análisis, §7): teardown del género (3 tops) → **prototipo desechable** (`prototype-fast`: ¿es divertido el verbo?) → arte premium completo (art bible + personajes) → código con juice (Phaser oficial + GSAP + `game-audio`) → playtest humano → QA técnica → Daniel prueba la versión final → publicar (Playgama / YouTube Jugables, reparto 75/25).

## Skills usadas

- `art-bible` y `create-game-assets` (skills-arte): dirección de arte común, mockups como objetivo visual aprobado antes de fabricar, verificación visual de cada imagen.
- `art-direction-and-readability` y `directing-game-visuals` (skills-pro): legibilidad sin texto, color con rol de juego, protagonista/peligro/recompensa en un fotograma.
- `game-design-fundamentals` y `designing-mini-games` (skills-pro): un verbo por juego, decisiones con coste real, sin estrategia dominante, anti-monotonía (ni esperar ni machacar gana).
- `kit/teardowns-competencia.md` + informe `analisis-competencia-youtube-playables-2026-11-15.md` (§2, §3, §6, §9): base de los 3 primeros conceptos y de las comparaciones con el top.

## Archivos de esta entrega

- Este documento: `comunicacion-ias/lista-ideas-2026-11-15.md`
- Mockups (6, vertical 9:16, WebP): `comunicacion-ias/lista-ideas-2026-11-15/mockups/mockup-traffic-chaos-ny.webp`, `mockup-quien-es-el-robot.webp`, `mockup-agujero-tragon-cocina.webp`, `mockup-sushi-belt-frenzy.webp`, `mockup-draw-bridge-delivery.webp`, `mockup-laundry-chaos-sort.webp`
- Los 3 mockups del análisis se copiaron desde la rama `niky/analisis-competencia-yt` (`comunicacion-ias/analisis-competencia/media-generation-mockup-*.webp`) y se regeneraron los 3 en v2 por los artefactos anotados en cada ficha. Los v1 no se conservan en esta rama (siguen en la rama del análisis).
- Reserva no usada: Churrería Idle / Churro Tycoon (idea apta, gestión idle) — no hizo falta sustituir ningún concepto.
