# Dependency and Runtime Refresh Implementation Plan

**Goal:** Refresh supported portfolio dependencies and align the runtime without changing the site design.

**Architecture:** Keep Astro 7 and pnpm 10; use Node 24 LTS consistently in local development, CI and Docker. Update TypeScript to the latest major supported by @astrojs/check.

## Tasks
- [x] Assess package releases, peer compatibility, runtime configuration and baseline advisories.
- [x] Update package.json and pnpm-lock.yaml; align .nvmrc, Dockerfile, CI and setup documentation.
- [x] Verify frozen installation, type/content checks, asset checks, Vercel build, Node preview and browser regressions.
- [x] Record remaining advisories and deferred major migrations in a dependency assessment.

## Constraints and review focus
- Preserve rendering, RSS, search, analytics consent and styling behavior.
- Keep pnpm overrides and audit gates; do not suppress unresolved advisories.
- Retain markdown-it 14 until a separate major migration is justified; TypeScript 7 is outside the checker peer range.
- Node 24 is the supported LTS line for this refresh; pnpm remains in supported major 10.
