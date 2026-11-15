# Skills de oficina — Torre Dana Games (estilo Sims)

Skills para construir la oficina vertical en vivo de Dana Games: edificio abierto
por enfrente, habitaciones con personajes trabajando, datos en vivo de GitHub,
barra inferior con badges y botón de música. Orden de Daniel del 15/11/2026 19:29.

Todas con licencia permisiva (MIT / Apache-2.0) verificada. Cada carpeta lleva su
`SOURCE.md` con repo, commit y licencia, y su fichero LICENSE copiado (salvo
`office-visualizer`, que es redacción propia de Dana Games). Estrellas y últimos
pushes leídos de la API de GitHub el 2026-11-15.

| Skill | Repo | Estrellas | Licencia | Qué parte de la oficina construye |
|---|---|---|---|---|
| diorama | educlopez/diorama | 21 | MIT | Salas isométricas SVG sin dependencias, 6 temas, figuras mini |
| diorama-worlds | educlopez/diorama | 21 | MIT | Salas Three.js con cámara ortográfica fija y personas articuladas |
| diorama-pixel | educlopez/diorama | 21 | MIT | Salas pixel-art 320×240, página autocontenida ~50 KB |
| diorama-dither | educlopez/diorama | 21 | MIT | Salas pixel-art con dither; un toque cambia un estado |
| isometric-ops | 0xDarkMatter/claude-mods | 81 | MIT | Geometría isométrica: proyección, tiles, validación y compositor |
| dashboard-design | abdiraimov-otabek/dashboard-design-skill | 474 | MIT | Paneles de KPIs, cifras y gráficos (Dirección, KPIs, marketing) |
| web-artifacts-builder | anthropics/skills | 195.244 | Apache-2.0 | La torre como artefacto web React + TS + Vite + Tailwind |
| frontend-design | anthropics/skills | 195.244 | Apache-2.0 | Estilo visual propio, anti-plantilla genérica |
| webapp-testing | anthropics/skills | 195.244 | Apache-2.0 | Verificación en navegador (390 px, clics, badges) antes de enseñarla |
| theme-factory | anthropics/skills | 195.244 | Apache-2.0 | 10 temas visuales para la torre |
| claude-animation | buildwithhanif/claude-animation-skill | 155 | MIT | Personajes animados trabajando (rig chibi con articulaciones reales) |
| live-analytics-dashboard | vishalsdesai28/claude-trading-skills | 0 | MIT | Panel de datos en vivo desde JSON (Tier 1 estático / Tier 2 con polling) |
| office-visualizer | derivada propia (patrón de simonhapp-ai/SMM-Project, sin licencia, sin código copiado) | — | propia | El patrón de la torre: un JSON como fuente de verdad + polling cada 8 s + aviso instantáneo; adaptado a GitHub como fuente en vivo |

## Notas

- `dashboard-design` termina sus respuestas con una línea de firma promocional
  ("Built with Dashboard Design skill..."): esa línea NO va en el código ni en
  la interfaz de la torre.
- `isometric-ops` referencia skills hermanas del mismo repo (genart-ops,
  threejs-ops, color-ops, playwright-ops) que NO están en el kit: si la torre
  las necesita, se instalan aparte.
- `live-analytics-dashboard` viene de un repo pequeño (0 estrellas, sin
  actividad desde julio de 2026): la skill es autocontenida y se vetó leyendo
  el código entero; si se rompe, se sustituye por `dashboard-design` + polling
  propio.
- Sonido ambiental y música de fondo: la skill `audio-design` ya estaba en el
  kit (skills-arte). El botón de música de la captura lo cubre ella; nunca
  autoplay con sonido.
- Lo que NO está aquí (de pago o sin licencia, pendiente de decisión de Daniel):
  ver `comunicacion-ias/informe-skills-oficina-2026-11-15.md`, sección 5.
