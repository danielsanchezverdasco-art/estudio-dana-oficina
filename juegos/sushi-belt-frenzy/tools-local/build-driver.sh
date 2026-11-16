#!/bin/bash
# Build driver v2: retries EACH STEP independently in a tight loop (2 s).
# The EPERM gate opens for seconds at a time and closes for minutes; a
# full-chain restart wastes every open moment, and a process whose writes
# fail never recovers — so each step runs as a fresh process, fails fast,
# and retries until it lands. The bundle step needs the gate open only
# for its final ~0.5 s (the JSON print); the build itself only reads.
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
# The bundle JSON must be valid (3 files) — a crashed bundler leaves a
# partial file, so validate before moving on.
bundle_ok() {
  node -e "const f=require('node:fs');const j=JSON.parse(f.readFileSync('tools-local/bundle-$1.json','utf8'));if(!Array.isArray(j)||j.length!==3)process.exit(1)" "$1" 2>/dev/null
}
rm -rf dist dist-test
while ! (node tools-local/bundle.mjs dist prod > tools-local/bundle-prod.json 2>/dev/null && bundle_ok prod); do
  if [ $(( $(date +%s) - START )) -ge $MAX ]; then echo "DRIVER TIMEOUT bundle-prod"; exit 1; fi
  sleep 2
done
echo "OK bundle-prod"
step write-prod node tools-local/write-bundle.mjs dist 20000 < tools-local/bundle-prod.json || exit 1
step copy-prod timeout 25 node tools-local/copy-public-retry.mjs public dist || exit 1
while ! (node tools-local/bundle.mjs dist-test test > tools-local/bundle-test.json 2>/dev/null && bundle_ok test); do
  if [ $(( $(date +%s) - START )) -ge $MAX ]; then echo "DRIVER TIMEOUT bundle-test"; exit 1; fi
  sleep 2
done
echo "OK bundle-test"
step write-test node tools-local/write-bundle.mjs dist-test 20000 < tools-local/bundle-test.json || exit 1
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
