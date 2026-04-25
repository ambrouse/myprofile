import * as THREE from "three";
import { createWorldBlockout } from "./world/blockout.js";
import { createRenderPipeline } from "./render/pipeline.js";
import { createZoneMarkers, ZONES } from "./zones/map.js";
import { createAdaptiveQualityMonitor } from "./perf/adaptive-quality.js";
import { createCinematicRig } from "./camera/cinematic-rig.js";
import { createInteractiveRig } from "./camera/interactive-rig.js";
import { createSceneMaterials } from "./materials/palette.js";
import { setupSceneLighting } from "./lighting/setup.js";
import { MODEL_SPECS, loadSceneAssets, placeAssetsByZones } from "./assets/library.js";

const QUALITY_CONFIG = {
  ultra: { dpr: 1.7, shadowMapSize: 2048 },
  high: { dpr: 1.4, shadowMapSize: 1024 },
  medium: { dpr: 1.2, shadowMapSize: 1024 },
  low: { dpr: 1.0, shadowMapSize: 512 }
};

const detectAutoQuality = () => {
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  if (cores >= 12 && mem >= 16) return "ultra";
  if (cores >= 8 && mem >= 8) return "high";
  if (cores >= 6 && mem >= 6) return "medium";
  return "low";
};

const resolveQuality = (mode) => (mode === "auto" ? detectAutoQuality() : QUALITY_CONFIG[mode] ? mode : "medium");

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const createHud = () => {
  const hud = document.createElement("aside");
  hud.id = "scene-hud";
  hud.setAttribute("aria-live", "polite");

  const k = document.createElement("p");
  k.className = "scene-hud-kicker";
  k.textContent = "WORLD LINK";

  const title = document.createElement("h3");
  title.className = "scene-hud-title";

  const desc = document.createElement("p");
  desc.className = "scene-hud-desc";

  const state = document.createElement("p");
  state.className = "scene-hud-state";

  hud.append(k, title, desc, state);
  document.body.appendChild(hud);

  return {
    set(zone, modeText) {
      title.textContent = zone?.label || "AI Core";
      desc.textContent = zone?.description || "Realtime world-space scene mapped to portfolio zones.";
      state.textContent = modeText || "CINEMATIC ONLINE";
    }
  };
};

const initScene = () => {
  const container = document.createElement("div");
  container.id = "game-scene";
  Object.assign(container.style, {
    position: "fixed",
    inset: "0",
    zIndex: "0",
    pointerEvents: "none"
  });
  document.body.prepend(container);
  document.body.classList.add("scene-world-active");

  const hud = createHud();

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060b14, 0.022);

  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 170);

  const lights = setupSceneLighting(THREE, scene);
  const materials = createSceneMaterials(THREE);

  const { world, refs } = createWorldBlockout(THREE, materials);
  scene.add(world);
  const assetState = { loaded: 0, total: MODEL_SPECS.length };

  const { group: zoneGroup, markers } = createZoneMarkers(THREE);
  world.add(zoneGroup);
  loadSceneAssets()
    .then(({ group, loaded }) => {
      placeAssetsByZones({ assetsGroup: group, zones: ZONES });
      world.add(group);
      assetState.loaded = loaded.length;
    })
    .catch(() => {
      assetState.loaded = 0;
    });

  const pointer = { tx: 0, ty: 0, x: 0, y: 0, nx: 0, ny: 0 };
  const camState = {
    pos: new THREE.Vector3(9.8, 3.2, 10.5),
    look: new THREE.Vector3(0, 1.8, 0),
    targetPos: new THREE.Vector3(9.8, 3.2, 10.5),
    targetLook: new THREE.Vector3(0, 1.8, 0)
  };

  const params = {
    slideIndex: 0,
    visible: true,
    requestedMode: localStorage.getItem("vfx-quality") || "auto",
    resolvedMode: "medium",
    hoveredZoneIndex: -1
  };

  const cinematicRig = createCinematicRig(THREE, { introDurationMs: 13000 });
  const interactiveRig = createInteractiveRig(THREE);

  const renderPipeline = createRenderPipeline({
    THREE,
    renderer,
    scene,
    camera,
    quality: "medium"
  });

  const applyQuality = (mode) => {
    params.requestedMode = mode;
    params.resolvedMode = resolveQuality(mode);

    const quality = QUALITY_CONFIG[params.resolvedMode] || QUALITY_CONFIG.medium;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, quality.dpr);

    lights.key.shadow.mapSize.set(quality.shadowMapSize, quality.shadowMapSize);
    lights.key.shadow.needsUpdate = true;

    renderPipeline.resize(window.innerWidth, window.innerHeight, pixelRatio);
    renderPipeline.applyQualityToPipeline(params.resolvedMode);

    const zone = ZONES[params.hoveredZoneIndex] || ZONES[params.slideIndex] || ZONES[0];
    hud.set(zone, `QUALITY ${params.resolvedMode.toUpperCase()}`);
  };

  const qualityMonitor = createAdaptiveQualityMonitor({
    getRequestedMode: () => params.requestedMode,
    getCurrentResolvedMode: () => params.resolvedMode,
    onLowerQuality: (nextResolved) => {
      applyQuality(nextResolved);
    },
    onRaiseQuality: (nextResolved) => {
      applyQuality(nextResolved);
    }
  });

  applyQuality(params.requestedMode);

  const raycaster = new THREE.Raycaster();
  const tmpV = new THREE.Vector2();

  const updateCameraTargets = (timeNow) => {
    const introState = cinematicRig.update(timeNow, {
      pos: camState.targetPos,
      look: camState.targetLook
    });

    if (!introState.introDone) return;

    interactiveRig.update(params.slideIndex, pointer, {
      pos: camState.targetPos,
      look: camState.targetLook
    });
  };

  const updateZoneHover = () => {
    tmpV.set(pointer.nx, pointer.ny);
    raycaster.setFromCamera(tmpV, camera);
    const intersects = raycaster.intersectObjects(markers, true);

    let hoverIndex = -1;
    if (intersects.length > 0) {
      let current = intersects[0].object;
      while (current && current.parent && current.parent !== zoneGroup) {
        current = current.parent;
      }
      if (current?.userData?.zoneIndex !== undefined) hoverIndex = current.userData.zoneIndex;
    }

    params.hoveredZoneIndex = hoverIndex;
  };

  const updateZonesVisual = (timeNow) => {
    markers.forEach((marker, i) => {
      const isSlideZone = i === params.slideIndex;
      const isHover = i === params.hoveredZoneIndex;
      const intensity = isHover ? 1.0 : isSlideZone ? 0.75 : 0.35;

      const base = marker.userData.base;
      const orb = marker.userData.orb;

      base.material.opacity = 0.2 + intensity * 0.5 + Math.sin(timeNow * 0.002 + i) * 0.04;
      orb.material.emissiveIntensity = 0.55 + intensity * 0.95;

      marker.position.y = ZONES[i].position[1] + Math.sin(timeNow * 0.0016 + i * 0.7) * 0.12;
      marker.scale.setScalar(isHover ? 1.18 : isSlideZone ? 1.06 : 1.0);
    });

    const zone = ZONES[params.hoveredZoneIndex] || ZONES[params.slideIndex] || ZONES[0];
    const phaseText = cinematicRig.isDone() ? `ZONE ${zone.id.toUpperCase()}` : "CINEMATIC INTRO";
    hud.set(zone, `${phaseText} | ASSETS ${assetState.loaded}/${assetState.total}`);
  };

  const onPointerMove = (e) => {
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    pointer.nx = clamp((e.clientX / window.innerWidth) * 2 - 1, -1, 1);
    pointer.ny = clamp(-(e.clientY / window.innerHeight) * 2 + 1, -1, 1);
  };

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    applyQuality(params.requestedMode);
  };

  let rafId = 0;
  const tick = (timeNow) => {
    if (!params.visible) return;

    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;

    updateCameraTargets(timeNow);

    camState.pos.lerp(camState.targetPos, 0.06);
    camState.look.lerp(camState.targetLook, 0.07);

    camera.position.copy(camState.pos);
    camera.lookAt(camState.look);

    refs.coreGroup.rotation.y += 0.004;
    refs.coreGroup.position.y = Math.sin(timeNow * 0.0013) * 0.09;
    refs.coreGroup.userData.torusA.rotation.y += 0.012;
    refs.coreGroup.userData.torusB.rotation.x += 0.01;

    refs.holoPanels.forEach((panel, i) => {
      panel.material.opacity = 0.22 + Math.sin(timeNow * 0.0017 + i * 0.8) * 0.08;
      panel.position.y = 0.5 + Math.sin(timeNow * 0.0014 + i * 0.65) * 0.16;
      panel.lookAt(0, 0.8, 0);
    });

    refs.signalPillars.forEach((pillar, i) => {
      pillar.scale.y = 1 + Math.sin(timeNow * 0.001 + i * 0.35) * 0.02;
    });

    lights.key.position.x = 8 + Math.sin(timeNow * 0.0006) * 1.2;
    lights.rim.intensity = 1.0 + Math.sin(timeNow * 0.0018) * 0.22;

    if (refs.coreGroup.userData.rayCone) {
      refs.coreGroup.userData.rayCone.material.opacity = 0.07 + Math.sin(timeNow * 0.0015) * 0.025;
      refs.coreGroup.userData.rayCone.rotation.y += 0.0025;
    }

    updateZoneHover();
    updateZonesVisual(timeNow);

    renderPipeline.render();
    qualityMonitor.tick();

    rafId = requestAnimationFrame(tick);
  };

  const onVisibilityChange = () => {
    params.visible = !document.hidden;
    if (params.visible) {
      rafId = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafId);
    }
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);

  window.addEventListener("deck-slide-change", (e) => {
    params.slideIndex = clamp(e.detail?.index || 0, 0, ZONES.length - 1);
  });

  window.addEventListener("vfx-quality-change", (e) => {
    applyQuality(e.detail?.quality || "auto");
  });

  rafId = requestAnimationFrame(tick);
};

const bootScene = () => {
  initScene();
};

document.addEventListener("DOMContentLoaded", bootScene);

