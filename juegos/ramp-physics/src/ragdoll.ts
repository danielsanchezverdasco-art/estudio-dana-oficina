// Ragdoll: 10-body crash-test dummy (Ragdrop pattern) in Matter.js.
// Bodies: head (circle), torso, 2x upper arm, 2x forearm, 2x thigh, 2x shin.
// Constraints: stiffness ~0.9, mass ratio kept under 1:10 so the solver
// stays stable. The dummy starts STATIC (held on its platform) and is
// released by setStatic(false) on LAUNCH.
import Phaser from 'phaser';

export type RagdollPartName =
  | 'head' | 'torso'
  | 'upperArmL' | 'upperArmR' | 'forearmL' | 'forearmR'
  | 'thighL' | 'thighR' | 'shinL' | 'shinR';

export interface RagdollPart {
  name: RagdollPartName;
  body: MatterJS.BodyType;
  /** texture key for the visual */
  tex: string;
  /** display size in px */
  dw: number;
  dh: number;
}

export interface Ragdoll {
  parts: RagdollPart[];
  constraints: MatterJS.ConstraintType[];
  bodies: MatterJS.BodyType[];
}

const BODY_OPTS: MatterJS.IBodyDefinition = {
  friction: 0.1,
  frictionStatic: 0.2,
  restitution: 0.05,
  density: 0.001,
  collisionFilter: { group: 0, category: 0x0002, mask: 0xffff },
};

/**
 * Build the ragdoll with its feet EXACTLY at (x, y) — the shin bottoms
 * rest on the platform line, nothing penetrates the ground (an 8 px
 * penetration used to make Matter's solver "pop" the dummy on release,
 * tipping it at random instead of onto the ramp).
 * The dummy is ~90 px tall.
 */
export function buildRagdoll(
  matter: Phaser.Physics.Matter.MatterPhysics,
  x: number,
  y: number,
): Ragdoll {
  const { bodies: Bodies, body: Body, constraint: Constraint } = matter;

  const head = Bodies.circle(x, y - 76, 14, { ...BODY_OPTS, label: 'dummy-head' });
  const torso = Bodies.rectangle(x, y - 48, 30, 36, { ...BODY_OPTS, label: 'dummy-torso' });
  const upperArmL = Bodies.rectangle(x - 19, y - 56, 12, 20, { ...BODY_OPTS, label: 'dummy-arm' });
  const upperArmR = Bodies.rectangle(x + 19, y - 56, 12, 20, { ...BODY_OPTS, label: 'dummy-arm' });
  const forearmL = Bodies.rectangle(x - 19, y - 36, 11, 20, { ...BODY_OPTS, label: 'dummy-arm' });
  const forearmR = Bodies.rectangle(x + 19, y - 36, 11, 20, { ...BODY_OPTS, label: 'dummy-arm' });
  const thighL = Bodies.rectangle(x - 9, y - 30, 13, 22, { ...BODY_OPTS, label: 'dummy-leg' });
  const thighR = Bodies.rectangle(x + 9, y - 30, 13, 22, { ...BODY_OPTS, label: 'dummy-leg' });
  const shinL = Bodies.rectangle(x - 9, y - 10, 12, 20, { ...BODY_OPTS, label: 'dummy-leg' });
  const shinR = Bodies.rectangle(x + 9, y - 10, 12, 20, { ...BODY_OPTS, label: 'dummy-leg' });

  const bodies = [head, torso, upperArmL, upperArmR, forearmL, forearmR, thighL, thighR, shinL, shinR];
  for (const b of bodies) Body.setStatic(b, true);

  const link = (
    a: MatterJS.BodyType, b: MatterJS.BodyType,
    ax: number, ay: number, bx: number, by: number,
  ): MatterJS.ConstraintType =>
    Constraint.create({
      bodyA: a, bodyB: b,
      pointA: { x: ax, y: ay }, pointB: { x: bx, y: by },
      stiffness: 0.9, damping: 0.1, length: 0,
    });

  const constraints = [
    link(head, torso, 0, 10, 0, -16), // neck
    link(torso, upperArmL, -14, -14, 0, -8), // shoulder L
    link(torso, upperArmR, 14, -14, 0, -8), // shoulder R
    link(upperArmL, forearmL, 0, 9, 0, -9), // elbow L
    link(upperArmR, forearmR, 0, 9, 0, -9), // elbow R
    link(torso, thighL, -7, 15, 0, -9), // hip L
    link(torso, thighR, 7, 15, 0, -9), // hip R
    link(thighL, shinL, 0, 10, 0, -9), // knee L
    link(thighR, shinR, 0, 10, 0, -9), // knee R
  ];

  const parts: RagdollPart[] = [
    { name: 'head', body: head, tex: 'dummy-head', dw: 28, dh: 49 },
    { name: 'torso', body: torso, tex: 'dummy-torso', dw: 34, dh: 37 },
    { name: 'upperArmL', body: upperArmL, tex: 'dummy-upperarm', dw: 15, dh: 22 },
    { name: 'upperArmR', body: upperArmR, tex: 'dummy-upperarm', dw: 15, dh: 22 },
    { name: 'forearmL', body: forearmL, tex: 'dummy-forearm', dw: 15, dh: 22 },
    { name: 'forearmR', body: forearmR, tex: 'dummy-forearm', dw: 15, dh: 22 },
    { name: 'thighL', body: thighL, tex: 'dummy-thigh', dw: 17, dh: 24 },
    { name: 'thighR', body: thighR, tex: 'dummy-thigh', dw: 17, dh: 24 },
    { name: 'shinL', body: shinL, tex: 'dummy-shin', dw: 16, dh: 24 },
    { name: 'shinR', body: shinR, tex: 'dummy-shin', dw: 16, dh: 24 },
  ];

  return { parts, constraints, bodies };
}

/** Release the held dummy: all parts become dynamic. */
export function releaseRagdoll(matter: Phaser.Physics.Matter.MatterPhysics, ragdoll: Ragdoll): void {
  for (const b of ragdoll.bodies) {
    matter.body.setStatic(b, false);
  }
}

/** True when every part is (nearly) still. Threshold 0.4 px/step: a real
 * slide on a 10° slope reaches >1 px/step within a second, while a stuck
 * ragdoll's solver jitter stays below ~0.3. */
export function ragdollStill(ragdoll: Ragdoll, maxSpeed = 0.4): boolean {
  for (const b of ragdoll.bodies) {
    if (b.speed > maxSpeed) return false;
  }
  return true;
}

/** Centre of the dummy (average of part positions) — for camera/fail checks. */
export function ragdollCentre(ragdoll: Ragdoll): { x: number; y: number } {
  let x = 0;
  let y = 0;
  for (const b of ragdoll.bodies) {
    x += b.position.x;
    y += b.position.y;
  }
  return { x: x / ragdoll.bodies.length, y: y / ragdoll.bodies.length };
}
