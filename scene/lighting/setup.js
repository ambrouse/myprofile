export const setupSceneLighting = (THREE, scene) => {
  const hemi = new THREE.HemisphereLight(0x7fb6ff, 0x070b13, 0.4);
  scene.add(hemi);

  const key = new THREE.SpotLight(0x5a8dff, 1.9, 96, Math.PI / 6, 0.35, 1.4);
  key.position.set(8, 14, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.0002;
  scene.add(key);
  scene.add(key.target);
  key.target.position.set(0, 0.6, 0);

  const fill = new THREE.PointLight(0x57c2ff, 1.0, 28, 2);
  fill.position.set(-10, 2, -6);
  scene.add(fill);

  const rim = new THREE.PointLight(0x6af7db, 1.2, 22, 2);
  rim.position.set(5, 2.6, -10);
  scene.add(rim);

  return { hemi, key, fill, rim };
};
