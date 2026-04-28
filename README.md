# AI Engineer Portfolio - 3D Cinematic Edition

<p align="center">
  <img src="./profile_2.png" width="88" alt="AI Engineer Portfolio logo" />
</p>

<h3 align="center">Nguyen Le Quoc Bao - AI Engineer Portfolio</h3>

<p align="center">
  Mot portfolio 3D cinematic cho AI Engineer, ke cau chuyen nang luc qua slide deck, portrait, realtime WebGL scene va dark/light experience.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Three.js-0.172-000000?style=flat-square&logo=three.js" alt="Three.js" />
  <img src="https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=flat-square&logo=javascript&logoColor=000000" alt="JavaScript" />
  <img src="https://img.shields.io/badge/CSS-Responsive%20UI-1572B6?style=flat-square&logo=css3" alt="CSS" />
  <img src="https://img.shields.io/badge/i18n-VI%20%2F%20EN-2F7CFF?style=flat-square" alt="i18n VI EN" />
  <img src="https://img.shields.io/badge/Runtime-Static%20Site-8BF3DC?style=flat-square" alt="Static Site" />
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> |
  <a href="#experience">Experience</a> |
  <a href="#output-journey">Output Journey</a> |
  <a href="#runtime-proof">Runtime Proof</a> |
  <a href="#docs">Docs</a> |
  <a href="#roadmap">Roadmap</a>
</p>

## Why It Exists

This portfolio is built to make the first 5 seconds clear: who I am, what kind of AI engineering work I own, and why the work is production-oriented.

It is not a plain CV page. It is a compact interactive story for system architecture, RAG/LLM pipelines, Edge AI ownership, observability and product-ready engineering taste.

## Quick Start

Run the portfolio locally with one command:

```bash
./setup.sh 8000
```

Then open:

```text
http://localhost:8000
```

`setup.sh` checks for a working Python runtime first, skips broken Windows Microsoft Store Python aliases, and falls back to Node.js when available.

## Experience

| What visitors see | Why it matters |
| --- | --- |
| Cinematic 3D photo shards | Creates an AI/tech atmosphere without turning the page into a generic landing page. |
| Slide deck portfolio flow | Guides attention through intro, capability, projects and contact in a controlled story. |
| Dark/light mode with 3D transition | Shows design polish while keeping both visual modes usable. |
| Portrait-integrated intro/contact | Humanizes the technical profile without feeling pasted onto the UI. |
| VI-first i18n with EN toggle | Keeps the default audience local while staying readable for international viewers. |
| Mobile-safe layout | Uses small viewport calculations so browser search/address bars do not cover content. |

## Output Journey

```text
Open site
  -> Loading bar
  -> 3D cinematic scene
  -> Intro identity card
  -> Capability slide
  -> RAG Chatbot leadership case
  -> Edge AI leadership case
  -> Contact slide
```

Core interaction flow:

```text
Navigate -> Read -> Switch theme -> Switch language -> Inspect projects -> Contact
```

## Highlights

- Realtime Three.js scene with camera motion, floating image shards and adaptive visual tone.
- Modular CSS system split into tokens, base, layout, components and motion.
- Dark/light theme with cinematic portal-style transition.
- Slide transition redesigned around aperture/ring motion instead of a generic sweep.
- Portrait assets: `profile.png` for intro and `profile_2.png` for contact.
- Static deployment-friendly architecture for GitHub Pages.

## Project Structure

```text
.
|-- index.html                 # Main HTML structure
|-- script.js                  # Slide deck, i18n, theme and UI interactions
|-- setup.sh                   # One-command local static server
|-- styles/                    # CSS tokens, layout, components and motion
|-- scene/                     # Three.js runtime and 3D scene modules
|-- i18n/                      # vi/en translation dictionaries
|-- scripts/check-i18n.js      # Translation coverage validator
|-- docs/                      # Reports, checklist and design notes
|-- story/                     # Image manifest and story visual assets
|-- profile.png                # Intro portrait
|-- profile_2.png              # Contact portrait
```

## Runtime Proof

Validated on local static runtime:

```bash
node --check script.js
node --check scene/app.js
node scripts/check-i18n.js
```

Recent visual/runtime checks also covered:

- Desktop viewport: `1440x900`
- Mobile viewport: `390x760`
- Dark/light switching
- Slide navigation
- Contact and intro portrait rendering
- Mobile bottom-controls clearance for browser UI bars

## Deploy

The repo includes GitHub Pages workflow support:

```text
.github/workflows/deploy-pages.yml
```

Recommended deploy flow:

```bash
git add .
git commit -m "update portfolio"
git push
```

In GitHub:

```text
Settings -> Pages -> Build and deployment -> Source: GitHub Actions
```

## Docs

- `PLAN_3D_CINEMATIC_PORTFOLIO.md` - original phase plan.
- `PLAN_REBUILD_3D_GAME_SCENE.md` - 3D scene rebuild direction.
- `docs/perf-baseline.md` - performance baseline and risk hotspots.
- `docs/perf-report-rebuild.md` - scene rebuild performance notes.
- `docs/phase-completion-report.md` - completed phase summary.
- `docs/release-checklist.md` - visual, motion, i18n and release QA checklist.
- `docs/art-direction.md` - visual direction.
- `docs/shot-list.md` - scene/visual shot planning.

README focuses on what and why. The docs folder holds how and verification detail.

## Roadmap

| Phase | Goal | Status |
| --- | --- | --- |
| Phase 1 | Stabilize cinematic portfolio, portrait integration and theme/slide motion. | Active |
| Phase 2 | Optimize image assets into WebP/AVIF and tune mobile GPU budgets. | Planned |
| Phase 3 | Add public demo polish: richer snapshots, analytics-safe telemetry and final release QA. | Planned |

## Version Status

```text
Version: v1 cinematic portfolio
Maturity: interactive static site, actively polished
Default language: Vietnamese
Supported language: English
Runtime: browser static server
```

## License

No explicit license file is currently included. Until a `LICENSE` file is added, all rights are reserved by the project owner.

