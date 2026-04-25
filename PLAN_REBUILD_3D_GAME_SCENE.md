# PLAN_REBUILD_3D_GAME_SCENE.md

## 0) Muc tieu moi (rebuild)
- Bien portfolio thanh mot **3D game-like scene** dung nghia:
  - Co world-space ro rang (floor, structures, props, volumetric atmosphere).
  - Co camera cinematic + player-like control mode.
  - Co lighting PBR, reflection, shadow, post-processing stack.
  - Co UI overlay phu hop phong cach HUD tech AI.
- Van giu VI-first i18n va kha nang public deploy nhanh.

## 1) Tieu chuan "scene game" bat buoc
- Scene phai co:
  - Environment geometry (khong chi particles + ring).
  - Vat lieu PBR (metal/roughness/normal/emissive).
  - It nhat 3 lop anh sang: key, fill, rim + light animation.
  - Fog/atmosphere va depth cue ro.
  - PostFX: Bloom + SSAO (hoac screen-space contact shadow) + color grading.
  - Camera path cinematic cho intro + free-look mode khi tuong tac.
- Cam giac:
  - Co "sense of scale" (object foreground/mid/background).
  - Co motion parallax that su khi di chuyen camera.
  - Co transitions giong game scene cut/chuyen vung.

## 2) Kien truc ky thuat de rebuild
- Render core:
  - Three.js + EffectComposer.
  - GLTF/GLB pipeline (Draco/KTX2 textures neu can).
- Scene layers:
  - Layer A: Sky/atmospheric dome.
  - Layer B: Main environment (platform, structures, AI core).
  - Layer C: Dynamic props (hologram panels, scan beams, node meshes).
  - Layer D: VFX particles GPU (khong CPU O(n^2)).
- Camera system:
  - Mode 1: Cinematic rail camera (timeline based).
  - Mode 2: Interactive orbit/fly-lite (gioi han bien do, dam bao UX).
  - Camera blending voi spring damping.
- UX/UI:
  - DOM HUD o tren scene 3D (clean, futuristic).
  - Cac section portfolio map vao cac "zone" trong scene.

## 3) Performance budget moi (game-like but stable)
- Target desktop trung binh:
  - 60fps on dinh (16.7ms/frame), 1% low > 40fps.
- Frame budget tham chieu:
  - JS/update <= 4ms
  - Render + postFX <= 10ms
  - Margin <= 2.7ms
- Input response:
  - Pointer -> visual response <= 1 frame.
- Quality tiers bat buoc:
  - Ultra / High / Medium / Low / Auto
  - Auto downscale theo FPS feedback + device profile.

## 4) Ke hoach phat trien moi (chi tiet)

## Phase A - Re-Scoping & Visual Direction (1 ngay)
### Muc tieu
- Chot huong nghe thuat de khong bi "demo effect".
### Cong viec
- Chon 1 art direction duy nhat: "AI Command Nexus" (dark neon blue, industrial sci-fi).
- Chot moodboard + scene blockout sketch.
- Chot shot list camera cho intro 12-18s.
### Deliverables
- `docs/art-direction.md`
- `docs/shot-list.md`

## Phase B - Scene Blockout (2-3 ngay)
### Muc tieu
- Co world-space that su voi ty le hop ly.
### Cong viec
- Tao geometry blockout:
  - Ground plane + multi-level platforms.
  - Main AI core structure trung tam.
  - Secondary props (pillars, data towers, hologram pads).
- Dat scale markers de giu cam giac khong gian.
### Deliverables
- `scene/world/blockout.js`
- Scene xem duoc voi camera orbit debug.

## Phase C - Material/Lighting/PostFX (3-4 ngay)
### Muc tieu
- Dat chat lieu + anh sang + mau sac "game scene".
### Cong viec
- PBR materials cho tung nhom object.
- Dynamic lights + shadow tuning.
- EffectComposer stack:
  - RenderPass
  - SSAO (hoac alternative nhe)
  - UnrealBloomPass
  - Color correction/LUT tone mapping
- God-ray hoac volumetric fake cho AI core.
### Deliverables
- `scene/render/pipeline.js`
- `scene/materials/*.js`
- `scene/lighting/setup.js`

## Phase D - Cinematic Camera + Interaction (2-3 ngay)
### Muc tieu
- Camera cinematic co hon, co context, co "weight".
### Cong viec
- Intro rail camera timeline (keyframes + easing).
- Interactive mode:
  - Pointer free-look nhe
  - Scroll/jump zone theo section
- Blend cinematic <-> interactive mượt.
### Deliverables
- `scene/camera/cinematic-rig.js`
- `scene/camera/interactive-rig.js`

## Phase E - Portfolio Data Mapping vao Scene (2 ngay)
### Muc tieu
- Noi dung CV/portfolio duoc "nhung" vao khong gian 3D.
### Cong viec
- Moi section gan vao 1 zone:
  - Intro -> AI Core
  - Skills -> Command Panels
  - Projects -> Data Chambers
  - Contact -> Comms Terminal
- Hover/select object de hien HUD detail.
### Deliverables
- `scene/zones/map.js`
- `ui/hud/*` (neu tach module)

## Phase F - Optimization Hard Pass (3 ngay)
### Muc tieu
- Hieu nang on dinh tren nhieu may.
### Cong viec
- Geometry instancing cho object lap lai.
- Texture compression + mipmap strategy.
- Frustum culling + LOD cho objects xa.
- Adaptive postFX quality theo frame timing.
- Pause/reduce update khi tab hidden/background.
### Deliverables
- `scene/perf/adaptive-quality.js`
- `docs/perf-report-rebuild.md`

## Phase G - QA + Release (1-2 ngay)
### Muc tieu
- Chot ban release dung chat "3D scene".
### Cong viec
- Test desktop/mobile fallback.
- Test i18n VI/EN tren HUD + DOM overlay.
- Chot deploy pipeline GitHub Pages.
### Deliverables
- `docs/release-notes-rebuild.md`

## 5) Danh sach viec can bo/replace tu ban hien tai
- Bo scene ring/particles hien tai lam layer chinh.
- Khong dung canvas 2D lam VFX core.
- Replace bang scene graph 3D dung world units.
- Tach code `scene/cinematic-scene.js` thanh modules:
  - `scene/app.js`
  - `scene/world/*`
  - `scene/render/*`
  - `scene/camera/*`
  - `scene/perf/*`

## 6) Definition of Done cho lan rebuild nay
- Nguoi xem nhin vao phai thay ro: day la mot **3D game-like scene**.
- Co intro cinematic + interactive mode muot.
- Co depth, scale, atmosphere, lighting, postFX ro rang.
- Noi dung portfolio duoc map vao world logic, khong bi "dán UI len background".
- Dat perf target tren desktop trung binh voi quality auto.

## 7) Thu tu uu tien thuc thi de bat dau ngay
1. Phase A (chot visual direction + shot list).
2. Phase B (blockout world).
3. Phase C (lighting/material/postFX).
4. Phase D (camera cinematic/interactivity).
5. Phase E (map content).
6. Phase F (optimization).
7. Phase G (QA/release).

## 8) Trang thai thuc thi (2026-04-25)
- Phase A: Hoan thanh (`docs/art-direction.md`, `docs/shot-list.md`).
- Phase B: Hoan thanh (`scene/world/blockout.js`).
- Phase C: Hoan thanh v2 (`scene/render/pipeline.js`, `scene/materials/palette.js`, `scene/lighting/setup.js`).
- Phase D: Hoan thanh v1 (`scene/camera/cinematic-rig.js`, `scene/camera/interactive-rig.js`).
- Phase E: Hoan thanh v1 (`scene/zones/map.js`, HUD zone mapping in `scene/app.js`).
- Phase F: Hoan thanh v2 (`scene/perf/adaptive-quality.js`, `docs/perf-report-rebuild.md` cap nhat SSAO tiers).
- Phase G: Hoan thanh v2 (`docs/release-notes-rebuild.md` cap nhat, GitHub Pages workflow already available).
