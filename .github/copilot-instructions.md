# GitHub Copilot Instructions for Portfolio Website

## Contexto rápido

- Stack: Astro 7 (`output: 'server'`, adapter Vercel), deployed on Vercel. Membrane Palette v2.2 como camada global (`design-system/membrane.css`: fontes, tokens, base e biblioteca de componentes `mp-*`; `membrane.js` para comportamentos) + Tailwind v4 só com o tema da Membrane. Catálogo de componentes em `design-system/components/manifest.json`; spec em `design-system/DESIGN-SYSTEM.md`. Site em português (`lang="pt-BR"`), datas em `pt-BR`.
- Rendering: páginas públicas, feed RSS e índice de busca usam `export const prerender = true`. MPA mode (sem view transitions/ClientRouter) com prefetch nativo do Astro.
- Conteúdo: Collections `blog/` e `work/` com schema idêntico (title, description, publishDate, updatedDate, tags[], img, img_alt?) definido em `src/content.config.ts`. Suporta `.md` e `.mdx`. Use `getCollection('blog' | 'work')` tipado como `CollectionEntry<'blog' | 'work'>`.
- Variantes: Componentes como `PostPreviewEnhanced.astro` e `PortfolioPreviewEnhanced.astro` aceitam `variant?: 'default' | 'compact'` via `class:list={['base-class', variant]}`.
- Busca/filters: Endpoint `/search-data.json` em `src/pages/search-data.json.ts` gera dados para Fuse.js; headers/CORS e cache 5 min também definidos em `vercel.json`. `FilterBar.astro` usa `data-filterable-item` + filtros por tags, termo e sort (newest/oldest/alphabetical).
- URLs: `trailingSlash: 'always'` + `build.format: 'file'` no deploy Vercel para URLs consistentes.
- Security: Headers configurados em `vercel.json` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). Assets `/_astro/*` com cache immutable (1 ano).
- Páginas/rotas: Páginas em kebab-case, incluindo `/dev` para a vitrine de software. Rotas dinâmicas `[...slug].astro` precisam de `getStaticPaths()` e `prerender = true`. Slugs sempre lowercase-hyphenated.
- Animations: Scroll reveal via `data-animate` attributes (`fade-up`, `scale-up`) definidos em `BaseLayout.astro`. Respeita `prefers-reduced-motion`.

## Padrões e guardrails

- TypeScript estrito; sempre declarar `interface Props { }` em componentes. Manter naming PascalCase para componentes. Evitar adicionar deps novas; preferir utilitários existentes.
- Frontmatter obrigatório: `title`, `description`, `publishDate`, `updatedDate` (coerção para Date), `tags[]`, `img`, `img_alt?`. Imagens em `public/assets/blog_imgs/` com caminhos absolutos (`/assets/...`); usar `loading="lazy"` e `decoding="async"` (exceto heróis críticos).
- Styling: componentes `mp-*` da Membrane primeiro (opções `data-*` do manifest, estado por ARIA); CSS próprio só com tokens semânticos, nunca primitivos nem cores cruas. `pnpm check:membrane` valida. Não quebrar identidade visual.
- Markdown: Code highlighting via `rehype-pretty-code` (tema Dracula). Reading time calculado pelo plugin `remark-reading-time` (PT-BR).
- Performance/SEO: Vercel Analytics + Speed Insights ativos. Manter RSS em `/rss.xml` e sitemap automático. Partytown para GTM.

## Fluxo de desenvolvimento

- Comandos principais: `pnpm dev`, `pnpm build`, `pnpm check` (= astro check + build), `pnpm audit`. Usar pnpm sempre. Build local no Windows pode falhar em symlink do `.vercel/output`; ok usar Docker/WSL.
- CI: GitHub Actions roda `astro check` + `pnpm build` em push/PR para `main`.
- Antes de PR: rodar `pnpm check`; builds devem passar. Evitar assets > 5MB; sem segredos no repositório.
