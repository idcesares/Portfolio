# Dependency and runtime assessment — 2026-10-10

## Changes

- Standardize on Node 24 LTS (`>=24.0.0 <25`), with `.nvmrc`, CI and both Docker stages aligned. Vercel build output selects `nodejs24.x`.
- Update pnpm from 10.33.0 to 10.34.6, keeping packageManager, Docker and documentation consistent.
- Refresh Astro to 7.3.8, its MDX/Markdown/Node/Vercel integrations, Lucide, sanitize-html, Sharp, Shiki, markdown-it 14 and Playwright.
- Update TypeScript from 5.9.3 to 6.0.3. The installed Astro checker supports TypeScript 5 and 6, but not 7. Explicitly convert `HTMLElement.hidden` to boolean in the menu toggle because the new DOM types include `"until-found"`.
- Refresh GitHub Actions to published Node 24 releases: checkout 7.0.1, setup-node 7.1.0, cache 6.1.0, pnpm/action-setup 6.1.0 and setup-buildx-action 4.4.1.
- Correct outdated Docker setup documentation and the README description of the mandatory security audit gate.

## Security

The original lockfile reported three high advisories and one moderate advisory. The updated lockfile reports zero vulnerabilities without suppressing advisories or changing the audit threshold.

| Affected dependency | Original | Updated |
| --- | --- | --- |
| http-cache-semantics | 4.2.0 | 4.3.0 |
| sharp | 0.35.4 | 0.35.5 |
| source-map-js | 1.2.1 | 1.2.2 |
| smol-toml | 1.8.0 | 1.9.1 |

Existing security overrides remain in place. The cache advisory initially listed no patched version; registry release 4.3.0 is outside the reported affected range and is no longer flagged by pnpm audit.

## Deliberate limits

- Retain pnpm major 10. Migrating to pnpm 12 changes configuration handling and warrants separate verification of overrides and build policy.
- Retain markdown-it major 14 for RSS rendering; it is current within its major and has no reported advisory after refresh. A major 15 migration is not necessary for this maintenance update.
- Defer TypeScript 7 until the Astro checker supports it.
- Keep Node major selectors (`24`, `node:24-alpine`) so LTS patches continue to arrive. Package versions remain reproducible through the frozen lockfile.
- Vercel retains its existing install command; pnpm uses a frozen lockfile by default in CI. Explicit freezing is already required in GitHub Actions and Docker.

## Verification

- Frozen pnpm install passed on Node 24.19.0 / pnpm 10.34.6.
- Astro check: 61 files, zero errors/warnings/hints; content asset checks passed.
- Vercel production build passed and emitted Node 24 runtime metadata.
- Production Docker image built successfully on Node 24 Alpine; Compose configurations validated.
- `pnpm audit:full` reports zero vulnerabilities.

Local builds require `NODE_USE_ENV_PROXY=1` for font downloads in this managed environment. The initial browser run had a transient Vite module-load error during concurrent verification; the search regression passed when rerun in isolation. The final full browser run passed all 17 tests. The production container smoke check passed for routes, search data, RSS, sitemap, 404 handling and optimized local images. An independent review found no important issues.
