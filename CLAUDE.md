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

### Styling — Membrane Palette Design System

The site uses the **Membrane Palette** design system (v1.1). All visual values MUST come from design tokens in `src/styles/design-tokens.css`. The design system spec lives in `design-system/` (read-only reference).

- **Tailwind v4** via `@tailwindcss/vite` (no PostCSS config needed)
- **HeroUI** for React components (`@heroui/react`)
- Utility class `stack` for consistent vertical gap layouts
- Component variants via `class:list={['base', variant]}` pattern

#### Token Rules (non-negotiable)

1. **Never hardcode colors, spacing, font-sizes, font-weights, shadows, radii, z-index, or transitions.** Always use `var(--token-name)` from design-tokens.css.
2. **Never use pure white (`#FFFFFF`) as background or pure black (`#000000`) as text.** Use `var(--color-bg-primary)` (#FAF7F2 cream) and `var(--color-text-primary)` (#1A1B1F charcoal).
3. **60/30/10 color distribution:** 60% canvas/neutrals (Membrane register), 30% accents (Human register: terracotta, amber, burgundy), 10% digital register (teal, steel blue, slate).
4. **Terracotta is the primary action color** (`var(--color-terracotta)`, #B35530). Teal is secondary/nav (`var(--color-teal)`, #2A6F6F).
5. **Typography triad:** Fraunces (serif, headings via `var(--font-serif)`), Instrument Sans (body/UI via `var(--font-sans)`), JetBrains Mono (code via `var(--font-mono)`).
6. **Font weights:** Use `var(--weight-regular/medium/semibold/bold)` — never hardcode 400/500/600/700.
7. **Spacing:** Use `var(--space-1)` through `var(--space-32)` — never hardcode rem/px values in `<style>` blocks.
8. **Transitions:** Use composite tokens `var(--transition-fast/default/slow)` where easing matches `--ease-default`. Use individual `var(--duration-*) var(--ease-*)` when a specific easing is needed (e.g., `--ease-out`).
9. **Shadows:** Only warm-tinted shadows via `var(--shadow-sm/md/lg)` — never `box-shadow` with pure black rgba.
10. **Touch targets:** All interactive elements must have minimum 44×44px (`min-height: 44px; min-width: 44px`).
11. **Focus states:** Use `outline: var(--focus-ring); outline-offset: var(--focus-ring-offset)` on `:focus-visible`.
12. **Dark mode:** Dual strategy — auto via `prefers-color-scheme: dark` media query + manual toggle via `[data-theme="dark"]` attribute and `.theme-dark` class. Always use both selectors: `:root.theme-dark, :root[data-theme="dark"]`.
13. **Reduced motion:** Handled by design-tokens.css. Do not add duplicate `prefers-reduced-motion` blocks; only override for animation-specific properties (e.g., `[data-animate]`).

#### Allowed Exceptions

- Third-party brand colors (e.g., WhatsApp `#25d366`) — add a comment: `/* Brand color — intentionally not from design system */`
- SVG fills inside icon components
- Relative units inside markdown content (`font-size: 0.9em`, `padding: 0.15em 0.4em`) that must scale with parent
- `z-index: 1` for local stacking contexts within a single component
- `line-height: 1` for single-character/icon layout tricks

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

## Brand Voice

All user-facing copy follows `design-system/BRAND-VOICE.md`. Key rules:

- **Voice:** Researcher/Educator/Builder triad. Core metaphor: The Translator / The Membrane.
- **Tone:** Formal-leaning but warm, technical with translation, confident without arrogance.
- **Language:** Content in Brazilian Portuguese. Commit messages and code comments in English.
- **Signature CTA:** "Vamos cocriar?" (or variations like "Vamos cocriar soluções humanas e tecnológicas?")
- **Prohibited words:** disrupt, leverage, synergy, thought leader, guru, ninja, rockstar, hack (as noun), game-changer, paradigm shift, move the needle, circle back, deep dive (as verb), unpack (ideas), low-hanging fruit.
- **Never** use hype language, empty superlatives, or Silicon Valley jargon.
- **Always** trace ideas to their intellectual roots when appropriate (Papert, Vygotsky, constructionism).

## Code Conventions

- **Components**: `PascalCase.astro` in `src/components/`; always define `interface Props {}`
- **Pages**: `kebab-case.astro`
- **Content slugs**: `lowercase-hyphenated`
- TypeScript strict mode; no `any`
- Fuse.js bundled in its own chunk (`manualChunks: { search: ['fuse.js'] }`)
- Commit messages in English: `feat:`, `fix:`, `docs:`, etc.
