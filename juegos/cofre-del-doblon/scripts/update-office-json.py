#!/usr/bin/env python3
"""Doubloon Rush — Paso D: actualizar los JSON de la oficina (ronda 1).

- ideas-acumuladas.json: cofre-del-doblon elegida=true + nota de la entrega.
- data.json: añadir el juego (estado desarrollo) + actividad + kpis + updatedAt.
- equipo-hoy.json: entrada en Programación + nota en Arte y Calidad.
Escritura atómica (temporal + os.replace) y verificación releyendo.
Uso: python3 scripts/update-office-json.py
"""
import json
import os

REPO = "/home/hatch/workspace/dana-cofre-repo"
NOW = "2026-11-15T13:08:00+01:00"
TODAY = "2026-11-15"


def atomic_write(path, data):
    tmp = path + ".tmp-cofre"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")
    os.replace(tmp, path)


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


# 1. ideas-acumuladas.json
p = os.path.join(REPO, "ideas-acumuladas.json")
d = load(p)
found = False
for idea in d.get("aptas", []):
    if idea.get("id") == "cofre-del-doblon":
        idea["elegida"] = True
        idea["nota"] = (
            "Ronda 1 entregada 15/11/2026 por Anita (rama anita/cofre-del-doblon, "
            "PR contra main): título EN propuesto «Doubloon Rush» (verificado libre "
            "en Playgama; decide Daniel). Zip + pack de marketing con Short en "
            "comunicacion-ias/entregas/cofre-del-doblon-round1/. Pendiente: revisión "
            "de Niky + APROBADO de Daniel."
        )
        found = True
assert found, "cofre-del-doblon no encontrado en ideas-acumuladas.json"
d["actualizadoEn"] = NOW
atomic_write(p, d)
print("ideas-acumuladas.json: elegida=true + nota")

# 2. data.json
p = os.path.join(REPO, "data.json")
d = load(p)
juegos = d.setdefault("juegos", [])
if not any(j.get("id") == "cofre-del-doblon" for j in juegos):
    juegos.append({
        "id": "cofre-del-doblon",
        "titulo": "Cofre del Doblón",
        "tituloEN": "Doubloon Rush",
        "estado": "desarrollo",
        "portada": "cover.cofre-del-doblon",
        "facturacion": None,
        "partidas": None,
        "vistas": None,
    })
    print("data.json: juego añadido (desarrollo)")
else:
    print("data.json: juego ya existía")
act = d.setdefault("actividad", [])
if not any(a.get("equipo") == "Cofre del Doblón" for a in act):
    act.append({
        "equipo": "Cofre del Doblón",
        "tarea": "Ronda 1 fabricada por Anita: juego completo (Phaser 3 + TS + Vite), zip de producción y pack de marketing con Short. Pendiente de revisión de Niky y del APROBADO de Daniel.",
        "estado": "en curso",
        "desde": None,
    })
    print("data.json: actividad añadida")
kpis = d.setdefault("kpis", {})
kpis["enDesarrollo"] = (kpis.get("enDesarrollo") or 0) + 1
if kpis.get("enCola"):
    kpis["enCola"] = max(0, kpis["enCola"] - 1)
d["updatedAt"] = NOW
atomic_write(p, d)
print(f"data.json: kpis enDesarrollo={kpis['enDesarrollo']}, enCola={kpis.get('enCola')}")

# 3. equipo-hoy.json
p = os.path.join(REPO, "equipo-hoy.json")
d = load(p)
prog = d["areas"]["programacion"]
prog["hoy"].append({
    "texto": "Cofre del Doblón (Doubloon Rush) ronda 1 entregada por Anita: juego completo + zip de producción + pack de marketing con Short. Pendiente de revisión de Niky y APROBADO de Daniel.",
    "fecha": TODAY,
})
prog["resumen"] = "Cofre del Doblón ronda 1 entregada; pendiente de revisión cruzada."
prog["fuente"] = "Anita 15/11/2026"
cal = d["areas"]["calidad"]
cal["hoy"].append({
    "texto": "Cofre del Doblón ronda 1 pendiente de revisión de Niky (CONTROL-CALIDAD) antes de subir a Playgama.",
    "fecha": TODAY,
})
atomic_write(p, d)
print("equipo-hoy.json: entradas en Programación y Arte y Calidad")

# Verificación releyendo
for path, check in [
    ("ideas-acumuladas.json", lambda d: [i for i in d["aptas"] if i["id"] == "cofre-del-doblon"][0]["elegida"] is True),
    ("data.json", lambda d: any(j.get("id") == "cofre-del-doblon" for j in d["juegos"])),
    ("equipo-hoy.json", lambda d: any("Cofre del Doblón" in h["texto"] for h in d["areas"]["programacion"]["hoy"])),
]:
    d = load(os.path.join(REPO, path))
    assert check(d), f"verificación fallida: {path}"
    print(f"verificado: {path}")
print("PASO D OK")
