#!/usr/bin/env python3
"""Oficina 05:47 23/11: build REAL de Grok en vivo extraído y ZIP plain rehecho."""
import json

PATH = "oficina-data.json"
d = json.load(open(PATH))

d["updated_at"] = "2026-11-23 05:47"
d["updated_by"] = "Dani (cron 30 min)"

d["factory"].append(
    "Verificado 05:47: NOVEDAD — build REAL de Grok en vivo extraído por curl y ZIP plain "
    "rehecho (paper-soccer-plain-live.zip, 133 ficheros, 5.397.242 B, md5 6304fb9b; verificado "
    "standalone 05:44: menú idéntico al en vivo, VS BOT funciona, guardado 300/20/0, "
    "0 peticiones a Playgama). NO sustituye aún a paper-soccer-plain.zip: pendiente comparar "
    "con el ZIP del panel de desarrollador. Nota 245 en el tablón (~05:25) pidiendo a Grok el "
    "código fuente; el código de Grok no está en ningún sitio (repo/tablón/issues/disco). "
    "Tarea de navegador del panel de Playgama en marcha desde ~05:19 pero sin actividad ~28 min "
    "(posible atasco/login). Sin cambios en repos (ls-remote OK con flags del almacén: "
    "Quitanieves A 4a48fe2, B 9e489e4, Desenfunda 68d4134, Vecinos 8e3a722, Slice 4ea2167, "
    "Cyber 08abde42, barista-r7 1a23f6a, estampida-r13 dde1b80, scribble-striker-r1 44c1cea). "
    "Difusión Paper Soccer sigue BLOQUEADA (login FB rechazado 20:24). Ningún subagente de "
    "Dana Games en marcha. Fuera de ventana: sin mensaje a Daniel."
)

d["resumen"] = (
    "05:47 — NOVEDAD: build REAL de Grok en vivo extraído por curl y ZIP plain rehecho "
    "(paper-soccer-plain-live.zip, 133 ficheros, 5,4 MB, verificado: menú idéntico al en vivo, "
    "VS BOT funciona, 0 peticiones a Playgama). Nota 245 en el tablón pidiendo a Grok el código "
    "fuente. La tarea del panel de Playgama sigue en marcha pero sin actividad ~28 min. "
    "Sin cambios en los repos (Quitanieves A 4a48fe2, B 9e489e4, Desenfunda 68d4134, "
    "Vecinos 8e3a722, Slice 4ea2167, Cyber 08abde42). Difusión sigue BLOQUEADA. "
    "Fuera de ventana (05:47): sin mensaje a Daniel."
)

for p in d["in_progress"]:
    if p.get("slug") == "paper-soccer":
        p["status"] = (
            "EN MARCHA — Build REAL de Grok en vivo EXTRAÍDO y ZIP plain rehecho "
            "(paper-soccer-plain-live.zip, 133 ficheros, 5.397.242 B, md5 6304fb9b, verificado "
            "standalone 05:44: menú idéntico al en vivo, VS BOT funciona, guardado 300/20/0, "
            "0 peticiones a Playgama). NO sustituye aún a paper-soccer-plain.zip: pendiente "
            "comparar con el ZIP del panel de desarrollador (tarea de navegador en marcha desde "
            "~05:19 pero sin actividad ~28 min, posible atasco/login). Nota 245 en el tablón "
            "(~05:25) pidiendo a Grok el código fuente; el código no está en ningún sitio. "
            "Paso actual: a la espera del ZIP del panel para comparar y sustituir. Queda "
            "~comparar ZIP panel vs live + sustituir plain + probar APK con icono nuevo + icono "
            "en Playgama + reintento Cloudflare + verificación foto contra foto + 3 apps en "
            "Playgama + elección de Daniel. " + p["status"]
        )
        p["paso"] = (
            "Build REAL en vivo extraído por curl y ZIP plain rehecho y verificado 05:44 "
            "(paper-soccer-plain-live.zip, 5.397.242 B, 133 ficheros); pendiente comparar con el "
            "ZIP del panel (tarea de navegador sin actividad ~28 min). Nota 245 al tablón "
            "pidiendo el código a Grok."
        )
        p["queda"] = (
            "~comparar ZIP del panel con el live + sustituir paper-soccer-plain.zip + probar APK "
            "con icono nuevo + icono en Playgama + reintento Cloudflare + verificación foto "
            "contra foto + 3 apps en Playgama + elección de Daniel"
        )
        break

verif = (
    " Verificado 05:47: sin cambios (Slice 4ea2167, Cyber 08abde42, barista-r7 1a23f6a, "
    "estampida-r13 dde1b80; Grid y Cofre sin rama en dana-games-juegos; ls-remote OK). "
    "Ningún agente de Anita en marcha."
)
d["anita"]["paso"] = d["anita"].get("paso", "") + verif
d["anita"]["status"] = d["anita"].get("status", "") + verif

json.dump(d, open(PATH, "w"), ensure_ascii=False, indent=2)
print("OK updated_at:", d["updated_at"])
print("factory entries:", len(d["factory"]))
