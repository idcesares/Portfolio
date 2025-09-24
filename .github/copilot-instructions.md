# GitHub Copilot Instructions for Portfolio Website

## Architecture Overview

This is a **Portuguese educational technology portfolio** built with Astro 5 in SSR mode, deployed on Vercel. The site combines content collections for blog/work with interactive search and filtering.

### Key Technical Patterns

**Content System**: Two collections (`blog/`, `work/`) with identical schemas (title, description, publishDate, tags, img, img_alt) defined in `src/content.config.ts`. Use `getCollection('blog')` and type as `CollectionEntry<'blog'>`.

**Component Variants**: Components like `PostPreviewEnhanced.astro` and `PortfolioPreviewEnhanced.astro` support `variant?: 'default' | 'compact'` props for different display modes. Use `class:list={['base-class', variant]}` pattern.

**Search Architecture**: `/search-data.json` endpoint (via `src/pages/search-data.json.ts`) generates searchable data consumed by client-side Fuse.js. The endpoint has custom CORS headers and 5-minute caching defined in `vercel.json`.

## Critical Conventions

**File Naming**: 
- Components: PascalCase (e.g., `PostPreview.astro`)
- Pages: kebab-case (e.g., `about.astro`) 
- Content slugs: lowercase-hyphenated
- Dynamic routes: `[...slug].astro` with `getStaticPaths()` and `prerender = true`

**Styling**: Tailwind v4 + HeroUI components + CSS custom properties in global.css. Use `var(--gray-0)`, `var(--shadow-md)`, `var(--gradient-accent-orange)` etc. The `stack` utility class creates vertical layouts with consistent gaps.

**TypeScript Patterns**: Strict config with explicit interfaces. Components use `interface Props { }` pattern. Content collections are fully typed via Zod schemas.

## Content Management

**Frontmatter**: All content requires title, description, publishDate, tags[], img, img_alt?. Date formats auto-coerce to Date objects.

**Images**: Store in `public/assets/blog_imgs/` and reference as `/assets/blog_imgs/filename.ext`. Use `loading="lazy" decoding="async"` for performance.

**MDX Support**: Available via `@astrojs/mdx` with rehype-pretty-code for syntax highlighting. Code blocks use Dracula theme with copy buttons on hover.

## Development Workflow

**Commands**:
- `pnpm dev` - Development server with hot reload
- `pnpm build` - Vercel SSR build to `dist/`
- `pnpm astro check` - TypeScript + content validation

**Performance**: Vercel Analytics enabled, Partytown for GTM, `public/search-fallback.js` cached 24h. Images auto-optimized via Astro's image service.

**Filtering UI**: `FilterBar.astro` with `data-filterable-item` attributes on list items. Client-side JS filters by tags, search terms, and sort options (newest/oldest/alphabetical).

## Integration Points

**External Services**: Google Analytics (via Partytown), Vercel Analytics/Speed Insights, RSS feed at `/rss.xml`, sitemap auto-generated.

**Brazilian Localization**: `lang="pt-br"`, date formatting uses `pt-BR` locale, content is primarily Portuguese with English tech terms.