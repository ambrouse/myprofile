let THREE = null;

const QUALITY_CONFIG = {
  high: { dpr: 1.5, particles: 2800, bloomPulse: 1.0 },
  medium: { dpr: 1.2, particles: 1800, bloomPulse: 0.82 },
  low: { dpr: 1.0, particles: 1100, bloomPulse: 0.6 },
  auto: { dpr: 1.2, particles: 1700, bloomPulse: 0.8 }
};

const createGradientTexture = () => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(163,220,255,1)");
  grad.addColorStop(0.4, "rgba(163,220,255,0.7)");
  grad.addColorStop(1, "rgba(163,220,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
};

const detectAutoQuality = () => {
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  if (cores <= 4 || mem <= 4) return "low";
  if (cores <= 8 || mem <= 8) return "medium";
  return "high";
};

const resolveQuality = (input) => {
  if (input === "auto") return detectAutoQuality();
  if (QUALITY_CONFIG[input]) return input;
  return "medium";
};

const initScene = () => {
  const container = document.createElement("div");
  container.id = "cinematic-scene";
  Object.assign(container.style, {
    position: "fixed",
    inset: "0",
    zIndex: "-3",
    pointerEvents: "none"
  });
  document.body.prepend(container);

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050916, 0.018);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0, 10);

  const ambient = new THREE.AmbientLight(0x7dbfff, 0.45);
  scene.add(ambient);

  const key = new THREE.PointLight(0x4e8bff, 1.8, 28, 2);
  key.position.set(5, 3, 6);
  scene.add(key);

  const rim = new THREE.PointLight(0x74f0dd, 1.25, 24, 2);
  rim.position.set(-6, -2, 5);
  scene.add(rim);

  const grid = new THREE.Group();
  const gridMat = new THREE.MeshBasicMaterial({ color: 0x2a5ee8, transparent: true, opacity: 0.17, wireframe: true });
  for (let i = 0; i < 3; i += 1) {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(18, 18, 16, 16), gridMat);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -3.3 - i * 1.8;
    plane.position.z = -4 - i * 2.8;
    grid.add(plane);
  }
  scene.add(grid);

  const ringGroup = new THREE.Group();
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x7fc7ff,
    emissive: 0x1a3cff,
    emissiveIntensity: 0.42,
    metalness: 0.7,
    roughness: 0.25,
    transparent: true,
    opacity: 0.76
  });

  const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.06, 24, 180), ringMat);
  ringA.rotation.x = Math.PI * 0.37;
  ringA.rotation.y = Math.PI * 0.12;

  const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.05, 24, 180), ringMat.clone());
  ringB.rotation.x = Math.PI * 0.74;
  ringB.rotation.z = Math.PI * 0.22;
  ringB.material.emissiveIntensity = 0.3;

  ringGroup.add(ringA);
  ringGroup.add(ringB);
  ringGroup.position.set(0, 0.2, -1.4);
  scene.add(ringGroup);

  const particleGeo = new THREE.BufferGeometry();
  let particleMesh = null;
  let currentParticleCount = 0;

  const buildParticles = (count) => {
    currentParticleCount = count;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 26;
      positions[i3 + 1] = (Math.random() - 0.5) * 16;
      positions[i3 + 2] = -Math.random() * 18;
      scales[i] = Math.random() * 1.2 + 0.3;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    if (particleMesh) scene.remove(particleMesh);

    const particleMat = new THREE.PointsMaterial({
      color: 0xa2d8ff,
      map: createGradientTexture(),
      size: 0.08,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75
    });

    particleMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particleMesh);
  };

  const pointer = { tx: 0, ty: 0, x: 0, y: 0 };
  let slideIndex = 0;
  let visible = true;
  let rafId = 0;
  let qualityMode = resolveQuality(localStorage.getItem("vfx-quality") || "auto");
  let lowFpsCounter = 0;
  let highFpsCounter = 0;
  let lastFpsCheck = performance.now();
  let frameCount = 0;

  const applyQuality = (mode) => {
    qualityMode = resolveQuality(mode);
    const quality = QUALITY_CONFIG[qualityMode];
    const dpr = Math.min(window.devicePixelRatio || 1, quality.dpr);
    renderer.setPixelRatio(dpr);
    buildParticles(quality.particles);
  };

  applyQuality(qualityMode);

  const handlePointer = (e) => {
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    const quality = QUALITY_CONFIG[qualityMode];
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, quality.dpr));
  };

  const animate = (t) => {
    if (!visible) return;

    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;

    const slideOffset = (slideIndex || 0) * 0.45;
    camera.position.x += ((pointer.x * 0.9 + Math.sin(t * 0.0002) * 0.08) - camera.position.x) * 0.05;
    camera.position.y += ((-pointer.y * 0.6 + Math.sin(t * 0.00028) * 0.15) - camera.position.y) * 0.05;
    camera.position.z += ((9.6 + slideOffset) - camera.position.z) * 0.04;
    camera.lookAt(pointer.x * 0.8, -pointer.y * 0.4, -1.8 - slideOffset * 0.2);

    ringGroup.rotation.y += 0.0018;
    ringGroup.rotation.x += 0.0009;
    ringGroup.position.x = Math.sin(t * 0.0005) * 0.3 + pointer.x * 0.35;
    ringGroup.position.y = Math.cos(t * 0.0007) * 0.2 - pointer.y * 0.25;

    const positions = particleGeo.attributes.position.array;
    for (let i = 0; i < currentParticleCount; i += 1) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin((t * 0.0003) + i * 0.07) * 0.0009;
      positions[i3] += Math.cos((t * 0.0002) + i * 0.05) * 0.0006;
    }
    particleGeo.attributes.position.needsUpdate = true;

    const quality = QUALITY_CONFIG[qualityMode];
    key.intensity = 1.4 + Math.sin(t * 0.0017) * 0.35 * quality.bloomPulse;
    rim.intensity = 1.0 + Math.cos(t * 0.0014) * 0.25 * quality.bloomPulse;

    renderer.render(scene, camera);

    frameCount += 1;
    const now = performance.now();
    if (now - lastFpsCheck > 1200) {
      const fps = (frameCount * 1000) / (now - lastFpsCheck);
      frameCount = 0;
      lastFpsCheck = now;

      if ((localStorage.getItem("vfx-quality") || "auto") === "auto") {
        if (fps < 50) {
          lowFpsCounter += 1;
          highFpsCounter = 0;
        } else if (fps > 58) {
          highFpsCounter += 1;
          lowFpsCounter = 0;
        }

        if (lowFpsCounter >= 2 && qualityMode !== "low") {
          applyQuality(qualityMode === "high" ? "medium" : "low");
          lowFpsCounter = 0;
        }

        if (highFpsCounter >= 3 && qualityMode !== "high") {
          applyQuality(qualityMode === "low" ? "medium" : "high");
          highFpsCounter = 0;
        }
      }
    }

    rafId = requestAnimationFrame(animate);
  };

  const handleVisibility = () => {
    visible = !document.hidden;
    if (visible) {
      rafId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(rafId);
    }
  };

  window.addEventListener("pointermove", handlePointer, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("deck-slide-change", (e) => {
    slideIndex = e.detail?.index || 0;
  });
  window.addEventListener("vfx-quality-change", (e) => {
    applyQuality(e.detail?.quality || "auto");
  });

  rafId = requestAnimationFrame(animate);
};

const bootScene = async () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  try {
    THREE = await import("https://cdn.jsdelivr.net/npm/three@0.172.0/build/three.module.js");
    initScene();
  } catch (err) {
    console.warn("3D scene init failed, fallback to CSS visuals only", err);
  }
};

document.addEventListener("DOMContentLoaded", bootScene);
