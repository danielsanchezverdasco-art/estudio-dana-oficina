# Informe — Skills de oficina para la Torre Dana Games

Fecha: 2026-11-15 · Rama: `niky/skills-oficina-1511` · Autor: Niky (Dani)
Orden de Daniel: 15/11/2026 19:29 — «Tenemos las skills de oficina, ¿verdad?
Busca e instala para hacerla».

Referencia visual: captura `~/workspace/user/files/1000127544_0_2gt3.jpg`
(oficina vertical estilo Sims: habitaciones Dirección, Reuniones, KPIs, Ideas,
Diseño; personajes trabajando; etiquetas con datos en vivo; barra inferior con
botones y badges — Dirigir, Orden, Bandeja, Informes... — botón Datos y
«Última recogida»).

## 1. Resumen

- **13 skills nuevas** en la categoría `comunicacion-ias/kit/skills/skills-oficina/`:
  12 instaladas desde GitHub + 1 derivada escrita por Niky.
- **Todas vetadas con el mismo proceso de la misión anterior**: SKILL.md leído
  entero antes de instalar, licencia verificada en el repo, repo existente y
  mantenido (salvo la excepción honesta de `live-analytics-dashboard`, §3.12).
  Nada de humo, nada instalado en silencio sin licencia.
- **En esta rama hay 79 ficheros SKILL.md** (66 de la lista de Grok + 13 de
  esta misión). La PR #27 (81 skills de juegos) sigue abierta sin fusionar;
  **cuando se fusione, el kit quedará en 160 SKILL.md**.
- Peso de la categoría nueva: **2,4 MB** en total.
- Cada skill lleva su `SOURCE.md` (repo, commit, licencia) y su fichero
  LICENSE copiado en la carpeta (salvo `office-visualizer`, redacción propia).

## 2. Qué construye cada skill (guía para el constructor de la torre)

Leer en este orden: primero `office-visualizer` (el plano), luego la sala,
luego los personajes, luego los datos, luego la verificación.

### 2.1 El plano — `office-visualizer` (derivada, redacción propia)

Qué parte construye: **toda la arquitectura de datos en vivo**. Un único JSON
como fuente de verdad (departamentos con id/nombre/agente/habitación/estado/
tarea actual/última completada/notas, lista del jefe, ayuda pedida, regla de
tiempo y fase), la web lo lee cada 8 s (fallback 25 s) y repinta solo lo
cambiado, y al actualizar se manda un aviso instantáneo (ntfy.sh por SSE).
Adaptado a Dana Games: la fuente en vivo es la **API pública de GitHub**
(issues, PRs, commits) y el JSON solo guarda lo que GitHub no sabe (última
recogida de métricas, notas del jefe). También define la barra inferior (los
badges son contadores reales: si es 0, no se enseña el badge), el botón Datos
y la «Última recogida», y la aprobación desde la oficina (APROBAR / RECHAZAR
registra la decisión en GitHub con un toque).

Cómo verificarla: no es código de terceros, es un documento. El constructor
la sigue al pie de la letra y comprueba que cada cifra de la torre tiene
fuente (GitHub o JSON con hora).

Origen: patrón inspirado en simonhapp-ai/SMM-Project, repo **sin licencia**
(0 estrellas, último push 2026-08-01). No se copió código ni textos; la
SKILL.md es redacción propia. Ver su SOURCE.md.

### 2.2 Las salas — `diorama`, `diorama-worlds`, `diorama-pixel`, `diorama-dither` (educlopez/diorama, MIT, 21 estrellas, push 2026-11-03, commit 421d6a28)

Qué parte construye: **las habitaciones abiertas por enfrente**.

- `diorama`: miniaturas isométricas SVG sin dependencias, 6 temas, figuras
  mini. Para las salas como ilustración ligera (carga instantánea en móvil).
- `diorama-worlds`: miniaturas narrativas Three.js con cámara ortográfica
  fija, personas articuladas, 4 acabados, checks de contacto. Para las salas
  Sims con personajes trabajando de verdad. Es la skill principal de las
  salas.
- `diorama-pixel`: rasterizador de software 320×240 con dither Bayer, página
  autocontenida de ~50 KB. Para salas pixel-art ultraligeras.
- `diorama-dither`: variante de acabado con dither sobre el kernel pixel,
  360×280; un toque cambia un estado. Para salas pixel-art con interacción
  táctil.

Cómo verificarlas: cada carpeta trae `kit/` (el motor), `scripts/` (build,
serve, audit, transfer) y `examples/`. El flujo de la skill: `scripts/build`
→ `scripts/serve` → probar en el navegador → `scripts/audit` (regla dura:
0 fallos) → `scripts/transfer` a la torre.

### 2.3 La geometría — `isometric-ops` (0xDarkMatter/claude-mods, MIT, 81 estrellas, push 2026-11-07, commit 82f5d0a3)

Qué parte construye: **que la torre encaje**. Matemáticas de proyección
isométrica, 6 rutas de trabajo (probar proyección, plan de escena, generar
tiles, montar la composición, QA visual, empaquetar), scripts `tile
spec/validate/pack` y el compositor `iso-studio`. Se usa para calcular dónde
va cada sala, cada mueble y cada personaje, y para validar que nada se sale
del edificio ni se solapa.

Cómo verificarla: `references/` trae la hoja de fórmulas y los casos de
prueba; `scripts/` y `tests/` validan la proyección. Ojo: la skill referencia
skills hermanas del mismo repo (genart-ops, threejs-ops, color-ops,
playwright-ops) que NO están en el kit; si la torre las necesita, se instalan
aparte en otra misión.

### 2.4 Los personajes — `claude-animation` (buildwithhanif/claude-animation-skill, MIT, 155 estrellas, push 2026-09-23, commit 4ddb8c80)

Qué parte construye: **los agentes trabajando dentro de las salas**.
Animación 2D dibujada a mano como código, fotograma a fotograma: rig chibi
con articulaciones reales (andar, correr, saltar, celebrar, señalar, saludar,
cargar), rigs de bichos y efectos. Para el personaje sentado al ordenador, el
que dibuja, el que prueba juegos, con su indicador de estado encima (verde
trabajando, amarillo esperando, rojo parado, como el plumbob de los Sims).

Cómo verificarla: `references/` (spec, rigs, prompts) y `templates/`
(chibi-rig.html, critter-rig.html, walk-cycle.html, fx.html) son el punto de
partida: se genera el personaje, se ve en el navegador y se ajusta hasta que
el movimiento se lee bien a 390 px.

### 2.5 Los datos — `dashboard-design` (abdiraimov-otabek/dashboard-design-skill, MIT, 474 estrellas, push 2026-11-09, commit 463b8fdf)

Qué parte construye: **los paneles de cifras** (Dirección, KPIs, marketing,
botón Datos). 127 dashboards entregados: tarjetas KPI, gráficos, estados,
QA con captura de pantalla. Es la referencia de diseño para que cada cifra se
lea de un vistazo, con su fecha y su fuente.

Cómo verificarla: la skill pide primero el contexto (qué cifras, para quién),
luego wireframe, luego diseño y luego QA con captura. **Ojo: la skill
termina sus respuestas con una línea de firma promocional («Built with
Dashboard Design skill...»); esa línea NO va en el código ni en la interfaz
de la torre.**

### 2.6 Los datos en vivo — `live-analytics-dashboard` (vishalsdesai28/claude-trading-skills, MIT, 0 estrellas, push 2026-07-09, commit 4008c396)

Qué parte construye: **el panel que se actualiza solo**. JSON → dashboard
KPI: Tier 1 estático (Artifact-ready, CSP-safe, sin servidor) y Tier 2
FastAPI con polling. Para el panel Datos de la torre y para la «Última
recogida».

Cómo verificarla: `scripts/build_dashboard.py` genera el panel desde un
JSON; `scripts/csp_check.py` comprueba que no rompe la política de seguridad.
**Advertencia honesta: repo pequeño, 0 estrellas, sin actividad desde julio
de 2026.** La skill es autocontenida y se vetó leyendo el código entero
(SKILL.md + scripts + references), pero si se rompe, se sustituye por
`dashboard-design` + polling propio, sin dramas.

### 2.7 El artefacto — `web-artifacts-builder`, `frontend-design`, `webapp-testing`, `theme-factory` (anthropics/skills, Apache-2.0, 195.244 estrellas, push 2026-11-14, commit 1780c5e5)

Qué parte construyen: **la torre como web terminada**.

- `web-artifacts-builder`: artefactos web React + TS + Vite + Tailwind +
  shadcn multi-componente, con scripts init/bundle. Es el andamio de la torre.
- `frontend-design`: diseño visual distintivo anti-genérico. Para que la
  torre no parezca una plantilla: estilo propio de videojuego Sims.
- `webapp-testing`: testing Playwright de apps web locales, con server.py.
  Para verificar la torre en el navegador (390 px, clics en plantas y
  botones, badges) antes de enseñarla a Daniel.
- `theme-factory`: 10 temas predefinidos + showcase. Para los temas visuales
  de la torre (claro/oscuro, neón, papel).

Licencia: Apache-2.0 según el LICENSE.txt incluido en cada carpeta (el repo
no declara licencia a nivel raíz en la API de GitHub; las carpetas sí la
traen).

### 2.8 El sonido — ya estaba en el kit

El botón de música de la captura lo cubre `audio-design` (skills-arte, ya
instalada en la misión anterior). Regla: el sonido solo suena si Daniel lo
pulsa; nunca autoplay con sonido.

## 3. Pipeline recomendado para el constructor

1. `office-visualizer`: leer el plano y decidir qué dato viene de GitHub y
   qué dato va en el JSON.
2. `isometric-ops`: plan de escena y geometría de la torre (dónde va cada
   sala).
3. `diorama-worlds` (o `diorama` si se quiere más ligera): construir las
   salas con sus muebles.
4. `claude-animation`: personajes trabajando en cada sala + indicador de
   estado.
5. `dashboard-design` + `live-analytics-dashboard`: paneles de KPIs y el
   botón Datos con su «Última recogida».
6. `web-artifacts-builder` + `frontend-design` + `theme-factory`: montar la
   torre como artefacto con su estilo propio.
7. `webapp-testing`: verificar a 390 px (sin desbordamiento horizontal,
   plantas tocables, badges correctos, torre legible con GitHub caído) antes
   de enseñarla a Daniel.

## 4. Qué NO se instaló y por qué (descartadas con motivo)

- **Claude Code Game Studios entero** (Donchitos, MIT): ya evaluado en la
  misión anterior; solo `asset-audit` servía y ya está en el kit. Instalarlo
  entero solaparía con las 147 skills.
- **tycoon-idle de sbox** (guía de género idle/tycoon): es para s&box en C#,
  no una skill web. La lógica de «Última recogida» (ganancias offline) es una
  diferencia de timestamps y ya la cubre `office-visualizer`.
- **character-sprite-maker** (tomevault-io): depende de Codex `$imagegen` y
  solapa con `video2dsprite`, ya en el kit.
- **isometric-animation** (iart-ai): solapa con `isometric-ops`; la segunda
  es más completa (scripts de validación y compositor).
- **apple-hig-designer**: skill de un solo proyecto, licencia sin verificar;
  las reglas de navegación inferior ya las cubre `ui-ux-pro-max` en el kit.
- **yume-audio-designer**: acoplado al sistema Yume (Godot, cues.json); no
  sirve para la web.
- **project-artifact** (plugin oficial de Claude): el repo fuente no es
  claro (solo espejos); `web-artifacts-builder` cubre la misma necesidad con
  licencia Apache-2.0 verificada.
- **add-audio**: envoltorio de `game-audio`; no aporta nada por sí mismo.

## 5. Pendiente — solo Daniel puede desbloquearlo (no instalado en silencio)

### 5.1 Sin licencia: `game-audio` (PlayableIntelligence/game-creator, antes OpusGameLabs)

SKILL.md de 178 líneas leído entero (v1.3.0): secuenciador Web Audio + SFX,
Strudel opcional (AGPL). Sería la skill de sonido ambiental y música de fondo
de la torre. **Bloqueo: el repo NO tiene fichero LICENSE** (la API devuelve
`license: null`; el package.json dice ISC y el README dice MIT: contradicción
sin resolver). No se instala sin licencia. **Acción: pedir al autor que añada
el fichero LICENSE (MIT según su README). 0 € si lo concede.** Mientras
tanto, el sonido lo cubre `audio-design`, ya en el kit.

### 5.2 De pago o con API key (coste para que Daniel decida)

- **phaser-sprite-generator** (LeanEntropy): genera sprites con OpenAI
  GPT-Image o Gemini; necesita API key de pago. El kit ya tiene
  `sprite-forge`, que cubre lo mismo.
- **scenario-sprite-animation** (scenario-labs/skills): requiere cuenta de
  Scenario (plataforma de pago) y su MCP. Pendiente de que Daniel decida si
  quiere cuenta.
- **figma** (skill del kit, misión anterior): cuenta + PAT, plan gratis 0 €.
- **ui_ux_pro_max Premium**: precio por confirmar en uupm.cc.
- **Genielabs spine-animation-ai, ItamarZand88 Spine, threejs-3d-generator
  (API Tripo), fal-ai-image (fal.ai)**: pago/API key, ya apuntados en el
  informe de la misión anterior.

### 5.3 Por vetar en la siguiente tanda (si Daniel quiere más)

Originales de GameSkill no vetados en esta misión (repos no descargados):
`pixel-render-3d`, `style-cards`, `pixelfx`, `codixel`, `img2threejs`.
También queda pendiente pedir la licencia de `game-playtest-squad-skill`
(prioridad nº 1 de la misión anterior: el gate que habría evitado los 5
descartes) y de Yakoub-ai/phaser4-gamedev, firejune/rigc y Vibejam entero.

## 6. Lecciones de esta misión

- **`/tmp` es un tmpfs de 512 MB**: llegó al 100 % durante esta misión y
  corrompió el clon de OpusGameLabs (354 MB, ficheros a 0 bytes, borrado).
  `/home/hatch` tiene 48 GB libres. Vetar con clones pequeños, sparse
  checkout o por API/raw.githubusercontent, nunca con clones gordos en /tmp.
- La API de GitHub devuelve `license: null` en repos cuya licencia vive solo
  en un LICENSE.txt dentro de la carpeta de la skill (caso anthropics/skills):
  verificar la licencia en la carpeta, no solo en la API.
- Un README que dice MIT y un package.json que dice ISC sin fichero LICENSE
  es un bloqueo, no un detalle: `game-audio` queda fuera hasta que el autor
  lo resuelva.
