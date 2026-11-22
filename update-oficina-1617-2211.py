import json

path = "oficina-data.json"
d = json.load(open(path))

d["updated_at"] = "2026-11-22 16:17"

d["resumen"] = (
    "16:17 — Sin cambios desde las 13:20 (verificado en remoto con ls-remote + flags del almacén; "
    "sexta verificación seguida sin cambios). Ningún agente de Dana Games en marcha. Quitanieves "
    "A y B con mockup TERMINADO, esperando que Daniel apruebe (A 4a48fe2, B 9e489e4); la C 3D espera "
    "su decisión (arena acotada viable, mapa abierto no prometible). Desenfunda r7 en vivo, falta "
    "RONDA 8. Vecinos r3 en código (8e3a722), pendiente subir a Sandbox + re-playtest. Fútbol A/B/C "
    "terminadas en código, pendientes de verificación + subir. Monster/Sushi/Spot siguen pausados en "
    "fase 4. La difusión del Paper Soccer sigue BLOQUEADA (falta link final + cuenta de Reddit + "
    "login de Facebook). Faltan de Daniel: aprobar mockups A y B, decidir la C 3D, link final del "
    "Paper Soccer, cuenta de Reddit y arreglar el login de Facebook. Anita sin cambios."
)

note_quitanieves_a = (
    " Verificado 16:17: sin cambios (A 4a48fe2 en remoto; mockup esperando aprobación de Daniel); "
    "ningún agente en marcha."
)
note_quitanieves_b = (
    " Verificado 16:17: sin cambios (B 9e489e4 en remoto; GDD + mockup esperando aprobación de "
    "Daniel); ningún agente en marcha."
)
note_monster = (
    " Verificado 16:17: sin cambios (sigue e0d8a60 en remoto); fase 4 pausada; ningún agente en marcha."
)
note_sushi = (
    " Verificado 16:17: sin cambios (sigue 92eae16 en remoto); fase 4 pausada; ningún agente en marcha."
)
note_spot = (
    " Verificado 16:17: sin cambios (sigue 3838cbd en remoto); fase 4 pausada; ningún agente en marcha."
)
note_desenfunda = (
    " Verificado 16:17: sin cambios (sigue 68d4134 en vivo); ronda 8 pendiente de arrancar; "
    "ningún agente en marcha."
)
note_vecinos = (
    " Verificado 16:17: sin cambios (r3 sigue 8e3a722 en código, sin subir); ningún agente en marcha."
)
note_tycoon = (
    " Verificado 16:17: sin cambios (sigue f52a9dd en vivo); rediseño pendiente de arrancar; "
    "ningún agente en marcha."
)
note_futbol = (
    " Verificado 16:17: sin cambios en A/B/C (b09c9a7, e9f6449, 5aa2297; ls-remote OK); "
    "ningún agente en marcha."
)
note_difusion = (
    " Verificado 16:17: sin cambios; sigue BLOQUEADA (login de Facebook rechazado 20:24; 0 grupos, "
    "0 publicaciones); faltan de Daniel: link final del juego, cuenta de Reddit y arreglar el "
    "login de Facebook."
)
note_anita = (
    " Verificado 16:17: sin cambios (Slice 4ea2167, Cyber 08abde42, barista-r7 1a23f6a, estampida-r13 "
    "dde1b80; Grid y Cofre sin rama en dana-games-juegos; ls-remote OK con flags del almacén). "
    "Ningún agente de Anita en marcha."
)

def find(lst, slug):
    for e in lst:
        if isinstance(e, dict) and e.get("slug") == slug:
            return e
    return None

for slug, note in [
    ("quitanieves-monstruo", note_quitanieves_a),
    ("quitanieves-tycoon", note_quitanieves_b),
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

pub = find(d.get("published", []), "scribble-striker")
if pub is not None:
    pub["status"] = (
        "Verificado 16:17: sin cambios; sigue 2f56e49 LIVE en Sandbox; ningún agente en marcha. "
        + (pub.get("status") or "")
    )

d["anita"]["paso"] = (d["anita"].get("paso") or "") + note_anita
d["anita"]["status"] = (d["anita"].get("status") or "") + note_anita

d["factory"].append(
    "Verificado 16:17: sin cambios en nada (ls-remote OK con flags del almacén: Quitanieves A "
    "4a48fe2, B 9e489e4; Monster e0d8a60, Sushi 92eae16, Spot 3838cbd; Desenfunda 68d4134, Vecinos "
    "8e3a722, Fútbol 2f56e49, A/B/C b09c9a7/e9f6449/5aa2297, Tycoon f52a9dd; Anita Slice 4ea2167, "
    "Cyber 08abde42, barista-r7 1a23f6a, estampida-r13 dde1b80; Grid y Cofre sin rama en "
    "dana-games-juegos); ningún agente de Dana Games en marcha."
)

json.dump(d, open(path, "w"), ensure_ascii=False, indent=2)
print("OK updated_at =", d["updated_at"])
