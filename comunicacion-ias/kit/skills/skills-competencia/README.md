# Skills de análisis (legítimas) — 15/11/2026

Copias de skills públicas en formato SKILL.md, para aprender patrones de diseño y auditar NUESTROS juegos. No usar para copiar código ni assets de la competencia.

| Carpeta | Origen | Para qué |
|---|---|---|
| `game-feel-and-juice/` | https://github.com/rondorkerin/gamestack (SKILL, CHECKLIST, GUIDE) | Feedback, juice, latencia, techo de efectos |
| `juice-audit/` | https://github.com/sponticelli/gamedev-claude-plugins | Auditoría rápida de un momento en 4 pilares |
| `game-polish-audit/` | https://github.com/funkytrain/game-polish-audit | Auditoría de polish (9 lentes + `scripts/scan_feedback.py`) |
| `game-quality-gates/` | https://github.com/abczsl520/game-quality-gates | Checklist de calidad H5/Phaser (timers, pause, anuncios) |
| `game-juice/` | https://aigamedev.ai/skills/game-juice/SKILL.md (el repo GitHub de jayesh-bansal/game-juice devolvió 404 al raw) | Reglas de juice 2D sin cambiar la simulación |
| `phaser-analyze/` | https://github.com/yakoub-ai/phaser4-gamedev | Análisis de un proyecto Phaser (arquitectura, leaks) |
| `review-game/` | https://github.com/PlayableIntelligence/game-creator | Review de arquitectura / performance de nuestro código |
| `gsap-core/` | https://github.com/greensock/gsap-skills | Animación DOM/UI con canon 60fps (la librería GSAP es gratuita propietaria; las skills son MIT) |
| `gsap-timeline/` | https://github.com/greensock/gsap-skills | Timelines y secuenciación de animación |
| `gsap-performance/` | https://github.com/greensock/gsap-skills | Rendimiento de animación: 60fps, transform/opacity |
| `juice-vfx/` | https://github.com/jammyfu/open-game-skills | VFX en runtime con contrato de evento, caps y limpieza (no toca la simulación) |
| `haptic-rumble/` | https://github.com/jammyfu/open-game-skills | Háptica móvil con capability checks y fallback no háptico |
| `camera-anti-clip/` | https://github.com/jammyfu/open-game-skills | Cámara sin clipping: near-plane, decollision, shake dentro del presupuesto |
| `performance-budget/` | https://github.com/jammyfu/open-game-skills | Objetivos de rendimiento: p50/p95/p99, frame pacing, latencia de input |

Herramientas instaladas: ver `/workspace/tools/README.md`.

Añadidas 15/11/2026 (ronda de calidad, orden de Daniel 18:42; cada SKILL.md leído entero antes de instalar, ver `comunicacion-ias/informe-skills-calidad-2026-11-15.md`): `gsap-*`, `juice-vfx`, `haptic-rumble`, `camera-anti-clip` y `performance-budget` son skills de **ejecución** (juice y rendimiento), no de análisis de la competencia. Corrección honesta: la dependencia `gsap-skills` que el análisis de la competencia atribuía a `game-juice` **no se pudo confirmar** — la copia instalada de `game-juice` no menciona gsap y en `awesome-gamedev-agent-skills` no existe ninguna skill `*juice*`. GSAP se instaló por méritos propios.
