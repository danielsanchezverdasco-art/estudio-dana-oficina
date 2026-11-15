# Publicación y marketing · Dana Games

Solo después del APROBADO de autorrevisión (`manual/CONTROL-CALIDAD.md`). Detalle técnico de Playgama en `kit/playgama-proceso.md`. Detalle de Shorts en el playbook de marketing del estudio (`playbook-marketing-video.md`, os lo facilita Daniel si no está en `kit/`).

El acceso a las cuentas os lo da Daniel por el canal privado. En esta guía no hay correos ni contraseñas.

## Paso D · Publicación en Playgama

Portal: https://developer.playgama.com/

Estudio: **Dana Games** (antes «Tetris Human Games»; es la misma cuenta, no creéis otra). Ver `DATOS-DEL-PROYECTO.md`.

### Checklist del borrador (Add Game o actualización)

- [ ] ZIP de producción: `index.html` en la raíz, rutas relativas, nombres latinos, ≤ 5 MB (norma del estudio; Playgama admite más, pero nosotros no).
- [ ] `playgama-bridge.js` dentro del zip, primer script del `<head>`, sin `async`, versión 2.2.0 o posterior.
- [ ] `playgama-bridge-config.json` válido al lado de `index.html`.
- [ ] `bridge.initialize()` termina antes de cargar el motor. Luego se lee `bridge.platform.language`.
- [ ] `bridge.platform.sendMessage('game_ready')` cuando el primer fotograma ya es jugable.
- [ ] Guardado con `bridge.storage.get` / `bridge.storage.set`. Comprobarlo otra vez en el QA Tool, en la nube real.
- [ ] Título en inglés, igual al que muestra el juego, 2–4 palabras memorables, solo letras latinas.
- [ ] Ficha: Title, Game Engine, Game Archive, Description, How to play, Supported Devices, Game Languages (todos los idiomas que el juego soporta de verdad), orientación, features, media.
- [ ] Bloque EN sin español y sin nombres de juegos ajenos. El bloque ES, si Playgama tiene campo de idioma, va solo como traducción secundaria. Si no hay campo, se sube solo el inglés. Nada de frases provisionales («Play link: … when it exists»).
- [ ] Tres portadas de consola: 800×800, 1080×1920, 1920×1080, con sello (norma del estudio).
- [ ] Si el juego también va a YouTube Playables, las miniaturas de YouTube van **sin** sello. Si hay duda, lo decide Daniel.

Si el formulario no pasa: `FORM_INCOMPLETE`. Si faltan portadas: `COVERS_INCOMPLETE`. Si falta Bridge o config: el build no es construible.

Podéis **Save as Draft** si aún no está listo para enviar.

### Checklist del QA Tool (Test Game)

Antes de Submit Game, en la propia consola de Playgama:

- [ ] El juego carga y se puede terminar una partida.
- [ ] Los anuncios salen donde toca (y no donde no toca).
- [ ] El guardado en la nube funciona de verdad (no solo en local).
- [ ] Playgama recibe `game_ready`.
- [ ] Audio se calla con el anuncio y al perder el foco.
- [ ] No hay errores ni cuelgues. El juego llena la ventana, también en 1:1. Textos legibles.

Si algo falla, no se envía. Se corrige, se sube un zip nuevo y se vuelve a pasar el QA Tool.

### Moderación (Submit Game)

- [ ] Submit Game solo con QA Tool en verde y con APROBADO firmado.
- Tiempos publicados: 1–5 días laborables para publicar si no hay problemas; 3–5 días de moderación (FAQ). Hay dos cifras; se citan las dos. Partners: hasta 2 semanas. YouTube Playables a través de Playgama: 2–4 semanas.
- Publicar en Playgama y en sus partners es gratuito, según la FAQ de pagos.
- En el primer juego, el equipo de moderación puede abrir un chat. Atendedlo. No prometáis fechas que no estén en el panel.

### Sandbox

Metro Nightmare ya está en Sandbox: https://playgama.ai/play/vw3o2dpywoejvy

El Sandbox es la zona de pruebas, no el catálogo público. En el traspaso del Director, para pasar de Sandbox a revisión se han usado como meta:

- 100 partidas de prueba
- 5:00 de media
- 0,30 anuncios por partida

Esa tripleta no está escrita de forma literal en `playgama-proceso.md`. El brief sí pide sesiones de ≥ 5:00 de media. Si el panel muestra otras metas, se siguen las del panel. No inventéis partidas ni tiempos.

YouTube Playables se hace **a través de Playgama**, no abriendo una cuenta directa en Google, salvo que Daniel diga lo contrario.

### Monetización (solo lectura; no se configura el cobro)

Playgama paga con anuncios (y, en algunos juegos, compras por el módulo de payments de Bridge). Umbral de retirada publicado: 100 USD. Métodos mencionados: transferencia bancaria; cripto bajo petición.

**No configuréis cuentas bancarias, fiscales ni de pago.** Eso lo decide y lo hace Daniel.

### Qué decide Daniel en Playgama

- Darte (o a tu compañera) el acceso de miembro del equipo, o el acceso a la cuenta si no hay equipo.
- Datos bancarios, fiscales y cualquier retirada de dinero.
- Si se activa un boost de tráfico de Sandbox de pago o irreversible (las skills de Playgama piden preguntar antes).
- Excepciones de marca en miniaturas hacia YouTube.

## Paso E · Marketing (Shorts de YouTube)

Norma de Daniel: **solo marketing orgánico**. Nunca se compra promoción, visitas, seguidores ni interacciones.

Otras normas fijas:

- **Inglés primero** en el vídeo, los textos en pantalla, el título, la descripción y los hashtags. El español puede ir en una línea al final de la descripción, no en el gancho.
- **Nunca borrar un vídeo.** Solo ocultarlo (privado o no listado).
- **Nunca cerrar la sesión** de YouTube, Google o GitHub en el navegador.
- Gameplay real del juego aprobado, no de una versión antigua con arte plano (eso rechazó Shorts de Mudanza y Metro).
- Vertical **1080×1920**, unos 15–30 s (el de Moving Mayhem duró 18 s). Fotograma 0 ya en movimiento, se entiende en silencio, CTA corto tipo «PLAY FREE» + el nombre del juego. El enlace de Playgama va en la descripción cuando exista, no antes con un texto provisional.
- Si el juego también sale como YouTube Playable, se puede añadir `#playables`.
- Skills: hook-writer, youtube-shorts, virality, thumbnail-design, playgama-game-video, según el caso. Análisis de competencia en `shorts-teardown.md`, con vídeos realmente vistos. No inventéis planos ni cifras.

### Casilla legal de YouTube (contenido para niños / COPPA)

YouTube obliga a marcar si el vídeo es contenido creado para niños.

- Si se marca **sí**: se desactivan los comentarios y la publicidad personalizada en ese vídeo.
- Si se marca **no**: comentarios y anuncios personalizados pueden quedar activos, según la cuenta.

**Esta casilla la decide Daniel**, con sus palabras, en cada vídeo o como norma general. No la rellenéis por vuestra cuenta la primera vez. El 15/11/2026, para el Short de Moving Mayhem, Daniel dijo: «Sí, marcadlo como contenido creado para niños». Dejad constancia en vuestro archivo. Si un juego nuevo es distinto, volved a preguntar.

### Checklist de publicación del Short

- [ ] APROBADO de autorrevisión del juego (y, si podéis, del propio Short).
- [ ] Enlace real de Playgama en la descripción (cuando el juego ya tenga ficha o Sandbox jugable).
- [ ] Inglés primero.
- [ ] Casilla de contenido para niños según lo que haya dicho Daniel.
- [ ] No se borra ningún vídeo anterior. Si un Short viejo no debe verse, se oculta.
- [ ] La sesión del navegador se deja abierta.

### Qué decide Daniel en marketing

- La casilla legal de contenido para niños.
- Si se abre un canal o una cuenta nueva, o un cambio de nombre que pida verificación.
- Cualquier gasto en promoción (la norma es que no se gasta).
- El acceso de Editor en YouTube Studio.

## Paso F · Actualizar la oficina y las métricas

Cuando haya un hecho real (borrador creado, juego en moderación, publicado, Short al aire, cifras del panel):

- [ ] Actualizar `equipo-hoy.json` (qué se ha hecho hoy, con fecha y fuente).
- [ ] Actualizar `data.json`: estado del juego (`desarrollo` / `cola` / `publicado`), `actividad`, y los KPI solo con números del panel.
- [ ] Actualizar `metricas.json` y `marketing.json` con cifras de Playgama o YouTube Studio, nunca estimadas. Si el panel no da un dato: `null` o «sin datos aún».
- [ ] Si ya hay URL de juego, ponerla en `review.json` (`playgama`) y, cuando exista, en la ficha pública.
- [ ] `planes.json` y `cambios.json` solo si el hecho encaja en su esquema (ver `GUIA-OFICINA.md`).
- [ ] Siempre en rama propia y pull request. Nunca en `main`. Nunca el build de la oficina.

La web tiene un botón «Actualizar datos» que solo recarga los JSON ya publicados. El botón «Pedir recogida nueva» es para Daniel. Vosotras actualizáis los archivos con un PR.

Horario de métricas del estudio: **11:00 hora de Madrid**.
