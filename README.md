# Portfolio Isaac D'Césares

Portfólio profissional, blog técnico e vitrine de projetos de Isaac D'Césares, pesquisador, educador e coordenador de tecnologia educacional. O site reúne produção autoral sobre IA, educação, segurança digital e desenvolvimento, com foco em performance, acessibilidade e uma identidade visual própria baseada no design system Membrane Palette.

[![Website](https://img.shields.io/badge/Website-dcesares.dev-blue?style=for-the-badge)](https://dcesares.dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-isaacdcesares-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/isaacdcesares)
[![GitHub](https://img.shields.io/badge/GitHub-idcesares-181717?style=for-the-badge&logo=github)](https://github.com/idcesares)

## Visão Geral

O projeto está atualmente em **Astro 6** com `output: 'server'`, deploy na **Vercel** e páginas públicas prerenderizadas no build. A navegação é MPA, com prefetch nativo do Astro e superfícies interativas pontuais para filtros, busca, toggle de visualização, troca de tema e cards com microinterações.

Além do conteúdo editorial, o repositório também documenta:

- um fluxo Docker completo para desenvolvimento machine-agnostic;
- um design system próprio em `design-system/`;
- instruções para agentes e copilots alinhadas com a arquitetura atual;
- pipelines de validação com `astro check`, build e auditoria de dependências.

## Estado Atual do Repositório

No snapshot atual do projeto, o site expõe:

- página inicial em `/`;
- páginas estáticas em `/about`, `/blog`, `/work`, `/dev` e `/deals`;
- rotas dinâmicas em `/blog/[...slug]` e `/work/[...slug]`;
- feed RSS em `/rss.xml`;
- índice de busca em `/search-data.json`.

Conteúdo incluído hoje no repositório:

- **12 posts** em `src/content/blog/`;
- **18 entries** em `src/content/work/`;
- **2 projetos de desenvolvimento** em `src/data/dev-projects.ts`.

Principais entregas já implementadas:

- listagens de blog e work com filtros por tags, busca textual, ordenação e toggle de visualização;
- página `/dev` dedicada a projetos de software e design system;
- Membrane Palette aplicado em toda a interface;
- animações CSS com scroll reveal e respeito a `prefers-reduced-motion`;
- SEO com `astro-seo`, sitemap, JSON-LD e RSS;
- analytics e speed insights via Vercel;
- fallback estático para busca em `public/search-fallback.js`.

## Stack Atual

### Core

- **Astro 6.1**
- **React 19**
- **TypeScript strict**
- **Tailwind CSS v4**
- **HeroUI**

### Conteúdo e rendering

- **Astro Content Collections** com schema Zod
- **MDX** para conteúdo enriquecido
- **rehype-pretty-code** + botão de cópia
- **remark-reading-time** customizado em PT-BR

### Busca, SEO e observabilidade

- **Fuse.js** para busca client-side
- **astro-seo**
- **@astrojs/rss**
- **@astrojs/sitemap**
- **@astrojs/partytown**
- **@vercel/analytics**
- **@vercel/speed-insights**

### Infraestrutura

- **Vercel adapter**
- **Docker / Docker Compose**
- **GitHub Actions**

## Arquitetura

### Rendering e navegação

- `output: 'server'` para preservar integrações da Vercel, image service e analytics.
- Páginas e endpoints públicos usam `export const prerender = true`.
- `prefetchAll: true` com `defaultStrategy: 'viewport'`.
- `trailingSlash: 'ignore'` + `build.format: 'file'` para URLs consistentes.

### Conteúdo

As collections `blog` e `work` vivem em `src/content/` e compartilham o mesmo schema:

```ts
title: string
description: string
publishDate: Date
updatedDate: Date
tags: string[]
img: string
img_alt?: string
```

Formatos suportados:

- `.md`
- `.mdx`

### Busca e filtragem

O endpoint [`src/pages/search-data.json.ts`](./src/pages/search-data.json.ts) gera um JSON com dados consolidados de `blog` e `work`, incluindo:

- título;
- descrição;
- conteúdo sanitizado para indexação;
- tags;
- tipo (`blog` ou `work`);
- datas;
- URL pública.

Esse índice alimenta a experiência client-side com Fuse.js e é entregue com cache de 5 minutos, CORS aberto e fallback estático em [`public/search-fallback.js`](./public/search-fallback.js).

### Design system

O site usa o **Membrane Palette**, com tokens semânticos em [`src/styles/design-tokens.css`](./src/styles/design-tokens.css) e documentação em:

- [`design-system/DESIGN-SYSTEM.md`](./design-system/DESIGN-SYSTEM.md)
- [`design-system/BRAND-VOICE.md`](./design-system/BRAND-VOICE.md)

Tipografia atual:

- **Fraunces** para títulos;
- **Instrument Sans** para interface e texto corrido;
- **JetBrains Mono** para código.

### SEO e distribuição

- meta tags e Open Graph via `astro-seo`;
- JSON-LD via `src/utils/seo.ts`;
- sitemap automático;
- RSS para o blog;
- headers de segurança e caching em [`vercel.json`](./vercel.json).

## Estrutura do Projeto

```text
Portfolio/
├── src/
│   ├── assets/               # Assets importados pelo Astro
│   ├── components/           # Componentes Astro e React reutilizáveis
│   ├── content/              # Collections blog/ e work/
│   ├── data/                 # Dados tipados para superfícies como /dev
│   ├── layouts/              # Layouts base
│   ├── pages/                # Rotas do site e endpoints
│   ├── styles/               # Tokens e CSS global
│   ├── utils/                # Helpers de SEO, busca e utilidades
│   └── content.config.ts     # Schema das collections
├── public/
│   ├── assets/               # Imagens estáticas otimizadas
│   ├── certificates/         # PDFs públicos
│   ├── llms.txt              # Guia resumido para LLMs
│   ├── llms-full.txt         # Guia estendido para LLMs
│   └── search-fallback.js    # Fallback cacheado para busca
├── design-system/            # Membrane Palette
├── docker/                   # Documentação e scripts Docker
├── .github/workflows/        # CI
├── astro.config.mjs
├── docker-compose.yml
├── docker-compose.prod.yml
├── Dockerfile
├── package.json
└── vercel.json
```

## Desenvolvimento Local

### Pré-requisitos

- **Node.js** `>=22 <25`
- **pnpm** `>=9 <11`

Instalação e uso:

```bash
pnpm install
pnpm dev
```

Site local:

- [http://localhost:4321](http://localhost:4321)

### Scripts principais

```bash
pnpm dev          # Desenvolvimento
pnpm build        # Build de produção
pnpm preview      # Preview do build
pnpm astro check  # TypeScript + content collections
pnpm check        # astro check + build
pnpm audit        # Auditoria high/critical
pnpm audit:full   # Auditoria moderate+
```

### Observação para Windows

Em máquinas Windows, `pnpm build` pode falhar com erro de symlink ao gerar `.vercel/output`. Isso acontece por restrições do sistema em torno de links simbólicos. As alternativas recomendadas são:

- habilitar **Developer Mode**;
- rodar o terminal como administrador;
- usar **WSL**;
- usar **Docker**;
- confiar no build Linux da Vercel em deploys via Git.

## Desenvolvimento com Docker

O repositório inclui ambiente Docker multi-stage para desenvolvimento e preview de produção.

### Início rápido

```powershell
.\docker.ps1 up
```

```bash
docker compose up -d
```

Comandos úteis:

```powershell
.\docker.ps1 up
.\docker.ps1 down
.\docker.ps1 logs
.\docker.ps1 check
.\docker.ps1 shell
.\docker.ps1 prod
```

```bash
make up
make down
make logs
make check
make shell
make prod
```

Documentação relacionada:

- [`docker/QUICKSTART.md`](./docker/QUICKSTART.md)
- [`docker/GUIDE.md`](./docker/GUIDE.md)
- [`docker/TROUBLESHOOTING.md`](./docker/TROUBLESHOOTING.md)
- [`docker/INDEX.md`](./docker/INDEX.md)

## Conteúdo

### Novo post de blog

Crie um arquivo em `src/content/blog/`:

```md
---
title: "Título do post"
description: "Descrição curta para SEO"
publishDate: 2026-04-02
updatedDate: 2026-04-02
tags: ["ia", "educacao", "inovacao"]
img: "/assets/blog_imgs/exemplo.webp"
img_alt: "Descrição da imagem"
---
```

### Novo trabalho

Crie um arquivo em `src/content/work/`:

```md
---
title: "Título do trabalho"
description: "Resumo do projeto"
publishDate: 2026-04-02
updatedDate: 2026-04-02
tags: ["pesquisa", "ia", "educacao"]
img: "/assets/blog_imgs/exemplo.webp"
img_alt: "Descrição da imagem"
---
```

Regras importantes:

- use caminhos absolutos em imagens, como `/assets/blog_imgs/nome.webp`;
- mantenha slugs em lowercase-hyphenated;
- valide com `pnpm astro check` antes de abrir PR;
- prefira WebP/AVIF e mantenha assets públicos abaixo de 5 MB.

## Qualidade, CI e Deploy

### CI

O workflow em [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) executa:

- `pnpm install --frozen-lockfile`
- `pnpm run audit` com `continue-on-error`
- `pnpm astro check`
- `pnpm build`

### Vercel

O deploy usa:

- `pnpm install`
- `pnpm build`
- headers de segurança globais;
- cache dedicado para `/search-data.json`, `/search-fallback.js`, `/_astro/*`, `/rss.xml` e `/favicon.svg`.

## Documentação do Repositório

- [`AGENTS.md`](./AGENTS.md): instruções para agentes e automação
- [`CLAUDE.md`](./CLAUDE.md): guia operacional para Claude Code
- [`.github/copilot-instructions.md`](./.github/copilot-instructions.md): contexto para GitHub Copilot
- [`design-system/DESIGN-SYSTEM.md`](./design-system/DESIGN-SYSTEM.md): tokens, princípios e semântica visual
- [`docker/INDEX.md`](./docker/INDEX.md): hub da documentação Docker

## Licença

O código está sob a licença MIT. Consulte [`LICENSE`](./LICENSE).

## Contato

- Website: [dcesares.dev](https://dcesares.dev)
- LinkedIn: [Isaac D'Césares](https://www.linkedin.com/in/isaacdcesares)
- GitHub: [@idcesares](https://github.com/idcesares)
- RSS: [dcesares.dev/rss.xml](https://dcesares.dev/rss.xml)

---

**Última atualização**: 2 de abril de 2026
