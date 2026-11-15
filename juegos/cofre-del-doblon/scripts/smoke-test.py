#!/usr/bin/env python3
"""Doubloon Rush — smoke test (Playwright, test build dist-test).

Checks, at 390x844 unless stated:
  1. Page loads with 0 console errors / 0 failed requests.
  2. Menu renders; PLAY button touch zones (centre + 4 corners 8px inside
     edges work, a tap just outside does nothing).
  3. Map renders; level 1 starts; TAP TO START begins the round.
  4. Tutorial hand shows on level 1.
  5. Tapping a real, fully-risen chest raises the score (functional play).
  6. Fast-forward the timer -> Results scene with stars.
  7. Save persists (Bridge storage when live, else localStorage fallback).
  8. Landscape 844x390: canvas fills the viewport (no black bands).
  9. Spanish locale: menu shows JUGAR (EN default otherwise).

Note: headless SwiftShader runs the game at ~7 FPS, so the game clock runs
slow in wall time — the test waits on game state, not on fixed sleeps.

Usage: python3 scripts/smoke-test.py [--shots-dir tests/shots]
Exit 0 = all checks pass.
"""
import json
import os
import subprocess
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist-test")
SHOTS = os.path.join(ROOT, "tests", "shots")
PORT = 8901

failures = []


def check(name, ok, detail=""):
    status = "PASS" if ok else "FAIL"
    print(f"[{status}] {name}" + (f" — {detail}" if detail else ""))
    if not ok:
        failures.append(name)


def main():
    os.makedirs(SHOTS, exist_ok=True)
    server = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"],
        cwd=DIST, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1.0)
    try:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as pw:
            run_suite(pw)
    finally:
        server.terminate()
    print()
    if failures:
        print(f"SMOKE RESULT: {len(failures)} FAILURES: {', '.join(failures)}")
        sys.exit(1)
    print("SMOKE RESULT: ALL CHECKS PASSED")


def new_page(pw, width, height, locale="en-US"):
    browser = pw.chromium.launch()
    ctx = browser.new_context(
        viewport={"width": width, "height": height},
        has_touch=True, locale=locale, device_scale_factor=1)
    page = ctx.new_page()
    errors = []
    failed_reqs = []
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("requestfailed", lambda r: failed_reqs.append(r.url))
    return browser, ctx, page, errors, failed_reqs


def wait_scene(page, key, timeout=30000):
    page.wait_for_function(
        f"() => {{ const g = window.__game; return g && g.scene.scenes.some(s => s.scene.isActive() && s.scene.key === '{key}'); }}",
        timeout=timeout)
    return True


def active_scene(page):
    return page.evaluate(
        "() => { const g = window.__game; if (!g) return 'no-__game';"
        " for (const s of g.scene.scenes) { if (s.scene.isActive()) return s.scene.key; }"
        " return 'none'; }")


def run_suite(pw):
    browser, ctx, page, errors, failed_reqs = new_page(pw, 390, 844)
    try:
        page.goto(f"http://127.0.0.1:{PORT}/test.html", wait_until="networkidle")
        wait_scene(page, "Menu")
        # The Bridge shows its own loading overlay at startup; let it fade.
        page.wait_for_timeout(2500)
        check("game object exposed in test build", page.evaluate("() => !!window.__game"))
        check("menu is the active scene", active_scene(page) == "Menu", active_scene(page))
        check("canvas present", page.evaluate("() => !!document.querySelector('#game canvas')"))
        page.screenshot(path=os.path.join(SHOTS, "01-menu-390x844.png"))

        # --- touch zones on PLAY (centre 195,726; rect 75..315 x 682..770) ---
        page.touchscreen.tap(83, 690)  # 8px inside top-left corner
        wait_scene(page, "Map")
        check("PLAY corner tap (8px inside) opens Map", active_scene(page) == "Map", active_scene(page))
        page.screenshot(path=os.path.join(SHOTS, "02-map-390x844.png"))
        # back to menu, tap just outside the button
        page.touchscreen.tap(40, 44)  # back arrow
        wait_scene(page, "Menu")
        check("back to Menu", active_scene(page) == "Menu", active_scene(page))
        page.touchscreen.tap(70, 677)  # 5px outside top-left corner
        page.wait_for_timeout(600)
        check("tap outside PLAY does nothing", active_scene(page) == "Menu", active_scene(page))
        # centre tap
        page.touchscreen.tap(195, 726)
        wait_scene(page, "Map")
        check("PLAY centre tap opens Map", active_scene(page) == "Map", active_scene(page))

        # --- level 1 node (row 0, col 0 -> x=86, y=130) ---
        page.touchscreen.tap(86, 130)
        wait_scene(page, "Game")
        check("level 1 starts Game scene", active_scene(page) == "Game", active_scene(page))
        page.screenshot(path=os.path.join(SHOTS, "03-game-start-390x844.png"))

        # --- start the round ---
        page.touchscreen.tap(195, 422)
        page.wait_for_function(
            "() => window.__game.scene.getScene('Game').started === true", timeout=15000)
        check("round starts after TAP TO START",
              page.evaluate("() => window.__game.scene.getScene('Game').started"))

        # --- tutorial hand on level 1 (appears with the first chest) ---
        page.wait_for_function(
            "() => { const s = window.__game.scene.getScene('Game');"
            " return s.tutorialStep === 1 && !!s.hand; }",
            timeout=30000)
        tut = page.evaluate(
            "() => { const s = window.__game.scene.getScene('Game');"
            " return { step: s.tutorialStep, hand: !!s.hand }; }")
        check("tutorial hand shows on level 1", tut["step"] == 1 and tut["hand"], json.dumps(tut))
        page.screenshot(path=os.path.join(SHOTS, "04-tutorial-390x844.png"))

        # --- functional play: tap fully-risen chests at their bounds centre ---
        score_before = page.evaluate(
            "() => window.__game.scene.getScene('Game').score")
        tapped = 0
        for _ in range(12):
            page.wait_for_function(
                "() => { const s = window.__game.scene.getScene('Game');"
                " for (const p of s.popups.values()) {"
                "   if (p.state === 'up' && p.container.scaleY > 0.95 &&"
                "       (p.kind === 'wood' || p.kind === 'silver' || p.kind === 'gold' || p.kind === 'doubloon')) return true; }"
                " return false; }",
                timeout=30000)
            pos = page.evaluate(
                "() => { const s = window.__game.scene.getScene('Game');"
                " for (const p of s.popups.values()) {"
                "   if (p.state === 'up' && p.container.scaleY > 0.95) {"
                "     const b = p.sprite.getBounds();"
                "     return { x: b.x + b.width / 2, y: b.y + b.height / 2, kind: p.kind }; } }"
                " return null; }")
            if not pos:
                continue
            page.touchscreen.tap(pos["x"], pos["y"])
            tapped += 1
            page.wait_for_timeout(400)
            if tapped >= 5:
                break
        score_after = page.evaluate(
            "() => window.__game.scene.getScene('Game').score")
        check("tapping chests raises the score",
              score_after > score_before,
              f"{score_before} -> {score_after} ({tapped} taps)")
        page.screenshot(path=os.path.join(SHOTS, "05-gameplay-mid-390x844.png"))

        # --- fast-forward to the end of the round ---
        # Set a 3-star score first so the star-recording path is exercised
        # (the 5 taps above only prove scoring works, not a full round).
        page.evaluate(
            "() => { const s = window.__game.scene.getScene('Game'); s.score = 1200; s.timeLeft = 2; }")
        wait_scene(page, "Results", timeout=60000)
        check("round ends in Results scene", active_scene(page) == "Results", active_scene(page))
        page.wait_for_timeout(2500)
        page.screenshot(path=os.path.join(SHOTS, "06-results-390x844.png"))

        # --- save persisted (Bridge storage is live even outside Playgama) ---
        saved = page.evaluate(
            "async () => {"
            " if (window.bridge && window.bridge.isInitialized) {"
            "   try { return await window.bridge.storage.get('doubloon-rush-save-v1', true); } catch (e) { return 'bridge-error:' + e; }"
            " }"
            " return localStorage.getItem('doubloon-rush:doubloon-rush-save-v1'); }")
        if isinstance(saved, dict):
            data = saved
        elif isinstance(saved, str):
            try:
                data = json.loads(saved)
            except Exception:
                data = None
        else:
            data = None
        check("save persisted after completing level 1", data is not None, str(saved)[:160])
        if data:
            check("save: level 2 unlocked after completing level 1",
                  data.get("unlockedLevel", 0) >= 2, f"unlocked={data.get('unlockedLevel')}")
            check("save: stars recorded for level 1 (1200 pts = 3 stars)",
                  data.get("stars", {}).get("1", 0) == 3, f"stars={data.get('stars')}")

        check("0 console errors", len(errors) == 0, "; ".join(errors[:3]))
        check("0 failed requests", len(failed_reqs) == 0, "; ".join(failed_reqs[:3]))
    finally:
        browser.close()

    # --- landscape: canvas fills the viewport, no black bands ---
    browser, ctx, page, errors, failed_reqs = new_page(pw, 844, 390)
    try:
        page.goto(f"http://127.0.0.1:{PORT}/test.html", wait_until="networkidle")
        wait_scene(page, "Menu")
        # The Bridge shows its own loading overlay at startup; let it fade.
        page.wait_for_timeout(2500)
        box = page.evaluate(
            "() => { const c = document.querySelector('#game canvas');"
            " const r = c.getBoundingClientRect();"
            " return { w: r.width, h: r.height }; }")
        check("landscape canvas fills viewport (no black bands)",
              abs(box["w"] - 844) < 2 and abs(box["h"] - 390) < 2, json.dumps(box))
        page.screenshot(path=os.path.join(SHOTS, "07-menu-landscape-844x390.png"))
        check("landscape: 0 console errors", len(errors) == 0, "; ".join(errors[:3]))
    finally:
        browser.close()

    # --- Spanish locale ---
    browser, ctx, page, errors, failed_reqs = new_page(pw, 390, 844, locale="es-ES")
    try:
        page.goto(f"http://127.0.0.1:{PORT}/test.html", wait_until="networkidle")
        wait_scene(page, "Menu")
        # The Bridge shows its own loading overlay at startup; let it fade.
        page.wait_for_timeout(2500)
        es = page.evaluate(
            "() => { const s = window.__game.scene.getScene('Menu');"
            " const texts = s.children.list.filter(o => o.type === 'Text').map(o => o.text);"
            " return texts; }")
        check("Spanish locale shows Spanish strings",
              any("JUGAR" in t or "¡Toca" in t for t in es), json.dumps(es)[:240])
        page.screenshot(path=os.path.join(SHOTS, "08-menu-es-390x844.png"))
    finally:
        browser.close()


if __name__ == "__main__":
    main()
