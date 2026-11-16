#!/bin/bash
# Build driver v3: retries EACH STEP independently in a tight loop (2 s).
# The EPERM gate opens for seconds at a time and closes for minutes; a
# full-chain restart wastes every open moment, and a process whose writes
# fail never recovers — so each step runs as a fresh process, fails fast,
# and retries until it lands.
# LESSON (16/11 08:15): the bundle step must be a PIPE, not a file
# redirect. Driver v2 wrote the bundle JSON to bundle-prod.json first and
# NEVER got past that step in 30 min — the file write is the gated
# operation. The pipe form (bundle.mjs | write-bundle.mjs) worked in the
# 07:24 split-build test: pipe writes are not gated the way file writes
# are, and the writer retries its file writes internally for 20 s per
# attempt, catching any open moment in that window.
# Usage: build-driver.sh [max_seconds] (default 1800)
set -u
cd /home/hatch/workspace/dana-games/sushi-belt-frenzy
MAX=${1:-1800}
START=$(date +%s)
step() { # step <name> <command...>: retry until success or timeout
  local name="$1"; shift
  while true; do
    if [ $(( $(date +%s) - START )) -ge $MAX ]; then echo "DRIVER TIMEOUT at $name"; return 1; fi
    if "$@" >/dev/null 2>&1; then echo "OK $name"; return 0; fi
    sleep 2
  done
}
rm -rf dist dist-test
step bundle-write-prod sh -c 'node tools-local/bundle.mjs dist prod 2>/dev/null | node tools-local/write-bundle.mjs dist 20000' || exit 1
step copy-prod timeout 25 node tools-local/copy-public-retry.mjs public dist || exit 1
step bundle-write-test sh -c 'node tools-local/bundle.mjs dist-test test 2>/dev/null | node tools-local/write-bundle.mjs dist-test 20000' || exit 1
step copy-test timeout 25 node tools-local/copy-public-retry.mjs public dist-test || exit 1
step zip timeout 50 python3 tools-local/build-zip.py dist entregas/sushi-belt-frenzy-round1.zip || exit 1
# Verify.
JS_COUNT=$(ls dist/assets/index-*.js 2>/dev/null | wc -l)
JS_BYTES=$(stat -c %s dist/assets/index-*.js 2>/dev/null | head -1)
if [ -f dist/index.html ] && [ -f dist/playgama-bridge.js ] && [ "$JS_COUNT" = "1" ] && [ "${JS_BYTES:-0}" -gt 1000000 ] && python3 -c "import zipfile;z=zipfile.ZipFile('entregas/sushi-belt-frenzy-round1.zip');assert z.testzip() is None;assert 'index.html' in z.namelist()"; then
  echo "DRIVER OK"
  find dist dist-test -type f | sort
  du -sh dist dist-test
  ls -la entregas/sushi-belt-frenzy-round1.zip
  exit 0
fi
echo "DRIVER VERIFY FAILED"
exit 1
