#!/usr/bin/env python3
"""Subida de ficheros (texto y binarios) a una rama vía Git Data API, sin force push.
Adaptado de push_binary2.py para danielsanchezverdasco-art/estudio-dana-oficina.
El payload viaja por proceso (no argv) para eludir el límite de 128KB por argumento.
Uso: push_tc.py <branch> "<commit message>" <repo_path>=<local_file> ...
     Prefija un repo_path con "!" para BORRARLO del árbol (sin fichero local).
Devuelve el sha del commit creado.
"""
import base64, json, os, sys, urllib.request

sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request, read_json_response

REPO = "danielsanchezverdasco-art/estudio-dana-oficina"

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args): raise RuntimeError("redirect refused")

def api(method, path, data=None):
    proxy = os.environ.get("https_proxy") or os.environ.get("HTTPS_PROXY")
    opener = urllib.request.build_opener(
        urllib.request.ProxyHandler({"http": proxy, "https": proxy}), NoRedirect())
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request("https://api.github.com" + path, data=body, method=method)
    req.add_header("Accept", "application/vnd.github+json")
    if body:
        req.add_header("Content-Type", "application/json")
    add_surrogate_to_request(req, "custom.github", allowed_hosts=["api.github.com"])
    try:
        with opener.open(req, timeout=120) as resp:
            return json.loads(json.dumps(read_json_response(resp)))
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code}: {e.read().decode('utf-8','replace')[:500]}")

def main():
    if len(sys.argv) < 4:
        print(__doc__); sys.exit(1)
    branch, message = sys.argv[1], sys.argv[2]
    pairs = []
    for a in sys.argv[3:]:
        if "=" in a:
            pairs.append(a.split("=", 1))
        else:
            pairs.append([a, None])  # borrado: "!ruta" sin fichero local

    ref = api("GET", f"/repos/{REPO}/git/ref/heads/{branch}")
    head_sha = ref["object"]["sha"]
    print(f"head actual de {branch}: {head_sha[:8]}")

    blobs = {}
    deletes = []
    for repo_path, local in pairs:
        if repo_path.startswith("!"):
            deletes.append(repo_path[1:])
            print(f"delete {repo_path[1:]}")
            continue
        with open(local, "rb") as fh:
            raw = fh.read()
        b = api("POST", f"/repos/{REPO}/git/blobs",
                {"content": base64.b64encode(raw).decode("ascii"), "encoding": "base64"})
        blobs[repo_path] = b["sha"]
        print(f"blob {repo_path}: {b['sha'][:8]} ({len(raw)} bytes)")

    head_commit = api("GET", f"/repos/{REPO}/git/commits/{head_sha}")
    tree_entries = [{"path": p, "mode": "100644", "type": "blob", "sha": s}
                    for p, s in blobs.items()]
    tree_entries += [{"path": p, "mode": "100644", "type": "blob", "sha": None}
                     for p in deletes]
    tree = api("POST", f"/repos/{REPO}/git/trees", {
        "base_tree": head_commit["tree"]["sha"],
        "tree": tree_entries})
    print(f"tree: {tree['sha'][:8]}")

    commit = api("POST", f"/repos/{REPO}/git/commits", {
        "message": message, "tree": tree["sha"], "parents": [head_sha]})
    print(f"commit: {commit['sha']}")

    upd = api("PATCH", f"/repos/{REPO}/git/refs/heads/{branch}",
              {"sha": commit["sha"], "force": False})
    assert upd["object"]["sha"] == commit["sha"], "la ref no apunta al commit nuevo"
    print(f"ref actualizada OK: {upd['object']['sha'][:8]}")

if __name__ == "__main__":
    main()
