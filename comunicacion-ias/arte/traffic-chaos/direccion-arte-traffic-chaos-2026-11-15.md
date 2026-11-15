# Dirección de arte — Traffic Chaos: New York Rush

**Juego:** Traffic Chaos: New York Rush · **Estudio:** Dana Games · **Paso:** 3 de 10 (dirección de arte)
**Fecha:** 15/11/2026 · **Autor:** Niky (dirección de arte) · **Estado:** entregado para revisión de enganche visual
**Fuentes:** GDD de Daniel (4 págs., `Documento_de_Dise_o_Conceptual__Traffic_Chaos_-_Madrid_Rush_0_0oav.pdf`, escenario trasladado a Nueva York por orden de Daniel 15/11) · Mockup aprobado por Daniel (`mockups/mockup-traffic-chaos-ny.webp`, referencia definitiva) · Preview exacta de gameplay (`comunicacion-ias/previews-juegos-2026-11-15/preview-traffic-chaos-ny.webp`, rama `niky/previews-juegos-1511`, guía visual obligatoria: cada pantalla se compara con ella) · Guía visual de previews (`guia-visual-previews-2026-11-15.md`, misma rama) · Informe de demanda del usuario (PR #30, `comunicacion-ias/demanda-usuario-2026-11-15.md`, rama `origin/niky/demanda-usuario-1511`) · Informe de skills (PR #27, `comunicacion-ias/informe-skills-calidad-2026-11-15.md`, 147 skills: 66 de Grok + 81 nuevas; núcleo de la plantilla en su §3)
**Listón:** parecer un juego de 20.000 $ (orden de Daniel 15/11 18:41, 19:08, 19:11). No basta ser fiel al mockup: el arte tiene que **ganar al mejor juego de tráfico** en luz, color, legibilidad y espectáculo. Ver §8. Y por la demanda (§14): **la portada y el primer fotograma son EL CHOQUE en cadena a cámara lenta con el anillo a cero** — no la ciudad vacía.

> **Regla de oro (una línea):** *Times Square de noche, mojado de lluvia y lleno de neón, donde cada coche es un personaje de color inconfundible y el estado del juego se lee en la calle, no en los números.*
> Test de la regla: ante cualquier duda visual, se elige la opción que haga la calle más legible a 390 px de ancho. La fidelidad nunca gana a la legibilidad; la decoración nunca compite con una señal de juego.
>
> **Regla del primer fotograma (demanda, PR #30 §6):** *la portada y el primer fotograma son el choque en cadena a cámara lenta con el anillo de paciencia a cero.* El espectador ve el fallo que él habría evitado y quiere corregirlo (ancla de «estado de fallo», PixelPlot 2026). La ciudad fluyendo es la partida; el choque es la portada. Ver §14.

---

## 0. Frase visual

**«Una maqueta de juguete que cobra vida bajo la lluvia de neón.»**
Todo el juego es un diorama: la ciudad es un juguete (formas redondeadas, sombras suaves a 45°, bordes gruesos) y la noche de Times Square es el espectáculo (neón, asfalto mojado, reflejos, estrobos). El contraste entre juguete-cálido y noche-eléctrica es lo que hace que una captura se reconozca entre cien juegos de tráfico.

**Protagonista, peligro y recompensa en un solo fotograma (sin leer el HUD):**
- Protagonista: el jugador es la calle misma — los semáforos que toca.
- Peligro: el anillo de paciencia que se agota en rojo sobre un taxi.
- Recompensa: la ambulancia FDNY blanca abriéndose paso con estrobos, valiendo doble.
Si una captura no muestra las tres cosas a la vez, la composición está mal.

---

## 1. Identidad visual (art-bible §§1–4)

### 1.1. Estilo
- **2.5D toy-diorama**, vista cenital en tres cuartos altos (no cenital puro: se ven los laterales de los edificios y los techos de los coches, como en el mockup). Geometría limpia, formas redondeadas tipo arcilla, sombra suave proyectada en ángulo fijo de 45°.
- **Noche cerrada + lluvia reciente.** El asfalto mojado es obligatorio: sin reflejos de neón la escena es un parking; con ellos es Times Square. Lluvia fina visible solo en la capa superior (no interfiere con la lectura).
- **Densidad:** aceras vivas (peatones miniatura, hidrantes, papeleras, macetas) en la periferia; **el centro del cruce siempre limpio** — nada de textura ni peatones sobre la calzada jugable.

### 1.2. Mood por estado
| Estado | Emoción | Luz | Energía |
|---|---|---|---|
| Menú principal | «Quiero entrar» — ciudad viva que invita | Neón cálido, tráfico moviéndose detrás del título | Media, acogedora |
| Partida (flujo bien) | Control, ritmo | Verde dominante, reflejos tranquilos | Alta, fluida |
| Paciencia < 3 s | Urgencia | Anillo rojo pulsante + bocinazo visual (¡!) | Frenética |
| Choque en cadena | Espectáculo cómico, no castigo | Cámara lenta, desaturación parcial del fondo, destello cálido en el impacto | Lenta, luego explosiva |
| Victoria de nivel | Fiesta | Confeti de puntos de colores + neón a tope | Eufórica |
| Derrota (colapso) | «Una más» | Fundido a azul frío, un solo taxi pitando | Baja, con gancho de retry |

### 1.3. Lenguaje de formas
- **Vehículos:** siluetas redondeadas, techos altos, ruedas grandes y visibles. Cada tipo se reconoce por la silueta a tamaño de miniatura: taxi (sedán + letrero), autobús (rectángulo largo 2,5 casillas), ambulancia (furgón alto + cruz), patinete (figura diminuta de pie), camión (caja trasera visible).
- **Edificios:** bloques con cornisas redondeadas y letreros en relieve; nunca geometría afilada ni realista.
- **UI:** píldoras brillantes con borde grueso y sombra inferior (caramelo). La UI es un lenguaje distinto del mundo: brillante y plana frente al mundo con volumen. Esa divergencia es deliberada: la UI nunca se confunde con la calle.
- **Formas héroe:** los semáforos (verticales, con visera) y los anillos de paciencia (círculos perfectos) son las únicas formas geométricas puras del mundo; todo lo demás es orgánico-redondeado. El ojo va siempre a un círculo o a un semáforo.

### 1.4. Sistema de color (roles de juego, no decoración)
Cada color tiene **un solo significado**. Ningún color se usa para dos cosas.

| Color | Hex | Rol | Dónde |
|---|---|---|---|
| Asfalto pizarra | `#334155` | Fondo neutro (no es señal) | Calzada |
| Asfalto mojado (noche) | `#1E293B`–`#0F172A` | Fondo nocturno, refleja neón | Calzada en partida |
| Acera | `#CBD5E1` / `#94A3B8` | No jugable | Aceras |
| Amarillo taxi | `#FACC15` | Vehículo base, puntos estándar | Taxis (SIEMPRE este amarillo) |
| Rojo MTA | `#DC2626` | Vehículo largo y lento, peligro de bloqueo | Autobús MTA + logotipo azul `#2563EB` |
| Blanco FDNY | `#F8FAFC` + franja roja `#DC2626` | Emergencia, prioridad, doble puntos | Ambulancia FDNY |
| Verde GO | `#22C55E` | Avance / seguro | Semáforo verde + charco de luz verde |
| Rojo STOP | `#EF4444` | Detención / peligro | Semáforo rojo + charco de luz roja |
| Ámbar paciencia | `#F59E0B` | Aviso (anillo 8 s → 3 s) | Anillo de paciencia |
| Rojo paciencia crítica | `#EF4444` | Peligro inminente (< 3 s) | Anillo + parpadeo |
| Naranja CTA | `#F97316` | Acción principal | Botón PLAY, banner TAP THE LIGHT! |
| Amarillo score | `#FBBF24` | Puntos | Píldora SCORE |
| Púrpura nivel | `#8B5CF6` | Progreso | Píldora LEVEL |
| Azul BOOST | `#3B82F6` | Poder / velocidad | Botón BOOST 2x |
| Neón rosa / cian | `#EC4899` / `#22D3EE` | Atmósfera (nunca señal) | Letreros TIMES SQUARE, HOTEL, COFFEE |

**Reglas de color:**
- El rojo de STOP y el rojo de paciencia crítica son el mismo `#EF4444` a propósito: ambos significan «peligro ahora».
- El verde solo existe en semáforos y charcos de luz. Nada más es verde: ni botones, ni letreros, ni vegetación saturada.
- **Daltonismo:** ningún estado depende solo del color. Verde = luz superior encendida + charco de luz en el asfalto + coche en movimiento; rojo = luz superior + charco + coche parado + anillo. La ambulancia se reconoce por forma (furgón + cruz azul `#2563EB`) y por estrobo, no por color.
- **Contraste de texto:** blanco `#FFFFFF` sobre píldoras con contorno marrón oscuro `#78350F` (título) o sobre púrpura/naranja saturado; ratio ≥ 4.5:1 en todo texto de juego.

---

## 2. Vehículos — color propio y constante

Ningún vehículo cambia de color entre niveles ni entre pantallas. El jugador aprende el código en el nivel 1 y no lo vuelve a pensar.

| Vehículo | Color (constante) | Silueta | Tamaño | Comportamiento visual |
|---|---|---|---|---|
| Taxi amarillo | `#FACC15`, letrero `TAXI` en el techo, damero negro en laterales | Sedán redondeado | 1 casilla | Arranca con un pequeño salto (squash); al cruzar sin detenerse deja estela amarilla breve |
| Turismo estándar | Pasteles cálidos (`#FCA5A5`, `#93C5FD`, `#86EFAC`) — nunca amarillo taxi | Sedán sin letrero | 1 casilla | Base neutra; sin efectos propios |
| Autobús MTA | Rojo `#DC2626`, logotipo MTA azul `#2563EB`, ventanas ámbar iluminadas | Rectángulo largo | 2,5 casillas | Frenada larga visible (se inclina); si queda atrapado a mitad de cruce, sus ventanillas parpadean en ámbar |
| Ambulancia FDNY | Blanco `#F8FAFC`, franja roja, cruz azul, `FDNY` en rojo | Furgón alto | 1,5 casillas | **Estrobo rojo/azul permanente** (halo alterno en el asfalto); aviso de entrada 2 s antes con icono pulsante en el borde del carril; nunca se detiene en rojo |
| Patinete eléctrico | Conductor diminuto de pie, patinete `#A78BFA` (único púrpura del mundo) | Figura vertical mínima | 0,5 casilla | Trayectoria errática por bordes y pasos de cebra; al frenarlo, pequeña nube de polvo |
| Camión de reparto | Cabina `#F97316`, caja gris `#E2E8F0` con carga visible | Cabina + caja | 2 casillas | Muy lento; si colisiona, esparce cajas/barriles que bloquean un carril 10 s (obstáculo naranja con borde) |

**Regla dura:** las fotos/arte de fichas no aplican aquí, pero el principio es el mismo que en la web: el vehículo dibujado es el vehículo que se juega. Nada de taxis genéricos recoloreados: cada tipo tiene su propio sprite, su propia silueta y su propio color, siempre.

---

## 3. Semáforos — la mecánica es el arte

- **Modelo único:** poste gris oscuro con visera, tres lentes verticales. **Solo una lente encendida a la vez** (en el mockup original se veían rojo y verde a la vez en la misma carcasa: artefacto corregido en la v2; en el juego es un estado imposible y rompería la lectura).
- **Luz diegética:** cada semáforo proyecta un **charco de luz** (verde `#22C55E` o rojo `#EF4444`, con caída suave) sobre su línea de detención. El jugador lee el estado sin mirar el poste: el color está en el suelo, donde está mirando.
- **Tacto:** al tocar, el semáforo hace un clic mecánico visible (la carcasa se hunde 2 px y rebota) + la lente cambia con un destello de 80 ms. El área táctil es el poste completo + 12 px de margen (mínimo 44×44 pt).
- **Amarillo de transición:** 0,4 s de ámbar al cambiar de verde a rojo (nunca de rojo a verde). El ámbar es el único momento en que un semáforo es amarillo: no se confunde con el taxi porque el taxi es un objeto y el ámbar es luz.

---

## 4. Anillos de paciencia — el arte ES la mecánica

El anillo es la innovación visual del juego: **la tensión no está en un número, está flotando sobre el coche**.

- **Forma:** anillo fino y luminoso que flota sobre el techo del vehículo parado en rojo (en vista 3/4 se ve como un halo elíptico sobre el coche). Se vacía en sentido horario durante los 8 s.
- **Color por fase:** 8–3 s ámbar `#F59E0B` → 3–0 s rojo `#EF4444` pulsante (pulso 2 Hz) → 0 s: el conductor pierde la paciencia (bocinazo, ¡! sobre el techo, el coche arranca por su cuenta).
- **Sin números grandes:** el anillo NO lleva el porcentaje en grande ni segundos escritos. La micro-etiqueta del % (11 px, 60 % de opacidad, sobre el anillo, como en la preview) se mantiene como señal secundaria para el jugador nuevo: el anillo es la señal primaria (cuánto queda + color + pulso) y el % solo confirma. En la v2 se eliminó del todo por duplicar la señal; la revisión contra la preview (guía visual obligatoria) lo devolvió como micro-etiqueta en la v3: la preview manda en esto, y el anillo sigue mandando sobre el número.
- **Doble codificación:** el anillo se complementa con el comportamiento del coche: a < 3 s el coche tiembla levemente y el conductor (miniatura visible por la ventanilla) gesticula. Si el jugador no ve el anillo, ve el temblor.
- **Prioridad visual:** el anillo crítico (rojo, < 3 s) es el elemento más brillante de la escena después de la ambulancia. Nada decorativo puede brillar más que un anillo en rojo.
- **En el menú:** los anillos no aparecen (no hay tensión en el menú); en la partida aparecen solo sobre coches parados en rojo.

---

## 5. Efectos — el espectáculo

### 5.1. Choque en cadena a cámara lenta (el momento visual del juego)
1. **Impacto:** destello blanco cálido de 120 ms + onda de choque circular en el asfalto.
2. **Cámara lenta (0,25×, 1,2 s):** los coches implicados salen despedidos con física elástica cómica (rebotes, giro de 360° del más ligero), piezas volando (un parachoques, una rueda, el letrero TAXI) con trayectorias en arco y sombra proyectada.
3. **Fondo:** desaturación parcial del resto de la escena (−40% saturación) para que el choque sea el único foco; el resto del tráfico se congela en silueta.
4. **Sonido visual:** bocinazos como «¡BEEP!» en bocadillo de cómic (único texto de efecto permitido, en inglés, tipografía del título) + estrellas amarillas girando sobre los coches implicados.
5. **Salida:** vuelta a velocidad normal con un «pop» y el contador de incidentes. El error tiene que ser tan divertido de ver que el jugador quiera provocarlo una vez — y luego evitarlo siempre.
6. **El fallo es el gancho (demanda, PR #30 §2.3 ancla 1):** el choque no es un castigo, es el anuncio. Por eso el choque es la portada y el primer fotograma (§14): el espectador ve a alguien cometer el error obvio (dejar el anillo a cero) y siente la necesidad intensa de corregirlo. En el juego, el fallo se ve, se oye y se ríe; nunca es una pantalla gris de «has perdido». La derrota por choque y la derrota por colapso (gridlock, sin choque) tienen visuales distintos: el colapso no reutiliza el efecto de destrucción (sería leer un golpe que no existió) — ver §5.5.

### 5.2. Confeti de puntos (recompensa)
- Al completar la cuota de un nivel: lluvia de puntos de colores (círculos de 6 px, colores de la paleta de vehículos) desde la parte superior, 1,5 s, con rebote en el asfalto. Nada de confeti rectangular ni serpentinas: puntos, como los coches vistos desde arriba.

### 5.3. BOOST 2x y swipe
- **BOOST:** al activarse, estelas de velocidad (líneas blancas horizontales) detrás de cada coche en movimiento + viñeta de velocidad leve en los bordes + el botón pasa a azul brillante con rayo. Dura lo que dure el boost; al acabar, un «pop» y vuelta a la normalidad.
- **Swipe (acelerón):** el coche recibe un empujón visible (inclinación hacia adelante + nubecilla en las ruedas traseras + estela corta). El gesto deja una estela táctil de 150 ms en el punto del swipe.

### 5.4. Entrada de ambulancia
- 2 s antes: icono pulsante (cruz blanca sobre fondo rojo) en el borde exacto del carril + flecha de dirección + el carril se ilumina levemente. Al entrar: estrobo rojo/azul que tiñe el asfalto a su paso.

### 5.5. Satisfacción visual y grande — la ambulancia vale doble (demanda, PR #30 §6)
- **Un número no basta.** Cada acción con recompensa tiene un evento físico en el mundo, no solo un contador que sube: al cruzar una ambulancia (doble puntos), estallido dorado radial sobre la ambulancia + «+2x» grande en tipografía del título que sube y se desvanece + destello del estrobo a toda la calle + confeti de puntos dorados. Es el momento más grande de la partida después del choque.
- **El momento para el Short:** la ambulancia a doble puntos es el clip que se graba (demanda §6): 3 segundos, sin texto explicativo — se ve el estrobo, se ve el «+2x» dorado, se entiende sin leer. El Short se graba de este momento o del choque, nunca del menú.
- **Casi-fallo (near-miss):** un taxi que cruza con el anillo a < 1 s recibe un «pop» pequeño y una estrella fugaz, visiblemente más débil que la recompensa real: enseña que estuvo cerca sin mentir sobre el premio.
- **Derrota por colapso (gridlock) ≠ derrota por choque:** sin destrucción. La calle se congela en azul frío, los coches se quedan parados con el anillo en rojo fijo, y aparece «GRIDLOCK!» con el motivo («la cola llegó al borde»). Dos causas de derrota, dos visuales: nunca se reutiliza el efecto de destrucción para una derrota sin impacto.

---

## 6. HUD y menús

### 6.1. Estructura (vertical 390×844, referencia de diseño)
- **Zona superior (HUD fijo):** píldora SCORE (amarilla, estrella + número tabular) a la izquierda, píldora LEVEL «RUSH HOUR 3» (púrpura, icono coche) a la derecha. Debajo, banner «TAP THE LIGHT!» (naranja, mano señalando) solo en los 3 primeros segundos del nivel 1 y al reaparecer tras una pausa — no es permanente: en niveles 2+ aparece solo 1,5 s al empezar.
- **Temporizador del nivel:** centrado bajo el banner, icono de cronómetro + «MM:SS» tabular (p. ej. 00:28). Es el readout persistente del estado no-posicional del nivel (sin él, nadie puede leer cuánto queda: `gating-intent-legibility` lo exige como readout permanente). En rojo pulsante en los últimos 10 s.
- **Zona inferior (barra crema):** botón BOOST 2x (azul, rayo) a la izquierda, PAUSE (gris, sin numerales) a la derecha. Ambos ≥ 56 px de alto, en la zona de alcance del pulgar.
- **Meta visible en el menú (demanda §6.2.2):** tira de barrios bajo el título — chip «TIMES SQUARE ★» (desbloqueado, dorado) + «BROOKLYN BRIDGE 🔒» + «CENTRAL PARK 🔒» (bloqueados, gris). La meta se ve desde el día 1: sin meta no hay D30. La tira vive en el menú y en la pantalla LEVELS; nunca tapa la calzada.
- **Reto diario (demanda §6.2.3):** píldora «DAILY RUSH HOUR» en el menú (con icono de calendario y recompensa) + recompensa de login. El reto es una variante del nivel (p. ej. hora punta con más ambulancias); su arte es el mismo Times Square con un marco dorado en el chip del día.
- **Centro libre:** el cruce ocupa el 70% central de la pantalla. Ningún panel del HUD cubre jamás la calzada jugable.
- **Área segura:** HUD inset 12 px laterales y 20 px superior (notch) / 16 px inferior (barra de gestos). El arte decorativo puede sangrar hasta el borde; ningún texto ni botón sale del área segura.

### 6.2. Tipografía (inglés primero)
- **Display / título:** Fredoka Bold (OFL, Google Fonts) — redondeada, geométrica, con el mismo ADN que las píldoras. Solo se adopta el peso Bold (600/700). Título «TRAFFIC CHAOS» blanco con contorno marrón `#78350F` de 6 px y sombra inferior.
- **UI / números:** Nunito ExtraBold (OFL) para etiquetas; **números tabulares** (ancho fijo) para SCORE, timer y contadores, para que el 1250 no baile al cambiar a 1260.
- **Tamaños (a 390 px):** título 44–48 px · números de píldora 30–34 px · etiquetas de píldora 15–16 px · botones 20–22 px · texto de efecto («¡BEEP!») 24 px. Nada de texto de juego por debajo de 15 px.
- **Texto sobre movimiento:** todo texto lleva contorno o banda de contraste (nunca texto blanco directo sobre el asfalto). Los textos de efecto usan contorno oscuro + sombra.
- **Licencias:** Fredoka y Nunito son OFL; al adoptarlas, empaquetar solo los pesos usados en `assets/fonts/` con sus textos de licencia en `licenses/fonts/` (paso de fabricación, no de este documento).

### 6.3. Menús (flujo en pila: título → niveles → partida → pausa → victoria/derrota)
- **Menú principal:** la ciudad viva detrás del título — y la ciudad viva es **el choque a cámara lenta** (§14), no el tráfico en calma. Título + tira de barrios + PLAY (naranja, foco inicial) + LEVELS + HOW TO PLAY. El foco inicial siempre es PLAY.
- **Sesión (demanda §6.2.4):** 3–8 minutos por sesión (rango hybrid-casual): niveles de 45–60 s, 4–6 niveles por sesión, reintento en un toque. Una sesión de 10+ minutos es oro para los anuncios; una de 30 segundos es una visita. El primer anuncio intersticial no va nunca en la primera sesión.
- **Pausa:** panel crema centrado con RESUME / RESTART / QUIT; el juego queda congelado detrás (sin movimiento). El botón de pausa no congela el menú: la animación del panel usa tiempo no escalado.
- **Victoria:** confeti de puntos + «LEVEL CLEAR!» + estrellas (1–3 según choques) + NEXT. **Derrota:** «GRIDLOCK!» + motivo (choque / cola hasta el borde) + RETRY (foco inicial).
- **Textos del juego en inglés primero** (PLAY, TAP THE LIGHT!, BOOST, PAUSE, LEVEL CLEAR!, GRIDLOCK!, RESUME, RETRY); español segundo en la localización.

---

## 7. Pantallas clave entregadas

| Pantalla | Archivo | Tamaño | Nota |
|---|---|---|---|
| Menú principal (portada = choque) | `traffic-chaos-menu-390x844.webp` | 1072×2320 (ratio 0,462 = 390/844 exacto) | **v2** — el choque en cadena a cámara lenta detrás del título: taxi volando con la rueda suelta, autobús MTA arrugado, ambulancia FDNY, anillo rojo vacío a cero, bocadillo «BEEP!», estrellas. Tira de barrios (TIMES SQUARE ★ / BROOKLYN BRIDGE 🔒 / CENTRAL PARK 🔒) sobre PLAY. Es el primer fotograma (§14). |
| Partida en marcha | `traffic-chaos-gameplay-390x844.webp` | 1184×2096 (ratio 0,565 ≈ 9:16; recortar/escalar a 390×844 en motor con márgenes de área segura) | **v3** — fiel a la preview exacta: SCORE 1250, LEVEL RUSH HOUR 3, TAP THE LIGHT!, temporizador 00:28, anillos con micro-etiqueta %, taxis, MTA, FDNY, neones. Sin dedo (el dedo es overlay de FTUE, no del frame base). |

**Iteración v1 → v2 → v3 (partida):** la v1 era fiel al mockup pero no ganaba al mejor: asfalto seco y mate, semáforos con rojo y verde encendidos a la vez (estado imposible). La v2 añadió asfalto mojado con reflejos de neón y un solo piloto por semáforo, y eliminó el % del anillo. La v3 se reconcilió con la **preview exacta** (guía visual obligatoria): volvió el temporizador 00:28 (faltaba en el doc), volvió el % como micro-etiqueta secundaria sobre el anillo (la preview manda; el anillo sigue siendo la señal primaria), y se quitó el dedo del frame base (el dedo es la mano del force-gate de FTUE, `tutorial-for-game`, no parte de la partida). **Artefacto residual honesto en la v3:** el generador no consigue mantener «un solo piloto encendido» en las cuatro carcasas a la vez — en la v3 las dos superiores están bien (verde solo) y las dos inferiores muestran rojo+verde. Se intentó una v3b que invirtió el problema (arregló las inferiores y rompió las superiores); no se entrega. En el motor esto es imposible por construcción: un sprite por estado (verde / ámbar / rojo), nunca dos lentes encendidas. La regla del §3 manda sobre la imagen.

**Iteración v1 → v2 (menú):** la v1 mostraba el tráfico fluyendo en calma detrás del título. La demanda (PR #30 §6) la corrigió: **la portada es el choque**, no la ciudad vacía. La v2 mantiene título, botones y composición de la v1 y cambia la escena viva por el choque a cámara lenta con el anillo a cero, y añade la tira de barrios. La v1 no se conserva.

**Corrección documentada frente a la preview:** la preview exacta muestra el tráfico fluyendo con «TAP THE LIGHT!» pero **no muestra el choque como primer fotograma**. Esta dirección lo corrige: el primer fotograma (menú/portada) es el choque (§14) y la partida en marcha sigue a la preview. La guía de previews permite cambiar una preview solo cuando el juego lo demande y Daniel diga cuál cambiar: el cambio lo demanda el informe de demanda (PR #30, evidencia pública de conversión) y **queda pendiente de confirmación expresa de Daniel en la revisión de enganche visual** — si Daniel prefiere la portada en calma, se revierte la v2 a la v1 sin tocar la partida.

**Lo que falta (no es de este paso):** sprite sheet de vehículos por tipo y estado, tiles de asfalto/acera, iconos de aviso de ambulancia, pantalla de victoria/derrota y de pausa, pantalla LEVELS con la tira de barrios completa, píldora de reto diario (ver §10, manifiesto).

---

## 8. Por qué ganamos a cada top — comparativa visual

Investigación 15/11/2026 (listados y reseñas públicas). El género tiene tres familias: (a) el minimalista de prestigio, (b) el controlador de semáforos directo, (c) los puzles de atasco planos. Nuestro Times Square gana a cada uno **en algo distinto**; la tabla es el argumento, no el eslogan.

| Rival (qué es) | Su arte (verificado) | Su punto débil visual | Nuestro Times Square es superior en… | Por qué (concreto) |
|---|---|---|---|---|
| **Mini Motorways** — Dinosaur Polo Club, Metacritic 87, el referente de prestigio del género | Minimalista pastel, mapas limpios, coches = puntitos de colores, sin personajes ni lugar reconocible; «a pleasure to look at» pero «taken the abstraction too far» (crítica recurrente: repetitivo, frío) | Belleza sin drama ni identidad: un coche es un punto; no hay noche, no hay ciudad, no hay espectáculo | **Volumen, lugar y drama** | Nuestros coches son personajes 2.5D con sombra y volumen; Times Square es un lugar real que cualquiera reconoce en 1 s; el choque a cámara lenta es un momento que Mini Motorways no tiene ni busca |
| **Intersection Controller** (ShadowTree, 5M+ descargas) — el rival DIRECTO: mismo verbo (tocar semáforos, evitar choques) | Mapas de fotos aéreas reales, vista cenital plana, vehículos pequeños realistas, UI con botones pequeños; usuarios: «Graphics: Ok», «hard to pick the right buttons» | Realismo plano sin dirección de arte: la foto aérea no tiene jerarquía visual; los botones son difíciles de tocar justo cuando importa | **Legibilidad y tacto** | Semáforos grandes con charco de luz en el suelo (el estado se lee sin mirar el poste); anillos de paciencia sobre el coche (la urgencia se ve, no se lee en un medidor); área táctil 44 pt; diorama con jerarquía (centro limpio, periferia viva) |
| **Traffic Escape! / Jam Escape** (FOMO Games, 10M+) — puzle de atasco | Caricatura plana, coches azul claro idénticos con flechas blancas, un coche amarillo en el centro, sin personas, sin ciudad, sin noche | Todos los coches son el mismo dibujo: no hay identidad por vehículo, no hay tensión en tiempo real (es por turnos) | **Identidad por vehículo y tiempo real** | Cada vehículo tiene color y silueta constantes y propias (taxi/MTA/FDNY/patinete/camión); la tensión es el anillo de 8 s en tiempo real, no una flecha estática |
| **Traffic Puzzle: Car Jam Escape** (Huuuge, 10M+) — misma familia de puzle plano | Misma gramática plana y colorida de atasco por deslizamiento | Idéntico: intercambiable con el anterior en una captura | **Noche, neón y espectáculo** | Asfalto mojado con reflejos, neón rosa/cian, estrobos de ambulancia, confeti de puntos: una captura nuestra se reconoce; una suya, no |
| **State Connect: Traffic Control** (Azur, 10M+) — planificación de autopistas | Mapa esquemático, planificación, no arcade | No compite en arcade: sin inmediatez, sin personajes, sin momento | **Inmediatez arcade** | Niveles de 45–60 s, un toque = un cambio, BOOST 2x: el arte vende velocidad, no planificación |

**Veredicto de enganche visual (test del primer fotograma):** en un scroll de YouTube Jugables, Mini Motorways se ve «bonito y tranquilo», Intersection Controller se ve «un mapa», y los puzles de atasco se ven «otro juego de coches azules». Nuestro fotograma se ve **«Times Square de noche con un taxi a punto de explotar de impaciencia»**: lugar + personaje + peligro en 1 segundo. Esa es la ventaja. La revisión de enganche visual deberá comprobar exactamente eso: ¿se entienden protagonista, peligro y recompensa sin leer nada?

**Límites honestos de la comparativa:** Mini Motorways sigue siendo superior en elegancia minimalista y en coherencia de paleta por ciudad; no intentamos copiarlo (nuestra apuesta es la opuesta: riqueza, no vacío). Intersection Controller sigue siendo superior en variedad de mapas (60 + 150.000 de usuarios); nuestra respuesta es la progresión por capítulos de Nueva York, no el editor.

---

## 9. Auditoría de legibilidad de las pantallas (auto-auditoría)

Método: `auditing-game-screen-readability` aplicado a las dos pantallas clave. **Etiqueta honesta: self-audit** (no hubo lector aislado disponible en este paso; la revisión de enganche visual pendiente hace de lector externo). Momentos auditados: menú, partida en flujo, partida con anillo crítico, entrada de ambulancia, coincidencia anillo crítico + aviso de ambulancia, BOOST activo, choque (especificado, sin captura de motor aún).

| # | Elemento / momento | Check | Resultado | Reparación |
|---|---|---|---|---|
| 1 | Píldora SCORE sobre edificios | Contraste / oclusión | OK — amarillo + contorno oscuro, nunca sobre la calzada | — |
| 2 | Banner TAP THE LIGHT! sobre la calle | Oclusión | RIESGO — tapa 2 taxis en v1 | En motor: banner solo 3 s (nivel 1) / 1,5 s (resto); en la imagen clave se mantiene por ser arte promocional, no frame de juego |
| 3 | Anillo con «60%» (v1) | Etiqueta que duplica la señal | CORREGIDO EN v3 — el % grande dentro del anillo se redujo a micro-etiqueta (11 px, 60 % opacidad) sobre el anillo, como en la preview: la señal primaria sigue siendo el anillo (fill + color + pulso) y el % solo confirma para el jugador nuevo | Revisado en §4 y §7 |
| 4 | Semáforo rojo+verde a la vez (v1) | Estado imposible / legibilidad | PARCIAL en v3 — las carcasas superiores ya muestran un solo piloto; las inferiores aún muestran rojo+verde (límite del generador, intento v3b documentado en §7) | En motor: un sprite por estado; imposible por construcción. La imagen es referencia, no build |
| 5 | Anillo rojo < 3 s sobre asfalto mojado | Contraste (faint) | OK en v2 — el rojo `#EF4444` sobre asfalto `#0F172A` + pulso; además el coche tiembla (doble codificación) | — |
| 6 | Aviso de ambulancia + anillo crítico en el mismo frame | Coincidencia | PENDIENTE DE MOTOR — el aviso vive en el borde del carril, el anillo sobre el coche: no se solapan por diseño, pero hay que capturarlo | Captura obligatoria en la primera build jugable |
| 7 | BOOST 2x / PAUSE | Tamaño mínimo / alcance del pulgar | OK — ≥ 56 px, en barra inferior, separados | — |
| 8 | Texto del título sobre neón | Contraste | OK — contorno marrón 6 px + sombra; el neón queda detrás, no debajo del texto | — |
| 9 | Peatones en aceras | Distracción | OK — periferia, escala pequeña, nunca sobre calzada | — |

**Regla de reparación aplicada (en orden):** eliminar (el % del anillo) → mover (el banner, a temporal) → fortalecer (pulso del anillo crítico) → conectar (charco de luz del semáforo con su estado) → etiquetar (solo como último recurso).

---

## 10. Manifiesto de assets (para fabricación)

Método: `create-game-assets` + `sprite-gen`. La familia se genera **desde la semilla aprobada** (las dos pantallas de §7): mismo prompt-base, misma paleta, misma luz; nunca prompts sueltos por asset. El texto en imágenes generadas sale mal: todo texto va en código (tipografía §6.2), nunca en el sprite.

| Asset | Formato | Tamaño base | Estados | Nota |
|---|---|---|---|---|
| Taxi | WebP + alpha | 96×160 px (1 casilla) | normal, acelerón, choque (giro), impaciente (temblor) | Amarillo `#FACC15` fijo; letrero TAXI en código, no en sprite |
| Turismo | WebP + alpha | 96×160 | normal, choque | 3 pasteles, 1 sprite por color |
| Autobús MTA | WebP + alpha | 96×400 | normal, frenada, atrapado (ventanas ámbar) | Rojo fijo + logo MTA en código |
| Ambulancia FDNY | WebP + alpha | 112×240 | normal, estrobo (2 frames de halo) | Blanco fijo; estrobo como halo en código |
| Patinete | WebP + alpha | 48×96 | normal, frenazo (nube) | Púrpura `#A78BFA` fijo |
| Camión | WebP + alpha | 96×320 | normal, colisión (cajas sueltas) | Caja con carga visible |
| Semáforo | WebP + alpha | 64×160 | verde, ámbar, rojo, apagado | Una sola lente encendida por estado |
| Anillo paciencia | Vector en código (no sprite) | Radio 40 px | ámbar → rojo pulsante | Dibujado por código: fill = tiempo restante |
| Asfalto mojado | Tile WebP | 256×256, sin costuras | base + reflejo (2 capas) | Probar repetición 3×3 antes de aprobar |
| Acera / edificios | WebP | 256×256 | día no existe: solo noche | Periferia; nunca sobre calzada |
| Iconos HUD | Vector en código | — | score, level, boost, pausa | SVG/vector, no raster |
| Confeti punto | Vector en código | 6 px | — | Círculos de la paleta de vehículos |

**Presupuesto:** texturas en múltiplos de 4; sprites ≤ 512 px en su lado mayor; atlas único por familia de vehículos; peso total de arte en el primer fotograma < 1,5 MB (Playgama/YouTube Jugables, carga rápida). **Procedencia:** pantallas clave generadas por IA (herramienta de generación de Muse) a partir del mockup aprobado de Daniel; sprites de fabricación con la misma procedencia; registrar `source.kind = ai-generated` en el manifiesto de la build (divulgación de IA donde la plataforma la pida).

**Bloque de prompt (familia):** `ROLE: production asset for Traffic Chaos NY Rush · SUBJECT: [vehículo] toy-diorama · VIEW: high three-quarter top-down, fixed 45° shadow · ART DIRECTION: rounded clay shapes, slate asphalt, saturated vehicle color [hex], neon night · GAME-SCALE READ: silhouette readable at [WxH] · TECHNICAL: [size], transparent background · LOCKS: palette, proportions, light direction · EXCLUDE: text, labels, background, cropped edges, signatures`.

---

## 11. Skills usadas — registro (orden de Daniel 15/11 19:10)

| Parte de esta dirección | Skill | Qué aportó (método aplicado) |
|---|---|---|
| Identidad visual, mood por estado, paleta con roles, §§1 y 10 | `art-bible` | Estructura de biblia de arte (identidad → mood → forma → color → personajes → entorno → UI → estándares → referencias); cada principio con su test de diseño |
| Legibilidad como requisito, colores de señal, jerarquía | `art-direction-and-readability` | «Readability first, personality second, fidelity never»: un elemento visual debe nombrar la pregunta de juego que responde; colores de señal con un solo significado y respaldo no-cromático |
| Manifiesto, familia desde semilla aprobada, QA, procedencia | `create-game-assets` | Flujo inspeccionar → fijar marco técnico → manifestar → aprobar objetivo → producir en familia → normalizar → validar en contexto → registrar procedencia; bloque de prompt ROLE/SUBJECT/VIEW/…/LOCKS/EXCLUDE |
| Frase visual, protagonista/peligro/recompensa, test del primer fotograma | `directing-game-visuals` | El estado se comunica sin texto de HUD; centro legible, periferia con ruido; paleta de 3–5 colores con rol explícito |
| Generación de las pantallas clave, edición v1→v2→v3, disciplina de semilla | `sprite-gen` | Generar desde la semilla aprobada (mockup/preview), editar con lo que cambia y lo que queda fijo, sin derivar de la última salida; la edición v3 se hizo desde la preview, no desde cero. Ruta en este entorno: la herramienta de imagen propia (sprite-forge por API no tiene keys; ver §13) |
| Auditoría de las dos pantallas, momentos y coincidencias | `auditing-game-screen-readability` | Momentos (no pantallas), 6 checks (solape, oclusión, fuera de pantalla, pequeño, tenue, breve), lector aislado, orden de reparación eliminar→mover→fortalecer→conectar→etiquetar; resultado etiquetado self-audit |
| Layout HUD, áreas seguras, flujo de pantallas, tamaños mínimos | `game-ui-ux` | Anclajes y contenedores, una sola política de escalado (referencia 390×844), HUD crítico dentro del área segura, pantallas como pila, HUD por eventos, contraste 4.5:1, nada de color como única señal |
| Tipografía, roles, números tabulares, licencias OFL | `styling-web-game-typography` | Roles Display/UI/Numérico/Énfasis; Fredoka Bold + Nunito ExtraBold (OFL); empaquetar solo los pesos adoptados con sus licencias; texto con contorno sobre fondos con movimiento |
| Arquetipo de UI, banned defaults, color scripting, tipografía de UI | `game-ui-taste` | Arquetipo dominante **Cozy Storybook** (redondeado, cálido, springs) con un rasgo prestado de **Y2K/Frutiger Aero** (brillo de las píldoras). Scan de banned defaults: sin gris de motor (píldoras caramelo, no paneles grises), sin degradado púrpura (la píldora LEVEL es púrpura plano semántico, no degradado + cristal), glow reservado a peligro (anillo) y emergencia (estrobo), sin HUD-pegatina (charcos de luz responden al mundo), two-font-law (Fredoka display + Nunito trabajo), one-accent-one-job (naranja = acción; rojo = peligro y nada más), paleta extraída del arte (los colores de UI son los de los vehículos y el neón). Test de captura: el juego se reconoce por un recorte de su HUD sin logo |
| Finish gate a 390 px, tap-size, cada visual dibuja | `taste-skill` | Skill de web adaptada: de ella solo se transfiere el método de verificación (checks a tamaño real 390 px, tap ≥ 44 px, nada de violeta como color decorativo de página — la píldora LEVEL púrpura es color semántico de juego, no decoración web). Su hook `Stop` es de Claude Code y se ignora; gate manual en §9 |
| HUD por pilares de Hodent, FTUE <60 s, feedback, accesibilidad | `game-ui-ux-pro-max` | 7 pilares de usabilidad auditados en §6 y §9 (señales, claridad, forma-sigue-función, consistencia, mínima carga, prevención de errores, flexibilidad); `touch-target-games` ≥ 48 dp; `input-latency-100ms`; `glanceability` (< 0,5 s por mirada); `juice-hierarchy`; `photosensitivity` (estrobo ≤ 3 Hz o modo de reducción de destellos); `time-to-gameplay` < 60 s; test de grises y test del caos |
| Masters por vehículo, un clip por acción, finish HD, QA numérica | `generate2dsprite` | Un master still aprobado por vehículo (taxi, turismo, MTA, FDNY, patinete, camión); finish HD por defecto; sheets solo para FX/iconos/props; aceptación a tamaño de juego; procedencia registrada. Ruta adaptada: sin API keys, la herramienta de imagen propia es la ruta (`generate2dmedia` sin ruta: ver §13) |
| Mapa como datos: tilemap, colisión, luces, recortes | `generate2dmap` | Times Square como `map_bundle` (carriles, líneas de detención, pasos de cebra, spawns, salidas) con validación de alcanzabilidad; capa de luces (reflejos de neón, charcos de luz); `conform_background validate-crops` para 390×844 vs 9:16; props de acera como prop-pack |
| Vocabulario de feedback por evento, sin tocar la simulación | `maximizing-game-feel` | Registro playful (squash, overshoot); vocabulario por evento (peligro / recompensa / cambio de estado / near-miss / causa de fallo); el colapso no reutiliza el efecto de choque; la presentación no corrompe la colisión; validación en juego (§5.5) |
| Gate de legibilidad de intención (clave retenida) | `gating-intent-legibility` | Clave congelada en §0 (objetivo: evacuar la cuota sin choques; opciones: tocar semáforo / swipe / BOOST; riesgo: anillo a cero → choque; recompensa: ambulancia doble). El gate corre en la primera build (necesita frames reales C1–C3); este documento no es un veredicto, es la clave preparada |
| FTUE por capas, force-gate, coaching que se apaga | `tutorial-for-game` | Welcome (banner TAP THE LIGHT!), force play-gate (mano en PLAY), hand-holding en la primera sesión (dedo en el semáforo = coach-mark, no parte del frame base), tutoriales contextuales (primera ambulancia → aviso), depth coaching que se apaga (brillo en el semáforo óptimo cuando un anillo está en crítico, solo en los primeros niveles) |
| Luz de noche: 3 puntos, HDRI, reflejos | `blender-lighting-lookdev` | Conocimiento aplicado, scripts no (Blender no instalado): luz clave cálida de neón + relleno frío de noche + rim de farolas; reflejos moldeados en el asfalto mojado (no iluminación plana); cámara 3/4 a 10–25° de elevación, como en la preview |
| Lenguaje de movimiento: easing, springs, press states | `emil-design-eng` | Tokens de movimiento: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`; press `scale(0.97)` en 100–160 ms; nunca `ease-in` en UI; springs solo en lo juguetón (rebote del taxi, entrada del menú con stagger 30–80 ms); solo transform/opacity (compositor); `prefers-reduced-motion` reduce el movimiento sin quitar la información |
| Sensación nativa en el móvil | `mobile-native` | Safe areas, notch, 100dvh, sin delay de tap de 300 ms, controles que se sienten instalados y no «web en un navegador» |

**Selección heredada de las previews:** esta dirección usa la misma base común que la guía visual de previews (`guia-visual-previews-2026-11-15.md`): `directing-game-visuals` + `art-bible`, `game-ui-taste`, `taste-skill`, `game-ui-ux-pro-max`, `auditing-game-screen-readability`, `styling-web-game-typography`, `mobile-native`, `emil-design-eng`. **Ampliada para producción** con el resto de §13 (sprites, mapa, feel, FTUE, gates, plataforma): las previews excluyeron a propósito la producción (no son capturas de producción); esta dirección la añade sin cambiar la base.

**Hueco detectado (no bloquea):** las 8 skills originales están como `SKILL.md` pero sin sus ficheros de referencia (GUIDE.md, CHECKLIST.md, check-screen-frames.mjs, etc.); los métodos se aplicaron desde el cuerpo de cada `SKILL.md`. La auditoría mecánica queda para la primera build jugable.

---

## 12. Reglas duras para fabricación

1. **Fidelidad al mockup aprobado:** la composición de §7 es la referencia. Cambiar luz y reflejos sí; cambiar layout, vehículos o HUD no, sin volver a Daniel.
2. **Inglés primero** en todos los textos del juego; español segundo.
3. **El arte es la mecánica:** si un estado del juego solo se entiende leyendo un número, el arte ha fallado. Volver a §4.
4. **Un color, un significado** (§1.4). Nada de verde decorativo ni de rojo ambiguo.
5. **Centro limpio:** ningún peatón, textura ni panel sobre la calzada jugable.
6. **Comparar lado a lado con Metro** antes de enseñar nada a Daniel (regla del estudio): la captura de partida debe aguantar la comparación con la mejor pantalla de Metro Nightmare.
7. **Nada se publica sin la prueba de Daniel** (puerta 15/11 11:17): esta dirección es arte, no es el juego. La fabricación (pasos 4–10) es otro encargo.
8. **Primer fotograma = choque** (§14): la portada enseña el fallo gracioso con el anillo a cero, no la ciudad vacía. Sin texto en el onboarding: la primera pantalla ya es el juego.
9. **Meta visible desde el día 1:** la tira de barrios está en el menú siempre; sin meta no hay D30.
10. **Reto diario + recompensa de login** en el juego desde el primer día; sesión 3–8 min, niveles 45–60 s, reintento en un toque.
11. **El Short se graba del choque o de la ambulancia doble**, nunca del menú.

---

*Fin del documento. Siguiente paso: revisión de enganche visual (lector externo) sobre las dos pantallas de §7; después, fabricación con el manifiesto de §10.*

---

## 13. Revisión de las 147 skills (norma obligatoria de Daniel, 15/11 19:16)

**Método:** revisadas una a una a través del informe `comunicacion-ias/informe-skills-calidad-2026-11-15.md` (PR #27, rama `niky/skills-movil-1511`: §2 por pilar + §3 núcleo de la plantilla) y la lista verificada del kit (`find … -name SKILL.md | wc -l` → **147**: arte 66, competencia 13, pro 57, marketing 11 — el informe dice arte 54 porque no cuenta la subcarpeta `threejs-skills`, 13; el recuento verificado es 66). **SKILL.md leído entero (★):** las 8 originales (art-bible, art-direction-and-readability, create-game-assets, directing-game-visuals, sprite-gen, auditing-game-screen-readability, game-ui-ux, styling-web-game-typography) + 10 nuevas (game-ui-taste, taste-skill, game-ui-ux-pro-max, generate2dsprite, generate2dmap, maximizing-game-feel, gating-intent-legibility, tutorial-for-game, blender-lighting-lookdev, emil-design-eng). El resto se clasifica por su fila del informe + su descripción. **Veredictos:** USE (selección de producción para Traffic Chaos) · CONSULTED (conocimiento aplicado, herramienta no ejecutable aquí o dirección evaluada y descartada con motivo) · CONDITIONAL (disponible si se cumple una condición) · FUTURE (post-lanzamiento, no de esta dirección) · NO (con motivo).

**Resultado: USE 93 · CONSULTED 8 · CONDITIONAL 3 · FUTURE 8 · NO 35 = 147.**

### 13.1. USE — selección de producción (93)

**skills-arte (38):** `action-feel` (buffers/cancels/hitstop del tap y el swipe) · `animations` (Phaser: squash del taxi, frames del estrobo) · `art-bible` ★ (esta dirección es su salida) · `audio-and-sound` (Phaser: bocinas, sirenas, UI) · `audio-buses` (mezcla música/SFX/ambiente, ducking) · `audio-feel` (evento→sonido: bocinazo al anillo crítico, sirena direccional) · `cameras` (shake, zoom y fundido del choque a cámara lenta) · `choreograph` (entrada del menú, coreografía del choque) · `create-game-assets` ★ (manifiesto y familia) · `emil-design-eng` ★ (tokens de movimiento) · `evaluating-gameplay-balance` (balance por telemetría: paciencia 8 s, spawns) · `filters-and-postfx` (bloom del neón, desaturación del choque) · `find-animation-opportunities` (dónde animar y dónde NO) · `game-feel` (base de feel) · `game-ui-taste` ★ (arquetipo y banned defaults) · `game-ui-ux` ★ (layout y áreas seguras) · `game-ui-ux-pro-max` ★ (pilares de Hodent, FTUE, accesibilidad) · `generate2dmap` ★ (Times Square como mapa con colisión y luces) · `generate2dsprite` ★ (master por vehículo) · `input-keyboard-mouse-touch` (tap, swipe, multitáctil, hit areas) · `loading-assets` (carga, atlases, progress bar) · `mobile-games` (principios móvil) · `mobile-native` ★ (sensación nativa) · `particles` (confeti, chispas, humo) · `performance-optimization` (presupuestos de assets) · `phaser-core` (base del motor) · `playtest-report` (informes de playtest) · `review-animations` (10 estándares, Block/Approve) · `scale-and-responsive` (390×844, FIT/RESIZE) · `sprite-atlas` (packing, pivots) · `sprite-gen` ★ (disciplina de semilla en key art) · `sprites-and-images` (tint/alpha de vehículos) · `taste-skill` ★ (finish gate a 390 px, adaptada) · `tilemaps` (mapa Tiled, colisión) · `tweens` (anillos, UI, stagger) · `ui_ux_pro_max` (datos: 192 paletas y 74 parejas de fuentes — validar paleta y pareja Fredoka/Nunito con `scripts/search.py` en fabricación) · `vfx-generate` (placas VFX: choque, confeti, estrobo) · `video2dsprite` (un clip por acción desde el master).

**skills-competencia (8):** `game-feel-and-juice` (feel momento a momento) · `game-juice` (squash, partículas, shake sin tocar reglas) · `game-polish-audit` (auditoría de pulido) · `game-quality-gates` (gates obligatorios) · `haptic-rumble` (háptica de tap/choque con fallback no háptico) · `juice-audit` (diagnóstico de momentos planos) · `juice-vfx` (VFX de runtime por evento) · `performance-budget` (p50/p95/p99, frame pacing).

**skills-pro (44):** `a11y-controls` (preferencias de accesibilidad en juego) · `accessibility` (Playables: daltonismo, ≥44 px táctil, texto ≥16 px) · `ad-break` (rewarded tras la sesión, nunca en la primera) · `analytics-funnel` (funnels de retención D1/D7/D30, demanda §7) · `arcadifying-mini-games` (estructura arcade: rondas, ceremonias, economía de puntos, attract = menú con el choque) · `art-direction-and-readability` ★ (legibilidad) · `asset-audit` (auditoría read-only de assets, disciplina NOT ASSESSED) · `asset-pipeline` (miniatura 1:1, zona segura 12 %, vídeo 16:9) · `attack-tell` (aviso de ambulancia por canales redundantes) · `auditing-game-screen-readability` ★ (auditoría §9) · `balance-design` (contrato de balance con métricas) · `browser-input` (pointercancel, visibilitychange → auto-pausa) · `camera-systems` (cámara del choque) · `certification-checklist` (gate final, Test Suite oficial) · `core-libraries` (EventBus, Juice, ObjectPool, SaveManager) · `difficulty-and-balancing` (rampa de distritos) · `directing-game-visuals` ★ (frase visual) · `fixing-accessibility` (contraste, foco, reduced-motion) · `game-engagement-ideas` (hipótesis de retención: reto diario, barrios) · `gating-intent-legibility` ★ (gate con clave congelada en §0) · `implementing-gameplay-invariants` («machacar no debe ganar» como test) · `input-systems` (esquema de entrada táctil) · `level-design` (distritos como capítulos) · `localize` (EN primero, ES segundo, tablas de strings) · `maximizing-game-feel` ★ (vocabulario de feedback) · `onboarding-and-teaching` (four-beat: introducir→probar→combinar→girar) · `pacing-and-the-player-journey` (arco de sesión 3–8 min) · `phaser-arcade-physics` (física elástica del choque) · `phaser-scene-scaffolding` (Boot→Preloader→MainMenu→Game→GameOver) · `physics-tuning` (ajuste de rebotes) · `playables-sdk-integration` (SDK YouTube Playables) · `playgama-bridge` (Bridge SDK) · `playgama-metrics-snapshot` (telemetría Playgama) · `playgama-publish` (publicación) · `probing-web-game-mechanics` (mecánicas contra spec en navegador) · `prototype-fast` (prototipo desechable de UNA pregunta: ¿el choque se lee en 3 s?) · `refining-game-prototypes` (bucle estructura→dificultad→presentación→limpieza) · `responsive-design` (9:16 a 21:9) · `save-systems` (barrios y reto diario persistentes) · `smoke-testing-web-games` (humo en navegador headless) · `stress-testing-game-concepts` (concepto ya aprobado por Daniel 19:08; auditoría adversarial registrada) · `styling-web-game-typography` ★ (tipografía) · `tutorial-for-game` ★ (FTUE por capas) · `web-game-performance` (60 fps medido, no adjetivos).

**skills-marketing (3):** `hook-writer` (gancho del Short: choque / ambulancia doble) · `playgama-game-video` (Short/promo en el look del juego, del momento de fallo o satisfacción) · `thumbnail-design` (portada = choque, legible a pequeño tamaño).

### 13.2. CONSULTED — conocimiento aplicado, herramienta no ejecutable o dirección evaluada (8)

| Skill | Por qué consultada y no usada como herramienta |
|---|---|
| `blender-core` | Base Blender 5.2+: **Blender no está instalado en este entorno** (verificado en el informe). El conocimiento sirve; los scripts `bpy` no corren aquí |
| `blender-game-optimization` | Presupuestos (móvil 5–15k tris héroe, LODs, draw calls) informan los presupuestos 2D del §10 por analogía; sin Blender no se ejecuta |
| `blender-lighting-lookdev` ★ | Receta de luz aplicada al §1.2 (clave cálida de neón + relleno frío + rim); el rig es de Blender, la receta es universal |
| `blender-pbr-materials` | Reglas metal/roughness y espacios de color informan el asfalto mojado (qué refleja y qué no); sin Blender no se materializa |
| `blender-rendering` | Presets Cycles/EEVEE y 4K para el key art; sin Blender no se renderiza |
| `blender-stylized-npr` | Toon/cel evaluado y **descartado para este juego**: la dirección aprobada por Daniel es el diorama 2.5D del mockup, no el cómic (el cómic es la dirección de Scribble Striker) |
| `designing-mini-games` | El bucle ya está en el GDD; se usó como check de completitud del loop, no para diseñarlo |
| `game-design-fundamentals` | La disciplina base; se usó como lente en la comparativa §8, no como entrega |

### 13.3. CONDITIONAL (3) y FUTURE (8)

- **CONDITIONAL — GSAP (`gsap-core`, `gsap-timeline`, `gsap-performance`):** solo si los menús usan overlay DOM; en canvas los tweens de Phaser cubren la animación. La librería GSAP es gratuita propietaria de Webflow; las skills son MIT.
- **FUTURE — post-lanzamiento, no de esta dirección:** `ab-testing` (A/B de portada choque vs calma tras publicar) · `instagram-seo`, `social`, `tiktok-growth`, `viral-reverse-engineering`, `virality`, `youtube-shorts`, `youtube-publishing-and-metadata` (distribución del Short y marketing; el momento del Short sí está especificado aquí, §5.5, pero su publicación no es arte).

### 13.4. NO — revisadas y descartadas, con motivo (35)

**skills-arte (22):** `audio-design` (superseded por `audio-feel` + `audio-buses` + `audio-and-sound`, más nuevos y específicos) · `blender-export-pipelines` (sin Blender; juego 2D, sin exportación glTF/FBX) · `blender-texture-baking` (sin Blender; sin bake high→low) · `blender-texturing` (sin Blender; smart materials no aplican a sprites 2D) · `character-rig` (sin personajes esqueléticos; los vehículos no se rigen) · `generate2dmedia` (**sin ruta**: sprite-forge por API exige keys de OpenAI/Gemini/xAI/BytePlus/fal.ai y no hay ninguna configurada; la ruta en este entorno es la herramienta de imagen propia del agente, como dice el informe §2D) · `impeccable` (referencia de diseño web; la UI de juego tiene `game-ui-taste`; su detector anti-slop es de páginas, no de juegos) · `pixel-animation` (finish HD, no pixel art) · `spine-skeletal` (sin rigs Spine; peatones = miniaturas estáticas) · `threejs-*` (13 skills: `threejs-animation`, `threejs-asset-pipeline`, `threejs-fundamentals`, `threejs-geometry`, `threejs-interaction`, `threejs-lighting`, `threejs-loaders`, `threejs-materials`, `threejs-performance`, `threejs-postprocessing`, `threejs-react-three-fiber`, `threejs-shaders`, `threejs-textures`) — **el motor es Phaser 2D, no Three.js**; ni React.

**skills-competencia (2):** `camera-anti-clip` (cámara fija cenital; no hay clipping 3D que evitar) · `review-game` (revisa codebases existentes; aún no hay código que revisar).

**skills-pro (11):** `building-era-authentic-game-audio` (audio procedural retro 1978–1985; nuestra dirección es ciudad real: bocinas, sirenas, ambiente) · `curating-game-concept-portfolio` (el concepto ya está elegido y aprobado por Daniel) · `designing-minimal-game-rules` (alcance declarado: solo juegos por turnos/discretos, NO acción en tiempo real) · `designing-retro-arcade-sound-kits` (kits retro; no es nuestra dirección sonora) · `exploring-game-design-space` (el espacio ya se exploró: 6 ideas aprobadas) · `game-ai` (el tráfico usa máquinas de estados simples; no hacen falta BT/utility/A*) · `game-docs` (el GDD ya existe; este documento es la salida de `art-bible`, no un GDD) · `platformer` (afina saltos con `jump_tuner.py`; aquí no se salta) · `procedural-gen` (los barrios son authored, no procedurales) · `puzzle` (solvers de match-3/Sokoban; no es nuestro género) · `shader-programming` (GLSL a medida; `filters-and-postfx` cubre bloom y desaturación).

**Bloqueadas fuera del kit (no cuentan en las 147, se dejan constancia):** `game-playtest-squad-skill` y `game-audio` (ingenium) **sin LICENSE** — no instaladas (§6 del informe). Mientras, el playtest se cubre con `playtest-report` + `smoke-testing-web-games` y el audio con `audio-and-sound` + `audio-feel` + `audio-buses`. `threejs-3d-generator` (API de Tripo de pago) y `spine-animation-ai` (licencia comercial pendiente) los decide Daniel; no se necesitan para un juego 2D.

**Sin esa revisión no se empieza a construir:** esta §13 es la revisión. La plantilla (§3 del informe) usa su núcleo + este §13 como subconjunto exacto para Traffic Chaos; el resto del kit no se carga.

---

## 14. Demanda del usuario (PR #30) — qué pide el mercado y qué cambia esta dirección

**Fuente:** `comunicacion-ias/demanda-usuario-2026-11-15.md` (rama `origin/niky/demanda-usuario-1511`, PR #30; encargo de Daniel 15/11 19:11: «Hay que investigar bien lo que el usuario demanda y consume»). Solo fuentes públicas con fecha; donde no hay dato público se marca sin datos públicos. Las cifras que siguen son del informe, no mías.

### 14.1. Por qué Traffic Chaos es la apuesta n.º 1 en demanda
- **Simulation es el género n.º 1 de YouTube Playables** por plays (1,4B, 24 %; TubeGames 15/11/2026, 2.367 juegos, 5,91B plays). La física de coches y chocar es la **mecánica n.º 2 que más crece en 2026** (Crazy Flying Car 365K plays/día; Car Crash Sandbox 236K/día; Mediacube, estrenos 1/7–4/9/2026). El top 50 tiene 7 juegos de coches/carreras. Veredicto del informe: **demanda máxima, riesgo bajo**.
- Las 6 mecánicas que crecen son todas de **un dedo, onboarding de 10 segundos, feedback instantáneo y sin tutorial** (Mediacube). Un tutorial de más de 30 s es la mecánica que falla. Por eso el FTUE de este juego es por capas y sin texto (§6.4, `tutorial-for-game`).

### 14.2. Ajustes del informe aplicados a esta dirección (§6 fila 1)
| # | Ajuste del informe | Dónde está en esta dirección |
|---|---|---|
| (a) | **El choque es el primer fotograma y la miniatura:** coches chocando a cámara lenta con el anillo de paciencia a cero | **Menú v2 (§7):** la portada ES el choque (taxi volando, rueda suelta, anillo rojo vacío, «BEEP!»). La partida en marcha sigue a la preview (tráfico fluyendo). Corrección documentada frente a la preview en §7: la preview no muestra el choque como primer fotograma; esta dirección lo corrige. Pendiente de confirmación expresa de Daniel en la revisión de enganche visual |
| (b) | **Meta de tycoon:** desbloquear barrios (Times Square → Brooklyn Bridge → Central Park), patrón de la mecánica n.º 3 (tienda/tycoon, 286K/día) | **Tira de barrios en el menú** (§6.1, §7): TIMES SQUARE ★ / BROOKLYN BRIDGE 🔒 / CENTRAL PARK 🔒, visible desde el día 1. Sin meta no hay D30 (GameAnalytics 2026: D30 mediana 0,68–0,79 %; con meta, objetivo 5–10 %) |
| (c) | **Reto diario «hora punta» con recompensa de login** | **Píldora DAILY RUSH HOUR** en el menú (§6.1) + recompensa de login. Es el mecanismo que lleva del D3 al D7 (GameAnalytics: D7 mediana < 4 %, cuartil superior 7–8 %) |
| (d) | **Las ambulancias que valen doble son el momento para el Short** | **§5.5:** estallido dorado + «+2x» grande + estrobo a toda la calle + confeti. El Short se graba de este momento o del choque, nunca del menú |

### 14.3. Ajustes comunes (§6.2) aplicados
1. **Portada = el verbo en acción**, nunca el escenario vacío ni el logo. El primer fotograma es el momento de satisfacción o de fallo gracioso → menú v2 (choque).
2. **Meta visible desde el día 1** → tira de barrios (§6.1).
3. **Reto diario + recompensa de login en los 6** → píldora DAILY RUSH HOUR (§6.1).
4. **Sesión de 3–8 minutos**, niveles de 30–60 s (aquí 45–60 s por GDD), reintento en un toque. **Sin texto en el onboarding:** la primera pantalla ya es el juego. Primera sesión sin intersticiales (provocan desinstalación antes del enganche; en Playables el pre-roll es automático y no se puede apagar).
5. **El Short se graba del momento de fallo o de satisfacción**, no del menú → §5.5.

### 14.4. Los cuatro anclajes psicológicos (PixelPlot 2026) — cómo los sirve el arte
1. **El estado de fallo (disonancia cognitiva):** el espectador ve el choque que él habría evitado y quiere corregirlo → portada = choque (§14.2a). El fallo gracioso y visible es un gancho, no un castigo.
2. **El bucle de mejora (dopamina):** orden visual satisfactorio → el anillo que se vacía y se salva en el último segundo (near-miss, §5.5), la calle que fluye cuando tocas bien.
3. **La vía de escape:** el jugador ve la salida (el semáforo en verde, el carril libre) y quiere ser él quien la encuentre → charcos de luz y anillos que dicen qué hacer sin leer.
4. **El metajuego:** colección, progreso y recompensas que se ven fuera de la partida → tira de barrios + reto diario.

### 14.5. Listones medidos para cuando se publique (demanda §7, no folclore)
D1 mediana ~22 % (cuartil superior 25–33 %); D7 mediana < 4 % (cuartil 7–8 %); D30 mediana 0,68–0,79 % (con meta, objetivo 5–10 %); sesión media 3,1–3,5 min (cuartil ~5,2 min; 10+ min = oro para anuncios); 3,8–3,9 sesiones/día; primer fotograma → primera acción < 10 s, sin leer texto. **Señal de alarma temprana:** D1 por debajo del 22 % = problema de primera sesión (gancho/onboarding), no de marketing; D1 bueno y D7 por debajo del 4 % = problema de meta. Los objetivos D1 40–50 % / D7 20 % que circulan no tienen respaldo medido (GameGrowthAdvisor 2026) y no se prometen.
