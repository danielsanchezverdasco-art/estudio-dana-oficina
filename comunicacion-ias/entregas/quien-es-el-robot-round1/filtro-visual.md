# Filtro visual — Who Is the Robot? (ronda 1)

**Barra:** Metro Nightmare (mínimo Dana Games). **Estado:** revisión por código +
tests unitarios; la verificación en navegador está PENDIENTE (Chromium muerto en
esta VM, exit 133 — la ventana finisher la hará). Nada de lo que sigue se
presenta como verificado en pantalla.

## Checks por código (verificados)

| Check | Resultado |
|---|---|
| Un protagonista / un peligro / una recompensa por plano | SÍ — haz cian (protagonista), temporizador+corazones rojos (peligro), anillo dorado + colección (recompensa) |
| El robot no se distingue en reposo | SÍ por construcción — traje gris medio (#9AA5AD) entre grises; antena y ojo son sprites aparte con alpha 0 hasta el revelado |
| Textos sin cortes a 390×844 | SÍ por construcción — título 40 px, HUD 34 px, botones con wordWrap; el contenedor letterbox evita estiramientos |
| Botones ≥88 px principales / ≥48 px mínimo | SÍ — PLAY 88 px, resto 56–64 px; iconos 52 px de diámetro |
| Hit areas en coordenadas locales | SÍ — `Rectangle(0,0,w,h)` en botones; rectángulo de persona (-32,-70,64,140) en local |
| Nada pixelado | SÍ por construcción — todo el arte es vectorial generado a resolución real (`crowd.ts`); las 2 únicas imágenes (badge, mano) se sirven sin reescalar |
| Menú ilustrado e interactivo | SÍ — andén con multitud que murmura, robot asomando la antena, escáner barriendo de fondo, tocar a un viajero lo hace girarse |
| Covers | **HECHO Y VERIFICADO A LA VISTA** — 4 covers (800×800 + 1080×1920 con badge oficial en esquina superior; 1080×1920 + 1920×1080 `-youtube` sin badge); ratios exactos, 2x píxeles; falta solo la square `-youtube` (edición trivial) |
| Badge oficial | En la esquina del menú (48 px, sin tapar juego); **en las covers de Playgama, esquina superior** (verificado a la vista en las 2 covers con badge) |
| Mano tutorial oficial | `hand.png` en L1, señalando «Drag to scan» |
| Sin leftovers de test | SÍ — `window.__game` solo existe en el build de test (`__TEST_BUILD__`); el build de producción lo elimina por tree-shaking |

## Checks PENDIENTES de navegador (ventana finisher)

- Captura real 390×844 de L1/L15/L30: ¿la multitud lee como personajes con
  volumen y no como sprites planos? ¿El robot se pierde de verdad entre grises?
- Comparativa lado a lado con Metro Nightmare (imagen).
- Touch test: centro + 4 esquinas + fuera de cada botón.
- ¿El haz se ve bien sobre fondos claros y oscuros (NY/Tokio/París)?
- ¿Los textos ES caben sin cortarse («¡ENCUENTRA AL ROBOT!», «Pista extra»)?

## Puntuación (provisional, por código)

**8,0/10** — la estructura cumple el listón (lectura inmediata, volumen,
menú ilustrado, sin pixelado por construcción). La nota final depende de las
capturas reales.
