# Informe SpriteCook — revisión e instalación (2026-11-15)

Orden de Daniel (15/11/2026 20:56, captura de un post): «Revisa esta skill,
tiene buena pinta, e instala».

## 1. Qué es SpriteCook (verificado)

SpriteCook (spritecook.ai) genera arte 2D para juegos: personajes pixel art
y HD detallado, animaciones (idle, andar, correr, ataque, salto), tilesets
autotile de 15 piezas, kits de UI, PNG transparentes y sprite sheets para
Unity, Godot, Phaser y GameMaker.

- Plugin oficial para Claude Code: https://github.com/SpriteCook/claude-plugin
  (v0.1.15, commit `0032d2e27a525db109b9b1749ec6681864d53146`, 2026-11-12,
  34 estrellas, licencia MIT).
- Fuente de verdad de las skills: https://github.com/SpriteCook/skills
  (revisión `289cc2750fc3a7a468017c3d8b0f18efde1802e2`, 60 estrellas, MIT).
  La revisión empaquetada en el plugin es exactamente la actual del repo
  (comprobado el 15/11).
- MCP alojado: `https://mcp.spritecook.ai/mcp/claude` (HTTP, sin API key; se
  conecta con inicio de sesión por navegador — OAuth — la primera vez).
- Versión de las skills: 2026.10.20 (según `spritecook-workflow-essentials`).

## 2. Las 10 skills instaladas

Nueva categoría `comunicacion-ias/kit/skills/skills-spritecook/`. Cada carpeta
lleva su `SKILL.md` (leído entero antes de instalar), su `SOURCE.md` (repo,
commit, licencia) y su fichero LICENSE copiado.

| Skill | Qué cubre | Cómo se usa (resumen) | Cómo verificarla |
|---|---|---|---|
| spritecook-workflow-essentials | Reglas de todo flujo: créditos, polling asíncrono, manifiesto de `asset_id`, seguridad de credenciales, defaults | Leerla siempre primero junto a la skill del trabajo; `get_credit_balance` al empezar y antes de cada lote; guardar `asset_id` en `spritecook-assets.json` | `SKILL.md` leído entero; sin MCP conectado no genera nada, pero sus reglas se aplican igual |
| spritecook-generate-sprites | Sprites y personajes pixel/HD; `generate_character` + `generate_character_animations`; hojas 3×3/4×4; Pixel Engine Image (tamaño exacto 16–128 px) | **Héroe primero** con `generate_character` (perspectiva del juego); el resto con `reference_asset_id` = el héroe; `style_asset_ids` para guías de estilo; `edit_asset_id` solo para modificar un asset | Generar un sprite de prueba y comprobar tamaño, transparencia y coherencia con el héroe; `list_generation_models` para modelos y costes actuales |
| spritecook-polish-sprites | Bordes y transparencia tras quitar el fondo; comparar umbrales en local y guardar el mejor (0 créditos) | `get_asset_metadata` → descargar la fuente preservada → `scripts/compare_alpha.py` → `set_asset_alpha_cutoff` una vez | **Test del script: 5/5 OK** (`python3 -m unittest test_compare_alpha`, Pillow 10.2.0, 15/11); el script no hace red ni gasta créditos |
| spritecook-build-ui-kits | Menús, HUDs, inventarios, diálogos y ajustes con un solo concepto compartido; extracción con 9-slice | Concepto primero (o `concept_asset_id` existente) → hojas de componentes → extraer → revisar `quality_summary` → finalizar | Revisar el `quality_summary` antes de finalizar; comprobar nombres distintos y rectángulos correctos |
| spritecook-generate-tilesets | Tilesets autotile: 15 piezas top-down, 17 piezas base, 16 piezas plataformas, isométricos; dos superficies | `generate_tileset` con `piece_set` y `tile_size`; referenciar/editar hereda los ajustes (volver a pasar `edges="two_surfaces"` si toca) | Probar el tileset en un mapa pequeño: ~1 de cada 3 variaciones puede tener un tile interior que no envuelve (se ve como damero) |
| spritecook-animate-assets | Animar un asset: idle, andar, correr, ataque, salto; motores pixel-engine v1.1/v1.5 | Preparar ANTES el fotograma inicial con la pose correcta (un bucle de dormir parte de un personaje tumbado); luego `animate_game_art` | Inspeccionar todos los fotogramas: bordes sin parpadeo, bucle que cierra (último = primero), pies quietos donde toca |
| spritecook-upload-assets | Subir una imagen local a SpriteCook para animarla, editarla o referenciarla | `create_asset_upload` → PUT a `api.spritecook.ai` → `finalize_asset_upload`; solo la imagen elegida, nunca archivos vecinos | El `asset_id` devuelto existe en `list_recent_assets`; nunca imprimir tokens ni URLs firmadas |
| spritecook-use-presets | Reutilizar presets guardados (estilo, modelo, tamaño, colores, referencias) | `list_presets` → `get_preset_settings` → mapear a la herramienta de generación; `save_private_preset` solo si Daniel lo pide | El preset aplicado se nota en el resultado (mismo estilo/modelo que el guardado) |
| spritecook-use-assets-in-godot | Exportar a Godot 4.x (SpriteFrames + AnimatedSprite2D/3D), manual o por MCP | Ruta manual preferida (`.tres` + `AtlasTexture` por fotograma); `export_godot_character_package` si Daniel lo pide | Abrir el proyecto en Godot 4.x: sin avisos de recursos perdidos; `frame_count × frame_width == ancho del spritesheet` |
| spritecook-use-dual-grid-tilesets | Implementar tilesets de 15 piezas con renderer dual-grid (máscara de 4 bits) | Copiar el pseudocódigo (tabla `frameByMask`, celda de contra-superficie en columna 0, fila 3); pintar un mapa de prueba | El mapa de prueba no muestra damero; la costa diagonal lee como escalones (límite conocido del set de 15 piezas) |

## 3. Flujo recomendado para Dana Games

1. **Héroe primero:** `generate_character` con la perspectiva del juego
   (platformer / isométrico / topdown) y su modelo por defecto
   (Nano Banana 2.1, `gemini-nano-banana-2.1`). Guardar su `asset_id`.
2. **Resto con referencia:** todo lo demás con `reference_asset_id` = el héroe
   (o `style_asset_ids` para guías de estilo). Nunca generaciones sueltas
   sin referencia: es como se pierde la coherencia.
3. **Pulir antes de animar:** `spritecook-polish-sprites` en local (0 créditos)
   y luego animar el asset pulido.
4. **Animar:** `generate_character_animations` para los presets del personaje
   (idle, walk, jump, run, attack, hurt, death según perspectiva) o
   `animate_game_art` por movimiento, preparando antes la pose inicial.
5. **UI:** un concepto primero con `spritecook-build-ui-kits`; nunca controles
   sueltos para una pantalla entera.
6. **Créditos:** `get_credit_balance` al empezar y antes de cada lote.

Encaje con las reglas del estudio: SpriteCook cubre la generación de assets
(paso obligatorio 7 de las 14 obligaciones), siempre con la preview aprobada
como guía visual y comparando cada asset con ella antes de darlo por bueno.
El nivel de arte que busca Daniel es el de las previews de los 6 juegos
aprobados (orden 15/11 20:46).

## 4. Límites honestos (leer antes de usar)

- **Plan gratis: 40 créditos cada 30 días, sin tarjeta.** Las generaciones
  gratis son **públicas**. Uso comercial permitido en todos los planes.
  Las exportaciones de motor empiezan en los planes de pago (desde 8 $/mes).
- **La cuenta y los créditos son de Daniel.** Solo él puede crear la cuenta
  y pagar. Yo NO he creado ninguna cuenta ni he pagado nada.
- **Sin cuenta conectada, las skills no generan nada.** Son instrucciones
  para el agente; la generación real necesita el MCP conectado (inicio de
  sesión por navegador, OAuth, la primera vez que se usa una herramienta).
- **Costes orientativos** (según las skills; confirmar siempre con
  `list_generation_models`): Nano Banana 2.1 base 12/18/30 créditos a
  1K/2K/4K; concepto u hoja de UI kit ~22 créditos a resolución estándar.
  Los trabajos fallidos normalmente se reembolsan (confirmar con
  `get_credit_balance` antes de decir que se cobró).
- **Las URLs de descarga firmadas caducan** y se refrescan volviendo a
  consultar el asset o el trabajo.
- **Los trabajos largos devuelven «en cola» o «en curso»:** hay que volver
  a consultar su estado (`check_job_status`); no reenviar un trabajo en cola.
- **Godot no es nuestro motor:** Dana Games usa Phaser para YouTube Jugables.
  La skill de Godot queda como reserva para otros proyectos.
- **~1 de cada 3 tilesets** puede tener un tile interior que no envuelve;
  hay que comprobar cada variación antes de usarla.

## 5. Qué NO se hizo (y por qué)

- No se creó ninguna cuenta de SpriteCook ni se conectó el MCP aquí: eso
  exige el inicio de sesión por navegador de Daniel. No se inventó ni se
  rodeó nada.
- No se gastó ningún crédito ni se generó ningún asset: no hay cuenta.
- No se tocó recurretumulta, ni la Tienda España, ni los juegos en marcha,
  ni la torre. No se publicó nada.

## 6. Verificación realizada (15/11/2026)

- Las 10 `SKILL.md` leídas enteras antes de instalar (1.154 líneas) + README,
  LICENSE, `skills-source.json`, `.mcp.json`, manifiesto del plugin
  (v0.1.15) y archivos de apoyo (scripts de pulido, `agents/openai.yaml`).
- Licencia MIT verificada en ambos repos (plugin y skills) vía LICENSE y API
  de GitHub; la revisión empaquetada coincide con la actual del repo fuente.
- Test del script de pulido: **5/5 OK** (`python3 -m unittest
  test_compare_alpha`, Pillow 10.2.0). El script no hace llamadas de red.
- Instalación: 10 SKILL.md + 10 SOURCE.md + 10 LICENSE + scripts y yamls de
  apoyo, en rama `niky/spritecook-1511` + PR (ver abajo).

## 7. Pasos que solo puede hacer Daniel

1. **Crear la cuenta** en https://spritecook.ai (plan gratis, 40 créditos/mes,
   sin tarjeta) — o decir si prefiere un plan de pago (desde 8 $/mes).
2. **Conectar el MCP** la primera vez que se use (inicio de sesión por
   navegador con su cuenta de SpriteCook).
3. **Decir el presupuesto de créditos por juego** (p. ej. cuánto del plan
   gratis va a Traffic Chaos) antes de generar en serie.
