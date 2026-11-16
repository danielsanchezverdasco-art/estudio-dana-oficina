// Tiny WebAudio synth — no audio files, so the zip stays small.
// Buses: master -> sfx / ambient. Sliders map 0..1 to gain^2. Muted when the
// platform says audio is off, when an ad is open, or when the player toggles
// sound/music off. Everything is guarded: no audio = no crash.
import { Save } from './save';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfxBus: GainNode | null = null;
let ambientBus: GainNode | null = null;
let ambientNodes: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
let platformMuted = false;

function ensureCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
      master = ctx.createGain();
      master.connect(ctx.destination);
      sfxBus = ctx.createGain();
      sfxBus.connect(master);
      ambientBus = ctx.createGain();
      ambientBus.connect(master);
      applyVolumes();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function applyVolumes(): void {
  if (!ctx || !master || !sfxBus || !ambientBus) return;
  const sfxOn = Save.data.settings.sfx && !platformMuted;
  const musicOn = Save.data.settings.music && !platformMuted;
  master.gain.value = platformMuted ? 0 : 1;
  sfxBus.gain.value = sfxOn ? 0.9 : 0;
  ambientBus.gain.value = musicOn ? 0.05 : 0;
}

function noiseBuffer(c: AudioContext, seconds = 1): AudioBuffer {
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function tone(opts: {
  type: OscillatorType;
  from: number;
  to?: number;
  dur: number;
  vol: number;
  delay?: number;
  bus?: GainNode | null;
}): void {
  const c = ensureCtx();
  if (!c || !sfxBus) return;
  try {
    const t0 = c.currentTime + (opts.delay ?? 0);
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = opts.type;
    osc.frequency.setValueAtTime(opts.from, t0);
    if (opts.to !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.to), t0 + opts.dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(opts.vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + opts.dur);
    osc.connect(g);
    g.connect(opts.bus ?? sfxBus);
    osc.start(t0);
    osc.stop(t0 + opts.dur + 0.05);
  } catch {
    /* audio is best-effort */
  }
}

export const AudioEngine = {
  /** Call once from the first user gesture (pointerdown). */
  unlock(): void {
    ensureCtx();
    this.startAmbient();
  },

  setPlatformMuted(muted: boolean): void {
    platformMuted = muted;
    applyVolumes();
  },

  refreshSettings(): void {
    applyVolumes();
    if (Save.data.settings.music) this.startAmbient();
    else this.stopAmbient();
  },

  startAmbient(): void {
    const c = ensureCtx();
    if (!c || !ambientBus || ambientNodes) return;
    try {
      const src = c.createBufferSource();
      src.buffer = noiseBuffer(c, 2);
      src.loop = true;
      const filter = c.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 420;
      const g = c.createGain();
      g.gain.value = 1;
      src.connect(filter);
      filter.connect(g);
      g.connect(ambientBus);
      src.start();
      ambientNodes = { src, gain: g };
    } catch {
      /* ignore */
    }
  },

  stopAmbient(): void {
    try {
      ambientNodes?.src.stop();
    } catch {
      /* ignore */
    }
    ambientNodes = null;
  },

  click(): void {
    tone({ type: 'sine', from: 660, to: 520, dur: 0.07, vol: 0.25 });
  },

  pop(): void {
    tone({ type: 'sine', from: 300, to: 700, dur: 0.09, vol: 0.3 });
  },

  coin(): void {
    tone({ type: 'sine', from: 1318, dur: 0.09, vol: 0.28 });
    tone({ type: 'sine', from: 1760, dur: 0.16, vol: 0.28, delay: 0.08 });
  },

  win(): void {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone({ type: 'triangle', from: f, dur: 0.22, vol: 0.3, delay: i * 0.11 }),
    );
  },

  fail(): void {
    [392, 330, 262].forEach((f, i) =>
      tone({ type: 'triangle', from: f, dur: 0.25, vol: 0.28, delay: i * 0.14 }),
    );
  },

  chest(): void {
    [880, 1109, 1319, 1760].forEach((f, i) =>
      tone({ type: 'sine', from: f, dur: 0.18, vol: 0.25, delay: i * 0.07 }),
    );
  },

  /** Scanner sweeping: soft tick while the beam moves. */
  scanTick(): void {
    tone({ type: 'sine', from: 980, to: 1180, dur: 0.05, vol: 0.1 });
  },

  /** The beam just revealed the robot: bright rising chime. */
  reveal(): void {
    tone({ type: 'sine', from: 880, to: 1320, dur: 0.16, vol: 0.3 });
    tone({ type: 'sine', from: 1320, to: 1760, dur: 0.14, vol: 0.22, delay: 0.1 });
  },

  /** Robot caught: happy fanfare. */
  caught(): void {
    [659, 784, 1047, 1319].forEach((f, i) =>
      tone({ type: 'triangle', from: f, dur: 0.2, vol: 0.3, delay: i * 0.09 }),
    );
  },

  /** Tapped the robot before scanning: soft dodge wobble, no punishment. */
  dodge(): void {
    tone({ type: 'sine', from: 300, to: 180, dur: 0.16, vol: 0.22 });
  },

  /** Elastic ramp bounce: springy boing. */
  boing(): void {
    tone({ type: 'sine', from: 180, to: 520, dur: 0.16, vol: 0.35 });
    tone({ type: 'sine', from: 520, to: 240, dur: 0.14, vol: 0.2, delay: 0.1 });
  },
};
