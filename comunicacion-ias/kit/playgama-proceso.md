# Proceso real de publicación en Playgama (y YouTube Playables a través de Playgama)

**Fecha de esta guía:** 15/11/2026, hora de Madrid (Europe/Madrid, UTC+1).  
**Para:** equipos de Dana Games. Cuenta de desarrollador ya existente en el portal, estudio «Tetris Human Games». **No crear otra cuenta ni iniciar sesión desde aquí.**  
**Regla:** nada inventado. Cada requisito lleva su fuente. Si no está confirmado en documentación oficial, se marca como **no confirmado**.

---

## 1. Dónde se sube el juego

Portal de desarrolladores (URL canónica, enlazada desde la guía oficial «Quick start»):

- **https://developer.playgama.com/**

La página pública de desarrolladores («Join Playgama») apunta a:

- **https://developer.playgama.com/auth?utm_source=landing**

También responden con HTTP 200 (páginas de acceso, no se ha iniciado sesión ni se ha enviado ningún formulario):

- https://developer.playgama.com/auth
- https://developer.playgama.com/account

Fuentes:

- https://wiki.playgama.com/playgama/quick-start (el enlace «developer portal» apunta a https://developer.playgama.com/)
- https://playgama.com/developers (botón de registro/acceso → https://developer.playgama.com/auth?utm_source=landing)
- Términos del portal: https://developer.playgama.com/terms (el «Publisher’s Portal» incluye https://developer.playgama.com)

En la consola se pulsa **Add Game**, se rellena la ficha, se sube el ZIP, se abre **Test Game** (QA Tool) y, si todo funciona, **Submit Game**. Si hace falta más tiempo: **Save as Draft**. El estado queda en el Dashboard.

Fuente: https://wiki.playgama.com/playgama/submitting-a-game

---

## 2. Formato y límites del ZIP

Requisitos técnicos de Playgama (obligatorios para el archivo que se sube):

| Requisito | Valor verificado | Fuente |
|---|---|---|
| Formato | Archivo ZIP | [Submitting a game](https://wiki.playgama.com/playgama/submitting-a-game) |
| Entrada | `index.html` **en la raíz del archivo** (no dentro de una subcarpeta) | [Submitting a game](https://wiki.playgama.com/playgama/submitting-a-game) y [Technical Requirements 1.3.2](https://wiki.playgama.com/playgama/game-requirements/technical-requirements) |
| Tamaño total del juego dentro del archivo | **no más de 300 MB** | mismos dos documentos, punto 1.3.1 |
| Nombres de archivos y carpetas | solo caracteres latinos | Technical Requirements 1.3.2 |
| Recursos externos | el juego **no carga recursos externos**: todo lo necesario va dentro del archivo | Technical Requirements 1.2.5 |
| Memoria al arrancar | pico por debajo de **2 GB**; el chequeo automático rechaza el archivo si lo supera | Technical Requirements 1.3.3 |
| Analítica externa | no incluir GA4 ni similares (las peticiones pueden bloquearse); usar el módulo de analítica de Bridge | Technical Requirements 1.2.4 |
| Login externo | no es obligatorio para jugar; no forzar inicio de sesión al arrancar | Technical Requirements 1.2.1 y 1.2.2 |
| Bloqueo por URL | no limitar el funcionamiento según la URL desde la que se abre | Technical Requirements 1.2.7 |

Rutas relativas: Playgama no lo formula con la misma frase en el apartado 1.3, pero **sí es obligatorio** para YouTube Playables («Game MUST only use relative paths… MUST NOT use absolute paths»). Conviene que el `index.html` referencie CSS, JS, fuentes e imágenes con rutas relativas (`./…`), no con `/` absoluto ni con `https://`.

Fuente YouTube: https://developers.google.com/youtube/gaming/playables/certification/requirements_stability (apartados 8 y 9; actualizado 2026-10-26).

---

## 3. SDK Playgama Bridge: obligatorio, y cómo se integra

La integración del **Playgama Bridge SDK** es el requisito técnico principal de la subida. Sin Bridge no se puede publicar.

Fuentes:

- https://wiki.playgama.com/playgama/submitting-a-game («The main technical requirement is Playgama Bridge SDK integration.»)
- https://wiki.playgama.com/playgama/bridge-sdk/getting-started («SDK integration is required for submission»)
- https://wiki.playgama.com/playgama/faq/payments-and-statistics («If I don't want to include ads in the game, can I opt-out of using the SDK? No. Integration of the Playgama Bridge is a mandatory condition for uploading a game.»)
- https://wiki.playgama.com/playgama/game-requirements/technical-requirements (1.1.1 versión actual del SDK; 1.1.2 todos los *Required steps*)

La documentación de la consola/MCP añade que un archivo **sin versión de Bridge o sin config no es construible** (`ARCHIVE_NOT_BUILDABLE`), y que para publicar el sandbox el build debe llevar **Playgama Bridge 2.2.0 o posterior**.

Fuente: https://wiki.playgama.com/playgama/mcp/tools

### 3.1 Cómo cargar el SDK

Documentación de instalación: https://wiki.playgama.com/playgama/bridge-sdk/setup

Opciones oficiales:

1. **CDN (la que la guía llama recomendada para desarrollo):**

```html
<script src="https://bridge.playgama.com/v2/stable/playgama-bridge.js"></script>
```

2. **npm:** `npm i @playgama/bridge`, o plugin de Vite `@playgama/bridge/vite`. Para un build autónomo: `playgamaBridge({ mode: 'local' })`, o copiar `node_modules/@playgama/bridge/dist/playgama-bridge.js` al lado de `index.html`.

**Conflicto a resolver en el ZIP de entrega:** la guía de Setup recomienda el CDN, pero los Technical Requirements 1.2.5 exigen que **el juego no cargue recursos externos** y que todo viaje dentro del archivo. Para la entrega a Playgama, el camino alineado con 1.2.5 es **incluir `playgama-bridge.js` dentro del ZIP**, junto a `index.html`, y cargarlo con ruta relativa:

```html
<script src="./playgama-bridge.js"></script>
```

El script del SDK debe ser **el primer script del `<head>`**, cargado de forma normal: **no `async`**, no inyectado después desde código. La inicialización tiene que terminar **antes** de que el juego cargue motor y assets. En JS plano:

```javascript
bridge.initialize()
  .then(() => {
    // solo ahora se puede usar el SDK y empezar a cargar el juego
  })
  .catch((error) => {
    // error de inicialización
  });
```

No llamar a ninguna API del SDK antes de que termine `initialize()`.

Fuente de estas reglas: [API → Required steps](https://wiki.playgama.com/playgama/bridge-sdk/api) (pasos 1 y 2) y [Setup](https://wiki.playgama.com/playgama/bridge-sdk/setup).

### 3.2 Config obligatorio

Hay que incluir **`playgama-bridge-config.json` dentro del archivo, al lado de `index.html`**. Bridge lo carga desde `./playgama-bridge-config.json`. Si falta, no es accesible o no es válido, **falla el chequeo automático del build**.

Fuente: https://wiki.playgama.com/playgama/bridge-sdk/api (paso 1) y https://wiki.playgama.com/playgama/bridge-sdk/config

Editor oficial de la config: https://playgama.github.io/bridge-config-editor/

La config guarda identificadores de plataforma, colocaciones de anuncios, catálogo de pagos, clasificaciones, etc. Un ejemplo mínimo de bloque de anuncios (estructura tomada de la página de Config; los `id` de placement los define el juego):

```json
{
  "advertisement": {
    "minimumDelayBetweenInterstitial": 60,
    "interstitial": {
      "placements": [{ "id": "level_completed" }]
    }
  }
}
```

### 3.3 Pasos obligatorios (llamadas concretas)

Lista oficial, «mandatory for every game. Platforms verify them during moderation»: https://wiki.playgama.com/playgama/bridge-sdk/api

También detallados en:

- Plataforma: https://wiki.playgama.com/playgama/bridge-sdk/api/platform
- Guardado: https://wiki.playgama.com/playgama/bridge-sdk/api/storage
- Anuncios: https://wiki.playgama.com/playgama/bridge-sdk/api/advertisement
- Requisitos de anuncios y pagos: https://wiki.playgama.com/playgama/game-requirements/advertising-requirements

**1. Config en el archivo** — ver 3.2.

**2. Cargar e inicializar antes del juego** — ver 3.1. `bridge.initialize()`.

**3. Idioma de la plataforma**

Leer **una vez** después de inicializar, y usarlo como idioma fuente de la localización:

```javascript
bridge.platform.language
```

Formato: ISO 639-1 (ejemplos oficiales: `ru`, `en`). Si la plataforma no da idioma, Bridge usa el del navegador.

**4. Guardado solo por Storage**

Prohibido: `localStorage`, `sessionStorage`, IndexedDB, cookies o el sistema de guardado del motor (p. ej. `PlayerPrefs`).

Al arrancar, leer todas las claves de una vez y restaurar el estado **antes** de mostrar jugabilidad:

```javascript
bridge.storage.get(['key_1', 'key_2'])
  .then((data) => { /* data[n] es null si no hay valor */ })
  .catch((error) => { /* error */ });
```

Escribir solo cuando hay progreso significativo (nivel completado, compra, cambio de ajustes), todas las claves cambiadas en una llamada, nunca cada frame:

```javascript
bridge.storage.set(['key_1'], [valor])
```

(La página de Storage documenta `get`, `set` y `delete` con arrays de claves.)

**5. Pausa y audio**

Al arrancar:

```javascript
bridge.platform.isAudioEnabled
```

Si es `false`, el juego empieza silenciado. Después hay que reaccionar a los eventos de pausa y de estado de audio (la plataforma los dispara al cambiar de pestaña, minimizar o abrir un anuncio). Un juego que sigue sonando en segundo plano **no pasa moderación**.

La documentación de Platform llama a esto obligatorio y recomienda además mensajes de ciclo de vida (`level_started`, `level_completed`, etc.).

**6. Juego listo**

Cuando el **primer fotograma jugable** está listo y el jugador puede interactuar — nunca con una pantalla de carga todavía visible:

```javascript
bridge.platform.sendMessage('game_ready')
```

Las plataformas usan este mensaje para ocultar su propia pantalla de carga y arrancar analítica.

**7. Anuncios intersticiales (obligatorios)**

Llamar a `showInterstitial()` en **cada pausa natural** (cambio de nivel, game over, vuelta al menú). **No** añadir temporizadores ni contadores propios: Bridge decide si el anuncio se muestra, el retraso del primero y el intervalo entre ellos.

La página de Advertisement lo formula como módulo required. Los Advertising Requirements (2.1.2, 2.1.3, 2.1.6, 2.1.7) exigen intersticiales en pausas lógicas, nunca en medio de la partida, pausar sonido y juego durante el anuncio, y continuar con normalidad si el anuncio falla.

**8. Ocultar lo que la plataforma no soporta**

- Botones de rewarded si `isRewardedSupported` es `false`
- Tienda si `payments.isSupported` es `false`
- Clasificación si `leaderboards.type` es `not_available`
- Botones de inicio de sesión si `player.isAuthorizationSupported` es `false`
- Enlaces fuera de la plataforma si `platform.isExternalLinksAllowed` es `false`

Rewarded es **muy recomendable**, no figura como obligatorio en el mismo grado que el intersticial. Si se implementa: es opt-in, el jugador puede rechazarlo, la recompensa no bloquea el progreso normal, un «revive»/tiempo extra como máximo una vez por intento, y solo se concede si se ve el anuncio hasta el final (Advertising Requirements 2.2.1–2.2.5).

Otros requisitos de layout/dispositivo que la moderación también mira (no son llamadas del SDK, pero sí de la guía técnica): pantalla completa, controles táctiles y de teclado/ratón, no usar la tecla Esc, no scroll del navegador, que el juego llene la ventana (también en 1:1), textos legibles, sin errores ni cuelgues. Ver https://wiki.playgama.com/playgama/game-requirements/technical-requirements (apartados 1.4 a 1.8).

---

## 4. Portadas, iconos y media

### 4.1 Portadas de Playgama (tamaños exactos confirmados)

La ficha de la consola tiene **tres huecos de portada**, cada uno con un tamaño exacto. Hay que redimensionar **antes** de subir. Según la referencia oficial de herramientas MCP de Playgama:

| Hueco | Tamaño exacto (píxeles) |
|---|---|
| `square` | **800 × 800** |
| `portrait` | **1080 × 1920** |
| `landscape` | **1920 × 1080** |

- Tamaño máximo del archivo de cada portada: **10 MB** (10 485 760 bytes).
- El ejemplo oficial de subida usa PNG (`Content-Type: image/png`). Otros formatos: la herramienta pide el formato real y lo comprueba al confirmar; la lista cerrada de formatos aceptados **no está transcrita con más detalle** en esa página.

Fuente: https://wiki.playgama.com/playgama/mcp/tools (apartado «Covers»).

Las tres son **necesarias para enviar a moderación y para publicar el sandbox**. Si falta alguna, la consola rechaza con `COVERS_INCOMPLETE`. Publicar el sandbox también exige título en inglés (sin letras no latinas) y categoría.

Fuente: la misma página (`get_submission_state`, `publish_sandbox`).

**Matiz:** la guía «Submitting a game» dice que el campo Media (capturas, portadas, iconos y vídeos) es **opcional**, aunque un buen material mejora el catálogo. La consola/MCP, en cambio, trata las **tres portadas como bloqueantes** para el envío y el sandbox. Para no quedarse parado en la consola, hay que entregar las tres.

Fuente del «opcional»: https://wiki.playgama.com/playgama/submitting-a-game

### 4.2 Iconos y capturas (catálogo Playgama)

En «Submitting a game» se mencionan «screenshots, covers, icons, and videos», **sin tamaños en píxeles**.

Los tamaños 512×512 (icono) o «capturas de al menos 1280 px de ancho» aparecen en la guía de **Playgama Wrap** (web propia del juego), no como requisitos del formulario de catálogo:

- https://wiki.playgama.com/playgama/guides/deploy-a-game-on-your-own-domain/deploy-with-playgama-wrap

**Tamaños exactos de icono y de capturas para el catálogo de Playgama: no confirmados** en la documentación de subida consultada. No usar los tamaños de Wrap como si fueran los del catálogo.

### 4.3 Relación con el brief interno de Dana Games

La auditoría de calidad del 15/11/2026 (`/workspace/dana-games-kit/auditoria-calidad.md`) exige exactamente `cover_800x800.png`, `cover_1080x1920.png` y `cover_1920x1080.png`. Esos tres tamaños **coinciden** con los huecos oficiales de Playgama (apartado 4.1). El rechazo de Metro, Mudanza y Estampida por no traer esas tres portadas es, por tanto, también un bloqueo real de consola (`COVERS_INCOMPLETE`).

La auditoría pide además un **sello Dana Games** en una esquina de las tres portadas. Eso es una norma interna del estudio. En YouTube Playables, la documentación oficial dice: «Developer MUST NOT include any branding or logos in the thumbnails, description, or title» (https://developers.google.com/youtube/gaming/playables/certification/requirements_design, apartado 4, actualizado 2026-10-26). **Hay tensión entre el sello del estudio y la regla de YouTube.** En las portadas que Playgama use para enviar a YouTube, este punto hay que resolverlo con el Director antes de exportar el sello. En la documentación de Playgama del catálogo **no** aparece una prohibición equivalente de logo de estudio (no confirmado que lo prohíban; tampoco que lo pidan).

---

## 5. Campos de la ficha e idiomas

Campos del formulario de subida, según https://wiki.playgama.com/playgama/submitting-a-game

Los marcados con * son los que la propia página señala como obligatorios:

| Campo | Qué pide la guía |
|---|---|
| **Title*** | El que se ve en el catálogo y en la búsqueda. Nombre corto y memorable de 2–4 palabras, **igual al título que muestra el juego**. |
| **Game Engine*** | Motor usado. |
| **Game Archive*** | El ZIP (véase §2). |
| **Description*** | Descripción breve: idea, género y qué lo distingue. |
| **How to play*** | Instrucciones cortas para el jugador: reglas, controles y objetivo. |
| **Supported Devices*** | Dispositivos y navegadores soportados. Sirve de filtro automático del catálogo (si solo se marca Mobile - iOS, un usuario Android no verá el juego). |
| **Screen Orientation** | Orientación móvil soportada. Si el juego solo soporta una, hay que marcarla: en la contraria la plataforma muestra un aviso para girar el dispositivo (Technical Requirements 1.4.3). |
| **Game Features** | Todas las características que incluye el juego. |
| **Game Languages*** | **Todos** los idiomas que el juego soporta de verdad. |
| **Media** | Capturas, portadas, iconos y vídeos (véase §4). |
| **Distribution*** | Además de Playgama, el juego puede ir a plataformas partner. Se revisan los requisitos de cada una. Si se quiere **excluir** alguna, se marca en la lista. |
| **Link** | Si el juego ya está publicado en otro sitio, poner el enlace. |

La consola/MCP añade requisitos de envío que la página de «Submitting» no detalla: título en **inglés** y **sin letras no latinas** para el envío/sandbox, y una **categoría** guardada. Si el formulario no pasa: `FORM_INCOMPLETE`.

Fuente: https://wiki.playgama.com/playgama/mcp/tools

Idioma **dentro del juego:** no basta con declararlo en la ficha. Hay que leer `bridge.platform.language` (§3.3, paso 3) y localizar de verdad esos idiomas.

---

## 6. Revisión y tiempos

Flujo (https://wiki.playgama.com/playgama/submitting-a-game y https://wiki.playgama.com/playgama/quick-start):

1. Preparar el juego contra los Game Requirements (hay una [lista de auto-chequeo](https://wiki.playgama.com/playgama/game-requirements/game-self-check)).
2. Add Game → rellenar ficha y ZIP.
3. **Test Game** (QA Tool) en la propia consola.
4. **Submit Game**. Se puede seguir actualizando y reenviar después.
5. El estado sale en el Dashboard. En el **primer juego**, el equipo de moderación contacta en unos días, abre un chat y da novedades.

Tiempos publicados (hay dos cifras para Playgama; se citan las dos):

| Destino | Tiempo publicado | Fuente |
|---|---|---|
| Publicar en Playgama, si no hay problemas | **1–5 días laborables** | [Submitting a game](https://wiki.playgama.com/playgama/submitting-a-game) |
| Moderación en Playgama | **3–5 días laborables** | [FAQ Game Moderation](https://wiki.playgama.com/playgama/faq/game-moderation) |
| Plataformas partner, en general | **hasta 2 semanas** | las dos páginas anteriores |
| YouTube Playables **a través de Playgama** | **2–4 semanas** | [How to Publish Your Game on YouTube Playables](https://wiki.playgama.com/platforms/how-to-publish-your-game-on-youtube-playables) |

Publicar en Playgama y en sus partners es **gratuito**, según la FAQ de pagos.

---

## 7. Monetización (solo descripción; no se tocan pagos ni datos fiscales)

Fuente: https://wiki.playgama.com/playgama/faq/payments-and-statistics

- El juego gana con **anuncios** mostrados durante la partida, a través de Bridge. Algunos juegos pueden incluir compras dentro del juego, también solo por el módulo de payments de Bridge (Advertising and Payments Requirements 2.4).
- En **sitios partner**, la compensación se calcula sobre el *Net Revenue* mensual: 70 % hasta 1.000 USD; 700 USD + 80 % de lo que exceda 1.000 USD, hasta 3.000 USD; 2.300 USD + 90 % de lo que exceda 3.000 USD.
- En **Playgama.com** y en la red de partners que incrustan por iframe, la compensación es un **50 % fijo**.
- Umbral de retirada publicado: 100 USD.
- Métodos mencionados por Playgama: transferencia a cuenta bancaria; criptomonedas bajo petición. **No se configura nada de eso en este documento.**
- Integrar Bridge es obligatorio aunque no se quieran anuncios (la FAQ lo deja explícito). En la práctica, el intersticial en pausas naturales es un *required step*.

En YouTube Playables, Playgama indica que las compras in-app, los banners y los anuncios intrínsecos **no funcionan** (el juego no puede hacer llamadas externas). Lo que sí hay que enganchar son intersticiales y rewarded, comprobando antes si la plataforma los soporta, porque la monetización se está desplegando por regiones.

Fuente: https://wiki.playgama.com/platforms/youtube-playables-requirements-for-games

---

## 8. YouTube Playables a través de Playgama

Dana Games publicará en YouTube Playables **por esta vía**, no abriendo cuenta directa en Google.

### 8.1 Cómo funciona la vía partner

Playgama se presenta como partner oficial de YouTube Playables. El estudio:

1. Integra **Playgama Bridge** (incluye los bindings de YouTube; no hace falta una cuenta de desarrollador de YouTube).
2. Crea/usa la cuenta de Playgama y sube el ZIP en https://developer.playgama.com/
3. Playgama hace QA con la Test Suite oficial de YouTube, revisa requisitos de la plataforma y, si el build está limpio, **lo envía a certificación** y habla con el equipo de partnership de YouTube.

Fuentes:

- https://wiki.playgama.com/platforms/how-to-publish-your-game-on-youtube-playables
- https://wiki.playgama.com/playgama/game-requirements/platform-specific-requirements (apartado YouTube Playables)
- https://playgama.com/developers («Playgama already holds master publisher accounts with Youtube…»)

La vía **directa** (solo como contexto; no es el plan del estudio): el acceso al Playables Developer Portal está en *early access* / *Private Preview*, por invitación. Hay que rellenar el formulario oficial de interés, esperar aprobación (Playgama dice que puede tardar semanas o meses), tener permiso de Channel Manager en YouTube Studio e integrar el SDK nativo de Playables.

- Portal y requisitos de acceso: https://developers.google.com/youtube/gaming/playables y https://developers.google.com/youtube/gaming/playables/developer_portal
- Formulario oficial de interés, enlazado desde la página de contacto de Google: https://docs.google.com/forms/d/e/1FAIpQLSdvdQ0lgIq2369aemj1O6w8R8FwGn9O5ARRGODDDUbVINCRJQ/viewform  
  Fuente de ese enlace: https://developers.google.com/youtube/gaming/playables/support/contact

### 8.2 SDK en la vía Playgama

Por la vía partner basta **Playgama Bridge** (mismos *required steps* del §3). No se ha encontrado en la wiki de Playgama la instrucción de cargar además el script nativo `https://www.youtube.com/game_api/v1` cuando se publica a través de ellos: Bridge «automatically loads that platform's native scripts» en un entorno soportado.

Fuente: https://wiki.playgama.com/playgama/bridge-sdk/getting-started y https://wiki.playgama.com/playgama/bridge-sdk/setup

Si alguien publicara **en directo** con Google, el SDK nativo es obligatorio y debe cargarse **antes de cualquier código del juego**:

```html
<script src="https://www.youtube.com/game_api/v1"></script>
```

Llamadas nativas obligatorias (solo relevantes en la vía directa, o como referencia de lo que Bridge tiene que cubrir): `ytgame.game.firstFrameReady()`, `ytgame.game.gameReady()`, audio (`isAudioEnabled` / `onAudioEnabledChange`), pausa/resume, y cloud save (`loadData` / `saveData`). No usar otros mecanismos de guardado.

Fuentes: https://developers.google.com/youtube/gaming/playables/reference/getting_started y https://developers.google.com/youtube/gaming/playables/certification/requirements_integration (actualizado 2026-10-26).

### 8.3 Requisitos extra de YouTube (el build tiene que cumplirlos igual)

Documentación de Google (oficial, 2026-10-26) y el resumen de Playgama para partners.

**Tamaños y archivos** — https://developers.google.com/youtube/gaming/playables/certification/requirements_stability

| Regla | Valor oficial de Google |
|---|---|
| Carga inicial (hasta `gameReady`) | **MUST** &lt; **30 MiB**; SHOULD &lt; 15 MiB |
| Bundle total | **MUST** &lt; **250 MiB** (excepciones en la FAQ de Google) |
| Cada archivo suelto | **MUST** &lt; **30 MiB**; SHOULD &lt; 512 KiB |
| Guardado | **MUST** &lt; 3 MiB; SHOULD &lt; 500 KiB |
| Tiempo de carga | SHOULD jugable en menos de 5 s |
| Heap JavaScript | pico **MUST NOT** superar **512 MB** |
| Rutas | solo relativas |
| Nombres de archivo | solo alfanuméricos y `_`, `-`, `.` |
| Número de archivos | como máximo **8.000** |

Playgama, en su propia página de requisitos de YouTube, resume: carga inicial &lt; 30 MB, ningún archivo &gt; 30 MB, ZIP «hasta 200 MB», «no compression» (sí un fallback de descompresión), sin llamadas externas, ≤ 8.000 archivos, nombres sin caracteres especiales ni espacios.

Fuente Playgama: https://wiki.playgama.com/platforms/youtube-playables-requirements-for-games y https://wiki.playgama.com/playgama/game-requirements/platform-specific-requirements

**Discrepancia de techo del ZIP/bundle:** Google dice **250 MiB** de bundle total; Playgama habla de **200 MB**. Hasta que un revisor de Playgama no diga otra cosa, para un build destinado a YouTube conviene **no superar 200 MB**, que es el número más estricto de los dos, y dejar constancia de la diferencia.

La frase «YouTube does not allow any compression» está en la wiki de Playgama, **no** en la página actual de *Stability and performance requirements* de Google (esa página habla de compresión HTTP a la hora de *medir* el transfer size). Tratar el «no compression» como requisito **afirmado por Playgama**, no como cita literal de Google en 2026-10-26.

Otros requisitos que Playgama lista para seleccionar juegos de YouTube (https://wiki.playgama.com/playgama/game-requirements/platform-specific-requirements):

- Soporte de **retrato y apaisado bien adaptado, sin bandas negras**.
- Funcionar en todo tipo de dispositivos.
- Tiempo medio de partida alto (Playgama: «ideally over 8 minutes»; en su guía larga, «alrededor de 10 minutos», no como regla rígida).
- Sin llamadas externas, incluida analítica embebida.
- Único y original; no aceptan refundidos o copias de juegos conocidos.
- En escritorio, sin barras negras/difuminadas a los lados.
- No un título hecho principalmente con IA generativa que no aporte valor al jugador.
- YouTube acepta pocos juegos; Playgama elige, junto con YouTube, los que mejor encajan.

**Orientación y layout** (Google, Design requirements): el juego **MUST** ser responsive en todos los aspect ratios (ejemplos: 9:32, 9:21, 9:16, 3:4, 1:1, 4:3, 16:9, 21:9, 32:9), **MUST NOT** bloquear la orientación del dispositivo, y **MUST** mantener el estado al redimensionar. Touch y ratón son obligatorios para todas las interacciones.

**Miniaturas de YouTube:** la página oficial de Design requirements exige miniaturas en «several different aspect ratios» y, en el resumen de esa misma página, nombra **1:1, 5:7 y 16:9**, un vídeo preview 16:9, título (máx. 50 caracteres) y descripción corta (máx. 150 caracteres). **Los píxeles exactos de esas miniaturas no están en el cuerpo actual** de https://developers.google.com/youtube/gaming/playables/certification/requirements_design (actualizado 2026-10-26). No inventar un tamaño en píxeles. En la vía Playgama, las portadas que sí están confirmadas al píxel son las tres de Playgama (§4.1): 800×800 (1:1) y 1920×1080 (16:9) cubren dos de esas proporciones; **5:7 en píxeles exactos: no confirmado**.

Recuerdo: en YouTube, **ni logos ni marca en las miniaturas** (apartado 4.3).

---

## 9. Relación con la auditoría de calidad (15/11/2026)

Informe: `/workspace/dana-games-kit/auditoria-calidad.md`

Arte y Calidad ha dejado **no aprobados** Metro Nightmare, Mudanza Extrema y Estampida en las Rebajas. Ninguno se publica todavía. Lo que de esa auditoría **conecta con requisitos de Playgama / Playables**:

1. **Faltan las tres portadas 800×800, 1080×1920 y 1920×1080** en los tres juegos (o no están en esos tamaños: Metro y Mudanza solo tienen 512 y 800×470; Estampida no tiene ninguna). Eso coincide con los huecos exactos de la consola y bloquea el envío (`COVERS_INCOMPLETE`). Es el fallo común que la auditoría señala, y también lo es para Playgama.
2. **No hay `listing.txt` / ficha** en las carpetas auditadas. La consola exige título, motor, descripción, how to play, dispositivos, idiomas, etc. (§5). Sin ficha no se puede completar el formulario.
3. **Título cortado en portadas de Mudanza (512: «Mayhen»).** El título de la ficha tiene que coincidir con el del juego, y una portada con el nombre partido no es aceptable para catálogo. No basta con escalar esas 512 al 800×800: el recorte se mantiene.
4. **Layout, recortes, botones pequeños, elementos que se salen del marco, letterboxing en el Short de Metro (720×1280 con bandas).** Encajan con Technical Requirements 1.6 (el juego debe llenar el área, sin elementos cortados, textos legibles, también en 1:1) y con el requisito de YouTube/Playgama de **no bandas negras** y de rellenar el viewport.
5. **Sello Dana Games en portadas** (lo pide la auditoría; YouTube prohíbe branding en thumbnails). Pendiente de criterio del Director si esas portadas van a YouTube a través de Playgama.

El resto de la auditoría (madre flotando, botón vacío, chip EN tapando el logo, SND diminuto, Short con arte antiguo, etc.) es calidad visual/UX del estudio, no un párrafo literal de la wiki de Playgama, aunque un build con textos tapados, botones rotos o personajes fuera de marco también choca con 1.6 y 1.7 (estabilidad, nada recortado, se puede completar el juego).

---

## 10. Checklist breve para nuevas entregas

Antes de pedir al Director que se suba un juego a https://developer.playgama.com/ (cuenta ya existente, estudio «Tetris Human Games»):

**ZIP**

- [ ] Un solo ZIP; `index.html` en la **raíz**, no en una subcarpeta.
- [ ] Peso del contenido ≤ **300 MB** (y, si el juego va a YouTube, conviene ≤ **200 MB** por la cifra de Playgama; Google permite 250 MiB).
- [ ] Nombres solo latinos; para YouTube, solo letras, dígitos, `_`, `-`, `.` (sin espacios).
- [ ] Rutas **relativas** en `index.html` y en el resto del build. Cero dependencias de CDN, analítica externa o fuentes remotas (Technical Requirements 1.2.4 y 1.2.5).
- [ ] Carga inicial hasta el momento de `game_ready` &lt; **30 MiB** si el destino incluye YouTube; ningún archivo suelto ≥ 30 MiB; ≤ 8.000 archivos.
- [ ] El juego arranca sin login externo y no se rompe al cambiar de URL.

**Bridge (obligatorio)**

- [ ] `playgama-bridge.js` **dentro** del ZIP, al lado de `index.html`. **Norma del Director (15/11/2026):** se comprueba antes de cada subida; un ZIP sin el Bridge como primer script no se sube.
- [ ] Ese script es el **primero** del `<head>`, sin `async`.
- [ ] `playgama-bridge-config.json` al lado de `index.html`, válido.
- [ ] Se llama `bridge.initialize()` y se espera la promesa **antes** de cargar motor y assets. Versión **2.2.0 o posterior**.
- [ ] Tras init: se lee `bridge.platform.language` y se aplica la localización.
- [ ] Carga y guardado **solo** con `bridge.storage.get` / `bridge.storage.set`. Nada de `localStorage` ni equivalentes.
- [ ] Se respeta `platform.isAudioEnabled` y los eventos de pausa/audio (silencio al cambiar de pestaña o abrir un anuncio).
- [ ] `bridge.platform.sendMessage('game_ready')` solo cuando el primer fotograma ya es jugable.
- [ ] `showInterstitial()` en cada pausa natural, sin temporizador propio. Rewarded opt-in si se ofrece, oculto si `isRewardedSupported` es `false`.

**Ficha y media**

- [ ] Título de 2–4 palabras, en inglés para la consola, **igual** al del juego, sin letras no latinas.
- [ ] Descripción, How to play, motor, dispositivos, orientación, idiomas **reales**, features, distribución (y exclusiones, si las hay).
- [ ] Tres portadas exactas: **800×800**, **1080×1920**, **1920×1080**, ≤ 10 MB cada una, sin título cortado.
- [ ] **Norma del Director (15/11/2026): dos juegos de portadas.** Las de Playgama llevan el sello Dana Games. Las de YouTube Playables van **sin sello ni logotipos** y con el sufijo `-youtube` en el nombre del archivo (p. ej. `cover_800x800-youtube.png`).
- [ ] Probar en la **QA Tool** de la consola (*Test Game*) antes de *Submit Game*.

**Calidad de pantalla (Playgama 1.6 / 1.7 y YouTube)**

- [ ] Vertical y horizontal, también en ventana 1:1, sin bandas negras, sin HUD ni textos cortados, sin solapes, botones utilizables al toque.
- [ ] Sin errores de consola ni recursos 404. El juego se puede terminar.
- [ ] Pasar antes el filtro interno de Arte y Calidad; un rechazo de portadas o de recortes es también un rechazo de publicación.

---

## 11. Lo que no se ha podido confirmar

- Tamaño exacto en píxeles de **iconos** y **capturas** del catálogo de Playgama (el formulario los nombra sin medidas; los 512×512 / 1280 px de Wrap son de otro producto).
- Lista cerrada de **formatos de imagen** aceptados en las portadas de la consola, más allá del ejemplo oficial en PNG y del tope de 10 MB.
- Píxeles exactos de las miniaturas de **YouTube Playables** (sí las proporciones 1:1, 5:7 y 16:9 en el resumen de la página oficial de Design requirements; el cuerpo actual no lista resoluciones).
- Si Playgama, al enviar a YouTube, reutiliza las tres portadas del catálogo o pide miniaturas 5:7 aparte.
- Cuál de las dos cifras de moderación en Playgama (1–5 o 3–5 días laborables) se aplica en la práctica; están las dos en páginas oficiales distintas.
- El alcance exacto de «YouTube does not allow any compression» (lo afirma Playgama; no aparece así en la página actual de Stability de Google).

---

## 12. Nota de trabajo (zips ya mirados; no es una aprobación)

La preparación de fichas y portadas se **detuvo** al llegar el rechazo de Arte y Calidad. No se ha subido nada, no se ha creado cuenta ni se ha iniciado sesión, no se han tocado pagos ni se han modificado los ZIP originales.

- **Estampida en las Rebajas:** el Director la devolvió a ronda antes de las pruebas; no se testeó ni se preparó ficha. La auditoría posterior la mantiene no aprobada.
- **Mudanza Extrema** (`mudanza-extrema-playgama.zip`): inspección del ZIP y prueba local en Chromium (headless) a 390×844, 844×390 y 1280×720. El juego **carga** (hay canvas), **sin errores de consola**, **sin 404** y **sin peticiones a dominios externos**. `index.html` está en la raíz, con rutas relativas. Hay `playgama-bridge-config.json` y el código ya contempla `initialize`, `game_ready`, Storage, intersticial (`level_completed`), rewarded (`pack_boost`), idioma y audio/pausa, **pero el ZIP no incluye `playgama-bridge.js` y el `index.html` no carga el SDK**. Además hay *fallback* a `localStorage`, prohibido por los Required steps. Las portadas de la carpeta del juego son 512×512 (título cortado) y 800×470, no los tamaños de consola. Capturas de esa prueba: `/workspace/dana-games-kit/juegos-aprobados/mudanza-extrema/qa/`. Se habían empezado tres portadas a tamaño de consola en `…/mudanza-extrema/playgama-ficha/` (sin ficha escrita, sin revisión final ni sello); **quedan como están, no seguir con ellas**.
- **Metro Nightmare** (zip final `juegos-aprobados/metro-nightmare/metro-nightmare-playgama.zip`, no los v1/v2 de `/workspace/playgama-upload`): se descomprimió e inspeccionó, **sin prueba de navegador completa** (se interrumpió al cambiar el plan). En raíz: `index.html`, `playgama-bridge.js` (primer script del `<head>`), `playgama-bridge-config.json`, e `initialize()` antes del módulo del juego. Rutas relativas, nombres latinos, ZIP ≈ 5,7 MB / descomprimido ≈ 7,5 MB (por debajo de 30 MiB de carga inicial). El código incluye `game_ready`, Storage, intersticial (`level_completed`) y rewarded (`extra_seconds`). Portadas en carpeta: 512 y 800×470, no los tres tamaños de consola. Carpeta `playgama-ficha/` de Metro: vacía.

Skills usadas en este encargo: `smoke-testing-web-games` (salud de runtime en local, solo Mudanza), lectura de `probing-web-game-mechanics` (no se llegó a inyectar estado), y las normas de `/workspace/dana-games-kit/NORMAS-EQUIPO.md`.
