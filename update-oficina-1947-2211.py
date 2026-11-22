#!/usr/bin/env python3
"""Oficina 19:47 22/11 — sin cambios en nada (12ª verificación seguida desde las 13:20).
ls-remote OK con flags del almacén. Ningún agente de Dana Games en marcha.
Sin mensaje nuevo de Daniel en el chat desde la entrega de las 19:17."""
import json

p = "oficina-data.json"
d = json.load(open(p))

d["updated_at"] = "2026-11-22 19:47"
d["updated_by"] = "Dani (cron 30 min)"
d["resumen"] = (
    "19:47 — Sin cambios desde las 13:20 (verificado en remoto con ls-remote + "
    "flags del almacén; 12ª verificación seguida sin cambios). Ningún agente "
    "de Dana Games en marcha. Sin mensaje nuevo de Daniel desde la entrega de "
    "las 19:17. Prueba de estrés REAL del Paper Soccer TERMINADA 18:42 y ya "
    "entregada: el juego NO peta en lo probado (8/8 arranques limpios en ~3,7 s, "
    "0 errores; 3/3 partidas sin errores y memoria plana; 1 ganada con YOU WIN!). "
    "Quitanieves A y B con mockup TERMINADO, esperando que Daniel apruebe "
    "(A 4a48fe2, B 9e489e4); la C 3D espera su decisión (arena acotada viable, "
    "mapa abierto no prometible). Desenfunda r7 en vivo, falta RONDA 8. Vecinos "
    "r3 en código (8e3a722), pendiente subir a Sandbox + re-playtest. Fútbol "
    "A/B/C terminadas en código, pendientes de verificación + subir. "
    "Monster/Sushi/Spot siguen pausados en fase 4. La difusión del Paper Soccer "
    "sigue BLOQUEADA (falta link final + cuenta de Reddit + login de Facebook). "
    "Faltan de Daniel: aprobar mockups A y B, decidir la C 3D, link final del "
    "Paper Soccer, cuenta de Reddit y arreglar el login de Facebook. Anita sin "
    "cambios."
)
d["factory"].append(
    "Verificado 19:47: sin cambios en nada (ls-remote OK con flags del almacén: "
    "Quitanieves A 4a48fe2, B 9e489e4; Monster-tavern e0d8a60, Monster-merge "
    "271ffaf, Sushi 92eae16, Spot 3838cbd; Desenfunda 68d4134, Vecinos-cero "
    "8e3a722, Fútbol 2f56e49, A/B/C b09c9a7/e9f6449/5aa2297, Tycoon f52a9dd; "
    "Anita Slice 4ea2167, Cyber 08abde42, barista-r7 1a23f6a, estampida-r13 "
    "dde1b80; Grid y Cofre sin rama en dana-games-juegos); 0 ficheros nuevos en "
    "ningún worktree desde las 19:17; ningún agente de Dana Games en marcha; "
    "sin mensaje nuevo de Daniel en el chat desde la entrega de las 19:17."
)

# --- Anita: sin cambios (ls-remote OK) ---
a = d.get("anita", {})
nota = (
    "Verificado 19:47: sin cambios (Slice 4ea2167, Cyber 08abde42, barista-r7 "
    "1a23f6a, estampida-r13 dde1b80; Grid y Cofre sin rama en dana-games-juegos; "
    "ls-remote OK con flags del almacén). Ningún agente de Anita en marcha."
)
a["paso"] = a.get("paso", "") + " " + nota
a["status"] = a.get("status", "") + " " + nota

json.dump(d, open(p, "w"), ensure_ascii=False, indent=2)
print("OK updated_at", d["updated_at"])
