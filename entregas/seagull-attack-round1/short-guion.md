# Seagull Attack — Short script (vertical, ~30 s, EN)
# Skills: youtube-shorts + hook-writer + virality (8-point checklist).
# The video is NOT recorded yet: film it from the production build once
# the round-1 tests pass (Playwright, video='on', 1080x1920), then cut the
# GIF from the same footage. Do NOT publish without Daniel's APROBADO and
# without Daniel testing the final version first. madeForKids=false.
# The Playgama link does not exist yet — the CTA promises it by DM only
# once the game is live; never publish a Short with a dead link.

WHO IT'S FOR: people who play draw-to-protect / draw puzzle games on
their phone and have ever had a gull steal their food.
BOXES: who = mobile puzzle players / pain = the gull steals your lunch /
more pain = every draw game is solved by one boring square / others get
wrong = they let you draw a square and call it a puzzle / why you =
limited ink + wind + waves from every side, a new line every level /
proof = real gameplay, level 1 and level 10 (pelican) / what you do =
draw the line that actually protects / feeling = the smug second the
gull bounces off / one action = comment SANDWICH for the link.

----------------------------------------------------------------
THREE HOOKS (frame 0 → 3 s, each checked against the 8 points)
----------------------------------------------------------------

HOOK A — "Your sandwich is GONE in 3 seconds"
  0.0s  Gull already diving at the sandwich on the towel, timer at 9.
  0.5s  VO: "Your sandwich—" / on-screen: YOUR SANDWICH
  1.2s  Gull snatches a crumb; on-screen word by word: GONE IN 3 SECONDS
  3.0s  Cut to the hand drawing the first line.
  CHECKLIST: 1 ✓ (gull moving) 2 ✓ (sandwich + gull) 3 ✓ (gull ~50%)
  4 ✓ (crumb stolen <3 s) 5 ✓ (claim 1.2 s) 6 ✓ ("Your…") 7 ✓ (text
  carries it) 8 ✓ (your sandwich). Weakness: generic "gone in 3 seconds"
  framing; every game Short uses a countdown.

HOOK B — "Stop drawing squares. The gulls worked it out." ★ PICKED
  0.0s  A square is already drawn around the sandwich; a gull dives.
  0.5s  VO: "Your square—" / on-screen: YOUR SQUARE
  1.2s  The gull flies AROUND the square and steals a crumb; on-screen
        word by word: SQUARES DON'T WORK
  3.0s  The square fades; the hand draws a curved line instead.
  CHECKLIST: 1 ✓ (gull diving, line present) 2 ✓ (sandwich + square +
  gull = the genre itself) 3 ✓ (sandwich + square ~60%) 4 ✓ (the
  square fails, crumb stolen <3 s) 5 ✓ (claim 1.2 s, big, high
  contrast) 6 ✓ ("Your…") 7 ✓ (text carries it) 8 ✓ (your square,
  your sandwich). Why it wins: contrarian + curiosity, and it names
  the exact complaint in Save The Dog's reviews ("TOO easy — just
  draw a square") while showing our fix in the same 3 seconds.

HOOK C — "I drew ONE line and saved my lunch"
  0.0s  Hand already drawing an arc over the sandwich.
  0.5s  VO: "One line—" / on-screen: ONE LINE
  1.2s  Gull hits the line and bounces off; on-screen word by word:
        LUNCH SAVED
  3.0s  Stars pop, +25 coins.
  CHECKLIST: 1 ✓ 2 ✓ 3 ✓ 4 ✓ (bounce <3 s) 5 ✓ 6 ✓ 7 ✓ 8 ✓.
  Weakness: a win in the first 3 seconds leaves nothing to prove;
  the square-fails version creates the question the body answers.

----------------------------------------------------------------
SCRIPT (picked hook B — every line has its visual)
----------------------------------------------------------------
 0-3s   HOOK B (above).
        On screen: square fails, gull steals a crumb, "SQUARES DON'T WORK".
 3-8s   VO: "In Seagull Attack, ink is limited — and the wind pushes
        your line." On screen: level 1, hand draws a curved line; the
        ink bar drains; a gull bounces off the curve.
 8-14s  VO: "Three gulls. Ten seconds. No square survives."
        On screen: three gulls dive from different sides; the line
        holds; timer runs 10 → 4; crumbs stay 3.
14-20s  VO: "Then the wind starts. Then the pelican."
        On screen: level 6, wind particles bend the line; level 10,
        the pelican dives, takes one hit, staggers.
20-26s  VO: "Thirty levels. A daily challenge. A chest every three."
        On screen: map scrolls, chest opens (+50), daily pill, stars pop.
26-30s  VO: "Comment SANDWICH and I'll send you the link."
        On screen: "SANDWICH SAVED!" card, +25 coins; end card with
        the title and "Comment SANDWICH".

CTA: Comment SANDWICH → DM delivers: the Playgama link, once the game
is live (after Daniel's approval + test). Do not send a link before
then; if asked early, reply "launching soon — I'll send it the moment
it's live".

CAPTION: Your sandwich is never safe on this beach. Every draw game
lets you hide behind one boring square — here the ink runs out, the
wind bends your line, and the gulls come from every side. Draw the
line. Save the sandwich. 30 levels, daily challenge, pelican boss.
Comment SANDWICH and I'll send you the Playgama link when it's live.

----------------------------------------------------------------
ES VERSION (same footage, ES voiceover + on-screen text)
----------------------------------------------------------------
Hook: "Deja de dibujar cuadrados. Las gaviotas ya lo saben."
Claim: "LOS CUADRADOS NO FUNCIONAN"
CTA: "Comenta BOCATA y te paso el enlace."
Caption: Tu bocata nunca está a salvo en esta playa. Dibuja la línea.
Salva el bocata.

Filming notes: vertical 1080x1920, 30 fps; record real gameplay from
the production build (dist/), no test build, no debug handle; capture
the audio (squawk/bounce/coin) — mute the ambient sea loop under the VO.
End the GIF cut on the victory card (the 8–10 s GIF must end in victory).
