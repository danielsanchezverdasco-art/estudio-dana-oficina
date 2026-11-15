# Informe: skills de calidad para Dana Games — 15/11/2026

**Para:** Anita (instalar y usar sin preguntar) y el agente que construye la plantilla.
**De:** Niky (rama `niky/skills-movil-1511`).
**Orden de Daniel:** 15/11 18:42 — buscar las mejores skills de juegos, diseño y móvil; 18:48 — cuatro pilares (Diseño, Desarrollo, Jugabilidad, Ingenio); 18:49 — ser los mejores, que la competencia diga «wow»; 18:57 — la mejor plantilla del mundo para YouTube Jugables. Y 19:10: «Tenemos las mejores skills de diseño, arte, programación de juegos, úsalas».

## 0. Resumen: qué se hizo

- **81 skills nuevas instaladas** en el kit, todas con su `SKILL.md` leído entero antes de instalar, licencia permisiva verificada (MIT o Apache-2.0) y `SOURCE.md` con repo, commit y licencia.
- El kit pasa de **66 a 147 ficheros `SKILL.md`** (66 antiguas + 81 nuevas). Por carpetas: `skills-arte` 12 → 54, `skills-competencia` 6 → 13, `skills-pro` 25 → 57, `skills-marketing` 11 (sin cambios).
- Tamaño total del kit: **15 MB** (la skill más pesada es `taste-skill`, 2,1 MB sin sus imágenes de ejemplo; sprite-forge suma ~5,7 MB).
- **Top 5 del análisis de la competencia instalados primero** (Phaser oficial, GSAP oficial, prototype-fast + platformer + puzzle; game-audio y game-playtest-squad-skill BLOQUEADOS por falta de licencia — ver §5).
- Los índices del kit están actualizados: `kit/skills/skills-arte/README.md`, `kit/skills/skills-competencia/README.md` y `kit/skills/skills-pro/README.md` (con sus 81 filas nuevas). Tres huecos que el README de `skills-pro` marcaba como «sin skill fiable» quedan **resueltos** (SDK de YouTube Playables, accesibilidad, Spine / 3D prerenderizado a 2D).
- **Nada publicado, nada tocado fuera del kit.** No se tocó recurretumulta, ni la Tienda, ni el build de la oficina. Todo en la rama `niky/skills-movil-1511` + PR.

## 1. Cómo verificar que una skill quedó bien instalada (para Anita)

Cada skill instalada tiene que tener **estos 3 ficheros** en su carpeta (y los extras que se indican en su fila):

```
comunicacion-ias/kit/skills/<categoria>/<nombre>/
├── SKILL.md      # la skill en sí (léela entera antes de usarla)
├── LICENSE       # copia de la licencia del repo (o LICENSE.md en Phaser)
└── SOURCE.md     # repo, commit, estrellas, licencia, notas de adaptación
```

Comandos de verificación (desde la raíz del repo `estudio-dana-oficina`):

```bash
# 1. La skill existe y tiene sus 3 ficheros
ls comunicacion-ias/kit/skills/skills-arte/particles/
# debe mostrar: LICENSE.md  SKILL.md  SOURCE.md  references

# 2. Contar todas las instaladas (deben ser 81 nuevas; 147 SKILL.md en total)
find comunicacion-ias/kit/skills -name SKILL.md | wc -l   # → 147

# 3. Comprobar que un script que la skill necesita existe de verdad
ls comunicacion-ias/kit/skills/skills-pro/platformer/scripts/jump_tuner.py
ls comunicacion-ias/kit/skills/skills-arte/spine-skeletal/scripts/bind_joint.py
ls comunicacion-ias/kit/skills/skills-pro/building-era-authentic-game-audio/scripts/validate-audio-kit.mjs
ls comunicacion-ias/kit/skills/skills-arte/review-animations/STANDARDS.md
ls comunicacion-ias/kit/skills/skills-arte/choreograph/RECIPES.md

# 4. Ver la procedencia de cualquier skill
cat comunicacion-ias/kit/skills/skills-arte/particles/SOURCE.md
```

Si falta `SKILL.md`, la skill no está instalada. Si falta `LICENSE` o `SOURCE.md`, avísame: solo hay una excepción legítima (ver §6, `impeccable`, cuya licencia Apache-2.0 está verificada en la API de GitHub y copiada como `LICENSE` desde el repo upstream).

**Regla de oro para instalar más:** nunca instalar nada sin haber leído su `SKILL.md` entero, sin licencia permisiva en la raíz del repo, o si pide API key o pago sin que Daniel lo haya aprobado (ver §5).

## 2. Instaladas por pilar (81)

Rutas relativas a `comunicacion-ias/kit/skills/`. Estrellas leídas de la API de GitHub el 15/11/2026. Todas MIT salvo que se diga Apache-2.0.

### Pilar 1 — Diseño (dirección de arte, arte premium, UI/UX móvil, portadas, personajes, fondos)

| Skill | Ruta en el kit | Origen (★) | Hueco que cubre |
|---|---|---|---|
| game-ui-ux-pro-max | `skills-arte/game-ui-ux-pro-max/` | byandresfe/game-ui-ux-pro-max (0) | UI/UX de juegos: 7 pilares de Hodent, FTUE móvil <60 s al core loop, touch ≥48dp, checklist pre-ship |
| game-ui-taste | `skills-arte/game-ui-taste/` | byandresfe/game-ui-ux-pro-max (0) | Dirección de arte de UI: 12 arquetipos, banned defaults anti-slop, tipografía, color scripting |
| ui_ux_pro_max | `skills-arte/ui_ux_pro_max/` | nextlevelbuilder/ui-ux-pro-max-skill (149.875) | Datos buscables: 192 paletas, 74 parejas de fuentes, 120 guías UX, 17 presets GSAP, `scripts/search.py` |
| taste-skill | `skills-arte/taste-skill/` | Leonxlnx/taste-skill (116.051) | Anti-slop para páginas (portadas, landings): checks en navegador real a 390 px, finish gate. Sin `assets/` (37 MB de ejemplos no copiados); el hook `Stop` es de Claude Code y se ignora (ejecutar `scripts/gate.mjs` a mano) |
| emil-design-eng | `skills-arte/emil-design-eng/` | emilkowalski/skills (57.145) | Filosofía de Emil Kowalski: easing, duraciones, springs, clip-path, press states — el «por qué se siente bien» |
| impeccable | `skills-arte/impeccable/` | pbakaus/impeccable (110.617, Apache-2.0) | Referencia condensada: 24 comandos de diseño + detector anti-AI-slop (62 reglas). Activación real: `npx impeccable install` en el repo del juego |
| blender-stylized-npr | `skills-arte/blender-stylized-npr/` | EL4CTEO/blender-skills (1.211) | Toon/cel, outlines (inverted hull), Line Art, caras anime. **Clave para la dirección CÓMIC aprobada por Daniel** |
| blender-lighting-lookdev | `skills-arte/blender-lighting-lookdev/` | EL4CTEO/blender-skills (1.211) | Iluminación 3 puntos, HDRI, cámaras (85–135 mm) y turntables de presentación |
| blender-pbr-materials | `skills-arte/blender-pbr-materials/` | EL4CTEO/blender-skills (1.211) | Materiales PBR: metal/roughness, espacios de color, ORM, reglas de exportación |
| blender-texturing | `skills-arte/blender-texturing/` | EL4CTEO/blender-skills (1.211) | Smart materials: desgaste, óxido, suciedad, polvo, decals, trim sheets |
| mobile-native | `skills-arte/mobile-native/` | emilkowalski/skills (57.145) | Que la web se sienta nativa en el móvil: tap highlight, 100dvh, notch/safe areas, 300 ms de tap delay |
| asset-audit | `skills-pro/asset-audit/` | Donchitos/Claude-Code-Game-Studios (39.506) | Auditoría read-only de assets con disciplina NOT ASSESSED (nunca inventar números — ataca la lección de las 55 fotos). Adaptar raíz Godot/Unity → `public/` + `src/` |
| asset-pipeline | `skills-pro/asset-pipeline/` | martinalmeida/playables-youtube-sdk (0) | Pipeline de assets + material de publicación: miniatura 1:1 ≥512×512, zona segura 12%, vídeo 16:9 ≥1280×720 |

Ya estaban en el kit y complementan este pilar: `art-bible`, `directing-game-visuals`, `create-game-assets`, `game-ui-ux`, `sprite-gen`, `thumbnail-design` (marketing).

### Pilar 2 — Desarrollo (Phaser/Three.js, rendimiento móvil, arquitectura, testing)

| Skill | Ruta en el kit | Origen (★) | Hueco que cubre |
|---|---|---|---|
| particles | `skills-arte/particles/` | phaserjs/phaser (40.722) | Phaser 4 oficial: emisores, zonas, gravity wells |
| tweens | `skills-arte/tweens/` | phaserjs/phaser (40.722) | Phaser 4 oficial: tweens, cadenas, stagger, easing |
| animations | `skills-arte/animations/` | phaserjs/phaser (40.722) | Phaser 4 oficial: animaciones y Aseprite |
| audio-and-sound | `skills-arte/audio-and-sound/` | phaserjs/phaser (40.722) | Phaser 4 oficial: desbloqueo de audio en móvil, sonido y música |
| filters-and-postfx | `skills-arte/filters-and-postfx/` | phaserjs/phaser (40.722) | Phaser 4 oficial: filtros WebGL, post-procesado (bloom) |
| cameras | `skills-arte/cameras/` | phaserjs/phaser (40.722) | Phaser 4 oficial: shake, fade, follow, deadzone (su SKILL.md enlaza `references/REFERENCE..//SKILL.md`, typo upstream) |
| sprites-and-images | `skills-arte/sprites-and-images/` | phaserjs/phaser (40.722) | Phaser 4 oficial: sprites, imágenes y texturas |
| tilemaps | `skills-arte/tilemaps/` | phaserjs/phaser (40.722) | Phaser 4 oficial: tilemaps de Tiled + capa GPU |
| scale-and-responsive | `skills-arte/scale-and-responsive/` | phaserjs/phaser (40.722) | Phaser 4 oficial: ScaleManager, FIT/RESIZE/EXPAND, orientación, fullscreen, quirks de iOS |
| input-keyboard-mouse-touch | `skills-arte/input-keyboard-mouse-touch/` | phaserjs/phaser (40.722) | Phaser 4 oficial: teclado, puntero multitáctil, drag, hit areas, gamepad |
| loading-assets | `skills-arte/loading-assets/` | phaserjs/phaser (40.722) | Phaser 4 oficial: Loader, atlases, audio sprites, packs, progress bar, caché |
| gsap-core | `skills-competencia/gsap-core/` | greensock/gsap-skills (18.492) | Animación DOM/UI con canon 60fps (la librería GSAP es gratuita propietaria de Webflow; las skills son MIT) |
| gsap-timeline | `skills-competencia/gsap-timeline/` | greensock/gsap-skills (18.492) | Timelines y secuenciación de animación |
| gsap-performance | `skills-competencia/gsap-performance/` | greensock/gsap-skills (18.492) | Rendimiento de animación: 60fps, transform/opacity |
| playables-sdk-integration | `skills-pro/playables-sdk-integration/` | martinalmeida/playables-youtube-sdk (0) | SDK YouTube Playables: boot, `firstFrameReady`/`gameReady`, `onPause`/`onResume`, `saveData`/`loadData`, `sendScore` |
| certification-checklist | `skills-pro/certification-checklist/` | martinalmeida/playables-youtube-sdk (0) | Gate final antes de publicar (Test Suite oficial de Google) |
| phaser-scene-scaffolding | `skills-pro/phaser-scene-scaffolding/` | martinalmeida/playables-youtube-sdk (0) | Estructura Boot→Preloader→MainMenu→Game→GameOver |
| core-libraries | `skills-pro/core-libraries/` | martinalmeida/playables-youtube-sdk (0) | Módulos reutilizables: EventBus, AudioManager, SfxSynth, SaveManager, InputManager, ObjectPool, UIKit, Juice, LevelLoader |
| responsive-design | `skills-pro/responsive-design/` | martinalmeida/playables-youtube-sdk (0) | Jugable de 9:16 a 21:9, Scale.RESIZE/FIT, sin coordenadas fijas |
| blender-core | `skills-arte/blender-core/` | EL4CTEO/blender-skills (1.211) | Base Blender 5.2+: bpy, ejecución headless/MCP, cambios de API 5.x. Solo 9 de las 28 skills a las que enruta están instaladas |
| blender-texture-baking | `skills-arte/blender-texture-baking/` | EL4CTEO/blender-skills (1.211) | Bake high→low: normales, AO, curvatura, ID, ORM |
| blender-rendering | `skills-arte/blender-rendering/` | EL4CTEO/blender-skills (1.211) | Cycles/EEVEE: presets, denoising, color management, batch |
| blender-game-optimization | `skills-arte/blender-game-optimization/` | EL4CTEO/blender-skills (1.211) | Presupuestos por plataforma (móvil 5–15k tris héroe), LODs, draw calls, memoria de texturas |
| blender-export-pipelines | `skills-arte/blender-export-pipelines/` | EL4CTEO/blender-skills (1.211) | Exportación verificada: glTF/FBX/USD a web, Unity, Unreal, Godot |
| performance-budget | `skills-competencia/performance-budget/` | jammyfu/open-game-skills (13) | Objetivos de rendimiento: p50/p95/p99, frame pacing, latencia de input. El diagnóstico lo hace la ya instalada `skills-arte/performance-optimization` |
| browser-input | `skills-pro/browser-input/` | jammyfu/open-game-skills (13) | Pointer Lock, `visibilitychange`, `pointercancel`, gamepad (evita acciones atascadas) |
| fixing-accessibility | `skills-pro/fixing-accessibility/` | ibelick/ui-skills (11.087) | Checklist DOM de accesibilidad (nombres, teclado, foco, contraste, reduced-motion) |
| generate2dmedia | `skills-arte/generate2dmedia/` | 0x0funky/agent-sprite-forge (5.754) | Capa de rutas de generación: APIs de imagen/vídeo, ledger de gasto, `forge_doctor.py` |

**Nota Blender:** Blender 5.2+ **NO está instalado en este entorno** (verificado 15/11/2026). Las 9 skills `blender-*` son workflow + scripts `bpy` para una máquina con Blender. Su conocimiento (dirección cómic, PBR, presupuestos) sirve igual para decidir; los scripts solo corren donde haya Blender.

**Nota martinalmeida:** las 7 skills están ligadas a los `templates/phaser-starter/` y `src/core/` de su repo. El agente de la plantilla debe implementarlos/adaptarlos, no copiarlos tal cual. Es el único set de skills del SDK de YouTube Playables encontrado en internet.

### Pilar 3 — Jugabilidad (game feel, juice, balanceo, dificultad, onboarding, retención)

| Skill | Ruta en el kit | Origen (★) | Hueco que cubre |
|---|---|---|---|
| juice-vfx | `skills-competencia/juice-vfx/` | jammyfu/open-game-skills (13) | VFX en runtime con contrato de evento, caps de instancias y limpieza (nunca crea daño ni hitboxes) |
| haptic-rumble | `skills-competencia/haptic-rumble/` | jammyfu/open-game-skills (13) | Háptica móvil con capability checks y fallback no háptico |
| camera-anti-clip | `skills-competencia/camera-anti-clip/` | jammyfu/open-game-skills (13) | Cámara sin clipping: near-plane, decollision, shake dentro del presupuesto final |
| action-feel | `skills-arte/action-feel/` | jammyfu/open-game-skills (13) | Reloj lógico, buffers, cancels, hitstop |
| audio-feel | `skills-arte/audio-feel/` | jammyfu/open-game-skills (13) | Mapeo evento→audio, límites de voces |
| audio-buses | `skills-arte/audio-buses/` | jammyfu/open-game-skills (13) | Rutas de mezcla: buses, ducking, snapshots, loops sin duplicar en retry |
| maximizing-game-feel | `skills-pro/maximizing-game-feel/` | abagames/agentic-gamedev-skills (43) | Game feel: vocabulario de feedback por evento (peligro/recompensa/estado/near-miss), `FEEL_TUNING.md`, validación en juego sin tocar la simulación. Complementa a `skills-arte/game-feel`, no la sustituye |
| balance-design | `skills-pro/balance-design/` | jammyfu/open-game-skills (13) | Contrato de balance: policy_id, métricas, guardrails, evidencia versionada |
| attack-tell | `skills-pro/attack-tell/` | jammyfu/open-game-skills (13) | Aviso antes de peligros con canales redundantes |
| platformer | `skills-pro/platformer/` | gamedev-skills/awesome-gamedev-agent-skills (8.971, Apache-2.0) | Plataformas: coyote 0,1 s, buffer 0,1–0,15 s, datos de Celeste, `scripts/jump_tuner.py` con verificación por log |
| puzzle | `skills-pro/puzzle/` | gamedev-skills/awesome-gamedev-agent-skills (8.971, Apache-2.0) | Puzzles: match-3/Sokoban/merge, niveles verificados por solver, undo |
| tutorial-for-game | `skills-pro/tutorial-for-game/` | zenkifeed/cozy-fishing (0) | FTUE ejecutable: welcome card, force play-gate (el ÚNICO tap posible), hand-holding, coach-marks, rookie-quests |
| gating-intent-legibility | `skills-pro/gating-intent-legibility/` | abagames/agentic-gamedev-skills (43) | Gate: ¿un jugador nuevo lee el objetivo sin tutorial? Grader aislado (otro agente sin ver el diseño) + control degradado. Ataca directamente el «poco intuitivo» |
| game-ai | `skills-pro/game-ai/` | gamedev-skills/awesome-gamedev-agent-skills (8.971, Apache-2.0) | IA: FSM/BT/utility, A* |
| procedural-gen | `skills-pro/procedural-gen/` | gamedev-skills/awesome-gamedev-agent-skills (8.971, Apache-2.0) | Generación procedural: RNG con semilla, WFC, seed sweeps |
| ad-break | `skills-pro/ad-break/` | jammyfu/open-game-skills (13) | Ciclo de vida de anuncios, resume, recompensas idempotentes (relevante con el 75/25 de Playgama) |
| analytics-funnel | `skills-pro/analytics-funnel/` | jammyfu/open-game-skills (13) | Funnels versionados con denominador explícito |
| review-animations | `skills-arte/review-animations/` | emilkowalski/skills (57.145) | Revisión de animación: 10 estándares no negociables, veredicto Block/Approve. Lee `STANDARDS.md` antes del veredicto |
| find-animation-opportunities | `skills-arte/find-animation-opportunities/` | emilkowalski/skills (57.145) | Dónde animar y dónde NO (filtro de contención, máx. 5–7 sugerencias, rechazadas con motivo) |
| choreograph | `skills-arte/choreograph/` | emilkowalski/skills (57.145) | Coreografía de grupos: un entrance por contenedor, stagger no uniforme, interrupción. Lee `RECIPES.md` |
| a11y-controls | `skills-pro/a11y-controls/` | jammyfu/open-game-skills (13) | Preferencias de accesibilidad dentro del juego |
| accessibility | `skills-pro/accessibility/` | martinalmeida/playables-youtube-sdk (0) | Accesibilidad Playables: nada crítico solo-audio, paleta segura daltonismo, ≥44×44 px táctil, texto ≥16 px |

Ya estaban en el kit y complementan este pilar: `game-feel`, `game-juice`, `game-feel-and-juice`, `juice-audit`, `game-polish-audit`, `game-quality-gates`, `difficulty-and-balancing`, `onboarding-and-teaching`, `pacing-and-the-player-journey`, `evaluating-gameplay-balance`, `playtest-report`, `smoke-testing-web-games`, `input-systems`, `camera-systems`, `phaser-arcade-physics`, `physics-tuning`.

### Pilar 4 — Ingenio (diseño de juegos, mecánicas que enganchan, creatividad, ideas, prototipado)

| Skill | Ruta en el kit | Origen (★) | Hueco que cubre |
|---|---|---|---|
| prototype-fast | `skills-pro/prototype-fast/` | gamedev-skills/awesome-gamedev-agent-skills (8.971, Apache-2.0) | Prototipo desechable de UNA pregunta: keep/kill/retune |
| stress-testing-game-concepts | `skills-pro/stress-testing-game-concepts/` | abagames/agentic-gamedev-skills (43) | Auditoría adversarial del concepto ANTES de construir (encaja con la regla nueva de Daniel: nada se fabrica sin concepto + mockup aprobados) |
| curating-game-concept-portfolio | `skills-pro/curating-game-concept-portfolio/` | abagames/agentic-gamedev-skills (43) | Selección de conceptos por cobertura |
| exploring-game-design-space | `skills-pro/exploring-game-design-space/` | abagames/agentic-gamedev-skills (43) | Hipótesis mecánicas variadas (espacio de diseño) |
| arcadifying-mini-games | `skills-pro/arcadifying-mini-games/` | abagames/agentic-gamedev-skills (43) | Vueltas, ceremonias, economía de puntos, modo attract (ataca el «parece un minijuego») |
| designing-minimal-game-rules | `skills-pro/designing-minimal-game-rules/` | abagames/agentic-gamedev-skills (43) | Reglas mínimas. **ALCANCE: solo juegos por turnos/discretos, NO acción en tiempo real** |
| implementing-gameplay-invariants | `skills-pro/implementing-gameplay-invariants/` | abagames/agentic-gamedev-skills (43) | Convertir «machacar no debe ganar» en invariantes testeables |
| refining-game-prototypes | `skills-pro/refining-game-prototypes/` | abagames/agentic-gamedev-skills (43) | Bucle por etapas: estructura → dificultad → presentación → limpieza, con revision log |

Ya estaban en el kit y complementan este pilar: `designing-mini-games`, `game-design-fundamentals`, `game-engagement-ideas`, `level-design`.

### 2D / 3D / 4K (alcance 15/11 18:49)

| Área | Skills instaladas | Ruta |
|---|---|---|
| 2D — sprites | generate2dsprite (master still aprobado, sheets FX/props, paletas, export a motor), video2dsprite (un clip de vídeo por acción desde el master, keying, loops, HD/pixel/hibit) | `skills-arte/generate2dsprite/`, `skills-arte/video2dsprite/` |
| 2D — mapas | generate2dmap (tilemaps, parallax, HD-2D, colisión, export a Tiled/Godot/LDtk) | `skills-arte/generate2dmap/` |
| 2D — animación | spine-skeletal (rigs Spine + scripts de auditoría), pixel-animation (celda→pose→tick), sprite-atlas (packing + metadatos Phaser), character-rig (contrato de esqueleto + `reference/retarget-protocol.md`), vfx-generate (placas VFX) | `skills-arte/spine-skeletal/`, `skills-arte/pixel-animation/`, `skills-arte/sprite-atlas/`, `skills-arte/character-rig/`, `skills-arte/vfx-generate/` |
| 3D | blender-core + 8 (stylized-npr, lighting-lookdev, pbr-materials, texturing, texture-baking, rendering, game-optimization, export-pipelines). Cubre el hueco documentado «sprites 3D prerenderizados a 2D» | `skills-arte/blender-*/` |
| 4K / alta resolución | Sin skill dedicada de 4K/upscaling en internet con licencia clara (ver §6). Lo que hay: finishes HD de sprite-forge (master 1024, `display-sizes 1x,2x`, nunca upscale), renders Blender a 1920/4K (`blender-rendering`), y los checks a tamaño real de `taste-skill` (390 px) y `review-animations` | — |

**Nota sprite-forge:** las 4 skills generan por defecto con API keys de pago o CLIs de Codex/Grok. En este entorno se adaptan a las herramientas de imagen/vídeo propias del agente; los scripts Python de pipeline/QC funcionan tal cual. `codeart2d` NO se instaló (fallback solo bajo petición explícita de arte dibujado por código).

## 3. Núcleo de la plantilla (lo imprescindible para fabricar un juego a nivel «wow»)

Para el agente que construye la plantilla: estas son las skills que la plantilla debe invocar **siempre**, en este orden. El resto del kit es apoyo según el género.

| Fase | Skills (en orden de uso) | Qué hace cada una |
|---|---|---|
| 1. Concepto | `stress-testing-game-concepts` → `prototype-fast` | Auditar el concepto ANTES de construir; prototipo desechable de una pregunta (keep/kill/retune). Sin esto no se fabrica nada |
| 2. Dirección de arte | `directing-game-visuals` (ya) + `art-bible` (ya) + `game-ui-taste` + `blender-stylized-npr` | Una frase visual, paleta con roles de gameplay, protagonista/peligro/recompensa legibles en un still sin HUD. Dirección cómic si Daniel la elige |
| 3. Mockup | `taste-skill` + `game-ui-ux-pro-max` | Mockup acabado que Daniel aprueba ANTES de programar (regla 15/11 17:51). Nada se construye sin su OK al diseño |
| 4. Arte 2D | `generate2dsprite` → `video2dsprite` → `generate2dmap` + `sprite-atlas` | Un master still aprobado por personaje; un clip por acción; mapa con colisión; atlas empaquetado para Phaser |
| 5. UI/UX | `game-ui-ux-pro-max` + `emil-design-eng` + `mobile-native` + `tutorial-for-game` | HUD/menús táctiles, motion con criterio, que se sienta nativo, FTUE que enseña jugando |
| 6. Motor | Phaser: `scale-and-responsive` + `input-keyboard-mouse-touch` + `loading-assets` + `sprites-and-images` + `tilemaps` + `particles` + `tweens` + `animations` + `audio-and-sound` + `cameras` + `filters-and-postfx`; GSAP: `gsap-core` + `gsap-timeline` | El juego en sí, responsive 9:16, multitáctil, con carga y progress bar |
| 7. Feel | `maximizing-game-feel` + `action-feel` + `juice-vfx` + `audio-feel` + `audio-buses` | Vocabulario de feedback por evento; hitstop, partículas y audio sin tocar la simulación |
| 8. Balance | `platformer` (`jump_tuner.py`) o `puzzle` según género + `balance-design` + `implementing-gameplay-invariants` | Números verificados, no ajustados a ojo; «machacar no debe ganar» como test |
| 9. Gates de calidad | `gating-intent-legibility` + `asset-audit` + `review-animations` + `performance-budget` | ¿Un jugador nuevo entiende qué hacer? ¿Todas las fotos son del modelo exacto? ¿La animación pasa los 10 estándares? ¿60 fps en móvil? |
| 10. Plataforma | `playables-sdk-integration` + `core-libraries` + `phaser-scene-scaffolding` + `responsive-design` + `certification-checklist` | SDK de YouTube Playables, módulos reutilizables, gate final con el Test Suite oficial |
| 11. Publicación | `asset-pipeline` + `playgama-publish` (ya) + `playgama-bridge` (ya) | Miniatura 1:1, zona segura 12%, vídeo 16:9, checklist de Playgama |

## 4. Qué falta todavía (huecos sin cubrir)

| Hueco | Estado | Qué hacer |
|---|---|---|
| Playtest multi-perfil (3–5 jugadores, fresh-player, 390×844) | **BLOQUEADO por licencia** — `game-playtest-squad-skill` sin LICENSE (ver §5, prioridad nº 1). Es el gate que habría evitado los 5 descartes del 15/11 | Pedir licencia MIT al autor; mientras, usar `playtest-report` + `smoke-testing-web-games` + `review-game` (ya en el kit) |
| Audio de juego completo (bus master→music/sfx/ui, música adaptativa) | **BLOQUEADO por licencia** — `game-audio` (ingenium) sin LICENSE (ver §5) | Pedir licencia MIT al autor; mientras, cubierto por Phaser `audio-and-sound` + `audio-feel` + `audio-buses` + las dos skills de audio de abagames |
| Spine comercial (auto-rig desde body-parts, animaciones idle/walk/run/attack) | Pendiente de pago/licencia — Genielabs `spine-animation-ai`, licencia PolyForm Noncommercial (ver §5) | Daniel decide si contactar en genielabs.tech para licencia comercial |
| Generación 3D por IA (GLB/FBX desde texto) | Pendiente de pago — `threejs-3d-generator` usa API de Tripo (ver §5) | Daniel decide |
| 4K / upscaling dedicado | Sin skill fiable encontrada (con licencia clara) | Cubrir con finishes HD de sprite-forge + renders Blender + checks a tamaño real |
| Analítica fuera de Playgama (D1/D7 propios en YouTube Playables) | Sin skill fiable encontrada | Seguir con `playgama-metrics-snapshot` + `game-engagement-ideas` (ya) en Playgama |
| GSAP ScrollTrigger / plugins | No vetadas (no se leyeron sus SKILL.md) — existen upstream en `greensock/gsap-skills` | Vetarlas si la plantilla las necesita (landing pages con scroll) |
| `performance-optimization` de jammyfu | NO instalada a propósito: colisión de nombre con la ya instalada `skills-arte/performance-optimization` (awesome-gamedev), que cubre el hueco | Nada que hacer |
| Blender en este entorno | Blender 5.2+ NO instalado aquí; las 9 skills son workflow + scripts para una máquina con Blender | Instalar Blender 5.2+ donde se vaya a renderizar/modelar, o usar solo el conocimiento de las skills |
| `estandares-calidad-daniel` | No existe como carpeta en el kit; solo se menciona en logs y en `dana-games-juegos/scribble-striker/ESTADO.md` | **Anita: verificar dónde vive ese documento** y si debe entrar al kit |

## 5. Cómo instalar una skill nueva (para Anita, paso a paso)

Cuando llegue una skill pendiente de §6 con su licencia concedida (o Daniel apruebe una de pago), instálala así. Ejemplo con `game-playtest-squad-skill` cuando el autor le ponga licencia:

```bash
# 0. Trabajar siempre en rama propia, nunca en main
cd ~/workspace/estudio-dana-oficina
git checkout main && git pull origin main
git checkout -b niky/skills-<nombre>-<fecha>

# 1. Descargar el repo (solo lo necesario)
git clone --depth 1 https://github.com/kanoan7643/game-playtest-squad-skill.git /tmp/nueva-skill

# 2. LEER el SKILL.md entero (obligatorio, sin excepciones)
#    y comprobar que hay LICENSE en la raíz del repo:
ls /tmp/nueva-skill/LICENSE
#    Si NO hay LICENSE → NO se instala. Se apunta en §6 y se pide al autor.

# 3. Copiar la carpeta de la skill (SKILL.md + references/ + scripts/ si los tiene)
cp -r /tmp/nueva-skill/<ruta-de-la-skill> comunicacion-ias/kit/skills/skills-pro/game-playtest-squad-skill
cp /tmp/nueva-skill/LICENSE comunicacion-ias/kit/skills/skills-pro/game-playtest-squad-skill/LICENSE

# 4. Escribir SOURCE.md (copia este modelo, cambia los datos)
cat > comunicacion-ias/kit/skills/skills-pro/game-playtest-squad-skill/SOURCE.md <<'EOF'
# SOURCE — game-playtest-squad-skill

- Repo: https://github.com/kanoan7643/game-playtest-squad-skill
- Commit: <git -C /tmp/nueva-skill rev-parse --short HEAD>
- Estrellas: <API de GitHub, fecha>
- Licencia: MIT — copia en `LICENSE` en esta carpeta
- Instalado: <fecha>, rama <rama> (SKILL.md leido entero antes de instalar)
- Notas: <adaptaciones, si las hay>
EOF

# 5. Añadir una fila a comunicacion-ias/kit/skills/skills-pro/README.md
#    (mismo formato que las filas vecinas: carpeta, origen, licencia, estrellas, para qué)

# 6. Verificar (tiene que salir SKILL.md, LICENSE y SOURCE.md)
ls comunicacion-ias/kit/skills/skills-pro/game-playtest-squad-skill/

# 7. Commit firmado Niky + push + PR (el push usa el helper con token de escritura)
git add -A && git commit -m "kit: instala game-playtest-squad-skill (licencia MIT concedida)"
git -c credential.helper= -c credential.helper="store --file ~/.git-credentials" push -u origin HEAD
# Abrir el PR en GitHub a main (nunca merge directo a main).
```

**Categorías:** arte → `skills-arte` (diseño, animación, 2D/3D, UI); juice/rendimiento → `skills-competencia`; proceso/diseño/plataforma/QA → `skills-pro`; marketing/visual → `skills-marketing`.

## 6. Pendientes de instalar (pago, API key o sin licencia — decide Daniel)

Ninguna de estas se instaló. Para cada una: qué resuelve, qué falta y cuánto cuesta (sin cifras inventadas: donde no hay precio verificado, se dice).

| # | Skill | Qué resuelve | Qué falta | Coste |
|---|---|---|---|---|
| 1 | `game-playtest-squad-skill` (kanoan7643/game-playtest-squad-skill) | Playtests multi-perfil (3-player quick / 5-player standard / slow-network, 390×844, fresh-player rules, `human-report.md` + `ai-fix-packet.md`). **Es el gate que habría evitado los 5 descartes** | **Sin LICENSE en el repo** (verificado con `git ls-files`, vacío). Pedir licencia MIT al autor (issue o PR) | 0 € si la concede |
| 2 | `game-audio` — ingenium (TunahanTuna/ingenium-plugin, `plugins/ingenium/skills/game-audio/`) | Audio completo: bus master→music/sfx/ui, desbloqueo en primer gesto, variación SFX, scheduler con lookahead, música adaptativa, ducking, mapeo a Phaser, checklist pre-ship iOS/Android | **Sin LICENSE en el repo** (verificado). Pedir licencia MIT al autor | 0 € si la concede |
| 3 | Yakoub-ai/phaser4-gamedev (`phaser-mobile`, `phaser-fx`, `phaser-particles`, `phaser-ui`, `phaser-animation`, `phaser-audio`, `phaser-playtest`) | Phaser 4 móvil, FX, partículas, UI, audio y playtest | **Sin LICENSE** (confirmado vía API de GitHub) | 0 € si la concede |
| 4 | firejune/rigc | Compilador de rigs Spine | Licencia **NOASSERTION** (sin licencia declarada). Contactar al autor | Por confirmar |
| 5 | GenielabsOpenSource/spine-animation-ai (679★) | Auto-rig Spine desde body-parts (SIFT+RANSAC), animaciones idle/walk/run/attack/wave/jump, preview con Spine Web Player | Licencia **PolyForm Noncommercial 1.0.0** — el uso comercial requiere licencia aparte (contactar en genielabs.tech) | Licencia comercial por confirmar con el autor |
| 6 | ItamarZand88 spine-2d-animation (`awesome-agent-conventions`) | Animación Spine 2D con scripts embebidos | Necesita **API key de Gemini** (usa `google-generativeai`) | Pago por uso según tarifas de Google (sin cifra verificada — no inventar) |
| 7 | majidmanzarpour threejs-3d-generator | Generar assets 3D (GLB/FBX) desde texto | Usa **API de Tripo (pago)** | Pago por generación según tarifas de Tripo (sin cifra verificada) |
| 8 | chongdashu/vibejam-starter-pack — `fal-ai-image` (y el pack entero) | Generación de imágenes con fal.ai; el pack trae además `phaser4-gamedev`, `retro-diffusion` (pixel art), `threejs-builder`, `threejs-capacitor-ios` (export móvil) | Usa **fal.ai (pago)**. Además el pack **no tiene LICENSE** en el repo (su README dice «check the original pack pages and license terms yourself first») → no instalable aunque se pague fal.ai | Pago por uso según tarifas de fal.ai |
| 9 | figma (skill local) | Diseñar en Figma y traer el diseño al código | Necesita cuenta Figma + **Personal Access Token** | Plan gratuito existe (0 €); requiere que Daniel cree la cuenta + el token |
| 10 | ui_ux_pro_max Premium | Versión de pago de `ui_ux_pro_max` (ya instalada la gratuita) | De pago | **Precio por confirmar en uupm.cc** (sin cifra verificada) |
| 11 | Sprite-forge por API (opcional) | Generar imágenes/vídeo por API en vez de con las herramientas propias del agente | API keys de OpenAI / Gemini / xAI / BytePlus / fal.ai (una basta; la key configurada es el consentimiento del dueño). **No es un bloqueo**: sin keys, las skills usan las herramientas propias del agente | Pago por uso según cada proveedor |

## 7. Descartadas (y por qué — para no reabrirlas)

| Candidata | Motivo |
|---|---|
| gamestack entero (`animation-systems`, `shaders-and-vfx`, `ui-ux-and-feedback`, `iteration-loop`, `game-design-process`, `ai-authored-content-coherence`, `procedural-generation`) | Solapa con `skills-pro`; instalarlo hincharía el contexto (66 skills ya). `ai-authored-content-coherence` se autodeclara «sourced but unverified» |
| Donchitos con hooks (`design-review`, `gate-check`, `consistency-check`, `asset-spec`, `balance-check`, `qa-plan`, `soak-test`, `smoke-check`, `prototype`, `design-system`) | Dependen de los hooks del estudio (`yaml-helper.sh`, `project.yaml`). Solo `localize` (ya) y `asset-audit` (instalada, única sin hooks) sirven |
| sickn33 `mobile-design` | Apps nativas, no juegos HTML5 |
| sickn33 `2d-games`, `game-design` | Resúmenes superficiales, sin sustancia ejecutable |
| sickn33 `game-audio` | Principios genéricos; cubierto por las skills de audio instaladas |
| sickn33 `ui-a11y` | Acoplado a StyleSeed/Radix |
| jammyfu `animation-blend` | 3D pose blending / root motion (no es nuestro caso) |
| jammyfu `camera-shots` | Cámaras cinemáticas 3D (boom-sweep) |
| jammyfu `asset-pack-intake` | Formato de pack externo con manifest que no usamos |
| abagames `generating-dot-assets` | Exige `image_gen` de Codex + ImageMagick |
| abagames `generating-retro-arcade-concepts` | Solo arcade 1978–1985 |
| awesome-gamedev `dialogue-systems`, `ai-behavior-trees-utility-ai` | Sin diálogo en nuestros juegos; `game-ai` cubre FSM |
| effekseer | Guía de herramienta de escritorio, sin workflow de integración Phaser/WebGL |
| algorithmic-art (sickn33/anthropics) | Filosofía de arte generativo p5.js; scaffold sin terminar, depende de CDN |
| VibeGame | Framework, no skills |
| ForgeSkills | Blender+Godot, no Phaser/web |
| mythic-quest playtest | Godot-only + MCP |
| scenario-labs sprite-animation | Atado a su plataforma |
| character-animation-creator-skill | Depende de `$imagegen` de Codex |
| PixiJS oficial | No usamos Pixi |
| html-game-generator-skill | Generador entero, no skill de ejecución |
| emalorenzo/three-agent-skills | React Three Fiber — no usamos React |
| Jeffallan/claude-skills Game Developer | Unity/Unreal |
| arjun988 blender skills | Solo visto en un post de Facebook, no verificado |
| DreamLab-AI/agentbox blender, blender-mcp-ultra | Dependen de BlenderMCP, no verificados |
| jammyfu `performance-optimization` | Colisión de nombre con la ya instalada `skills-arte/performance-optimization`; no se duplica |
| vibejam-starter-pack entero | Sin LICENSE en el repo |
| `weberwang/phaser-skills` | Spine + anuncios AppLovin/Capacitor: no encaja en Playgama ni YouTube Playables |
| `Playgama/gamedev-skills/web-game-assets` | Duplica `skills-arte/create-game-assets`, centrado en glTF 3D |
| `Big-Head-Club/skills`, `popey/gamedev.sh-skills`, `hungify/playables-skills` | Sin LICENSE |

## 8. Correcciones honestas (lo que el informe anterior decía mal o incompleto)

1. **La dependencia `gsap-skills` de `game-juice` NO se pudo confirmar.** El análisis de la competencia afirmaba que la skill instalada `game-juice` exige `gsap-skills` como sub-skill obligatoria. Verificado falso/no confirmable: la copia instalada de `game-juice` es solo `SKILL.md` sin ninguna mención a gsap, y en el clon de `awesome-gamedev-agent-skills` no existe ninguna skill `*juice*`. GSAP se instaló por méritos propios (animación DOM/UI a 60fps), no para tapar ese hueco. El README de `skills-competencia` ya recoge esta corrección.
2. **Tres huecos del README de `skills-pro` quedan resueltos** (ver §0): SDK de YouTube Playables (7 skills martinalmeida), accesibilidad (3 skills) y Spine / 3D prerenderizado a 2D (spine-skeletal + character-rig + 9 blender). El README se actualizó con una sección «Huecos resueltos 15/11/2026».
3. **Dos decisiones de la revisión de las 8:00 quedan revocadas por esta ronda** (con motivo escrito en el README de `skills-pro`): `maximizing-game-feel` sí se instaló (como complemento de `game-feel`, no sustituto) y se instalaron repos de 0–13 estrellas (jammyfu, martinalmeida, zenkifeed, byandresfe) porque cada `SKILL.md` se leyó entero — las estrellas no fueron el filtro en esta ronda.
4. **`estandares-calidad-daniel` no existe como carpeta en el kit** (ver §4). Anita debe verificar dónde vive ese documento.
5. **Las 66 skills antiguas del kit NO tienen `LICENSE` ni `SOURCE.md` en sus carpetas** (verificado: solo el README las indexa). Las 81 nuevas sí los tienen. No es mi scope arreglar las 66, pero queda anotado: si alguien audita licencias del kit, las antiguas hay que completarlas.

## 9. Qué cambia a partir de ahora en la forma de fabricar

1. **Nada se fabrica sin pasar por `stress-testing-game-concepts` + `prototype-fast`.** El concepto se audita antes de construir; el prototipo es desechable y responde a UNA pregunta. Esto es lo que habría parado los 5 juegos descartados antes de gastar el día en ellos.
2. **Arte premium primero, con mockup aprobado por Daniel** (`game-ui-taste` + `taste-skill` + `directing-game-visuals` + `blender-stylized-npr` para la dirección cómic). Sin su OK al diseño acabado, no se programa.
3. **Personajes desde un master still aprobado** (`generate2dsprite` → `video2dsprite`): una identidad, un clip por acción, keying y loops verificados. Nada de sprites que cambian de cara entre frames.
4. **Feel como fase propia, no como barniz final** (`maximizing-game-feel` + `action-feel` + `juice-vfx`): vocabulario de feedback por evento, validación en juego, y la simulación intacta (si un test de balance cambia tras el pase de feel, el pase tocó las reglas: buscarlo).
5. **Dos gates nuevos antes de enseñar nada a Daniel:** `gating-intent-legibility` (¿un jugador nuevo entiende qué hacer sin tutorial?) y `asset-audit` (¿todas las fotos son del modelo exacto? ¿nada inventado?). Un juego que no pasa estos dos gates no se enseña.
6. **Móvil de verdad, no emulación** (`mobile-native` + `scale-and-responsive` + `input-keyboard-mouse-touch` + `performance-budget`): 390×844 real, tap sin delay, 100dvh, notch, 60 fps con p95 medido.
7. **La plantilla usa el núcleo del §3, no todo el kit.** Advertencia: el kit tiene ahora 147 skills y demasiadas descripciones recortan el contexto del agente. La plantilla debe nombrar su subconjunto exacto por juego (el núcleo del §3 + 2–3 según género) y no cargar el resto.

## 10. Verificación realizada (15/11/2026)

- Cada `SKILL.md` instalado se leyó entero antes de copiar (81/81). Licencias verificadas en la raíz de cada repo (MIT salvo awesome-gamedev e impeccable, Apache-2.0; GSAP: librería propietaria gratuita, skills MIT).
- `find comunicacion-ias/kit/skills -name SKILL.md | wc -l` → **147**. Por carpetas: arte 54, competencia 13, pro 57, marketing 11.
- Cada carpeta nueva tiene `SKILL.md` + `LICENSE` + `SOURCE.md` (verificado por script; única excepción previa: `impeccable`, cuya LICENSE Apache-2.0 se descargó después del repo upstream y ya está en su carpeta).
- Spot-checks: `platformer/scripts/jump_tuner.py`, `spine-skeletal/scripts/bind_joint.py`, `building-era-authentic-game-audio/scripts/validate-audio-kit.mjs`, `review-animations/STANDARDS.md`, `choreograph/RECIPES.md`, `character-rig/reference/retarget-protocol.md`, `taste-skill/` sin `assets/` (2,1 MB).
- Repos sin licencia NO instalados: ingenium `game-audio`, `game-playtest-squad-skill`, Yakoub-ai/phaser4-gamedev, vibejam-starter-pack (ver §6).
- Rama `niky/skills-movil-1511`, commits firmados Niky (`cosa@recurretumulta.online`), push con el helper de credenciales con token de escritura, PR a `main`.

---

*Informe escrito para Anita y para el agente de la plantilla. Si una ruta no existe o un comando falla, no inventes: dime qué fila y qué error, y lo corrijo.*
