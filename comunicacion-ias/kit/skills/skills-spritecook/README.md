# Skills SpriteCook — Arte 2D generado para Dana Games

Skills oficiales de SpriteCook (spritecook.ai) para generar arte 2D de juegos
desde el agente: personajes pixel art y HD, animaciones, tilesets autotile,
kits de UI y pulido de sprites. Orden de Daniel del 15/11/2026 20:56
(«Revisa esta skill, tiene buena pinta, e instala»).

Todas con licencia MIT verificada (plugin y repo de skills). Cada carpeta lleva
su `SKILL.md` (leído entero antes de instalar), su `SOURCE.md` con repo,
commit y licencia, y su fichero LICENSE copiado.

**Sin cuenta conectada, las skills no generan nada:** son instrucciones para
el agente; la generación real va por el MCP de SpriteCook
(`https://mcp.spritecook.ai/mcp/claude`), que se conecta con inicio de sesión
por navegador. La cuenta y los créditos son de Daniel (ver informe).

| Skill | Repo | Estrellas | Licencia | Qué hace en Dana Games |
|---|---|---|---|---|
| spritecook-workflow-essentials | SpriteCook/skills | 60 | MIT | Reglas de todo flujo: créditos, polling, manifiesto de asset_id, seguridad, defaults (Nano Banana 2.1, smart_crop tightest) |
| spritecook-generate-sprites | SpriteCook/skills | 60 | MIT | Personajes y sprites pixel/HD; héroe primero con `generate_character`, resto con `reference_asset_id`; hojas 3×3/4×4; Pixel Engine Image para tamaño exacto |
| spritecook-polish-sprites | SpriteCook/skills | 60 | MIT | Bordes y transparencia tras quitar el fondo; comparar umbrales en local (0 créditos) y guardar el mejor |
| spritecook-build-ui-kits | SpriteCook/skills | 60 | MIT | Menús, HUDs, inventarios y diálogos con un solo concepto; extracción de componentes con 9-slice |
| spritecook-generate-tilesets | SpriteCook/skills | 60 | MIT | Tilesets autotile 15 piezas (top-down), 16 piezas (plataformas), isométricos; dos superficies (hierba+agua) |
| spritecook-animate-assets | SpriteCook/skills | 60 | MIT | Animar un asset: idle, andar, correr, ataque, salto; motores pixel-engine v1.1/v1.5; preparar la pose inicial antes |
| spritecook-upload-assets | SpriteCook/skills | 60 | MIT | Subir una imagen local a SpriteCook para animarla, editarla o usarla como referencia |
| spritecook-use-presets | SpriteCook/skills | 60 | MIT | Reutilizar presets guardados de Daniel (estilo, modelo, tamaño, colores, referencias) |
| spritecook-use-assets-in-godot | SpriteCook/skills | 60 | MIT | Exportar a Godot 4.x (SpriteFrames + AnimatedSprite2D/3D). Dana Games usa Phaser: de reserva |
| spritecook-use-dual-grid-tilesets | SpriteCook/skills | 60 | MIT | Implementar tilesets de 15 piezas con renderer dual-grid (máscara 4 bits); adaptable a Phaser |

## Flujo recomendado (resumen)

1. **Héroe primero:** `generate_character` (perspectiva del juego) → guardar su `asset_id` en el manifiesto del proyecto.
2. **Resto con referencia:** todo lo demás con `reference_asset_id` = el héroe (o `style_asset_ids` para guías de estilo); nunca generaciones sueltas sin referencia.
3. **Pulir antes de animar:** `spritecook-polish-sprites` (comparar en local, 0 créditos) y luego animar el asset pulido.
4. **Animar:** `generate_character_animations` (presets del personaje) o `animate_game_art` por movimiento, preparando antes la pose inicial.
5. **UI:** un concepto primero con `spritecook-build-ui-kits`; nunca controles sueltos para una pantalla entera.
6. **Créditos:** `get_credit_balance` al empezar y antes de cada lote; los trabajos fallidos se reembolsan normalmente.

## Notas

- Plan gratis: 40 créditos cada 30 días, sin tarjeta; las generaciones gratis son **públicas**; uso comercial permitido en todos los planes; las exportaciones de motor empiezan en los planes de pago (desde 8 $/mes).
- Costes orientativos (según las skills; confirmar con `list_generation_models`): Nano Banana 2.1 base 12/18/30 créditos a 1K/2K/4K; concepto u hoja de UI kit ~22 créditos a resolución estándar.
- El detalle completo (qué cubre cada skill, cómo verificarla, límites y pasos de Daniel) está en `comunicacion-ias/informe-spritecook-2026-11-15.md`.
