# Instructions to AI Agents for Portfolio Website

## Visão Geral

Este é o **portfólio profissional de tecnologia educacional** do Isaac D'Césares, construído com **Astro 5 em modo SSR** e hospedado na **Vercel**. O site combina collections de conteúdo (blog/work) com busca interativa e filtragem, servindo como plataforma para mostrar pesquisas, palestras, projetos e expertise em tecnologia educacional.

**Contexto**: Site pessoal de um pesquisador e coordenador de tecnologia educacional no Sesc Nacional, com foco em inovação educacional, IA na educação e transformação digital.

**Quando usar este agente**: Para desenvolver features, corrigir bugs, adicionar conteúdo, otimizar performance, ou manter a arquitetura do portfólio. **Não-objetivos**: Mudanças que comprometam a identidade visual, performance ou acessibilidade.

## Layout do Repositório

```
├── src/
│   ├── components/          # Componentes Astro reutilizáveis (PascalCase)
│   ├── content/            # Collections (blog/, work/) com schemas Zod
│   ├── layouts/            # Layouts base (BaseLayout.astro)
│   ├── pages/              # Rotas e API endpoints (kebab-case)
│   ├── styles/             # CSS global com custom properties
│   └── utils/              # Utilitários TypeScript
├── public/
│   ├── assets/             # Imagens estáticas otimizadas
│   │   ├── blog_imgs/      # Imagens de posts do blog
│   │   └── backgrounds/    # Backgrounds responsivos
│   └── search-fallback.js  # Fallback de busca (cache 24h)
├── astro.config.mjs        # Configuração Astro + integrações
├── vercel.json             # Deploy config + headers CORS
└── tsconfig.json           # TypeScript strict mode
```

## Ambiente e Pré-requisitos

**Versões**:
- Node.js >= 18.x
- pnpm >= 8.x (package manager obrigatório)
- TypeScript strict mode habilitado

**Variáveis de Ambiente** (opcional):
- Não há secrets críticos (analytics são públicos)
- Vercel injeta automaticamente `VERCEL_URL` em production

**Dev Container**: Não configurado (desenvolvimento local padrão)

## Comandos Essenciais

**Instalação**:
```bash
pnpm install
```

**Desenvolvimento** (hot reload em http://localhost:4321):
```bash
pnpm dev
```

**Build** (SSR para Vercel):
```bash
pnpm build
```

**Preview** (testar build localmente):
```bash
pnpm preview
```

**Validação TypeScript + Content**:
```bash
pnpm astro check
```

**Checagem completa antes do commit**:
```bash
pnpm astro check && pnpm build
```

## Padrões de Código

**TypeScript**: Configuração `strict` obrigatória. Todos os componentes devem usar `interface Props { }`.

**Naming Conventions**:
- Componentes: `PascalCase.astro` (ex: `PostPreview.astro`)
- Pages: `kebab-case.astro` (ex: `about.astro`)
- Content slugs: `lowercase-hyphenated`
- Dynamic routes: `[...slug].astro` com `getStaticPaths()` e `prerender = true`

**Styling**: 
- Tailwind v4 + HeroUI components
- CSS custom properties: `var(--gray-0)`, `var(--shadow-md)`, `var(--gradient-accent-orange)`
- Utility class `stack` para layouts verticais com gaps consistentes
- Pattern `class:list={['base-class', variant]}` para variantes de componentes

**Component Variants**: Use prop `variant?: 'default' | 'compact'` em componentes como `PostPreviewEnhanced.astro` e `PortfolioPreviewEnhanced.astro`.

## Testes e Qualidade

**Validação Automática**:
- `astro check` valida TypeScript + content collections
- Build sem erros é gate obrigatório para deploy
- Vercel executa `pnpm build` automaticamente

**Content Validation**: Collections têm schemas Zod rigorosos (título, descrição, data, tags, imagem obrigatórios).

**Performance Gates**:
- Vercel Analytics monitora Core Web Vitals
- Images lazy loading obrigatório
- Search endpoint cached (5min) via `vercel.json`

## Segurança, Dados e Segredos

**Segredos**: 
- ✅ **PODE** usar analytics públicos (Google Analytics, Vercel Analytics)
- ❌ **NUNCA** commitar tokens/keys privados
- Vercel injeta variáveis de ambiente automaticamente

**Dados Sensíveis**: 
- Conteúdo é público (portfólio/blog)
- Imagens devem ser otimizadas antes do upload
- **Evitar**: Arquivos > 5MB em `public/assets/`

**Execução Segura**:
- ✅ **PODE** rodar: `pnpm dev`, `pnpm build`, `pnpm astro check`
- ❌ **EVITAR**: comandos que modifiquem `package.json` sem revisão
- ❌ **NUNCA** instalar dependências não auditadas

## Fluxo de Contribuição

**Branches**: `main` é production, features via PRs curtos.

**Commits**: Mensagens em inglês, descritivas:
```
feat: add search filtering by tags
fix: mobile navigation accessibility
docs: update content collection schema
```

**PR Checks**:
- [ ] `pnpm astro check` passa sem erros
- [ ] `pnpm build` executa com sucesso
- [ ] Novos components têm interface Props tipada
- [ ] Imagens otimizadas (WebP quando possível)
- [ ] Content segue schema das collections

## Operação e Depuração

**Desenvolvimento Local**:
```bash
pnpm dev --host 0.0.0.0    # Acesso remoto na rede
pnpm dev --port 3000        # Porta customizada
```

**Debug de Build**:
```bash
pnpm build --verbose        # Output detalhado
pnpm preview               # Testar build SSR localmente
```

**Health Checks**:
- `http://localhost:4321/` - Homepage
- `http://localhost:4321/search-data.json` - API de busca
- `http://localhost:4321/rss.xml` - Feed RSS

**Logs**: Vercel Functions logs disponíveis no dashboard para debugging de SSR.

## Áreas Sensíveis e "Gotchas"

**Content Collections**:
- ❌ **ERRO COMUM**: Esquecer campos obrigatórios (title, description, publishDate, tags, img)
- ✅ **SOLUÇÃO**: Sempre validar com `pnpm astro check` antes do commit

**Caching**:
- `/search-data.json` cached por 5min (definido em `vercel.json`)
- Build time cache pode causar stale content - limpar `.astro/` se necessário

**Images**:
- ❌ **ERRO**: Referencias relativas em markdown (ex: `./image.jpg`)
- ✅ **CORRETO**: Paths absolutos (ex: `/assets/blog_imgs/image.webp`)
- Usar `loading="lazy" decoding="async"` obrigatoriamente

**Dynamic Routes**:
- Sempre implementar `getStaticPaths()` com `prerender = true`
- Slugs devem seguir padrão `lowercase-hyphenated`

## Content Management

**Blog Posts** (`src/content/blog/`):
```yaml
# Frontmatter obrigatório
title: "Título em Português"
description: "Descrição SEO (150-160 chars)"
publishDate: 2025-01-15
tags: ["ai", "educacao", "inovacao"]
img: "/assets/blog_imgs/nome-otimizado.webp"
img_alt: "Alt text descritivo"
```

**Work Portfolio** (`src/content/work/`):
- Schema idêntico ao blog
- Foco em projetos profissionais e pesquisas
- Usar tags técnicas relevantes

**Search System**:
- Endpoint `/search-data.json` gera dados para Fuse.js
- Filtros por tags, termo de busca, ordenação (newest/oldest/alphabetical)
- Client-side JS usa `data-filterable-item` attributes

## Performance e SEO

**Core Web Vitals**: Monitorados via Vercel Analytics + Speed Insights.

**Image Optimization**: Astro Image Service otimiza automaticamente. Preferir WebP/AVIF.

**Bundle Size**: Tailwind purged automaticamente, componentes tree-shaken.

**SEO**: 
- Meta tags via `astro-seo`
- Sitemap auto-gerado
- RSS feed em `/rss.xml`
- JSON-LD structured data (quando aplicável)

## Deploy e CI/CD

**Vercel Integration**:
- Deploy automático via Git push
- Edge Functions para SSR
- Analytics + Speed Insights habilitados
- Custom headers para CORS (search endpoint)

**Build Process**:
1. `pnpm install` (ignoredBuiltDependencies: esbuild)
2. `pnpm build` (output: server, format: file)
3. Deploy para Edge Runtime

**Environment**:
- Production: https://dcesares.dev
- Preview: URLs automáticos via Vercel PRs

## Licença, Contato e Atualização

**Licença**: Veja `LICENSE` (conteúdo pessoal, código open source típico)

**Contato**: 
- Maintainer: Isaac D'Césares (@idcesares)
- Issues: GitHub Issues neste repositório
- Email: Disponível no site/perfil

**Atualização deste arquivo**: 
- Revisar quando há mudanças na arquitetura
- Manter sincronizado com `README.md` 
- PRs que alteram workflow devem atualizar seções relevantes

_Atualizado em: 23/09/2025 — Este `AGENTS.md` é documentação viva; mantenha-o coeso com README/CI._