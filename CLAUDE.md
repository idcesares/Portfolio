# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                  # Dev server at http://localhost:4321
pnpm astro check          # Validate TypeScript + content collection schemas
pnpm build                # SSR build for Vercel (may fail on Windows due to symlink EPERM — ignore if deploying via Vercel Git)
pnpm preview              # Test SSR build locally
pnpm astro check && pnpm build  # Full pre-commit gate
```

Docker alternatives (when local build fails on Windows):
```bash
.\docker.ps1 up     # Start dev (PowerShell)
make check          # Validate (Linux/macOS)
```

Health check endpoints during dev:
- `http://localhost:4321/search-data.json` — search API
- `http://localhost:4321/rss.xml` — RSS feed

## Architecture

**Astro 5 SSR** (`output: 'server'`) deployed on Vercel, but every page uses `export const prerender = true` for static generation at build time. No client-side routing — MPA with Astro prefetch.

### Content Collections (`src/content.config.ts`)

Two collections with identical Zod schemas (`blog` and `work`):
- Required: `title`, `description`, `publishDate`, `updatedDate`, `tags` (string[]), `img` (absolute path like `/assets/blog_imgs/name.webp`)
- Optional: `img_alt`

Content lives in `src/content/blog/` and `src/content/work/` as `.md`/`.mdx` files. All content is in Brazilian Portuguese.

### Routing & Pages (`src/pages/`)

- `index.astro`, `about.astro`, `blog.astro`, `work.astro`, `deals.astro` — static pages
- `blog/[...slug].astro`, `work/[...slug].astro` — dynamic routes with `getStaticPaths()` + `prerender = true`
- `search-data.json.ts` — SSR API endpoint (cached 5 min via `vercel.json`)
- `rss.xml.js` — prerendered RSS feed

### Single Layout

`src/layouts/BaseLayout.astro` wraps everything: Nav, slot, Footer, scroll animations, Google Analytics via Partytown.

### Styling

- **Tailwind v4** via `@tailwindcss/vite` (no PostCSS config needed)
- **HeroUI** for React components (`@heroui/react`)
- CSS custom properties: `var(--gray-0)`, `var(--shadow-md)`, `var(--gradient-accent-orange)`
- Utility class `stack` for consistent vertical gap layouts
- Component variants via `class:list={['base', variant]}` pattern

### Search

Fuse.js client-side search fed by `/search-data.json`. The `FilterBar.astro` component uses `data-filterable-item` attributes for client-side filtering by tags, text, and sort order.

### Animations

CSS-only scroll reveal: add `data-animate="fade-up"` or `data-animate="scale-up"` to elements. Respects `prefers-reduced-motion`.

### SEO

- Constants in `src/utils/seo.ts` (`SITE_TITLE`, `SITE_DESCRIPTION`, structured data helpers)
- `astro-seo` for meta tags
- JSON-LD via `getSiteStructuredData`, `getBlogPostingStructuredData`, `getWorkStructuredData`
- Auto-generated sitemap + RSS

### Image Rules

- Use absolute paths in markdown: `/assets/blog_imgs/name.webp` (not relative `./image.jpg`)
- `loading="lazy" decoding="async"` on all images except hero
- Prefer WebP; keep files under 5 MB in `public/assets/`
- Vercel Image Service enabled; remote domains whitelisted in `astro.config.mjs`

## Code Conventions

- **Components**: `PascalCase.astro` in `src/components/`; always define `interface Props {}`
- **Pages**: `kebab-case.astro`
- **Content slugs**: `lowercase-hyphenated`
- TypeScript strict mode; no `any`
- Fuse.js bundled in its own chunk (`manualChunks: { search: ['fuse.js'] }`)
- Commit messages in English: `feat:`, `fix:`, `docs:`, etc.
