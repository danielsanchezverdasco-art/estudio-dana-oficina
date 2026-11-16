// Traffic Chaos — tutorial state machine (pure module, no Phaser).
// Ported from Niky's prototype (dana-games-juegos, branch niky/traffic-chaos-prototipo,
// src/rules/tutorial.ts), with ONE adaptation: the prototype's localStorage store is
// REMOVED — production stores tutorial completion in Bridge storage (see save.ts);
// the store is injected here as a plain interface, so the state machine stays pure.
// Teaches by doing, one step at a time, with the official hand pointing at the
// one thing to touch (tutorial-for-game: forced play-gate; onboarding-and-teaching:
// four-beat ramp — introduce, test, combine, twist — here introduce + test only,
// the twist is free play after the gate). Zero text: the hand + a pulsing target
// + icons are the whole instruction (demand report: no text in onboarding).
//
// Steps: mission (2.5 s beat: the mission chip pulses, the hand points at it)
//   -> light (tap a traffic light: the pair swaps, one opens, one closes)
//   -> swipe (swipe a car up to boost it)
//   -> boost (tap BOOST for 2x on everything) -> done (never shown again).
// Any step can be skipped (SKIP button) and completion is persisted.

export type TutorialStep = 'mission' | 'light' | 'swipe' | 'boost' | 'done';

export const TUTORIAL_KEY = 'tc-tutorial-done';
export const MISSION_MS = 2500;

export interface TutorialStore {
  get(): boolean;
  set(done: boolean): void;
}

export class Tutorial {
  step: TutorialStep = 'done';
  private missionSince = 0;
  private readonly store: TutorialStore;

  constructor(store: TutorialStore) {
    this.store = store;
  }

  /** Start the tutorial for a level. Returns the step to show ('done' = skip). */
  start(nowMs: number): TutorialStep {
    if (this.store.get()) {
      this.step = 'done';
    } else {
      this.step = 'mission';
      this.missionSince = nowMs;
    }
    return this.step;
  }

  /** Advance the mission beat once its time is up. Call every frame. */
  tick(nowMs: number): TutorialStep {
    if (this.step === 'mission' && nowMs - this.missionSince >= MISSION_MS) {
      this.step = 'light';
    }
    return this.step;
  }

  /** A light was tapped. In 'mission' it only ends the beat; in 'light' it completes the step. */
  onLightTapped(): TutorialStep {
    if (this.step === 'mission') this.step = 'light';
    else if (this.step === 'light') this.step = 'swipe';
    return this.step;
  }

  /** A car was swipe-boosted. */
  onCarBoosted(): TutorialStep {
    if (this.step === 'swipe') this.step = 'boost';
    return this.step;
  }

  /** BOOST was tapped. Completes the tutorial. */
  onBoostAll(): TutorialStep {
    if (this.step === 'boost') this.finish();
    return this.step;
  }

  /** SKIP was tapped. Completes the tutorial without playing the steps. */
  onSkip(): TutorialStep {
    this.finish();
    return this.step;
  }

  get done(): boolean {
    return this.step === 'done';
  }

  private finish(): void {
    this.step = 'done';
    this.store.set(true);
  }
}
