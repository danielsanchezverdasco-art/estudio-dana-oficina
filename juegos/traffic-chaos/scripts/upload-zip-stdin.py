#!/usr/bin/env python3
"""Upload a binary file to a branch via Git Data API, reading the bytes from
stdin (no disk, no argv payload). Companion to build-zip-memory.mjs.
Usage: <producer> | python3 upload-zip-stdin.py <branch> "<commit message>" <repo_path>
Reads proxy + credential like push_binary2.py (custom.github surrogate).
"""
import base64
import json
import sys
import urllib.request

sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request, read_json_response

REPO = "danielsanchezverdasco-art/estudio-dana-oficina"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        raise RuntimeError("redirect refused")


def api(method, path, data=None):
    proxy = __import__("os").environ.get("https_proxy") or __import__("os").environ.get("HTTPS_PROXY")
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
        raise RuntimeError(f"HTTP {e.code}: {e.read().decode('utf-8', 'replace')[:500]}")


def main():
    if len(sys.argv) != 4:
        print(__doc__)
        sys.exit(2)
    branch, message, repo_path = sys.argv[1], sys.argv[2], sys.argv[3]
    raw = sys.stdin.buffer.read()
    print(f"stdin bytes: {len(raw)}", file=sys.stderr)
    if len(raw) < 1000:
        print("ERROR: stdin too small, not a zip", file=sys.stderr)
        sys.exit(1)

    ref = api("GET", f"/repos/{REPO}/git/ref/heads/{branch}")
    head_sha = ref["object"]["sha"]
    print(f"head actual de {branch}: {head_sha[:8]}")

    blob = api("POST", f"/repos/{REPO}/git/blobs",
               {"content": base64.b64encode(raw).decode("ascii"), "encoding": "base64"})
    print(f"blob {repo_path}: {blob['sha'][:8]} ({len(raw)} bytes)")

    head_commit = api("GET", f"/repos/{REPO}/git/commits/{head_sha}")
    tree = api("POST", f"/repos/{REPO}/git/trees", {
        "base_tree": head_commit["tree"]["sha"],
        "tree": [{"path": repo_path, "mode": "100644", "type": "blob", "sha": blob["sha"]}]})
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
