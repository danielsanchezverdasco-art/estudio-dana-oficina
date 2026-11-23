#!/usr/bin/env python3
"""Oficina 01:17 23/11 — CAMBIOS: pack actualizado con las 4 decisiones de Daniel
(01:12, Grok como la IA); build plain RETITULADO a Paper Soccer; APK rehecho con
el icono oficial grande; piezas publicitarias clickbait listas; app instalable
TERMINADA (corrección: a las 00:47 se dio por "en curso"). itch.io APARCADO por
orden de Daniel. Verificado con subagent.list + ls-remote con flags del almacén
+ mtimes de los entregables. Fuera de ventana (01:17): sin mensaje al chat."""
import json

p = "oficina-data.json"
d = json.load(open(p))

d["updated_at"] = "2026-11-23 01:17"
d["updated_by"] = "Dani (cron 30 min)"
d["resumen"] = (
    "01:17 — CAMBIOS (01:12–01:16): pack de distribución actualizado con las 4 "
    "decisiones de Daniel (la IA del juego es GROK); build plain RETITULADO a "
    "Paper Soccer (zip 1.064.243 B, 45 ficheros); APK rehecho con el icono "
    "oficial grande y verificado; piezas publicitarias clickbait listas "
    "(banner, post, historia); app instalable TERMINADA (APK debug + PWA + "
    "Capacitor, REPORT.md) — a las 00:47 se dio por «en curso» por error. "
    "itch.io APARCADO por orden de Daniel (no se publica nada); el login quedó "
    "bloqueado por captcha/Turnstile. EN MARCHA: cambio de icono en Playgama "
    "(tarea de navegador, sin actividad ~10 min, posible atasco en el login) y "
    "registro en webs (sin actividad ~46 min, atascado). Sin cambios en repos "
    "(verificado por ls-remote). Quitanieves A y B con mockup TERMINADO, "
    "esperan aprobación de Daniel (A 4a48fe2, B 9e489e4); la C 3D espera su "
    "decisión. Desenfunda r7 en vivo, falta ronda 8 (~1 h orientativo). "
    "Vecinos r3 en código, pendiente subir a Sandbox. Fútbol A/B/C terminados "
    "en código, pendientes de verificación foto contra foto + subir. Pendiente "
    "de Daniel: aprobar mockups Quitanieves A y B, decidir la C 3D, probar el "
    "APK con el icono nuevo, cuenta de Reddit y arreglar el login de Facebook "
    "(difusión BLOQUEADA). Fuera de ventana (01:17): sin mensaje al chat."
)
d["factory"].append(
    "Verificado 01:17: CAMBIOS — pack distribución actualizado con las 4 "
    "decisiones de Daniel 01:12 (Grok como la IA del juego; agente cb421338). "
    "Build plain RETITULADO a Paper Soccer (zip 1.064.243 B, 45 ficheros, md5 "
    "4906e94d; agente 9dd206b4; RETITLED-20261123.md). APK rehecho con el icono "
    "oficial grande y verificado (agente 5df6984e; paper-soccer-debug.apk "
    "reconstruido 01:16). Piezas publicitarias clickbait listas (banner "
    "1200x628, post 1080x1080, historia 1080x1920; agente 1125a9c5). App "
    "instalable TERMINADA (APK debug + PWA + Capacitor + REPORT.md en "
    "paper-soccer-app/; corrección: a las 00:47 se dio por «en curso»). "
    "itch.io APARCADO por orden de Daniel (agente 6a5eec15: no se publicó nada; "
    "login bloqueado por captcha/Turnstile 23:41; la tarea de navegador "
    "91f3cf37 sigue en marcha tras el control del usuario). EN MARCHA: cambio "
    "de icono en Playgama (tarea 4e9edbcc, sin actividad ~10 min) y registro "
    "en webs (tarea ecc8eea9, sin actividad ~46 min). Sin cambios en repos: "
    "scribble-striker-r1 44c1cea, Quitanieves A 4a48fe2 / B 9e489e4, Slice "
    "4ea2167, Cyber 08abde42, barista-r7 1a23f6a, estampida-r13 dde1b80, "
    "desenfunda 68d4134 (ls-remote OK con flags del almacén). Ningún agente de "
    "Anita, Quitanieves, Desenfunda ni Vecinos en marcha. Fuera de ventana "
    "(01:17): sin mensaje al chat."
)


def by_slug(lst, slug):
    for it in d.get(lst, []):
        if isinstance(it, dict) and it.get("slug") == slug:
            return it
    return None


# --- Anita: sin cambios (ls-remote OK) ---
a = d.get("anita", {})
nota = (
    "Verificado 01:17: sin cambios (Slice 4ea2167, Cyber 08abde42, barista-r7 "
    "1a23f6a, estampida-r13 dde1b80; Grid y Cofre sin rama en dana-games-juegos; "
    "ls-remote OK con flags del almacén). Ningún agente de Anita en marcha."
)
a["paso"] = a.get("paso", "") + " " + nota
a["status"] = a.get("status", "") + " " + nota

# --- Scribble Striker (published): pack + retitulado + APK icono + app terminada ---
s = by_slug("published", "scribble-striker")
if s:
    lead = (
        "LISTO PARA PROBAR — Pack actualizado 01:12 con las 4 decisiones de "
        "Daniel (la IA es GROK); build plain RETITULADO a Paper Soccer (zip "
        "1.064.243 B); APK rehecho con el icono oficial grande y verificado; "
        "app instalable TERMINADA (APK debug + PWA + Capacitor). itch.io "
        "APARCADO por orden de Daniel (login bloqueado por captcha). Ahora "
        "mismo: cambio de icono en Playgama en curso (tarea de navegador, sin "
        "actividad ~10 min). Queda ~probar el APK con el icono nuevo + cambio "
        "de icono en Playgama + reintento del deploy en Cloudflare (HTTP 500) "
        "+ playtest en vivo del build exacto. "
    )
    s["status"] = lead + s.get("status", "")
    s["paso"] = (
        "Publicado en Sandbox 16/11 (2f56e49); LISTO PARA PROBAR. Pack "
        "actualizado 01:12 (Grok); build retitulado 01:13–01:16; APK con icono "
        "nuevo rehecho 01:16; app instalable terminada; itch.io aparcado "
        "(login bloqueado por captcha). Cambio de icono en Playgama en curso "
        "(tarea navegador, sin actividad ~10 min)."
    )
    s["queda"] = (
        "~probar el APK con el icono nuevo + cambio de icono en Playgama + "
        "reintento del deploy en Cloudflare + playtest en vivo del build exacto"
    )

# --- Paper Soccer (in_progress): mismo cambio ---
ps = by_slug("in_progress", "paper-soccer")
if ps:
    lead = (
        "LISTO PARA PROBAR — Pack actualizado 01:12 (Grok); build RETITULADO a "
        "Paper Soccer; APK con icono oficial grande rehecho y verificado; app "
        "instalable TERMINADA; itch.io APARCADO (login bloqueado por captcha). "
        "Paso actual: cambio de icono en Playgama en curso (sin actividad "
        "~10 min). Queda ~probar el APK + icono en Playgama + reintento "
        "Cloudflare + verificación foto contra foto + 3 apps en Playgama + "
        "elección de Daniel. Verificado 01:17: sin cambios en A/B/C (b09c9a7, "
        "e9f6449, C 5aa2297). "
    )
    ps["status"] = lead + ps.get("status", "")
    ps["paso"] = (
        "Pack actualizado 01:12 (Grok); build retitulado 01:13–01:16; APK con "
        "icono nuevo rehecho 01:16; app instalable terminada; itch.io aparcado. "
        "Cambio de icono en Playgama en curso (sin actividad ~10 min). 3 "
        "versiones en código; pendientes verificación foto contra foto + 3 "
        "apps en Playgama + playtests + elección de Daniel."
    )
    ps["queda"] = (
        "~probar el APK con el icono nuevo + icono en Playgama + reintento "
        "Cloudflare + playtest en vivo + verificación foto contra foto + 3 "
        "apps en Playgama + elección de Daniel"
    )

# --- Sin cambios: difusión, Quitanieves A/B, Desenfunda, Vecinos ---
for lst, slug, txt in [
    ("in_progress", "difusion-paper-soccer-grok",
     "Verificado 01:17: sin cambios; ningún agente en marcha."),
    ("in_progress", "quitanieves-monstruo",
     "Verificado 01:17: sin cambios (sigue 4a48fe2 en remoto; sin agente en marcha)."),
    ("in_progress", "quitanieves-tycoon",
     "Verificado 01:17: sin cambios (sigue 9e489e4 en remoto; sin agente en marcha)."),
    ("in_progress", "desenfunda-y-dispara",
     "Verificado 01:17: sin cambios (sigue 68d4134 en remoto; ningún agente en marcha)."),
    ("in_progress", "vecinos",
     "Verificado 01:17: sin cambios; ningún agente en marcha."),
]:
    it = by_slug(lst, slug)
    if it:
        it["status"] = it.get("status", "") + " " + txt
        if slug.startswith("quitanieves"):
            it["paso"] = it.get("paso", "") + " " + txt

json.dump(d, open(p, "w"), ensure_ascii=False, indent=2)
print("OK updated_at", d["updated_at"])
