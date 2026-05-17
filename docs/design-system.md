# Design System Notes

Updated: 2026-05-17

## Direction

The portfolio now follows an academic dossier direction: restrained, professional, compact and evidence-oriented. It should feel like a personal technical hồ sơ rather than a marketing landing page or a playful technology demo.

## Visual system

- Light mode uses paper/off-white surfaces, deep ink text, muted academic blue-green accents and thin rules.
- Dark mode uses deep navy/charcoal, warm text and subdued accents; it avoids neon glow and playful gradients.
- The background uses a subtle checker/grid layer with faint animated color traces that move along the grid without dominating the page.
- Borders, metadata rows and compact cards carry the visual hierarchy more than large images.
- Portrait and case-study imagery is intentionally smaller so the dossier content remains primary.

## Identity

- The personal mark is a formal `NB` monogram/seal with deep ink, paper fill and a brass rule.
- The same formal language is used across favicon and social preview artwork.
- The brand should remain serious and legible at small sizes.

## Typography

- Georgia-style serif headings give the dossier a scholarly tone.
- Inter/system sans-serif supports navigation, metadata, labels and dense repository cards.
- Labels use uppercase letter spacing for catalogue notation, not decoration.

## Layout

- Home is structured as a dossier cover, preface, fields of study, selected records and repository archive invitation.
- The profile image is a compact identity photo inside a metadata card.
- Capabilities use numbered field cards.
- Case studies use compact diagrammatic SVG banners and report-style content.
- Projects use dense repository dossier cards with banner, category, facts, keywords and source links.

## Repository cards

- GitHub sync enriches repositories with `category`, `keywords` and `banner` presentation metadata.
- Banners are deterministic local visual treatments inferred from repo metadata, not untrusted external images.
- Important repos can be improved through `src/content/projects.overrides.json` for title, description and summary quality.
- Cards should avoid overclaiming; if metadata is weak, use neutral archive language.

## Motion

- Route changes, language switching and theme switching use short fade/translate motion.
- Theme and locale toggles add temporary document classes so CSS can animate surface, text and card state.
- `prefers-reduced-motion` disables animation-heavy behavior.

## Accessibility

- Navigation uses semantic links and labels.
- Fixed navigation remains available during scroll.
- Section anchors use scroll offset so hash links do not hide headings under the navbar.
- Theme and language controls remain keyboard-accessible buttons.
- Repository links are visible text links and do not rely on color alone.
