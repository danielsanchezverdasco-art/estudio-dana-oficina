// coach-marks.reference.js — the tutorial runtime: spotlight bubbles + the force-gate.
// Vanilla DOM, no dependencies. Distilled from Slapstick's FTUE. Pairs with coach-marks.reference.css.
//
// Two mechanisms:
//   Coach.spotlight(target, html, {place, key})  — a glow + bubble pointing at an element (meta screens).
//                                                   Re-target by `key` without flicker; auto-repositions.
//   Coach.forceTap(target, html, {place})        — dim everything, punch a bright hole around `target`,
//                                                   block all other input, resolve Promise<boolean>:
//                                                   true = the player really tapped; false = torn down.
//   Coach.coach(html) / Coach.coachClear()        — a lightweight in-loop tip banner (no targeting).
//
// `ROOT` is the positioned container everything is placed inside (e.g. your phone-frame #app, which is
// position:relative). All coordinates are relative to it.

const ROOT_ID = 'app';                         // <-- your positioned root element id
const root = () => document.getElementById(ROOT_ID);
const elc  = (cls, html) => { const d = document.createElement('div'); if (cls) d.className = cls; if (html != null) d.innerHTML = html; return d; };

export const Coach = {
  _spot: null, _spotReposition: null,
  _force: null, _forceReposition: null,
  _coach: null,

  // ---------- SPOTLIGHT: glow + bubble pointing at a target (non-blocking, meta screens) ----------
  // target null → auto-clears (the thing isn't rendered). Bubble is appended to ROOT so it floats over
  // cards/nav without being clipped. Pass a stable `key` so periodic re-renders re-target, not re-create.
  spotlight(target, html, opts = {}) {
    if (!target) { this.spotClear(); return; }
    const sp = this._spot;
    // Smooth RE-TARGET: same key + bubble still alive → just move the glow/copy/position. No rebuild
    // (rebuilding re-triggers the pop animation and flickers when a screen re-renders every second).
    if (opts.key && sp && sp.key === opts.key && sp.bub.isConnected) {
      if (sp.target !== target) { sp.target.classList.remove('coach-glow'); target.classList.add('coach-glow'); sp.target = target; }
      if (sp.html !== html) { const b = sp.bub.querySelector('.cb-body'); if (b) b.innerHTML = html; sp.html = html; }
      if (opts.place) sp.place = opts.place;
      this._positionSpot();
      return;
    }
    this.spotClear();
    target.classList.add('coach-glow');
    const bub = elc('coach-bubble', `<div class="cb-body">${html}</div><span class="cb-tail"></span>`);
    root().appendChild(bub);
    this._spot = { target, bub, place: opts.place || 'above', key: opts.key || null, html };
    this._positionSpot();
    if (!this._spotReposition) { this._spotReposition = () => this._positionSpot(); addEventListener('resize', this._spotReposition); }
  },
  // Clear the spotlight ONLY if this `key` owns it (so one tutorial doesn't wipe another's bubble).
  clearSpotIfKey(key) { if (this._spot && this._spot.key === key) this.spotClear(); },
  spotClear() {
    if (this._spot) { this._spot.target.classList.remove('coach-glow'); this._spot.bub.remove(); this._spot = null; }
    if (this._spotReposition) { removeEventListener('resize', this._spotReposition); this._spotReposition = null; }
  },
  _positionSpot() {
    const sp = this._spot; if (!sp || !sp.target.isConnected) { this.spotClear(); return; }
    const app = root().getBoundingClientRect();
    const r = sp.target.getBoundingClientRect();
    const bw = sp.bub.offsetWidth, bh = sp.bub.offsetHeight;
    let x = r.left - app.left + r.width / 2 - bw / 2;
    x = Math.max(8, Math.min(app.width - bw - 8, x));
    let above = sp.place !== 'below';
    let y = above ? r.top - app.top - bh - 12 : r.bottom - app.top + 12;
    // flip if it would go off the top/bottom edge
    if (above && y < 6) { y = r.bottom - app.top + 12; above = false; }
    else if (!above && y + bh > app.height - 6) { y = r.top - app.top - bh - 12; above = true; }
    sp.bub.style.left = x + 'px'; sp.bub.style.top = y + 'px';
    sp.bub.classList.toggle('below', !above);
    const tailX = (r.left - app.left + r.width / 2) - x;          // keep the tail pointing at the target center
    sp.bub.style.setProperty('--tail-x', Math.max(14, Math.min(bw - 14, tailX)) + 'px');
  },

  // ---------- FORCE-GATE: dim everything, one bright tappable hole, a pointing hand ----------
  // Returns Promise<boolean>: true = the player tapped the hole (= tapped target); false = the gate was
  // torn down without a tap (target disconnected / screen changed). The CALLER must run the action ONLY
  // on true — never on false — or a re-render will "auto-press" for the player.
  forceTap(target, html, opts = {}) {
    return new Promise((resolve) => {
      this.forceClear();
      if (!target || !target.isConnected) { resolve(false); return; }
      const app = root();
      const mask = elc('', ''); mask.id = 'force-mask';                 // transparent full-screen blocker
      const hole = elc('force-hole', '');                              // the bright cut-out (huge box-shadow dims around it)
      const place = opts.place || 'above';
      const hand = elc('force-hand' + (place === 'below' ? ' up' : ''), place === 'below' ? '☝️' : '👇');
      const bub = html ? elc('coach-bubble force-bubble', `<div class="cb-body">${html}</div><span class="cb-tail"></span>`) : null;
      app.appendChild(mask); app.appendChild(hole); app.appendChild(hand); if (bub) app.appendChild(bub);
      this._force = { target, mask, hole, hand, bub, place, resolve };
      this._positionForce();
      // Re-position a few beats + on resize: the target may slide in (animation) or layout may settle.
      [0, 80, 200, 420].forEach(ms => setTimeout(() => this._positionForce(), ms));
      this._forceReposition = () => this._positionForce(); addEventListener('resize', this._forceReposition);
      hole.addEventListener('click', () => {                           // real tap → teardown + resolve(true)
        const r = this._force && this._force.resolve;
        this._forceTeardown();
        if (r) r(true);
      });
    });
  },
  _forceTeardown() {
    const f = this._force;
    if (f) { [f.mask, f.hole, f.hand, f.bub].forEach(n => n && n.remove()); this._force = null; }
    if (this._forceReposition) { removeEventListener('resize', this._forceReposition); this._forceReposition = null; }
  },
  // Tear down WITHOUT a tap (screen change / re-render) → resolve(false) so the caller knows not to act.
  forceClear() { const f = this._force; this._forceTeardown(); if (f && f.resolve) f.resolve(false); },
  _positionForce() {
    const f = this._force; if (!f || !f.target.isConnected) return;
    const app = root().getBoundingClientRect();
    const r = f.target.getBoundingClientRect();
    const pad = 6;
    const left = r.left - app.left - pad, top = r.top - app.top - pad;
    const w = r.width + pad * 2, h = r.height + pad * 2;
    f.hole.style.left = left + 'px'; f.hole.style.top = top + 'px';
    f.hole.style.width = w + 'px';  f.hole.style.height = h + 'px';
    const cx = r.left - app.left + r.width / 2;
    f.hand.style.left = (cx - 18) + 'px';
    f.hand.style.top  = (f.place === 'below' ? top + h + 6 : top - 50) + 'px';
    if (f.bub) {
      const bw = f.bub.offsetWidth, bh = f.bub.offsetHeight;
      let bx = cx - bw / 2; bx = Math.max(8, Math.min(app.width - bw - 8, bx));
      let above = f.place !== 'below';
      let by = above ? top - bh - 52 : top + h + 52;
      if (above && by < 6) { by = top + h + 52; above = false; }
      else if (!above && by + bh > app.height - 6) { by = top - bh - 52; above = true; }
      f.bub.style.left = bx + 'px'; f.bub.style.top = by + 'px';
      f.bub.classList.toggle('below', !above);
      f.bub.style.setProperty('--tail-x', Math.max(14, Math.min(bw - 14, cx - bx)) + 'px');
    }
  },

  // ---------- in-loop tip banner (no targeting) ----------
  // A one-line coach strip inserted at the top of `zoneSelector` (your action area). Auto-replaces itself.
  coach(html, zoneSelector = '.combat-zone') {
    this.coachClear();
    const zone = document.querySelector(zoneSelector); if (!zone) return;
    const c = elc('coach-tip', `<div class="coach-body">${html}</div><span class="coach-arrow">▼</span>`);
    zone.insertBefore(c, zone.firstChild);
    this._coach = c;
  },
  coachClear() { if (this._coach) { this._coach.remove(); this._coach = null; } },
};

/* ---- usage sketch ----
// forced gate on home (only proceed on a real tap):
const ok = await Coach.forceTap(document.querySelector('.btn-play'), 'Tap PLAY to start!');
if (ok) startMatch();                       // never call startMatch() on a false

// persistent-state tutorial step (call from each screen render):
function runBoxTut() {
  if (Meta.s.ftue.boxTut !== 'go' || screen !== 'home') { Coach.clearSpotIfKey('boxtut'); return; }
  const cell = document.querySelector('.chest-slot[data-cidx="0"]');
  if (!cell) { Coach.clearSpotIfKey('boxtut'); return; }
  Coach.spotlight(cell, 'Your first chest! Tap to OPEN.', { place: 'above', key: 'boxtut' });
}
*/
