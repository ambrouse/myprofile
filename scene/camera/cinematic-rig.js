export const INTRO_KEYFRAMES = [
  { t: 0.0, pos: [-15.8, 8.8, 17.6], look: [0, 0.8, 0] },
  { t: 0.25, pos: [11.2, 5.2, 12.6], look: [0, 1.5, -0.2] },
  { t: 0.5, pos: [-8.1, 3.1, 8.4], look: [0.4, 1.8, 0.1] },
  { t: 0.78, pos: [4.2, 2.7, -10.6], look: [0.1, 1.3, -2.2] },
  { t: 1.0, pos: [9.8, 3.2, 10.5], look: [0, 1.8, 0] }
];

const lerpFrame = (THREE, a, b, t) => {
  const pos = new THREE.Vector3(...a.pos).lerp(new THREE.Vector3(...b.pos), t);
  const look = new THREE.Vector3(...a.look).lerp(new THREE.Vector3(...b.look), t);
  return { pos, look };
};

const sampleKeyframes = (THREE, keyframes, t) => {
  if (t <= keyframes[0].t) {
    return { pos: new THREE.Vector3(...keyframes[0].pos), look: new THREE.Vector3(...keyframes[0].look) };
  }

  const last = keyframes[keyframes.length - 1];
  if (t >= last.t) {
    return { pos: new THREE.Vector3(...last.pos), look: new THREE.Vector3(...last.look) };
  }

  for (let i = 0; i < keyframes.length - 1; i += 1) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (t >= a.t && t <= b.t) {
      const localT = (t - a.t) / (b.t - a.t);
      return lerpFrame(THREE, a, b, localT);
    }
  }

  return { pos: new THREE.Vector3(...last.pos), look: new THREE.Vector3(...last.look) };
};

export const createCinematicRig = (THREE, options = {}) => {
  const introDurationMs = options.introDurationMs || 13000;
  const introStartAt = performance.now();
  const keyframes = options.keyframes || INTRO_KEYFRAMES;
  let introDone = false;

  const update = (timeNow, target) => {
    if (introDone) return { introDone: true };

    const elapsed = timeNow - introStartAt;
    const t = Math.min(1, elapsed / introDurationMs);
    const eased = 1 - Math.pow(1 - t, 3);
    const sample = sampleKeyframes(THREE, keyframes, eased);

    target.pos.copy(sample.pos);
    target.look.copy(sample.look);

    if (t >= 1) introDone = true;
    return { introDone };
  };

  return {
    update,
    isDone: () => introDone
  };
};
