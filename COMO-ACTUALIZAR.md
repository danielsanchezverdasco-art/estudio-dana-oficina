# Cómo actualizar la oficina (para Anita y Dani)

La oficina lee `oficina-data.json` (esta misma rama, `oficina-live`, repo `danielsanchezverdasco-art/estudio-dana-oficina`).
Con CADA cambio (publicar, rechazar, empezar o terminar un juego) se actualiza ese fichero.
La oficina lo lee sola y las listas se refrescan sin reconstruir la página.

## Pasos

1. Entrar en la rama `oficina-live` (o crear un worktree la primera vez:
   `git worktree add ../wt-oficina-live -b oficina-live origin/oficina-live`).
   Antes de editar: `git pull origin oficina-live` para no pisar el cambio de la otra.
2. Editar `oficina-data.json`:
   - Mover el juego entre `published`, `in_progress`, `to_test`, `rejected`.
   - Actualizar `anita` (`status`, `names`, `names_pending`) y `factory`.
   - Poner `updated_at` con la fecha y hora de Madrid y `updated_by` con tu nombre.
3. Comprobar que el JSON es válido: `python3 -m json.tool oficina-data.json > /dev/null`.
4. `git add oficina-data.json && git commit -m "oficina: <qué cambió>"` y `git push origin oficina-live`.
   No hace falta PR para el fichero de datos (es el canal en vivo, no `main`).
5. Verificar que el cambio está en vivo:
   `curl -s https://raw.githubusercontent.com/danielsanchezverdasco-art/estudio-dana-oficina/oficina-live/oficina-data.json`
   tiene que traer el cambio.

## Reglas

- No inventar nombres ni datos: solo lo verificado.
- Si Daniel no ha dado los nombres de los juegos, `names_pending: true` y `names: []`.
- Si el push da error de credenciales, no reintentar a ciegas: avisar en la issue #40.
