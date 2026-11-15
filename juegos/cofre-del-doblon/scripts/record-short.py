#!/usr/bin/env python3
"""Doubloon Rush — record the Short (real gameplay, 720x1280, upscaled later).

Plays level 1 for real (taps chests via __game bounds), then fast-forwards
to the victory results screen. Logs phase timestamps (video seconds) to
tests/shorts/phases.json so make-short.py can cut the good segments.
Usage: python3 scripts/record-short.py
Output: tests/shorts/*.webm + phases.json
"""
import json
import os
import subprocess
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist-test")
OUT = os.path.join(ROOT, "tests", "shorts")
PORT = 8909
W, H = 720, 1280

os.makedirs(OUT, exist_ok=True)
for old in os.listdir(OUT):
    if old.endswith(".webm"):
        os.remove(os.path.join(OUT, old))
server = subprocess.Popen(
    [sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"],
    cwd=DIST, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
try:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        ctx = browser.new_context(
            viewport={"width": W, "height": H},
            has_touch=True, locale="en-US", device_scale_factor=1,
            record_video_dir=OUT, record_video_size={"width": W, "height": H})
        page = ctx.new_page()
        page.on("pageerror", lambda e: print("PAGEERROR:", e))
        t_start = time.time()
        phases = {}

        def mark(name):
            phases[name] = round(time.time() - t_start, 1)

        page.goto(f"http://127.0.0.1:{PORT}/test.html", wait_until="networkidle")
        page.wait_for_function(
            "() => { const g = window.__game; return g && g.scene.scenes.some(s => s.scene.isActive() && s.scene.key === 'Menu'); }",
            timeout=20000)
        page.wait_for_timeout(2000)  # let the Bridge loading overlay fade
        mark("menu_ready")
        page.touchscreen.tap(W // 2, int(H * 0.86))  # PLAY
        page.wait_for_function(
            "() => { const g = window.__game; return g.scene.scenes.some(s => s.scene.isActive() && s.scene.key === 'Map'); }",
            timeout=10000)
        page.touchscreen.tap(int(W * 0.22), 130)  # level 1 node
        page.wait_for_function(
            "() => { const g = window.__game; return g.scene.scenes.some(s => s.scene.isActive() && s.scene.key === 'Game'); }",
            timeout=10000)
        page.wait_for_timeout(600)
        page.touchscreen.tap(W // 2, H // 2)  # TAP TO START
        page.wait_for_function(
            "() => window.__game.scene.getScene('Game').started === true", timeout=15000)
        mark("play_start")
        # Auto-player INSIDE the page (test build only): taps real up-chests
        # through the scene's own tap handler, on the page's event loop.
        # The footage is 100% real game state (scoring, effects, visuals);
        # real pointer taps were already verified separately by the smoke test.
        page.evaluate(
            "() => { window.__autoplay = setInterval(() => {"
            " const s = window.__game.scene.getScene('Game');"
            " if (!s || !s.started || s.over) return;"
            " for (const p of s.popups.values()) {"
            "   if (p.state === 'up' && p.container.scaleY > 0.9 &&"
            "       (p.kind === 'wood' || p.kind === 'silver' || p.kind === 'gold' || p.kind === 'doubloon')) {"
            "     s.onTapPopup(p); break; } }"
            "}, 280); }")
        # Play for real (~14 s wall time).
        t0 = time.time()
        taps = 0
        while time.time() - t0 < 14:
            page.wait_for_timeout(1000)
            taps = page.evaluate(
                "() => window.__game.scene.getScene('Game').score")
        page.evaluate("() => clearInterval(window.__autoplay)")
        mark("play_end")
        print(f"score after autoplay: {taps}")
        # Fast-forward to the victory screen.
        page.evaluate(
            "() => { const s = window.__game.scene.getScene('Game'); s.score = 1250; s.timeLeft = 1; }")
        page.wait_for_function(
            "() => { const g = window.__game; return g.scene.scenes.some(s => s.scene.isActive() && s.scene.key === 'Results'); }",
            timeout=90000)
        mark("results_start")
        page.wait_for_timeout(4000)  # stars animation
        mark("video_end")
        video_path = page.video.path()
        ctx.close()
        browser.close()
        print("raw video:", video_path)
        print("phases:", phases)
        with open(os.path.join(OUT, "phases.json"), "w") as f:
            json.dump({"video": os.path.basename(video_path), "phases": phases}, f, indent=1)
finally:
    server.terminate()
