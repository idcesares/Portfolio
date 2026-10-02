# Assessment do Portfolio — 2 de outubro de 2026

Repositório: https://github.com/idcesares/Portfolio
Commit avaliado: `c7424b9` (1 de outubro de 2026).
Site publicado: https://www.dcesares.dev/

## Parecer

O site está operacional e a base técnica passa nas verificações de tipos, conteúdo, referências de assets e build. Não está tudo resolvido: há atualizações de segurança pendentes, falha de inicialização do Analytics após consentimento, preview de produção incompatível com o adapter e ajustes de semântica editorial. Recomendo corrigir esses pontos antes de ampliar funcionalidades.

Esta revisão não alterou código da aplicação, dependências ou produção. Apenas este relatório foi adicionado à cópia local, sem commit ou push.

## Verificações e evidências

| Verificação | Resultado |
| --- | --- |
| Instalação com `corepack pnpm install --frozen-lockfile` | Passou, usando pnpm 10.33.0 e Node 24.19.0, dentro dos engines declarados |
| `corepack pnpm check` | Passou: 52 arquivos, zero erros, warnings e hints do Astro Check; assets e build concluídos |
| Build com `NODE_USE_ENV_PROXY=1 corepack pnpm build` | Passou, com fontes baixadas e sem os avisos de rede da primeira execução |
| Auditoria de dependências | 10 advisories: 5 altos, 4 moderados, 1 baixo, zero críticos |
| HTTP em produção | 50 URLs verificadas: 49 retornaram 200 após redirects; a URL inexistente proposital retornou 404 |
| URL sem barra final | `/about` redirecionou para `/about/` |
| Links internos do HTML gerado | 42 arquivos HTML analisados; nenhum destino local ausente identificado |
| Metadados no HTML gerado | Título, descrição e canonical presentes nas 42 páginas |
| Busca global em produção | Consulta “inteligência” retornou 8 resultados; Esc fechou o diálogo e devolveu foco ao botão de abertura |
| Menu mobile | Abriu e exibiu os seis links de navegação |
| Home mobile em 390 × 844 | Sem overflow horizontal e sem imagens carregadas com erro na amostra observada; screenshot inspecionado |
| Filtros do blog | Busca “antivírus” isolou o artigo correto; categoria Astro isolou o artigo sobre o framework após atualização do layout |
| Recusa de cookies | Escolha persistida; card oculto, botões sem retângulos de layout, sem recursos GA observados na página |
| Preview local | Falhou com exit 1; adapter Vercel não declara `previewEntrypoint` |

Na primeira execução do build, o fetch de fontes do Node não usou o proxy do ambiente. O build terminou com fallback tipográfico. A repetição com o suporte nativo a proxy do Node 24 resolveu o problema. Isso é uma condição deste ambiente, não evidência de falha no deploy publicado.

## Achados prioritários

### P1 — Atualizar as dependências transitivas vulneráveis

O lockfile contém:

| Pacote | Versão instalada | Versão mínima para cobrir os alertas encontrados | Caminho |
| --- | --- | --- | --- |
| `devalue` | 5.9.2 | 5.9.3 | Astro |
| `brace-expansion` | 5.0.9 | 5.0.12 | adapter Vercel → nft → glob → minimatch |
| `fast-uri` | 3.1.7 | 3.1.8 | Astro Check → language server → ajv |

Os 10 alertas se distribuem entre esses três pacotes; não são dez dependências diferentes. Os cinco alertas altos envolvem `devalue` e `brace-expansion`. Severidade do advisory não demonstra exploração no site: `brace-expansion` está na cadeia de empacotamento, `fast-uri` na ferramenta de desenvolvimento, e as páginas públicas são prerenderizadas. Ainda assim, as versões corrigidas devem entrar no próximo update.

Recomendação: atualizar pais e lockfile dentro das faixas compatíveis, conferir as versões transitivas realmente resolvidas, executar auditoria completa e `pnpm check`. Evitar tratar os overrides atuais como garantia: `devalue >=5.6.4`, por exemplo, ainda admite a versão vulnerável instalada.

Referências representativas: [devalue](https://github.com/advisories/GHSA-j22f-vq7h-c4qm), [brace-expansion](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr), [fast-uri](https://github.com/advisories/GHSA-hrr3-gc8f-f4qj).

### P2 — Ativar o Analytics na própria visita em que o consentimento é aceito

Arquivo: `src/components/CookieConsent.astro:155–171`.

Após a página estabilizar e clicar em Aceitar, o consentimento fica `granted` e `__gaLoaded` fica verdadeiro, mas o script continua `type="text/partytown"`, sem marca de processamento. Depois de recarregar com consentimento já salvo, o script aparece como `text/partytown-x`, indicando processamento. O código acrescenta o script depois da inicialização do Partytown e não emite o evento `ptupdate`, que o runtime instalado escuta para descobrir scripts novos.

Impacto: o aceite na primeira visita pode não iniciar a instrumentação até a próxima navegação/reload, reduzindo a confiabilidade das métricas. Recomendação: integrar a inserção dinâmica com o ciclo do Partytown e validar script processado e envio dos eventos, incluindo aceitar depois de vários segundos, navegar, recusar e voltar. A leitura de recursos da janela principal não comprova sozinha tráfego de workers; o achado se apoia também no estado do script e no listener do runtime.

### P2 — Corrigir o preview de produção e seu teste Docker

Arquivos: `Dockerfile:70`, `docker-compose.prod.yml`, `README.md`, `.github/workflows/docker-test.yml`.

O container de produção inicia `pnpm preview`, mas o adapter `@astrojs/vercel` instalado não oferece `previewEntrypoint`. O comando falhou localmente. A imagem copia `dist`, enquanto o artefato de deploy Vercel é `.vercel/output`. A CI Docker constrói a imagem de produção, mas não inicia esse container nem verifica seu healthcheck, permitindo que essa incompatibilidade passe despercebida.

Recomendação: definir claramente se esse ambiente deve ser uma prévia estática, um servidor Node com adapter próprio ou um preview Vercel. Alinhar comando, artefatos, documentação e healthcheck; depois adicionar à CI a inicialização efetiva do preview. O deploy Vercel público respondeu normalmente; este achado se refere ao caminho de preview local/Docker.

### P2 — Fazer a auditoria de segurança influenciar o resultado da CI

Arquivo: `.github/workflows/ci.yml:28–30`.

A auditoria high+critical usa `continue-on-error: true`. Portanto, seu resultado não impede que o job termine verde, mesmo com alertas altos. Recomendação: depois de limpar os alertas existentes, remover essa tolerância ou documentar exceções específicas e temporárias. Manter visível uma revisão periódica também dos moderados.

### P3 — Ajustar a hierarquia de títulos de cinco artigos

O template já emite o H1 da página e estes conteúdos acrescentam outro H1 no corpo:

- `src/content/work/refi-transformando-financas-para-um-futuro-sustentavel.md:17`
- `src/content/work/segredo-universitarios-ia-mercado-trabalho.md:17`
- `src/content/work/ia-personalizacao-educacao.md:16`
- `src/content/blog/guia-pratico-criar-imagens-ia.md:20`
- `src/content/blog/guia-repositorios-prompts.md:17`

Recomendação: remover o título repetido ou rebaixar o título introdutório para H2 e revisar a hierarquia seguinte. É uma melhoria de semântica e navegação por headings; não implica uma penalização automática de SEO.

## Melhorias para a rodada seguinte

- **Preferências de cookies:** oferecer uma forma visível de rever a escolha; o fluxo atual retorna imediatamente quando encontra `granted` ou `denied`. Rever também a frase “nenhum dado ... é repassado a terceiros”, já que o processamento envolve Google Analytics, para descrever corretamente a prática real.
- **Busca:** títulos e descrições são interpolados em `innerHTML` sem escape em `SearchBox.astro:357–389`. São dados editoriais do próprio repositório, portanto não foi constatada injeção por um visitante. Usar criação de nós/textContent e marks seguros evita interpretar markup introduzido em updates de conteúdo.
- **Acessibilidade e idioma:** o seletor de ordenação apareceu sem nome acessível explícito no snapshot e o toggle de tema usa texto em inglês. Dar nomes em português e considerar um link de pular para o conteúdo.
- **Robustez do armazenamento:** `MainHead`, `CookieConsent` e `ThemeToggle` acessam localStorage sem tratamento de exceção. Adotar fallback quando o navegador bloqueia armazenamento; não foi reproduzida falha em navegação normal.
- **Editorial e metadados:** há descrições extensas e alt text genérico/em inglês em posts antigos. Revisar manualmente, sem reescrever a voz do autor nem mudar URLs já publicadas.

## Updates disponíveis

O registro consultado indicou Astro 7.3.5, adapter Vercel 11.0.11, MDX 8.0.2, Partytown 2.1.8, Sharp 0.35.5, sanitize-html 2.18.0, Shiki 4.5.0 e Lucide Astro 1.50.0. Priorizar patches da plataforma e correções transitivas. Markdown-it 15 e TypeScript 7 são mudanças de major e devem ser avaliados separadamente.

Não atualizar automaticamente para o pnpm global deste ambiente (11.19.0) ou para o latest anunciado: o projeto exige pnpm 10 e fixa 10.33.0. Corepack respeitou essa configuração.

## Ordem proposta

1. Atualizar dependências compatíveis e confirmar eliminação dos advisories; endurecer a CI.
2. Corrigir e verificar o ciclo de consentimento/Analytics.
3. Reparar o caminho de preview e testar execução do container na CI.
4. Ajustar H1, nomes acessíveis, textos de consentimento e escape da busca.
5. Fazer a revisão editorial de conteúdos antigos e só então avaliar novas funcionalidades/i18n.

## Limites

Esta é uma revisão de código e smoke tests em produção, não uma certificação completa de acessibilidade, segurança ou performance. Não foram medidos Lighthouse/Core Web Vitals, inspecionados dados privados de GA/Vercel, consultados resultados históricos da CI ou testadas todas as URLs externas e embeds. Docker não foi executado; a incompatibilidade foi confirmada pelo comando local e pela configuração do adapter. As interações de navegador cobrem amostras da home e do blog, com uma passagem pelo Tech Signal, não todos os fluxos em todos os browsers.

## Primeira rodada implementada

Em 2 de outubro, após autorização para iniciar:

- Astro atualizado para 7.3.5, adapter Vercel para 11.0.11, MDX para 8.0.2 e integração Partytown para 2.1.8.
- Lockfile atualizado para `devalue` 5.9.4, `brace-expansion` 5.0.12 e `fast-uri` 3.1.8. Override de `devalue` limitado a `^5.9.3` para impedir resolução acidental da major 6.
- Auditoria completa passou, sem vulnerabilidades conhecidas, incluindo as dependências dos testes.
- A atualização do Partytown trouxe o runtime 0.14.5, cujo MutationObserver detecta scripts inseridos dinamicamente. Isso resolveu a inicialização tardia do Analytics sem acrescentar lógica ao componente.
- Teste de navegador reproduziu a falha com o runtime antigo 0.13.2 e passou com o runtime atualizado. Verifica chamadas `js` e `config` na primeira visita após aceite tardio, persistência após reload e recusa sem carregamento do Analytics. O script do Google é substituído por um test double; os testes não enviam visitas reais ao Google.
- CI agora bloqueia alertas high/critical e executa os testes de consentimento no Chromium.
- Validação final: 54 arquivos com zero erros/warnings/hints no Astro Check; assets e build aprovados; dois testes de navegador aprovados. O aviso de `NO_COLOR`/`FORCE_COLOR` é da configuração de terminal deste ambiente.

Os demais achados do assessment continuam no backlog: preview Docker, H1 duplicados, preferências/textos de cookies, escape de resultados da busca e revisão de acessibilidade/editorial. Esta primeira rodada foi preparada em branch própria para revisão antes de integrar em produção.

## Segunda rodada implementada

A primeira rodada foi integrada pelo PR #116. A continuação cobre as pendências técnicas:

- Preview local e Docker com adapter Node standalone em `dist-preview/`, separado do build Vercel. O container inicia o servidor diretamente, como usuário `node`. A CI passou a iniciar e verificar o container de preview, além de construir sua imagem.
- Smoke test de páginas, índice de busca, RSS, sitemap, 404 e imagens locais otimizadas. Build e execução do container aprovados localmente, com UID 1000.
- Cinco H1 editoriais corrigidos; as 42 páginas do site têm um único H1 no HTML gerado.
- Busca agora cria nós de texto e elementos `mark`, sem interpretar títulos/descrições como HTML. Teste com markup e event handler passou sem execução de código.
- Controle de preferências de cookies no rodapé para rever aceite/recusa. Recusar após aceitar encerra a instrumentação da visita por reload e persiste a recusa. Texto de consentimento descreve o processamento pelo Google.
- Tema e consentimento funcionam quando o armazenamento do navegador está bloqueado. O tema tem nome acessível em português; busca local e ordenação têm nomes explícitos; páginas com o layout principal oferecem link de pular para o conteúdo.
- Auditoria completa sem vulnerabilidades conhecidas. Build Vercel, build Node, checagem de assets e validação de tipos aprovados. Oito testes de navegador aprovados, cobrindo também falhas de escrita, cookies bloqueados e cookie antigo somente leitura. A recusa tem prioridade sobre aceite antigo, inclusive após reload.

O retrofit de voz editorial, revisão manual de alt text/descrições antigas, reconferência dos feeds externos e internacionalização permanecem tarefas editoriais/curadoria separadas. Esta rodada não reescreve os artigos nem altera suas URLs.
