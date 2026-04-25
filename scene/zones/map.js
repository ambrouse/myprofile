export const ZONES = [
  { id: "intro", label: "AI Core", description: "Tâm điểm hồ sơ và năng lực cốt lõi.", color: 0x72e8ff, position: [0, -0.2, 0] },
  { id: "skills", label: "Skills Node", description: "Năng lực kỹ thuật và năng lực hệ thống.", color: 0x55a8ff, position: [-8.2, -1.0, 6.6] },
  { id: "rag", label: "RAG Chamber", description: "Không gian dự án RAG production.", color: 0x4f7fff, position: [7.8, -1.1, -7.1] },
  { id: "edge", label: "Edge Bay", description: "Không gian dự án Edge AI realtime.", color: 0x6d63ff, position: [-7.1, -0.9, -7.9] },
  { id: "contact", label: "Comms Terminal", description: "Kênh kết nối và hợp tác dự án.", color: 0x6af7db, position: [0, -0.8, 9.2] }
];

export const createZoneMarkers = (THREE) => {
  const group = new THREE.Group();
  const markers = [];

  ZONES.forEach((zone, idx) => {
    const markerGroup = new THREE.Group();
    markerGroup.position.set(...zone.position);

    const base = new THREE.Mesh(
      new THREE.RingGeometry(0.7, 1.15, 42),
      new THREE.MeshBasicMaterial({
        color: zone.color,
        transparent: true,
        opacity: 0.36,
        side: THREE.DoubleSide
      })
    );
    base.rotation.x = -Math.PI / 2;

    const pillar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 1.45, 14),
      new THREE.MeshStandardMaterial({
        color: zone.color,
        emissive: zone.color,
        emissiveIntensity: 0.5,
        metalness: 0.25,
        roughness: 0.2
      })
    );
    pillar.position.y = 0.75;

    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 14),
      new THREE.MeshStandardMaterial({
        color: 0xd7f8ff,
        emissive: zone.color,
        emissiveIntensity: 0.9,
        roughness: 0.15,
        metalness: 0.1
      })
    );
    orb.position.y = 1.5;

    markerGroup.add(base);
    markerGroup.add(pillar);
    markerGroup.add(orb);
    markerGroup.userData = { zoneIndex: idx, zoneId: zone.id, base, pillar, orb };

    markers.push(markerGroup);
    group.add(markerGroup);
  });

  return { group, markers, zones: ZONES };
};
