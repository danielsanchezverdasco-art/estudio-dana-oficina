# Cosecha de skills nuevas — 20/11/2026 (Dana Games)

Segunda cosecha de skills de videojuegos desde GitHub, por orden de Daniel (20/11 06:03–06:05).
Solo skills. No se ha construido ningún juego ni se ha tocado el fútbol.

- Rama: `niky/skills-nuevas-2011` (desde `origin/main`)
- PR: [#102](https://github.com/danielsanchezverdasco-art/estudio-dana-oficina/pull/102)
- Base: `main` con 66 SKILL.md. **OJO: la PR #27 (147 skills del 15/11) sigue sin fusionarse**,
  así que la deduplicación se hizo contra 147 (móvil, rama `niky/skills-movil-1511`) + 13 (oficina,
  rama `niky/skills-oficina-1511`, PR #38) = 160 nombres únicos, no solo contra main.
- Resultado: **41 skills nuevas instaladas** (66 → 107 SKILL.md en main + esta rama).
- Método: cada SKILL.md leído entero antes de instalar; licencia verificada (MIT/Apache-2.0);
  cada carpeta lleva `SKILL.md` + compañeros + `LICENSE` + `SOURCE.md` (repo, commit, estrellas, licencia).

## Fuentes exploradas

1. `github.com/topics/muse-skill` — la página de topic no es un repo: la API solo devuelve 3 repos
   con ese topic. El catálogo real es `aicodedecode/awesome-muse-skills` (2.384 skills según su README).
2. `github.com/AdityaRaj2434/awesome-muse-ai-skills` — lista MIT de 37 skills; su repo
   `aicodedecode/awesome-muse-skills` tiene `skills/` (901, todas MIT según `skills.json`) y
   `skills-imported/` (1.749, licencias mixtas: cada una se verificó por separado).
3. `github.com/siegezf/MuseAI-Skills` y su fork `win4r/MuseAI-Skills` — **idénticos** (verificado por diff):
   72 SKILL.md que son copias de skills de sistema de Muse/Hatch (artifacts, gmail, booking, etc.)
   + dumps de docs de plataforma. **Sin fichero LICENSE → repo entero descartado.** Nada relevante
   para juegos y duplicar skills de sistema no tiene sentido.

## Instaladas (41)

### skills-arte (12)

| Carpeta | Qué cubre | Origen |
|---|---|---|
| `animate/` | Recetas de animación (RECIPES.md) | emilkowalski/skills (MIT, 57.145★) |
| `animation-performance/` | Rendimiento de animaciones (60fps, GPU) | emilkowalski/skills |
| `animation-vocabulary/` | Vocabulario de movimiento | emilkowalski/skills |
| `gestures/` | Gestos táctiles para móvil | emilkowalski/skills |
| `improve-animations/` | Auditoría + plan de mejora (AUDIT.md, PLAN-TEMPLATE.md) | emilkowalski/skills |
| `remove-animations/` | Cuándo quitar animación | emilkowalski/skills |
| `motion-design/` | Dirección de movimiento: 12 principios Disney para UI, timing/easing, coreografía | LottieFiles/motion-design-skill v1.0.0 (MIT, 3.427★) |
| `character-designer/` | Diseño de personajes: silueta, expresión | awesome-muse-skills (MIT) |
| `comic-artist/` | Cómic: viñetas, lettering, narrativa visual (dirección CÓMIC aprobada) | awesome-muse-skills (MIT) |
| `accessibility-design-checker/` | Auditoría WCAG 2.2 AA en fase de diseño | awesome-muse-skills (MIT) |
| `audio-pro/` | Audio: grabación, mezcla, loudness (-14 LUFS) | awesome-muse-skills (MIT) |
| `hallmark/` | Anti-AI-slop web (tokens, sloplint, 48 temas) | Nutlope/hallmark (MIT, 58.211★) |

### skills-pro (21)

| Carpeta | Qué cubre | Origen |
|---|---|---|
| `prototype/` | Prototipos rápidos de jugabilidad (PICKER.md) | emilkowalski/skills |
| `learn-taste/` | Entrenar el gusto visual | emilkowalski/skills |
| `break-ui/` | Romper la UI para encontrar debilidades (CATALOG.md) | emilkowalski/skills |
| `develop-web-game/` | Loop dev+test de juegos web con Playwright (autor: OpenAI; pensado para Codex, adaptar rutas CODEX_HOME) | awesome-muse-skills, Apache-2.0 |
| `ffmpeg-pro/` | Recetas FFmpeg | awesome-muse-skills (MIT) |
| `e2e-testing-pro/` | E2E: journeys críticos, flakiness | awesome-muse-skills (MIT) |
| `playwright-pro/` | Patrones Playwright | awesome-muse-skills (MIT) |
| `playwright-cli/` | CLI oficial de Playwright (Microsoft) | microsoft/playwright-cli, Apache-2.0 (15.324★) |
| `qa-test-planner/` | Planificación de tests por riesgo | awesome-muse-skills (MIT) |
| `tdd-pro/` | TDD red-green-refactor | awesome-muse-skills (MIT) |
| `refactoring-pro/` | Refactoring seguro | awesome-muse-skills (MIT) |
| `security-audit/` | Auditoría de seguridad defensiva con sandbox y verificación independiente | cloudflare/security-audit-skill (MIT, 75.976★) |
| `ponytail/` | Modo "lazy senior dev", anti-bloat | DietrichGebert/ponytail (MIT, 195.090★) |
| `ponytail-review/` | Revisión de un cambio | DietrichGebert/ponytail |
| `ponytail-audit/` | Auditoría de un repo entero | DietrichGebert/ponytail |
| `ponytail-debt/` | Ledger de atajos (`shortcut:`) | DietrichGebert/ponytail |
| `debugging-and-error-recovery/` | Depuración sistemática (stop-the-line, bisect) | addyosmani/agent-skills (MIT, 119.250★) |
| `spec-driven-development/` | Specs antes de código, con puertas de aprobación | addyosmani/agent-skills |
| `planning-and-task-breakdown/` | Descomponer en tareas con aceptación y checkpoints | addyosmani/agent-skills |
| `incremental-implementation/` | Rebanadas verticales finas y verificables | addyosmani/agent-skills |
| `shipping-and-launch/` | Checklist pre-lanzamiento, flags, rollback | addyosmani/agent-skills |

### skills-marketing (8)

| Carpeta | Qué cubre | Origen |
|---|---|---|
| `storyboard-artist/` | Storyboards para vídeos de marketing | awesome-muse-skills (MIT) |
| `video-editor/` | Edición de vídeo: narrativa, gancho, ritmo | awesome-muse-skills (MIT) |
| `ai-video-prompts/` | 545 prompts probados de vídeo con IA (2,9 MB) | awesome-muse-skills (MIT) |
| `hyperframes/` | Vídeo MP4 determinista desde HTML/CSS | heygen-com/hyperframes, Apache-2.0 (87.165★) |
| `hyperframes-cli/` | CLI de HyperFrames (lint, render) | heygen-com/hyperframes |
| `hyperframes-registry/` | Catálogo de ~450 bloques/componentes de vídeo | heygen-com/hyperframes |
| `media-use/` | Medios para vídeo: música, SFX, voz, avatar | heygen-com/hyperframes |
| `story-animator/` | Historia narrada → MP4 2D dibujado en código | deenukhan/story-animator (MIT, 34★) |

Notas de instalación:
- Las 9 de Emil se instalan desde `emilkowalski/skills` (commit `64eb3de`), no desde la copia
  en `skills-imported/` del awesome list.
- `motion-design` viene del import de awesome (`PROVENANCE.md`: LottieFiles v1.0.0, MIT);
  su `LICENSE` se descargó del repo original (Copyright 2025 LottieFiles).
- `develop-web-game` trae su `LICENSE.txt` (Apache-2.0) en la carpeta, copiada también como `LICENSE`.
- `hallmark` pesa 7,1 MB (temas en `references/`); `ai-video-prompts` 2,9 MB; `media-use` 2,3 MB
  (incluye SFX de muestra); `hyperframes` 1,4 MB. El resto son kilobytes.
- `hyperframes` y `media-use` incluyen un beacon de telemetría de uso (con opt-out) y funciones
  que necesitan cuenta HeyGen (ver "De pago / con cuenta", abajo). La parte local es usable sin cuenta.
- `spec-driven-development` referencia a `planning-and-task-breakdown`, `incremental-implementation`
  y `test-driven-development`: las dos primeras están instaladas aquí; TDD se resuelve con `tdd-pro`.
- `shipping-and-launch` referencia `references/definition-of-done.md` etc. del repo upstream:
  no se copiaron (son "ver también", no imprescindibles).

## Ya las teníamos (duplicadas, NO instaladas)

- `choreograph`, `review-animations`, `find-animation-opportunities`, `emil-design-eng`,
  `mobile-native` (Emil) — ya están en `skills-arte/` en la rama `niky/skills-movil-1511` (PR #27),
  mismo repo y commit `64eb3de`, instaladas el 15/11. La cosecha del 15/11 instaló 14 de Emil, no 9.
- `motion-designer` — duplica `motion-design` + `animate`.
- `3d-designer`, `3d-web-experiences`, `threejs-pro` — duplican los 9 `blender-*` + 13 `threejs-skills` del kit.
- `playwright` (skills-imported, Apache-2.0) — misma herramienta que `playwright-cli` (Microsoft),
  menos completa y con rutas Codex; se instala la oficial.
- `test-driven-development` (addyosmani) — duplica `tdd-pro` (ya elegido).
- `code-review-and-quality` (addyosmani) — duplica `ponytail-review` (más escueto, nuestro estilo).
- `code-simplification` (addyosmani) — lo cubre la familia `ponytail`.
- `security-and-hardening` (addyosmani) — lo cubre `security-audit` (Cloudflare).
- `tdd`, `code-review`, `diagnosing-bugs`, `prototype`, `to-spec`, `implement-spec`, `implement`,
  `to-tickets` (mattpocock) — duplican `tdd-pro`, `ponytail-review`, `debugging-and-error-recovery`,
  `prototype` (Emil), `spec-driven-development` y `planning-and-task-breakdown`.

## Descartadas (con motivo)

- `MuseAI-Skills` entero (siegezf y fork win4r, idénticos): copias de skills de sistema + dumps
  de docs, sin LICENSE. Nada de juegos.
- `video-use` (browser-use, MIT): edición de vídeo por conversación, buen contenido, pero su
  núcleo es transcribir con Scribe y **exige `ELEVENLABS_API_KEY` en `.env`**. No se instala
  nada que pida claves; queda en la lista de "con cuenta" abajo.
- `edit-timeline-studio` (MartinDelophy, MIT): cliente de la app Timeline Studio — necesita su
  servidor local/MCP, formato `.timeline` y modelos locales. Sin la app, la skill es papel mojado.
- `openfilm`: el SKILL.md es un stub de 10 líneas que ejecuta `npx -y openfilm@latest`
  (descarga y ejecuta código remoto al usarlo). No es contenido autocontenido.
- `animated-short-film` (sonlovinbot): texto solo en vietnamita; su paso de vídeo usa
  `media-generation`, que devuelve 403 permanente en este entorno.
- `voicestudio` (debpalash): **AGPL** + necesita su backend local + clonación de voz.
- `video-editing`, `voice-performance-direction` (skills-imported, de calesthio/OpenMontage):
  **AGPL-3.0** con nota explícita de no redistribuir sin revisión AGPL completa.
- `game-audio-engineer`, `game-designer`, `game-development` (skills-imported): **sin licencia**.
- `threeui` (MengTo): librería de componentes, **sin SKILL.md** (no es una skill).
- `multimodal-audiocraft` (MIT): necesita PyTorch + GPU en local. Ver "con setup pesado".
- `hyperframes`: `reverse-any-video` y `style-sampling` son funciones **Pro** de pago;
  `figma` necesita Figma PAT (pendiente desde el 15/11); `slideshow` son decks (no juegos);
  `remotion-to-hyperframes` es un puente marginal.
- `ponytail-gain`, `ponytail-help`: meta/visualización (gain necesita un benchmark que no tenemos).
- `browser-testing-with-devtools` (addyosmani): exige el servidor MCP de Chrome DevTools,
  no configurado aquí; lo cubren `playwright-pro` + `develop-web-game`.
- `mattpocock/skills` entero: skills personales de flujo de Claude Code (routers, hooks, slash
  commands, triage de issues, entrevistas "grill"), duplicadas con el clúster addyosmani +
  ponytail + tdd-pro ya elegido; `in-progress/` trae skills sin terminar; las de enseñanza
  TypeScript (`codebase-design`, `domain-modeling`) no son producción de juegos.
- Emil descartadas (mismo repo, no instaladas): `animate-expo` (React Native), `apple-design`
  (HIG iOS), `ask-emil`, `ask-sonner` (meta Q&A), `pick-ui-library` (librerías web), `write-swift`.
- Awesome-list descartadas: `scroll-craft`, `diagram-design`, `anatomy-isometric`, `agent-reach`,
  `reverse_engineer_anything`, `android-skills`, `headroom`, `openshell`, `graphify`,
  `ai-job-search`, `humanizer`, `paperclip`, `social_publishing_studio_uploads`,
  `ai-video-director`, `media-revision-delivery`, lyric-video skills, `prompt-motion-web-design`.
- Descartadas del 15/11 que siguen descartadas (no se reabrieron): gamestack, Donchitos-with-hooks,
  sickn33, jammyfu `animation-blend`/`camera-shots`/`asset-pack-intake`, abagames
  `generating-dot-assets`/`generating-retro-arcade-concepts`, awesome-gamedev dialogue/AI-trees,
  effekseer, algorithmic-art, VibeGame, ForgeSkills, mythic-quest playtest, scenario-labs
  sprite-animation, character-animation-creator-skill, PixiJS, html-game-generator, emalorenzo
  three-agent-skills, Jeffallan Game Developer (Unity/Unreal), arjun988 blender, DreamLab
  blender-mcp, `weberwang/phaser-skills`, `Playgama/gamedev-skills/web-game-assets`,
  `Big-Head-Club/skills`, `popey/gamedev.sh-skills`, `hungify/playables-skills`,
  vibejam-starter-pack (sin LICENSE).
- **Sin licencia (re-verificado 20/11 vía API de GitHub, siguen sin licencia):**
  `kanoan7643/game-playtest-squad-skill` (playtest multi-perfil, prioridad nº1 del informe 15/11),
  `TunahanTuna/ingenium-plugin` (`game-audio`), `Yakoub-ai/phaser4-gamedev`. Bloqueadas hasta que
  publiquen licencia.

## De pago / con cuenta (NO instaladas o instaladas con aviso)

- `video-use` (browser-use): necesita `ELEVENLABS_API_KEY` en `.env` (transcripción Scribe).
  No instalada. Tenemos ElevenLabs por conector, pero esta skill pide la clave en crudo.
- `story-animator` (INSTALADA con aviso): la narración consume créditos ElevenLabs
  (~1.400–1.600 créditos por 60 s de narración + música/SFX).
- `hyperframes` / `hyperframes-cli` / `hyperframes-registry` / `media-use` (INSTALADAS con aviso):
  render en nube y funciones Pro necesitan cuenta HeyGen (sign-in gratuito: catálogo de música,
  3 min Voice Turbo/mes en plan Free; generación con créditos). La parte local (lint, render
  local, TTS Kokoro, whisper, grades) funciona sin cuenta.
- `hallmark` (INSTALADA con aviso): `TOGETHER_API_KEY` opcional, solo para el paso de comps.
- Figma PAT: pendiente desde el 15/11 (skill `figma` de HyperFrames no instalada por esto).
- `ui_ux_pro_max` Premium (precio sin confirmar, uupm.cc); API de Tripo (threejs-3d-generator);
  fal.ai (vibejam); Gemini API key (spine-2d-animation); licencia comercial Genielabs
  (spine-animation-ai, PolyForm Noncommercial). Ninguna instalada.
- `multimodal-audiocraft`: no es de pago, pero necesita PyTorch + GPU en local (setup pesado).

## Límites honestos

- `github.com/topics/muse-skill` no es un repo: es una página de topic. El "2.300+ skills" es
  la cifra del catálogo `awesome-muse-skills`, no un conteo de repos.
- `siegezf/MuseAI-Skills` se vende como 68 skills y en disco son 72 SKILL.md, pero son copias
  de skills de sistema; no hay nada de juegos ahí.
- `develop-web-game` no tiene repo propio conocido (autor: OpenAI, distribuida vía el awesome
  list); sus rutas son de Codex y hay que adaptarlas a nuestros scripts de prueba.
- Las estrellas de Emil (57.145) son lectura del 15/11; el resto son del 20/11 (API de GitHub).
- `story-animator` tiene solo 34 estrellas: repo pequeño, pero el contenido se leyó entero y
  el pipeline (Remotion + ElevenLabs + ffmpeg) encaja con herramientas que ya tenemos.
- Nada de lo instalado ejecuta código al instalar ni pide credenciales para instalarse.
  Los scripts que traen algunas skills (`sloplint`, `web_game_playwright_client.js`,
  `plugin-cli.mjs`, `mix.py`, `transcribe.py`) solo corren cuando se usa la skill.

## PR

- Rama: `niky/skills-nuevas-2011`
- PR: [#102](https://github.com/danielsanchezverdasco-art/estudio-dana-oficina/pull/102) — creada 20/11/2026
