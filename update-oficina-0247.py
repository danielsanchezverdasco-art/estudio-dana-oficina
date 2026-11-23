import json

p = "oficina-data.json"
d = json.load(open(p))

d["updated_at"] = "2026-11-23 02:47"

d["resumen"] = (
    "02:47 — SIN CAMBIOS desde las 02:17: ningún commit nuevo en dana-games-juegos; "
    "ls-remote OK (Slice 4ea2167, Desenfunda 68d4134, Quitanieves A 4a48fe2 / B 9e489e4, Vecinos 8e3a722); "
    "ningún fichero nuevo en paper-soccer-ads/plain/distribution desde las 02:17. "
    "Las 2 tareas de navegador siguen en marcha pero cada vez más paradas: cambio de icono en Playgama "
    "sin actividad ~100 min y registro en webs sin actividad ~42 min (posible atasco). "
    "Quitanieves A y B con mockup TERMINADO, esperan aprobación de Daniel; la C 3D espera su decisión. "
    "Desenfunda r7 en vivo, falta ronda 8 (~1 h orientativo)."
)

verif = (" Verificado 02:47: sin cambios (Slice 4ea2167, Cyber 08abde42, barista-r7 1a23f6a, "
         "estampida-r13 dde1b80; Grid y Cofre sin rama en dana-games-juegos; ls-remote OK con flags del almacén). "
         "Ningún agente de Anita en marcha.")
d["anita"]["paso"] = d["anita"]["paso"] + verif

# Paper Soccer (in_progress): el cambio de icono lleva ~100 min sin actividad
for item in d.get("in_progress", []):
    if item.get("slug") == "paper-soccer":
        s = item.get("status", "")
        s = s.replace("sin actividad ~10 min", "sin actividad ~100 min (posible atasco)")
        s = s.replace("sin actividad ~70 min", "sin actividad ~100 min (posible atasco)")
        item["status"] = s
        print("paper-soccer in_progress actualizado")

for item in d.get("published", []):
    if item.get("slug") == "scribble-striker":
        s = item.get("status", "")
        if "sin actividad" in s:
            import re
            s = re.sub(r"sin actividad ~\d+ min", "sin actividad ~100 min (posible atasco)", s)
            item["status"] = s
            print("scribble-striker published actualizado")

json.dump(d, open(p, "w"), ensure_ascii=False, indent=2)
print("OK updated_at =", d["updated_at"])
