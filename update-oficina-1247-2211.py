#!/usr/bin/env python3
"""Actualización oficina Dana Games — 22/11/2026 12:47 CET (cron 30 min).

Verificado antes de escribir (ls-remote OK con flags del almacén):
- Sin cambios desde las 12:17: Quitanieves 4ea0d9d, Vecinos 8e3a722,
  Tycoon f52a9dd, Desenfunda 68d4134, Fútbol A b09c9a7 / B e9f6449 / C 5aa2297,
  Monster e0d8a60, Sushi 92eae16 (rama niky/sushi-belt-2111),
  Spot 3838cbd, Slice 4ea2167, Cyber 08abde42, barista-r7 1a23f6a,
  estampida-r13 dde1b80, Scribble Striker 2f56e49.
  Grid y Cofre sin rama en dana-games-juegos.
- Ningún agente de Dana Games en marcha (los 4 "running" de subagent.list
  son zombis viejos de recurretumulta).
- Nada nuevo desde la fase 2 de Quitanieves (12:17): sigue esperando
  la elección de variante de Daniel.
"""
import json

PATH = "oficina-data.json"

with open(PATH, encoding="utf-8") as f:
    d = json.load(f)

d["updated_at"] = "2026-11-22 12:47"
d["resumen"] = (
    "12:47 — Sin cambios desde las 12:17 (verificado en remoto, ls-remote OK): "
    "ningún agente de Dana Games en marcha. QUITANIEVES: fase 2 terminada, "
    "3 variantes listas — A Clash Royale, B Tycoon 3D, C Cómic — esperando que "
    "Daniel elija una. DESENFUNDA r7 en vivo, falta RONDA 8. VECINOS r3 en "
    "código (8e3a722), pendiente subir a Sandbox + re-playtest. FÚTBOL A/B/C "
    "terminadas en código, pendientes de verificación + subir. Monster/Sushi/"
    "Spot siguen pausados en fase 4. La difusión del Paper Soccer sigue "
    "BLOQUEADA (login de Facebook rechazado 20:24; 0 grupos, 0 publicaciones). "
    "Faltan de Daniel: elegir variante de Quitanieves, link final del Paper "
    "Soccer, cuenta de Reddit y arreglar el login de Facebook. Anita sin cambios."
)


def find(sec, slug):
    for p in d[sec]:
        if isinstance(p, dict) and p.get("slug") == slug:
            return p
    raise KeyError(slug)


# --- Quitanieves (etiqueta LISTO PARA PROBAR se mantiene primera) ---
p = find("in_progress", "quitanieves-monstruo")
p["status"] = p["status"].replace(
    "LISTO PARA PROBAR — ",
    "LISTO PARA PROBAR — Verificado 12:47: sin cambios (sigue 4ea0d9d en "
    "remoto; esperando que Daniel elija variante; ningún agente en marcha). ",
    1,
)
p["paso"] = (
    "Verificado 12:47: sin cambios (sigue 4ea0d9d; esperando elección de "
    "Daniel; ningún agente en marcha). " + p["paso"]
)

# --- Desenfunda ---
p = find("in_progress", "desenfunda-y-dispara")
p["status"] = (
    "Verificado 12:47: sin cambios (sigue 68d4134 en vivo; ronda 8 pendiente "
    "de arrancar; ningún agente en marcha). " + p["status"]
)
p["paso"] = (
    "Verificado 12:47: sin cambios (r7 sigue 68d4134 en vivo; ronda 8 "
    "pendiente de arrancar; ningún agente en marcha). " + p["paso"]
)

# --- Vecinos ---
p = find("in_progress", "vecinos")
p["status"] = (
    "Verificado 12:47: sin cambios (r3 sigue 8e3a722 en código, sin subir; "
    "ningún agente en marcha). " + p["status"]
)
p["paso"] = (
    "Verificado 12:47: sin cambios (r3 sigue 8e3a722; pendiente subir a "
    "Sandbox + re-playtest). " + p["paso"]
)

# --- Paper Soccer (fútbol A/B/C) ---
p = find("in_progress", "paper-soccer")
p["status"] = (
    "Verificado 12:47: sin cambios en A/B/C (b09c9a7, e9f6449, 5aa2297; "
    "ls-remote OK); ningún agente en marcha. " + p["status"]
)
p["paso"] = (
    "Verificado 12:47: sin cambios (A/B/C b09c9a7, e9f6449, 5aa2297; "
    "ls-remote OK); pendientes verificación foto contra foto + apps Playgama "
    "+ playtests. " + p["paso"]
)

# --- Paper Soccer Tycoon 8x10 ---
p = find("in_progress", "paper-soccer-tycoon-8x10")
p["status"] = (
    "Verificado 12:47: sin cambios (sigue f52a9dd en vivo; rediseño pendiente "
    "de arrancar; ningún agente en marcha). " + p["status"]
)
p["paso"] = (
    "Verificado 12:47: sin cambios (sigue f52a9dd; rediseño pendiente; "
    "ningún agente en marcha). " + p["paso"]
)

# --- Difusión Paper Soccer (refrescar marca de verificación) ---
p = find("in_progress", "difusion-paper-soccer-grok")
p["status"] = p["status"].replace(
    "Verificado 11:17: sin cambios", "Verificado 12:47: sin cambios"
)
p["paso"] = p["paso"].replace(
    "Verificado 11:17: sin cambios", "Verificado 12:47: sin cambios"
)

# --- Scribble Striker (published) ---
p = find("published", "scribble-striker")
p["status"] = (
    "Verificado 12:47: sin cambios; sigue 2f56e49 LIVE en Sandbox, LISTO "
    "PARA PROBAR; ningún agente en marcha. " + p["status"]
)

# --- Anita ---
d["anita"]["paso"] = d["anita"]["paso"] + (
    " Verificado 12:47: verificación FRESCA (ls-remote OK con flags): sin "
    "cambios (Slice 4ea2167, Cyber 08abde42, barista-r7 1a23f6a, "
    "estampida-r13 dde1b80; Grid y Cofre sin rama en dana-games-juegos); "
    "ningún agente de Anita en marcha."
)

# --- Factory (log) ---
d["factory"].append(
    "Verificado 12:47: sin cambios en nada (ls-remote OK con flags del "
    "almacén: Quitanieves 4ea0d9d, Monster e0d8a60, Sushi 92eae16 "
    "(niky/sushi-belt-2111), Spot 3838cbd, Tycoon f52a9dd, Desenfunda 68d4134, "
    "Vecinos 8e3a722, Fútbol A/B/C sin cambios, Scribble Striker 2f56e49; "
    "Anita: Slice 4ea2167, Cyber 08abde42, barista-r7 1a23f6a, estampida-r13 "
    "dde1b80; Grid y Cofre sin rama). Difusión Paper Soccer sigue BLOQUEADA "
    "(login FB rechazado 20:24). Ningún agente de Dana Games en marcha."
)

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
    f.write("\n")

print("OK oficina-data.json actualizado 12:47")
