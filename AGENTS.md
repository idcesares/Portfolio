# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/pages/` (route-based pages like `index.astro`, `blog/[...slug].astro`), `src/components/` (reusable `.astro` and TS helpers), `src/layouts/`, `src/styles/global.css`, `src/utils/`.
- Content: `src/content/` collections (`blog/*.md(x)`, `work/*.md(x)`), driven by `src/content.config.ts`.
- Static: `public/` for images, icons, and files served as-is.
- Config: `astro.config.mjs`, `tsconfig.json` (strict), `tailwind.config.cjs`, `vercel.json` (build/deploy & headers).

## Build, Test, and Development Commands
- `pnpm dev` or `pnpm start`: Runs Astro dev server with hot reload.
- `pnpm build`: Builds the site to `dist/` (Vercel adapter, server output).
- `pnpm preview`: Serves the production build locally for QA.
- `pnpm astro check`: Type-checks (TS + Astro) and validates content/frontmatter.

## Coding Style & Naming Conventions
- Indentation: 2 spaces. Use ESM (`type: module`). Keep files small and focused.
- Components: PascalCase for `.astro`/React components (e.g., `PostPreview.astro`).
- Pages & routes: kebab-case (e.g., `about.astro`, `blog/[...slug].astro`).
- Content slugs: lowercase-hyphenated filenames (e.g., `my-post-title.md`).
- TypeScript: strict config; prefer explicit types and named exports.
- Styling: Tailwind v4 utilities; use `@heroui/*` components where appropriate; favor accessible, semantic HTML.

## Testing Guidelines
- No unit test suite at present. Validate via:
  - `pnpm astro check` and `pnpm build` (must succeed).
  - `pnpm preview` to verify routes, layouts, and interactive components.
  - Spot-check `/search-data.json` and `/rss.xml` outputs when content changes.

## Commit & Pull Request Guidelines
- Commits: follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`). Use imperative mood and keep scope clear.
- Branches: `feat/<short-topic>`, `fix/<issue-key>`.
- PRs: include a concise description, linked issues, and before/after screenshots for UI changes. Note any SEO/perf impact (images, metadata). Ensure `pnpm build` passes.

## Security & Configuration Tips
- Never commit secrets. Use Vercel Project Environment Variables for keys.
- Headers/caching: `vercel.json` defines caching for `/search-data.json` and `public/search-fallback.js`; avoid breaking these paths.
- Place large/static assets in `public/` to leverage CDN caching and keep bundles lean.

