#!/usr/bin/env python3
"""Copy blobs from the Ramp Physics r2 branch into this branch by SHA —
no local file writes needed (the binaries live in the repo already, and
blobs are content-addressed, so referencing the SHA is exact).
Usage: copy_blobs.py <branch> "<commit message>"
The mapping is hardcoded below (r2 public/ -> robot public/).
"""
import json, os, sys, urllib.request

sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request, read_json_response

REPO = "danielsanchezverdasco-art/estudio-dana-oficina"

# (r2 blob sha, robot repo path) — verified from the r2 tree @ 1c935ce3.
BLOBS = [
    ("0fcd1f98812fa3b546543d4af95d4d8d2ebcd9a3", "juegos/quien-es-el-robot/public/assets/fonts/LilitaOne-400.woff2"),
    ("3e909a160091c0488e98f6668efc541114892859", "juegos/quien-es-el-robot/public/assets/fonts/Nunito-Variable.woff2"),
    ("cdcef0258acaa9901c8c90516fe7bf0ff247a843", "juegos/quien-es-el-robot/public/assets/img/badge.png"),
    ("22951872270bffdcb810fe399aeb6b43a1dcce92", "juegos/quien-es-el-robot/public/assets/img/hand.png"),
    ("f288702d2fa16d3cdf0035b15a9fcbc552cd88e7", "juegos/quien-es-el-robot/public/licenses/GPL-3.0.txt"),
    ("044e1bf5e5cd5e7cd89266cafc8644dd4d5e03e6", "juegos/quien-es-el-robot/public/licenses/LGPL-3.0.txt"),
    ("79d384208a02e1a06b143e3c0b94cf28865340a7", "juegos/quien-es-el-robot/public/licenses/Lilita-One-OFL.txt"),
    ("d230ceb98ddd1904a4fc29ec7d24c8292b9a0f0b", "juegos/quien-es-el-robot/public/licenses/Nunito-OFL.txt"),
    ("48792fed249c6ac1ef1b491f4b22dc8f30af7c12", "juegos/quien-es-el-robot/public/licenses/Phaser-MIT.txt"),
    ("501249302968ab50fe7e3667ab0af7d0ae007dee", "juegos/quien-es-el-robot/public/licenses/THIRD_PARTY_LICENSES.md"),
    ("54156eb79a8d0da5d7d46fdcba9c5cbed7c0cd0b", "juegos/quien-es-el-robot/public/playgama-bridge-config.json"),
]

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
    branch, message = sys.argv[1], sys.argv[2]
    # Verify each blob exists and record its size (exactness check).
    for sha, path in BLOBS:
        b = api("GET", f"/repos/{REPO}/git/blobs/{sha}")
        print(f"blob {path}: {sha[:8]} ({b['size']} bytes)")
        assert b["size"] > 0, f"empty blob {path}"
    ref = api("GET", f"/repos/{REPO}/git/ref/heads/{branch}")
    head_sha = ref["object"]["sha"]
    print(f"head actual de {branch}: {head_sha[:8]}")
    head_commit = api("GET", f"/repos/{REPO}/git/commits/{head_sha}")
    tree_entries = [{"path": p, "mode": "100644", "type": "blob", "sha": s} for s, p in BLOBS]
    tree = api("POST", f"/repos/{REPO}/git/trees", {
        "base_tree": head_commit["tree"]["sha"], "tree": tree_entries})
    print(f"tree: {tree['sha'][:8]}")
    commit = api("POST", f"/repos/{REPO}/git/commits", {
        "message": message, "tree": tree["sha"], "parents": [head_sha]})
    print(f"commit: {commit['sha']}")
    upd = api("PATCH", f"/repos/{REPO}/git/refs/heads/{branch}",
              {"sha": commit["sha"], "force": False})
    assert upd["object"]["sha"] == commit["sha"]
    print(f"ref actualizada OK: {upd['object']['sha'][:8]}")

if __name__ == "__main__":
    main()
