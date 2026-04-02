# GitHub Copilot Instructions for Portfolio Website

## Contexto rápido

- Stack: Astro 6 (`output: 'server'`, adapter Vercel), deployed on Vercel. Tailwind v4 + HeroUI + Membrane Palette design tokens (ex.: `var(--color-neutral-100)`, `var(--shadow-md)`, `var(--gradient-membrane)`). Tokens definidos em `src/styles/design-tokens.css`; spec em `design-system/`. Site em português (`lang="pt-BR"`), datas em `pt-BR`.
- Rendering: páginas públicas, feed RSS e índice de busca usam `export const prerender = true`. MPA mode (sem view transitions/ClientRouter) com prefetch nativo do Astro.
- Conteúdo: Collections `blog/` e `work/` com schema idêntico (title, description, publishDate, updatedDate, tags[], img, img_alt?) definido em `src/content.config.ts`. Suporta `.md` e `.mdx`. Use `getCollection('blog' | 'work')` tipado como `CollectionEntry<'blog' | 'work'>`.
- Variantes: Componentes como `PostPreviewEnhanced.astro` e `PortfolioPreviewEnhanced.astro` aceitam `variant?: 'default' | 'compact'` via `class:list={['base-class', variant]}`.
- Busca/filters: Endpoint `/search-data.json` em `src/pages/search-data.json.ts` gera dados para Fuse.js; headers/CORS e cache 5 min também definidos em `vercel.json`. `FilterBar.astro` usa `data-filterable-item` + filtros por tags, termo e sort (newest/oldest/alphabetical). `public/search-fallback.js` é cacheado por 24h.
- URLs: `trailingSlash: 'ignore'` + `build.format: 'file'` para URLs consistentes.
- Security: Headers configurados em `vercel.json` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). Assets `/_astro/*` com cache immutable (1 ano).
- Páginas/rotas: Páginas em kebab-case, incluindo `/dev` para a vitrine de software. Rotas dinâmicas `[...slug].astro` precisam de `getStaticPaths()` e `prerender = true`. Slugs sempre lowercase-hyphenated.
- Animations: Scroll reveal via `data-animate` attributes (`fade-up`, `scale-up`) definidos em `BaseLayout.astro`. Respeita `prefers-reduced-motion`.

## Padrões e guardrails

- TypeScript estrito; sempre declarar `interface Props { }` em componentes. Manter naming PascalCase para componentes. Evitar adicionar deps novas; preferir utilitários existentes.
- Frontmatter obrigatório: `title`, `description`, `publishDate`, `updatedDate` (coerção para Date), `tags[]`, `img`, `img_alt?`. Imagens em `public/assets/blog_imgs/` com caminhos absolutos (`/assets/...`); usar `loading="lazy"` e `decoding="async"` (exceto heróis críticos).
- Styling: Usar design tokens do Membrane Palette (`var(--color-*)`, `var(--space-*)`, `var(--font-*)`) — nunca hardcodar cores/espaçamentos. Priorizar utilities Tailwind e classes utilitárias (`stack` para colunas com gap). Não quebrar identidade visual.
- Markdown: Code highlighting via `rehype-pretty-code` (tema Dracula). Reading time calculado pelo plugin `remark-reading-time` (PT-BR).
- Performance/SEO: Vercel Analytics + Speed Insights ativos. Manter RSS em `/rss.xml` e sitemap automático. Partytown para GTM.

## Fluxo de desenvolvimento

- Comandos principais: `pnpm dev`, `pnpm build`, `pnpm check` (= astro check + build), `pnpm audit`. Usar pnpm sempre. Build local no Windows pode falhar em symlink do `.vercel/output`; ok usar Docker/WSL.
- CI: GitHub Actions roda `astro check` + `pnpm build` em push/PR para `main`.
- Antes de PR: rodar `pnpm check`; builds devem passar. Evitar assets > 5MB; sem segredos no repositório.
