# Cómo crear un juego · Dana Games

Manual de principio a fin, desde la idea hasta el zip listo para revisar. Leed antes `kit/GUIA-AYUDANTES.md`, `kit/NORMAS-EQUIPO.md`, `kit/brief-juego-comun.md` y `../manual/CONTROL-CALIDAD.md`.

Trabajáis con vuestros propios agentes. El resultado tiene que igualar el nivel de Metro. No se pide ayuda al equipo interno de Dana Games para fabricar: esta es también la prueba de traspaso.

Idioma del producto: inglés primero, español segundo. Con Daniel, en español.

## Herramientas que necesitáis

Para llegar a nuestra calidad hace falta, como mínimo:

1. **Generación de imágenes** para el arte, los fondos y las portadas (el brief pide sprites y fondos ilustrados, no formas planas dibujadas con código).
2. **Un navegador** para jugar, hacer capturas, entrar en Playgama y en YouTube Studio.
3. **Node.js, Phaser 3 y TypeScript** (más Vite y Vitest, según el brief).
4. **ffmpeg** para el GIF y los Shorts (1080×1920).

Apuntad en vuestro archivo (`anita.md` o `niky.md`) qué tenéis y qué os falta. Si os falta algo, pedídselo a Daniel por el canal privado, no en este repositorio.

No activéis servicios de pago (generación, APIs, créditos) sin el sí de Daniel. Dinero = decisión suya.

## Skills obligatorias

Están en `kit/skills/`. Leed el `SKILL.md` de cada una que apliquéis y anotadlas todas en `skills-usadas.md`. Sin esa lista no hay revisión.

- `skills-pro/`: art-direction-and-readability, auditing-game-screen-readability, directing-game-visuals, styling-web-game-typography, input-systems, save-systems, playgama-bridge, playgama-publish, smoke-testing-web-games, onboarding-and-teaching, localize, web-game-performance, designing-mini-games, game-design-fundamentals, difficulty-and-balancing, y el resto según el caso.
- `skills-arte/`: game-ui-ux, mobile-games, create-game-assets, art-bible, playtest-report, phaser-core, game-feel, performance-optimization, audio-design.
- `skills-competencia/`: game-quality-gates, game-polish-audit, juice-audit, review-game, game-juice.
- `skills-marketing/`: solo si hacéis portadas o vídeos (thumbnail-design, hook-writer, youtube-shorts, playgama-game-video…).

Usad también la skill «Estándares de calidad de Daniel». Si encontráis una skill mejor, avisad al Director o dejad nota en vuestro archivo; no la ocultéis.

## Paso A · Idea e investigación

Checklist:

- [ ] Elegir una idea **apta** de `ideas-acumuladas.json` (o de la planta Ideas de la oficina).
- [ ] Que no esté ya en fabricación o en subida (ver `manual/DATOS-DEL-PROYECTO.md`): Mudanza, Metro, Estampida, Barista, fútbol de papel, Cofre del Doblón.
- [ ] Que el género sea distinto al del juego anterior.
- [ ] Comprobar el título en inglés: que no lo esté usando ya otro juego conocido. Si está pillado, proponed otro.
- [ ] Ingeniería inversa de  los mejores del género (juegos reales, páginas reales, cifras con fuente). Copiad la técnica, nunca el código ni el arte.
- [ ] Escribir `teardown.md` con al menos 3 puntos en los que vamos a superar al mejor.
- [ ] Datos de mercado con fuente (URL). Si falta un dato: «sin datos aún». Nunca inventéis descargas, ingresos ni vistas.
- [ ] Definir la mecánica de un solo toque (o la más simple del género), el tutorial del primer nivel y el momento espectacular para el Short y la portada.

Qué decide Daniel en este paso: si hay que gastar dinero en herramientas de investigación o en assets. Si la idea sale de la lista o choca con una marca, preguntad antes de fabricar.

## Paso B · Fabricación y pruebas

Pila fija: **Phaser 3 + TypeScript + Vite**. Destino: Playgama y, a través de Playgama, YouTube Playables. Móvil primero, retrato 390×844. También tiene que funcionar en horizontal y en escritorio, sin bandas negras.

Checklist de fabricación:

- [ ] Todas las normas fijas de `CONTROL-CALIDAD.md` (Bridge, zonas táctiles, sello, mano, zip ≤ 5 MB, inglés primero, sin `window.__*`).
- [ ] Textos por tablas i18n (EN por defecto, ES segundo).
- [ ] Menú ilustrado e interactivo, al nivel del menú de Metro.
- [ ] Tutorial del nivel 1 con la mano oficial.
- [ ] Muchos niveles (30+ o procedurales), mapa, estrellas, racha, reto diario, botón de seguir.
- [ ] Intersticial en pausa natural (no en el primer nivel ni a mitad de ronda). Rewarded en un boost útil. Audio en pausa durante el anuncio.
- [ ] Guardado con `bridge.storage`. El progreso sobrevive a recargar.
- [ ] Sin enlaces externos en el juego. Sin analítica externa. Rutas relativas. `index.html` en la raíz del zip.
- [ ] Dos builds: **producción** (la del zip, sin parámetros de URL ni globales de prueba) y **pruebas** (aparte, nunca mezclada con la que se sube).

Checklist de pruebas (390×844, toques reales):

- [ ] 0 errores de consola.
- [ ] Centro + 4 esquinas de cada botón, y un toque fuera.
- [ ] Partida en inglés por defecto y partida en español.
- [ ] Vertical y horizontal.
- [ ] Guardado tras recargar.
- [ ] Zip ≤ 5 MB, medido de verdad.
- [ ] Búsqueda de `window.__` en el zip de producción: no puede aparecer.

Si no hay código fuente de una ronda anterior y solo hay un zip, se parchea el build y se guardan los parches y el código legible antes/después en `pruebas/`, como en `mudanza-round10/pruebas/`.

## Paso C · Entrega de la ronda

En vuestra rama, nunca en `main`:

1. El **código fuente completo** del juego.
2. La carpeta `entregas/<slug>-roundN/` con:

- [ ] `<slug>-playgama.zip`
- [ ] Portadas Playgama (con sello) y `-youtube` (sin sello)
- [ ] Capturas 390×844 (inicio, tutorial, juego × 3, fin/victoria, fallo, más horizontal)
- [ ] GIF (8–10 s, ≥ 12 fps, ≥ 360 px, acaba en victoria)
- [ ] `listing.txt`, `filtro-visual.md`, `filtro-jugabilidad.md`, `skills-usadas.md`, `teardown.md`, `informe-rondaN.md` (punto por punto)
- [ ] Si podéis, el Short vertical, o su guion, para el paso de marketing

3. Aviso en `anita.md` o `niky.md`: fecha y hora de Madrid, slug, ronda, skills, ruta de la carpeta y enlace al pull request.

4. La otra IA hace la autorrevisión de `CONTROL-CALIDAD.md` y firma APROBADO o DEVUELTO en su archivo.

Sin ese APROBADO no se pasa a publicación.

Ramas: `anita/<tarea>` o `niky/<tarea>`. Un pull request contra `main`. No subáis secretos, cuentas ni builds de prueba llenos de `window.__*`. Este repo es público y, además, no es el sitio para el código de Dana si Daniel os ha dado un repositorio propio de juegos: en ese caso el PR va a ese repo, y aquí solo queda el aviso en vuestro archivo y, si toca, los JSON de la oficina.

No toquéis `recurretumulta` ni la Tienda España.

## Paso D · Actualizar la oficina (cuando la entrega es real)

Con datos reales, en la misma rama o en otra `anita/datos-...` / `niky/datos-...`, y siempre con PR. Esquema exacto en `../GUIA-OFICINA.md`.

- Si el juego es nuevo, añadirlo a `data.json` (`estado`: solo `desarrollo`, `cola` o `publicado`) y una línea en `actividad`.
- Mover o marcar la idea en `ideas-acumuladas.json` y mantener coherencia con `ideas` de `data.json`.
- Actualizar `equipo-hoy.json` con lo hecho hoy (fecha real, fuente real).
- Cuando haya ficha de calidad, añadir el slug a `revisiones/index.json` y los JSON de la ficha.
- No toquéis `index.html`, `assets/` ni `sw.js`.
- Si no hay cifra: `null` o el texto «sin datos aún».

## Qué decide Daniel en la fabricación

- Cualquier gasto (herramientas, assets de pago, créditos).
- Datos bancarios o fiscales: no se tocan.
- Si el juego debe pararse para ahorrar puntos o presupuesto.
