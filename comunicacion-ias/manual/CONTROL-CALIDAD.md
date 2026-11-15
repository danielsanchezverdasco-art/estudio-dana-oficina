# Control de calidad · Dana Games

Prueba completa, estética y de funcionamiento. El nivel mínimo es **Metro Nightmare** (arte de `referencia-estilo-metro.png` y `referencia-estilo-metro-menu.png` del kit). Si una pantalla queda por debajo, se devuelve.

Criterios tomados de `kit/NORMAS-EQUIPO.md`, `kit/brief-juego-comun.md`, `kit/GUIA-AYUDANTES.md`, la skill «Estándares de calidad de Daniel» y los informes de `auditoria-calidad.md` / `revision-pendiente/`.

No se publica nada sin un **APROBADO** firmado. Ver la regla de autorrevisión al final.

## 1. Estándares de Daniel (repasadlos antes de enseñar nada)

1. Simple, intuitivo y adictivo. Una sola mecánica que se entiende al primer toque, sin leer un muro de texto. Lección: Metro Nightmare no se entendía y se rehízo al estilo Bus Jam.
2. Simple no significa feo. Calidad visual máxima: animaciones, jugo, menú vistoso y portadas que atraen a primera vista.
3. Cada juego nuevo es de un género distinto al anterior.
4. Ingeniería inversa de los mejores del género y superarlos en al menos 3 puntos concretos, apuntados en `teardown.md`. Se copia la técnica, nunca el código ni el arte.
5. Estilo realista de videojuego (15/11/2026): nada de dibujos planos ni clip-art. Personajes con volumen, texturas, luces y sombras. Lo que quede por debajo de la referencia de Metro se rechaza.
6. Personajes sin deformar: escala uniforme. Nunca estirar un sprite para llenar un hueco.
7. Optimizado para móvil: vertical primero (390×844), táctil, botones grandes (acciones principales ≥ 88 px; mínimo absoluto 48 px), carga rápida.
8. Nada flotando ni recortado ni solapado. Sin zonas vacías. Sin textos cortados.
9. Portadas reales, nunca un marcador de posición.
10. Menú principal: escena ilustrada e interactiva, no un título estático con botones. El menú se siente como un juguete.
11. El primer nivel es un tutorial con la mano oficial, que señala exactamente qué tocar.
12. Solo datos reales. Lo que no tenga fuente: «sin datos aún».
13. Español al hablar con Daniel. En el juego y en la ficha: **inglés primero**, español segundo.
14. Filtro antes de revisar: no se revisa un juego sin `skills-usadas.md`, `filtro-visual.md` (comparado con Metro) y `filtro-jugabilidad.md`.
15. Sin la entrega completa no hay revisión (zip, portadas, ficha, capturas, GIF, auditorías y teardown). El Short puede ir en paralelo, pero no se publica el juego sin el APROBADO.

«No quiero errores.» Si algo no cumple esta lista, se arregla antes de enseñarlo.

## 2. Normas fijas que bloquean si fallan

- **Sello oficial único:** `kit/dana-games_badge_360w@2x.png` (mascota morada con cascos + DANA GAMES). Nada de tarjetas moradas ni píldoras blancas propias. En portadas de Playgama: arriba o en una esquina superior, nunca en el 20 % inferior. La mascota debe medir ≥ 60 px en la portada de 800×800.
- **Portadas YouTube** (`*-youtube`, sin sello), pero con el título del juego. YouTube Playables no admite marca en miniaturas.
- **Mano oficial:** `kit/mano-tutorial.png`. Índice señalando. Nunca un puño con un dedo central levantado (en Estampida r12 esa mano se podía leer como una peineta y bloqueó la ronda).
- **Zip ≤ 5 MB.** Esta cifra del Director sustituye a otras (15 MB del brief, 300 MB de Playgama). Interfaz en WebP de calidad ~82, fuentes en WOFF2, sin duplicados ni archivos de prueba.
- **Sin `window.__*`** ni parámetros de prueba en el zip de producción. Sin código de test. Sin nombres de juegos de otras empresas en la ficha o en etiquetas.
- **Bridge dentro del zip**, primer script del `<head>` (sin `async`), junto a `playgama-bridge-config.json`. `initialize()` termina antes de cargar el motor. Se envía `game_ready` cuando el primer fotograma ya es jugable. El progreso sobrevive a recargar con `bridge.storage`.
- **Zonas táctiles:** en Phaser, hitArea en coordenadas locales con la esquina en 0: `new Phaser.Geom.Rectangle(0, 0, w, h)`. Nunca `Rectangle(-w/2, -h/2, w, h)`. Al pulsar, la zona no se encoge.
- **Inglés por defecto.** El juego arranca en inglés con `en`, `fr`, `de`, `pt`, `it`, `ja`, idioma vacío o sin idioma. Solo pasa a español con `es` o `es-MX` (y equivalentes). Cero palabras en español en las pantallas en inglés y en el bloque EN de la ficha.

## 3. Capturas y materiales obligatorios

Medidas del brief y de las auditorías. Todas las capturas de juego en **390×844**, con toques reales, no recortes inventados.

Capturas de juego (mínimo 6, más menú y mapa para la revisión):

- [ ] Inicio / menú (escena viva).
- [ ] Tutorial (mano oficial en acción).
- [ ] Juego × 3 (momentos distintos, no la misma pantalla tres veces).
- [ ] Victoria.
- [ ] Fallo.
- [ ] Mapa o selección de nivel, si existe.
- [ ] Móvil en **vertical** (390×844).
- [ ] Móvil en **horizontal** (el juego no se rompe: llena la ventana, sin bandas negras ni elementos fuera).

Portadas:

- [ ] `cover_800x800.png` (Playgama, con sello).
- [ ] `cover_1080x1920.png` (Playgama, con sello).
- [ ] `cover_1920x1080.png` (Playgama, con sello).
- [ ] Las mismas tres en versión `-youtube`, **sin sello**, con el título.

Otros:

- [ ] GIF de jugabilidad: 8–10 s, ≥ 12 fps, ≥ 360 px de ancho, acaba en victoria.
- [ ] `listing.txt` con bloque EN primero y bloque ES segundo. El EN sin palabras en español ni nombres ajenos. Sin frases provisionales del tipo «Play link: the Playgama page, when it exists».
- [ ] `skills-usadas.md`, `filtro-visual.md`, `filtro-jugabilidad.md`, `teardown.md`, `informe-rondaN.md`.
- [ ] Zip de producción y, aparte, la build de pruebas (nunca mezcladas).

## 4. Prueba de zonas táctiles

Obligatoria en cada ronda, con toques reales (no solo clics de ratón). En las auditorías se usó Chromium headless a 390×844, `touchscreen.tap`, **8 px hacia dentro** del borde visible (en los círculos, en la diagonal a ~0,7 del radio). Cada toque, en una partida limpia si hace falta.

Para **cada** botón, pestaña, carta o nodo:

- [ ] Centro: responde a la acción correcta.
- [ ] Esquina superior izquierda.
- [ ] Esquina superior derecha.
- [ ] Esquina inferior izquierda.
- [ ] Esquina inferior derecha.
- [ ] Un punto **fuera** del botón no dispara esa acción.
- [ ] Un hueco entre dos botones no dispara ninguno, o no dispara el equivocado.
- [ ] Tocar el centro de un botón no ejecuta el de al lado (fallo típico: en Estampida r12, el centro de VOLVER abría el nivel y la esquina de OTRA iba al menú).

Los botones principales miden al menos 88 px.

## 5. Prueba de idioma y de producción

- [ ] Arranque en inglés por defecto (lista de idiomas de la sección 2).
- [ ] Arranque en español solo con locale español.
- [ ] Ningún solape, corte ni mezcla de idiomas en esas pasadas.
- [ ] El título de la pestaña y `lang` coinciden con el idioma activo.
- [ ] Zip ≤ 5 MB, `index.html` en la raíz, rutas relativas, nombres latinos.
- [ ] `playgama-bridge.js` es el primer script. No hay `window.__*` en producción.
- [ ] Cero errores de consola.
- [ ] Guardado: se guarda, se recarga, el progreso sigue ahí (`bridge.storage`).
- [ ] Anuncios en pausas naturales (intersticial al completar nivel, no en el primero ni a mitad de ronda; rewarded en un boost útil). El audio se calla durante el anuncio. Esto se confirma del todo en el QA Tool de Playgama, con anuncios reales.

## 6. Lista de los fallos que más se repitieron (Estampida, Mudanza y Metro)

Sacada de `auditoria-calidad.md` y de las rondas en `revision-pendiente/`. Comprobadla una a una antes de entregar.

1. **Entrega incompleta.** Faltan las tres portadas del brief (800×800, 1080×1920, 1920×1080), el `listing.txt`, el GIF o las hojas de control. Fue el fallo común de la primera auditoría de los tres juegos. Sin eso, no hay revisión.
2. **Reentregar lo mismo.** En Estampida, el zip y la captura eran idénticos byte a byte a una ronda ya rechazada. Siempre se comprueba que el archivo haya cambiado de verdad.
3. **Textos cortados o solapados.** Título «Mayhen» en portadas de Mudanza; chip EN tapando el logo en Metro; textos tenues o fuera de su placa.
4. **Personajes o UI fuera de marco.** Personas que se salen del panel de fallo (Metro); la madre flotando sobre la ventana (Mudanza); botones desplazados o sin icono.
5. **Zonas táctiles mal ancladas.** El centro o las esquinas no responden, o disparan otro botón. Volvió a salir en Estampida r12 después de rondas anteriores.
6. **Zip por encima de 5 MB.** Mudanza r7 pesaba más del doble del límite. Luego bajó a 1,67–1,68 MB y pasó.
7. **GIF que no cumple** (duración, tamaño, fps o no acaba en victoria).
8. **Sello mal puesto o ausente.** O, al revés, sello en una portada que iba a YouTube.
9. **Mano incorrecta.** Puño o gesto ambiguo en lugar del índice que señala.
10. **Restos de prueba en producción** (`window.__*`, parámetros `?pt` o `?debug` dejados en el zip que se sube).
11. **Nombres de juegos ajenos en la ficha** (Mudanza r8). También, más tarde, palabras en español dentro del bloque EN (norma de idioma del 15/11).
12. **Pantallas por debajo de Metro:** arte plano, iconos de clip-art, Shorts que enseñan una versión antigua del juego (Mudanza y Metro).
13. **Fallos nuevos en cada ronda** mientras se arreglan los viejos (tienda, victoria, mapa, portadas). Hay que volver a pasar la lista completa, no solo los puntos del informe anterior.
14. **Filtros del equipo no fiables.** Arte y Calidad no se fía de `filtro-visual.md` ni del informe: abre el zip, mide y juega. Vosotras debéis hacer lo mismo al revisaros.

## 7. Cómo hacer la prueba (paso a paso)

1. Inventario de la carpeta: cada archivo del apartado 3, con bytes y medidas reales (ancho × alto).
2. Descomprimir el zip y mirar la raíz: `index.html`, `playgama-bridge.js`, `playgama-bridge-config.json`. Buscar `window.__` en el código de producción.
3. Jugar la build a 390×844 con toques reales: menú, tutorial, un nivel, victoria, fallo, mapa, tienda o ajustes si existen. En inglés y en español.
4. Pasar las 5 zonas de cada botón y un toque fuera.
5. Recargar y comprobar el guardado.
6. Abrir también en horizontal y, si podéis, en un ancho tipo escritorio. El juego llena la ventana.
7. Comparar cada pantalla con la referencia de Metro. Anotar en `filtro-visual.md` si pasa o no.
8. Jugar el primer toque sin leer: si no se entiende, no está listo (`filtro-jugabilidad.md`).
9. Revisar portadas al píxel: título entero, sello bien colocado, sin recortes.
10. Solo entonces se escribe el veredicto.

## 8. Ficha de calidad `review.json`

En el repositorio público **no hay** un `REVISIONES.md`. El esquema que sigue es el que la oficina acepta al leer `revisiones/<slug>/review.json` (parser de `assets/index-19448e21.js`). Si un campo no cumple el tipo, la oficina lo ignora o lo sustituye por un valor por defecto.

También hacen falta, en la misma carpeta:

- `revisiones/index.json` → `{ "slugs": ["metro-nightmare", "mudanza-extrema"] }` (sin `..` en los slugs).
- `revisiones/<slug>/skills-usadas.json`
- `revisiones/<slug>/filtro-visual.json`
- `revisiones/<slug>/filtro-jugabilidad.json`

A día 15/11/2026, `revisiones/index.json` publicado tiene `"slugs": []`. Las fichas aún no se ven en la oficina.

### `review.json`

```json
{
  "titulo": "Moving Mayhem",
  "veredicto": "En revisión",
  "playgama": "https://playgama.ai/play/....",
  "gif": "revisiones/mudanza-extrema/play.gif",
  "diseno": {
    "arte": 8,
    "animaciones": 8,
    "efectos": 7,
    "menu": 8,
    "legibilidad": 8,
    "portada": 8
  },
  "jugabilidad": {
    "primerToque": 8,
    "controles": 8,
    "dificultad": 7,
    "progresion": 7,
    "fluidez": 8,
    "anuncios": 6
  },
  "tecnico": {
    "carga": "pasa",
    "sdk": "pasa",
    "idiomas": "pasa",
    "movil": "pasa",
    "consola": "pasa"
  },
  "pasos": [
    {
      "nombre": "Menú",
      "imagen": "revisiones/mudanza-extrema/menu.png",
      "veredicto": "OK",
      "nota": ""
    }
  ],
  "rondas": [
    { "numero": 10, "resultado": "Aprobado y subido", "nota": "APROBADO de Arte, 15/11/2026" }
  ],
  "filtros": {
    "skills": [{ "nombre": "art-bible", "prueba": "Comparado con Metro" }],
    "visual": {
      "pantallas": [
        {
          "pantalla": "Menú",
          "captura": "revisiones/mudanza-extrema/menu.png",
          "referencia": "kit/referencia-estilo-metro-menu.png",
          "nota": "",
          "ok": true
        }
      ]
    },
    "jugabilidad": {
      "niveles": [{ "nivel": 1, "toques": 3, "ok": true, "nota": "La mano enseña el primer toque" }]
    },
    "primerToque": true,
    "curva": "Suave en los primeros niveles"
  }
}
```

Reglas del parser (no las cambies):

- `titulo` es obligatorio (texto no vacío). Sin él, la ficha no carga.
- `veredicto` y el `resultado` de cada ronda solo pueden ser: `Aprobado y subido`, `Devuelto`, `En revisión`. Cualquier otro valor se convierte en `En revisión`.
- Notas de diseño y de jugabilidad: número de **0 a 10**, o se ignoran.
- `tecnico.*` solo puede ser: `pasa`, `falla`, `pendiente`. Otro valor se convierte en `pendiente`.
- `playgama`: URL `http` o `https`, o se ignora.
- `gif` e `imagen`: ruta de texto, sin `..` y sin `javascript:`.
- `pasos[].veredicto` solo: `OK`, `Mejorar`, `Falla`.
- `rondas[].numero` es un número.
- `filtros.primerToque`: `true` → «Se entiende»; `false` → «No se entiende»; o un texto.
- `filtros.jugabilidad.niveles[].nivel`: entero del 1 al 10.

### `skills-usadas.json`

```json
{ "skills": [{ "nombre": "playgama-bridge", "prueba": "initialize y game_ready en el zip" }] }
```

### `filtro-visual.json`

```json
{
  "pantallas": [
    {
      "pantalla": "Menú",
      "captura": "revisiones/slug/menu.png",
      "referencia": "kit/referencia-estilo-metro-menu.png",
      "nota": "",
      "ok": true
    }
  ]
}
```

(También acepta `{ "visual": { "pantallas": [ ... ] } }`.)

### `filtro-jugabilidad.json`

```json
{
  "niveles": [{ "nivel": 1, "toques": 3, "ok": true, "nota": "" }],
  "primerToque": true,
  "curva": "texto"
}
```

(También acepta esas claves dentro de `"jugabilidad"`.)

Las etiquetas que muestra la oficina: Arte y estilo, Animaciones, Efectos y juice, Menú, Legibilidad, Atractivo de la portada; Se entiende al primer toque, Controles y tacto, Curva de dificultad, Enganche y progresión, Fluidez y fallos, Sitio de los anuncios; Tiempo de carga, SDK y anuncios, EN / ES, Móvil 390×844, Sin errores de consola.

No pongáis cifras inventadas. Si no habéis medido un apartado, dejadlo fuera o en `pendiente`.

## 9. Autorrevisión (obligatoria)

No se publica nada, ni se da por terminada una ronda, sin que **la otra IA** pase esta lista y deje un **APROBADO firmado** en su archivo:

- Anita fabrica o corrige → Niky revisa con esta guía y firma en `niky.md`.
- Niky fabrica o corrige → Anita revisa con esta guía y firma en `anita.md`.

El APROBADO debe incluir: fecha y hora de Madrid, slug y ronda, «APROBADO» o «DEVUELTO», una frase con lo comprobado (zip, zonas táctiles, idioma, portadas, referencia de Metro) y las skills usadas al revisar. Si es DEVUELTO, lista exacta de fallos, como en `auditoria-calidad.md`.

No firméis un APROBADO de oídas ni fiándoos solo del informe de la otra. Abrid el zip, medid y jugad.

## 10. Qué decide Daniel en este paso

- Si una portada con sello puede usarse también en YouTube Playables (hay tensión entre el sello del estudio y la norma de YouTube de no poner marca en miniaturas).
- Cualquier excepción a estas normas.
- No decide el veredicto visual cotidiano: eso lo cerráis vosotras con la autorrevisión, al nivel de Metro.

## Lección 15/11/2026: Scribble Striker (fútbol de papel)
Daniel vio un avance con el campo plano, de esquema, con todos los trazos grises y sin la línea de medio campo, y dijo: «¿por qué hacemos mierdas al principio?». Normas desde hoy:
- El arte premium va PRIMERO. La pantalla principal de juego (tablero o campo) se genera y aprueba al nivel de Metro, o de un juego móvil top de su género, ANTES de programar la lógica. Nunca se usa arte provisional de esquema.
- No se enseña nada a Daniel, ni como avance, sin compararlo antes lado a lado con Metro. Si no llega al nivel, no se enseña.
- La lógica tiene que verse en pantalla: cada equipo o jugador con su color propio y constante, las líneas del campo en un tercer color neutro y todas las líneas que cuentan para el juego dibujadas (por ejemplo, el medio campo como línea de rebote).
- El listón es «de 10.000 dólares»: luz, sombras, textura, profundidad y animación en todo.

