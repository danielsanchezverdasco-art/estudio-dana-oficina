# Doubloon Rush — Teardown (ingeniería inversa con datos reales, 15/11/2026)

Fuentes verificadas el 15/11/2026. Playgama muestra valoración + nº de valoraciones, NO nº de jugadas («sin datos aún» donde no hay fuente). Nada de Fortnite ni One Piece: tema pirata genérico propio.

## 1. El gancho: el token pirata de Fortnite

- **Fortnite Treasure Hunters**, mini-temporada del 1/11 al 5/12/2026. El Pirate Shop Access Token es la recompensa más rara.
- **Probabilidad real confirmada por Epic (Fortnite Status, 7/11/2026): 1 entre 137.500 cofres por partida normal** (~0,00073 %); ×1,5 en Treasure Hours (~1 entre 91.667); ×2 en una sesión del 7/11 (~1 entre 68.750). El token da 2 activaciones (2026 hasta el 15/12/2026 y 2027) de 14 días de Item Shop gratis.
- Fuentes: gamerant.com, vanotherlevel.com, esportz.fun, lootrundown.com.
- **Implicación de diseño:** nuestro doblón debe ser raro pero MUCHO menos raro que 1/137.500 (nadie lo vería en rondas de 45–60 s). Elegido: 1 entre 500 (nivel 1) → 1 entre 120. El contador visible convierte la rareza en espectáculo.
- **El gancho caduca el 5/12/2026** (activación 2026 hasta el 15/12/2026). El juego funciona sin él después de esa fecha.
- #piratetoken: 428,3 M de visualizaciones / 59.086 publicaciones en TikTok US (7 días hasta el 14/11, +31,7 % vs 11/11), hashtag nº 3 (fue nº 1 el 10/11) — fuente hiviolet.ai. #pirateshoptoken ~12.400 vídeos / 279 M de reproducciones — memeclone.ai.

## 2. Competencia directa (Playgama)

### Whack a Mole - Pixel Version (Playgama)
- 4,1/5, 104 valoraciones; publicado 11/12/2025, actualizado 29/10/2026.
- 6 agujeros en 2 filas; +1 por topo; topo-reloj = tiempo extra; topo-bomba = recorta el tiempo restante.
- **Sin combos, sin monedas, sin estrellas, sin progresión.**

### Whack Strike - Sling & Slam (Playgama 4,5/5, 127 valoraciones; CrazyGames 8,9/10, 439 likes / 52 dislikes; Unity 6, vertical, Finz Games)
- NO es whack-a-mole: brawler físico (disparar telarañas, estampar enemigos).
- Lección: copiar su jugo físico/cómico, no sus controles de puntería ni su humor escatológico.

### Insect Crusher (Playgama, 6º en «Whack»)
- Cucarachas crecientes; puntos gastables en tienda interna; defensa/trampas.
- Tema repulsivo, sin objetivo raro. Sin datos de valoración («sin datos aún»).

### Google Play — Whack a Mole (com.u1kino.whacamole)
- Rondas de 45 s, 7 agujeros, 5 tipos de topo con puntuaciones distintas. Valida la duración de ronda 45–60 s.

### Google Play — Whack a Mole (com.desHBGT.Whackamole0001)
- 4,0 (47 reseñas). Reseñas: «Awful adds every 2 seconds!» y «Only 10 lvls. After maxing out at 20k pts nothing more appears at lvl 11».
- **Lecciones: anuncios durante la partida = reseñas de 1 estrella; sin contenido tras el nivel 10 = el juego muere.**

### Coin Bounce (Google Play, Mobsmile)
- Juego idle de monedas; lanzado agosto 2026; 1.500 instalaciones (AppBrain); nº 2 Top Free Casual en Canadá.
- La lluvia de dinero vende el clic, pero sin habilidad no hay retención.

### Fast Cash Farkle (Google Play, GreatPlay) — ANTI-MODELO
- 320.000 instalaciones (200.000 en los últimos 30 días), 4,9★ con 16.444 valoraciones, nº 5 Top Free Casual en EE. UU.
- **Premios en dinero real (duelos 1v1 con dinero, ligas, retiradas): prohibido en YouTube Playables, incompatible con PEGI 3/13+.**
- Única lección aprovechable: «gana X» + ranking + urgencia en el marketing.

### Pirate Raid (blog de Playgama)
- Incursiones pirata de 3 minutos contra 9 capitanes; abrir cofres; guardar el botín en una boya; perderlo todo si te hunden.
- La mecánica de **riesgo de perder el botín** está probada (nuestro cangrejo ladrón). 3 minutos es demasiado largo para nuestro formato.

## 3. Superar al mejor (≥ 3 puntos)

1. **3 valores de cofre (madera/plata/oro) + cangrejo ladrón + probabilidad visible del doblón** vs topos de un solo valor.
2. **Combos con multiplicador + estrellas por ronda + progresión (30 niveles, mapa, reto diario)** vs solo puntos.
3. **Anuncios SOLO entre rondas** vs anuncios cada 2 s (reseñas de 1 estrella).
4. **Meta infinita (probabilidad del doblón + skins)** vs contenido muerto tras el nivel 10.

## 4. YouTube Playables — Trust & Safety (página leída 15/11, actualizada 26/10/2026)

- Audiencia 13+ obligatoria; contenido «para niños» prohibido (el juego y el marketing deben leerse 13+, nunca infantiles).
- **Nada de dinero real** en ninguna forma (las recompensas solo tienen valor dentro del juego, NO transferibles ni canjeables).
- **Sin IAP, sin redes externas de pago/anuncios** (solo anuncios proporcionados por YouTube vía ytgame.ads; recompensados estrictamente opt-in, nunca automáticos, nunca bloqueando el progreso).
- Contenido original, sin marcas ni trade dress; sin metadatos engañosos (no prometer el token de Fortnite).
- **Probabilidad / contador visible: la página NO menciona loot boxes, odds ni contadores — mostrar un contador de probabilidad visible ESTÁ PERMITIDO, pero la probabilidad mostrada debe ser REAL y estar implementada honestamente** (un contador falso sería «engañoso»).
- Anuncios solo en transiciones naturales; no compartir enlaces de desarrollo/staging.
- Límites técnicos (otras páginas de certificación, NO leídas — «sin datos aún»): carga inicial < 30 MiB obligatoria / < 15 MiB recomendada; bundle total < 250 MiB.

## 5. Shorts — teardown (10 vídeos)

YouTube no expone visualizaciones ni duraciones en la lectura de texto («sin datos aún» salvo donde otra fuente las da).

1. «Fortnite FINALLY Revealed the REAL Treasure Drop Rates! 😱» (shorts/atJjcWB2_x8) — gancho «EPIC GAMES FINALLY REVEALED THE REAL TREASURE DROP RATES» + lista de probabilidades en la descripción.
2. «Fortnite Pirate Token: 14 Days of FREE Eligible Shop Claims!» (shorts/Q8NQ_uU0uC0) — narración IA, mapa de ruta de cofres.
3. «Pirate Treasure Vote! 🏴‍☠️ Which Chest — 1, 2, or 3?» (shorts/ColdAU7cR0o, Vicky's Fun World) — formato voto en comentarios, directamente adaptable (madera/plata/oro: «¿cuál abres?»), PERO es contenido infantil — ese tono NO sirve para Playables 13+.
4. Human Whack-A-Mole / Water Can Challenge (shorts/xK5FBaOspNI).
5. Whack-a-Mole 2, juego de manos 30 s (shorts/nIi89aFhP2E).
6. «This Pirate Game Lets You Fire Your Friend's Head Out Of A Cannon» (shorts/td05uFoo88M, Sink My Bricks).
7–10. TikToks sobre el token pirata (vía knowyourmeme.com): @tw.amnishi.legend +4,9 M de visualizaciones / 1,1 M de likes en 2 días («I HAVEN'T SLEPT FOR 24 HOURS WHERE IS MY TOKEN?»); @ebihazul +1,3 M / 228,6 k; @sahhyameiii +1,3 M / 252,6 k (falso «lo encontré»); @zqusk +3 M / 558 k («We will succeed»). Tráiler oficial del evento 27/10/2026: ~1,5 M de visualizaciones, 39 k likes, 2,8 k comentarios en 10 días.

**Patrones:** el número exacto ES el gancho («1 in 137,500»); pregunta + voto en comentarios genera interacción; la frustración + la rareza superan al gameplay limpio (mostrar el casi-lo-consigo, no solo la victoria). Cortes/música/texto en pantalla/final en bucle: «sin datos aún» — hay que ver los vídeos.

## 6. SEO (términos reales de títulos/descripciones/fichas; volúmenes «sin datos aún»)

- EN: whack a mole; whack a mole game; whack a mole pixel; pirate shop token / pirate shop access; fortnite treasure drop rates / fortnite pirate shop; pirate treasure / treasure hunt; treasure chest game / pirate chest; tap game / reaction game / reflex game; coin bounce / coin pusher; 45 second game / quick reflex game.
- ES: juego del topo / toca el topo; cofre del tesoro pirata; juego de reflejos; juego de tocar cofres; doblón de oro / doblón pirata.
- Patrones de título de Short: número + rareza («1 in 137,500»); pregunta + voto («Which Chest — 1, 2, or 3?»); promesa de tiempo corto («45-second rounds»); «Free» + recompensa.
- Títulos propuestos para el Short: «I opened 500 chests… the GOLDEN DOUBLOON finally appeared?!», «Which chest do YOU open? Wood, Silver or GOLD?», «1 in 500… can YOU find the Golden Doubloon?».

## 7. Título en inglés — verificación Playgama (15/11/2026)

- **«Doubloon Rush» — LIBRE en Playgama** (sin coincidencia exacta ni juego confusamente similar; la búsqueda de Playgama es difusa, así que «libre» = no apareció ningún juego exacto o similar; NO es una limpieza de marca).
- «Gold Doubloon Chest Rush» — libre también, pero largo (4 palabras); «Chest Rush» ya existe como minijuego en Pet Simulator 99 (Roblox) y Ballin Tycoon (que publica probabilidades por cofre — precedente útil).
- «Golden Doubloon Rush» y «Pirate Chest Rush» verificados libres; el último es el menos distintivo.
- «Gold Rush Builder» existe en Playgama (publicado 29/10/2026, minería con cofres, otro género).
- **Decisión: proponer «Doubloon Rush»** (2 palabras, memorable, único en Playgama). Daniel decide. Limpieza de marca fuera de Playgama NO hecha («sin datos aún»).
