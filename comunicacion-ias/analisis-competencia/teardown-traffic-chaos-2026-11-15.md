# Teardown: Traffic Chaos: New York Rush — qué significa GANAR al mejor del género tráfico

**Fecha:** 15/11/2026 (Europe/Madrid). **Autor:** Niky. **Rama:** `niky/teardown-traffic-chaos`.
**Paso:** 1 de 10 del proceso nuevo (teardown del género). **Juego:** Traffic Chaos: New York Rush, idea del propio Daniel, nº 1 del ranking (31/35), aprobada por Daniel el 15/11 19:08 con la condición «buena ejecución». Listón reafirmado 18:41: juegos que parezcan que valen 20.000 $ hacerlos. Orden de Daniel 19:10: «Tenemos las mejores skills de diseño, arte, programación de juegos, úsalas». Orden de Daniel 19:11: «Usa todo tu poder, todos tus agentes profesionales para ello; solo queremos lo mejor y ganar a los rivales con calidad visual, enganche visual; lo que quieren se lo damos».
**Estado:** solo análisis. No se fabrica nada en este paso. El mockup aprobado está en `mockup-traffic-chaos-ny.webp` (mismo fichero).

## Skills usadas en este teardown (orden de Daniel 19:10)

Cada parte del documento dice qué skill la hizo. Si una skill no se pudo aplicar, se dice por qué antes de seguir sin ella — no se finge su uso.

| Skill (carpeta `comunicacion-ias/kit/skills/`) | Qué parte hizo | Cómo se aplicó |
|---|---|---|
| `game-polish-audit` (`skills-competencia/`) | Estructura completa: pilares y core loop (§1), lentes de auditoría, hallazgos por tiers con etiquetas de confianza (§5) | Pilares inferidos del GDD y del mockup; cada hallazgo con evidencia (GDD/mockup/ficha pública) y etiqueta `[SEEN]` / `[INFERRED]` / `[PLAYTEST]` |
| `juice-audit` (`skills-competencia/`) | §3: auditoría de juice de los 5 momentos clave | Tabla de 4 pilares (input, visual, audio, animación) por momento; estado actual según diseño, hueco mayor, fixes rápidos |
| `game-quality-gates` (`skills-competencia/`) | §6: checklist de construcción del prototipo | Las 12 reglas universales traducidas a requisitos concretos de Traffic Chaos; lo que no aplica se marca |
| `review-game` (`skills-competencia/`) | §7: veredicto de madurez | **No aplicable aún: no existe código.** No se inventa puntuación. Sus 5 dimensiones se dejan como gates que el futuro build debe pasar |
| `probing-web-game-mechanics` (`skills-pro/`) | §8: plan de probes | **No aplicable aún: no hay build ni debug handle.** Se deja la lista exacta de probes (con valores esperados del GDD) para correr en el prototipo, no se simula su resultado |
| `playgama-metrics-snapshot` (`skills-pro/`) | §0–§2: todas las cifras | **Sin MCP de Playgama conectado en este entorno y sin juego publicado: no hay snapshot de telemetría.** Se aplica su método a las cifras públicas: cada número con unidad, periodo y fuente. Nada de cifras sin fuente |

**Registro en `niky.md`:** la tabla de skills por parte está también en `comunicacion-ias/niky.md` (entrega 15/11 19:1x).

## Método y límites

- Solo fuentes públicas: fichas oficiales de Playgama, ranking público de TubeGames (playables.games), AppBrain/AndroidRank (Google Play), artículo de Mediacube (08/09/2026, datos 01/07–04/09/2026), columna de Playgama (11/09/2026), y el informe interno `analisis-competencia-youtube-playables-2026-11-15.md` (rama `niky/analisis-competencia-yt`, PR #22) con su teardown previo de 11 juegos (`kit/teardowns-competencia.md`).
- **No se jugó ninguna partida en vivo** (sin navegador en vivo en esta pasada). Donde no hay fuente pública se marca **no observado**: duración exacta de nivel, cadencia real de anuncios, audio oído, fluidez medida, retención.
- **Investigación de demanda en paralelo (pendiente):** al cerrar este teardown no han llegado los hallazgos de la investigación de demanda que corre en paralelo. Este documento se afina cuando lleguen (ver §10). Nada de lo escrito aquí inventa demanda: lo que se afirma de «lo que consumen los usuarios» viene de plays/día y plays totales publicados, no de suposiciones.
- Nada de cifras inventadas. Todo número lleva unidad, periodo y fuente.

## 0. Qué significa GANAR en tráfico: el listón, definido antes de comparar

Ganar no es «ser mejor en general». Es ganar al mejor de cada dimensión en lo que el usuario de YouTube Jugables consume. El listón se fija con lo que los top ya demostraron, no con lo que nos gustaría.

### 0.1 El gancho visual del primer fotograma

El usuario decide en ~8 segundos si toca «Play» (Playgama, citado en el informe PR #22). Lo que funciona en los top:

- **El verbo se ve sin leer.** Arrow Puzzle: la portada ya enseña la regla (un dedo toca una flecha azul que sale). Coin Run: un objeto, una elección y dos colores (puerta verde +200 / roja −50). Draw Crash Race: dibujas el coche antes de correr; el dibujo es el protagonista. **Listón:** el primer fotograma de Traffic Chaos tiene que enseñar «toca el semáforo» sin una sola palabra, como el mockup intenta con «TAP THE LIGHT!» — pero el texto es un parche: si el fotograma necesita leer, ya vamos tarde.
- **La fantasía cabe en tres palabras.** Playgama de sus propios hits: «the pitch fits in three words». «El tráfico es tuyo» cabe. «Gestiona Times Square» también. «Toca semáforos, evita choques» no: son seis y no es fantasía.
- **Un objeto reconocible a dos metros.** Taxi amarillo, autobús MTA rojo, ambulancia FDNY blanca: en el mockup se reconocen sin leer. Ese es el activo visual que ningún competidor de puzle de tráfico tiene (sus coches son genéricos de colores).

### 0.2 El bucle de enganche (lo que hace volver en la misma sesión)

De los 11 juegos del informe PR #22 y de los 6 de tráfico de este teardown, el bucle que retiene es siempre el mismo esqueleto:

1. **Una decisión con coste cada 5–8 segundos.** Bridge Race: ¿cargo más y voy lento, o voy ligero? Traffic Chaos: ¿abro este semáforo y dejo esperando al otro lado? La paciencia de 8 s es el temporizador de esa decisión: convierte «esperar» en «apostar».
2. **Un momento de satisfacción grande y visible por acción.** Ragdoll al golpear (Epic Sword), cámara lenta al chocar (Crime), la pila que se cae (Bridge Race), el coche que sale disparado (Traffic Escape). En Traffic Chaos ese momento es el choque en cadena a cámara lenta — tiene que ser el mejor momento del juego, no un castigo gris.
3. **El progreso se ve en el mundo o en un número enorme, no en un texto.** Score 1250 en el mockup es un número; el atasco que se despeja (o que colapsa) es el mundo. El juego necesita los dos.
4. **Fallo rápido, reintento inmediato (<2 s).** Slope 3D: runs de segundos, reintento inmediato. Un nivel de 45–60 s que se pierde en el segundo 50 y obliga a 10 s de pantallas es un abandono.

### 0.3 El ritmo que consumen los usuarios de YouTube Jugables

- **Sesión corta, victoria pronto.** Niveles de 45–60 s (GDD) encajan; pero el primer nivel tiene que ganarse en <60 s y el primer choque tiene que verse en <10 s, o el usuario no llega al segundo nivel.
- **Onboarding ≤10 segundos, un dedo, cero lectura.** Mediacube 2026: «one-finger mechanic, ten-second onboarding». Lo que falla (tutorial >30 s, RPG/estrategia) es justo lo que Traffic Chaos NO debe copiar: nada de explicar los 6 vehículos con texto antes de jugar.
- **El género tiene demanda demostrada, en dos sabores.** (a) Física y choque de coches: 365K plays/día el mejor (Crazy Flying Car, Mediacube 01/07–04/09/2026); 3 títulos sumaron 13,6M plays en sus primeras semanas. (b) Puzle de tráfico por secuencias: Traffic Escape! ~44M instalaciones estimadas en Google Play (AndroidRank, 31/10/2026). Simulation es el 24 % de las plays de Playables (1,4B, TubeGames 15/11/2026). Traffic Chaos vive entre los dos sabores: gestión en tiempo real + choque espectacular. Esa es su apuesta — y su riesgo: si el choque no es espectacular, pierde contra el sabor (a); si la gestión no exige decidir, pierde contra el sabor (b).
- **Vertical 390×844, táctil y ratón, inglés primero.** Requisitos oficiales de certificación (informe PR #22 §1): todos los aspect ratios, <5 s a interactivo, bundle inicial <15 MiB (SHOULD) / <30 MiB (MUST).

## 1. Nuestro juego (lectura del GDD y del mockup)

### 1.1 Pilares y core loop (game-polish-audit, fase 2)

**Fantasía (una frase):** eres el controlador que tiene Times Square en la mano y decides quién pasa y quién espera, hasta que la ciudad colapsa o la dominas.

**Pilares (inferidos del GDD — `[INFERRED]`, a confirmar por Daniel):**
1. **El tráfico es tuyo:** un toque cambia el mundo (semáforo verde/rojo).
2. **La paciencia es el enemigo:** cada coche en rojo lleva un anillo de 8 s; esperar tiene coste visible.
3. **El error es espectáculo:** el choque en cadena a cámara lenta convierte el fallo en el mejor momento.
4. **Nueva York se reconoce:** Times Square, taxi amarillo, MTA, FDNY — la ciudad es el arte, no el fondo.

**Core loop (GDD §1):** observar trayectorias → alternar semáforos o swipe de despeje → priorizar emergencias y transporte público → evitar colisiones y gridlock durante 45–60 s → cumplir la cuota de vehículos evacuados → siguiente intersección.

**Verbos (GDD §2):** tap en semáforo (verde/rojo); swipe sobre coche detenido (acelerón); drag en rotonda (desvío, niveles intermedios); BOOST 2x (botón, mockup); pausa.

**Vehículos (GDD §2.2–3):** turismo (base), taxi (rápido, puntos extra sin detenerse), autobús EMT/MTA (lento, 2,5 casillas, frenado largo), ambulancia (prioridad absoluta, no se detiene en rojo, aviso 2 s antes, vale doble), patinete (errático, cruza sin mirar), camión de reparto (lento, si choca esparce obstáculos 10 s).

**Derrota (GDD §2.2):** paciencia agotada → el conductor ignora el semáforo y avanza (caos impredecible); colisión crítica → reacción en cadena; gridlock → la cola llega al borde de spawn y la partida termina. Margen mínimo de roces menores según dificultad.

### 1.2 Lo que el mockup aprobado muestra (verificado, `[SEEN]`)

Imagen `mockup-traffic-chaos-ny.webp`, vista cenital 2.5D toy-diorama de Times Square: 4 semáforos en las esquinas (2 en verde, 2 en rojo), taxis amarillos en los 4 sentidos, autobús MTA rojo cruzando, ambulancia FDNY blanca, anillos de paciencia con 60 % / 45 % / 60 % sobre coches, peatones y tiendas (TKTS, TIMES SQUARE, COFFEE, GIFTS, FOOD, HOTEL), HUD superior con SCORE 1250 y LEVEL RUSH HOUR 3, banda «TAP THE LIGHT!», botones BOOST 2x y PAUSE. **Lo que el mockup hace bien:** la ciudad se reconoce al instante; los vehículos se distinguen por color y forma sin leer; los anillos de paciencia son el estado del jugador sin mirar el HUD. **Lo que el mockup no resuelve:** «TAP THE LIGHT!» es texto (el verbo debería entenderse sin él); no se ve el choque en cadena (el momento clave no está en la imagen); el BOOST 2x no se entiende qué hace (¿doble puntos? ¿doble velocidad?) sin leer; SCORE 1250 no dice qué se ha hecho para ganarlo.

### 1.3 Niveles (GDD §4, escenario Madrid → Nueva York por orden de Daniel 11:52)

Capítulo 1 cruce 4 sentidos (niveles 1–5) → glorieta (6–10) → gran glorieta con fuente (11–15) → nudo multinivel con túnel (16–20) → caos climático y eventos (21+). Cada capítulo introduce una mecánica espacial nueva. **Nota:** el GDD es de Madrid; el cambio a Nueva York es solo de escenario y vehículos (taxi amarillo, MTA, FDNY), no de mecánicas — la estructura de niveles se mantiene.

## 2. Teardown: 6 juegos del género tráfico/coches

Se eligen por ser lo más cercano a Traffic Chaos en verbo, en plays o en el momento de choque — no por parecerse en el nombre. Tres son de tráfico directo, tres son el listón del choque y la física. Donde no hay fuente, **no observado**.

### 2.1 Traffic Escape! — el rey del puzle de tráfico por secuencias

- **Ficha:** FOMO GAMES. Google Play: 10M+ instalaciones; **~44M instalaciones estimadas (AndroidRank, 31/10/2026)**; v5.5.7 actualizada 10/09/2026 (sigue en activo); categoría Puzzle; 4+ años. En YouTube Playables: **no consta** (búsqueda 15/11/2026 sin resultados en playables.games) — su escala es móvil, no Playables.
- **Verbo único:** toca los coches en el orden correcto para vaciar el cruce. Cada coche lleva una flecha en el techo con su ruta (recto, giro, U-turn); tocarlo lo envía por esa ruta.
- **Bucle:** leer todas las flechas → planear el orden → tocar un coche seguro → cobra 1 moneda por coche → si dos chocan, vuelven a su sitio; si atropellas a un peatón, pierdes el nivel. Desde el nivel 11 hay límite de movimientos; hay estrellas por rapidez y pocos movimientos, pistas (el coche recomendado brilla), helicóptero para quitar un vehículo, y modo Level Race contra 4 jugadores.
- **Gancho 10 s:** el primer coche sale disparado al tocarlo y la calle se vacía delante de tus ojos. Cero lectura: las flechas del techo son la regla.
- **Arte:** 3D cenital limpio, coches de colores saturados sobre asfalto gris; el estado del juego es el tablero (qué coches quedan), no el HUD.
- **Juice:** el coche que sale con acelerón y la calle que se vacía es el momento; el choque que devuelve los coches a su sitio es el castigo visible. Sonido: **no observado**.
- **Onboarding:** la primera pantalla ya es el juego; el tutorial es tocar un coche. Un dedo.
- **Monetización:** free con anuncios y compras (pistas, quitar anuncios — según ficha de tienda). Cadencia dentro del juego: **no observada**.
- **Rejugabilidad:** 45 niveles en la versión web; niveles con límite de movimientos y estrellas; el modo Race añade competición. **Debilidad documentada por jugadores:** los niveles se repiten («all the stages are the same and keep on repeating», reseña Google Play, nivel 320).
- **Qué copiar:** la flecha en el techo como regla sin texto; el castigo que se ve (los coches vuelven); la pista integrada que brilla. **Qué NO copiar:** es por turnos y sin presión de tiempo real — no hay tensión de 8 segundos ni gestión simultánea; su rejugabilidad se agota por repetición de niveles.

### 2.2 Traffic Jam 3D — el nombre es dos juegos distintos (aviso)

El nombre «Traffic Jam 3D» designa **dos juegos diferentes** según la fuente; no se fusionan.

**2.2a Traffic Jam 3D (Playgama, puzle Rush Hour).** Ficha de Playgama (categoría Unblock Puzzles): «The modern Rush Hour — free the trapped car by shuffling the gridlock around it». Deslizar coches en una parrilla para liberar un coche atrapado. Es el mismo género que Traffic Escape! pero por deslizamiento en vez de por toque. Datos de plays/valoración en Playgama: **no observados** (la ficha de colección lo cita entre los más populares sin cifras públicas en la página consultada 15/11/2026).

**2.2b Traffic Jam 3D (Y8 / conducción en autopista).** Conducción en primera persona por autopista: Career con 80 niveles, Infinite (carretera sin fin), Time Against (máxima distancia en 100 s), Free Mode. Controles: flechas izquierda/derecha, acelerar. **No es gestión de tráfico**: es esquivar coches conduciendo. Su lección para nosotros es solo de ritmo: el modo Time Against (100 s) es el formato corto que Playables consume, y el Infinite es el «una run más» sin fricción.

### 2.3 Traffic Jam Escape 3D (Playgama) — tocar para mover, con boosters

- **Ficha:** Playgama, colección Traffic Games (180+ juegos de tráfico en el portal, página consultada 15/11/2026).
- **Verbo:** tocas coches para moverlos fuera del atasco, recoges gemas y usas boosters (cohetes, helicóptero) para pasar niveles difíciles.
- **Bucle:** puzle por niveles + moneda (gemas) + boosters consumibles. Es Traffic Escape! con economía de boosters encima.
- **Gancho 10 s:** el primer coche que se mueve desbloquea el atasco. **Arte/juice/onboarding/monetización dentro del juego:** **no observados** (ficha de colección, sin partida en vivo).
- **Qué copiar:** los boosters como válvula de frustración (el helicóptero que quita un coche es la misma idea que la pista de Traffic Escape!). **Qué NO copiar:** otro puzle por turnos sin tiempo real; Traffic Chaos no necesita copiar su economía de gemas para ser mejor — necesita que su BOOST 2x tenga un significado visible (hoy, en el mockup, no lo tiene).

### 2.4 Draw Crash Race — el listón de «tu creación es el juego» (informe PR #22 §2)

- **Ficha:** Playgama. Estudio: Andrey Melnikov. **2,5M plays en Playables; 968K en 7 días** (columna Playgama 11/09/2026); nº 13 del Top 20 Car Games de Playgama (octubre 2026) y nº 12 del Top 20 Driving (noviembre 2026); valoración 4,5/405 en ficha Playgama.
- **Verbo único:** dibujas tu coche a mano, conectas las ruedas a la cabina del piloto y corres contra 5 bots en un circuito en el cielo.
- **Bucle:** dibujar → correr (la forma y la solidez del dibujo deciden si sobrevive a los obstáculos y aterrizajes) → ganar monedas por terminar y por eliminar rivales → mejorar 3 stats legibles (durabilidad, velocidad, tinta).
- **Gancho 10 s:** dibujas antes de correr; tu dibujo es el protagonista desde el segundo cero.
- **Arte:** 3D limpio; el coche dibujado por el jugador es el arte. **Juice:** la física es el feedback — el coche se rompe, se cae, choca; los boosters verdes dan velocidad, las trampas lo destrozan. Sonido: la ficha lo menciona como «balanced against the dynamic level progression» — **no oído**.
- **Onboarding:** dibujar con el ratón/dedo; cero texto de reglas (el dibujo es la regla). Controles de conducción: W/A/D o flechas en escritorio; táctil en móvil.
- **Monetización:** monedas del juego → mejoras; anuncios: **no observados** en partida.
- **Rejugabilidad:** cada carrera es un dibujo distinto; las mejoras dan motivo para repetir. **Debilidad:** los rivales son bots; el dibujo se rompe si es frágil (eso es también su gracia).
- **Qué copiar:** que el jugador cree algo antes de jugar (su coche, su decisión); 3 mejoras legibles, no 10; la física como feedback, no como decoración. **Qué NO copiar:** no es tráfico ni gestión — su lección es de ejecución, no de género. Traffic Chaos no puede copiar «dibuja tu coche», pero sí puede copiar «tu primera acción crea algo que se ve» (el primer semáforo en verde tiene que sentirse como crear el flujo, no como pulsar un botón).

### 2.5 Crazy Flying Car + Car Crash Sandbox + Crime and Vice City Police — el clúster del choque

El sabor del género que más escala en Playables en 2026 es el choque con física, no el puzle. Son el listón del «momento espectacular».

- **Crazy Flying Car:** **365K plays/día** (Mediacube, estrenos 01/07–04/09/2026, el nº 1 de su categoría); **11M plays all-time, nº 15 de Playgama en Playables** (TubeGames 15/11/2026). Un coche con alas vuela sobre el abismo y adelanta rivales. Verbo: volar/chocar. Gancho: el primer vuelo imposible.
- **Car Crash Sandbox:** **236K plays/día** (Mediacube); **7,1M plays all-time** (TubeGames 15/11/2026). Crash Engine: Car Destruction Sandbox 6,4M; Car Crash Physics 3D 4,4M. Los tres juntos con Crazy Flying Car y Racing Limits sumaron **13,6M plays en sus primeras semanas**.
- **Crime and Vice City Police (KreizLand):** **4,9M plays; 2M en 7 días** (columna Playgama 11/09/2026); 4,7/1.566 en ficha. Verbo: chocar y verlo en cámara lenta. La deformación del coche ES la recompensa; tuning, coches y multijugador como meta. Gancho: apareces conduciendo y el primer choque ya es espectáculo.
- **Qué copiar:** el choque como recompensa, no como castigo; la cámara lenta como momento diseñado; la deformación/el destrozo como feedback visible. **Qué NO copiar:** son sandboxes sin decisiones de gestión — su retención viene del caos libre, no de una curva. Traffic Chaos no puede competir en «caos libre» con un sandbox; su ventaja tiene que ser que el choque es **consecuencia de tus decisiones** (tú dejaste el semáforo en rojo 8 segundos), no un accidente aleatorio.

### 2.6 MR RACER / Traffic Racer — el contexto del tráfico como obstáculo

- **MR RACER – Car Racing:** **12M plays, nº 14 de Playgama en Playables** (TubeGames 15/11/2026). Traffic Racer es citado por Playgama entre los juegos de tráfico con más plays junto a Traffic Jam 3D.
- **Verbo:** esquivar tráfico a velocidad. El tráfico es el obstáculo, no el sistema que gestionas. **Qué copiar:** nada de mecánica; solo el recordatorio de que «tráfico» como fondo ya lo hacen 12M de plays — Traffic Chaos tiene que ser tráfico como **sistema**, o no se diferencia.

## 3. Juice-audit: los 5 momentos clave de Traffic Chaos (skill `juice-audit`)

Cada momento se audita con los 4 pilares. Estado actual según el diseño (GDD + mockup): `[INFERRED]` — no hay build que jugar. «Current Feel» es el feel que el diseño promete, no el medido.

### 3.1 Tap en el semáforo (el verbo, ~cada 3–5 s)

**Current Feel:** Adequate (en papel). **Biggest Gap:** el cambio verde/rojo no tiene un momento propio; es un interruptor.

| Pilar | Estado | Notas |
|---|---|---|
| Input Response | Good (diseño) | Toque directo sobre el semáforo; cambio instantáneo según GDD. Falta: el semáforo tiene que «sentirse» grande al tocar (hitbox generosa, 44 px mínimo) — el bug táctil de Estampida/Barista (botones que solo responden en una esquina) no puede repetirse aquí |
| Visual Feedback | Weak | GDD: haz de luz sobre la línea de detención. Bien, pero es estático. Falta: pulso al cambiar, el haz que barre, el coche que arranca con un tirón visible |
| Audio Feedback | Missing | GDD prevé «clic mecánico». Falta: sonido distinto para verde (apertura) y rojo (cierre), y que el clic se oiga por encima del rumor de ciudad |
| Animation Polish | Weak | Falta: el semáforo que «cae» a verde con un pequeño squash, la luz que se enciende con easing, no un cambio de color instantáneo |

**Quick fixes:** 1) animación de 120 ms al cambiar (luz que se enciende + pulso del haz); 2) sonido verde ≠ sonido rojo; 3) hitbox del semáforo ≥ 1,5× su sprite.

### 3.2 Swipe de despeje / BOOST 2x (el acelerón)

**Current Feel:** Weak. **Biggest Gap:** el BOOST 2x del mockup no se entiende (¿doble puntos? ¿doble velocidad? ¿2x qué?) y el swipe no tiene feedback de «toque de claxon».

| Pilar | Estado | Notas |
|---|---|---|
| Input Response | Weak | Swipe sobre coche detenido (GDD) + botón BOOST. Dos gestos distintos para «acelerar» confunden: hay que decidir si el BOOST es el swipe con botón, o dos cosas |
| Visual Feedback | Weak | Falta: estela de velocidad, el coche que se inclina al arrancar, el «2x» flotando sobre el coche afectado, no solo en el botón |
| Audio Feedback | Missing | Falta: bocinazo cómico + subida de revoluciones al acelerar |
| Animation Polish | Weak | Falta: el coche que «salta» hacia adelante con un tween de 200 ms y rebote al frenar |

**Quick fixes:** 1) unificar: BOOST 2x = el botón que duplica puntos durante 10 s, swipe = acelerón físico; enseñar la diferencia en el primer uso con un ejemplo, no con texto; 2) «2x» flotante sobre cada coche que puntúa doble mientras dura.

### 3.3 Anillo de paciencia 8 s (la tensión)

**Current Feel:** Good (en papel). **Biggest Gap:** el anillo es el mejor invento del diseño y hoy solo existe en el mockup; si en el juego es un círculo pequeño, se pierde.

| Pilar | Estado | Notas |
|---|---|---|
| Input Response | Good (diseño) | El anillo es información, no input: el jugador decide mirándolo. Correcto |
| Visual Feedback | Good (mockup) | Anillo con % visible sobre el coche (60 % / 45 % en el mockup). Falta: cambio de color amarillo → rojo parpadeante + el coche que «vibra» de impaciencia en los últimos 2 s |
| Audio Feedback | Weak | GDD prevé bocinazos impacientes. Falta: que el bocinazo suba de frecuencia al acercarse a 0, y que sea direccional (se oye más el coche más impaciente) |
| Animation Polish | Weak | Falta: el conductor que saca la cabeza / el coche que se mueve hacia adelante 2 px como «casi arranco» |

**Quick fixes:** 1) últimos 2 s: parpadeo + vibración + bocinazo acelerado; 2) a 0 s el coche arranca solo con un gesto visible (no desaparece sin más).

### 3.4 Choque en cadena a cámara lenta (EL momento)

**Current Feel:** Good (en papel) — es el momento que vende el juego. **Biggest Gap:** es también el momento con más riesgo: si la cámara lenta es solo «todo va lento», es aburrida; si dura demasiado, es un castigo.

| Pilar | Estado | Notas |
|---|---|---|
| Input Response | Good (diseño) | No hay input durante la cámara lenta: correcto, es espectáculo, no castigo interactivo |
| Visual Feedback | Good (diseño) | Coches despedidos, piezas volando, bocinazos exagerados (GDD). Falta definir: duración (objetivo 1,5–2,5 s), zoom de cámara al punto de impacto, piezas con física que rebotan |
| Audio Feedback | Weak | Falta: el «crunch» de chapa + muelle cómico + silencio de 200 ms antes del golpe (anticipación) |
| Animation Polish | Weak | Falta: hitstop de ~80 ms en el impacto, shake de cámara con caída, los coches que rebotan con easing elástico y quedan en poses cómicas |

**Quick fixes:** 1) hitstop + zoom + shake en el primer impacto, cámara lenta solo en la cadena (no en todo el nivel); 2) contador de «CHAIN x3» grande en pantalla (el número es la recompensa); 3) botón REINTENTAR visible antes de que acabe la cámara lenta (reintento <2 s).

### 3.5 Ambulancia FDNY (vale doble, prioridad absoluta)

**Current Feel:** Adequate. **Biggest Gap:** si la ambulancia solo «vale doble», es un número; tiene que ser un evento.

| Pilar | Estado | Notas |
|---|---|---|
| Input Response | Good (diseño) | Aviso 2 s antes en el borde del carril (GDD). Falta: que el aviso sea imposible de pasar por alto (icono pulsante + carril que se ilumina) |
| Visual Feedback | Good (mockup) | Ambulancia blanca con luces, reconocible. Falta: estela de luces, el carril despejado que brilla, «+2x» flotante al pasar |
| Audio Feedback | Weak | GDD prevé sirena bitonal que varía al acercarse. Falta: que la sirena sea el sonido más alto del juego durante 3 s |
| Animation Polish | Weak | Falta: los coches que se apartan con un pequeño desvío al paso de la ambulancia |

**Quick fixes:** 1) sirena + carril iluminado 2 s antes; 2) «AMBULANCE +2x» flotante y grande; 3) los coches apartándose: el mundo reacciona, no solo puntúa.

## 4. Comparación lado a lado y VEREDICTO por dimensión

Regla de este teardown (orden de Daniel 19:11): **si nuestro concepto no gana al mejor en una dimensión, se dice y no se entrega como ganado.** «Gana» significa: el diseño, tal como está en el GDD + mockup, supera lo que el mejor del género ya demuestra. «No verificable» significa: solo el prototipo + playtest humano lo decide. El concepto en papel no es el juego; un «gana en papel» es una hipótesis, no una victoria.

| Dimensión | Mejor del género (referencia) | Nuestro concepto (GDD + mockup) | Veredicto |
|---|---|---|---|
| **Arte / calidad visual** | Draw Crash Race: tu dibujo es el coche; Crime: la deformación es la recompensa; Traffic Escape!: 3D limpio y legible | Diorama 2.5D Times Square con vehículos por color/forma reconocibles sin leer; peatones y tiendas con historia. El arte es la ciudad | **EMPATA en papel, NO GANA todavía.** El mockup es bonito pero es una imagen generada, no arte dirigido con art bible. Draw Crash Race gana porque el jugador crea el arte. Para ganar: arte dirigido (personajes con historia, cada vehículo con volumen y personalidad) antes de programar. Sin eso, pierde |
| **Primer fotograma / gancho visual** | Arrow Puzzle: la portada enseña la regla; Coin Run: un objeto, una elección, dos colores | Mockup: ciudad reconocible + «TAP THE LIGHT!» + anillos de paciencia. El verbo se intuye, pero depende de leer el texto | **PIERDE hoy.** El mejor no necesita texto; nosotros sí. Para ganar: primer fotograma sin palabras — el semáforo que cambia solo en la demo, un coche que arranca al tocarlo, el anillo que se vacía delante de tus ojos. El texto «TAP THE LIGHT!» debe sobrar |
| **Feel / juice** | Crime: cámara lenta + deformación; Epic Sword: ragdoll al golpear; Crazy Flying Car: física que se rompe | Choque en cadena a cámara lenta + hitstop + piezas volando (diseñado, no construido). Juice-audit §3: 3 de 5 momentos con audio «Missing» y animación «Weak» | **PIERDE hoy.** El mejor tiene el momento construido y probado; nosotros lo tenemos escrito. Para ganar: el choque en cadena tiene que ser el mejor momento de choque del género tráfico (hitstop, zoom, CHAIN xN, reintento <2 s). Si el choque es «coches que se paran», pierde contra Crime y contra Crazy Flying Car |
| **Gancho en 10 s** | Traffic Escape!: el primer coche sale al tocarlo; Slope 3D: la bola ya rueda; Crazy Flying Car: el primer vuelo imposible | Primer semáforo en verde + primer coche que arranca + primer anillo que baja. En papel, el gancho existe | **EMPATA en papel.** El gancho está diseñado pero no probado: ¿el usuario toca el semáforo en los primeros 3 s sin leer? Solo el prototipo + playtest lo responde (`[PLAYTEST]`). Si el primer nivel empieza con 4 coches esperando y nada que tocar, pierde |
| **Decisiones (profundidad)** | Traffic Escape!: orden de salida con flechas (puzle); Bridge Race: codicia contra velocidad (del informe PR #22) | Paciencia de 8 s + priorizar ambulancia/bus + gridlock + desvío en rotonda. Una decisión con coste cada 5–8 s, en tiempo real, no por turnos | **GANA en papel.** Es la única dimensión donde el concepto supera al mejor: ningún competidor de tráfico combina tiempo real + paciencia visible + priorización de emergencias. Traffic Escape! decide sin presión de tiempo; Crime no decide nada. Esta es la ventaja a proteger — pero es «en papel»: si la paciencia de 8 s no se siente (anillo pequeño, bocina inaudible), la ventaja se evapora |
| **Rejugabilidad** | Draw Crash Race: cada carrera es un dibujo + 3 mejoras; Traffic Escape!: estrellas + modo Race; Coin Run: negocios que mejorar | 5 capítulos con mecánicas espaciales nuevas + cuota por nivel + BOOST. Sin meta visible (¿qué se construye con lo ganado?) y sin diario/leaderboard definidos | **PIERDE hoy.** El mejor tiene meta que se ve (mejoras, negocios, récord). Nosotros tenemos niveles, no meta. Para ganar: definir qué se gana con el score (desbloquear intersecciones con nombre real, mejoras legibles en 3 stats como Draw Crash Race, o reto diario). Sin meta, es un arcade que se agota como Traffic Escape! en el nivel 320 |
| **Onboarding (10 s, un dedo, cero lectura)** | Todos los top: la primera pantalla ya es el juego | Un verbo (tap) + swipe + drag en rotonda + BOOST. El tap es inmediato; el drag de desvío es un segundo verbo que solo aparece en niveles intermedios (bien) | **EMPATA en papel.** El tap pasa el listón; el riesgo es el BOOST 2x (¿qué hace?) y el drag (¿se descubre solo?). Para ganar: el primer nivel enseña tap, swipe y BOOST jugando, sin una sola pantalla de texto |
| **Monetización** | Traffic Escape!: anuncios + pistas + quitar anuncios; Playgama: interstitial en pausas, rewarded opcional (guía oficial) | No definida en el GDD. Playgama/YouTube: pre-roll automático, interstitial en resultados, rewarded opt-in | **NO VERIFICABLE / PIERDE por ausencia.** No hay diseño de monetización que comparar. Para no perder: interstitial solo en pantalla de resultados de nivel; rewarded en «revivir una vez por intento» o «doblar el botín»; nunca a mitad de acción. Sin esto, la meta de 2.500 €/mes no tiene camino |
| **Rendimiento** | Epic Sword: afirma 60 FPS en teléfonos baratos (afirmación del portal, no medición propia) | Sin build. Requisitos oficiales: bundle inicial <15 MiB (SHOULD), <5 s a interactivo, heap <512 MB | **NO VERIFICABLE.** No hay nada que medir. Gate: 60 FPS en móvil real, carga <5 s, bundle inicial <15 MiB — o no se entrega |
| **Sonido** | Draw Crash Race: único que menciona diseño de sonido en su ficha; el resto no observado | GDD prevé rumor de ciudad adaptativo, clic, bocinas, sirenas bitonales, muelles cómicos. Sonido como herramienta táctica | **EMPATA en papel, PIERDE en evidencia.** El diseño de sonido es mejor que el de la mayoría (adaptativo, táctico), pero ningún sonido existe ni ha sido oído por un humano. Gate: sonido oído y aprobado antes de entregar |
| **Identidad / ciudad** | Ningún competidor de tráfico tiene ciudad real con identidad: sus coches son genéricos | Times Square real: TKTS, Broadway, MTA, FDNY, taxis amarillos. La ciudad es el personaje | **GANA en papel.** Es la segunda ventaja real del concepto. Para que no se pierda: cada capítulo tiene que ser una intersección reconocible (Times Square → Herald Square → Central Park → Brooklyn Bridge…), no «nivel 7 genérico» |

### 4.1 El veredicto en una línea

**El concepto gana en 2 dimensiones (decisiones, identidad), empata en 3 (arte, gancho 10 s, onboarding, sonido — en papel), pierde en 3 (primer fotograma, feel/juice, rejugabilidad) y no es verificable en 2 (monetización, rendimiento).** No se entrega como «ganador»: se entrega como concepto con dos ventajas reales y tres derrotas que el prototipo tiene que remontar. Si el prototipo no remonta el primer fotograma, el juice del choque y la meta de rejugabilidad, el juego no se construye — esa es la consecuencia de la orden de Daniel 19:11.

## 5. Hallazgos de pulido, por tiers (skill `game-polish-audit`)

Pilares de referencia: §1.1. Cada hallazgo con evidencia y confianza. Tier 1 = hacer primero (alto impacto, esfuerzo S/M).

### Tier 1 — Hacer primero

**1. El primer fotograma debe enseñar el verbo sin leer (Tier 1 · Impacto alto · Esfuerzo S · `[SEEN]` en mockup).**
- **Dónde:** mockup, banda «TAP THE LIGHT!».
- **Qué falta:** el verbo depende de texto. Arrow Puzzle y Coin Run enseñan la regla sin leer.
- **Cómo:** en la primera pantalla, un semáforo cambia solo a verde y un taxi arranca; el jugador toca el siguiente semáforo por imitación. Borrar «TAP THE LIGHT!» o dejarlo como refuerzo, no como instrucción.
- **Verificar:** playtest: 3/3 personas tocan un semáforo en <3 s sin que nadie les explique nada.

**2. El choque en cadena es el producto: diseñarlo antes que el menú (Tier 1 · Impacto alto · Esfuerzo M · `[INFERRED]` del GDD).**
- **Dónde:** GDD §2.2 (colisión crítica).
- **Qué falta:** duración, zoom, hitstop, CHAIN xN y reintento no están definidos; solo «cámara lenta».
- **Cómo:** 1,5–2,5 s de cámara lenta solo en la cadena, hitstop ~80 ms, zoom al impacto, contador CHAIN grande, REINTENTAR visible antes de que acabe.
- **Verificar:** playtest: el jugador sonríe o dice algo en el primer choque; si solo frunce el ceño, el momento falla.

**3. BOOST 2x: decidir qué es o quitarlo (Tier 1 · Impacto alto · Esfuerzo S · `[SEEN]` en mockup).**
- **Dónde:** botón BOOST 2x del mockup.
- **Qué falta:** nadie sabe qué duplica. Un botón que no se entiende es un botón roto.
- **Cómo:** o es «doble puntos 10 s» (con «2x» flotante sobre cada coche que puntúa) o es «doble velocidad de despeje» (con estela). Una sola cosa, con su ejemplo en el primer uso. Si no se decide, se quita del HUD.
- **Verificar:** playtest: 3/3 explican qué hace el BOOST sin leer.

**4. La meta que se ve: qué se gana con el score (Tier 1 · Impacto alto · Esfuerzo M · `[INFERRED]` — el GDD no define meta).**
- **Dónde:** GDD §1 (cuota por nivel) y mockup (SCORE 1250 sin contexto).
- **Qué falta:** el score no compra ni desbloquea nada visible. Draw Crash Race tiene 3 mejoras; Coin Run, negocios.
- **Cómo:** 3 mejoras legibles (p. ej. paciencia +1 s, arranque más rápido, aviso de ambulancia +1 s) o desbloquear intersecciones con nombre real. Lo barato: las intersecciones con nombre.
- **Verificar:** playtest: el jugador dice qué quiere desbloquear después del nivel 1.

### Tier 2 — Vale la pena

**5. El anillo de paciencia, grande y con sonido (Tier 2 · Impacto alto · Esfuerzo S · `[SEEN]` en mockup).** Últimos 2 s: parpadeo + vibración + bocinazo acelerado; a 0 s el coche arranca solo con gesto visible. Es la ventaja de «decisiones» — si el anillo no se ve, no hay ventaja.

**6. La ambulancia como evento, no como número (Tier 2 · Impacto medio · Esfuerzo S · `[INFERRED]` del GDD).** Sirena más alta que todo 3 s, carril iluminado 2 s antes, coches que se apartan, «AMBULANCE +2x» flotante.

**7. Restraint: un solo choque a la vez, sin shake infinito (Tier 2 · Impacto medio · Esfuerzo S · `[PLAYTEST]`).** La cámara lenta y el shake son el momento; si cada roce dispara shake, el juego marea. Accesibilidad: opción de reducir shake/flash. Sin esto, el juego no pasa el listón de pulido aunque el choque sea bueno.

### Tier 3 — Pase de pulido

**8. El mundo reacciona: peatones que cruzan, tiendas que se iluminan (Tier 3 · Impacto bajo · Esfuerzo M · `[INFERRED]`).** El mockup ya tiene peatones y tiendas; que reaccionen al tráfico (peatones que esperan en rojo, que cruzan en verde) vende la ciudad sin coste de jugabilidad.

**9. Sonido adaptativo de verdad (Tier 3 · Impacto medio · Esfuerzo M · `[INFERRED]` del GDD).** El rumor de ciudad que sube con la densidad (GDD §5.3) es buen diseño; verificarlo oído por un humano antes de entregar.

### Tier 4 — Aparcado (no hacer ahora)

**10. Multijugador / modo Race contra 4 jugadores (Tier 4).** Traffic Escape! lo tiene, pero es un añadido de retención, no del verbo. Aparcado hasta que el verbo de un jugador esté probado como divertido.
**11. Clima y eventos de capítulo 5 (lluvia, obras) (Tier 4).** El GDD los pone en el nivel 21+. No diseñarlos hasta que los capítulos 1–2 estén probados.

## 6. Checklist de construcción del prototipo (skill `game-quality-gates`)

Las 12 reglas universales, traducidas a Traffic Chaos. No son opcionales: el prototipo las pasa o no se entrega a Daniel. Reglas 10 (red) y 12 (anti-cheat) no aplican a un arcade local sin servidor — se marcan, no se ignoran.

| # | Regla | Requisito concreto en Traffic Chaos |
|---|---|---|
| 1 | Un solo punto de limpieza | `cleanupLevel()` único: todas las salidas (choque, gridlock, victoria, pausa, cambio de nivel) lo llaman. Sin limpieza dispersa |
| 2 | Respetar buffs activos | El BOOST 2x es un buff temporal: la velocidad/puntuación base se lee con el buff aplicado; ningún código lo pisa con el valor base |
| 3 | Cachear antes de destruir | En el choque: extraer posición, color y velocidad del coche ANTES de destruirlo, para las partículas y las piezas |
| 4 | Los timers siguen el ciclo de vida | El timer de paciencia de 8 s por coche y el temporizador de nivel se cancelan en `cleanupLevel()`; ningún `delayedCall` sobrevive al cambio de nivel |
| 5 | Lógica independiente de FPS | Paciencia, movimiento y cámara lenta con delta; nunca asumir 60 FPS. La cámara lenta es escala de tiempo, no salto de frames |
| 6 | Transición = limpieza total | Cambio de nivel: listeners, timers, audio, pools y estado global limpios. Verificar con heap snapshot antes/después |
| 7 | Ciclo de vida del audio | AudioContext con `resume()` en el primer gesto (iOS); `visibilitychange` pausa todo; sirenas y bocinas en buses separados de la música |
| 8 | Seguridad de input | BOOST y pausa con guarda de estado (doble toque no duplica el buff); cada dedo táctil con su pointer ID (multi-touch: tocar dos semáforos a la vez no rompe nada) |
| 9 | Persistencia con versión | Guardado con campo `version` (mejoras, intersecciones desbloqueadas, récord); auto-guardado al terminar nivel y al ocultar la pestaña; límite localStorage 5 MB |
| 10 | Tolerancia de red | No aplica (sin servidor). Si se añade leaderboard, timeout 5 s + fallback local + nunca bloquear el juego |
| 11 | Estrategia de carga de assets | Crítico (<2 s) → assets de nivel → diferido. WebP, atlas de sprites; degradación si falla un asset no crítico (nunca pantalla negra) |
| 12 | Anti-cheat base | No aplica al prototipo local. Si el score se envía (`ytgame.sendScore`), validar rango en el futuro; no inventar validación de servidor que no existe |

**Pre-deploy (del prototipo):** corners 100 % (cada botón responde en toda su superficie — la lección de Estampida/Barista); 60 FPS en móvil real; carga <5 s; bundle inicial <15 MiB; sonido oído por un humano; reintento <2 s tras perder.

## 7. Madurez del código (skill `review-game`)

**No aplicable aún: no existe código.** No se inventa ninguna puntuación (arquitectura x/6, rendimiento x/5). Lo que la skill deja como gates que el futuro build debe pasar:

- **Arquitectura:** EventBus central, GameState único, constantes centralizadas (8 s de paciencia, 45–60 s de nivel, valores de puntos — ni un magic number disperso), clase Game orquestadora, carpetas core/systems/gameplay/ui/level.
- **Rendimiento:** delta capado, object pooling en el choque (partículas y piezas), preload con progreso.
- **Calidad:** sin dependencias circulares, un módulo = un trabajo, try/catch en handlers.
- **Monetización:** sistema de puntos (score + multiplicadores) y tracking de sesión desde el día 1, aunque los anuncios lleguen después; integración del SDK `ytgame` (`firstFrameReady`, `gameReady`, `isAudioEnabled`, `sendScore`, `saveData`/`loadData`) según el informe PR #22 §1.

## 8. Probes de mecánicas para el prototipo (skill `probing-web-game-mechanics`)

**No aplicable aún: no hay build ni debug handle.** No se simula ningún resultado. Cuando exista el prototipo, con un handle mínimo (`window.__game = { state, step }`, decidido explícitamente como contrato de testabilidad), estas son las probes exactas — cada una con su valor esperado del GDD:

| # | Mecánica (spec del GDD) | Probe (valor esperado) |
|---|---|---|
| P1 | Paciencia 8 s | Inyectar coche en rojo con 7,9 s acumulados → tras 0,2 s el conductor ignora el semáforo y avanza. Antes de 8 s, no se mueve |
| P2 | Choque en cadena | Inyectar 2 coches en trayectorias de colisión → colisión → reacción en cadena con cámara lenta (escala de tiempo <1 durante 1,5–2,5 s) y contador CHAIN ≥2 |
| P3 | BOOST 2x | Inyectar BOOST activo → coche que cruza puntúa el doble exacto; al expirar, vuelve a x1 (regla 2 de quality-gates: el buff no se pisa) |
| P4 | Ambulancia vale doble | Inyectar ambulancia cruzando → puntos = 2× turismo; aviso 2 s antes del spawn visible en el borde del carril |
| P5 | Gridlock | Inyectar cola hasta el borde de spawn → partida termina por colapso vial (no por choque) |
| P6 | Swipe de despeje | Inyectar coche detenido en mitad del cruce → swipe → acelerón medible (velocidad > velocidad base durante el impulso) |
| P7 | Invariante anti-degenerado | Bot inactivo vs bot activo en el mismo nivel: el inactivo no sobrevive ni puntúa más que el activo (comparación, no valor absoluto) |
| P8 | Regla nunca dibujada | Cada probe con readout nuevo lleva captura: un valor correcto que nunca se dibuja es el defecto más frecuente de esta clase (el anillo de paciencia y el CHAIN xN se verifican en captura, no solo en valor) |

## 9. Métricas (skill `playgama-metrics-snapshot`)

**Sin snapshot de telemetría:** el MCP de Playgama no está conectado en este entorno y Traffic Chaos no está publicado — no hay `applicationId`, ni eventos, ni sesiones que leer. No se inventa ningún número de telemetría. Se aplica el método de la skill a las cifras públicas usadas en este teardown: cada número con unidad, periodo y fuente. Resumen de procedencia:

| Cifra usada | Unidad | Periodo | Fuente |
|---|---|---|---|
| Traffic Escape! ~44M | instalaciones estimadas (Google Play) | a 31/10/2026 | AndroidRank |
| Traffic Escape! 10M+ | instalaciones (tramo oficial) | a 11/2026 | Google Play vía AndroidRank |
| Crazy Flying Car 365K/día | plays/día | estrenos 01/07–04/09/2026 | Mediacube |
| Car Crash Sandbox 236K/día; 3 títulos 13,6M plays | plays/día; plays | primeras semanas | Mediacube |
| Crazy Flying Car 11M; Car Crash Sandbox 7,1M; MR RACER 12M | plays all-time | a 15/11/2026 | TubeGames |
| Draw Crash Race 2,5M; 968K en 7 días | plays | a 11/09/2026 | Columna Playgama |
| Crime 4,9M; 2M en 7 días | plays | a 11/09/2026 | Columna Playgama |
| Playgama 183 juegos / 586M plays; Simulation 24 % (1,4B) | juegos / plays | a 15/11/2026 | TubeGames |
| Playgama 180+ juegos de tráfico | juegos | a 15/11/2026 | Playgama (colección Traffic Games) |

Cuando el juego se publique, el snapshot se hace con la skill (carpeta `analytics-data/`, manifiesto y README repetible) y estas cifras públicas quedan como línea base de comparación — no como objetivo inventado.

## 10. Los 3 puntos clave que vamos a superar (y qué falta)

1. **Decisiones con coste en tiempo real — la ventaja que ningún rival tiene.** Paciencia visible de 8 s + priorizar ambulancia/bus + gridlock: Traffic Escape! decide sin presión de tiempo y Crime no decide nada. Protegerla significa: anillo grande, bocina que se oye, y que a 0 s el coche arranque de verdad. Si la paciencia no se siente, no hay ventaja.
2. **El choque como espectáculo, no como castigo.** El mejor momento del género es el choque (Crime: cámara lenta + deformación; Crazy Flying Car: 365K plays/día). Nuestro choque en cadena tiene que ser el mejor del género tráfico: hitstop, zoom, CHAIN xN grande, piezas con física, reintento <2 s. Hoy es solo un párrafo del GDD — es la remontada que el prototipo tiene que demostrar.
3. **Nueva York como personaje, no como fondo.** Ningún rival de tráfico tiene ciudad real con identidad. Times Square → Herald Square → Central Park → Brooklyn Bridge: cada capítulo una intersección reconocible, cada vehículo con color y forma propios sin leer. El mockup ya lo apunta; el arte dirigido tiene que convertirlo en ventaja, no en decoración generada.

**Próximos pasos (proceso de 10 pasos, informe PR #22 §7):** paso 2 (concepto + mockup) ya está aprobado por Daniel 19:08; paso 3 (aprobación) hecha; paso 4 es el **prototipo desechable** (`prototype-fast`): una pregunta («¿es divertido el verbo tap-semáforo + el primer choque?») con greybox, playtest humano y keep/kill/retune. El prototipo tiene que remontar las 3 derrotas del §4 (primer fotograma, juice del choque, meta de rejugabilidad) o el juego no se construye. **Pendiente:** afinar este teardown con los hallazgos de la investigación de demanda en paralelo cuando lleguen (gancho visual, bucle de enganche y ritmo que consumen los usuarios de Playables).

## Fuentes

- GDD: `~/workspace/user/files/Documento_de_Dise_o_Conceptual__Traffic_Chaos_-_Madrid_Rush_0_0oav.pdf` (Daniel, 4 páginas).
- Mockup aprobado: `mockup-traffic-chaos-ny.webp` (mismo fichero, en esta carpeta).
- Informe interno: `analisis-competencia-youtube-playables-2026-11-15.md` (rama `niky/analisis-competencia-yt`, PR #22) y `kit/teardowns-competencia.md` (Piece of Cake, Arrow Puzzle, Coin Run).
- Playgama: https://playgama.com/game/draw-crash-race · https://playgama.com/EN/tag/traffic-games · https://playgama.com/category/unblock-puzzles
- TubeGames (recuentos 14–15/11/2026): https://playables.games/publishers/playgama/ · https://playables.games/games/
- Mediacube: https://mediacube.io/en/blog/youtube-playables-game-mechanics (08/09/2026, datos 01/07–04/09/2026)
- Playgama (columna 11/09/2026): https://playgama.com/blog/main/5-5m-plays-in-7-days-five-playgama-games-that-took-off-on-youtube-playables/
- Traffic Escape!: https://androidrank.org/application/traffic_escape_/com.bonnie.trafficescape · https://geggames.com/game/traffic-escape/ · https://arrowgame.io/games/traffic-escape/
- Skills aplicadas (kit): `comunicacion-ias/kit/skills/skills-competencia/{review-game,game-quality-gates,game-polish-audit,juice-audit}/SKILL.md`, `comunicacion-ias/kit/skills/skills-pro/{probing-web-game-mechanics,playgama-metrics-snapshot}/SKILL.md`.
