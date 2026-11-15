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
| `stress-testing-game-concepts` (`skills-pro/`) | §11.1: auditoría adversarial del concepto | Modelo causal + 6 afirmaciones falsables (C1–C6: 2 `survives`, 2 `weak`, 2 `unknown`) + taxonomía de fallos (idle/mash/hold-only) — sin `hard_reject`, con el discriminador más barato nombrado |
| `maximizing-game-feel` (`skills-pro/`) | §11.2: vocabulario de feedback por evento | 5 vocabularios (peligro/recompensa/estado/near-miss/causa de derrota) sin tocar la simulación |
| `attack-tell` (`skills-pro/`) | §11.3: contrato de aviso | Ambulancia (2 s) y paciencia (<2 s) con canales redundantes; el color nunca es el único canal |
| `balance-design` + `evaluating-gameplay-balance` + `difficulty-and-balancing` + `implementing-gameplay-invariants` (`skills-pro/` + `skills-arte/`) | §11.4: contrato de balance e invariantes | `traffic-chaos-v1` con métrica primaria y guardrails; 5 invariantes con readout; ratio exploratorio y protocolo de bandas n≥3/n≥5; sin run human-limited no hay veredicto de dificultad |
| `arcadifying-mini-games` (`skills-pro/`) | §11.5: capas arcade que faltan | Inventario (READY/clear/death/game-over/extends/iniciales/attract) + máquina de fases única |
| `gating-intent-legibility` (`skills-pro/`) | §11.6: gate de legibilidad de intención | Clave congelada (objetivo/opciones/riesgo); protocolo C1–C3, N≥8, control degradado; lo hecho con el mockup se marca como self-audit, no veredicto |
| `game-engagement-ideas` + `analytics-funnel` (`skills-pro/`) | §11.7: funnel e hipótesis | Funnel v1 versionado (launch → D1) + 4 hipótesis propuestas con su validación; sin telemetría aún |
| `art-direction-and-readability` + `directing-game-visuals` (`skills-pro/`) | §11.8: dirección de arte | Legibilidad primero; colores señal reservados (anillo blanco→naranja→rojo, nunca amarillo: el amarillo es el taxi) |
| Demanda (PR #30) | §0.3, §1.2, §4.2, §5 (hallazgos 11–12), §10 | El choque como primer fotograma/miniatura, tycoon por barrios, reto diario + login, sesión 3–8 min, listones D1/D7/D30 y thumb-stop ≥35 % |
| Selección 147 skills (norma Daniel 19:16) | §12: las 147 revisadas una a una | **108 USAR, 39 NO** (arte 41/25, competencia 12/1, pro 47/10, marketing 8/3) + 2 bloqueadas por licencia fuera del kit (`game-playtest-squad-skill`, `game-audio` ingenium). Cierre §12.5: con qué skills se gana al mejor |

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
- **Sesión objetivo 3–8 minutos (hybrid-casual), no 45 segundos.** Demanda (PR #30 §3.1, GameAnalytics 2026, 16.262 juegos): sesión mediana 3,1–3,5 min, cuartil superior ~5,2 min; 3,8–3,9 sesiones/día; D1 mediana ~22 %, D7 algo menos del 4 %, D30 0,68–0,79 % (con meta, objetivo 5–10 %). Traducción: una sesión son 4–8 niveles de 45–60 s con reintento en un toque, no un nivel suelto. Una sesión de 10+ min es oro para los anuncios (Mediacube: «la profundidad de sesión vence al número de sesiones»).
- **El gancho 0–3 s decide el 80 % del presupuesto (PixelPlot 2026, vía demanda §2.2):** si el gancho no logra un 35 %+ de thumb-stop, el algoritmo suprime el anuncio. El gancho tiene que ser una interrupción de patrón: alto riesgo, acción visceral o reacción emocional intensa. Sin logos, sin intros, sin texto.
- **El ancla psicológica que más convierte es el estado de fallo (demanda §2.3):** enseñar a alguien cometiendo un error obvio crea la necesidad de corregirlo. Para Traffic Chaos, el fallo gracioso y visible — el choque en cadena — es un gancho, no un castigo. La portada y el primer fotograma tienen que ser el choque, no la ciudad vacía (demanda §6, ajuste (a)).
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

Imagen `mockup-traffic-chaos-ny.webp`, vista cenital 2.5D toy-diorama de Times Square: 4 semáforos en las esquinas (2 en verde, 2 en rojo), taxis amarillos en los 4 sentidos, autobús MTA rojo cruzando, ambulancia FDNY blanca, anillos de paciencia con 60 % / 45 % / 60 % sobre coches, peatones y tiendas (TKTS, TIMES SQUARE, COFFEE, GIFTS, FOOD, HOTEL), HUD superior con SCORE 1250 y LEVEL RUSH HOUR 3, banda «TAP THE LIGHT!», botones BOOST 2x y PAUSE. **Lo que el mockup hace bien:** la ciudad se reconoce al instante; los vehículos se distinguen por color y forma sin leer; los anillos de paciencia son el estado del jugador sin mirar el HUD. **Lo que el mockup no resuelve:** «TAP THE LIGHT!» es texto (el verbo debería entenderse sin él); no se ve el choque en cadena (el momento clave no está en la imagen); el BOOST 2x no se entiende qué hace (¿doble puntos? ¿doble velocidad?) sin leer; SCORE 1250 no dice qué se ha hecho para ganarlo. **Veredicto de demanda (PR #30 §6): el mockup enseña la ciudad vacía, no el verbo en acción — la portada y el primer fotograma tienen que ser el choque en cadena a cámara lenta con el anillo de paciencia a cero.** El mockup es la referencia de la ciudad; la portada es otra imagen: el choque.

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
| **Primer fotograma / gancho visual** | Arrow Puzzle: la portada enseña la regla; Coin Run: un objeto, una elección, dos colores | Mockup: ciudad reconocible + «TAP THE LIGHT!» + anillos de paciencia. El verbo se intuye, pero depende de leer el texto. Demanda (PR #30 §6): la portada y el primer fotograma tienen que ser el choque en cadena a cámara lenta con el anillo a cero (ancla de fallo: el espectador ve el choque que él habría evitado) | **PIERDE hoy.** El mejor no necesita texto; nosotros sí, y además enseñamos la ciudad vacía en vez del choque. Para ganar: primer fotograma = choque en cadena a cámara lenta + anillo a cero + thumb-stop ≥35 % (PixelPlot). El texto «TAP THE LIGHT!» debe sobrar y el mockup de la ciudad no es la portada |
| **Feel / juice** | Crime: cámara lenta + deformación; Epic Sword: ragdoll al golpear; Crazy Flying Car: física que se rompe | Choque en cadena a cámara lenta + hitstop + piezas volando (diseñado, no construido). Juice-audit §3: 3 de 5 momentos con audio «Missing» y animación «Weak» | **PIERDE hoy.** El mejor tiene el momento construido y probado; nosotros lo tenemos escrito. Para ganar: el choque en cadena tiene que ser el mejor momento de choque del género tráfico (hitstop, zoom, CHAIN xN, reintento <2 s). Si el choque es «coches que se paran», pierde contra Crime y contra Crazy Flying Car |
| **Gancho en 10 s** | Traffic Escape!: el primer coche sale al tocarlo; Slope 3D: la bola ya rueda; Crazy Flying Car: el primer vuelo imposible | Primer semáforo en verde + primer coche que arranca + primer anillo que baja. En papel, el gancho existe | **EMPATA en papel.** El gancho está diseñado pero no probado: ¿el usuario toca el semáforo en los primeros 3 s sin leer? Solo el prototipo + playtest lo responde (`[PLAYTEST]`). Si el primer nivel empieza con 4 coches esperando y nada que tocar, pierde |
| **Decisiones (profundidad)** | Traffic Escape!: orden de salida con flechas (puzle); Bridge Race: codicia contra velocidad (del informe PR #22) | Paciencia de 8 s + priorizar ambulancia/bus + gridlock + desvío en rotonda. Una decisión con coste cada 5–8 s, en tiempo real, no por turnos | **GANA en papel.** Es la única dimensión donde el concepto supera al mejor: ningún competidor de tráfico combina tiempo real + paciencia visible + priorización de emergencias. Traffic Escape! decide sin presión de tiempo; Crime no decide nada. Esta es la ventaja a proteger — pero es «en papel»: si la paciencia de 8 s no se siente (anillo pequeño, bocina inaudible), la ventaja se evapora |
| **Rejugabilidad** | Draw Crash Race: cada carrera es un dibujo + 3 mejoras; Traffic Escape!: estrellas + modo Race; Coin Run: negocios que mejorar | 5 capítulos con mecánicas espaciales nuevas + cuota por nivel + BOOST. Sin meta visible (¿qué se construye con lo ganado?) y sin diario/leaderboard definidos. Demanda (PR #30 §6): meta de tycoon por barrios (Times Square → Brooklyn Bridge → Central Park) + reto diario «hora punta» + recompensa de login | **PIERDE hoy, CON LA REMONTADA DEFINIDA.** El mejor tiene meta que se ve (mejoras, negocios, récord). Nosotros tenemos niveles, no meta. Para ganar: tycoon por barrios como meta visible desde el día 1 + reto diario + login (ajustes comunes §6.2 de demanda). Sin meta, es un arcade que se agota como Traffic Escape! en el nivel 320; con barrios + diario, la meta es la mecánica n.º 3 que más crece (tycoon, 286K/día) |
| **Onboarding (10 s, un dedo, cero lectura)** | Todos los top: la primera pantalla ya es el juego | Un verbo (tap) + swipe + drag en rotonda + BOOST. El tap es inmediato; el drag de desvío es un segundo verbo que solo aparece en niveles intermedios (bien) | **EMPATA en papel.** El tap pasa el listón; el riesgo es el BOOST 2x (¿qué hace?) y el drag (¿se descubre solo?). Para ganar: el primer nivel enseña tap, swipe y BOOST jugando, sin una sola pantalla de texto |
| **Monetización** | Traffic Escape!: anuncios + pistas + quitar anuncios; Playgama: interstitial en pausas, rewarded opcional (guía oficial) | No definida en el GDD. Playgama/YouTube: pre-roll automático, interstitial en resultados, rewarded opt-in | **NO VERIFICABLE / PIERDE por ausencia.** No hay diseño de monetización que comparar. Para no perder: interstitial solo en pantalla de resultados de nivel; rewarded en «revivir una vez por intento» o «doblar el botín»; nunca a mitad de acción. Sin esto, la meta de 2.500 €/mes no tiene camino |
| **Rendimiento** | Epic Sword: afirma 60 FPS en teléfonos baratos (afirmación del portal, no medición propia) | Sin build. Requisitos oficiales: bundle inicial <15 MiB (SHOULD), <5 s a interactivo, heap <512 MB | **NO VERIFICABLE.** No hay nada que medir. Gate: 60 FPS en móvil real, carga <5 s, bundle inicial <15 MiB — o no se entrega |
| **Sonido** | Draw Crash Race: único que menciona diseño de sonido en su ficha; el resto no observado | GDD prevé rumor de ciudad adaptativo, clic, bocinas, sirenas bitonales, muelles cómicos. Sonido como herramienta táctica | **EMPATA en papel, PIERDE en evidencia.** El diseño de sonido es mejor que el de la mayoría (adaptativo, táctico), pero ningún sonido existe ni ha sido oído por un humano. Gate: sonido oído y aprobado antes de entregar |
| **Identidad / ciudad** | Ningún competidor de tráfico tiene ciudad real con identidad: sus coches son genéricos | Times Square real: TKTS, Broadway, MTA, FDNY, taxis amarillos. La ciudad es el personaje | **GANA en papel.** Es la segunda ventaja real del concepto. Para que no se pierda: cada capítulo tiene que ser una intersección reconocible (Times Square → Herald Square → Central Park → Brooklyn Bridge…), no «nivel 7 genérico» |

### 4.1 El veredicto en una línea

**El concepto gana en 2 dimensiones (decisiones, identidad), empata en 3 (arte, gancho 10 s, onboarding, sonido — en papel), pierde en 3 (primer fotograma, feel/juice, rejugabilidad) y no es verificable en 2 (monetización, rendimiento).** No se entrega como «ganador»: se entrega como concepto con dos ventajas reales y tres derrotas que el prototipo tiene que remontar. Si el prototipo no remonta el primer fotograma, el juice del choque y la meta de rejugabilidad, el juego no se construye — esa es la consecuencia de la orden de Daniel 19:11.

### 4.2 Los top medidos contra los ajustes de demanda (PR #30 §6.2)

La demanda dice qué pide el usuario; esta tabla mide si cada top lo cumple. **Donde el top no lo cumple, ahí ganamos** — esa es la grieta por la que entra Traffic Chaos.

| Ajuste de demanda (§6.2) | Traffic Escape! | Draw Crash Race | Crazy Flying Car / Car Crash Sandbox | Crime and Vice City Police | Dónde ganamos nosotros |
|---|---|---|---|---|---|
| **Portada = el verbo en acción** (nunca escenario vacío ni logo) | Parcial: la portada enseña coches en un cruce, pero el verbo (orden de salida) no se ve en acción | **Sí:** la portada es tu dibujo corriendo; el verbo es la imagen | **Sí:** el coche volando/chocando es la portada | **Sí:** el choque con deformación es la portada | **Grieta: ninguno enseña GESTIÓN en acción.** Nuestra portada (choque en cadena a cámara lenta + anillo a cero) enseña el verbo (tocar el semáforo) Y su consecuencia (el choque) en una sola imagen. Si la portada es solo la ciudad, perdemos esta grieta |
| **Meta visible desde el día 1** | No: estrellas por nivel y modo Race; sin meta que se construya. Los niveles se repiten (reseña nivel 320) | **Sí:** 3 mejoras legibles (durabilidad, velocidad, tinta) desde el primer día | No observado: sandbox sin meta visible documentada | **Sí:** tuning, coches, multijugador como meta | **Grieta: Traffic Escape! y el sandbox no tienen meta.** Nuestro tycoon por barrios (Times Square → Brooklyn Bridge → Central Park) es meta visible desde el día 1 con el patrón de la mecánica n.º 3 (286K/día). Si no se construye, no hay grieta |
| **Reto diario + login** | No observado en la ficha | No observado | No observado | No observado | **Grieta: ningún top de tráfico lo documenta.** Nuestro reto diario «hora punta» + recompensa de login es ventaja por defecto — pero solo si existe de verdad en el día 1, no como «próximamente» |
| **Sesión 3–8 min, niveles 30–60 s, reintento en un toque** | Niveles cortos por turnos; reintento inmediato. Sesión: depende de niveles, no de tiempo | Runs de 2–4 min; reintento por carrera | Sandbox sin sesión definida; reintento inmediato | Sandbox; sesión libre | **Empate:** nuestro formato (45–60 s por nivel, 4–8 niveles por sesión) ya es el formato que pide la demanda. La diferencia no está aquí, está en que la sesión tenga meta (barrios) que la sostenga |
| **Short del momento de fallo o satisfacción, no del menú** | El choque que devuelve los coches es grabable, pero no es el gancho de su marketing | El coche que se rompe en el aire es el Short natural | **Sí:** el choque es el contenido | **Sí:** la deformación en cámara lenta es el Short | **Grieta: el fallo como ancla.** Nuestro Short es la ambulancia x2 y el choque en cadena (demanda §6, ajuste (d)). Ningún top de tráfico tiene un momento de fallo con protagonista (la ambulancia) que valga doble |

**Lectura:** los top cumplen la portada-en-acción y (a medias) la meta, pero **ninguno combina gestión en tiempo real + choque espectacular + meta de tycoon + reto diario**. Esa combinación es la apuesta completa de Traffic Chaos. Cada ajuste que no se construya cierra una grieta: sin portada de choque, perdemos el thumb-stop; sin barrios, perdemos el D30; sin diario, perdemos el D7.

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

**11. La portada y el primer fotograma SON el choque (demanda PR #30 §6) (Tier 1 · Impacto alto · Esfuerzo M · `[SEEN]` en mockup: el choque no está).**
- **Dónde:** mockup (ciudad vacía) y portada por diseñar.
- **Qué falta:** el mockup enseña la ciudad, no el verbo en acción. La demanda exige: primer fotograma = coches chocando a cámara lenta con el anillo de paciencia a cero; miniatura = lo mismo. Es el ancla de fallo (el espectador ve el choque que él habría evitado) y el gancho 0–3 s que decide el 80 % del presupuesto (thumb-stop ≥35 %).
- **Cómo:** nueva imagen de portada (el choque, no la ciudad) + primer fotograma del juego que arranca con un choque en cámara lenta de demostración (attract) antes del primer tap. El Short se graba de la ambulancia x2 y del choque, no del menú.
- **Verificar:** test de thumb-stop: 3/3 personas paran el scroll en la portada y dicen qué pasa sin leer.

**12. Meta de tycoon por barrios + reto diario + login (demanda PR #30 §6.2) (Tier 1 · Impacto alto · Esfuerzo M · `[INFERRED]` — no existe en el GDD).**
- **Dónde:** estructura de progresión (GDD §4, capítulos).
- **Qué falta:** sin meta no hay D30 (demanda §3.2: D30 mediana 0,68–0,79 %; con meta, objetivo 5–10 %); sin diario no hay D3→D7.
- **Cómo:** barrios desbloqueables con nombre real (Times Square → Herald Square → Central Park → Brooklyn Bridge), cada uno con su intersección y su pieza de colección visible desde el día 1; reto diario «hora punta» con recompensa de login. Sesión 3–8 min = 4–8 niveles de 45–60 s.
- **Verificar:** playtest: el jugador dice qué barrio quiere desbloquear; telemetría día 1: D1 ≥22 % (mediana GameAnalytics 2026) o el problema es la primera sesión, no el marketing.

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

1. **El choque en cadena a cámara lenta como primer fotograma, miniatura y Short — el ancla de fallo.** La demanda (PR #30 §6) lo exige: la portada es el choque con el anillo a cero, no la ciudad vacía; el espectador ve el choque que él habría evitado y quiere corregirlo (thumb-stop ≥35 %). Ningún top de tráfico combina gestión + choque como gancho: Crime y Crazy Flying Car tienen el choque pero no la gestión; Traffic Escape! tiene la gestión pero no el choque. Esta es la grieta nº 1 (§4.2).
2. **Decisiones con coste en tiempo real — la ventaja que ningún rival tiene.** Paciencia visible de 8 s + priorizar ambulancia/bus + gridlock: Traffic Escape! decide sin presión de tiempo y Crime no decide nada. Protegerla significa: anillo grande, bocina que se oye, y que a 0 s el coche arranque de verdad. Si la paciencia no se siente, no hay ventaja.
3. **Meta de tycoon por barrios + reto diario + login — la grieta que sostiene el D30.** Times Square → Brooklyn Bridge → Central Park como progreso visible desde el día 1 (patrón de la mecánica n.º 3, tycoon 286K/día) + reto diario «hora punta» + recompensa de login. Sin meta no hay D30; sin diario no hay D7. Los top de tráfico no documentan diario; Traffic Escape! no tiene meta que se construya. Esta es la grieta nº 2 (§4.2).

**Próximos pasos (proceso de 10 pasos, informe PR #22 §7):** paso 2 (concepto + mockup) ya está aprobado por Daniel 19:08; paso 3 (aprobación) hecha; paso 4 es el **prototipo desechable** (`prototype-fast`): una pregunta («¿es divertido el verbo tap-semáforo + el primer choque?») con greybox, playtest humano y keep/kill/retune. El prototipo tiene que remontar las 3 derrotas del §4 (primer fotograma, juice del choque, meta de rejugabilidad) o el juego no se construye. **Con qué skills se gana (§12):** el prototipo se audita con `stress-testing-game-concepts` (el concepto sobrevive o se mata con evidencia), se mide con `gating-intent-legibility` (el jugador nuevo lee el objetivo sin tutorial), se siente con `maximizing-game-feel` + `action-feel` + `juice-vfx` (vocabulario de feedback por evento), se equilibra con `balance-design` + `evaluating-gameplay-balance` (la paciencia de 8 s como contrato con métrica y guardrails), se completa como arcade con `arcadifying-mini-games` (READY/clear/death, extends, attract), y se publica con el núcleo de la plantilla (§3 del informe de skills: `playables-sdk-integration` + `certification-checklist` + `asset-pipeline`). Sin esas skills, el prototipo es otro intento a ciegas; con ellas, cada derrota del §4 tiene su test nombrado.

**Pendiente (ya no):** los hallazgos de la investigación de demanda en paralelo llegaron (PR #30) y están integrados en este documento (§0.3, §1.2, §4.2, §5 hallazgos 11–12, §10). Nada pendiente de demanda.

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

## 11. Aplicación de skills nuevas al teardown (147 revisadas; informe PR #27)

Lo que sigue es uso real, no inventario: cada skill aplicada deja un artefacto verificable en este documento (una tabla, un contrato, un gate). Las skills que solo sirven en fases posteriores quedan en §12 con su fase.

### 11.1 Stress-test adversarial del concepto (`stress-testing-game-concepts`)

Modelo causal (GDD): acciones — tap en semáforo, swipe de despeje, drag de desvío (rotondas), BOOST 2x. Estado que lee el jugador — anillos de paciencia, longitud de colas, aviso de ambulancia (2 s), score/cuota, temporizador. Dinámica automática — spawns, paciencia que se agota, ambulancia que ignora el rojo, camión que esparce obstáculos al chocar. Progreso — evacuados vs cuota, bonus taxi sin parada, ambulancia x2, BOOST 2x. Derrota — paciencia a 0 (el coche arranca solo), colisión en cadena, gridlock.

Afirmaciones falsables y su clasificación (missing evidence = `unknown`, no fallo):

| # | Afirmación | Veredicto | Razón |
|---|---|---|---|
| C1 | «El momento importa, no solo qué semáforo» | `survives` (en razonamiento) | La paciencia de 8 s convierte cuándo cambiar en decisión con coste; sin ella, el juego sería por turnos como Traffic Escape! |
| C2 | «Jugar seguro sacrifica el futuro» | `survives` (en razonamiento) | Tener todo en rojo es seguro ahora y mata por gridlock después: la cola llega al borde de spawn (GDD §2.2) |
| C3 | «Un experto recupera estados que un novato no» | `unknown` | El bus atrapado a mitad de cruce + swipe + desvío es la recuperación diseñada; sin prototipo no hay evidencia |
| C4 | «Arriesgar da más puntos» (taxi sin parar, ambulancia) | `weak` | El bonus existe en el GDD, pero su coste (el tráfico cruzado que se acumula) no está medido; un carril siempre en verde podría farmear taxis |
| C5 | «BOOST 2x es una decisión» | `weak` | La regla no está especificada (¿doble puntos? ¿doble velocidad?): no se puede testear lo que no está definido |
| C6 | «El choque en cadena es divertido» | `unknown` | Depende del feel audiovisual (taxonomía: `unsupported appeal`); marcar `unknown`, no `fails` |

Ataques de la taxonomía de fallos: **idle** muere por gridlock (bien); **mash/tocar todo** alterna los semáforos sin sentido y no puntúa por input (el score viene de evacuaciones, §11.4); **siempre verde en un eje** (repeat-one-action) es el riesgo mayor en niveles 1–5 con poca densidad — si la densidad es baja, la mejor acción no cambia entre estados (**agency collapse**); **stall for score** (sobrevivir sin cumplir cuota) falla el nivel por cuota + temporizador (bien); **drag de desvío** es camuflaje si las rotondas se resuelven solo con semáforos (`rule irrelevance`, `unknown`). **No hay `hard_reject`:** ningún defecto demostrado hace el loop no funcional; el concepto es diagnosticable, no rechazable. Próximo discriminador más barato: prototipo + probes P1–P8 (§8) + ratio exploratorio (§11.4).

### 11.2 Vocabulario de feedback por evento (`maximizing-game-feel`)

Registro: juguete/lúdico (toy-diorama). Vocabularios separados, sin tocar la simulación (la presentación no cambia colisiones; el hazard se dibuja al menos tan grande como su hitbox; todo efecto vuelve a reposo; el input en buffer sobrevive al hitstop):

| Evento | Vocabulario | Efecto concreto |
|---|---|---|
| Peligro (paciencia <2 s, ambulancia entrando) | silueta nítida, flash de alerta, impacto corto y duro | anillo rojo parpadeante + bocinazo acelerado + vibración del coche |
| Recompensa (evacuación, taxi sin parar, ambulancia x2) | brillos, partículas radiales, pop suave, confirmación brillante | «+50» flotante, monedas volando, glint en el coche |
| Cambio de estado (semáforo verde/rojo) | pulso localizado, motivo de transición, respuesta de cámara controlada | pulso del haz + luz que se enciende con easing (120 ms), no cambio instantáneo |
| Near-miss (coche que casi choca y se salva) | satisfactorio pero visiblemente más débil que la recompensa | pequeño desvío + «PHEW» — solo cuando hubo amenaza real evitada, no al pasar de largo |
| Causa de derrota | cada causa se ve distinta | choque = cámara lenta + piezas; gridlock = overlay gris de atasco + «GRIDLOCK»; nunca reutilizar el efecto de destrucción para una derrota por regla |

Orden de aplicación (impacto/esfuerzo): 1) confirmación de evento, 2) peso del impacto (hitstop ~80 ms, camera kick contenido), 3) expresión de movimiento (squash del coche al arrancar, tilt al girar), 4) consistencia del mundo (peatones que esperan en rojo), 5) trails a alta velocidad, 6) expresión de personaje solo si el tamaño en pantalla lo permite. Validación: jugadores simulados con semilla dan el mismo resultado antes y después del pase de feel; si cambia, el pase tocó las reglas.

### 11.3 Contrato de aviso (`attack-tell`)

| Amenaza | `tell_start` | Activación | Canales (redundantes; el color nunca es el único) |
|---|---|---|---|
| Ambulancia entra en pantalla | spawn − 2 s | entra por el borde del carril | icono pulsante en el borde + carril iluminado (marca espacial) + sirena (audio) + tick háptico (móvil) |
| Paciencia se agota | 2 s antes de 0 | el coche ignora el semáforo y avanza | anillo rojo parpadeante + bocinazo acelerado + vibración + «!» sobre el techo |
| Gridlock inminente (cola cerca del borde) | cola al 75 % del carril | cola llega al borde de spawn | borde de pantalla que se tiñe + rumor de ciudad que sube + contador de cola |

Política off-screen: indicador en el borde exacto del carril + cue de audio; nunca una amenaza silenciosa fuera de pantalla. Aceptación: log de tell/activación, test en los límites (justo antes/en la activación), con sonido desactivado y con reduced-flash, y en off-screen. Un flash que empieza en el tick de activación es acento, no aviso.

### 11.4 Contrato de balance e invariantes (`balance-design`, `evaluating-gameplay-balance`, `difficulty-and-balancing`, `implementing-gameplay-invariants`)

**Contrato (`balance-design`):** `balance_policy_id: traffic-chaos-v1`, revisión 1. Alcance: capítulo 1, niveles 1–5. Métrica primaria: tasa de cumplimiento de cuota de jugadores human-limited (denominador: intentos). Guardrails: ningún nivel con >80 % de estados con una respuesta obvia (regla de Sid Meier, vía `difficulty-and-balancing`: una elección con respuesta obvia no es una decisión); D1 ≥22 % es métrica de producto, no de balance. Tradeoffs declarados: la paciencia de 8 s es fija en v1 (no DDA — decisión explícita: sin director oculto; si se añade DDA después, con métrica objetivo, rango y decisión de visibilidad documentados). Curva: capítulos como escalones de dificultad con detección de picos en las transiciones.

**Invariantes (`implementing-gameplay-invariants` — cada promesa, una regla testeable con readout):**

| Promesa del diseño | Invariante | Readout (parte de la regla; si no se dibuja, es juego injusto) | Precheck (política mala) |
|---|---|---|---|
| Idle es débil | Sin input, gridlock en ≤60 s; sobrevivir no puntúa | Contador de cola visible que crece hacia el borde | Idle muere |
| Mash es débil | Un tap a <12 frames del anterior en el mismo semáforo no puntúa; el score viene de evacuaciones, nunca por input | El semáforo muestra su estado; el score solo sube con «+N» flotante en el coche | Mash no puntúa más que jugar |
| Hold-only es débil (un eje siempre en verde) | El tráfico cruzado acumula paciencia y llega a gridlock | Anillos de paciencia del eje cruzado visibles | Hold-only muere por gridlock |
| BOOST no se farmea | Cada evacuación puntúa una vez (`evacuationId` único); BOOST multiplica el evento, no el tap | «2x» flotante sobre cada coche que puntúa doble | Spam de BOOST = mismo score que uso medido |
| Ambulancia x2 | Puntos = 2× turismo por `ambulanceId` único | «AMBULANCE +2x» flotante y grande | — |

**Medición (`evaluating-gameplay-balance`):** políticas monótonas (idle, siempre-verde-un-eje, mash, intervalo fijo) vs exploratoria (precise) vs human-limited. `exploratory_ratio = exploratory.best.score / monotonous.max_score` (detector de calidad, no objetivo de optimización). Protocolo no determinista (sin semilla en navegador real): banda min–max con n≥3 runs por política, nunca estimación puntual; para afirmar que una banda se movió, n≥5 sin solape con la banda registrada. **Sin run human-limited no hay veredicto de dificultad: se reporta como no medido.** Guardrails de experiencia: no puntuar por input bruto; game-over ligado a hazard o colapso del mundo; nada de comportamiento oculto que solo ayude/perjudique a los bots.

### 11.5 Capas arcade que faltan (`arcadifying-mini-games`)

Inventario (el loop existe en el GDD; las capas no): READY (falta), clear de nivel (falta la ceremonia), death por gridlock/choque (falta), game over (falta), extends/1UP (falta), iniciales + top-5 persistente (falta), attract mode (falta — el primer fotograma con el choque en cámara lenta es el attract), HUD de progreso (parcial: score/cuota/timer existen, falta el barrio), jingles separados de SEs (falta). Máquina de fases única: `ready → play → clear → ready`, `death → play`, `entry → table → title`. Tabla de datos de ronda antes que código: capítulo × densidad × paciencia × cuota, con un respiro deliberado tras cada tramo duro. La cuota es un evento estable del mundo (vehículos evacuados), no score inflado por multiplicador.

### 11.6 Gate de legibilidad de intención (`gating-intent-legibility`)

**Clave congelada antes de cualquier captura:** objetivo — «evacuar la cuota de coches antes de que acabe el tiempo sin un choque en cadena»; opciones por estado — abrir un semáforo / cerrarlo / swipe a un coche atascado / BOOST; riesgo/recompensa — esperar llena la paciencia (el coche arranca solo) y abrir despeja la cola pero cruza tráfico. **Protocolo (prototipo):** C1 captura de frames, C2 replay determinista, C3 fingerprint de estado; N≥8 escenas en tripletes (t−Δ, t, t+Δ); un grader aislado por escena (sin diseño, sin título, sin t+Δ); control degradado en el primer uso; `collapse` = `dominant_share ≥0,75` o `distinct_classes ≤2` en track skilled con n≥3 runs. Veredictos: `legible` / `weak` / `illegible`; entrada `entry-legible` / `entry-opaque`. **Honestidad:** lo hecho hasta aquí con el mockup es un **self-audit, no un gate**: lo graduó su autora (yo), sin firewall y sin control — no es veredicto. El gate corre en el prototipo.

### 11.7 Funnel de engagement e hipótesis (`game-engagement-ideas`, `analytics-funnel`)

Funnel v1 (versionado, denominadores explícitos; sin telemetría aún — se mide al publicar con `playgama-metrics-snapshot`): launch → primer fotograma → primer tap (<10 s) → primera evacuación → primer choque en cadena visto → nivel 1 completado → nivel 2 iniciado → vuelta al día siguiente (D1). Cada tasa con numerador, denominador, unidad (eventos/sesiones/jugadores), periodo UTC y build. **Unique reach por evento no es un funnel:** las transiciones solo salen de hechos ordenados dentro de una sesión. Hipótesis (propuestas, no probadas): H1 — si D1 <22 % (mediana GameAnalytics 2026), el problema es la primera sesión (gancho u onboarding), no el marketing; H2 — el choque como primer fotograma sube el thumb-stop por encima del 35 %; H3 — los barrios como meta visible suben el D7 por encima del 4 %; H4 — el reto diario «hora punta» + login sostiene del D3 al D7. Una idea construida = un build, una versión en telemetría; una idea publicada no es una idea probada.

### 11.8 Dirección de arte y legibilidad (`art-direction-and-readability`, `directing-game-visuals`, `auditing-game-screen-readability`)

Prioridad: legibilidad primero, personalidad segundo, fidelidad nunca. Cada elemento nombra la pregunta de gameplay que responde; lo que no responde ninguna es decoración que compite con lo que sí. Colores señal reservados: verde = avanzar/seguro, rojo = parar/peligro; el anillo de paciencia va de blanco a naranja a rojo (no amarillo: el amarillo es el taxi, y un anillo amarillo sobre un taxi amarillo no se lee). Ambulancia blanca con luces rojo/azul. Siluetas: cada vehículo se reconoce por la forma sin leer (taxi con cartel, bus largo 2,5 casillas, ambulancia con cruz). `auditing-game-screen-readability` corre en el prototipo: captura de frames en los momentos que importan (primer tap, último segundo de paciencia, choque, clear) buscando texto solapado, indicadores demasiado pequeños/breves y HUD cuyo significado un lector aislado no puede nombrar.

## 12. Selección de skills para Traffic Chaos (norma de Daniel 15/11 19:16)

Norma: «usar las skills que más convengan a cada proyecto — REVISAR TODAS una a una antes para saber cuáles usar». Revisión hecha: las 147 `SKILL.md` del kit (rama `niky/skills-movil-1511`, PR #27; informe `informe-skills-calidad-2026-11-15.md`), una por una por nombre y descripción, con lectura completa de las aplicadas en este teardown. Resultado: **108 USAR, 39 NO**. «USAR» = la skill se aplica en el teardown, el prototipo, el build o la publicación; «USAR-APOYO» = apoyo puntual, no vía principal; «USAR-CONOCIMIENTO» = su conocimiento dirige, sus scripts no corren aquí. «NO» = no conviene a este proyecto, con el motivo — no es un juicio sobre la skill. Dos skills necesarias **no están en el kit (bloqueadas por licencia, informe §6):** `game-playtest-squad-skill` (playtest multi-perfil — el gate que habría evitado los 5 descartes) y `game-audio` (ingenium, audio completo); mientras, las cubren `playtest-report` + `smoke-testing-web-games` + `review-game` y Phaser `audio-and-sound` + `audio-feel` + `audio-buses`.

### 12.1 skills-arte (66: 41 USAR, 25 NO)

| Skill | Uso en Traffic Chaos | Por qué esa y no otra |
|---|---|---|
| action-feel | USAR (build: hitstop/buffers en el choque) | Es la de timing de acción; `game-feel` es teoría, esta es la regla de hitstop por evento |
| animations | USAR (build: animaciones de sprites Phaser) | Oficial Phaser 4; la vía del motor, no genérica |
| art-bible | USAR (arte: biblia visual antes de producir assets) | Sin biblia, el diorama se genera sin dirección (fallo nº 1 de los 5 descartados) |
| audio-and-sound | USAR (build: audio Phaser, desbloqueo en móvil) | Oficial Phaser 4; cubre el hueco de `game-audio` bloqueada |
| audio-buses | USAR (build: buses, ducking de la sirena) | Separa música/SFX/UI; sin buses, la sirena tapa los bocinazos |
| audio-design | USAR-APOYO (diseño sonoro de la ciudad) | Base teórica; `audio-feel` es la ejecución por evento |
| audio-feel | USAR (build: cues audibles por evento) | Mapea evento→audio con lifecycle; es la que hace que el anillo «se oiga» |
| blender-core | NO (sin Blender 5.2+ en este entorno) | Workflow + scripts bpy para máquina con Blender; aquí no corren |
| blender-export-pipelines | NO (sin Blender; arte 2D) | Exporta GLB/FBX a web/Unity/Unreal; nuestro arte es 2D, no hay nada que exportar |
| blender-game-optimization | USAR-CONOCIMIENTO (presupuestos móvil) | Sus números (tris, draw calls, memoria) dirigen; los scripts no corren aquí |
| blender-lighting-lookdev | NO (sin Blender; look-dev en 2D) | Iluminación 3 puntos/HDRI para renders 3D; el diorama se ilumina en 2D |
| blender-pbr-materials | NO (sin Blender; PBR no aplica) | Materiales PBR para 3D; toy-diorama 2D no usa metal/roughness |
| blender-rendering | NO (sin Blender) | Cycles/EEVEE; no hay renders 3D en este juego |
| blender-stylized-npr | USAR-CONOCIMIENTO (dirección toon/cel del diorama) | Su conocimiento (cel shading, outlines) dirige el look; los scripts no corren aquí |
| blender-texture-baking | NO (sin Blender) | Bake high→low para 3D; no aplica |
| blender-texturing | NO (sin Blender) | Smart materials 3D; no aplica |
| cameras | USAR (build: shake/fade/zoom de la cámara lenta) | Oficial Phaser 4; es la cámara del choque |
| character-rig | NO (vehículos sin esqueleto) | Estandariza rigs de personajes; no hay personajes con rig |
| choreograph | USAR-APOYO (ceremonias READY/clear en grupo) | Coreografía de entradas; `gsap-timeline` es la implementación |
| create-game-assets | USAR (build: pipeline de producción de assets) | La vía de producción; `asset-audit` es el gate que la verifica |
| design-taste-frontend | NO (frontend web, no HUD de juego) | Para páginas web; el HUD lo cubren `game-ui-taste` y `game-ui-ux-pro-max` |
| emil-design-eng | USAR-APOYO (motion con criterio en el HUD) | Easing, duraciones, press states; es el «por qué se siente bien» del botón BOOST |
| evaluating-gameplay-balance | USAR (teardown §11.4 + prototipo) | Es la medición (ratio exploratorio, perfiles); `difficulty-and-balancing` es la disciplina, esta es el protocolo |
| filters-and-postfx | USAR (build: bloom del choque, glow) | Oficial Phaser 4; el flash del impacto vive aquí |
| find-animation-opportunities | USAR-APOYO (revisión: dónde animar y dónde no) | Read-only, máx. 5–7 propuestas con motivo de rechazo; frena el sobre-juice |
| game-feel | USAR (base teórica del feel) | La teoría; la ejecutan `maximizing-game-feel` y `game-juice` |
| game-ui-taste | USAR (arte: dirección de UI anti-genérica) | Prohíbe el gris por defecto del motor; es la que hace que el HUD no parezca plantilla |
| game-ui-ux | USAR-APOYO (base de UI de juegos) | Base; `game-ui-ux-pro-max` es la versión completa con investigación |
| game-ui-ux-pro-max | USAR (HUD/FTUE: 7 pilares Hodent, FTUE <60 s, touch ≥48dp) | La más completa para HUD móvil; es la que fija el tamaño mínimo táctil del semáforo |
| generate2dmap | USAR (build: mapas cenitales con colisión) | Top-down con colisión y parallax; es el mapa de Times Square |
| generate2dmedia | USAR-APOYO (rutas de generación) | Capa de rutas; adaptada a herramientas propias, sin API de pago |
| generate2dsprite | USAR (build: vehículos desde master still) | Un master aprobado por vehículo; es la vía principal de arte 2D |
| impeccable | USAR-APOYO (check anti-slop en la portada) | Detector de 62 reglas; `npx impeccable install` en el repo del juego |
| input-keyboard-mouse-touch | USAR (build: multitáctil, hit areas) | Oficial Phaser 4; es la que evita el bug táctil de Estampida/Barista |
| loading-assets | USAR (build: loader, progress bar, caché) | Oficial Phaser 4; carga <5 s con progreso visible |
| mobile-games | USAR (base móvil: touch, batería, rendimiento) | Principios; `mobile-native` es la ejecución CSS |
| mobile-native | USAR (build: sensación nativa 390×844) | Tap sin delay, 100dvh, safe areas; es lo que separa «web en navegador» de «instalado» |
| particles | USAR (build: partículas del choque) | Oficial Phaser 4; piezas volando y polvo del frenazo |
| performance-optimization | USAR (diagnóstico de rendimiento) | La diagnosis; `performance-budget` pone los objetivos |
| phaser-core | USAR (build: base Phaser) | El motor; sin ella no hay juego |
| pixel-animation | NO (sin pixel art) | Mapeo de celdas pixel a timing; nuestros vehículos no son pixel art |
| playtest-report | USAR (prototipo: informe estructurado de playtest) | La plantilla del informe; es lo que sustituye (en parte) al playtest-squad bloqueado |
| review-animations | USAR (gate: 10 estándares, Block/Approve) | Veredicto con STANDARDS.md; es el gate de motion antes de enseñar a Daniel |
| scale-and-responsive | USAR (build: 9:16, FIT/RESIZE, quirks iOS) | Oficial Phaser 4; todos los aspect ratios (requisito de certificación) |
| spine-skeletal | NO (sin personajes con esqueleto) | Rigs Spine; los vehículos no se animan por huesos |
| sprite-atlas | USAR (build: packing + metadatos Phaser) | Sin atlas, las animaciones tiemblan y sangran entre celdas |
| sprite-gen | USAR-APOYO (generación de sprites) | Genera con GPT/Grok; `generate2dsprite` es la vía principal con master still |
| sprites-and-images | USAR (build: sprites Phaser) | Oficial Phaser 4; fábrica de sprites |
| threejs-animation / asset-pipeline / fundamentals / geometry / interaction / lighting / loaders / materials / performance / postprocessing / react-three-fiber / shaders / textures (13) | NO (motor Phaser, no Three.js) | Las 13 son Three.js/WebGL; este juego es Phaser 2.5D. Ninguna aplica |
| tilemaps | USAR (build: tilemaps de intersecciones) | Oficial Phaser 4; Tiled + capa GPU para las calles |
| tweens | USAR (build: tweens, easing, stagger) | Oficial Phaser 4; el anillo, el squash y la cámara lenta son tweens |
| ui-ux-pro-max | USAR-APOYO (datos: paletas, fuentes, presets GSAP) | 192 paletas y 74 parejas de fuentes buscables; `game-ui-ux-pro-max` es la de juegos |
| vfx-generate | USAR (build: placas VFX del choque) | Placas/flipbooks de impacto aisladas del arte del actor |
| video2dsprite | NO (sin clips por acción) | Un clip por acción (walk/run/attack); los vehículos no tienen acciones de personaje |

### 12.2 skills-competencia (13: 12 USAR, 1 NO)

| Skill | Uso en Traffic Chaos | Por qué esa y no otra |
|---|---|---|
| camera-anti-clip | NO (cámara cenital fija 2.5D) | Evita clipping 3D; sin cámara 3D no hay nada que recortar |
| game-feel-and-juice | USAR (base teórica del feel) | La teoría del momento a momento; `juice-audit` es el diagnóstico |
| game-juice | USAR (implementación de juice) | Squash, shake, hitstop sin cambiar las reglas; la ordena `maximizing-game-feel` |
| game-polish-audit | USAR (teardown §1/§5) | La estructura de este teardown; sin ella, los hallazgos serían una lista genérica |
| game-quality-gates | USAR (teardown §6) | Las 12 reglas; es el checklist de construcción del prototipo |
| gsap-core | USAR (build: animación HUD/DOM a 60fps) | Oficial GSAP; la librería es gratuita, las skills MIT |
| gsap-performance | USAR (build: rendimiento GSAP) | Transforms/opacity, sin layout thrashing; es la que mantiene los 60 fps del HUD |
| gsap-timeline | USAR (build: secuenciación de la cámara lenta) | Timelines anidadas; es la que coreografía hitstop → slow-mo → CHAIN xN |
| haptic-rumble | USAR (build: háptica tap/choque) | Capability checks + fallback no háptico; es el «sentir» el tap en el móvil |
| juice-audit | USAR (teardown §3) | Diagnóstico rápido de 4 pilares por momento; es la que encontró el audio «Missing» |
| juice-vfx | USAR (build: VFX runtime con contrato) | Flashes/partículas con caps y limpieza; nunca crea daño ni hitboxes |
| performance-budget | USAR (teardown §6 + build: objetivos p50/p95/p99) | Pone los números antes de optimizar; `performance-optimization` diagnostica después |
| review-game | USAR (teardown §7: gate del build) | Revisión de arquitectura/rendimiento/código/monetización; no aplicable aún sin código, pero sus 5 dimensiones son los gates |

### 12.3 skills-pro (57: 47 USAR, 10 NO)

| Skill | Uso en Traffic Chaos | Por qué esa y no otra |
|---|---|---|
| a11y-controls | USAR (build: preferencias de accesibilidad in-game) | Reduced-motion, flashing, timing; es la que hace jugable el choque sin shake |
| accessibility | USAR (build: Playables — daltonismo, ≥44px, texto ≥16px) | Requisitos de la plataforma; `a11y-controls` son las preferencias, esta es la norma |
| ad-break | USAR (build: ciclo de vida de anuncios) | Placement, resume, recompensa idempotente; es la que impide el interstitial a mitad de acción |
| analytics-funnel | USAR (teardown §11.7 + post-publicación) | Funnel versionado con denominador; sin ella, «el D1 cayó» no es auditable |
| arcadifying-mini-games | USAR (teardown §11.5) | Convierte el loop en arcade completo; es la que lista las capas que faltan |
| art-direction-and-readability | USAR (teardown §11.8) | Legibilidad como requisito ingenieril, no gusto; es la que reserva el rojo al peligro |
| asset-audit | USAR (gate: NOT ASSESSED, nunca inventar) | Ataca la lección de las 55 fotos; es la que verifica que cada asset existe y es del modelo exacto |
| asset-pipeline | USAR (publicación: miniatura 1:1, zona segura 12%, vídeo 16:9) | Material de publicación; es la que hace la portada publicable |
| attack-tell | USAR (teardown §11.3) | Contrato de aviso antes de la activación; es la que hace que la ambulancia no sea una emboscada |
| auditing-game-screen-readability | USAR (prototipo: frames en momentos clave) | Captura en eventos y coincidencias forzadas; es la que caza el texto solapado del «CHAIN x3» |
| balance-design | USAR (teardown §11.4) | Contrato con policy_id y guardrails; es la que convierte «8 s» en una decisión versionada |
| browser-input | USAR (build: pointercancel, visibilitychange) | Supervivencia del input; es la que evita acciones atascadas al cambiar de pestaña |
| building-era-authentic-game-audio | NO (audio retro 8-bit) | Sistema procedural años 70–80; nuestro audio es ciudad/bocinas/sirenas, no chiptune |
| camera-systems | USAR-APOYO (base de cámaras) | Teoría de sistemas de cámara; `cameras` (Phaser) es la implementación |
| certification-checklist | USAR (publicación: gate final Test Suite Google) | Recorre todas las skills de plataforma; es la última puerta antes de enviar |
| core-libraries | USAR (build: EventBus, AudioManager, SaveManager, ObjectPool, Juice) | Módulos reutilizables; es la que evita reinventar el EventBus (fallo de arquitectura) |
| curating-game-concept-portfolio | NO (nivel portfolio, no un juego) | Selecciona entre ideas; las 6 ya están aprobadas por Daniel |
| designing-mini-games | USAR (diseño: reglas compactas, core loop) | Diseña el loop de un botón; es la que define tap/swipe/BOOST como reglas |
| designing-minimal-game-rules | NO (alcance: solo turnos/discretos) | Su propia ficha: NO acción en tiempo real. Traffic Chaos es tiempo real |
| designing-retro-arcade-sound-kits | NO (kits retro) | Event-kits retro; no es nuestro sonido |
| difficulty-and-balancing | USAR (teardown §11.4) | Dominant-strategy audits, curvas, DDA; es la que aplica la regla de Sid Meier (>80 %) |
| directing-game-visuals | USAR (arte: jerarquía visual, paleta con roles) | Dirección legible y coherente; es la que asigna verde/rojo/blanco a go/peligro/ambulancia |
| exploring-game-design-space | NO (generar hipótesis nuevas) | Genera conceptos variados; el concepto ya está aprobado por Daniel |
| fixing-accessibility | USAR-APOYO (DOM: ARIA, foco, contraste) | Accesibilidad del HUD web; `accessibility` es la norma de plataforma |
| game-ai | NO (tráfico = flujo con reglas) | FSM/BT/A* para oponentes; no hay oponentes con IA, hay flujo y spawns |
| game-design-fundamentals | USAR (base: spine del diseño) | La disciplina base; la usó también el informe de demanda |
| game-docs | USAR (GDD vivo con fuentes y fechas) | Documentación; es la que mantiene el GDD como contrato, no como borrador |
| game-engagement-ideas | USAR (teardown §11.7) | Hipótesis desde datos con validación; es la que convierte el D1 en un cambio testeable |
| gating-intent-legibility | USAR (teardown §11.6) | Gate ciego de intención; es la única que puede fallar el primer fotograma con evidencia |
| implementing-gameplay-invariants | USAR (teardown §11.4) | Prosa → invariantes testeables; es la que impide que el mash gane |
| input-systems | USAR-APOYO (arquitectura de input) | Diseño de sistemas de input; `input-keyboard-mouse-touch` es la implementación Phaser |
| level-design | USAR (build: capítulos como niveles) | Layout, gating, soft-lock check; es la que exige que el desvío de rotonda sea necesario, no opcional |
| localize | USAR (EN primero, ES segundo) | Pipeline de localización; inglés primero es orden de Daniel |
| maximizing-game-feel | USAR (teardown §11.2) | Vocabulario de feedback por evento; es la que ordena el feel sin tocar la simulación |
| onboarding-and-teaching | USAR (FTUE: introduce→test→combine→twist) | Patrón de 4 tiempos por mecánica; es la que enseña el swipe sin texto |
| pacing-and-the-player-journey | USAR (arco: curva de interés, novelty cadence) | Macro-arco por sesión y por capítulo; es la que pone el respiro tras el tramo duro |
| phaser-arcade-physics | USAR (build: física del choque en cadena) | Física arcade; es la que hace que las piezas reboten |
| phaser-scene-scaffolding | USAR (build: Boot→Preloader→MainMenu→Game→GameOver) | Estructura de escenas; es la que ordena el flujo |
| physics-tuning | USAR-APOYO (ajuste fino de física) | Tuning; `phaser-arcade-physics` es la base |
| platformer | NO (sin plataformas ni saltos) | Coyote time y jump buffer; no hay salto en un juego cenital de tráfico |
| playables-sdk-integration | USAR (build: SDK ytgame) | Boot, firstFrameReady/gameReady, saveData/sendScore; es la integración oficial |
| playgama-bridge | USAR (publicación vía Playgama) | Bridge SDK; es la vía de publicación con reparto 75/25 |
| playgama-metrics-snapshot | USAR (teardown §9 + post-publicación) | Telemetría con unidad/periodo/fuente; es la que medirá el D1/D7 real |
| playgama-publish | USAR (publicación: checks, pack, 3 portadas) | Publicar en Playgama; es la que empaqueta el build |
| probing-web-game-mechanics | USAR (teardown §8: probes del prototipo) | Inyección de estado + asserts; es la que verifica la paciencia de 8 s sin jugar 8 s |
| procedural-gen | NO (intersecciones reales a mano) | RNG con semilla, WFC; los niveles son intersecciones reales diseñadas, no generadas |
| prototype-fast | USAR (paso 4: prototipo desechable) | Una pregunta, keep/kill/retune; es el paso que viene después de este teardown |
| puzzle | NO (puzzles discretos con solver) | Niveles verificados por solver para juegos discretos; Traffic Chaos es tiempo real |
| refining-game-prototypes | USAR (prototipo: bucle por etapas) | Estructura → dificultad → presentación → limpieza, con revision log |
| responsive-design | USAR (build: 9:16 a 21:9) | Sin coordenadas fijas; es la que cumple «todos los aspect ratios» |
| save-systems | USAR (build: guardado versionado) | Barrios, diario, récord; es la que persiste la meta |
| shader-programming | NO (sin shaders custom) | GLSL custom; `filters-and-postfx` cubre bloom/glow |
| smoke-testing-web-games | USAR (prototipo: salud runtime) | Carga, idle, input sin errores; es la capa bajo `probing-web-game-mechanics` |
| stress-testing-game-concepts | USAR (teardown §11.1) | Auditoría adversarial; es la que dice si el concepto sobrevive o se mata |
| styling-web-game-typography | USAR-APOYO (HUD: tipografía con licencia) | Roles de texto y licencias; es la que hace legible el «CHAIN x3» a 390 px |
| tutorial-for-game | USAR (FTUE ejecutable: force play-gate) | El único tap posible con la mano que señala; es la que enseña el primer tap sin texto |
| web-game-performance | USAR (build: medir frame time/JS/draw calls) | Medir antes de arreglar, en orden JS→draw calls→GPU; es la que sostiene los 60 fps |

### 12.4 skills-marketing (11: 8 USAR, 3 NO)

| Skill | Uso en Traffic Chaos | Por qué esa y no otra |
|---|---|---|
| ab-testing | USAR (post-publicación: portada A/B) | Muestra, significación, cuándo parar; es la que decide entre dos portadas de choque |
| hook-writer | USAR (marketing: gancho 0–3 s del Short) | Escritura del gancho; es la que convierte el choque en «para el scroll» |
| instagram-seo | NO (canal: YouTube + Playgama) | SEO de Instagram; el juego vive en YouTube Jugables |
| playgama-game-video | USAR (marketing: vídeo promo con gameplay real) | Gameplay frame a frame con el sting de Playgama; es el tráiler del juego |
| social | NO (social orgánico general) | Posts para LinkedIn/X/Instagram/TikTok/Facebook; el canal es YouTube Shorts |
| thumbnail-design | USAR (marketing: portada = verbo en acción) | La miniatura ES el choque; es la skill de la decisión más importante del §0.1 |
| tiktok-growth | NO (canal: YouTube Jugables) | Crecimiento en TikTok; no es nuestro canal |
| viral-reverse-engineering | USAR-APOYO (qué ganchos convierten) | Análisis inverso; `hook-writer` es la ejecución |
| virality | USAR (marketing: guión del Short) | Shorts con gancho en 3 s; es la que estructura el Short de la ambulancia |
| youtube-publishing-and-metadata | USAR (marketing: publicación YouTube) | Publicación y metadatos; es la que sube el Short con sus datos |
| youtube-shorts | USAR (marketing: Short del choque/ambulancia) | El formato; es el canal por el que el juego se descubre |

### 12.5 Cierre: con qué skills se gana al mejor del género

Al mejor del género no se le gana con una skill, se le gana con una cadena: **`stress-testing-game-concepts`** dice si el concepto sobrevive; **`gating-intent-legibility`** dice si el jugador nuevo lo entiende sin leer; **`maximizing-game-feel` + `action-feel` + `juice-vfx` + `tweens` + `cameras` + `particles`** hacen que el choque se sienta mejor que el de Crime y Crazy Flying Car; **`balance-design` + `evaluating-gameplay-balance` + `implementing-gameplay-invariants`** hacen que la paciencia de 8 s sea una decisión real y no un número; **`arcadifying-mini-games` + `save-systems`** construyen la meta de tycoon por barrios que Traffic Escape! no tiene; **`art-direction-and-readability` + `directing-game-visuals` + `art-bible` + `generate2dsprite` + `generate2dmap`** hacen que Nueva York se lea sin texto; **`tutorial-for-game` + `onboarding-and-teaching` + `game-ui-ux-pro-max`** hacen que el primer tap llegue en <3 s; **`thumbnail-design` + `hook-writer` + `virality` + `playgama-game-video`** hacen que la portada y el Short paren el scroll (thumb-stop ≥35 %); **`playables-sdk-integration` + `certification-checklist` + `performance-budget` + `web-game-performance`** hacen que el juego pase la certificación y corra a 60 fps; **`playgama-metrics-snapshot` + `analytics-funnel` + `game-engagement-ideas`** miden si de verdad ganamos (D1 ≥22 %, D7 ≥4 %, sesión 3–8 min). Cada derrota del §4 tiene su skill y su test nombrado en §11. Sin esa cadena, el teardown sería una opinión; con ella, es el plan.

## Fuentes (añadidas)

- Demanda del usuario (PR #30, rama `origin/niky/demanda-usuario-1511`): `comunicacion-ias/demanda-usuario-2026-11-15.md` (TubeGames 15/11/2026; Mediacube; AppMagic H1 2026; GameAnalytics 2026; ASOWin; PixelPlot).
- Informe de skills (PR #27, rama `niky/skills-movil-1511`): `comunicacion-ias/informe-skills-calidad-2026-11-15.md` (147 SKILL.md: arte 66, competencia 13, pro 57, marketing 11; núcleo de la plantilla en su §3).
- Skills aplicadas en §11 (kit): `skills-pro/{stress-testing-game-concepts,gating-intent-legibility,maximizing-game-feel,evaluating-gameplay-balance,game-engagement-ideas,balance-design,attack-tell,arcadifying-mini-games,implementing-gameplay-invariants,difficulty-and-balancing,art-direction-and-readability}/SKILL.md` (+ referencias `failure-taxonomy.md` y `policy-library.md` de stress-testing).
