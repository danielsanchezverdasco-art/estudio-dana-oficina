import json
import re

path = "oficina-data.json"
d = json.load(open(path))

d["updated_at"] = "2026-11-22 14:47"

d["resumen"] = (
    "14:47 — Sin cambios desde las 13:20 (verificado en remoto con ls-remote + flags del almacén; "
    "tercera verificación seguida sin cambios). Ningún agente de Dana Games en marcha. Quitanieves A "
    "y B con mockup TERMINADO, esperando que Daniel apruebe (A 4a48fe2, B 9e489e4); la C 3D espera "
    "su decisión (arena acotada viable, mapa abierto no prometible). Desenfunda r7 en vivo, falta "
    "RONDA 8. Vecinos r3 en código (8e3a722), pendiente subir a Sandbox + re-playtest. Fútbol A/B/C "
    "terminadas en código, pendientes de verificación + subir. Monster/Sushi/Spot siguen pausados en "
    "fase 4. La difusión del Paper Soccer sigue BLOQUEADA (falta link final + cuenta de Reddit + "
    "login de Facebook). Faltan de Daniel: aprobar mockups A y B, decidir la C 3D, link final del "
    "Paper Soccer, cuenta de Reddit y arreglar el login de Facebook. Anita sin cambios."
)

PAT = re.compile(r"^Verificado \d{2}:\d{2}: .*?\. ")

def refresh(text, new_sentence):
    new_text, n = PAT.subn(new_sentence + " ", text, count=1)
    assert n == 1, f"sin prefijo Verificado en: {text[:80]}"
    return new_text

def find(lst, slug):
    for e in lst:
        if isinstance(e, dict) and e.get("slug") == slug:
            return e
    return None

notes = {
    "difusion-paper-soccer-grok": "Verificado 14:47: sin cambios; ningún agente en marcha. BLOQUEADO — Difusión del Paper Soccer de Grok: Facebook rechazó el login como Mozar Varistas (20:24); 0 grupos, 0 publicaciones.",
    "quitanieves-monstruo": "Verificado 14:47: sin cambios (A 4a48fe2 en remoto; mockup esperando aprobación de Daniel; ningún agente en marcha).",
    "quitanieves-tycoon": "Verificado 14:47: sin cambios (B 9e489e4 en remoto; GDD + mockup esperando aprobación de Daniel; ningún agente en marcha).",
    "desenfunda-y-dispara": "Verificado 14:47: sin cambios (sigue 68d4134 en vivo; ronda 8 pendiente de arrancar; ningún agente en marcha).",
    "vecinos": "Verificado 14:47: sin cambios (r3 sigue 8e3a722 en código, sin subir; ningún agente en marcha).",
    "paper-soccer": "Verificado 14:47: sin cambios en A/B/C (b09c9a7, e9f6449, 5aa2297; ls-remote OK); ningún agente en marcha.",
    "paper-soccer-tycoon-8x10": "Verificado 14:47: sin cambios (sigue f52a9dd en vivo; rediseño pendiente de arrancar; ningún agente en marcha).",
    "monster-tavern": "Verificado 14:47: sin cambios (sigue e0d8a60; fase 4 pausada; ningún agente en marcha).",
    "sushi-belt-frenzy": "Verificado 14:47: sin cambios (sigue 92eae16; fase 4 pausada; ningún agente en marcha).",
    "spot-the-robot": "Verificado 14:47: sin cambios (sigue 3838cbd; fase 4 pausada; ningún agente en marcha).",
}

for slug, note in notes.items():
    e = find(d.get("in_progress", []), slug)
    assert e is not None, slug
    e["status"] = refresh(e["status"], note)

e = find(d.get("published", []), "scribble-striker")
assert e is not None
e["status"] = refresh(
    e["status"],
    "Verificado 14:47: sin cambios; sigue 2f56e49 LIVE en Sandbox; ningún agente en marcha.",
)

note_anita = (
    "Verificado 14:47: sin cambios (Slice 4ea2167, Cyber 08abde42, barista-r7 1a23f6a, "
    "estampida-r13 dde1b80; Grid y Cofre sin rama en dana-games-juegos; ls-remote OK con flags "
    "del almacén); ningún agente de Anita en marcha."
)
d["anita"]["paso"] = refresh(d["anita"]["paso"], note_anita)
d["anita"]["status"] = refresh(d["anita"]["status"], note_anita)

d["factory"].append(
    "Verificado 14:47: sin cambios en nada (ls-remote OK con flags del almacén: Quitanieves A "
    "4a48fe2, B 9e489e4; Monster e0d8a60, Sushi 92eae16, Spot 3838cbd; Desenfunda 68d4134, Vecinos "
    "8e3a722, Fútbol 2f56e49, A/B/C b09c9a7/e9f6449/5aa2297, Tycoon f52a9dd; Anita Slice 4ea2167, "
    "Cyber 08abde42, barista-r7 1a23f6a, estampida-r13 dde1b80; Grid y Cofre sin rama en "
    "dana-games-juegos); ningún agente de Dana Games en marcha."
)

json.dump(d, open(path, "w"), ensure_ascii=False, indent=2)
print("OK updated_at =", d["updated_at"])
