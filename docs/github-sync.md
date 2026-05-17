# GitHub Repository Sync

Updated: 2026-05-17

## Purpose

The portfolio project page is generated from public repositories owned by:

- `ambrouse`
- `baolnq-ai`

## Flow

1. `npm run sync:github` calls the GitHub REST API for each owner.
2. The script normalizes repository metadata.
3. The script enriches presentation metadata: `category`, `keywords` and deterministic local `banner` style.
4. Curated corrections from `src/content/projects.overrides.json` improve weak public repo titles, descriptions and summaries.
5. The output is written to `public/data/github-repos.json`.
6. The React app reads that static JSON at runtime.
7. GitHub Pages serves the built static site.

## Security

- The browser never receives a GitHub token.
- `GITHUB_TOKEN` is used only in GitHub Actions during build when available.
- Public API mode works locally without secrets.
- No token or private value is written to logs or generated JSON.

## Refresh behavior

The deploy workflow runs on push, manual dispatch and a daily schedule. Each run rebuilds the static JSON so new public repositories can appear without changing frontend code.
