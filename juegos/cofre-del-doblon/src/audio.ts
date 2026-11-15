// Doubloon Rush — synthesized SFX (WebAudio, no audio files).
// All sounds are generated; the game ships zero audio assets.

export type SfxName =
  | 'tap'
  | 'coin'
  | 'gold'
  | 'doubloon'
  | 'bomb'
  | 'crab'
  | 'click'
  | 'win'
  | 'lose'
  | 'star'
  | 'pop'
  | 'squawk';

let ctx: AudioContext | null = null;
let muted = false;
let platformMuted = false;

export function setMuted(m: boolean): void {
  muted = m;
}

export function isMuted(): boolean {
  return muted;
}

export function setPlatformMuted(m: boolean): void {
  platformMuted = m;
}

function ac(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType,
  vol: number,
  when = 0,
  slideTo?: number,
): void {
  const c = ac();
  if (!c || muted || platformMuted) return;
  try {
    const t0 = c.currentTime + when;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  } catch {
    /* audio is best-effort */
  }
}

function noise(dur: number, vol: number, when = 0, lowpass = 1200): void {
  const c = ac();
  if (!c || muted || platformMuted) return;
  try {
    const t0 = c.currentTime + when;
    const len = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource();
    src.buffer = buf;
    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = lowpass;
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f).connect(g).connect(c.destination);
    src.start(t0);
  } catch {
    /* ignore */
  }
}

export function playSfx(name: SfxName): void {
  switch (name) {
    case 'tap':
      tone(620, 0.07, 'sine', 0.18, 0, 900);
      break;
    case 'coin':
      tone(988, 0.09, 'sine', 0.22);
      tone(1319, 0.14, 'sine', 0.2, 0.06);
      break;
    case 'gold':
      tone(784, 0.1, 'triangle', 0.22);
      tone(1047, 0.1, 'triangle', 0.22, 0.07);
      tone(1568, 0.2, 'sine', 0.2, 0.14);
      break;
    case 'doubloon':
      [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, 0.22, 'sine', 0.2, i * 0.07));
      tone(2093, 0.5, 'sine', 0.16, 0.45);
      break;
    case 'bomb':
      noise(0.45, 0.5, 0, 500);
      tone(110, 0.5, 'sine', 0.5, 0, 35);
      break;
    case 'crab':
      tone(300, 0.08, 'square', 0.1, 0, 180);
      tone(240, 0.08, 'square', 0.1, 0.09, 160);
      break;
    case 'click':
      tone(740, 0.05, 'sine', 0.15);
      break;
    case 'pop':
      tone(440, 0.08, 'sine', 0.16, 0, 880);
      break;
    case 'squawk':
      tone(1400, 0.09, 'sawtooth', 0.08, 0, 900);
      tone(1600, 0.07, 'sawtooth', 0.07, 0.1, 1100);
      break;
    case 'star':
      tone(1175, 0.12, 'sine', 0.2);
      tone(1568, 0.2, 'sine', 0.2, 0.1);
      break;
    case 'win':
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, 'triangle', 0.22, i * 0.11));
      tone(1319, 0.5, 'triangle', 0.2, 0.48);
      break;
    case 'lose':
      [392, 330, 262, 196].forEach((f, i) => tone(f, 0.28, 'triangle', 0.18, i * 0.16));
      break;
  }
}

/** Short vibration on supported devices (hit / fail feedback). */
export function vibrate(pattern: number | number[]): void {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}
