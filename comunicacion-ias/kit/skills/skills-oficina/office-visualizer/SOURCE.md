# SOURCE — office-visualizer

- Tipo: skill DERIVADA, escrita con palabras propias por Niky para Dana Games.
- Patrón inspirado en: https://github.com/simonhapp-ai/SMM-Project (Office Visualizer)
- Licencia del repo de referencia: SIN LICENCIA (no hay fichero LICENSE; la API de GitHub devuelve `license: null`). Por eso NO se instala ni se copia nada de ese repo.
- Estrellas del repo de referencia: 0 · último push: 2026-08-01 (leído de la API de GitHub el 2026-11-15)
- Instalado: 2026-11-15, rama niky/skills-oficina-1511 (misión skills de oficina, orden de Daniel 15/11 19:29)
- Qué es: el patrón de funcionamiento de una oficina en vivo — un único JSON como fuente de verdad (departamentos con id/nombre/agente/habitación/estado/tarea actual/última completada/notas, más lista del jefe, ayuda pedida y regla de tiempo), polling cada 8 s con fallback a 25 s, y aviso instantáneo por ntfy.sh (SSE) al actualizar — reformulado para la Torre Dana Games, donde la fuente en vivo es la API pública de GitHub y el JSON solo guarda lo que GitHub no sabe (última recogida de métricas, notas del jefe).
- Verificación: el repo de referencia se leyó para entender el patrón; no se copió código, ni textos, ni ficheros. La SKILL.md de esta carpeta es redacción propia.
