import * as THREE from "three";
import { loadImageManifest } from "./image-manifest.js";

const isMobile = window.matchMedia("(max-width: 900px)").matches;

const CFG = isMobile
  ? {
      cardCount: 46,
      dpr: 1.0,
      speed: 2.8,
      laneW: 12,
      laneH: 7,
      spawnMin: 72,
      spawnMax: 148,
      avoidRadius: 3.0,
      pointerRadius: 0.95,
      raycastEvery: 1,
      drag: 1.7,
      angDrag: 2.2,
      maxForce: 2.2,
      maxVel: 1.8,
      maxAngVel: 1.45,
      collisionEvery: 1,
      collisionIterations: 2,
      collisionRestitution: 0.08,
      collisionSeparation: 0.86,
      collisionLookAhead: 0.11
    }
  : {
      cardCount: 92,
      dpr: 1.22,
      speed: 3.5,
      laneW: 17,
      laneH: 10,
      spawnMin: 88,
      spawnMax: 176,
      avoidRadius: 3.8,
      pointerRadius: 1.1,
      raycastEvery: 1,
      drag: 1.45,
      angDrag: 1.95,
      maxForce: 2.8,
      maxVel: 2.3,
      maxAngVel: 1.85,
      collisionEvery: 1,
      collisionIterations: 2,
      collisionRestitution: 0.1,
      collisionSeparation: 0.9,
      collisionLookAhead: 0.09
    };

const rand = (a, b) => a + Math.random() * (b - a);
const damp = (current, target, lambda, dt) => current + (target - current) * (1 - Math.exp(-lambda * dt));
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const shuffle = (arr) => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const makeBag = (items) => {
  let bag = shuffle(items);
  return {
    next() {
      if (!bag.length) bag = shuffle(items);
      return bag.pop();
    }
  };
};

const createFallbackTexture = () => {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 320;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 512, 320);
  g.addColorStop(0, "#0b1325");
  g.addColorStop(1, "#274d86");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 320);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { src: "fallback", texture: tex };
};

const loadTextures = async (renderer, manifest, onProgress = () => {}) => {
  const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), isMobile ? 2 : 8);
  let done = 0;

  const loadOne = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = async () => {
        try {
          if (img.decode) await img.decode();
        } catch {
          // Some browsers resolve onload after decode; keep going.
        }

        const texture = new THREE.Texture(img);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = maxAnisotropy;
        texture.needsUpdate = true;
        done += 1;
        onProgress(done / manifest.length, src);
        resolve({ src, texture });
      };
      img.onerror = () => {
        done += 1;
        onProgress(done / manifest.length, src);
        resolve(null);
      };
      img.src = src;
    });

  const arr = await Promise.all(manifest.map(loadOne));
  return arr.filter(Boolean);
};

const createLoadingScreen = () => {
  let el = document.getElementById("scene-loading");
  if (!el) {
    el = document.createElement("div");
    el.id = "scene-loading";
    el.innerHTML = `
      <div class="scene-loading-panel">
        <div class="scene-loading-bar" aria-hidden="true"><span></span></div>
      </div>
    `;
    document.body.appendChild(el);
  }

  const bar = el.querySelector(".scene-loading-bar span");

  return {
    set(value) {
      const pct = clamp(Math.round(value * 100), 0, 100);
      if (bar) bar.style.transform = `scaleX(${pct / 100})`;
    },
    done() {
      this.set(1, "San sang");
      el.classList.add("is-done");
      window.setTimeout(() => el.remove(), 520);
    }
  };
};

const preloadDocumentImages = async (onProgress = () => {}) => {
  const urls = [...document.querySelectorAll("img[src]")]
    .map((img) => img.currentSrc || img.getAttribute("src"))
    .filter(Boolean);
  const unique = [...new Set(urls)];
  if (!unique.length) {
    onProgress(1);
    return;
  }

  let done = 0;
  await Promise.all(
    unique.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.decoding = "async";
          img.onload = async () => {
            try {
              if (img.decode) await img.decode();
            } catch {
              // Keep booting if decode already happened or the browser refuses it.
            }
            done += 1;
            onProgress(done / unique.length);
            resolve();
          };
          img.onerror = () => {
            done += 1;
            onProgress(done / unique.length);
            resolve();
          };
          img.src = src;
        })
    )
  );
};

const warmUpTextures = (renderer, entries) => {
  for (let i = 0; i < entries.length; i += 1) {
    const t = entries[i]?.texture;
    if (!t) continue;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = true;
    t.needsUpdate = true;
    renderer.initTexture(t);
  }
};

const createShardShapeData = (w, h) => {
  const count = 8 + Math.floor(Math.random() * 4);
  const shape = new THREE.Shape();
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const a = (i / count) * Math.PI * 2 + rand(-0.2, 0.2);
    const rx = (w * 0.5) * rand(0.72, 1.0);
    const ry = (h * 0.5) * rand(0.68, 1.0);
    points.push(new THREE.Vector2(Math.cos(a) * rx, Math.sin(a) * ry));
  }

  shape.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) shape.lineTo(points[i].x, points[i].y);
  shape.closePath();

  const faceGeom = new THREE.ShapeGeometry(shape);
  faceGeom.computeBoundingBox();

  const bb = faceGeom.boundingBox;
  const uv = [];
  const pos = faceGeom.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const u = (x - bb.min.x) / (bb.max.x - bb.min.x || 1);
    const v = (y - bb.min.y) / (bb.max.y - bb.min.y || 1);
    uv.push(u, v);
  }
  faceGeom.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));

  return { shape, faceGeom, points };
};

const createCrackLineGeometry = (w, h, z) => {
  const positions = [];
  const seeds = 2 + Math.floor(Math.random() * 2);
  const maxMainLen = Math.min(w, h) * rand(0.38, 0.56);

  const addSegmentedLine = (sx, sy, ex, ey, segmentCount, jitter) => {
    let px = sx;
    let py = sy;
    for (let s = 1; s <= segmentCount; s += 1) {
      const t = s / segmentCount;
      const nx = sx + (ex - sx) * t + rand(-jitter, jitter);
      const ny = sy + (ey - sy) * t + rand(-jitter, jitter);
      positions.push(px, py, z, nx, ny, z);
      px = nx;
      py = ny;
    }
    return new THREE.Vector2(px, py);
  };

  for (let s = 0; s < seeds; s += 1) {
    const seedX = rand(-w * 0.22, w * 0.22);
    const seedY = rand(-h * 0.22, h * 0.22);
    const mainBranches = 4 + Math.floor(Math.random() * 3);

    for (let i = 0; i < mainBranches; i += 1) {
      const a = (i / mainBranches) * Math.PI * 2 + rand(-0.55, 0.55);
      const len = rand(maxMainLen * 0.42, maxMainLen);
      const ex = seedX + Math.cos(a) * len;
      const ey = seedY + Math.sin(a) * len;
      const end = addSegmentedLine(seedX, seedY, ex, ey, 3 + Math.floor(Math.random() * 3), 0.02);

      const microBranches = Math.random() < 0.8 ? 1 + Math.floor(Math.random() * 2) : 0;
      for (let m = 0; m < microBranches; m += 1) {
        const ba = a + rand(-0.9, 0.9);
        const bl = len * rand(0.16, 0.34);
        const bx = end.x + Math.cos(ba) * bl;
        const by = end.y + Math.sin(ba) * bl;
        addSegmentedLine(end.x, end.y, bx, by, 2 + Math.floor(Math.random() * 2), 0.018);
      }
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return g;
};

const createMemoryShard = (info) => {
  const ratio = info.texture.image ? info.texture.image.width / info.texture.image.height : 1.4;
  const h = rand(1.15, 1.9);
  const w = h * ratio;
  const group = new THREE.Group();
  const { shape, faceGeom } = createShardShapeData(w, h);
  faceGeom.computeVertexNormals();

  const bodyGeom = new THREE.ExtrudeGeometry(shape, {
    depth: 0.055,
    bevelEnabled: false
  });
  bodyGeom.center();
  bodyGeom.computeVertexNormals();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x10284d,
    roughness: 0.68,
    metalness: 0.18,
    emissive: 0x020817,
    emissiveIntensity: 0.08,
    side: THREE.DoubleSide
  });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.z = -0.038;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const imageMat = new THREE.MeshStandardMaterial({
    map: info.texture,
    emissiveMap: info.texture,
    color: 0xffffff,
    side: THREE.DoubleSide,
    roughness: 0.36,
    metalness: 0.08,
    emissive: 0x5f83b5,
    emissiveIntensity: 0.28
  });

  const imageMesh = new THREE.Mesh(faceGeom, imageMat);
  imageMesh.renderOrder = 2;
  imageMesh.position.z = 0.008;
  imageMesh.castShadow = true;
  imageMesh.receiveShadow = true;
  group.add(imageMesh);

  const outlinePoints = shape.getPoints();
  const outlineGeom = new THREE.BufferGeometry().setFromPoints(
    outlinePoints.map((p) => new THREE.Vector3(p.x, p.y, 0.002))
  );
  const outlineMat = new THREE.LineBasicMaterial({
    color: 0xb7dfff,
    transparent: true,
    opacity: 0.08,
    depthWrite: false
  });
  const outline = new THREE.LineLoop(outlineGeom, outlineMat);
  outline.renderOrder = 3;
  group.add(outline);

  group.userData = {
    src: info.src,
    radius: Math.max(0.52, Math.hypot(w * 0.5, h * 0.5) * 0.54),
    invMass: 1 / Math.max(0.85, w * h),
    vel: new THREE.Vector3(rand(-0.18, 0.18), rand(-0.1, 0.1), rand(-0.12, 0.12)),
    force: new THREE.Vector3(),
    angVel: new THREE.Vector3(rand(-0.22, 0.22), rand(-0.32, 0.32), rand(-0.16, 0.16)),
    driftSeed: rand(0, 1000),
    driftAmp: rand(0.16, 0.42),
    hitCooldown: 0,
    vfxCooldown: 0,
    mouseHitPulse: 0,
    lifeSeed: rand(0, 1000),
    body,
    img: imageMesh,
    outline
  };

  return { group, raycastTarget: imageMesh };
};

const initScene = async () => {
  const loading = createLoadingScreen();
  loading.set(0.03, "Dang khoi tao khong gian 3D");

  const container = document.createElement("div");
  container.id = "photo-space";
  Object.assign(container.style, { position: "fixed", inset: "0", zIndex: "0", pointerEvents: "none" });
  document.body.prepend(container);
  document.body.classList.add("scene-world-active");

  const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, CFG.dpr));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.58;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060b14, isMobile ? 0.01 : 0.0085);

  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 450);
  camera.position.set(0, 0, 8);

  const introVeil = document.createElement("div");
  introVeil.id = "warp-intro-veil";
  Object.assign(introVeil.style, {
    position: "fixed",
    inset: "0",
    zIndex: "7",
    pointerEvents: "none",
    opacity: "0",
    background:
      "radial-gradient(ellipse at center, rgba(154, 218, 255, 0.22) 0%, rgba(72, 142, 255, 0.16) 24%, rgba(8, 14, 28, 0.0) 68%), linear-gradient(180deg, rgba(128, 208, 255, 0.22), rgba(5, 10, 20, 0.0) 46%)",
    mixBlendMode: "screen"
  });
  document.body.appendChild(introVeil);

  const hemiLight = new THREE.HemisphereLight(0x9fc7ff, 0x0c0620, 0.9);
  scene.add(hemiLight);
  const ambientLight = new THREE.AmbientLight(0x5f7fd0, 0.62);
  scene.add(ambientLight);

  const coreLight = new THREE.PointLight(0x7fc9ff, 4.2, 68, 1.55);
  coreLight.position.set(0, 0.6, -8);
  coreLight.castShadow = true;
  coreLight.shadow.mapSize.set(isMobile ? 512 : 1024, isMobile ? 512 : 1024);
  coreLight.shadow.bias = -0.0006;
  scene.add(coreLight);

  const key = new THREE.DirectionalLight(0xb0d5ff, 1.8);
  key.position.set(6, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(isMobile ? 512 : 1024, isMobile ? 512 : 1024);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 80;
  key.shadow.camera.left = -18;
  key.shadow.camera.right = 18;
  key.shadow.camera.top = 12;
  key.shadow.camera.bottom = -12;
  scene.add(key);

  const violetFill = new THREE.PointLight(0x8267ff, 2.1, 58, 1.7);
  violetFill.position.set(0, 1.8, -22);
  scene.add(violetFill);

  const dustGeom = new THREE.BufferGeometry();
  const dustCount = isMobile ? 260 : 620;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i += 1) {
    const i3 = i * 3;
    dustPos[i3] = rand(-34, 34);
    dustPos[i3 + 1] = rand(-20, 20);
    dustPos[i3 + 2] = -rand(18, 410);
  }
  dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: 0x9ecfff,
    size: isMobile ? 0.05 : 0.08,
    transparent: true,
    opacity: 0.2,
    depthWrite: false
  });
  const dust = new THREE.Points(dustGeom, dustMat);
  scene.add(dust);

  const fallbackEntry = createFallbackTexture();
  let bag = makeBag([fallbackEntry]);
  let storyCount = 0;
  let texturesReady = false;

  try {
    loading.set(0.08, "Dang doc danh sach anh");
    const imageManifest = await loadImageManifest();
    storyCount = imageManifest.length;
    if (imageManifest.length) {
      const loaded = await loadTextures(renderer, imageManifest, (progress) => {
        loading.set(0.1 + progress * 0.82, "Dang cache anh vao trinh duyet");
      });
      if (loaded.length) {
        warmUpTextures(renderer, loaded);
        bag = makeBag(loaded);
        texturesReady = true;
      }
    }
    await preloadDocumentImages((progress) => {
      loading.set(0.92 + progress * 0.04, "Dang cache anh trong slide");
    });
  } catch (err) {
    console.error("Image loading failed", err);
  }

  loading.set(0.96, texturesReady ? "Dang lam nong texture GPU" : "Dung nen fallback");

  const shardsGroup = new THREE.Group();
  scene.add(shardsGroup);

  const shards = [];
  const hitTargets = [];
  const meshToShard = new Map();

  const spawnAhead = (shard, camZ) => {
    const g = shard.group;
    const u = g.userData;

    g.position.set(rand(-CFG.laneW, CFG.laneW), rand(-CFG.laneH, CFG.laneH), camZ - rand(CFG.spawnMin, CFG.spawnMax));
    g.rotation.set(rand(-0.7, 0.7), rand(-1.0, 1.0), rand(-0.7, 0.7));

    const next = bag.next();
    u.img.material.map = next.texture;
    u.img.material.needsUpdate = true;
    u.src = next.src;

    u.vel.set(rand(-0.16, 0.16), rand(-0.09, 0.09), rand(-0.11, 0.11));
    u.angVel.set(rand(-0.22, 0.22), rand(-0.28, 0.28), rand(-0.14, 0.14));
  };

  const spawnInitial = (shard, idx, total, camZ) => {
    const g = shard.group;
    const u = g.userData;
    const t = idx / Math.max(total - 1, 1);
    const band = idx % 3;
    const angle = idx * (Math.PI * 0.56) + rand(-0.35, 0.35);

    let depth;
    if (band === 0) depth = rand(34, 72) + t * rand(40, 78);
    else if (band === 1) depth = rand(56, 104) + t * rand(52, 92);
    else depth = rand(84, 136) + t * rand(64, 106);

    const radius = 1.4 + t * (isMobile ? 7.2 : 10.2) + rand(-0.5, 0.7);
    g.position.set(
      Math.cos(angle) * radius + rand(-1.2, 1.2),
      Math.sin(angle * 1.16) * radius * 0.58 + rand(-0.85, 0.85),
      camZ - depth
    );
    g.rotation.set(rand(-0.78, 0.78), rand(-1.2, 1.2), rand(-0.72, 0.72));

    const next = bag.next();
    u.img.material.map = next.texture;
    u.img.material.needsUpdate = true;
    u.src = next.src;

    const inward = new THREE.Vector3(-g.position.x * 0.02, -g.position.y * 0.02, rand(-0.16, -0.08));
    u.vel.set(inward.x + rand(-0.08, 0.08), inward.y + rand(-0.08, 0.08), inward.z);
    u.angVel.set(rand(-0.22, 0.22), rand(-0.32, 0.32), rand(-0.18, 0.18));
  };

  for (let i = 0; i < CFG.cardCount; i += 1) {
    const shard = createMemoryShard(bag.next());
    shards.push(shard);
    shardsGroup.add(shard.group);
    hitTargets.push(shard.raycastTarget);
    meshToShard.set(shard.raycastTarget, shard);
    spawnInitial(shard, i, CFG.cardCount, camera.position.z);
  }

  const pointer = { nx: 0, ny: 0, active: false, down: false };
  const raycaster = new THREE.Raycaster();
  const tmpV2 = new THREE.Vector2();
  const tmpDir = new THREE.Vector3();
  const tmpCam = new THREE.Vector3();
  const tmpNdc = new THREE.Vector3();
  const tmpSep = new THREE.Vector3();
  const tmpRel = new THREE.Vector3();
  const pointerRayOrigin = new THREE.Vector3();
  const pointerRayDir = new THREE.Vector3();
  const predictedA = new THREE.Vector3();
  const predictedB = new THREE.Vector3();

  const flow = {
    lateral: 0,
    vertical: 0,
    speed: CFG.speed,
    travelZ: 0
  };

  const introWarp = {
    holdDuration: 1.5,
    slowDuration: 1.0,
    speedScale: isMobile ? 24.0 : 30.0,
    fovStart: isMobile ? 82 : 96,
    fovEnd: 52
  };

  let slideIndex = 0;
  let visible = true;
  let frame = 0;
  let pointerRayReady = false;
  let lastHitId = "";
  let globalHitCooldown = 0;
  let slideBoundsNdc = { left: -0.7, right: 0.7, top: 0.72, bottom: -0.72 };
  let themeMode = document.documentElement.dataset.theme === "light" ? "light" : "dark";

  const themeProfiles = {
    dark: {
      fog: 0x060b14,
      exposure: 1.58,
      hemiSky: 0x9fc7ff,
      hemiGround: 0x0c0620,
      hemiIntensity: 0.9,
      ambient: 0x5f7fd0,
      ambientIntensity: 0.62,
      core: 0x7fc9ff,
      coreIntensity: 4.2,
      key: 0xb0d5ff,
      keyIntensity: 1.8,
      fill: 0x8267ff,
      fillIntensity: 2.1,
      dust: 0x9ecfff,
      imageBrightnessNear: 1.75,
      imageBrightnessFar: 0.8,
      emissive: [0.37, 0.51, 0.71],
      imageEmissiveBase: 0.24,
      imageEmissiveDepth: 0.72,
      bodyEmissiveBase: 0.08,
      bodyEmissiveDepth: 0.2,
      outlineBase: 0.06,
      outlineDepth: 0.08
    },
    light: {
      fog: 0xdbe8ef,
      exposure: 1.05,
      hemiSky: 0xd9ecf3,
      hemiGround: 0xb8c6cf,
      hemiIntensity: 0.66,
      ambient: 0xc6dce8,
      ambientIntensity: 0.48,
      core: 0xb9d8e6,
      coreIntensity: 1.55,
      key: 0xe5f2f7,
      keyIntensity: 1.1,
      fill: 0x7aa9bd,
      fillIntensity: 0.62,
      dust: 0x6b8fa1,
      imageBrightnessNear: 0.98,
      imageBrightnessFar: 0.7,
      emissive: [0.08, 0.14, 0.18],
      imageEmissiveBase: 0.03,
      imageEmissiveDepth: 0.16,
      bodyEmissiveBase: 0.02,
      bodyEmissiveDepth: 0.05,
      outlineBase: 0.03,
      outlineDepth: 0.03
    }
  };

  const updateSlideBounds = () => {
    const active = document.querySelector(".slide.is-active .slide-content") || document.querySelector(".slide.is-active");
    if (!active) return;
    const r = active.getBoundingClientRect();
    slideBoundsNdc = {
      left: (r.left / window.innerWidth) * 2 - 1,
      right: (r.right / window.innerWidth) * 2 - 1,
      top: 1 - (r.top / window.innerHeight) * 2,
      bottom: 1 - (r.bottom / window.innerHeight) * 2
    };
  };

  const applySceneTheme = (mode) => {
    themeMode = mode === "light" ? "light" : "dark";
    const profile = themeProfiles[themeMode];
    scene.fog.color.setHex(profile.fog);
    hemiLight.color.setHex(profile.hemiSky);
    hemiLight.groundColor.setHex(profile.hemiGround);
    hemiLight.intensity = profile.hemiIntensity;
    ambientLight.color.setHex(profile.ambient);
    ambientLight.intensity = profile.ambientIntensity;
    coreLight.color.setHex(profile.core);
    coreLight.intensity = profile.coreIntensity;
    key.color.setHex(profile.key);
    key.intensity = profile.keyIntensity;
    violetFill.color.setHex(profile.fill);
    violetFill.intensity = profile.fillIntensity;
    dustMat.color.setHex(profile.dust);
  };

  const addImpulse = (shard, dir, force) => {
    const u = shard.group.userData;
    u.vel.addScaledVector(dir, force);
    u.angVel.x += rand(-0.7, 0.7) * force * 0.7;
    u.angVel.y += rand(-1.1, 1.1) * force * 0.75;
    u.angVel.z += rand(-0.45, 0.45) * force * 0.62;
    u.hitCooldown = 0.16;
  };

  const pointerHit = () => {
    if (!pointer.active) return;
    if (frame % CFG.raycastEvery !== 0) return;

    tmpV2.set(pointer.nx, pointer.ny);
    raycaster.setFromCamera(tmpV2, camera);
    pointerRayOrigin.copy(raycaster.ray.origin);
    pointerRayDir.copy(raycaster.ray.direction);
    pointerRayReady = true;

    const hit = raycaster.intersectObjects(hitTargets, false)[0];
    if (!hit) {
      lastHitId = "";
      return;
    }

    const shard = meshToShard.get(hit.object);
    if (!shard) return;

    const id = shard.group.uuid;
    const u = shard.group.userData;
    if (u.vfxCooldown > 0 || globalHitCooldown > 0) return;
    if (id === lastHitId && !pointer.down) return;

    tmpDir.copy(shard.group.position).sub(camera.position).normalize();
    addImpulse(shard, tmpDir, pointer.down ? 0.92 : 0.62);
    u.angVel.x += rand(-0.7, 0.7) * 0.32;
    u.angVel.y += rand(-1.2, 1.2) * 0.4;
    u.angVel.z += rand(-0.6, 0.6) * 0.24;

    u.mouseHitPulse = 1;
    u.vfxCooldown = 0.26;
    globalHitCooldown = 0.03;
    lastHitId = id;
  };

  const slideTouch = (shard) => {
    const g = shard.group;
    const u = g.userData;
    if (u.hitCooldown > 0 || u.vfxCooldown > 0) return;

    tmpNdc.copy(g.position).project(camera);
    if (tmpNdc.z < -1 || tmpNdc.z > 1) return;
    if (tmpNdc.x < slideBoundsNdc.left || tmpNdc.x > slideBoundsNdc.right) return;
    if (tmpNdc.y < slideBoundsNdc.bottom || tmpNdc.y > slideBoundsNdc.top) return;

    tmpCam.copy(g.position).applyMatrix4(camera.matrixWorldInverse);
    if (tmpCam.z > -2.8 || tmpCam.z < -24) return;

    tmpDir.copy(g.position).sub(camera.position).normalize();
    addImpulse(shard, tmpDir, 0.24);
    u.vfxCooldown = 0.2;
  };

  const updateCamera = (elapsed, dt) => {
    const introTotal = introWarp.holdDuration + introWarp.slowDuration;
    const introT = clamp(elapsed / introTotal, 0, 1);
    const slowT = clamp((elapsed - introWarp.holdDuration) / introWarp.slowDuration, 0, 1);
    const slowCurve = 1 - Math.pow(slowT, 2);
    const speedFactor = elapsed < introWarp.holdDuration ? introWarp.speedScale : 1 + (introWarp.speedScale - 1) * slowCurve;
    const introCurve = clamp((speedFactor - 1) / (introWarp.speedScale - 1), 0, 1);
    const speedNow = flow.speed * speedFactor;
    const fovTarget = introWarp.fovEnd + (introWarp.fovStart - introWarp.fovEnd) * Math.pow(introCurve, 0.78);

    flow.travelZ += speedNow * dt;
    const baseZ = -flow.travelZ - slideIndex * 4.0;

    const xWave = Math.sin(elapsed * 0.12 + 1.3) * 1.2;
    const yWave = Math.sin(elapsed * 0.08) * 0.5;

    const targetX = xWave;
    const targetY = yWave;

    camera.position.x = damp(camera.position.x, targetX, 1.15, dt);
    camera.position.y = damp(camera.position.y, targetY, 1.05, dt);
    camera.position.z = damp(camera.position.z, baseZ, 1.25, dt);
    camera.fov = damp(camera.fov, fovTarget, 4.6, dt);
    camera.updateProjectionMatrix();
    coreLight.position.set(camera.position.x * 0.18, camera.position.y * 0.12, camera.position.z - 10);
    key.position.set(camera.position.x + 6, camera.position.y + 7, camera.position.z + 5);
    violetFill.position.set(camera.position.x * -0.2, camera.position.y + 1.6, camera.position.z - 26);
    const profile = themeProfiles[themeMode];
    renderer.toneMappingExposure = damp(renderer.toneMappingExposure, profile.exposure + introCurve * 0.22, 4.2, dt);
    const dustGate = texturesReady ? 1 : 0.28;
    dustMat.size = damp(dustMat.size, (isMobile ? 0.04 : 0.06) + introCurve * (isMobile ? 0.08 : 0.12) * dustGate, 4.2, dt);
    dustMat.opacity = damp(dustMat.opacity, 0.1 + introCurve * 0.2 * dustGate, 4.2, dt);

    if (introVeil && introT < 1) {
      introVeil.style.opacity = String(0.9 * Math.pow(introCurve, 0.52));
    } else if (introVeil && introVeil.parentNode) {
      introVeil.style.opacity = "0";
      introVeil.parentNode.removeChild(introVeil);
    }

    tmpDir.set(targetX * 0.28, targetY * 0.18, baseZ - 19);
    camera.lookAt(tmpDir);
    camera.rotateZ(Math.sin(elapsed * 8.5) * 0.018 * introCurve);

  };

  const updateShards = (elapsed, dt) => {
    const camPos = camera.position;
    const profile = themeProfiles[themeMode];

    for (let i = 0; i < shards.length; i += 1) {
      const shard = shards[i];
      const g = shard.group;
      const u = g.userData;

      u.force.set(0, 0, 0);

      const driftX = Math.sin(elapsed * 0.42 + u.driftSeed) * u.driftAmp;
      const driftY = Math.cos(elapsed * 0.34 + u.lifeSeed) * u.driftAmp * 0.5;
      u.force.x += driftX * 0.36;
      u.force.y += driftY * 0.31;

      const dx = g.position.x - camPos.x;
      const dy = g.position.y - camPos.y;
      const dz = g.position.z - camPos.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < CFG.avoidRadius && dist > 0.0001) {
        const t = 1 - dist / CFG.avoidRadius;
        const s = t * t * 1.2;
        u.force.x += (dx / dist) * s;
        u.force.y += (dy / dist) * s;
        u.force.z += (dz / dist) * s;
      }

      if (u.force.length() > CFG.maxForce) u.force.setLength(CFG.maxForce);

      u.vel.addScaledVector(u.force, dt * 1.18);
      if (u.vel.length() > CFG.maxVel) u.vel.setLength(CFG.maxVel);
      u.vel.multiplyScalar(Math.exp(-CFG.drag * dt));

      g.position.addScaledVector(u.vel, dt * 8.0);

      if (u.hitCooldown > 0) u.hitCooldown -= dt;
      if (u.vfxCooldown > 0) u.vfxCooldown -= dt;
      if (u.mouseHitPulse > 0) u.mouseHitPulse = Math.max(0, u.mouseHitPulse - dt * 3.2);

      if (u.angVel.length() > CFG.maxAngVel) u.angVel.setLength(CFG.maxAngVel);
      u.angVel.multiplyScalar(Math.exp(-CFG.angDrag * dt));

      g.rotation.x += u.angVel.x * dt;
      g.rotation.y += u.angVel.y * dt;
      g.rotation.z += u.angVel.z * dt;

      const depth01 = clamp((dist - 7) / 140, 0, 1);
      const brightness = profile.imageBrightnessNear - depth01 * (profile.imageBrightnessNear - profile.imageBrightnessFar);
      const hitBoost = u.mouseHitPulse * (themeMode === "light" ? 0.18 : 0.52);
      u.img.material.color.setScalar(brightness);
      u.img.material.emissiveIntensity = profile.imageEmissiveBase + (1 - depth01) * profile.imageEmissiveDepth + hitBoost;
      u.body.material.emissiveIntensity = profile.bodyEmissiveBase + (1 - depth01) * profile.bodyEmissiveDepth;
      u.img.material.emissive.setRGB(
        profile.emissive[0] + u.mouseHitPulse * (themeMode === "light" ? 0.08 : 0.38),
        profile.emissive[1] + u.mouseHitPulse * (themeMode === "light" ? 0.08 : 0.26),
        profile.emissive[2] + u.mouseHitPulse * (themeMode === "light" ? 0.1 : 0.54)
      );

      if (u.outline) {
        const targetOpacity = u.vfxCooldown > 0 ? (themeMode === "light" ? 0.22 : 0.42) : profile.outlineBase + (1 - depth01) * profile.outlineDepth;
        u.outline.material.opacity = damp(u.outline.material.opacity, targetOpacity, 6.0, dt);
      }

      slideTouch(shard);

      if (g.position.z > camPos.z + 13) spawnAhead(shard, camPos.z);
      if (Math.abs(g.position.x - camPos.x) > CFG.laneW * 2.15) g.position.x = camPos.x + rand(-CFG.laneW, CFG.laneW);
      if (Math.abs(g.position.y - camPos.y) > CFG.laneH * 2.05) g.position.y = camPos.y + rand(-CFG.laneH, CFG.laneH);
    }
  };

  const resolveShardCollisions = () => {
    const camPos = camera.position;
    const restitution = CFG.collisionRestitution;
    const separationFactor = CFG.collisionSeparation;
    const lookAhead = CFG.collisionLookAhead;

    for (let i = 0; i < shards.length - 1; i += 1) {
      const a = shards[i].group;
      const ua = a.userData;
      const az = a.position.z;
      if (az > camPos.z + 20 || az < camPos.z - 72) continue;

      for (let j = i + 1; j < shards.length; j += 1) {
        const b = shards[j].group;
        const ub = b.userData;
        const bz = b.position.z;
        if (bz > camPos.z + 20 || bz < camPos.z - 72) continue;

        const maxZ = (ua.radius + ub.radius) * 1.3;
        const dz = b.position.z - a.position.z;
        if (Math.abs(dz) > maxZ) continue;

        predictedA.copy(a.position).addScaledVector(ua.vel, lookAhead);
        predictedB.copy(b.position).addScaledVector(ub.vel, lookAhead);
        tmpSep.subVectors(predictedB, predictedA);
        const distSq = tmpSep.lengthSq();
        const minDist = (ua.radius + ub.radius) * 1.08;
        const minDistSq = minDist * minDist;
        if (distSq >= minDistSq) continue;

        const dist = Math.sqrt(Math.max(distSq, 0.000001));
        tmpSep.multiplyScalar(1 / dist);

        const penetration = minDist - dist;
        const invMassSum = ua.invMass + ub.invMass;
        const correction = (penetration * separationFactor) / Math.max(invMassSum, 0.0001);
        a.position.addScaledVector(tmpSep, -correction * ua.invMass);
        b.position.addScaledVector(tmpSep, correction * ub.invMass);

        tmpRel.subVectors(ub.vel, ua.vel);
        const velAlongNormal = tmpRel.dot(tmpSep);
        if (velAlongNormal >= 0) continue;

        const impulse = (-(1 + restitution) * velAlongNormal) / Math.max(invMassSum, 0.0001);
        ua.vel.addScaledVector(tmpSep, -impulse * ua.invMass);
        ub.vel.addScaledVector(tmpSep, impulse * ub.invMass);

        const spin = Math.min(0.9, impulse * 0.08);
        ua.angVel.x += rand(-0.4, 0.4) * spin;
        ua.angVel.y += rand(-0.5, 0.5) * spin;
        ub.angVel.x += rand(-0.4, 0.4) * spin;
        ub.angVel.y += rand(-0.5, 0.5) * spin;

        ua.hitCooldown = Math.max(ua.hitCooldown, 0.05);
        ub.hitCooldown = Math.max(ub.hitCooldown, 0.05);
      }
    }
  };

  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, CFG.dpr));
    updateSlideBounds();
  };

  const onPointerMove = (e) => {
    pointer.active = true;
    pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ny = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  const onPointerDown = () => {
    pointer.down = true;
  };

  const onPointerUp = () => {
    pointer.down = false;
  };

  const onPointerLeave = () => {
    pointer.active = false;
    pointer.down = false;
  };

  const onVisibility = () => {
    visible = !document.hidden;
    if (visible) rafId = requestAnimationFrame(loop);
    else cancelAnimationFrame(rafId);
  };

  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("pointerleave", onPointerLeave, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);

  window.addEventListener("deck-slide-change", (e) => {
    slideIndex = e.detail?.index || 0;
    updateSlideBounds();
  });

  window.addEventListener("portfolio-theme-change", (e) => {
    applySceneTheme(e.detail?.theme);
  });

  applySceneTheme(themeMode);
  updateSlideBounds();

  let rafId = 0;
  let last = performance.now();
  const t0 = last;

  const loop = (now) => {
    if (!visible) return;

    const dt = Math.min(0.033, (now - last) / 1000);
    const elapsed = (now - t0) / 1000;
    last = now;
    frame += 1;
    pointerRayReady = false;
    globalHitCooldown = Math.max(0, globalHitCooldown - dt);

    updateCamera(elapsed, dt);
    pointerHit();
    updateShards(elapsed, dt);
    if (frame % CFG.collisionEvery === 0) {
      for (let i = 0; i < CFG.collisionIterations; i += 1) resolveShardCollisions();
    }

    renderer.render(scene, camera);

    rafId = requestAnimationFrame(loop);
  };

  loading.done();
  rafId = requestAnimationFrame(loop);
};

document.addEventListener("DOMContentLoaded", () => {
  initScene().catch((e) => console.error("Scene init failed", e));
});


