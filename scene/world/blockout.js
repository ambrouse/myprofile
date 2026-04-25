export const createWorldBlockout = (THREE, materials) => {
  const world = new THREE.Group();
  world.name = "world-blockout";

  const refs = {
    coreGroup: new THREE.Group(),
    holoPanels: [],
    signalPillars: [],
    platformRings: []
  };

  const floor = new THREE.Mesh(new THREE.CircleGeometry(34, 96), materials.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2.9;
  floor.receiveShadow = true;
  world.add(floor);

  const floorGrid = new THREE.Mesh(new THREE.RingGeometry(8, 33, 128, 1), materials.floorGrid);
  floorGrid.rotation.x = -Math.PI / 2;
  floorGrid.position.y = -2.86;
  world.add(floorGrid);

  const ringConfigs = [
    { r: 10.8, y: -2.2, h: 0.42 },
    { r: 7.2, y: -1.3, h: 0.38 },
    { r: 4.2, y: -0.45, h: 0.34 }
  ];

  ringConfigs.forEach((cfg) => {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(cfg.r, cfg.r, cfg.h, 64, 1, true), materials.platform);
    ring.position.y = cfg.y;
    ring.castShadow = true;
    ring.receiveShadow = true;
    world.add(ring);
    refs.platformRings.push(ring);
  });

  for (let i = 0; i < 4; i += 1) {
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 6.4), materials.bridge);
    bridge.position.set(Math.cos((i * Math.PI) / 2) * 5.2, -1.3, Math.sin((i * Math.PI) / 2) * 5.2);
    bridge.rotation.y = (i * Math.PI) / 2;
    bridge.castShadow = true;
    bridge.receiveShadow = true;
    world.add(bridge);
  }

  const pillarGeo = new THREE.CylinderGeometry(0.35, 0.55, 6.8, 14);
  const pillarCapGeo = new THREE.CylinderGeometry(0.18, 0.3, 0.28, 12);

  const pillarCount = 18;
  for (let i = 0; i < pillarCount; i += 1) {
    const a = (i / pillarCount) * Math.PI * 2;
    const p = new THREE.Mesh(pillarGeo, materials.pillar);
    p.position.set(Math.cos(a) * 14.5, 0.4, Math.sin(a) * 14.5);
    p.castShadow = true;
    p.receiveShadow = true;
    world.add(p);
    refs.signalPillars.push(p);

    const cap = new THREE.Mesh(pillarCapGeo, materials.pillarCap);
    cap.position.set(p.position.x, p.position.y + 3.5, p.position.z);
    cap.castShadow = true;
    world.add(cap);
  }

  const coreBase = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.5, 3.4, 42), materials.coreBase);
  coreBase.position.y = 0.9;
  coreBase.castShadow = true;
  refs.coreGroup.add(coreBase);

  const coreColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.78, 5.2, 32), materials.coreColumn);
  coreColumn.position.y = 2.35;
  refs.coreGroup.add(coreColumn);

  const torusA = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.08, 18, 120), materials.coreTorus);
  torusA.rotation.x = Math.PI * 0.35;
  torusA.position.y = 2.2;
  refs.coreGroup.add(torusA);

  const torusB = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.07, 18, 120), materials.coreTorus.clone());
  torusB.rotation.x = Math.PI * 0.8;
  torusB.position.y = 2.2;
  torusB.material.emissiveIntensity = 0.48;
  refs.coreGroup.add(torusB);

  const rayCone = new THREE.Mesh(new THREE.ConeGeometry(2.8, 8.6, 26, 1, true), materials.godRay);
  rayCone.position.y = 4.8;
  rayCone.rotation.y = Math.PI * 0.25;
  refs.coreGroup.add(rayCone);
  refs.coreGroup.userData.rayCone = rayCone;

  refs.coreGroup.userData.torusA = torusA;
  refs.coreGroup.userData.torusB = torusB;
  world.add(refs.coreGroup);

  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * Math.PI * 2;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.4), materials.holoPanel.clone());
    panel.position.set(Math.cos(a) * 8.7, 0.5, Math.sin(a) * 8.7);
    panel.lookAt(0, 0.4, 0);
    refs.holoPanels.push(panel);
    world.add(panel);
  }

  const dome = new THREE.Mesh(new THREE.SphereGeometry(62, 32, 24), materials.dome);
  world.add(dome);

  return { world, refs };
};
