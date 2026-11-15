# Portadas de consola — 6 juegos aprobados · 15/11/2026

## Vista principal

| Nombre | Género | Gancho | Estado |
|---|---|---|---|
| Traffic Chaos: New York Rush | Simulation / arcade de tráfico con física | Primer semáforo en verde + primer choque en cadena a cámara lenta en 10 s | Portada lista |
| Who Is the Robot? | Brain & Puzzle / objeto oculto | El primer escaneo revela un robot en <10 s | Portada lista |
| Kitchen Hole Muncher | Arcade eat-and-grow | Primer trago, +50 y monedas volando | Portada lista |
| Draw Bridge Delivery | Dibujo con física | Dibujas el puente, PLAY, la scooter cruza con la pizza | Portada lista |
| Sushi Belt Frenzy | Puzzle de cinta / flujo | El gato come, combo x5 en llamas | Portada lista |
| Laundry Chaos Sort | Puzzle de ordenar | Calcetín por el aire +50, cesta completa que sale volando con espuma | Portada lista |

18 ficheros: `comunicacion-ias/portadas-juegos-2026-11-15/<slug>/` — por juego: `cover-800x800.webp` (Playgama, con sello), `cover-1080x1920.webp` (vertical, con sello), `cover-1920x1080-youtube.webp` (YouTube, sin sello). Título en inglés en las 3. Sello oficial real (`kit/dana-games_badge_360w@2x.png`), arriba centrado, nunca en el 20% inferior; 240 px de ancho en 800×800 (mínimo exigido: 60 px).

## Detalle por juego

### 1. Traffic Chaos: New York Rush (`traffic-chaos-ny`)
- **Motivo:** Times Square de noche, diorama juguete 2.5D. Dos taxis amarillos chocando en el centro con chispas y anillo luminoso de paciencia alrededor del semáforo en verde; autobús rojo, ambulancia blanca, neones, asfalto mojado.
- **Qué guía la portada:** la preview exacta `preview-traffic-chaos-ny.webp` (choque + anillo + taxis + MTA + FDNY) y demanda §6: la portada es el choque, no la ciudad vacía.
- **Qué no se puede cambiar:** el choque en el centro, el semáforo en verde con anillo, los taxis amarillos, la noche de Times Square.
- **Skills:** directing-game-visuals (verbo en acción, una frase visual), art-bible (paleta noche/neón de la preview), styling-web-game-typography (título 2 líneas, blanco con contorno), thumbnail-design (lectura a 3 s).

### 2. Who Is the Robot? (`quien-es-el-robot`)
- **Motivo:** andén de metro abarrotado, haz de escáner azul cruzando la multitud, robot con capucha gris, antena y ojos cian brillantes que se delata con un destello, tren azul a la derecha.
- **Qué guía la portada:** la preview exacta `preview-quien-es-el-robot.webp` (escáner + robot escondido entre viajeros).
- **Qué no se puede cambiar:** el robot escondido entre la gente (no protagonista centrado en solitario), el haz de escáner, el brillo en el ojo.
- **Skills:** directing-game-visuals, art-bible, styling-web-game-typography, thumbnail-design.

### 3. Kitchen Hole Muncher (`agujero-tragon-cocina`)
- **Motivo:** cocina cenital, vórtice morado-negro tragando cruasanes, migas, taza humeante y monedas doradas en espiral; nevera azul retro con imán de fresa, silla de madera.
- **Qué guía la portada:** la preview exacta `preview-agujero-tragon-cocina.webp` (el trago + monedas volando).
- **Qué no se puede cambiar:** el agujero como protagonista, las monedas en espiral dorada, la cocina cálida de madera.
- **Skills:** directing-game-visuals, art-bible, styling-web-game-typography, thumbnail-design.

### 4. Draw Bridge Delivery (`draw-bridge-delivery`)
- **Motivo:** repartidor con casco amarillo en scooter roja cruzando un puente de tablones sobre el río azul, caja de pizza en mano, niña saludando desde la casa de tejado azul, destellos dorados marcando el trazo del puente.
- **Qué guía la portada:** la preview exacta `preview-draw-bridge-delivery.webp` (el puente dibujado con la scooter encima).
- **Qué no se puede cambiar:** la scooter SOBRE el puente (no el repartidor parado), el río entre acantilados, la niña esperando.
- **Skills:** directing-game-visuals, art-bible, styling-web-game-typography, thumbnail-design.

### 5. Sushi Belt Frenzy (`sushi-belt-frenzy`)
- **Motivo:** cinta de sushi con platos de colores, tres gatos (naranja, gris, blanco y negro) cada uno sobre un plato de su color; el naranja come salmón con llamas de combo y destellos, gato chef al fondo, farolillos.
- **Qué guía la portada:** la preview exacta `preview-sushi-belt-frenzy.webp` y demanda §6: el icono y la portada son el gato comiendo, no la cinta sola.
- **Qué no se puede cambiar:** los tres gatos en sus platos de color, el naranja comiendo con fuego de combo, la cinta con sushi.
- **Skills:** directing-game-visuals, art-bible, styling-web-game-typography, thumbnail-design.

### 6. Laundry Chaos Sort (`laundry-chaos-sort`)
- **Motivo:** lavadora blanca girando llena de calcetines de colores y espuma, calcetín rojo volando con estela dorada hacia su cesta, cesta verde que sale volando con espuma, cuatro cestas de mimbre (roja, azul, verde, amarilla), gato naranja durmiendo sobre toallas.
- **Qué guía la portada:** la preview exacta `preview-laundry-chaos-sort.webp` (calcetín en el aire + cesta con espuma).
- **Qué no se puede cambiar:** el calcetín rojo en el aire, la cesta verde volando con espuma, las 4 cestas por color.
- **Skills:** directing-game-visuals, art-bible, styling-web-game-typography, thumbnail-design.

## Cómo se hicieron

Arte base generado por juego y formato (18 imágenes, verificadas una a una contra su preview: paleta, elementos y motivo), sin texto en la generación. Título en inglés y sello oficial compuestos después con PIL para que sean exactos y legibles: el sello es el PNG oficial del kit, no una imitación; el título es texto real (DejaVu Sans Bold, blanco con contorno oscuro, sobre velo degradado superior). Script de composición: `/tmp/portadas-raw/compose.py` (no se versiona; el arte base queda en `/tmp/portadas-raw/`).

## Skills: estado real del kit

- **Instaladas y usadas (SKILL.md leído en el kit de `main`):** `directing-game-visuals`, `art-bible`, `styling-web-game-typography`, `thumbnail-design`.
- **NO instaladas en `main` (solo existen en el commit c7a9201 de la PR #27, sin fusionar):** `game-ui-taste`, `taste-skill`, `game-ui-ux-pro-max`. Se aplicaron sus principios según el informe de skills (legibilidad sin texto, revisión a tamaño real, jerarquía de UI), pero sin su SKILL.md instalado. Aviso: para usarlas de verdad hay que fusionar el kit de la PR #27 en `main`.
- **No usadas (orden expresa):** `blender-*` (Blender no instalado), `game-playtest-squad-skill` y `game-audio` (sin licencia).

## Auto-revisión

- Dimensiones reales verificadas con PIL: 18/18 exactas (800×800, 1080×1920, 1920×1080).
- Sello arriba centrado en las 12 portadas que lo llevan; 0 sellos en el 20% inferior; 0 sellos en las 6 de YouTube.
- Título en inglés legible en las 18; sin texto pequeño, sin párrafos, sin marcas ajenas, sin personajes conocidos.
- Arte base revisado visualmente 18/18: sin relojes, sin textos rotos, sin dedos extraños, sin elementos duplicados.
- Discrepancias honestas:
  - `sushi-belt-frenzy/cover-800x800.webp`: el título tapa parcialmente la cara del gato chef del fondo (se le ven orejas y gorro); los 3 gatos protagonistas y la cinta están íntegros.
  - `laundry-chaos-sort/cover-1920x1080-youtube.webp`: el título tapa parcialmente un segundo calcetín rojo de la parte superior; el calcetín principal en el aire se ve entero.
  - En el arte de Traffic Chaos algunos neones son glifos abstractos sin palabra legible (decoración, no texto).
  - En el arte ancho de Laundry hay dos calcetines rojos volando en vez de uno; el verbo (calcetín en el aire) se mantiene.
