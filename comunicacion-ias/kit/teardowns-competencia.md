# Teardowns de la competencia (Dana Games)

Fecha del análisis: 15/11/2026, Europe/Madrid (UTC+1).

## Método y límites (leer esto antes de usar las lecciones)

Este documento estudia **patrones de diseño** de juegos casuales que ahora funcionan en Playgama / YouTube Playables. Se hizo para mejorar nuestros juegos, no para clonarlos.

Qué se examinó (todo es material público que ve cualquier jugador o visitante):

- Fichas oficiales en Playgama.com (descripción, controles, orientación, fecha, votos, motor cuando lo publica el portal).
- Portadas e iconos oficiales de esas mismas fichas (arte de marketing publicado por el portal).
- Catálogo público de TubeGames de juegos Playgama en YouTube Playables, recuento del **14/11/2026**.
- Guías públicas de Playgama: [Loading and first session](https://wiki.playgama.com/playgama/guides/game-development/first-session) y [Ads best practices](https://wiki.playgama.com/playgama/guides/monetization/best-practices).
- Artículo público de Mediacube sobre mecánicas que escalaron en Playables en 2026 (publicado 8/9/2026, datos hasta el 4/9/2026).
- Columna de Playgama «5.5M Plays in 7 Days» (11/9/2026).

Qué **no** se hizo en esta pasada:

- No se jugó una partida en vivo (este agente no tenía subagente de navegador). Por eso **no se inventan** la duración exacta de un nivel, la curva de dificultad medida, el «feel» del audio o la cadencia real de anuncios dentro de estos tres juegos.
- No se descargó, embelleció ni descompiló el JavaScript, source maps, hojas de sprites ni audio de la competencia.
- Donde un dato no está en una fuente pública, se marca como **no observado**.

Herramientas y skills usadas como checklist (legítimas, para nuestros juegos y para estructurar el teardown): juice-audit (4 pilares), game-feel-and-juice, game-polish-audit (lentes de verbo, feedback, pacing, claridad), guía de primera sesión de Playgama. Instaladas en `/workspace/tools/` (source-map-explorer, Lighthouse ya presente, `scan_feedback.py`, `phaser-juice-scan.py`). Skills en `juegos/skills-competencia/`.

Los tres juegos se eligieron por estar arriba ahora y ser de **géneros distintos**: merge/gestión, puzzle lógico en vertical, y runner arcade + tycoon (este último, además, con gran volumen en YouTube Playables).

---

## 1. Piece of Cake: Merge & Bake

- Ficha: https://playgama.com/game/piece-of-cake-merge--bake
- Estudio: HAPPY GAMES STUDIO
- Género (portal): Merge + gestión de café
- Orientación: landscape
- Motor (ficha): Defold
- Idiomas (ficha): inglés
- Lanzamiento: marzo 2025; última actualización: octubre 2026
- Valoración en la ficha el 15/11/2026: **4,5 / 6181 votos**
- Posición: n.º 1 de «Top 20 Trending now» en Playgama, noviembre 2026
- Plays en YouTube Playables: **no consta** en el ranking público de TubeGames del 14/11/2026 que se consultó (no se inventa un recuento)

### Bucle principal (según la ficha oficial)

Combinar ingredientes en una mesa → desbloquear platos más complejos → ganar dinero cocinando → gastar ese dinero en restaurar el café (y luego la fachada y otros locales) → la mesa se agranda al hacer merges y caben más ingredientes → se abren nuevas ubicaciones. La ficha habla de **21 mapas/locales**, cada uno con tema propio, restaurados uno a uno.

Es un bucle de «esfuerzo corto + progreso que se ve»: cada merge no solo da un item, también reconstruye un sitio.

### Primeros 10 segundos y onboarding

**No observado en partida.** Lo que sí dice la ficha: «from the first missions, the game guides you through what to do, and hints appear whenever you might miss something». Encaja con la norma de Playgama (enseñar jugando, con una pista, no con un muro de texto), pero no se ha cronometrado el primer minuto.

La **portada oficial** no enseña un tablero de merge. Enseña una mano con guante amarillo y un limpiacristales rosa apartando cobertura rosa de fresa, con brillos, galletas y pasteles. Es un gancho táctil tipo «satisfying / ASMR / comida», muy legible en una miniatura, aunque no coincide con una captura del tablero. Lección: la miniatura vende la fantasía (limpiar, brillo, comida) más que una captura fiel de la UI.

### Duración de niveles y curva

**No medido.** La ficha no publica duración de sesión ni número de platos por etapa. El diseño descrito es de progresión continua (restaurar 21 locales), más que de niveles de 20–60 s. Para un Playable corto habría que acortar ese meta o trocearlo en encargos muy breves; no copiar un loop de gestión largo tal cual.

### Juice y feedback

**No oído ni jugado.** Se puede afirmar solo lo que se ve en la portada oficial: color saturado, comida apetecible, brillos, un gesto de limpieza que se entiende sin texto. La ficha habla de «pleasant graphics» y de ver el café volver a la vida «stage by stage»: el feedback de progreso es **visual en el mundo** (el local se repara), no solo un número en un HUD.

### Menú y meta

Meta claro y acumulativo: restaurar el café del abuelo, la fachada y 21 locales; mejorar utensilios; ampliar la mesa. Personajes nuevos a los que cocinar. Eso da razón para volver. Detalle de menú (animación, botones, racha) **no observado**.

### Anuncios

**Cadencia dentro del juego no observada.** Como título de Playgama, debe cumplir las reglas del portal (interstitial en pausas lógicas, nunca a mitad de acción). La ficha menciona pistas cuando te atascas: eso es un sitio típico para un rewarded opcional, pero no está confirmado en partida.

### Estilo de arte (portada oficial)

3D/ilustración pulida, paleta chicle (rosa, azul, amarillo), comida con volumen y brillos, un solo gesto a pantalla completa. Muy «miniatura que para el dedo». El juego en sí es landscape; nosotros trabajamos sobre todo en vertical, así que el layout no se copia, el nivel de acabado visual sí es la vara.

### Qué lo hace adictivo (por lo que la ficha describe)

La recompensa no es solo «otro merge», es ver un sitio abandonado volver a estar bonito. El merge alimenta una fantasía de restaurar y de cocina. Riesgo para nosotros si lo imitáramos sin más: es landscape, de gestión larga y del mismo tipo «encajar/combinar piezas» que Daniel ya quiere no repetir en cada juego.

---

## 2. Arrow Puzzle

- Ficha: https://playgama.com/game/arrow-puzzle
- Estudio: Green Train
- Género (portal): Matching / puzzle lógico
- Orientación: **portrait** (el más cercano a nuestro formato)
- Lanzamiento: abril 2026; última actualización: noviembre 2026
- Idiomas (ficha): inglés, español y varios más (chino, alemán, francés, indonesio, italiano, japonés, coreano, polaco, portugués, ruso, tailandés, turco)
- Valoración en la ficha el 15/11/2026: **4,6 / 1984 votos** (el listado «Trending now» mostraba 1985 votos el mismo día; se cita la ficha del juego)
- Posición: n.º 2 de «Top 20 Trending now» en Playgama, noviembre 2026
- Plays en YouTube Playables: **no consta** en el ranking de TubeGames del 14/11/2026 que se consultó

### Bucle principal (según la ficha oficial)

Un solo verbo: **toca una flecha solo si el camino de delante está libre**. La flecha sale y deja espacio para las siguientes. Si tocas una bloqueada, pierdes una vida. Hay que planear el orden, usar pistas si hace falta y dejar el tablero vacío para completar el nivel. Hay retos diarios y clasificación.

### Primeros 10 segundos y onboarding

**No observado en partida.** La regla cabe en una frase y, más importante, **la portada oficial ya la enseña**: un dedo toca una flecha azul que sale disparada de un laberinto de flechas negras, sobre fondo blanco. Cero texto de reglas en la imagen. Eso es el listón de «se entiende en el primer toque».

La ficha no describe una pantalla de instrucciones; no se puede afirmar cómo arranca la sesión real.

### Duración de niveles y curva

**No medido.** El diseño descrito (un tablero que se vacía, vidas, pistas, diario) encaja con niveles cortos de un puzzle, no con una run larga. La ficha no publica cuántos niveles hay ni cuánto dura cada uno. Las vidas añaden tensión (un toque mal dado duele) y las pistas evitan el abandono; el riesgo es que, si la regla no se pilla a la primera, el juego se sienta «tosco» (el mismo veredicto que Daniel dio a Metro). Por eso el verbo tiene que ser tan obvio como en la portada.

### Juice y feedback

**No oído ni jugado.** En la portada, la flecha activa es azul y sale con sensación de movimiento (estela), frente a las negras estáticas: contraste inmediato entre «esta se puede» y «estas no». Eso es feedback visual de estado, el pilar más importante del juice-audit para un puzzle de un toque.

### Menú y meta

La ficha cita: retos diarios, leaderboard, pistas y vidas. Eso es un meta ligero (volver cada día, compararte, no quedarte atascado). El aspecto del menú **no observado**.

### Anuncios

**No observado en partida.** Un puzzle con pistas y vidas es el patrón que la propia guía de Playgama recomienda para rewarded («Watch & Get a Hint», revivir como mucho una vez por intento). No se afirma que este juego lo implemente así.

### Estilo de arte (portada oficial)

Muy limpio, casi fotográfico: fondo blanco, flechas 3D negras mates, una sola flecha azul, una mano real. El gancho no es un personaje, es la claridad del tablero. En una miniatura de YouTube se lee a dos metros. Para nosotros: si el juego es un puzzle, la portada debe mostrar el toque, no un collage de personajes.

### Qué lo hace adictivo (por lo que la ficha describe)

Un solo toque, un resultado obvio, un tablero que se va vaciando (progreso visible), un error que cuesta una vida (tensión), un diario y una clasificación para volver. Es el tipo de loop corto que Playgama pide para Playables. Atención: Daniel no quiere que todos nuestros juegos sean de encajar/ordenar piezas; este sirve como referencia de **claridad**, no como plantilla de género a repetir.

---

## 3. Coin Run

- Ficha: https://playgama.com/game/coin-run
- Estudio: Thriller Games
- Género (portal): Arcade / runner / tycoon (también listado como Management)
- Orientación: landscape y portrait
- Lanzamiento: septiembre 2026; última actualización: noviembre 2026
- Idiomas (ficha): inglés
- Valoración en la ficha el 15/11/2026: **4,6 / 325 votos**
- YouTube Playables (TubeGames, recuento del **14/11/2026**): **22 M de plays** all-time, 5.º juego de Playgama en esa lista
- Categorías de la ficha: Arcade, Running, 3D, Tycoon, Management, Runner, Trending now

### Bucle principal (según la ficha oficial)

Durante la run: muévete izquierda/derecha, recoge monedas, entra por las puertas que multiplican el montón y evita los obstáculos que te lo comen. Al llegar a la meta, el botín se gasta en desbloquear y mejorar negocios, abrir zonas y agrandar el «imperio». Luego otra run. Es runner corto + meta de tycoon.

### Primeros 10 segundos y onboarding

**No observado en partida.** La ficha describe un control único (ratón, flechas o swipe/drag izquierda-derecha). La **portada oficial** enseña el verbo sin tutorial: un rollo de billetes 3D corre por un pasillo; delante hay una puerta verde «+200» y una roja «−50», ciudad de fondo, cielo azul. Cualquiera entiende «pasa por lo verde, evita lo rojo» en un segundo. Encaja con lo que Playgama escribió de sus propios hits: «the pitch fits in three words» y «someone might watch for eight seconds before deciding whether to tap Play».

### Duración de niveles y curva

**No medido.** El diseño es de runs (salida → puertas y obstáculos → meta → gastar), típico de sesiones cortas. La ficha no publica duración ni número de tramos. El meta (negocios, zonas nuevas) da motivo para repetir la run, no para alargar una sola.

### Juice y feedback

**No oído ni jugado.** En la portada el feedback numérico es enorme y de color: verde suma, rojo resta, el protagonista es el propio dinero. El estado del jugador (voy bien / voy mal) se lee sin HUD pequeño. Eso es «cada decisión da una recompensa o un golpe visible», el tipo de feel que Daniel pide.

La ficha describe además un escenario con pared azul de piezas tipo ladrillo de construcción: look 3D colorido de juguete, no formas planas.

### Menú y meta

Meta explícito en la ficha: desbloquear y mejorar negocios, abrir áreas, construir un imperio con lo que traes de cada run. Es el patrón «la partida financia la siguiente». Detalle de menús y de rachas **no observado**.

### Anuncios

**No observado en partida.** La guía de Playgama coloca el interstitial en la pantalla de resultados de una run (no a mitad del pasillo) y el rewarded en «doblar el botín» al terminar o en un revivir, como mucho una vez por intento. Son patrones recomendados para este género; no se afirma que Coin Run los use exactamente así.

### Estilo de arte (portada oficial)

3D saturado, sol de dibujo, ciudad en azul, dinero como personaje, UI de puertas enorme y contrastada. La miniatura funciona porque hay **un objeto, una elección y dos colores**. Listón visual alto, claramente por encima de un prototipo plano.

### Qué lo hace adictivo (por lo que la ficha y las cifras públicas permiten decir)

Elección constante (puerta buena / mala), un número que sube o baja a la vista, una meta que convierte ese número en algo que se construye, y un control de un dedo. Los 22 M de plays en YouTube Playables (TubeGames, 14/11/2026) confirman que este tipo de loop escala en esa plataforma. No se inventa el tiempo medio de sesión ni la retención.

---

## Patrones que se repiten (y qué hacer nosotros)

De estos tres, más las guías y columnas públicas de Playgama y el análisis de Mediacube (sin convertir una semana buena en una receta mágica; Playgama lo dice explícitamente):

1. La portada y el primer fotograma enseñan el verbo. Si hay que leer, ya vamos tarde.
2. Un dedo y una acción. Mediacube resume el listón de Playables en 2026 como «one-finger mechanic, ten-second onboarding». Las categorías que más orientación piden (RPG, estrategia, multijugador) escalaron peor en ese análisis.
3. Mecánica conocida con un giro (merge + restaurar; correr + tycoon; vaciar flechas + diario). Playgama lo dijo de Draw Crash Race: no hace falta una mecánica nueva, basta una combinación clara.
4. El progreso se ve en el mundo o en un número enorme, no en un texto.
5. Sesión corta, victoria pronto, reintento inmediato. En la columna de Playgama, Slope 3D se describe así: lo pillas en segundos, fallas rápido y quieres repetir.
6. Meta que da motivo para volver: locales que restaurar, negocios que mejorar, reto diario, clasificación.
7. Anuncios en pausas (norma oficial), rewarded como bonus que se puede rechazar.
8. Variedad de género. El análisis de Mediacube (altas de Playables, 1/7/2026–4/9/2026, ordenadas por plays/día) señaló seis mecánicas calientes: puzzle de dibujar/escapar, física/choque de coches, tycoon/tienda, belleza/moda, ragdoll/acción y carreras arcade. Varios títulos del mismo tipo escalaron a la vez, sin «solo cabe uno». Eso apoya la norma de Daniel de no repetir siempre encajar piezas.

Cifras públicas de contexto (no son de nuestros juegos, no se usen como si lo fueran):

- Playgama en YouTube Playables el 14/11/2026 (TubeGames): 183 juegos, 583 M de plays combinadas; el más jugado, Epic Sword Battle!, ~28 M.
- Mediacube, 1/7–4/9/2026: el catálogo de Playables pasó de 788 a 1477 títulos; más de 1000 M de plays nuevas en 65 días. El mayor plays/día de las altas de 2026 en esa muestra: Tricky Twist: Brain Puzzle, 394 K/día.
- Columna Playgama, 11/9/2026: cinco lanzamientos de una misma semana sumaron más de 5,5 M de plays en ~7 días (Crime and Vice City Police 2 M, Camo Sniper 3D 1,2 M, Draw Crash Race 968 K, Destructive Car Crash Simulator 887 K, Slope 3D 503 K).

---

## Fuentes

- https://playgama.com/game/piece-of-cake-merge--bake
- https://playgama.com/game/arrow-puzzle
- https://playgama.com/game/coin-run
- https://playgama.com/EN/collections/top-trending-now-games
- https://playables.games/publishers/playgama/ (recuento del 14/11/2026)
- https://wiki.playgama.com/playgama/guides/game-development/first-session
- https://wiki.playgama.com/playgama/guides/monetization/best-practices
- https://wiki.playgama.com/playgama/game-requirements/advertising-requirements
- https://playgama.com/blog/main/5-5m-plays-in-7-days-five-playgama-games-that-took-off-on-youtube-playables/
- https://mediacube.io/en/blog/youtube-playables-game-mechanics
