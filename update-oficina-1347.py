#!/usr/bin/env python3
"""Actualizacion oficina 13:47 (cron dana-games-progreso-30min).
Novedad: los 4 GDDs de la tanda nueva ya estan en GitHub (Monster 04d575f,
Sushi 890f551, Seagull f78a80a, Spot 09d1747). Sushi y Seagull los commiteo
y pusheo yo en este run (sus agentes se atascaron al subir); Spot lo subio
su agente solo. Resto sin cambios, verificado con ls-remote + flags.
"""
import json

PATH = "oficina-data.json"
d = json.load(open(PATH, encoding="utf-8"))

d["updated_at"] = "2026-11-21 13:47"

d["resumen"] = (
    "13:47 — LOS 4 GDDs YA ESTÁN EN GITHUB: Monster Tavern (04d575f), "
    "Sushi Belt Frenzy (890f551), Seagull Attack (f78a80a) y Spot the Robot "
    "(09d1747): los 4 estudios + GDD v1 listos para que Daniel los apruebe; "
    "sin su OK no hay imágenes. Sushi y Seagull los he commiteado y pusheado "
    "yo en este run (sus agentes se quedaron atascados al subir). Resto sin "
    "cambios (verificado en remoto, ls-remote OK): ningún agente de Dana "
    "Games en marcha. TYCOON 8×10: rediseño pendiente. DESENFUNDA: falta "
    "ronda 8 (~2-3 h cuando arranque). VECINOS r3 en código, pendiente subir "
    "(~1 h). FÚTBOL A/B/C terminadas en código, pendientes de verificación + "
    "subir (~medio día). Anita sin cambios ni agentes en marcha."
)

def prepend_note(entry, key, note):
    entry[key] = note + entry.get(key, "")

def find(lst, slug):
    for e in lst:
        if e.get("slug") == slug:
            return e
    return None

# --- 3 proyectos nuevos en in_progress, tras monster-tavern ---
ip = d["in_progress"]
idx = next(i for i, e in enumerate(ip) if e.get("slug") == "monster-tavern")
nuevos = [
    {
        "slug": "sushi-belt-frenzy",
        "title": "Sushi Belt Frenzy",
        "status": (
            "EN MARCHA — FASE 1 ENTREGADA y subida a GitHub en este run "
            "(commit 890f551, rama niky/sushi-belt-2111): estudio de "
            "jugabilidad + GDD v1 + biblia de arte (esquema) + tabla de skills. "
            "El agente se quedó atascado al subirlo (aviso de riesgo) y lo he "
            "commiteado y pusheado yo, verificado con ls-remote. Paso actual: "
            "esperando que Daniel apruebe el GDD (N-21) — sin su OK no se "
            "genera ninguna imagen. Nada en marcha ahora mismo (sin agente). "
            "Queda ~: tras tu OK, 3 variantes de diseño + mockup acabado de la "
            "elegida + prototipo M1; sin estimación hasta aprobar el GDD."
        ),
        "paso": "Fase 1 entregada (890f551); esperando aprobación del GDD por Daniel (N-21)",
        "queda": "~tras tu OK: 3 variantes + mockup + prototipo M1",
        "commit": "890f551",
    },
    {
        "slug": "seagull-attack",
        "title": "Seagull Attack: Save the Sandwich",
        "status": (
            "EN MARCHA — FASE 1 ENTREGADA y subida a GitHub en este run "
            "(commit f78a80a, rama niky/seagull-attack-2111): estudio de "
            "jugabilidad + GDD v1 + biblia de arte (esquema) + tabla de skills. "
            "El agente escribió los ficheros fuera del worktree y se quedó "
            "atascado al subir (aviso de riesgo); los he movido al worktree, "
            "commiteado y pusheado yo, verificado con ls-remote. Paso actual: "
            "esperando que Daniel apruebe el GDD (N-21) — sin su OK no se "
            "genera ninguna imagen. Nada en marcha ahora mismo (sin agente). "
            "Queda ~: tras tu OK, 3 variantes de diseño + mockup acabado de la "
            "elegida + prototipo M1; sin estimación hasta aprobar el GDD."
        ),
        "paso": "Fase 1 entregada (f78a80a); esperando aprobación del GDD por Daniel (N-21)",
        "queda": "~tras tu OK: 3 variantes + mockup + prototipo M1",
        "commit": "f78a80a",
    },
    {
        "slug": "spot-the-robot",
        "title": "Spot the Robot",
        "status": (
            "EN MARCHA — FASE 1 ENTREGADA y en GitHub (commit 09d1747, rama "
            "niky/spot-the-robot-2111): estudio de jugabilidad + GDD v1 + "
            "biblia de arte (esquema) + tabla de skills, verificado con "
            "ls-remote (el agente lo subió solo). Paso actual: esperando que "
            "Daniel apruebe el GDD (N-21) — sin su OK no se genera ninguna "
            "imagen. Nada en marcha ahora mismo (sin agente). Queda ~: tras tu "
            "OK, 3 variantes de diseño + mockup acabado de la elegida + "
            "prototipo M1; sin estimación hasta aprobar el GDD."
        ),
        "paso": "Fase 1 entregada (09d1747); esperando aprobación del GDD por Daniel (N-21)",
        "queda": "~tras tu OK: 3 variantes + mockup + prototipo M1",
        "commit": "09d1747",
    },
]
ip[idx + 1:idx + 1] = nuevos

# --- Monster Tavern: nota 13:47 + paso/queda explicitos ---
mt = find(ip, "monster-tavern")
prepend_note(mt, "status",
    "Verificado 13:47: sin cambios (sigue 04d575f en GitHub, GDD pendiente "
    "de aprobación de Daniel; ningún agente en marcha). Ya están los 4 GDDs "
    "de la tanda en GitHub (Sushi 890f551, Seagull f78a80a, Spot 09d1747). ")
mt["paso"] = "Fase 1 entregada (04d575f); esperando aprobación del GDD por Daniel (N-21)"
mt["queda"] = "~tras tu OK: 3 variantes + mockup + prototipo M1"

# --- Notas 13:47 en el resto ---
prepend_note(find(ip, "desenfunda-y-dispara"), "status",
    "Verificado 13:47: sin cambios (sigue 68d4134 en vivo; ronda 8 pendiente "
    "de arrancar; ningún agente en marcha). ")
prepend_note(find(ip, "vecinos"), "status",
    "Verificado 13:47: sin cambios (r3 sigue 8e3a722 en código, sin subir; "
    "ningún agente en marcha). ")
prepend_note(find(ip, "paper-soccer"), "status",
    "Verificado 13:47: sin cambios en A/B/C (b09c9a7, e9f6449, 5aa2297; "
    "ls-remote OK); ningún agente en marcha. ")
prepend_note(find(ip, "paper-soccer-tycoon-8x10"), "status",
    "Verificado 13:47: sin cambios (sigue f52a9dd en vivo; rediseño pendiente "
    "de arrancar; ningún agente en marcha). ")

pub = find(d["published"], "scribble-striker")
prepend_note(pub, "status",
    "Verificado 13:47: sin cambios; sigue 2f56e49 LIVE en Sandbox, LISTO PARA "
    "PROBAR; ningún agente en marcha. ")

an = d["anita"]
prepend_note(an, "paso",
    "Verificado 13:47: verificación FRESCA (ls-remote OK con flags): sin "
    "cambios (Slice 4ea2167, Cyber 08abde42, barista-r7 1a23f6a, "
    "estampida-r13 dde1b80; Grid y Cofre sin rama en dana-games-juegos); "
    "ningún agente de Anita en marcha. ")
prepend_note(an, "status",
    "Verificado 13:47: sin cambios (Slice 4ea2167, Cyber 08abde42, "
    "barista-r7 1a23f6a, estampida-r13 dde1b80; ls-remote OK); ningún agente "
    "de Anita en marcha. ")

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
    f.write("\n")
print("OK: updated_at 13:47, resumen nuevo, 3 proyectos nuevos, notas 13:47")
