# Filtro visual — Ramp Physics r2 (opción C)

**Regla:** una pantalla no se da por buena hasta pasar este filtro a la
vista, comparada con el mockup C y con Metro Nightmare.

## Pantallas revisadas

| Pantalla | Veredicto | Notas |
|---|---|---|
| Menú principal (`assets/menu-390x844.png`) | **PASA** | Título amarillo con contorno, muñeco protagonista, PLAY verde enorme, LEVELS/SHOP, contador ×0. Proporción exacta 390:844. Papel + rayos + semitono. |
| Nivel 12 (`assets/mockup-c-comic.webp`) | **PASA** | Referencia maestra: rampa con crosshatch, ventilador, dinamita, bandera, monedas, HUD completo. |
| Muñeco (`assets/muneco-ragdoll.png`) | **PASA** | Mismo personaje del mockup, cuerpo entero, visor con reflejo, brazos en jarra. |
| Rampa (`assets/rampa-dibujada.png`) | **PASA con matices** | Trazo grueso + crosshatch + monedas perfectos. Matices: ángulo muy empinado (~65–70° vs ~50° del mockup) y monedas con estrella grabada (en el mockup son lisas). No rompe el estilo; si Daniel lo pide, se ajusta en el paso 2. |
| Guía de estilo (`assets/guia-estilo-visual.svg` / `.png`) | **PASA** | Paleta con rol, 3 tintas, tipografía, elementos. La versión SVG es vectorial; la PNG se genera cuando el sandbox lo permite. |
| Comparativa Metro vs nivel | **PASA** | `assets/comparativa-metro-nivel.webp` (fase de mockups). |
| Comparativa Metro vs menú | **PASA** | `assets/comparativa-metro-menu.png` (2240×1120): Metro completo a la izquierda, menú entero (contain-fit) a la derecha, cabeceras completas. |

## Controles del filtro (todos deben ser SÍ)

- [x] Contorno negro grueso en todos los elementos (nada de líneas de 1 px).
- [x] Color plano premium (nada de degradados baratos ni ruido).
- [x] Semitono o rayos en cada fondo (nada de fondos planos vacíos).
- [x] Amarillo = protagonista, rojo/naranja = peligro, verde = meta, dorado = monedas (sin mezclas).
- [x] El muñeco es el mismo en menú y nivel (coherencia).
- [x] Título y botones legibles a tamaño de móvil (390×844).
- [x] Nada pixelado: todo a resolución real (menú 688×1489, muñeco/rampa 1184×2096, mockup 1152×2048).
- [x] Tipografía cómic (Lilita One títulos, Nunito texto) en el juego; la guía usa la misma.
- [ ] Capturas reales del juego comparadas lado a lado con el mockup C — **se hace en la verificación del juego (paso 2)**, con capturas de Playwright.

## Lo que NO pasó el filtro (y se descartó)

- Mockups A (blueprint) y B (neón): descartados por Daniel al elegir C.
- Cualquier elemento sin contorno o sin sombra: se rehace, no se entrega.
