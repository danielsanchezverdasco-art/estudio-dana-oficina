# Doubloon Rush — Art Bible (ronda 1)

## Dirección de arte

- **Estilo:** cartoon volumétrico pulido (sombras suaves, luz cálida, volúmenes redondeados, contornos limpios). Referencia de nivel: la portada de **Metro Nightmare** (vagón de metro, personajes expresivos, luz cálida, baldosas verdes brillantes).
- **Paleta:** arena dorada `#E8C47A` / `#F5D9A0`; mar turquesa `#1A9BB8` / `#2EC4D8`; madera `#8A5A2B`; oro `#FFD23E`; plata `#C0C8D0`; rojo cangrejo `#E8442E`; morado mascota `#9B59D0`; tinta de contorno `#3A2410`.
- **Tipografía:** Lilita One (incluida, `assets/LilitaOne-Regular.ttf`); textos con contorno oscuro + sombra suave para legibilidad sobre arena y mar.

## Piezas (todas generadas y revisadas visualmente el 15/11/2026)

| Pieza | Archivo | Tamaño | Uso |
|---|---|---|---|
| Fondo playa vertical | `bg-beach.webp` | 780×1688, 178 KB | Juego (vertical) |
| Fondo playa horizontal | `bg-beach-landscape.webp` | 1688×780, 92 KB | Juego (horizontal) |
| Escena de menú | `bg-menu.webp` | 780×1688, 226 KB | Menú (loro, barco, cofre) |
| Mapa pergamino | `bg-map.webp` | 780×1688, 223 KB | Mapa de niveles |
| Arte clave portada | `cover-keyart.webp` | 1600×1600, 337 KB | Portadas (base) |
| Cofres (7 sprites) | `atlas-chests.webp` + `.json` | 2048×1024, 227 KB | madera/plata/oro cerrados y abiertos + montículo |
| Ítems (5 sprites) | `atlas-items.webp` + `.json` | 1024×1718, 125 KB | bomba, cangrejo, doblón, monedas, destello |
| Pulpo mascota | `atlas-octopus.webp` + `.json` | 1024×1030, 66 KB | Cameo en el menú |
| Mano oficial | `hand-tutorial.png` | 41 KB | Tutorial (kit del estudio) |
| Sello Dana Games | `dana-games_badge_360w@2x.png` | 80 KB | Solo portadas Playgama |

## Proceso

1. Generación con referencia de estilo (portada de Metro).
2. Hojas de sprites sobre fondo magenta puro → chroma key con despill (`scripts/process-art.py`, PIL + numpy; el color de fondo se detecta de las esquinas, no se asume #FF00FF).
3. Recorte por componentes conectados (sin fusión por proximidad: dos sprites vecinos pueden tener cajas que se solapan).
4. Atlas Phaser 3 JSON Hash, ancla inferior-centro (pivot 0.5, 1.0) para que los cofres «salgan» del montículo.
5. Verificación: ningún frame vacío (el empaquetador inicial recortaba el atlas a 1024 px de alto y borraba los cofres abiertos, el montículo y el destello — detectado por la auditoría de frames y corregido: atlas de 2048×1024).

## Reglas de uso

- Los cofres emergen de detrás del montículo (el montículo tiene más profundidad que el cofre).
- El sello Dana Games va en la esquina superior de las portadas de Playgama, nunca en el 20 % inferior, mascota ≥ 60 px a 800×800. Las portadas `-youtube` NO llevan sello.
- La mano oficial es la del kit (dedo índice); nunca un puño.
- Nada de texto dentro del arte generado (el título se compone en el juego y en las portadas con PIL).
- Sin marcas de terceros: tema pirata genérico, sin Fortnite ni One Piece.

## Comparación con Metro (filtro visual)

Ver `filtro-visual.md`: el arte alcanza el nivel Metro en volumen, luz y legibilidad; la portada clave (cofre + loro + pulpo + barco) es comparable en riqueza a la portada de Metro. Diferencia honesta: Metro tiene personajes con expresión narrativa; Doubloon Rush compensa con un objeto héroe (el cofre) más legible a tamaño de icono.
