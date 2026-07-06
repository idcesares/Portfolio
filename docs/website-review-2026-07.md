# Revisão do site: estado em julho de 2026

Este documento substitui a revisão original de julho, que listava bugs, SEO, GEO e saúde de código. A maior parte daquela lista já foi executada. O que segue é o retrato atual: o que foi resolvido, o que foi decidido diferente da recomendação original, e o que permanece aberto.

---

## 1. Resolvido

**Bugs (seção 1 da revisão original), todos corrigidos:**

- OG image padrão agora é `/assets/portrait.webp`, arquivo real servido de `public/`.
- Imagens do post `website-pessoal-astro` apontam para os `.webp` corretos.
- Canonical usa apenas `Astro.url.pathname`, sem query string.
- RSS mapeia campos explicitamente: `categories` a partir das tags, `<language>pt-BR</language>` no canal, `atom:updated` por item.
- Foto da página Sobre com `width`/`height` numéricos.
- Tags de frontmatter limpas (sem nomes de arquivo como tag).

**SEO e GEO (seções 2 e 3):**

- Template de título centralizado no `MainHead` (`{title} | Isaac D'Césares`).
- Hierarquia de headings da home corrigida (`h2` nas seções).
- Nó `Person` com `@id` estável, referenciado por todos os outros nós; `sameAs` com LinkedIn, GitHub, YouTube e Twitter/X.
- Sitemap com `lastmod` via `serialize` no config.
- `theme-color` para light e dark no head.
- `/llms.txt` e `/llms-full.txt` gerados como rotas Astro a partir das collections; nunca mais desatualizam à mão.
- `robots.txt` com os user-agents atuais (ClaudeBot, Claude-User, Claude-SearchBot, OAI-SearchBot, PerplexityBot etc.).

**Código e arquitetura (seção 5):**

- Stack React/HeroUI removida por completo (dependências, config do Tailwind, `HeroCode.tsx`). O site é Astro puro com pouco JS, como declarado.
- Componentes mortos e famílias duplicadas consolidados: só as versões `Enhanced` existem, com prop `variant`.
- Assets órfãos (`stock-*.jpg`) removidos.
- Tokens unificados: `src/styles/design-tokens.css` deixou de existir. A fonte única é `design-system/tokens/design-tokens.css` (v2.0.0, gerado do `membrane.tokens.json` no repo de marca), com camada base em `design-system/tokens/base.css`. Cores em OKLCH, theming por `light-dark()`, tints por `color-mix()`.
- Retrato da home no pipeline de imagens (`<Image>` com import de `src/assets/`).
- Persistência de tema só no clique do toggle (o `MutationObserver` saiu).
- Schema das collections com `updatedDate` opcional (fallback para `publishDate`) e `draft` com default `false`.

**Governança (seção 6):**

- `CLAUDE.md`, `AGENTS.md` e `copilot-instructions.md` atualizados para a realidade pós-playbook e pós-migração (Astro 7, sem HeroUI, tokens no `design-system/`).

**Plataforma:**

- Astro 7 com adapter Vercel 11, Tailwind 4 via `@tailwindcss/vite`, fonts self-hosted pela Fonts API (Fraunces, Instrument Sans, JetBrains Mono), `trailingSlash: 'always'` com redirect 308 para a variante sem barra.

## 2. Decidido diferente da recomendação original

- **Barra final:** a revisão sugeria `trailingSlash: 'never'`; o site adotou `'always'`, com canonical e links internos unificados nesse formato. O problema de conteúdo duplicado está igualmente resolvido; não reabrir.
- **OG image:** a revisão pedia uma arte dedicada 1200×630; o retrato resolve o caso base. Uma arte OG com identidade Membrane continua sendo um upgrade possível, mas deixou de ser bug.

## 3. Aberto

Em ordem de retorno sobre esforço:

1. **Capas de conteúdo fora do pipeline de imagens.** O campo `img` do schema ainda é string apontando para `public/`. Migrar para o helper `image()` do `astro:content` colocaria todas as capas no Sharp (AVIF/WebP, dimensões automáticas, sem CLS). É a maior alavanca de performance restante.
2. **Três camadas de analytics.** GA4 (via Partytown), Vercel Web Analytics e Speed Insights rodam juntos. GA4 usa cookies sem aviso de consentimento (LGPD, audiência majoritariamente brasileira). Decisão do Isaac: se o Vercel Analytics atende, remover GA4 e Partytown simplifica o site e elimina a questão; se GA4 fica, considerar consent banner.
3. **`/tech-signal/` é página órfã.** Não aparece em Nav, Footer nem em nenhuma outra página (`/deals/` já está no Footer como "Indico e uso"). Decidir: linkar ou manter como página de link direto, e refletir a decisão no llms.txt.
4. **`search-fallback.js` + evento customizado.** Funciona, mas o init do SearchBox como módulo normal do Astro eliminaria o arquivo em `public/` e o header de cache dedicado no `vercel.json`.
5. **`apple-touch-icon` ausente.** Só existe o favicon SVG.
6. **Retrofit editorial de voz nos posts de 2024.** Travessões longos e vocabulário vetado pelo BRAND-VOICE.md ainda aparecem em textos antigos de `content/`. Passada editorial com o Isaac (Claude edita, não substitui a voz).

## 4. Internacionalização (plano mantido)

O plano de i18n da revisão original continua válido e não foi iniciado: inglês como segundo locale via i18n nativo do Astro (`/en/`, português na raiz, zero mudança de URL existente), em três fases: fundação (dicionários de UI, `lang` dinâmico, `seo.ts` por locale), páginas institucionais em inglês (Home, About, Dev, Contact, com hreflang e sitemap i18n, absorvendo `/tech-signal/` como `/en/tech-signal/`), e conteúdo seletivo (campos `lang` e `translationKey` no schema, tradução sob demanda dos conteúdos com apelo internacional).

O que não fazer segue igual: subdomínio separado, tradução automática em massa, ou traduzir antes de fechar os itens abertos da seção 3.
