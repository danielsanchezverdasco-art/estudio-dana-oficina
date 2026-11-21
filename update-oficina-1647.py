#!/usr/bin/env python3
"""Oficina 16:47 — Fase 4 EN MARCHA en los 3 juegos (agentes lanzados ~16:25,
activos, sin commits aún); resto sin cambios (ls-remote OK con flags)."""
import json

p = "oficina-data.json"
d = json.load(open(p))

d["updated_at"] = "2026-11-21 16:47"
d["resumen"] = (
    "16:47 — Fase 4 EN MARCHA en los 3 juegos: arte 3D + juego completo "
    "(Monster Tavern, Sushi Belt Frenzy y Spot the Robot; agentes lanzados "
    "~16:25, activos ahora mismo, sin commits aún — llevan ~20 min). En cuanto "
    "haya prototipo jugable, Dani lo sube a Sandbox y lo juega en vivo. Resto "
    "sin cambios (Tycoon rediseño pendiente, Desenfunda r8, Vecinos r3, "
    "Fútbol A/B/C, Anita sin cambios)."
)

def prepend_status(slug, note):
    for it in d["in_progress"]:
        if it["slug"] == slug:
            it["status"] = note + " " + it.get("status", "")
            return

def prepend_paso(slug, note):
    for it in d["in_progress"]:
        if it["slug"] == slug:
            it["paso"] = note + " " + it.get("paso", "")
            return

# --- Los 3 juegos nuevos: fase 4 EN MARCHA ---
for slug in ("monster-tavern", "sushi-belt-frenzy", "spot-the-robot"):
    for it in d["in_progress"]:
        if it["slug"] == slug:
            it["status"] = (
                "EN MARCHA — Fase 4 en marcha: arte 3D + juego completo (agente "
                "lanzado ~16:25, activo ahora mismo, sin commits aún — lleva ~20 "
                "min). Queda ~arte 3D + prototipo M1 (sin estimación hasta ver el "
                "primer avance). Verificado 16:47 (ls-remote OK, sin cambios). "
                + it.get("status", "")
            )
            it["paso"] = (
                "Fase 4 EN MARCHA (arte 3D + juego completo): agente lanzado ~16:25, "
                "activo ahora mismo, sin commits aún; mockup A aprobado por Daniel ~15:55"
            )
            it["queda"] = "~arte 3D + prototipo M1 (sin estimación hasta ver el primer avance)"

# --- Sin cambios, verificados por ls-remote ---
prepend_status("desenfunda-y-dispara",
    "Verificado 16:47: sin cambios (sigue 68d4134 en vivo; ronda 8 pendiente de arrancar; ningún agente en marcha; ls-remote OK).")
prepend_paso("desenfunda-y-dispara",
    "Verificado 16:47: sin cambios (sigue 68d4134 en vivo; ronda 8 pendiente de arrancar; ningún agente en marcha).")
prepend_status("vecinos",
    "Verificado 16:47: sin cambios (r3 sigue 8e3a722 en código, sin subir; ningún agente en marcha; ls-remote OK).")
prepend_paso("vecinos",
    "Verificado 16:47: sin cambios (r3 sigue 8e3a722 en código, sin subir; ningún agente en marcha).")
prepend_status("paper-soccer",
    "Verificado 16:47: sin cambios en A/B/C (b09c9a7, e9f6449, 5aa2297; ls-remote OK); ningún agente en marcha.")
prepend_paso("paper-soccer",
    "Verificado 16:47: sin cambios en A/B/C (b09c9a7, e9f6449, 5aa2297; ls-remote OK); ningún agente en marcha.")
prepend_status("paper-soccer-tycoon-8x10",
    "Verificado 16:47: sin cambios (sigue f52a9dd en vivo; rediseño pendiente de arrancar; ningún agente en marcha; ls-remote OK).")
prepend_paso("paper-soccer-tycoon-8x10",
    "Verificado 16:47: sin cambios (sigue f52a9dd en vivo; rediseño pendiente de arrancar; ningún agente en marcha).")

# --- Anita: sin cambios (ls-remote OK) ---
a = d.get("anita", {})
a["paso"] = (
    "Verificado 16:47: verificación FRESCA (ls-remote OK con flags del almacén): "
    "sin cambios (Slice 4ea2167, Cyber 08abde42, barista-r7 1a23f6a, "
    "estampida-r13 dde1b80; Grid y Cofre sin rama en dana-games-juegos); ningún "
    "agente de Anita en marcha. "
    + a.get("paso", "")
)

json.dump(d, open(p, "w"), ensure_ascii=False, indent=2)
print("OK updated_at", d["updated_at"])
