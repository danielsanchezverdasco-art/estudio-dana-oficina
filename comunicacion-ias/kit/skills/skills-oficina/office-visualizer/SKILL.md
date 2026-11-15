# office-visualizer — Torre de oficina en vivo (patrón derivado)

Skill propia de Dana Games, escrita con palabras propias. El patrón que describe se
inspira en el proyecto SMM-Project Office Visualizer (simonhapp-ai), que NO tiene
licencia en su repo y por eso NO se instala ni se copia: aquí solo se recoge la
idea de funcionamiento, reformulada para la Torre Dana Games. Ver SOURCE.md.

## Para qué sirve

Convertir el trabajo real de un equipo en una oficina vertical visible en la web:
cada planta es una habitación con su agente trabajando, su tarea actual y su estado,
y todo se actualiza solo, sin recargar la página. Es el patrón de la Torre Dana
Games: Daniel abre la torre y ve en cada momento qué hace cada agente, qué está
pendiente y qué datos hay nuevos.

## El patrón en 4 piezas

### 1. Una sola fuente de verdad en JSON

Todo el estado de la oficina vive en un único documento JSON con esta forma:

- `departments`: una entrada por planta, con `id`, `name` (p. ej. Dirección),
  `agent` (quién trabaja ahí), `room` (qué habitación es), `status`
  (trabajando / esperando / parado / necesita ayuda), `current_task` (qué hace
  ahora mismo, en una frase), `last_completed` (última entrega terminada y
  cuándo) y `notes` (aviso corto si lo hay).
- `chairman_todo`: la lista de cosas que solo puede decidir el jefe (Daniel).
- `help_needed`: qué plantas piden ayuda y por qué.
- `time_ruler`: la regla de tiempo de la oficina (p. ej. última recogida de datos).
- `phase`: en qué fase está el proyecto.

Regla dura: el JSON solo guarda hechos, nunca cifras inventadas. Cada cifra que
se muestra en la torre tiene que venir de una fuente real (GitHub, YouTube,
Playgama) o del propio JSON con su hora.

### 2. La web lee el JSON cada pocos segundos

La torre es una página estática que pide el JSON cada 8 segundos (con un
segundo intento a los 25 s si el primero falla) y repinta solo lo que ha
cambiado: el estado de cada planta, la tarea actual, los contadores de la
barra inferior y la hora de la última recogida. No recarga la página entera.

Si la fuente no responde, la torre NO se queda en blanco ni inventa nada:
enseña el último dato conocido con su hora ("actualizado hace X minutos").

### 3. Aviso instantáneo al actualizar (push, no solo polling)

Además del repaso cada 8 segundos, cuando alguien actualiza el estado se manda
un aviso corto por un canal de notificaciones (en el proyecto de referencia,
ntfy.sh por SSE) que le dice a la página "hay datos nuevos, vuelve a leer
ahora". Así el cambio aparece al instante, sin esperar al siguiente ciclo.

Actualizar el estado es siempre la misma secuencia: editar el JSON, publicar
el cambio (commit + push) y mandar el aviso. Tres pasos, siempre en ese orden.

### 4. Adaptación Dana Games: GitHub es la fuente en vivo

En la Torre Dana Games la fuente de verdad del trabajo real NO es un JSON
editado a mano, sino la API pública de GitHub: issues abiertas y cerradas,
pull requests, commits y sus horas. La torre lee de GitHub:

- qué hace cada agente ahora (su issue o PR abierta más reciente),
- qué entregó por última vez (su PR fusionada o cerrada más reciente, con fecha),
- qué está pendiente de Daniel (issues con etiqueta de aprobación),
- qué pide ayuda (issues marcadas como ayuda o bloqueo).

El JSON del patrón se usa solo para lo que GitHub no sabe: la "última
recogida" de métricas externas (YouTube, Playgama), las notas del jefe y las
decisiones pendientes de Daniel. Así la torre nunca depende de que alguien se
acuerde de actualizar un fichero a mano: si hay trabajo en GitHub, la torre lo
enseña; si no lo hay, la planta se muestra esperando, que es la verdad.

## Cómo se construye cada planta

1. Una habitación abierta por enfrente (estilo Sims), dibujada con diorama,
   diorama-worlds o isometric-ops.
2. Dentro, el personaje del agente trabajando (claude-animation para el
   movimiento: sentado al ordenador, dibujando, probando un juego), con su
   indicador de estado encima: verde trabajando, amarillo esperando, rojo
   parado (como el plumbob de los Sims).
3. Una burbuja corta con lo que hace ahora: una frase, sacada del JSON o de
   GitHub, con su hora.
4. Tocar la planta abre su detalle: tarea actual, cuándo empezó, última
   entrega, qué falta, y enlaces reales a GitHub.

## Barra inferior y botones

La barra inferior es parte del mismo estado, no un menú fijo:

- Cada botón (Dirigir, Orden, Bandeja, Informes...) lleva un badge con un
  contador sacado del estado real: pendientes de aprobar, cosas que piden
  ayuda, informes nuevos. Si el contador es 0, el badge no se enseña.
- El botón Datos abre el panel de cifras (dashboard-design +
  live-analytics-dashboard): suscriptores, vistas, juegos publicados, meta de
  ingresos, con la fecha de cada cifra.
- "Última recogida" es la hora de la última lectura de datos externos. Si
  lleva más de una hora sin actualizarse, se enseña en ámbar.

## Aprobación desde la oficina

La sección "Pendientes de aprobación" lista lo que espera el visto bueno de
Daniel, con botones APROBAR / RECHAZAR por cada elemento. Al pulsar, la
decisión queda visible en la torre al instante (cambia el estado de esa
planta) y se ofrece el registro en GitHub con un enlace de un toque (issue
con la decisión). La torre nunca aprueba nada por su cuenta: solo registra lo
que Daniel pulsa.

## Qué comprobar antes de enseñar la torre

- Cada planta enseña su tarea real de GitHub o su estado real del JSON, con
  hora. Nada de "trabajando en..." sin fuente.
- Los badges de la barra inferior coinciden con las listas que abren.
- A 390 px de ancho (móvil) no hay desbordamiento horizontal y cada planta se
  puede tocar con el dedo.
- Con GitHub caído, la torre enseña los últimos datos con su hora, no un error
  ni una página en blanco.
- El botón de música (audio-design, ya en el kit) suena solo si Daniel lo
  pulsa; nunca autoplay con sonido.
