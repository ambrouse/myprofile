# AI Engineer Portfolio - 3D Cinematic Edition

Portfolio ca nhan phong cach dark tech AI, uu tien tieng Viet, co camera 3D tuong tac realtime va quality scaling de giu trai nghiem muot.

## Features chinh
- 3D cinematic background (Three.js) voi camera rig theo pointer + slide context.
- UI dark tech AI dong bo theo design system (tokens/base/layout/components/motion).
- i18n VI-first (`vi` mac dinh), ho tro `en` va chuyen doi khong reload.
- Quality mode runtime: `auto`, `high`, `medium`, `low`.
- Slide deck transitions toi uu de giam delay input.

## Cau truc project
- `index.html`: layout va structure chinh.
- `script.js`: logic deck, i18n loader, interactions UI, quality control.
- `scene/app.js`: scene runtime chinh (camera, zones, HUD, render loop).
- `scene/world/blockout.js`: world-space blockout geometry.
- `scene/render/pipeline.js`: post-processing pipeline.
- `scene/materials/palette.js`: centralized scene material palette.
- `scene/lighting/setup.js`: centralized scene lighting setup.
- `scene/camera/*`: cinematic + interactive camera rigs.
- `scene/zones/map.js`: zone mapping portfolio vao scene.
- `scene/perf/adaptive-quality.js`: adaptive quality monitor.
- `i18n/vi.json`, `i18n/en.json`: dictionary ngon ngu.
- `styles/`: he thong CSS da tach module.
- `docs/perf-baseline.md`: baseline phase 0.
- `PLAN_3D_CINEMATIC_PORTFOLIO.md`: roadmap chi tiet.

## Chay local
1. Serve static files (khong mo truc tiep bang `file://`).
2. Vi du:

```bash
python -m http.server 8000
```

3. Truy cap `http://localhost:8000`.

## Deploy public nhanh bang GitHub Pages (tu dong)
Project da duoc setup workflow auto deploy:
- File workflow: `.github/workflows/deploy-pages.yml`
- Nhanh gon: moi lan push len nhanh `main` se tu dong public.

### 1) Neu ban chua tao repo GitHub
Chay trong thu muc project:

```bash
git init
git add .
git commit -m "init 3d cinematic portfolio"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

### 2) Bat GitHub Pages trong repo
1. Vao `Settings` -> `Pages`.
2. O muc `Build and deployment`, chon `Source: GitHub Actions`.
3. Save.

### 3) Lay link public
- Sau khi workflow `Deploy GitHub Pages` xanh, site se co link:
- `https://<username>.github.io/<repo>/`

### 4) Moi lan cap nhat
```bash
git add .
git commit -m "update portfolio"
git push
```
GitHub se tu deploy lai ban moi.

## Kiem tra i18n coverage
Chay script de check key i18n:

```bash
node scripts/check-i18n.js
```

## Luu y hieu nang
- Che do `Q: AUTO` se tu dieu chinh quality theo thiet bi va FPS.
- Neu can uu tien FPS tren may yeu, chuyen thu cong sang `Q: LOW`.
- Anh hien tai van co the tiep tuc toi uu them (AVIF/WebP) o buoc asset pipeline.
