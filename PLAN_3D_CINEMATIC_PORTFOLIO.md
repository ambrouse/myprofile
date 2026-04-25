# PLAN 3D CINEMATIC PORTFOLIO (Dark Tech AI, VI-first i18n)

## 1) Muc tieu tong the
- Xay dung portfolio 3D cinematic hien dai, dep, phong cach tech AI, tone toi (dark-first).
- Toan bo thanh phan UI (tu button, tag `p`, heading, card, nav, dot, counter, form) phai dong nhat design language.
- Ho tro da ngon ngu, uu tien tieng Viet (`vi`) lam ngon ngu mac dinh, co the chuyen doi `en` khong reload.
- Toi uu code va rendering de do tre thao tac thap nhat co the trong dieu kien web runtime.

## 2) KPI ky thuat bat buoc
- FPS muc tieu:
  - Desktop man hinh 60Hz: duoi 16.7ms/frame, on dinh 60fps.
  - Desktop man hinh 120Hz: duoi 8.3ms/frame o quality mode phu hop.
- Input latency cam nhan:
  - Tu pointer/keyboard den khung hinh dau tien: muc tieu <= 1 frame.
- Long task:
  - Khong de xuat hien long task > 50ms trong tuong tac thong thuong.
- Tai nguyen:
  - Anh hero/section chuyen sang AVIF/WebP (co fallback), giam dung luong dang ke.
  - Script chia module, khong de 1 file phinh to khong kiem soat.
- i18n:
  - 100% text co key dictionary.
  - `vi` full coverage truoc, `en` theo sau.

## 3) Nguyen tac thiet ke (Design System)
- Visual DNA:
  - Dark gradient background + subtle grid + volumetric light nhe.
  - Mau nhan tech AI: xanh dien + cyan + accent tim co kiem soat (khong loe).
  - Glass/panel dung muc vua phai, uu tien do net va contrast doc de cao.
- Typography:
  - He thong cap bac ro rang cho `h1/h2/h3/p/caption/meta`.
  - Tracking, line-height, weight va rhythm dong nhat theo token.
- Component-level rules:
  - `button`: co 3 state ro rang `default/hover/active/focus-visible`, animation ngan, phan hoi nhanh.
  - `p`: mau text, line-height, max width, spacing chuan de doc lau khong met.
  - `card`: radius, border, noise/light overlay, shadow theo token.
  - `nav/dot/counter`: cung visual language, khong lech style.
- Motion language:
  - Transition co "cinematic inertia" nhung phai phan hoi nhanh.
  - Easing thong nhat, tranh animate thua.
  - Co `prefers-reduced-motion` fallback day du.

## 4) Kien truc ky thuat de dat do tre thap
- Tach 3 lop:
  - Lop Content UI (DOM/CSS): text, thong tin, CTA.
  - Lop 3D Scene (WebGL): background/foreground cinematic, camera, VFX.
  - Lop Interaction Engine: gom pointer, keyboard, scroll state vao mot scheduler.
- Render strategy:
  - Mot render loop chinh (`requestAnimationFrame`) cho toan bo scene.
  - Event input duoc coalesce, cap nhat state truoc khi render frame.
  - Dynamic quality scaling theo thiet bi (DPR cap, particle cap, postFX cap).
- Asset strategy:
  - Texture atlas khi phu hop, preload theo section.
  - Lazy-load co uu tien (hero truoc, section sau).
  - Tranh decode tai thoi diem dang transition.

## 5) Ke hoach theo phase

## Phase 0 - Audit va baseline (1-2 ngay)
### Muc tieu
- Co so lieu baseline FPS/CPU/GPU/input latency de so sanh truoc-sau.
### Cong viec
- Profiling hien trang bang Chrome Performance + Performance Insights.
- Lap bang "hotspots" (loop O(n^2), filter nang, animation xung dot).
- Dinh nghia performance budget cho tung route/slide.
### Deliverables
- `docs/perf-baseline.md` (so lieu + screenshot profile).
- Danh sach issue uu tien cao/co the tri hoan.
### Exit criteria
- Co baseline ro rang, co budget duoc thong nhat.

## Phase 1 - Foundation UI/Design System (2-4 ngay)
### Muc tieu
- Dong bo giao dien dark tech AI, hien dai, dep, nhat quan 100% component.
### Cong viec
- Tao token he thong:
  - Mau, spacing, radius, shadow, glow, typography, motion duration/easing.
- Refactor CSS:
  - Chuyen style ve naming ro rang (BEM hoac utility co quy uoc).
  - Tach file `tokens`, `base`, `components`, `layout`, `utilities`.
- Chuan hoa tung component:
  - Button, paragraph, heading, card, nav, dots, counter, chip, badge.
- Accessibility:
  - Contrast, focus-visible, tab order, aria labels.
### Deliverables
- `style_` duoc tach module ro rang.
- Checklist component pass design QA.
### Exit criteria
- Toan bo UI cung visual language, khong "lech tông" component.

## Phase 2 - i18n full coverage (1-2 ngay)
### Muc tieu
- VI-first i18n 100% text dynamic/static.
### Cong viec
- Audit tat ca text hard-coded trong HTML/JS.
- Chuyen text sang dictionary key (`vi` day du, `en` day du).
- Them validation script check key thieu.
- Dam bao font fallback va diacritics tieng Viet hien thi dung.
### Deliverables
- File dictionary tach rieng (`i18n/vi.json`, `i18n/en.json` hoac tuong duong).
- Script check coverage i18n.
### Exit criteria
- Chuyen ngon ngu khong mat layout, khong text vo nghia, khong key missing.

## Phase 3 - 3D Cinematic Engine (4-7 ngay)
### Muc tieu
- Hoan tat scene 3D camera dong realtime, visual cinematic.
### Cong viec
- Tich hop WebGL stack (khuyen nghi: Three.js + custom shader nhe).
- Dung camera rig:
  - Pointer parallax, scroll influence, spring damping.
- Tao cinematic layers:
  - Background volumetric haze.
  - Particle field (GPU-friendly, tranh O(n^2) CPU).
  - Light sweep/scanline tinh te.
- Dong bo slide transition voi camera timeline.
### Deliverables
- Module `scene/` ro rang: `renderer`, `cameraRig`, `effects`, `quality`.
- Ban scene co interactive camera that su.
### Exit criteria
- Tuong tac mượt, khong giat ro tren desktop tam trung tro len.

## Phase 4 - Performance hardening (3-5 ngay)
### Muc tieu
- Giam do tre toi da, on dinh FPS trong nhieu dieu kien.
### Cong viec
- Hop nhat event loop, bo render/update trung lap.
- Thay cac effect CSS nang bang shader/compositor-friendly effect khi can.
- Adaptive quality:
  - Auto giam quality khi FPS drop.
  - Auto tang lai khi on dinh.
- Toi uu assets:
  - AVIF/WebP + responsive sizes + preload hints dung muc.
- Giam garbage collection:
  - Tranh tao object moi moi frame.
### Deliverables
- Bang benchmark truoc/sau.
- Cau hinh quality tiers (`high/medium/low/auto`).
### Exit criteria
- Dat budget frame time da dat ra o KPI.

## Phase 5 - Polish, QA, release (2-3 ngay)
### Muc tieu
- Chot ban release dep, on dinh, de bao tri.
### Cong viec
- Cross-browser test (Chrome/Edge/Firefox/Safari neu co).
- Mobile/tablet adaptation va fallback motion.
- QA visual pixel-level cho tung section.
- Viet tai lieu van hanh:
  - Cach them section moi.
  - Cach them key i18n moi.
  - Cach tune quality cho thiet bi yeu.
### Deliverables
- `README.md` cap nhat theo kien truc moi.
- Checklist release + bug list da xu ly.
### Exit criteria
- Ban release dat chuan visual + hieu nang + i18n.

## 6) Checklist toi uu cap component (bat buoc)
- `button`
  - Kich thuoc hit-area >= 40px.
  - Transition <= 180ms, khong lag.
  - Co focus ring ro rang.
- `p`
  - Line-height doc de (1.55-1.75), width toi da de tranh met mat.
  - Contrast dat chuan.
- `card`
  - Khong dung qua nhieu blur/filter trong cung mot viewport.
  - Animation vao/ra dung transform + opacity.
- `image`
  - Dung format nen, lazy-load dung cho noi dung ngoai viewport.
  - Co kich thuoc ro rang de tranh layout shift.

## 7) Risk va giam thieu
- Risk: Qua nhieu VFX dan den drop FPS.
  - Giam thieu: Quality tiers + toggle auto.
- Risk: Scene dep tren may manh nhung do vo tren may yeu.
  - Giam thieu: Progressive enhancement + fallback 2D.
- Risk: i18n lam vo layout.
  - Giam thieu: test snapshot cho `vi/en` tren moi section.

## 8) Definition of Done (DoD)
- Thiet ke dark tech AI dong bo 100% tren moi thanh phan UI.
- Camera 3D dong realtime, interaction muot, khong co giat thay ro.
- VI-first i18n hoan chinh, EN day du.
- Dat hoac vuot KPI hieu nang da de ra.
- Code co cau truc ro rang, de maintain, de scale them section moi.

## 9) Trang thai trien khai (2026-04-25)
- Phase 0: Hoan thanh (co `docs/perf-baseline.md`).
- Phase 1: Hoan thanh phien ban foundation (CSS da tach module + standards).
- Phase 2: Hoan thanh (i18n tach `i18n/vi.json`, `i18n/en.json`, co script `scripts/check-i18n.js`).
- Phase 3: Hoan thanh phien ban 1 (3D cinematic scene + camera rig realtime + slide sync).
- Phase 4: Hoan thanh phien ban 1 (quality modes + auto adaptive theo FPS/device).
- Phase 5: Hoan thanh phan tai lieu/chuan bi release (`README.md`, `docs/release-checklist.md`).
