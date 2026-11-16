#!/usr/bin/env python3
"""Zip a built dist/ dir into a Playgama zip (index.html at the root).
Verifies the result (valid zip, index.html present, size <= 5 MB) and
retries the write up to 3 times — the sandbox EPERM wave can truncate
a file mid-write, so a zip is only trusted after it verifies.
Usage: build-zip.py <distDir> <outZip>
Prints: ZIP_OK <bytes> <sha256>  (or fails loudly).
"""
import hashlib
import os
import sys
import zipfile

MAX_BYTES = 5 * 1024 * 1024


def build(dist_dir, out_zip):
    with zipfile.ZipFile(out_zip, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for root, _dirs, files in os.walk(dist_dir):
            for name in sorted(files):
                full = os.path.join(root, name)
                arc = os.path.relpath(full, dist_dir)
                zf.write(full, arc)


def verify(out_zip):
    if not os.path.exists(out_zip):
        return "missing file"
    size = os.path.getsize(out_zip)
    if size > MAX_BYTES:
        return f"too big: {size} bytes > {MAX_BYTES}"
    if size == 0:
        return "empty file"
    try:
        with zipfile.ZipFile(out_zip) as zf:
            names = zf.namelist()
            bad = zf.testzip()
            if bad:
                return f"corrupt entry: {bad}"
            if "index.html" not in names:
                return "index.html missing from zip"
    except zipfile.BadZipFile as e:
        return f"bad zip: {e}"
    return None


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(2)
    dist_dir, out_zip = sys.argv[1], sys.argv[2]
    err = None
    for attempt in range(1, 4):
        build(dist_dir, out_zip)
        err = verify(out_zip)
        if err is None:
            break
        print(f"attempt {attempt} failed: {err} — retrying", file=sys.stderr)
    if err is not None:
        print(f"ZIP_FAIL: {err}", file=sys.stderr)
        sys.exit(1)
    size = os.path.getsize(out_zip)
    sha = hashlib.sha256(open(out_zip, "rb").read()).hexdigest()
    print(f"ZIP_OK {size} {sha}")


if __name__ == "__main__":
    main()
