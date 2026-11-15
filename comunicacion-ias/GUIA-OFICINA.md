# Guía de la oficina de mando · Dana Games

Para Anita (Ana) y Niky (Daniky). Trabajáis en otra plataforma. Vuestra ventana al estudio es este repositorio público y la oficina en GitHub Pages. El objetivo es que podáis **llevar todo el proceso** con vuestros propios agentes: idea, fabricación, calidad, publicación, marketing y datos, al mismo nivel que el equipo interno, sin depender de él.

Leed esta guía entera y después los archivos de `manual/` y de `kit/`. No inventéis funciones de la oficina: aquí solo se describe lo que hay en los archivos y en la web publicada el 15/11/2026. Si algo no está claro, escribid «pregunta al Director».

Hora de trabajo: **Europe/Madrid**.

## Cómo leer el manual

1. Esta guía (oficina, órdenes, datos, accesos, traspaso).
2. `manual/DATOS-DEL-PROYECTO.md` — estudio, canal, juegos, rutas, metas, horarios.
3. `kit/GUIA-AYUDANTES.md`, `kit/NORMAS-EQUIPO.md`, `kit/brief-juego-comun.md`, `kit/playgama-proceso.md`.
4. `manual/CONTROL-CALIDAD.md` — prueba estética, fallos repetidos, `review.json`, autorrevisión.
5. `manual/CREAR-JUEGOS.md` — de la idea al zip, herramientas y skills.
6. `manual/PUBLICAR-Y-MARKETING.md` — Playgama, Sandbox, Shorts, métricas.
7. `ORDEN-VIGENTE.md` — el encargo de hoy (ahora: prueba de traspaso).

Luego trabajad siempre en una rama `anita/<tarea>` o `niky/<tarea>` y abrid un pull request. Nunca en `main`.

## 1. Qué es la oficina y qué muestra cada planta

La oficina es un estudio interactivo en el navegador:

https://danielsanchezverdasco-art.github.io/estudio-dana-oficina/

El repositorio es:

https://github.com/danielsanchezverdasco-art/estudio-dana-oficina

Entráis como Daniel, el jefe. Os movéis con el joystick, las flechas o WASD. E habla con quien tengáis cerca. Espacio salta. Hay un ascensor para cambiar de planta. Arriba están la marca, el chip de la planta, el botón **Datos** y el de silencio.

El botón **Actualizar datos** recarga los JSON ya publicados (el `sw.js` los pide a la red y, si falla, usa la caché). No despierta al equipo ni genera datos nuevos. El botón **Pedir recogida nueva** es para Daniel. Vosotras actualizáis los JSON con un pull request.

Los letreros de cada planta y las fichas se alimentan de esos JSON. Si un dato falta, la oficina escribe «Sin datos», «sin datos aún» o «sin datos todavía». No rellenéis huecos.

### Plantas, de arriba a abajo

Orden exacto del ascensor en el código publicado (`assets/index-19448e21.js`):

| Nivel | Planta | Qué se ve (según el código y los JSON) |
|---|---|---|
| P9 | Dirección | Letrero de publicados, en desarrollo, en cola, facturación, partidas y Shorts (de `data.json`). Marina, asistente de dirección. Desde aquí se pueden abrir órdenes e informes. |
| REU | Sala de reuniones | Letrero «REUNIONES / Sin datos» si no hay issues de reunión. Olga. Issues con prefijo `[REUNION]`, `[BRIEFING]` o `[ACTA]`. |
| KPI | KPIs y Actividad | Publicados y en curso. Nuria. Cifras de `data.json`. |
| P8 | Ideas de juegos | Río y dos tableros: ideas aptas y no aptas, leídas de los JSON de ideas. |
| P7 | Diseño de juego | Valeria, Mateo y la pizarra de diseño. Juegos en curso y en cola. |
| P6 | Arte y Animación | Luna, Teo y las láminas. Vistas y Shorts. |
| P5 | Programación | Irene, Hugo y el rack. Phaser. Publicados y partidas. |
| SKL | Skills | Noa y el catálogo, de `skills.json` (56 skills el 15/11). Letrero: número de skills, o «sin datos aún». |
| CAZA | Caza de talento | Lía y el tablón, de `caza-talento.json`. Letrero: «Actualización diaria · 8:00». Candidatas, huecos y mejoras. Barra de la meta de 2.500 €/mes. |
| P4 | QA / Pruebas | Sara, Leo y el banco de móviles. Publicados y partidas. Fichas de calidad si hay `revisiones/`. |
| P3 | Publicación Playgama | Carmen, Andrés y el mapa de lanzamientos. Publicados, en curso y en cola. |
| P2 | Marketing | Alba y Bruno (YouTube e Instagram) y el set de Shorts. Letrero de suscriptores, de `marketing.json`. |
| EST | Estadísticas | Inés y las gráficas. El letrero de partidas puede decir «sin datos todavía». |
| P1 | Analítica | Elena, Pablo y el panel. Facturación total y del mes. |
| PB | Vestíbulo | Sofía (recepción), Dana (mascota) y portadas de Metro Nightmare, Mudanza Extrema y El Barista del Caos. Hay arte de Estampida en el código, pero en el vestíbulo publicado se ven esas tres portadas. |

Si una pantalla de planta no trae datos, el texto es «Sin datos en las pantallas de esta planta.»

Hay un centro de mando (barra de comandos) que lee **issues públicos** del mismo repositorio y muestra juegos, propuestas, normas y fichas. El 15/11/2026 no había issues abiertos ni cerrados en el repo. La oficina clasifica un issue por el **prefijo del título**, no por un texto libre.

## 2. Cómo dar órdenes y propuestas

Se hace con **issues de GitHub** en `danielsanchezverdasco-art/estudio-dana-oficina`. La oficina construye la URL `.../issues/new` con título, cuerpo y, en algunos tipos, etiqueta.

La rutina del estudio **revisa los issues a las 10:00 (hora de Madrid)**. No esperaos una respuesta automática al segundo.

### Prefijos de título (exactos)

El código usa estos prefijos, al inicio del título:

| Prefijo | Uso | Etiqueta que pone la oficina |
|---|---|---|
| `[ORDEN]` | Una orden de trabajo | `orden` |
| `[INFORME]` | Pedir un informe | `informe` |
| `[REUNION]` | Convocar una reunión | `reunion` |
| `[APROBAR]` | Aprobar una propuesta (va con `#número`) | `decision` |
| `[RECHAZAR]` | Rechazar una propuesta (va con `#número`) | `decision` |
| `[CAMBIOS]` | Pedir cambios a una propuesta (va con `#número`) | `decision` |
| `[IDEAS]` | Pedir ideas nuevas | `orden` |
| `[PROPUESTA]` | Proponer un juego o un cambio | el clasificador mira el prefijo; en el código no hay etiqueta `propuesta` |
| `[BRIEFING]` | Briefing de reunión | igual: el prefijo basta |
| `[ACTA]` | Acta de reunión | igual: el prefijo basta |

Título tipo: `[ORDEN] Arreglar zonas táctiles de Sale Stampede r13`.

### Cuerpo (formato exacto)

La oficina escribe el cuerpo así, con una clave por línea y el texto libre debajo de `texto:`:

```
origen: oficina
tipo: orden
destino: Programación
nombre: Sale Stampede r13
prioridad: alta
texto:
Aquí va el encargo, en frases claras.
```

Campos que el formulario de la oficina usa:

- Orden: `destino`, `nombre`, `prioridad`, y `texto:`.
- Informe: `informe` (uno de: `estado general`, `un juego concreto`, `ideas`, `ingresos y métricas`, `oficina`) y, si es un juego, `juego`.
- Ideas nuevas: `genero`, `cantidad`, y un texto del tipo «Generar N ideas nuevas de género X. Añadirlas a ideas-acumuladas.json sin borrar las anteriores.»
- Reunión: `tema`.
- Decisiones sobre una propuesta: el título lleva el número, por ejemplo `[APROBAR] #12 ...` o `[RECHAZAR] #12 ...`.

Podéis copiar ese formato a mano si no usáis el botón de la oficina. Dejad siempre `origen: oficina` o, si lo escribís vosotras desde fuera, `origen: anita` / `origen: niky`, y no borréis el bloque `texto:`.

### Propuestas: imágenes y enlace para jugar

Una `[PROPUESTA]` tiene que llevar:

1. **Imágenes de muestra** en Markdown, con URL pública `http` o `https`:

   `![mesa de juego](https://ejemplo.com/boceto.png)`

2. **Una línea exacta** con el enlace para jugar (también `http` o `https`):

   `jugar: https://ejemplo.com/demo`

La oficina solo reconoce las imágenes en sintaxis `![alt](url)` y la línea `jugar:`. Sin eso, enseña «Todavía no hay bocetos.» o «Demo próximamente».

### Estados que muestra la oficina para un issue

- `closed` → «Hecha»
- abierta, con comentarios → «En marcha»
- abierta, sin comentarios → «Enviada»

## 3. Cómo actualizar los datos

Solo se tocan JSON de datos. **Nunca** `index.html`, `assets/` ni `sw.js`: eso lo cambia Oficina y Datos.

Siempre en una rama propia (`anita/...` o `niky/...`) con pull request. Nunca en `main`.

Solo **datos reales**, con fuente. Si falta un dato: `null` o el texto **«sin datos aún»**. No estiméis ingresos, partidas ni vistas.

Archivos que la oficina publicada carga:

### `data.json`

```json
{
  "version": 1,
  "updatedAt": "2026-11-15T11:00:00+01:00",
  "kpis": {
    "facturacionTotal": null,
    "facturacionMes": null,
    "partidas": null,
    "ingresosPorMilPartidas": null,
    "publicados": 0,
    "publicadosMeta": 200,
    "shortsPublicados": 0,
    "vistas": null,
    "enDesarrollo": 4,
    "enCola": 0
  },
  "juegos": [
    {
      "id": "metro-nightmare",
      "titulo": "Metro Nightmare",
      "estado": "desarrollo",
      "portada": "cover.metro",
      "facturacion": null,
      "partidas": null,
      "vistas": null
    }
  ],
  "ideas": { "aptas": [], "noAptas": [] },
  "actividad": [
    {
      "equipo": "Metro Nightmare",
      "tarea": "En Sandbox de Playgama (v2)",
      "estado": "en curso",
      "desde": null
    }
  ]
}
```

Reglas del parser:

- `updatedAt`: texto o `null`.
- KPI: número o `null`. No pongáis `""` ni `"Sin datos"` en un campo numérico (el parser lo trata como `null`, pero un texto distinto rompe).
- `juegos[].estado` solo puede ser: `desarrollo`, `cola`, `publicado`. No existe el estado «sandbox» ni «en revisión»: ese detalle va en `actividad.tarea`.
- `juegos[].portada` de los cuatro juegos actuales: `cover.metro`, `cover.mudanza`, `cover.barista`, `cover.estampida`. Un valor nuevo se ve como un distintivo genérico hasta que Oficina y Datos añada el arte. No sustituyáis vosotros los archivos de `art/`.
- `actividad[].estado` solo: `en curso`, `esperando`, `hecho`.
- Ideas: `id` y `titulo` obligatorios; `potencialViral` entero de 1 a 5 si va; `datos[]` con `texto` (o `dato`) y `url` o `fuente`.

### `ideas-acumuladas.json`

Lista viva de ideas. Claves: `generadoEn`, `fuentes`, `aptas`, `noAptas`, `actualizadoEn`. Cada idea puede llevar `id`, `titulo`, `tituloEN`, `genero`, `gancho`, `porQueFunciona`, `datos`, `competencia`, `potencialViral`, `hacibleEnUnDia`, `duracionSesion`, `elegida`, `motivoRechazo`, `nombre`, `fecha`, `nueva`, `estado`, `viralUrgente`, `origen`.

Al añadir ideas, no borréis las anteriores. Mantened coherencia con `data.json` → `ideas`. Si los recuentos no coinciden, no inventéis una cifra puente: dejad constancia y preguntad al Director si hace falta un criterio.

### `equipo-hoy.json`

```json
{
  "fecha": "2026-11-15",
  "actualizado": "2026-11-15T08:08:00+01:00",
  "areas": {
    "calidad": {
      "nombre": "Arte y Calidad",
      "rol": "Arte y Calidad",
      "estado": "En arreglos",
      "hoy": [{ "texto": "Estampida r10 rechazada.", "fecha": "2026-11-15" }],
      "resumen": "Frase corta de lo de hoy.",
      "fuente": "Informe del 15/11/2026"
    }
  }
}
```

Áreas que el archivo publicado ya usa: `oficina`, `youtube`, `calidad`, `playgama`, `direccion`, `diseno`, `skills`, `caza`, `reuniones`, `ideas`, `kpis`, `programacion`, `estadisticas`, `analitica`. No inventéis un área nueva si la planta no la va a leer: si hace falta, pregunta al Director.

### `metricas.json`

```json
{
  "actualizado": null,
  "meta": {
    "objetivoMensualEUR": 2500,
    "mesActual": "2026-11",
    "ingresosMesEUR": null,
    "fuentes": { "playgama": null, "youtube": null }
  },
  "juegos": [],
  "videos": []
}
```

La meta de 2.500 € ya está puesta. No toquéis el objetivo salvo que Daniel lo cambie. Ingresos y listas: solo cifras de panel, o `null`.

### `marketing.json`

Tiene `actualizado`, `analisis`, `canal` (YouTube), `instagram`, `playgama`, `canales[]`, `piezas`, `juegos`, `portadas`, `hashtags`. El 15/11 el canal tenía 2.734 suscriptores y 216 vistas en 28 días; el resto de campos muchos están a `null`. Seguid ese esquema. No inventéis un handle si el campo sigue a `null`.

### `skills.json`, `caza-talento.json`, `cambios.json`, `planes.json`, `pedidos.json`

- Skills: `actualizado` + lista con `nombre`, `repo`, `area` (`arte`, `programacion`, `competencia`, `marketing`, `pro`, `calidad`), `paraQue`, `instalada`, `usos`, `usadaEn`, `estado` (`activa` o `sustituida`), `sustituidaPor`.
- Caza: `actualizado`, `candidatas`, `huecos`, `mejoras`.
- Cambios: `actualizado` y lista `{ "fecha", "que", "porQue", "resultado" }`.
- Planes: `actualizado` y lista `{ "titulo", "fecha", "estado", "juego" }`.
- Pedidos: `{ "actualizado": null, "pedidos": [] }` el 15/11. Si no está claro el esquema de un pedido, pregunta al Director antes de añadir uno.

### Revisiones

Ver el esquema completo en `manual/CONTROL-CALIDAD.md`. Resumen: `revisiones/index.json` con `slugs`, y por juego `review.json`, `skills-usadas.json`, `filtro-visual.json`, `filtro-jugabilidad.json`.

## 4. Cómo crear, revisar, publicar y comunicar un juego

El proceso completo, con listas de comprobación, está en:

- `manual/CREAR-JUEGOS.md` — idea, investigación, fabricación, pruebas, entrega.
- `manual/CONTROL-CALIDAD.md` — prueba de calidad y autorrevisión.
- `manual/PUBLICAR-Y-MARKETING.md` — Playgama, QA Tool, Sandbox, Shorts, métricas.

Resumen de la cadena:

1. Elegir una idea apta que no esté ya en marcha.
2. Ingeniería inversa con datos reales y `teardown.md`.
3. Fabricar en Phaser 3 + TypeScript + Vite, con las normas fijas.
4. Probar a 390×844 (vertical y horizontal), zonas táctiles, idioma, zip, Bridge.
5. Entregar en la rama: código fuente + `entregas/<slug>-roundN/`.
6. Avisar en `anita.md` o `niky.md`.
7. La otra IA revisa y firma APROBADO o DEVUELTO.
8. Publicar en Playgama (borrador, QA Tool, moderación o Sandbox).
9. Short en inglés, con la casilla legal que haya decidido Daniel, sin borrar vídeos y sin cerrar sesión.
10. Actualizar los JSON de la oficina con hechos reales.

## 5. Accesos

Las cuentas de **Playgama**, **YouTube** y **GitHub** os las da Daniel **directamente**, por vuestro **canal privado**. Nunca se piden ni se escriben en este repositorio, ni en un issue, ni en un pull request, ni en `anita.md` / `niky.md`.

Pedidle, cuando os haga falta para trabajar sin parar, exactamente esto:

1. Vuestro **usuario de GitHub como colaborador** de `danielsanchezverdasco-art/estudio-dana-oficina` (y, si existe, del repositorio propio de los juegos de Dana).
2. Acceso de **Editor en YouTube Studio** del canal Dana Games.
3. **Miembro del equipo en Playgama** del estudio Dana Games o, si no existe el equipo, el acceso que él decida a esa misma cuenta (no a una cuenta nueva).

Si un sitio pide contraseña, código o verificación, parad y pedídselo a él por el canal privado. No dejéis la contraseña escrita en ningún archivo de aquí.

## 6. Traspaso

El detalle está en `manual/DATOS-DEL-PROYECTO.md`. En corto, el 15/11/2026 (hora de Madrid):

- Mudanza Extrema / Moving Mayhem: ronda 10 aprobada, en subida a Playgama; Short listo, a la espera del enlace; Daniel pidió marcarlo como contenido para niños.
- Metro Nightmare: en Sandbox (https://playgama.ai/play/vw3o2dpywoejvy), ronda 10 en revisión de Arte.
- Estampida: ronda 13 en fabricación.
- Barista: ronda 7 en fabricación.
- Fútbol de papel y Cofre del Doblón: en fabricación, aún sin carpeta de entrega.
- Oficina publicada; los JSON públicos van por detrás del pipeline; no hay fichas `review.json` cargadas.
- Cero juegos en el catálogo público de Playgama.

Las rutas de cada entrega están en `DATOS-DEL-PROYECTO.md`. Si no tenéis el kit con esas carpetas, pedídselo a Daniel por el canal privado, no lo subáis a un issue público si el pack pesa o trae builds internos.

No toquéis **recurretumulta** ni la **Tienda España**.

## 7. Qué decide siempre Daniel

Vosotras lleváis el proceso. Él decide, y hay que esperarlo:

- El **dinero**: pagos, créditos, herramientas de pago, recargas, promoción de pago (la norma es no comprar promoción).
- Los **datos bancarios o fiscales** y cualquier retirada de Playgama u otra plataforma.
- Las **casillas legales**, en especial si un Short o un juego es contenido creado para niños (COPPA).
- Los **accesos** a las cuentas (sección 5).
- Cualquier excepción a las normas (sello en miniaturas de YouTube, parar un juego, cambiar la meta de 2.500 €).

Si no es una de esas cosas, seguid la guía y no esperéis una pregunta. Si no está claro, «pregunta al Director».
