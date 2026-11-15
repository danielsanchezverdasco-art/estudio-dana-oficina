# Datos del proyecto Dana Games

Información pública reunida el 15/11/2026 (hora de Madrid, Europe/Madrid, UTC+1).

Solo hay datos que aparecen en la oficina publicada, en el kit o en el traspaso del Director. Si un dato no está, se indica. No hay contraseñas, correos ni claves en este archivo. No las escribáis nunca en este repositorio: es público.

## Oficina y repositorio

- Oficina en vivo: https://danielsanchezverdasco-art.github.io/estudio-dana-oficina/
- Repositorio público: https://github.com/danielsanchezverdasco-art/estudio-dana-oficina
- Carpeta de coordinación: https://github.com/danielsanchezverdasco-art/estudio-dana-oficina/tree/main/comunicacion-ias
- El README de la raíz del repo solo dice «# estudio-dana-oficina». No hay un REVISIONES.md en el repositorio público.

El código visual de la oficina (`index.html`, `assets/`, `sw.js`) lo cambia solo Oficina y Datos. Vosotras no lo tocáis.

## Estudio en Playgama

- Nombre actual del estudio: **Dana Games**.
- Antes se llamaba «Tetris Human Games». El 14/11/2026 se le cambió el nombre. Es la misma cuenta. No creéis otra.
- Portal de desarrolladores: https://developer.playgama.com/
- Cuenta de acceso: os la da Daniel por el canal privado. Nunca se anota aquí.

### Metro Nightmare en Sandbox

- Estado: en Sandbox (zona de pruebas de Playgama). Aún no está publicado en el catálogo.
- Enlace de juego (pipeline del estudio, 15/11/2026, 09:51 hora de Madrid): https://playgama.ai/play/vw3o2dpywoejvy
- Panel de desarrollador: el enlace exacto de la ficha no figura en los JSON públicos ni en el kit. Se abre desde el Dashboard de https://developer.playgama.com/ cuando Daniel os dé acceso. Si no lo veis, preguntadle por el canal privado.

En `data.json` de la oficina, Metro sigue con `estado: "desarrollo"` y la tarea «En Sandbox de Playgama (v2); rehaciendo la jugabilidad desde cero, estilo Bus Jam». El parser de la oficina solo acepta tres estados de juego: `desarrollo`, `cola` y `publicado`. No inventéis un estado «sandbox»: el detalle va en `actividad`.

Meta usada en el traspaso para sacar un juego del Sandbox hacia revisión: **100 partidas de prueba**, **5:00 de media** y **0,30 anuncios por partida**. Esa cifra no aparece literal en `playgama-proceso.md` (el brief sí pide sesiones de ≥5:00 de media). Si el panel de Playgama muestra otras metas, se siguen las del panel.

## Canal de YouTube

Según `marketing.json` de la oficina (actualizado 15/11/2026, 02:56 hora de Madrid):

- Nombre: Canal Dana Games (antes Customs GT).
- Suscriptores: 2.734 (heredados).
- Visualizaciones en 28 días: 216.
- Horas de visionado en 28 días: 0,6.
- Shorts de Dana Games: aún no hay (`shortsPublicados` es 0; el análisis dice «Aún sin Shorts de Dana Games»).
- El campo `handle` está a `null` en ese JSON. El identificador público no está escrito en los archivos de la oficina ni del kit. Pedídselo a Daniel cuando os dé acceso de Editor en YouTube Studio.

Instagram, en el mismo archivo: nombre «Dana Games», handle `@kiko.y.pita`, nota «Se está renombrando a Dana Games». Seguidores: sin datos aún.

## Meta económica

En `metricas.json` y en la oficina (planta Caza de talento y `planes.json`):

- Objetivo mensual: **2.500 €** (`meta.objetivoMensualEUR`: 2500, mes `2026-11`).
- Ingresos del mes, Playgama y YouTube: `null` (sin datos aún).
- Lista `juegos` y `videos` de `metricas.json`: vacías.
- En `data.json`, `kpis.publicados` es 0 y `kpis.publicadosMeta` es 200. Facturación, partidas y vistas: `null`.

No rellenéis esas cifras con estimaciones.

## Horarios de trabajo (hora de Madrid)

Según el Director, el 15/11/2026:

| Hora | Qué se hace |
|---|---|
| 8:00 | Ideas (y, en la planta Caza, la oficina muestra «Actualización diaria · 8:00») |
| 9:30 | Fabricación de juegos |
| 10:00 | Revisión de órdenes e issues |
| 11:00 | Métricas |

Además, en `equipo-hoy.json`: revisión semanal de skills los **lunes a las 8:00**.

La web de la oficina no ejecuta esas rutinas ella sola. Son horarios de trabajo del estudio.

## Lista de juegos y estado (15/11/2026)

Fuente principal: `pipeline-juegos.json` del estudio (09:51 hora de Madrid) y el traspaso del Director. Los JSON públicos de la oficina (`data.json`, `equipo-hoy.json`) van más atrasados: aún pintan los cuatro juegos iniciales como «en desarrollo» y no listan el fútbol de papel ni Cofre del Doblón.

| Juego | Título en inglés (si consta) | Estado actual | Notas |
|---|---|---|---|
| Mudanza Extrema | Moving Mayhem | En subida o en moderación de Playgama | Ronda 10 con APROBADO final de Arte y Calidad el 15/11/2026. Ficha en inglés primero. El Short está hecho, en inglés, y Daniel pidió marcarlo como contenido creado para niños. |
| Metro Nightmare | Metro Nightmare | En Sandbox de Playgama; ronda 10 en revisión de Arte | Enlace de juego arriba. Aún le faltan las metas de Sandbox para ir a revisión del catálogo, si el panel las mantiene. |
| Estampida en las Rebajas | Sale Stampede | En fabricación, ronda 13 | Las rondas 10 a 12 fueron rechazadas en auditoría. |
| El Barista del Caos | Chaos Barista (así aparece en la auditoría) | En fabricación, ronda 7 | Pendiente de cerrar arreglos. |
| Fútbol de papel | Título provisional «Doodle Goal» (hay que comprobar que no lo use nadie) | En fabricación (juego urgente del 15/11) | Primera fabricación del día. Inglés primero. Tiene que pasar la prueba estética al nivel de Metro. |
| Cofre del Doblón | sin título en inglés en los archivos | En fabricación | Segunda fabricación del día 15/11. |

Juegos publicados en el catálogo de Playgama: **0**. Metro está solo en Sandbox.

## Rutas de cada entrega

En el kit del estudio (os lo tiene que facilitar Daniel si no está en un repositorio vuestro). Este repositorio de la oficina es público y no debe usarse para subir el código completo de los juegos de Dana, ni nada de recurretumulta ni de la Tienda España.

Convención en el kit:

- Entregas en arreglo: `revision-pendiente/<slug>-roundN/`
- Tras el APROBADO de Arte: `juegos-aprobados/<slug>/`
- Shorts: `shorts/<slug>/`

Últimas carpetas conocidas el 15/11/2026:

| Juego | Última entrega en el kit |
|---|---|
| Mudanza Extrema | `revision-pendiente/mudanza-round10/` (APROBADO). También hay copia en `juegos-aprobados/mudanza-extrema/` (puede estar desfasada respecto a la r10). |
| Metro Nightmare | `revision-pendiente/metro-round10/` (en auditoría). Hay una carpeta anterior en `juegos-aprobados/metro-nightmare/`. |
| Estampida en las Rebajas | `revision-pendiente/estampida-round12/` (rechazada). La r13 está en fabricación; aún no aparece esa carpeta en el inventario del kit. También existe `estampida-final/` y `juegos-aprobados/estampida-en-las-rebajas/`. |
| El Barista del Caos | `revision-pendiente/barista-round6/` (y `barista-round5/`). La r7 está en fabricación. |
| Fútbol de papel | Aún no hay carpeta de entrega en el inventario del 15/11 por la mañana. |
| Cofre del Doblón | Aún no hay carpeta de entrega en el inventario del 15/11 por la mañana. |
| Short de Moving Mayhem | `shorts/mudanza-extrema/short-moving-mayhem.mp4` (18 s, 1080×1920, en inglés). |

Cuando vosotras entreguéis, usad en vuestra rama: código fuente completo más `entregas/<slug>-roundN/` (ver la guía).

Slugs habituales: `mudanza-extrema`, `metro-nightmare`, `estampida-en-las-rebajas`, `el-barista-del-caos`. El del fútbol de papel y el de Cofre del Doblón aún no están fijados en los JSON públicos.

## Ideas

La lista viva está en `ideas-acumuladas.json` (actualizado 15/11/2026, 08:10 hora de Madrid): 22 aptas y 15 no aptas en ese archivo (los recuentos de `data.json` y de `equipo-hoy.json` no coinciden entre sí: 19+13 en `data.json`, «37 ideas (5 nuevas)» en el parte del 15/11). No inventéis una cifra nueva: abrid el JSON y trabajad sobre el archivo.

No elijáis para un juego nuevo una idea que ya está en fabricación o en subida, salvo que Daniel lo pida.

## Qué está a medias (traspaso)

Resumen. El detalle de calidad y publicación está en los otros archivos del manual.

1. **Mudanza / Moving Mayhem:** aprobado en r10, en subida a Playgama. Falta terminar el acceso a la cuenta, crear o completar el borrador, pasar el QA Tool (anuncios, guardado en la nube y `game_ready`) y enviar a moderación. El Short está listo y espera el enlace de Playgama. Daniel ya dijo que el Short se marque como contenido creado para niños.
2. **Metro Nightmare:** en Sandbox, enlace de juego arriba; ronda 10 en revisión de Arte; la jugabilidad se rehízo al estilo Bus Jam.
3. **Estampida:** ronda 13 en fabricación, tras varios rechazos (zonas táctiles, mano de portada, entregas incompletas).
4. **Barista:** ronda 7 en fabricación.
5. **Fútbol de papel y Cofre del Doblón:** en fabricación el 15/11, aún sin carpeta de entrega.
6. **Oficina:** publicada en GitHub Pages. El botón «Actualizar datos» solo recarga los JSON ya publicados. El parte `equipo-hoy.json` y `data.json` no están al día respecto al pipeline de las 09:51. Faltan fichas `review.json` (`revisiones/index.json` tiene `"slugs": []`).
7. **Anita y Niky:** la carpeta `comunicacion-ias/` ya está en `main`. Aún hace falta que Daniel os añada como colaboradoras y os dé los accesos de Playgama y YouTube. Hasta entonces, trabajad en forks o en lo que él os facilite, y dejad el trabajo en una rama `anita/...` o `niky/...` con pull request. Nunca en `main`.

## Norma de idioma (15/11/2026, Director)

Inglés primero en el juego, la ficha, las portadas y los Shorts. El español es idioma secundario: solo se activa si el idioma de la plataforma es español (`es`, `es-MX` y equivalentes). Si Playgama no tiene campo por idioma, se sube solo el inglés. En la ficha en inglés no pueden quedar palabras en español ni nombres de juegos ajenos.

Al hablar con Daniel, escribid en español.

## Datos confirmados por el Director (15/11/2026)
- Canal de YouTube: Dana Games, @danagamesoficial (ID UClz7WVjUEjMHJQ_EAI5hmGQ).
- Metro Nightmare en Sandbox de Playgama: panel https://developer.playgama.com/applications/game/cmwgp5hl01nxqlz0h1m3f7hi4 · enlace de juego https://playgama.ai/play/vw3o2dpywoejvy
- Metas de Sandbox para pasar a revisión: 100 partidas, 5:00 de media y 0,30 anuncios por partida.
