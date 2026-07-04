# Revisão do site (julho 2026): código, SEO, GEO e internacionalização

Análise completa do repositório `dcesares.dev` cobrindo bugs ativos, SEO técnico, otimização para motores generativos (GEO), saúde do código e um plano de internacionalização. Organizada por prioridade: o que está quebrado agora, o que rende mais para a marca, e o que é limpeza.

---

## 1. Bugs ativos (corrigir antes de qualquer coisa)

### 1.1 Imagem Open Graph padrão quebrada

`MainHead.astro` usa `/assets/favicon.svg` como `og:image` padrão. Esse arquivo não existe (o favicon vive em `/favicon.svg`), então Home, Sobre, Blog, Trabalhos, Contato, Deals e 404 apontam para um 404 no `og:image`. E mesmo corrigindo o path, SVG não é renderizado por WhatsApp, LinkedIn, X ou Slack.

**Correção:** criar uma imagem OG dedicada de 1200×630 (PNG ou JPG, com nome, tagline e identidade Membrane) em `public/assets/og-default.png` e usar como default no `MainHead`. Hoje todo compartilhamento das páginas principais sai sem imagem: é provavelmente o item de maior impacto imediato em SEO social.

### 1.2 Imagens quebradas em post do blog

`src/content/blog/website-pessoal-astro.md` referencia `/assets/blog_imgs/astro-1.png` e `/assets/blog_imgs/astro-2.png`. Os arquivos em disco são `.webp`. As duas imagens estão quebradas em produção.

### 1.3 Canonical com query string

`MainHead.astro` monta o canonical com `Astro.url.pathname + Astro.url.search`. Qualquer acesso com `?utm_source=...` gera um canonical distinto, o que dilui sinal e cria URLs duplicadas indexáveis. O canonical deve usar apenas o pathname.

### 1.4 Barra final inconsistente (conteúdo duplicado)

A configuração usa `trailingSlash: 'ignore'` com `build.format: 'file'`, e os links internos misturam os dois formatos: o Nav usa `/work`, `/blog`; conteúdo, CTAs e structured data usam `/work/`, `/blog/`. Em SSR na Vercel, `/blog/x` e `/blog/x/` respondem 200 com canonicals autorreferentes diferentes. Resultado: cada página existe em duas URLs aos olhos do Google.

**Correção:** decidir um formato (sugestão: sem barra final, que casa com `build.format: 'file'`), configurar `trailingSlash: 'never'`, unificar todos os links internos, structured data, `AUTHOR_PROFILE_PATH` e llms.txt, e adicionar redirect 308 no `vercel.json` para a variante perdedora.

### 1.5 RSS com spread de dados brutos

Em `rss.xml.js`, `...post.data` é espalhado dentro de cada item. Isso injeta `img`, `img_alt`, `publishDate`, `updatedDate` e `tags` como chaves que o `@astrojs/rss` não reconhece, e sobrescreve `title`/`description` já definidos. **Correção:** mapear campos explicitamente e converter `tags` em `categories` (que é o campo RSS válido e ajuda agregadores e LLMs a classificar o conteúdo).

### 1.6 Atributos de imagem inválidos na página Sobre

`about.astro` usa `width="auto"` (valor inválido para o atributo HTML) e não define dimensões reais na foto, o que causa layout shift. Definir `width`/`height` numéricos ou migrar para `<Image />`.

### 1.7 Tags sujas em frontmatter

O post `queimadas-pantanal-10-anos` tem nomes de arquivo como tags (`` `queimadas_pantanal_2012_2021_geojson.zip` ``). Essas tags viram `keywords` no JSON-LD e poluem o FilterBar. Há também tags quase duplicadas: "Tecnologia na Educação" vs "Tecnologias na Educação". Vale uma passada de normalização no vocabulário de tags (elas alimentam filtros, busca, keywords e RSS).

---

## 2. SEO técnico

### 2.1 Títulos sem padrão

- Home usa o `SITE_TITLE` completo (bom).
- Páginas de listagem hardcodam o sufixo: `"Blog | Isaac D'Césares"`.
- Posts e trabalhos passam só o título cru: a tag `<title>` de um post sai sem a marca.

**Correção:** centralizar o template no `MainHead` (`{title} | Isaac D'Césares` quando `title` existir, `SITE_TITLE` caso contrário) e remover os sufixos manuais das páginas. Consistência de marca em SERP e nas abas do navegador.

### 2.2 Hierarquia de headings pulada

Na home, o `Hero` renderiza `h1` e as seções seguintes usam `h3` ("Últimos trabalhos", "Últimas postagens") sem `h2` no meio. Trocar para `h2` (o estilo é controlado por classe, não pela tag). Leitores de tela e parsers de LLM usam essa hierarquia para entender a página.

### 2.3 Structured data: bom, mas dá para subir de nível

O que já existe é acima da média (WebSite, Person, BlogPosting, CreativeWork, com datas e inLanguage). Oportunidades:

- **Person mais rico:** adicionar `image` (retrato), `alumniOf` (UFRJ, Stanford etc.), `knowsAbout` (IA na educação, blockchain, aprendizagem criativa), `email` e um `@id` estável (`https://www.dcesares.dev/#person`) referenciado por todos os outros nós. Para um pesquisador, incluir ORCID/Lattes/Google Scholar no `sameAs` pesa muito em credibilidade de entidade.
- **`sameAs` incompleto:** `seo.ts` só lista LinkedIn e GitHub, mas a página de contato tem YouTube e Twitter/X. Consolidar tudo em `SOCIAL_LINKS` e emitir no schema.
- **BreadcrumbList** nas páginas de post/trabalho (Home → Blog → Post).
- **ProfilePage** no `/about/` em vez de repetir o schema do site.
- **CreativeWork é genérico** para `/work/`: itens que são palestras, cursos ou artigos ganham mais com `Event`, `Course` ou `Article`. Um campo `kind` opcional no schema da collection resolveria.

### 2.4 Sitemap sem lastmod

O `@astrojs/sitemap` está no default. Adicionar `serialize` com `lastmod` (as collections já têm `updatedDate`) ajuda crawlers a priorizar conteúdo atualizado.

### 2.5 Miudezas de head

- Falta `theme-color` e `apple-touch-icon` (só há favicon SVG).
- `X-XSS-Protection` no `vercel.json` é header morto (deprecado); pode remover.
- O RSS não declara `<language>pt-BR</language>` no canal.

### 2.6 Três camadas de analytics

GA4 (via Partytown), Vercel Web Analytics e Speed Insights rodam juntos. Além do custo de script, GA4 usa cookies e o site não tem aviso de consentimento (LGPD, com audiência majoritariamente brasileira). Vale decidir: se o Vercel Analytics atende, remover GA4 e Partytown simplifica o site e elimina a questão de consentimento; se GA4 fica, considerar consent banner.

---

## 3. GEO (otimização para motores generativos)

O site já está à frente da maioria: `llms.txt` e `llms-full.txt` existem, robots.txt libera crawlers de IA, e o conteúdo tem autoria e datas claras. Os ajustes são de manutenção e precisão:

### 3.1 llms.txt manual envelhece mal

Os dois arquivos são estáticos, com data escrita à mão ("Gerado em 2 de abril de 2026") e listas de conteúdo que já divergem do site real. A mesma técnica do `rss.xml.js` resolve: gerar `/llms.txt` (e o full) como rota Astro prerenderizada a partir das collections. Nunca mais desatualiza, e cada post novo entra sozinho.

### 3.2 robots.txt com tokens desatualizados

`Claude-Web` não é mais o user-agent da Anthropic. Atualização sugerida (todos com `Allow: /`, mantendo a postura aberta atual):

- Anthropic: `ClaudeBot`, `Claude-User`, `Claude-SearchBot`
- OpenAI: `GPTBot` (já tem), `OAI-SearchBot`, `ChatGPT-User` (já tem)
- Perplexity: `PerplexityBot`, `Perplexity-User`
- Outros relevantes: `Applebot-Extended`, `meta-externalagent`, `Amazonbot`, `Bytespider`

Uma linha de comentário apontando para `https://www.dcesares.dev/llms.txt` também ajuda (crawlers de IA leem robots.txt primeiro).

### 3.3 Sinais de entidade

GEO recompensa entidade consistente mais do que qualquer meta tag (a meta `ai-citation` atual, por exemplo, não é padrão reconhecido; inofensiva, mas sem efeito). O que move o ponteiro: o nó Person unificado com `@id` (item 2.3), `sameAs` completo com perfis acadêmicos, e o FAQ que já existe no `llms-full.txt` publicado também como conteúdo visível (por exemplo, seção de perguntas no `/about/` com schema `FAQPage`). LLMs citam o que conseguem verificar em HTML renderizado.

---

## 4. Internacionalização (o plano)

Hoje o site é pt-BR com `lang` fixo no `BaseLayout`, sem configuração de i18n e com uma exceção curiosa: `/tech-signal/` já é uma página em inglês com `html lang="en"` e hreflang próprio, fora do layout base. Há também vazamentos de inglês nas páginas PT (alt da foto da home: "Isaac D'Césares profile picture"; aria-labels do Nav: "Open search", "Close search"). Isso mostra que a demanda por inglês já existe e está sendo resolvida caso a caso.

### Recomendação: inglês como segundo locale via i18n nativo do Astro

```js
// astro.config.mjs
i18n: {
  locales: ['pt-br', 'en'],
  defaultLocale: 'pt-br',
  routing: { prefixDefaultLocale: false },
}
```

Português continua na raiz (nenhuma URL existente muda, zero perda de SEO acumulado) e o inglês nasce sob `/en/`. O plano em fases:

**Fase i18n-1: fundação.**
- Criar `src/i18n/` com dicionários de UI (`pt-br.ts`, `en.ts`): labels do Nav, títulos de seção, CTAs, aria-labels, textos do 404 e da busca. Isso também corrige os vazamentos de inglês atuais.
- `BaseLayout` recebe `lang` de `Astro.currentLocale` em vez de hardcode.
- `seo.ts` vira função por locale (SITE_TITLE, SITE_DESCRIPTION, jobTitle traduzidos).

**Fase i18n-2: páginas institucionais em inglês.**
- Traduzir primeiro o que vende a marca internacionalmente: Home, About, Dev e Contact em `/en/`. São 4 páginas de copy curta e alto valor (recrutadores, parcerias acadêmicas, comunidade open source).
- `MainHead` emite `hreflang` alternates (pt-BR, en, x-default) apenas nas páginas que têm par traduzido, e `og:locale` + `og:locale:alternate` correspondentes.
- Habilitar a opção `i18n` do `@astrojs/sitemap` para os alternates no sitemap.
- Mover `/tech-signal/` para dentro do sistema (vira `/en/tech-signal/`, com redirect), eliminando o layout paralelo.

**Fase i18n-3: conteúdo seletivo.**
- Adicionar ao schema das collections os campos opcionais `lang` (default `pt-br`) e `translationKey` (para ligar par PT/EN). Estrutura de pastas por locale (`src/content/blog/en/...`) mantém a organização limpa.
- Traduzir sob demanda, não em massa: os trabalhos e posts com apelo internacional (Papert/construcionismo, LearnChain, guias de IA). Blog do dia a dia continua PT.
- Listagens filtram por locale; RSS pode ganhar um feed `/en/rss.xml` quando houver volume.
- Atualizar `llms.txt` (gerado, ver 3.1) para declarar os dois idiomas e listar os conteúdos EN.

O que **não** fazer: subdomínio ou domínio separado (fragmenta autoridade), tradução automática em massa (contradiz a regra da voz: Claude edita, não substitui), e traduzir antes de resolver a seção 1 (hreflang em cima de canonical inconsistente multiplica o problema de URLs duplicadas).

---

## 5. Código e arquitetura

### 5.1 Stack React inteira sem uso

Não existe nenhum `client:` island no projeto e o único arquivo React (`HeroCode.tsx`) não é importado por ninguém. Podem sair do `package.json`: `@astrojs/react`, `react`, `react-dom`, `@types/react`, `@types/react-dom`, `@heroui/react`, `@heroui/button`, `@heroui/code`, `framer-motion`. São 9 dependências (HeroUI puxa dezenas de transitivas) que pesam em install, build, Dependabot e superfície de auditoria, sem renderizar um pixel. Alinhado com o anti-pattern declarado no próprio repo: "site é Astro com pouco JS; manter assim". (`astro-embed` fica: é usado nos MDX de work.)

### 5.2 Componentes duplicados e mortos

- **Mortos:** `LinkInBio.astro`, `FloatingButton.astro`, `HeroCode.tsx`. Remover.
- **Famílias duplicadas:** `Grid`/`GridEnhanced`, `PortfolioPreview`/`PortfolioPreviewEnhanced`, `PostPreview`/`PostPreviewEnhanced`. A home usa a versão simples, as listagens usam a Enhanced. Consolidar em um componente com prop `variant` reduz seis arquivos para três e elimina o risco de estilos divergirem (que é exatamente como as duas famílias nasceram).
- **Assets órfãos:** `stock-1.jpg` a `stock-4.jpg` não são referenciados. `portrait.webp` existe duplicado em `src/assets/` e `public/assets/` (a home usa um, o contato usa outro).

### 5.3 Duas fontes de verdade para tokens

`CLAUDE.md` declara `design-system/tokens/design-tokens.css` como fonte única, mas o arquivo vivo é `src/styles/design-tokens.css`, que já divergiu (tokens de glow, overlay, teal-08/12 e o bloco de fontes só existem na cópia de `src/styles`). Decidir: ou `global.css` importa direto do `design-system/` (uma cópia só), ou o `design-system/` é atualizado e documentado como espelho da spec. Hoje a regra escrita e a realidade se contradizem.

### 5.4 Imagens fora do pipeline de otimização

- A home importa o retrato e usa `Portrait.src` cru em vez de `<Image />`: perde srcset responsivo e compressão do Sharp que a config já habilita.
- As capas de posts/trabalhos são strings para `public/` no schema. Migrar para o helper `image()` do `astro:content` colocaria todas as capas no pipeline (AVIF/WebP, dimensões automáticas, sem CLS). É a maior alavanca de performance restante do site.

### 5.5 Detalhes de JS

- O `MutationObserver` do tema persiste `localStorage.theme` em qualquer mudança de classe, inclusive quando o valor veio do sistema. Na primeira visita o usuário já fica travado no tema daquele momento e para de acompanhar o SO. Persistir só quando o toggle for acionado.
- `search-fallback.js` + evento customizado `initializeSearch` é uma gambiarra de sincronização. Funciona, mas o init do SearchBox como módulo normal do Astro tende a eliminar o arquivo e o header de cache dedicado no `vercel.json`.
- Ordenar tudo por `updatedDate` significa que retocar um post antigo o joga para o topo de "Últimos trabalhos". Se for intencional, ok; senão, ordenar por `publishDate` e usar `updatedDate` só para sitemap/schema.

### 5.6 Schema das collections

`updatedDate` obrigatório força duplicar a data em todo frontmatter novo. Tornar opcional com fallback para `publishDate` (o código já faz `updatedDate ?? publishDate` em vários pontos). Adicionar `draft: z.boolean().default(false)` daria rascunhos sem gambiarra de underscore no nome do arquivo.

---

## 6. Governança do repo

- **CLAUDE.md aponta para arquivo deletado:** o `dcesares-brand-overhaul-playbook.md` foi removido no commit "Remove brand playbook", mas o CLAUDE.md inteiro ainda o trata como fonte primária ("toda sessão começa lendo o playbook"). Qualquer agente que seguir a instrução começa perdido. Atualizar o CLAUDE.md para a realidade pós-playbook.
- **Três arquivos de instrução para agentes** (CLAUDE.md, AGENTS.md, .github/copilot-instructions.md) com conteúdo sobreposto e já divergente. Sugestão: AGENTS.md como fonte única detalhada e os outros dois como resumos que apontam para ele.
- **Sete arquivos de documentação Docker** para um portfólio é peso desproporcional; um único `docker/README.md` cobre o caso de uso real.
- **CI podia pegar os bugs da seção 1:** um passo de verificação de assets (os paths `/assets/...` referenciados existem em `public/`?) teria pego as imagens quebradas do post de Astro. É um script de 10 linhas.

---

## 7. Conteúdo e marca

Os posts antigos (2024) violam as regras atuais de voz: travessões longos, "jornada digital", "crucial", "fundamental" aparecem em vários textos de `content/`. O BRAND-VOICE.md governa o site inteiro, não só copy nova. Vale uma fase editorial de retrofit nos posts de maior tráfego (sem reescrever a voz do Isaac: só remover o LLM-ês e os travessões, como o playbook original previa).

A página `/deals/` está no Nav ausente mas listada no llms.txt como navegação essencial; e `/tech-signal/` não aparece em lugar nenhum da navegação. Decidir o status de cada uma (linkar ou despriorizar) para que sitemap, llms.txt e navegação contem a mesma história.

---

## 8. Ordem sugerida de execução

| Fase | Escopo | Impacto |
|---|---|---|
| 1 | Bugs da seção 1 (OG image, imagens quebradas, canonical, trailing slash, RSS, tags) | SEO imediato |
| 2 | Remoção da stack React + componentes mortos + consolidação Enhanced | Build, manutenção |
| 3 | Structured data nível 2 (Person com @id, breadcrumbs, sameAs completo) + robots/llms.txt gerados | GEO |
| 4 | i18n fase 1 e 2 (fundação + páginas institucionais em EN) | Marca internacional |
| 5 | Imagens no pipeline (`image()` no schema), schema com draft, governança de docs | Performance, DX |
| 6 | Retrofit editorial de voz nos posts antigos + i18n fase 3 | Marca |

Cada fase cabe num PR pequeno, no padrão que o repo já pratica.
