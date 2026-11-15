#!/usr/bin/env python3
"""Doubloon Rush — Short post-production (ffmpeg + numpy music).

Cuts the good segments from the raw recording (menu + gameplay + victory),
upscales to 1080x1920, burns in the hook + end card, mixes original synth
music, and extracts the 8-10 s GIF (ends on victory).
Inputs: tests/shorts/*.webm + phases.json (from record-short.py).
Outputs (in comunicacion-ias/entregas/cofre-del-doblon-round1/shorts/):
  - doubloon-rush-short.mp4 (1080x1920, 15-30 s, H.264 + music)
  - doubloon-rush-short.gif (390 px wide, 12 fps, 8-10 s, ends on victory)
Usage: python3 scripts/make-short.py
"""
import json
import os
import subprocess
import sys

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # juegos/cofre-del-doblon
REPO = os.path.dirname(os.path.dirname(ROOT))  # dana-cofre-repo
GAME = ROOT
SHORTS = os.path.join(GAME, "tests", "shorts")
OUT = os.path.join(REPO, "comunicacion-ias", "entregas", "cofre-del-doblon-round1", "shorts")
FONT = os.path.join(GAME, "public", "assets", "LilitaOne-Regular.ttf")
HOOK = "1 in 500... can YOU find the Golden Doubloon?"
HOOK2 = "Which chest do YOU open?"
TITLE = "DOUBLOON RUSH"


def sh(cmd):
    print("+", " ".join(cmd[:4]), "...")
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stdout[-1500:])
        print(r.stderr[-1500:])
        sys.exit(f"FAILED: {' '.join(cmd[:3])}")


def make_music(path, seconds, sr=44100):
    """Original cheerful arpeggio: C - G - Am - F, 132 BPM, sine+triangle."""
    chords = [
        [261.63, 329.63, 392.00],
        [196.00, 246.94, 293.66],
        [220.00, 261.63, 329.63],
        [174.61, 220.00, 261.63],
    ]
    beat = 60 / 132 / 2
    total = int(seconds * sr)
    audio = np.zeros(total)
    note_idx = 0
    while note_idx * beat < seconds:
        start = int(note_idx * beat * sr)
        chord = chords[(note_idx // 3) % 4]
        freq = chord[note_idx % 3] * (2 if note_idx % 6 == 3 else 1)
        dur = int(beat * 1.8 * sr)
        end = min(start + dur, total)
        n = end - start
        tt = np.arange(n) / sr
        env = np.minimum(1, tt * 40) * np.exp(-tt * 4)
        wave = np.sin(2 * np.pi * freq * tt) + 0.4 * np.sin(2 * np.pi * freq * 2 * tt)
        audio[start:end] += wave * env * 0.22
        note_idx += 1
    fade = int(0.5 * sr)
    audio[:fade] *= np.linspace(0, 1, fade)
    audio[-fade:] *= np.linspace(1, 0, fade)
    pcm = (np.clip(audio, -0.9, 0.9) * 32767).astype(np.int16)
    import wave
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())
    print(f"music: {path} ({seconds}s)")


def main():
    with open(os.path.join(SHORTS, "phases.json")) as f:
        meta = json.load(f)
    raw = os.path.join(SHORTS, meta["video"])
    ph = meta["phases"]
    os.makedirs(OUT, exist_ok=True)

    # Segments (video seconds): menu 2.5 s + gameplay + victory 4 s.
    menu_a, menu_b = max(0.0, ph["menu_ready"] - 0.5), ph["menu_ready"] + 2.0
    play_a, play_b = ph["play_start"], ph["play_end"]
    res_a, res_b = ph["results_start"], ph["video_end"]
    clips = [(menu_a, menu_b), (play_a, play_b), (res_a, res_b)]
    total = sum(b - a for a, b in clips)
    print("clips:", [(round(a, 1), round(b, 1)) for a, b in clips], f"total {total:.1f}s")
    if total < 15 or total > 30:
        print(f"WARNING: total {total:.1f}s is outside the 15-30 s target")

    tmpdir = os.path.join(SHORTS, "tmp")
    os.makedirs(tmpdir, exist_ok=True)
    parts = []
    for i, (a, b) in enumerate(clips):
        part = os.path.join(tmpdir, f"part{i}.mp4")
        sh(["ffmpeg", "-y", "-ss", str(a), "-to", str(b), "-i", raw,
            "-vf", "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
            "-an", part])
        parts.append(part)
    concat = os.path.join(tmpdir, "concat.txt")
    with open(concat, "w") as f:
        for p in parts:
            f.write(f"file '{p}'\n")
    joined = os.path.join(tmpdir, "joined.mp4")
    sh(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat,
        "-c", "copy", joined])
    music = os.path.join(OUT, "short-music.wav")
    make_music(music, seconds=int(total) + 1)

    mp4 = os.path.join(OUT, "doubloon-rush-short.mp4")
    # Hook text first 4 s; question 4-8 s; end card last 2.5 s.
    vf = (
        f"drawtext=fontfile={FONT}:text='{HOOK}':fontcolor=white:fontsize=54:"
        f"borderw=3:bordercolor=black:x=(w-text_w)/2:y=180:enable='lt(t,4)',"
        f"drawtext=fontfile={FONT}:text='{HOOK2}':fontcolor=0xFFD23E:fontsize=48:"
        f"borderw=3:bordercolor=black:x=(w-text_w)/2:y=260:enable='between(t,4,8)',"
        f"drawtext=fontfile={FONT}:text='{TITLE}':fontcolor=0xFFD23E:fontsize=96:"
        f"borderw=5:bordercolor=black:x=(w-text_w)/2:y=950:enable='gt(t,{total - 2.5})',"
        f"drawtext=fontfile={FONT}:text='Play free on Playgama':fontcolor=white:fontsize=44:"
        f"borderw=3:bordercolor=black:x=(w-text_w)/2:y=1070:enable='gt(t,{total - 2.5})',"
        f"format=yuv420p"
    )
    sh(["ffmpeg", "-y", "-i", joined, "-i", music,
        "-vf", vf, "-af", f"atrim=0:{total},asetpts=PTS-STARTPTS",
        "-c:v", "libx264", "-preset", "medium", "-crf", "22",
        "-c:a", "aac", "-b:a", "96k", "-shortest", "-movflags", "+faststart", mp4])

    # GIF: last 9 s of the joined Short (gameplay tail + victory), 390 px, 12 fps.
    gif = os.path.join(OUT, "doubloon-rush-short.gif")
    gif_start = max(0.0, total - 9.0)
    sh(["ffmpeg", "-y", "-ss", str(gif_start), "-t", "9", "-i", mp4,
        "-vf", "fps=12,scale=390:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse",
        gif])
    for f in (mp4, gif):
        print(f, os.path.getsize(f) // 1024, "KB")
    p = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", mp4], capture_output=True, text=True)
    print("short duration:", p.stdout.strip(), "s")


if __name__ == "__main__":
    main()
