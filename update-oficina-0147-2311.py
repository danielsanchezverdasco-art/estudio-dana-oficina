#!/usr/bin/env python3
"""Oficina 01:47 23/11 — SIN CAMBIOS desde las 01:17: ningún commit nuevo en
dana-games-juegos hoy (git log --since 00:00 vacío); ls-remote OK con flags del
almacén (Slice 4ea2167, Desenfunda 68d4134, Quitanieves A 4a48fe2 / B 9e489e4,
scribble-striker-r1 44c1cea, Vecinos 8e3a722); ningún fichero nuevo en
paper-soccer-app/ads desde las 01:17 (zip 00:13, APK 00:16, ya cubiertos).
Las 2 tareas de navegador siguen en marcha pero cada vez más paradas: cambio
de icono en Playgama sin actividad ~40 min, registro en webs sin actividad
~76 min (posible atasco; pertenecen al chat principal, no se pueden dirigir
desde aquí). Ningún agente de Anita, Quitanieves, Desenfunda ni Vecinos en
marcha. Fuera de ventana (01:47): sin mensaje al chat."""
import json

p = "oficina-data.json"
d = json.load(open(p))

d["updated_at"] = "2026-11-23 01:47"
d["updated_by"] = "Dani (cron 30 min)"
d["resumen"] = (
    "01:47 — SIN CAMBIOS desde las 01:17: ningún commit nuevo hoy en "
    "dana-games-juegos; ls-remote OK (Slice 4ea2167, Desenfunda 68d4134, "
    "Quitanieves A 4a48fe2 / B 9e489e4, scribble-striker-r1 44c1cea, Vecinos "
    "8e3a722); ningún fichero nuevo en paper-soccer-app/ads desde las 01:17. "
    "Las 2 tareas de navegador siguen en marcha pero cada vez más paradas: "
    "cambio de icono en Playgama sin actividad ~40 min y registro en webs sin "
    "actividad ~76 min (posible atasco). Quitanieves A y B con mockup "
    "TERMINADO, esperan aprobación de Daniel; la C 3D espera su decisión. "
    "Desenfunda r7 en vivo, falta ronda 8 (~1 h orientativo). Vecinos r3 en "
    "código, pendiente subir a Sandbox. Fútbol A/B/C terminados en código, "
    "pendientes de verificación foto contra foto + subir. Pendiente de Daniel: "
    "aprobar mockups Quitanieves A y B, decidir la C 3D, probar el APK con el "
    "icono nuevo, cuenta de Reddit y arreglar el login de Facebook (difusión "
    "BLOQUEADA). Fuera de ventana (01:47): sin mensaje al chat."
)
d["factory"].append(
    "Verificado 01:47: sin cambios en nada (ningún commit nuevo hoy en "
    "dana-games-juegos; ls-remote OK con flags del almacén: Quitanieves A "
    "4a48fe2, B 9e489e4, Desenfunda 68d4134, Vecinos 8e3a722, "
    "scribble-striker-r1 44c1cea, Slice 4ea2167; ningún fichero nuevo en "
    "paper-soccer-app/ads desde las 01:17). Las 2 tareas de navegador siguen "
    "en marcha pero cada vez más paradas: cambio de icono en Playgama (tarea "
    "4e9edbcc, sin actividad ~40 min) y registro en webs (tarea ecc8eea9, sin "
    "actividad ~76 min) — posible atasco. Ningún agente de Anita, "
    "Quitanieves, Desenfunda ni Vecinos en marcha. Fuera de ventana (01:47): "
    "sin mensaje al chat."
)


def by_slug(lst, slug):
    for it in d.get(lst, []):
        if isinstance(it, dict) and it.get("slug") == slug:
            return it
    return None


# --- Anita: sin cambios (ls-remote OK) ---
a = d.get("anita", {})
nota = (
    "Verificado 01:47: sin cambios (Slice 4ea2167, Cyber 08abde42, barista-r7 "
    "1a23f6a, estampida-r13 dde1b80; Grid y Cofre sin rama en dana-games-juegos; "
    "ls-remote OK con flags del almacén). Ningún agente de Anita en marcha."
)
a["paso"] = a.get("paso", "") + " " + nota
a["status"] = a.get("status", "") + " " + nota

# --- Sin cambios: difusión, Quitanieves A/B, Desenfunda, Vecinos, Paper Soccer ---
for lst, slug, txt in [
    ("in_progress", "difusion-paper-soccer-grok",
     "Verificado 01:47: sin cambios; ningún agente en marcha."),
    ("in_progress", "quitanieves-monstruo",
     "Verificado 01:47: sin cambios (sigue 4a48fe2 en remoto; sin agente en marcha)."),
    ("in_progress", "quitanieves-tycoon",
     "Verificado 01:47: sin cambios (sigue 9e489e4 en remoto; sin agente en marcha)."),
    ("in_progress", "desenfunda-y-dispara",
     "Verificado 01:47: sin cambios (sigue 68d4134 en remoto; ningún agente en marcha)."),
    ("in_progress", "vecinos",
     "Verificado 01:47: sin cambios; ningún agente en marcha."),
    ("in_progress", "paper-soccer",
     "Verificado 01:47: sin cambios; cambio de icono en Playgama en curso "
     "pero sin actividad ~40 min (posible atasco)."),
    ("published", "scribble-striker",
     "Verificado 01:47: sin cambios; cambio de icono en Playgama en curso "
     "pero sin actividad ~40 min (posible atasco)."),
]:
    it = by_slug(lst, slug)
    if it:
        it["status"] = it.get("status", "") + " " + txt
        if slug.startswith("quitanieves"):
            it["paso"] = it.get("paso", "") + " " + txt

json.dump(d, open(p, "w"), ensure_ascii=False, indent=2)
print("OK updated_at", d["updated_at"])
