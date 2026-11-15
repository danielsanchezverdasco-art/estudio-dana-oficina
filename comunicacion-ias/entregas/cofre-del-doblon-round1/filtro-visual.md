# Doubloon Rush — Filtro visual (comparación lado a lado con Metro Nightmare, 15/11/2026)

Referencia: portada de Metro Nightmare (`comunicacion-ias/kit/referencia-estilo-metro.png` no está en el repo público; se usó la portada de Metro `art/covers/metro.webp` como referencia visual).

## Metro Nightmare (la barra)
- Cartoon volumétrico pulido: vagón de metro con personajes expresivos, luz cálida, baldosas verdes brillantes que guían la mirada.
- Composición narrativa: los personajes cuentan la escena; profundidad por capas (primer plano, medio, fondo).
- Color: cálidos dominantes con un acento frío (verde) que ordena la lectura.

## Doubloon Rush (esta ronda)
- Portada clave: cofre dorado explotando en monedas, loro, pulpo con auriculares, barco al fondo, luz dorada de atardecer.
- Fondo de juego: playa cenital con mar turquesa, palmera, muelle, arena limpia en el centro para jugar.
- Sprites: 3 cofres (madera/plata/oro) con materiales distintos y legibles a 90 px; bomba, cangrejo, doblón, monedas, destello.
- Menú: escena ilustrada al atardecer con loro, barco y cofre rebosante; título en dos líneas sin recortes (medido a 390 px: 56 px).

## Veredicto por punto
| Punto | Metro | Doubloon Rush | Estado |
|---|---|---|---|
| Volumen / luz | Alto | Alto (sombras suaves, brillos dorados) | ✓ Al nivel |
| Legibilidad a tamaño de icono | Personajes claros | Cofre dorado legible; loro y pulpo reconocibles | ✓ Al nivel |
| Profundidad por capas | 3 capas | Mar / arena / cofres (3 capas) | ✓ Al nivel |
| Narrativa en la escena | Personajes con expresión | Objeto héroe (cofre) + mascota; sin personajes con historia | ~ Por debajo en narrativa; compensa con un objeto más legible |
| Textos recortados / solapados | Ninguno | Título del menú: 2 correcciones (una línea → dos líneas → 56 px); portadas sin solapes | ✓ Corregido y verificado |
| Elementos fuera de marco | Ninguno | Menú horizontal: todo dentro; grid 3×4 completo a 390×844 | ✓ |
| Sello / mano oficial | — | Sello solo en portadas Playgama (esquina superior); mano oficial en el tutorial | ✓ |

## Fallos encontrados y corregidos en esta ronda
1. **Atlas recortado (grave):** el empaquetador creaba el atlas de 1024 px de alto y borraba los frames de abajo: cofres abiertos, montículo y destello eran transparentes. Detectado por auditoría de frames (0 px opacos). Corregido: empaquetado en dos pasadas con límite 2048 px + verificación de que ningún frame quede vacío.
2. **Título del menú recortado:** una línea a 62 px se salía por ambos lados. Corregido: dos líneas a 56 px, medido en captura (346 px de ancho).
3. **Mascota tapando el botón PLAY:** movida a la esquina inferior izquierda, libre de botones.

## Pendiente de revisión cruzada
- La comparación lado a lado la debe confirmar Niky en su revisión (CONTROL-CALIDAD). El juicio honesto de esta ronda: el arte alcanza el nivel Metro en técnica y legibilidad; en narrativa de personajes queda por debajo (no hay personajes con historia, solo el pulpo cameo).
