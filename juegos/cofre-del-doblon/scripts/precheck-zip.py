#!/usr/bin/env python3
"""Doubloon Rush — precheck del zip de producción (Paso C).

Checks (all must pass):
  1. index.html en la raíz del zip.
  2. Solo nombres latinos (sin espacios ni acentos) en las rutas.
  3. Tamaño del zip <= 5 MB (regla del estudio; Playgama permite 300 MB).
  4. playgama-bridge.js presente y Bridge >= 2.2.0.
  5. playgama-bridge-config.json presente.
  6. index.html carga el Bridge como PRIMER script de <head>, sin async.
  7. Sin window.__* ni __game en el bundle de producción.
  8. Sin peticiones externas en index.html (sin http:// ni https://).
  9. game_ready, storage y anuncios presentes en el código.
  10. Sin archivos de test ni sourcemaps en el zip.
Usage: python3 scripts/precheck-zip.py [zip]
Exit 0 = todo OK.
"""
import json
import os
import re
import sys
import zipfile

ZIP = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
    "/home/hatch/workspace/dana-cofre-repo",
    "comunicacion-ias", "entregas", "cofre-del-doblon-round1", "doubloon-rush-round1.zip")

fails = []


def check(name, ok, detail=""):
    print(f"[{'PASS' if ok else 'FAIL'}] {name}" + (f" — {detail}" if detail else ""))
    if not ok:
        fails.append(name)


def main():
    z = zipfile.ZipFile(ZIP)
    names = z.namelist()
    size = os.path.getsize(ZIP)
    check("zip <= 5 MB", size <= 5 * 1024 * 1024, f"{size/1024/1024:.2f} MB")
    check("index.html en la raíz", "index.html" in names)
    bad = [n for n in names if re.search(r"[^A-Za-z0-9._\-/]", n)]
    check("solo nombres latinos", not bad, str(bad))
    check("playgama-bridge.js presente", "playgama-bridge.js" in names)
    check("playgama-bridge-config.json presente", "playgama-bridge-config.json" in names)
    check("sin archivos de test", not any("test" in n.lower() for n in names), str([n for n in names if "test" in n.lower()]))
    check("sin sourcemaps", not any(n.endswith(".map") for n in names))

    html = z.read("index.html").decode("utf-8")
    head = html.split("</head>")[0]
    scripts = re.findall(r"<script[^>]*>", head)
    check("Bridge es el primer script de <head>",
          scripts and "playgama-bridge.js" in scripts[0], str(scripts))
    check("Bridge sin async", not re.search(r"<script[^>]*async[^>]*playgama-bridge", html))
    check("sin peticiones externas en index.html",
          "http://" not in html and "https://" not in html)

    bridge = z.read("playgama-bridge.js").decode("utf-8", errors="ignore")
    m = re.search(r'version\s*[:=]\s*"(\d+)\.(\d+)\.(\d+)"', bridge)
    check("Bridge >= 2.2.0",
          bool(m and (int(m.group(1)), int(m.group(2))) >= (2, 2)),
          f"versión hallada: {m.group(0)}" if m else "no hallada")

    js_files = [n for n in names if n.endswith(".js") and n != "playgama-bridge.js"]
    code = "".join(z.read(n).decode("utf-8", errors="ignore") for n in js_files)
    check("sin window.__* en producción", "window.__" not in code and "__game" not in code)
    check("game_ready presente", "game_ready" in code or "GAME_READY" in code)
    check("storage presente", "storage" in code)
    check("anuncios presentes", "showInterstitial" in code and "showRewarded" in code)
    check("sin localhost en el bundle", "localhost" not in code and "127.0.0.1" not in code)

    print()
    print(f"PRECHECK: {'TODO OK' if not fails else 'FALLOS: ' + ', '.join(fails)}")
    print(f"zip: {ZIP} ({size} bytes, {len(names)} ficheros)")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
