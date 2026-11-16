// vehicle.ts — the delivery scooter: one Matter rectangle body + a comic
// visual that follows it. The scooter drives itself once PLAY is pressed:
// a constant drive force while grounded, capped speed, so the player only
// ever worries about the bridge — one verb, one finger.
//
// Physics (Matter, 60 Hz steps; numbers derived from the engine, to be
// MEASURED by the browser harness — see plan-dificultad):
//   gravity adds ~0.278 px/step^2 per step (g = 0.001 scale x dt^2 278).
//   drive accel = DRIVE x 278 px/step^2. WOOD 0.0011 -> 0.306 px/step^2,
//   which beats the along-slope gravity component up to sin(theta) ~ 1.0
//   in theory; friction + bumps cap the practical climb at ~25 deg, the
//   bound the level validator enforces. TURBO 0.0024 -> 0.667 px/step^2,
//   practical climb ~40 deg. BOUNCY bridges have restitution 0.9.
//   maxSpeed caps the cruise so a 390 px level takes ~1.5 s to cross.
import Phaser from 'phaser';

export const SCOOTER = {
  w: 58,
  h: 16,
  chamfer: 6,
  friction: 0.6,
  frictionAir: 0.012,
  density: 0.0012,
  restitution: 0,
  driveWood: 0.0011,
  driveTurbo: 0.0024,
  maxSpeedWood: 4.6,
  maxSpeedTurbo: 6.5,
  /** Uphill slope (deg) a WOOD bridge may ask of the scooter. */
  maxClimbWoodDeg: 25,
  /** Uphill slope (deg) a TURBO bridge may ask of the scooter. */
  maxClimbTurboDeg: 40,
  /** Wheels spin with distance travelled (rad per px). */
  wheelSpin: 1 / 11,
} as const;

export interface Scooter {
  body: MatterJS.BodyType;
  view: Phaser.GameObjects.Container;
  wheelL: Phaser.GameObjects.Graphics;
  wheelR: Phaser.GameObjects.Graphics;
  lastX: number;
  /** ms of the last contact with anything drivable (bridge/platform). */
  lastGroundedMs: number;
  /** true while touching a TURBO bridge segment. */
  onTurbo: boolean;
  /** ms until which the scooter waits before driving (dual delivery). */
  driveDelayMs: number;
  startedAtMs: number;
  /** px travelled (for the stuck detector). */
  maxX: number;
}

/** Draw the scooter + rider into a container centred on the body. */
export function buildScooterView(
  scene: Phaser.Scene,
  bodyTint: number,
  riderTint: number,
): { view: Phaser.GameObjects.Container; wheelL: Phaser.GameObjects.Graphics; wheelR: Phaser.GameObjects.Graphics } {
  const view = scene.add.container(0, 0);
  const g = scene.add.graphics();

  // Shadow (drawn under the scooter, follows the body).
  g.fillStyle(0x000000, 0.18);
  g.fillEllipse(0, 14, 62, 10);

  // Deck + stem (scooter body).
  g.fillStyle(bodyTint, 1);
  g.fillRoundedRect(-30, -4, 60, 10, 5);
  g.lineStyle(3, 0x141414, 1);
  g.strokeRoundedRect(-30, -4, 60, 10, 5);
  // Stem up to the handlebar.
  g.fillStyle(bodyTint, 1);
  g.fillRoundedRect(20, -30, 7, 30, 3);
  g.strokeRoundedRect(20, -30, 7, 30, 3);
  // Handlebar.
  g.lineStyle(5, 0x141414, 1);
  g.lineBetween(14, -30, 32, -30);
  // Headlight.
  g.fillStyle(0xfff2b8, 1);
  g.fillCircle(31, 1, 4);
  g.lineStyle(2, 0x141414, 1);
  g.strokeCircle(31, 1, 4);

  // Pizza box on the back rack.
  g.fillStyle(0xffffff, 1);
  g.fillRoundedRect(-34, -16, 22, 12, 3);
  g.strokeRoundedRect(-34, -16, 22, 12, 3);
  g.fillStyle(0xff6b5e, 1);
  g.fillCircle(-23, -10, 4);

  // Rider: leg, body, helmet.
  g.fillStyle(0x2e4057, 1);
  g.fillRoundedRect(-12, -22, 9, 20, 4); // leg
  g.fillStyle(riderTint, 1);
  g.fillRoundedRect(-16, -38, 22, 20, 8); // torso
  g.lineStyle(3, 0x141414, 1);
  g.strokeRoundedRect(-16, -38, 22, 20, 8);
  // Arm to the handlebar.
  g.lineStyle(5, riderTint, 1);
  g.lineBetween(-2, -34, 22, -30);
  // Helmet.
  g.fillStyle(0xff6b5e, 1);
  g.fillCircle(-4, -46, 11);
  g.lineStyle(3, 0x141414, 1);
  g.strokeCircle(-4, -46, 11);
  g.fillStyle(0xffffff, 1);
  g.fillRect(-15, -50, 22, 5);

  view.add(g);

  // Wheels (separate graphics so they can spin).
  const wheel = (x: number): Phaser.GameObjects.Graphics => {
    const w = scene.add.graphics();
    w.fillStyle(0x141414, 1);
    w.fillCircle(0, 0, 11);
    w.fillStyle(0xffffff, 1);
    w.fillCircle(0, 0, 5);
    w.lineStyle(2, 0x141414, 1);
    w.lineBetween(-5, 0, 5, 0);
    w.setPosition(x, 8);
    view.add(w);
    return w;
  };
  const wheelL = wheel(-20);
  const wheelR = wheel(20);
  return { view, wheelL, wheelR };
}

/** Create the physics body for a scooter standing on a platform top. */
export function createScooterBody(
  matter: Phaser.Physics.Matter.MatterPhysics,
  x: number,
  y: number,
  label: string,
): MatterJS.BodyType {
  const body = matter.bodies.rectangle(x, y, SCOOTER.w, SCOOTER.h, {
    chamfer: { radius: SCOOTER.chamfer },
    friction: SCOOTER.friction,
    frictionAir: SCOOTER.frictionAir,
    density: SCOOTER.density,
    restitution: SCOOTER.restitution,
    label,
  });
  return body;
}

/** Sync the visual to the body; spin the wheels with distance. */
export function syncScooterView(s: Scooter): void {
  const b = s.body;
  s.view.setPosition(b.position.x, b.position.y);
  s.view.setRotation(b.angle);
  const dx = b.position.x - s.lastX;
  s.lastX = b.position.x;
  const spin = dx * SCOOTER.wheelSpin;
  s.wheelL.rotation += spin;
  s.wheelR.rotation += spin;
}
