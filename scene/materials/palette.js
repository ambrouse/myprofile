export const createSceneMaterials = (THREE) => {
  const floor = new THREE.MeshStandardMaterial({
    color: 0x0b1224,
    metalness: 0.78,
    roughness: 0.34
  });

  const floorGrid = new THREE.MeshBasicMaterial({
    color: 0x2f7cff,
    transparent: true,
    opacity: 0.16,
    side: THREE.DoubleSide,
    wireframe: true
  });

  const platform = new THREE.MeshStandardMaterial({
    color: 0x121c34,
    metalness: 0.72,
    roughness: 0.36
  });

  const bridge = new THREE.MeshStandardMaterial({
    color: 0x1a2744,
    metalness: 0.6,
    roughness: 0.45
  });

  const pillar = new THREE.MeshStandardMaterial({
    color: 0x18233f,
    metalness: 0.62,
    roughness: 0.4
  });

  const pillarCap = new THREE.MeshStandardMaterial({
    color: 0x66dfff,
    emissive: 0x1f9cff,
    emissiveIntensity: 0.45,
    metalness: 0.35,
    roughness: 0.2
  });

  const coreBase = new THREE.MeshStandardMaterial({
    color: 0x1f325f,
    metalness: 0.82,
    roughness: 0.25,
    emissive: 0x0b1a40,
    emissiveIntensity: 0.35
  });

  const coreColumn = new THREE.MeshStandardMaterial({
    color: 0x72e8ff,
    emissive: 0x2f8cff,
    emissiveIntensity: 0.95,
    transparent: true,
    opacity: 0.82,
    metalness: 0.12,
    roughness: 0.12
  });

  const coreTorus = new THREE.MeshStandardMaterial({
    color: 0xa2d3ff,
    emissive: 0x3a7dff,
    emissiveIntensity: 0.62,
    metalness: 0.58,
    roughness: 0.28
  });

  const holoPanel = new THREE.MeshBasicMaterial({
    color: 0x74e8ff,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide
  });

  const dome = new THREE.MeshBasicMaterial({
    color: 0x060b17,
    side: THREE.BackSide
  });

  const godRay = new THREE.MeshBasicMaterial({
    color: 0x55b6ff,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  return {
    floor,
    floorGrid,
    platform,
    bridge,
    pillar,
    pillarCap,
    coreBase,
    coreColumn,
    coreTorus,
    holoPanel,
    dome,
    godRay
  };
};
