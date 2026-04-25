import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const MODEL_SPECS = [
  { id: "ai_core_reactor", path: "./assets3d/ai_core_reactor.glb", zone: "intro", scale: 1.35, y: -0.3 },
  { id: "skills_node", path: "./assets3d/skills_node.glb", zone: "skills", scale: 1.15, y: -1.0 },
  { id: "rag_data_vault", path: "./assets3d/rag_data_vault.glb", zone: "rag", scale: 1.2, y: -1.1 },
  { id: "edge_inference_bay", path: "./assets3d/edge_inference_bay.glb", zone: "edge", scale: 1.2, y: -1.0 },
  { id: "comms_terminal", path: "./assets3d/comms_terminal.glb", zone: "contact", scale: 1.05, y: -0.95 }
];

const normalizeModel = (root) => {
  root.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
      if (obj.material) {
        obj.material.depthWrite = true;
        obj.material.needsUpdate = true;
      }
    }
  });
};

export const loadSceneAssets = async () => {
  const loader = new GLTFLoader();
  const group = new THREE.Group();
  group.name = "external-assets";

  const loaded = [];
  const missing = [];

  await Promise.all(
    MODEL_SPECS.map(async (spec) => {
      try {
        const gltf = await loader.loadAsync(spec.path);
        const model = gltf.scene;
        model.name = spec.id;
        model.userData.zone = spec.zone;
        model.userData.spec = spec;
        normalizeModel(model);
        group.add(model);
        loaded.push(spec.id);
      } catch {
        missing.push(spec.id);
      }
    })
  );

  return { group, loaded, missing, specs: MODEL_SPECS };
};

export const placeAssetsByZones = ({ assetsGroup, zones, specsById = {} }) => {
  assetsGroup.children.forEach((model) => {
    const spec = model.userData.spec || specsById[model.name];
    if (!spec) return;

    const zone = zones.find((z) => z.id === spec.zone);
    if (!zone) return;

    model.position.set(zone.position[0], spec.y ?? zone.position[1], zone.position[2]);
    model.scale.setScalar(spec.scale || 1);

    if (spec.zone === "intro") {
      model.rotation.y = Math.PI * 0.22;
    } else if (spec.zone === "contact") {
      model.rotation.y = Math.PI;
    }
  });
};

export { MODEL_SPECS };
