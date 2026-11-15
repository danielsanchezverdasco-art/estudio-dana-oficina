# Niky · registro

Daniky = Niky.

(Escribe aquí cada entrega con fecha y hora de Madrid, skills usadas y ruta.)

## Herramientas

(Qué tengo y qué me falta: generación de imágenes, navegador para Playgama y YouTube, Node + Phaser 3 + TypeScript, ffmpeg.)

## Autorrevisiones

(APROBADO o DEVUELTO de los juegos de Anita, con fecha, slug, ronda y lo comprobado.)

## 🔴 EN VIVO — Traffic Chaos: New York Rush · CÓDIGO del juego real · 15/11/2026, 22:23, hora de Madrid

**Estado ahora mismo:** estoy programando el juego real (portando la simulación del prototipo a la plantilla Phaser 3 + TS + Vite, con niveles, modo caos, meta tycoon, tutorial y plataforma). Daniel lo FORZÓ: todo el poder en este juego.

**Avance (actualizado 22:42):**
- ✅ Leída la base: plantilla (`README`, `config`, `platform`, `audio`, `juice`, `ui`, escenas), prototipo pulido (reglas, tutorial, balance, políticas), dirección de arte, teardown (PR #32) y kit de skills.
- ✅ `npm install` en `traffic-chaos/` (80 paquetes).
- ✅ Reglas del prototipo portadas a `src/rules/` + `src/sim/policies.ts` (sin `localStorage`: la persistencia del tutorial pasa a `bridge.storage`).
- ✅ 7 WAV del prototipo copiados a `public/sfx/` (el agente de audio entrega los definitivos).
- ✅ Constantes de caos en `traffic-config.ts` (patinetes erráticos, camiones que bloquean, ambulancias seguidas).
- ✅ Modo caos en `traffic.ts` (endless, sin temporizador: rampa de spawn cada 20 s, camiones desde 20 s, patinetes erráticos desde 30 s, ambulancias cada 5 s) + tutorial sin `localStorage` (pasa a `bridge.storage`).
- ✅ `design/levels.ts`: 10 barrios (Times Square → Coney Island), tabla v1 jugable para revisión del agente de jugabilidad; nivel 1 = dificultad fácil del prototipo, verbatim.
- ✅ Tests portados en verde: **31/31** (`traffic.test.ts` 24 + `tutorial.test.ts` 7).
- ✅ Meta en el guardado (`save.ts`: barrios desbloqueados, estrellas, récord caos, reto diario) + `config`/`i18n`/`audio` del juego.
- ✅ Escenas reescritas: `Game` (sim portada + tutorial + caos + juice), `Menu` (attract = choque real en bucle), `Levels` (mapa 10 barrios), `Result` (estrellas, monedas, desbloqueo), `Boot` (texturas procedurales), `Preloader` (WAVs + arte opcional con fallback).
- ✅ Niveles retunados con el balance harness: L9/L10 estaban muertos (gridlock por `spawnT0` ≤1,0 + rampa de duración corta) — L9/L10 finales medidos 3/4 victorias de la política precisa. Tests: **61/61 en verde**.
- ✅ Verificación completa: `tsc` exit 0, `build:playgama` exit 0, `build:youtube` exit 0, `precheck.mjs` 0 FAIL en los dos (1 WARN heredado del template), `npm test` **61/61**.
- ✅ Docs: `GAME.md` (handoff), `SKILLS.md` (selección de skills), `FEEL_TUNING.md` (vocabulario de juice).
- ✅ TERMINADO (código): juego real completo en `traffic-chaos/`, sin commit ni push allí por orden. Informe final entregado al coordinador. Queda EN PROCESO fuera de mi parte: arte PNG real (agente de arte), números finales de niveles (agente de jugabilidad), QA en móvil de Daniel.
- ⏳ Pendiente: escenas `Game`/`Menu`/`Levels`/`Result`, meta tycoon + reto diario, i18n EN/ES, tests nuevos (niveles y caos), `tsc`, `build:playgama` + `build:youtube`, `precheck.mjs` 0 FAIL.

**Cuánto queda (orientativo, no promesa):** ~2 h más para el juego completo verificado (hacia ~00:30). Quedan fuera de mi parte: arte PNG real (agente de arte), números finales de niveles (agente de jugabilidad — yo pongo una tabla v1 jugable y la marco para su revisión), QA en móvil de Daniel.

**Dónde está el código:** repo privado `danielsanchezverdasco-art/dana-games-juegos`, worktree `~/workspace/wt-traffic-real`, rama `niky/traffic-chaos-real`, carpeta `traffic-chaos/`. Sin commit ni push allí por orden (la entrega es el informe al coordinador).

**⚠️ ATASCO encontrado y arreglado LO PRIMERO (regla 22:18, 22:22):** mi primer intento de escribir este estado se perdió — el checkout compartido `~/workspace/estudio-dana-oficina` lo usa también el agente de arte, que cambió de rama y mi edición de `niky.md` desapareció; además ese checkout está ahora mismo en conflicto (`UU` en `niky.md`, lo dejo intacto para su dueño, no lo toco). Solución aplicada: **worktree propio** `~/workspace/wt-traffic-codigo-1511` (rama `niky/traffic-codigo-1511`) solo para mis estados en vivo. La fábrica no se para: sigo programando y actualizo aquí en cada paso.
**Ruta de entrega de este estado:** esta constancia en rama `niky/traffic-codigo-1511` + PR.

## Encargo prioritario: Scribble Striker (fútbol de papel) · 15/11/2026, 11:05, hora de Madrid
- **Dónde está:** repo privado `danielsanchezverdasco-art/dana-games-juegos`, carpeta `scribble-striker/` (código Phaser 3 + TypeScript + Vite completo, pruebas, capturas y zip).
- **Léete primero** `scribble-striker/ESTADO.md` (cómo compilar, qué está hecho y qué falta, en orden).
- **Por dónde seguir:** 1) repetir `pruebas/corners.py` tras mover el botón x2 de la pantalla de victoria; 2) escribir `listing.txt` (primero EN, luego ES); 3) comparar lado a lado con Metro (`referencia-metro/`) y aplicar la lección del campo en `manual/CONTROL-CALIDAD.md` (cada equipo en su color, líneas del campo neutras, línea del centro que cuenta y dibujada, nivel «10.000 dólares»); 4) APROBADO de Anita; 5) subir a Playgama según `manual/PUBLICAR-Y-MARKETING.md`.
- **No empieces hasta que Daniel te lo diga.**
