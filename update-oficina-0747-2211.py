import json

path = "oficina-data.json"
d = json.load(open(path))

d["updated_at"] = "2026-11-22 07:47"

d["resumen"] = (
    "07:47 — Sin cambios: ningún agente de Dana Games en marcha; nada nuevo en los repos "
    "(ls-remote OK con flags del almacén, tips iguales a las 06:47); Monster/Sushi/Spot siguen "
    "pausados (0 ficheros nuevos en sus worktrees desde las 06:47); la difusión del Paper Soccer "
    "de Grok sigue BLOQUEADA (login de Facebook rechazado 20:24; 0 grupos, 0 publicaciones). "
    "Faltan de Daniel: link final del juego, cuenta de Reddit y arreglar el login de Facebook. "
    "Desenfunda r8 y Vecinos r3 pendientes. Fuera de ventana (07:47): sin mensaje a Daniel."
)

note_monster = (
    " Verificado 07:47: sin cambios (sigue e0d8a60 en remoto; 0 ficheros nuevos en el worktree "
    "desde 06:47); fase 4 pausada; ningún agente en marcha."
)
note_sushi = (
    " Verificado 07:47: sin cambios (sigue 92eae16 en remoto; 0 ficheros nuevos en el worktree "
    "desde 06:47); fase 4 pausada; ningún agente en marcha."
)
note_spot = (
    " Verificado 07:47: sin cambios (sigue 3838cbd en remoto; 0 ficheros nuevos en el worktree "
    "desde 06:47); fase 4 pausada; ningún agente en marcha."
)
note_desenfunda = (
    " Verificado 07:47: sin cambios (sigue 68d4134 en remoto); ronda 8 pendiente; ningún agente en marcha."
)
note_vecinos = (
    " Verificado 07:47: sin cambios (sigue 8e3a722 en remoto); ronda 3 pendiente de subir a Sandbox; "
    "ningún agente en marcha."
)
note_tycoon = (
    " Verificado 07:47: sin cambios (sigue f52a9dd en remoto); rediseño pendiente (diseño rechazado "
    "por Daniel 21/11); ningún agente en marcha."
)
note_futbol = (
    " Verificado 07:47: sin cambios (A b09c9a7, B e9f6449, C 5aa2297 en remoto); ningún agente en marcha."
)
note_difusion = (
    " Verificado 07:47: sigue BLOQUEADA (login de Facebook rechazado 20:24; 0 grupos, 0 publicaciones); "
    "faltan de Daniel: link final del juego, cuenta de Reddit y arreglar el login de Facebook."
)
note_anita = (
    " Verificado 07:47: sin cambios (Slice 4ea2167, Cyber 08abde42, barista-r7 1a23f6a, estampida-r13 "
    "dde1b80; Grid y Cofre sin rama en dana-games-juegos; ls-remote OK). Ningún agente de Anita en marcha."
)

def find(lst, slug):
    for e in lst:
        if isinstance(e, dict) and e.get("slug") == slug:
            return e
    return None

for slug, note in [
    ("monster-tavern", note_monster),
    ("sushi-belt-frenzy", note_sushi),
    ("spot-the-robot", note_spot),
    ("desenfunda-y-dispara", note_desenfunda),
    ("vecinos", note_vecinos),
    ("paper-soccer-tycoon-8x10", note_tycoon),
    ("paper-soccer", note_futbol),
    ("difusion-paper-soccer-grok", note_difusion),
]:
    e = find(d.get("in_progress", []), slug)
    if e is not None:
        key = "paso" if "paso" in e else "status"
        e[key] = (e.get(key) or "") + note

d["anita"]["paso"] = (d["anita"].get("paso") or "") + note_anita
d["anita"]["status"] = (d["anita"].get("status") or "") + note_anita

d["factory"].append(
    "Verificado 07:47: sin cambios en nada (Monster e0d8a60, Sushi 92eae16, Spot 3838cbd, "
    "Desenfunda 68d4134, Vecinos 8e3a722, Tycoon f52a9dd, Fútbol A/B/C sin cambios; Anita: Slice "
    "4ea2167, Cyber 08abde42, barista-r7 1a23f6a, estampida-r13 dde1b80; Grid y Cofre sin rama). "
    "Difusión Paper Soccer sigue BLOQUEADA (login FB rechazado 20:24). Ningún agente de Dana "
    "Games en marcha. Fuera de ventana: sin mensaje a Daniel."
)

json.dump(d, open(path, "w"), ensure_ascii=False, indent=2)
print("OK updated_at =", d["updated_at"])
