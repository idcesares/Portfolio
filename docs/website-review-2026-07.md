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

## 3. Resolvido (segunda passada)

- **Capas de conteúdo no pipeline de imagens.** `img` no schema das collections agora é `z.union([image(), z.url()])`: capas locais (19 arquivos movidos de `public/assets/blog_imgs/` para `src/assets/covers/`) passam pelo Sharp de verdade (srcset, AVIF/WebP, sem CLS); capas remotas (thumbnails do YouTube, Spotify, GitHub) seguem como string. `seo.ts` ganhou `resolveImageSrc()` para desembrulhar os dois casos nos metadados OG e no structured data.
- **Consent banner para o GA4.** Os scripts do GA4 saíram do `<head>` incondicional do `BaseLayout`. Um componente `CookieConsent` (mesmo padrão do `ThemeToggle`, custom element + localStorage) mostra um card discreto no canto inferior após a página assentar; só injeta o script do GA4 (via Partytown) se o visitante aceitar, e a recusa é lembrada sem nenhuma requisição a `googletagmanager.com`. Vercel Web Analytics e Speed Insights não usam cookies, então ficam de fora do gate.
- **`/tech-signal/` confirmada como órfã intencional.** Não é um bug: é uma página de referência pessoal do Isaac (agregador de fontes de tech news), propositalmente fora do Nav/Footer. Já é descoberta via `/dev` (listada como projeto). llms.txt e llms-full.txt não a citam como navegação essencial. Desde agosto de 2026 ela tem links de volta para `/dev/` no cabeçalho e no rodapé, para quem cai ali pela busca não encontrar um beco sem saída.
- **`search-fallback.js` removido.** O script do `SearchBox` já rodava como módulo Astro (deferred por natureza), então as três camadas de fallback e o arquivo separado em `public/` eram redundantes. Init colapsado para uma única chamada direta; o listener de `searchOverlayOpened` (warmup do Fuse.js antes do primeiro clique) continua.
- **`apple-touch-icon` adicionado.** PNG 180×180 gerado a partir do `favicon.svg` via Sharp, linkado no `MainHead`.
- **Busca global e navegação acessíveis por teclado.** O overlay agora expõe semântica de diálogo modal, recebe e contém o foco, fecha com `Esc`, devolve o foco ao gatilho e bloqueia o scroll de fundo. Campo, controles e regiões têm nomes em português; leitores de tela recebem a contagem de resultados. Links de Blog e Trabalhos também mantêm `aria-current="page"` nas rotas internas.

## 4. Aberto

- **Feeds ausentes na curadoria do Tech Signal.** 14 das 69 fontes não entram no `/tech-signal.opml` porque não publicam feed utilizável: Reuters e Anthropic não expõem RSS público, o Banco Central serve JSON, o único feed do Hugging Face Daily Papers é espelho de terceiro, o do ITS Rio responde vazio, e os do gov.br (CADE, MCTI) são listagem de pasta do Plone com metade dos itens sendo arquivo de imagem. Vale reconferir a cada revisão da curadoria: se algum passar a publicar feed limpo, é só preencher o campo `feed` em `src/data/tech-signal-sources.ts`.

- **Retrofit editorial de voz nos posts de 2024.** Travessões longos e vocabulário vetado pelo BRAND-VOICE.md ainda aparecem em textos antigos de `content/`. Passada editorial com o Isaac (Claude edita, não substitui a voz).

## 4. Internacionalização (plano mantido)

O plano de i18n da revisão original continua válido e não foi iniciado: inglês como segundo locale via i18n nativo do Astro (`/en/`, português na raiz, zero mudança de URL existente), em três fases: fundação (dicionários de UI, `lang` dinâmico, `seo.ts` por locale), páginas institucionais em inglês (Home, About, Dev, Contact, com hreflang e sitemap i18n, absorvendo `/tech-signal/` como `/en/tech-signal/`), e conteúdo seletivo (campos `lang` e `translationKey` no schema, tradução sob demanda dos conteúdos com apelo internacional).

A `/tech-signal/` deixou de ser a exceção em inglês na raiz: em agosto de 2026 foi traduzida para português e passou a declarar `pt-BR`, o que a alinha ao plano em vez de contrariá-lo. Se a fase 2 acontecer, ela ganha uma gêmea em `/en/tech-signal/` com hreflang recíproco, sem mexer na URL atual nem quebrar link existente.

O que não fazer segue igual: subdomínio separado, tradução automática em massa, ou traduzir antes de fechar os itens abertos da seção 4.
